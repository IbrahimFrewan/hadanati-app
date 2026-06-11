-- =============================================================================
-- Cross-layer audit fixes (apps <-> admin <-> functions <-> schema):
--   1. Drop the table-level CHECK (filled <= total) on capacity_groups.
--      `filled` is DERIVED data recomputed by the sync_capacity trigger; the
--      constraint made every booking write fail for a nursery whenever a group
--      went over (accept beyond capacity, or owner lowering `total`). Capacity
--      is now enforced at accept time inside the respond-request function.
--      (The column-level checks total >= 0 / filled >= 0 are kept.)
--   2. Admins could not read bookings / booking_requests (no RLS policy), so
--      the admin Bookings page was always empty. Add read-only admin policies.
-- =============================================================================

-- ---- (1) drop the derived-data check constraint (found by definition) -------
do $$
declare cname text;
begin
  select conname into cname
  from pg_constraint
  where conrelid = 'public.capacity_groups'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%filled%<=%total%';
  if cname is not null then
    execute format('alter table public.capacity_groups drop constraint %I', cname);
    raise notice 'dropped constraint % on capacity_groups', cname;
  end if;
end $$;

-- ---- (2) admin read access for oversight/disputes ----------------------------
drop policy if exists "admin reads bookings" on bookings;
create policy "admin reads bookings" on bookings for select using (is_admin());

drop policy if exists "admin reads requests" on booking_requests;
create policy "admin reads requests" on booking_requests for select using (is_admin());
