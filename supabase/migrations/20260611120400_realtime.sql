-- =============================================================================
-- Enable Realtime (postgres_changes) on the tables the apps subscribe to.
-- Idempotent and guarded: only runs where the supabase_realtime publication
-- exists (Supabase), and skips tables already in it. No-op on plain Postgres/CI.
-- RLS still governs which rows each subscriber receives.
-- =============================================================================
do $$
declare t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array[
      'booking_requests', 'attendance', 'messages', 'notifications', 'bookings'
    ] loop
      if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
      ) then
        execute format('alter publication supabase_realtime add table public.%I', t);
      end if;
    end loop;
  else
    raise notice 'supabase_realtime publication not found — skipping (fine for local/CI)';
  end if;
end $$;
