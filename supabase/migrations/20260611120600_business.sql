-- =============================================================================
-- Business-completeness migration:
--   1. nurseries.sponsored — promoted listings (parent app ranks them first).
--   2. attendance.pickup_code_hash — server-issued pickup pass (QR-lite): the
--      parent gets a short code from the qr-pass function; the nursery verifies
--      it at drop-off/pickup. Only the hash is stored.
--   3. Monthly renewals: cron job that, on the 1st, creates a pending invoice +
--      notification for every active monthly booking (gateway charge later).
--   4. Foundations for closed-days calendar and waitlist (schema + RLS; UI later).
-- =============================================================================

alter table nurseries add column if not exists sponsored boolean not null default false;
alter table attendance add column if not exists pickup_code_hash text;

-- ---- (4a) closed days --------------------------------------------------------
create table if not exists nursery_closed_days (
  id         uuid primary key default gen_random_uuid(),
  nursery_id uuid not null references nurseries(id) on delete cascade,
  date       date not null,
  reason     text default '',
  unique (nursery_id, date)
);
alter table nursery_closed_days enable row level security;
create policy "owner manages closed days" on nursery_closed_days for all
  using (owns_nursery(nursery_id)) with check (owns_nursery(nursery_id));
create policy "public reads closed days" on nursery_closed_days for select using (true);

-- ---- (4b) waitlist ------------------------------------------------------------
create table if not exists waitlist_entries (
  id         uuid primary key default gen_random_uuid(),
  nursery_id uuid not null references nurseries(id) on delete cascade,
  parent_id  uuid not null references profiles(id) on delete cascade,
  child_id   uuid not null references children(id) on delete cascade,
  group_     age_group,
  status     text not null default 'waiting' check (status in ('waiting','offered','expired','withdrawn')),
  created_at timestamptz not null default now(),
  unique (nursery_id, child_id)
);
alter table waitlist_entries enable row level security;
create policy "parent manages own waitlist" on waitlist_entries for all
  using (parent_id = auth.uid()) with check (parent_id = auth.uid());
create policy "nursery reads its waitlist" on waitlist_entries for select
  using (owns_nursery(nursery_id));

-- ---- (3) monthly renewals -----------------------------------------------------
-- For each active/confirmed monthly booking, open a pending invoice for the new
-- period and notify the parent. Idempotent per (booking, month).
create or replace function public.create_monthly_renewals()
returns integer language plpgsql security definer set search_path = public as $$
declare n integer := 0; rec record; period text;
begin
  period := to_char(now(), 'YYYY-MM');
  for rec in
    select b.id, b.parent_id, b.nursery_id, b.price
    from bookings b
    where b.type = 'monthly' and b.status in ('confirmed','active')
      and not exists (
        select 1 from invoices i
        where i.booking_id = b.id and to_char(i.created_at, 'YYYY-MM') = period
      )
  loop
    insert into invoices (booking_id, parent_id, nursery_id, amount, status, due_date)
    values (rec.id, rec.parent_id, rec.nursery_id, rec.price, 'pending',
            (date_trunc('month', now()) + interval '4 days')::date);
    insert into notifications (recipient_id, kind, title, body, target)
    values (rec.parent_id, 'payment', 'Monthly renewal due',
            'Your monthly nursery subscription has renewed — payment is due.', 'bookings');
    n := n + 1;
  end loop;
  return n;
end $$;

do $$
begin
  if exists (select 1 from pg_extension where extname = 'pg_cron') then
    perform cron.schedule('monthly-renewals', '0 3 1 * *',
      $cron$ select public.create_monthly_renewals(); $cron$);
  end if;
end $$;
