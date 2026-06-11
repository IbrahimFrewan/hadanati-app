-- =============================================================================
-- Logic fixes & scheduled jobs (closes the gaps found in review):
--   * capacity_groups.filled is now kept in sync automatically by a trigger.
--   * stale booking_requests are auto-expired (+ refunded) on a schedule.
--   * monthly payouts run on a schedule.
-- pg_cron is only present on Supabase; everything is guarded so this migration
-- still applies on a plain Postgres (e.g. CI validation).
-- =============================================================================

-- ---- (1) Keep capacity_groups.filled accurate -------------------------------
-- Recompute the affected nursery's group counts from active bookings whenever
-- a booking row changes. Recompute (vs +/-1) is race-safe and self-healing.
create or replace function public.sync_capacity()
returns trigger language plpgsql security definer set search_path = public as $$
declare nrs uuid;
begin
  nrs := coalesce(new.nursery_id, old.nursery_id);
  update capacity_groups cg set filled = (
    select count(*)
    from bookings b
    join children c on c.id = b.child_id
    where b.nursery_id = cg.nursery_id
      and c.group_ = cg.group_
      and b.status in ('confirmed', 'active')
  )
  where cg.nursery_id = nrs;
  return null;
end $$;

drop trigger if exists trg_sync_capacity on bookings;
create trigger trg_sync_capacity
  after insert or update or delete on bookings
  for each row execute function public.sync_capacity();

-- ---- (2) Auto-expire stale pending requests (+ refund) -----------------------
create or replace function public.expire_stale_requests()
returns integer language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  with expired as (
    update booking_requests
       set status = 'expired'
     where status = 'pending' and expires_at < now()
    returning id
  )
  update payments
     set status = 'refunded'
   where request_id in (select id from expired)
     and status in ('authorized', 'pending');
  get diagnostics n = row_count;
  return n;
end $$;

-- ---- (3) Monthly payout aggregation (SQL twin of the run-payouts function) ---
-- Aggregates the period's captured payments per nursery into a payouts row and
-- links each payment via payout_items. Idempotent (skips already-assigned
-- payments; upserts the payout). The Edge Function remains for manual admin runs.
create or replace function public.run_monthly_payouts(p_start date default null, p_end date default null)
returns integer language plpgsql security definer set search_path = public as $$
declare s date; e date; cnt integer := 0; rec record;
begin
  s := coalesce(p_start, (date_trunc('month', now()) - interval '1 month')::date);
  e := coalesce(p_end,   (date_trunc('month', now()) - interval '1 day')::date);

  for rec in
    select nursery_id,
           sum(amount)      as gross,
           sum(service_fee) as fees,
           sum(net_amount)  as net
    from payments
    where status = 'captured'
      and created_at >= s and created_at < (e + 1)
      and id not in (select payment_id from payout_items)
    group by nursery_id
  loop
    insert into payouts (nursery_id, period_start, period_end, gross, fees, net, status)
    values (rec.nursery_id, s, e, rec.gross, rec.fees, rec.net, 'pending')
    on conflict (nursery_id, period_start, period_end)
      do update set gross = excluded.gross, fees = excluded.fees, net = excluded.net;

    insert into payout_items (payout_id, payment_id)
    select po.id, pay.id
    from payouts po
    join payments pay
      on pay.nursery_id = rec.nursery_id
     and pay.status = 'captured'
     and pay.created_at >= s and pay.created_at < (e + 1)
     and pay.id not in (select payment_id from payout_items)
    where po.nursery_id = rec.nursery_id and po.period_start = s and po.period_end = e;

    cnt := cnt + 1;
  end loop;
  return cnt;
end $$;

-- ---- (4) Schedule the jobs (only where pg_cron is available) -----------------
do $$
begin
  create extension if not exists pg_cron;
exception when others then
  raise notice 'pg_cron not available — skipping job scheduling (fine for local/CI)';
end $$;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    -- every 5 minutes: expire stale requests
    perform cron.schedule('expire-stale-requests', '*/5 * * * *',
      $cron$ select public.expire_stale_requests(); $cron$);
    -- 02:00 on the 1st of each month: build payouts for the previous month
    perform cron.schedule('monthly-payouts', '0 2 1 * *',
      $cron$ select public.run_monthly_payouts(); $cron$);
  end if;
end $$;
