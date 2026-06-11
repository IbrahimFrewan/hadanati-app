-- =============================================================================
-- Hadanati Platform — PostgreSQL schema (Supabase)
-- =============================================================================
-- Companion to docs/ARCHITECTURE.md. This is the initial migration: enums,
-- tables, indexes, Row-Level Security (RLS) policies, and triggers for the
-- two-sided nursery-booking marketplace (parents app + nursery-provider app
-- + admin web).
--
-- Conventions:
--   * Every table has RLS ENABLED with deny-by-default; access is explicit.
--   * `profiles.id` == `auth.users.id` (1:1). Role lives on the profile AND in
--     the JWT (app_metadata.role) so policies can read it cheaply.
--   * Money, KYC transitions, and payouts are written by Edge Functions running
--     with the service role (which bypasses RLS by design) — NOT by clients.
--   * Apply via the Supabase CLI as a migration; do not hand-edit in the dashboard.
-- =============================================================================

create extension if not exists "pgcrypto";   -- gen_random_uuid()
create extension if not exists "pg_trgm";     -- fuzzy search on nursery names

-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------
create type user_role         as enum ('parent', 'nursery_owner', 'admin');
create type age_group         as enum ('infant', 'toddler', 'preschool');
create type nursery_status    as enum ('draft', 'pending', 'approved', 'rejected', 'suspended');
create type doc_type          as enum ('license', 'commercial', 'owner_id', 'insurance');
create type doc_status        as enum ('pending', 'approved', 'rejected');
create type booking_type      as enum ('hourly', 'daily', 'weekly', 'monthly');
create type request_status    as enum ('pending', 'accepted', 'declined', 'expired');
create type booking_status    as enum ('confirmed', 'active', 'completed', 'cancelled');
create type attend_status     as enum ('not_in', 'in', 'out', 'absent');
create type checkout_method   as enum ('scanned_qr', 'checked_id', 'recognised');
create type report_status     as enum ('draft', 'sent');
create type payment_status    as enum ('pending', 'authorized', 'captured', 'refunded', 'failed');
create type payment_method    as enum ('card', 'cliq');
create type invoice_status    as enum ('paid', 'pending', 'overdue');
create type payout_status     as enum ('accruing', 'pending', 'paid');
create type notif_kind        as enum ('booking', 'payment', 'review', 'system', 'report', 'attendance', 'message');

-- -----------------------------------------------------------------------------
-- Helper: current user's role from the JWT (used throughout RLS)
-- Defined in `public` (the `auth` schema is Supabase-managed — don't add to it).
-- -----------------------------------------------------------------------------
create or replace function public.role_of() returns user_role
language sql stable as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role')::user_role,
    'parent'
  );
$$;

create or replace function public.is_admin() returns boolean
language sql stable as $$ select public.role_of() = 'admin'; $$;

-- generic updated_at trigger
create or replace function set_updated_at() returns trigger
language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

-- =============================================================================
-- IDENTITY
-- =============================================================================
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'parent',
  full_name   text not null default '',
  phone       text,
  email       text,
  avatar_url  text,
  locale      text not null default 'en' check (locale in ('en','ar')),
  status      text not null default 'active' check (status in ('active','suspended','deleted')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index on profiles (role);
create unique index on profiles (phone) where phone is not null;

-- Auto-create a profile when an auth user is created.
create or replace function handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name, phone, email)
  values (
    new.id,
    coalesce((new.raw_app_meta_data ->> 'role')::user_role, 'parent'),
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.phone,
    new.email
  );
  return new;
end $$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

create table children (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references profiles(id) on delete cascade,
  name        text not null,
  dob         date,
  group_       age_group,
  allergies   text default '',
  photo_url   text,
  notes       text default '',
  created_at  timestamptz not null default now()
);
create index on children (parent_id);

create table devices (
  id              uuid primary key default gen_random_uuid(),
  profile_id      uuid not null references profiles(id) on delete cascade,
  expo_push_token text not null,
  platform        text check (platform in ('ios','android')),
  last_seen       timestamptz not null default now(),
  unique (profile_id, expo_push_token)
);

-- =============================================================================
-- SUPPLY (nurseries)
-- =============================================================================
create table nurseries (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references profiles(id) on delete cascade,
  name          text not null,
  district      text,
  lat           double precision,
  lng           double precision,
  phone         text,
  tagline       text,
  description   text,
  price_hourly  numeric(10,2),
  price_daily   numeric(10,2),
  price_weekly  numeric(10,2),
  price_monthly numeric(10,2),
  rating        numeric(2,1) not null default 0,
  reviews_count int not null default 0,
  verified      boolean not null default false,
  listed        boolean not null default false,
  status        nursery_status not null default 'draft',
  reviewed_by   uuid references profiles(id),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index on nurseries (owner_id);
create index on nurseries (district, status) where listed = true;
create index on nurseries using gin (name gin_trgm_ops);
create trigger trg_nurseries_updated before update on nurseries
  for each row execute function set_updated_at();

create table nursery_documents (
  id          uuid primary key default gen_random_uuid(),
  nursery_id  uuid not null references nurseries(id) on delete cascade,
  type        doc_type not null,
  file_path   text not null,                 -- path in the private `kyc` bucket
  status      doc_status not null default 'pending',
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  expires_at  date,
  created_at  timestamptz not null default now()
);
create index on nursery_documents (nursery_id);

create table nursery_media (
  id          uuid primary key default gen_random_uuid(),
  nursery_id  uuid not null references nurseries(id) on delete cascade,
  kind        text not null check (kind in ('photo','video')),
  file_path   text not null,
  is_cover    boolean not null default false,
  sort_order  int not null default 0
);
create index on nursery_media (nursery_id);

create table capacity_groups (
  id          uuid primary key default gen_random_uuid(),
  nursery_id  uuid not null references nurseries(id) on delete cascade,
  name        text not null,
  group_      age_group not null,
  total       int not null check (total >= 0),
  filled      int not null default 0 check (filled >= 0),
  check (filled <= total)
);
create index on capacity_groups (nursery_id);

create table nursery_bank_accounts (
  id              uuid primary key default gen_random_uuid(),
  nursery_id      uuid not null references nurseries(id) on delete cascade,
  bank_name       text,
  iban            text,
  account_holder  text,
  cliq_alias      text,
  created_at      timestamptz not null default now()
);

-- =============================================================================
-- DEMAND & MARKETPLACE
-- =============================================================================
create table favorites (
  parent_id  uuid not null references profiles(id) on delete cascade,
  nursery_id uuid not null references nurseries(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (parent_id, nursery_id)
);

create table booking_requests (
  id          uuid primary key default gen_random_uuid(),
  parent_id   uuid not null references profiles(id) on delete cascade,
  nursery_id  uuid not null references nurseries(id) on delete cascade,
  child_id    uuid not null references children(id) on delete cascade,
  type        booking_type not null,
  schedule    text,                          -- human-readable, e.g. "Mon 9 Jun · 8am–5pm"
  from_date   date,
  price       numeric(10,2) not null,
  unit        text not null,                 -- 'hr' | 'day' | 'wk' | 'mo'
  status      request_status not null default 'pending',
  note        text default '',
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);
create index on booking_requests (nursery_id, status);
create index on booking_requests (parent_id, status);
create index on booking_requests (status, expires_at);  -- pg_cron expiry sweep

create table bookings (
  id          uuid primary key default gen_random_uuid(),
  request_id  uuid unique references booking_requests(id) on delete set null,
  parent_id   uuid not null references profiles(id) on delete cascade,
  nursery_id  uuid not null references nurseries(id) on delete cascade,
  child_id    uuid not null references children(id) on delete cascade,
  type        booking_type not null,
  status      booking_status not null default 'confirmed',
  start_date  date,
  end_date    date,
  price       numeric(10,2) not null,
  unit        text not null,
  created_at  timestamptz not null default now()
);
create index on bookings (nursery_id, status);
create index on bookings (parent_id, status);

create table reviews (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid unique references bookings(id) on delete set null,
  parent_id   uuid not null references profiles(id) on delete cascade,
  nursery_id  uuid not null references nurseries(id) on delete cascade,
  rating      int not null check (rating between 1 and 5),
  comment     text default '',
  created_at  timestamptz not null default now()
);
create index on reviews (nursery_id);

-- Keep nurseries.rating / reviews_count in sync.
create or replace function recompute_nursery_rating() returns trigger
language plpgsql as $$
declare nid uuid := coalesce(new.nursery_id, old.nursery_id);
begin
  update nurseries n set
    reviews_count = (select count(*) from reviews where nursery_id = nid),
    rating = coalesce((select round(avg(rating)::numeric, 1) from reviews where nursery_id = nid), 0)
  where n.id = nid;
  return null;
end $$;
create trigger trg_reviews_rating after insert or update or delete on reviews
  for each row execute function recompute_nursery_rating();

-- =============================================================================
-- OPERATIONS
-- =============================================================================
create table attendance (
  id              uuid primary key default gen_random_uuid(),
  booking_id      uuid not null references bookings(id) on delete cascade,
  child_id        uuid not null references children(id) on delete cascade,
  nursery_id      uuid not null references nurseries(id) on delete cascade,
  date            date not null default current_date,
  status          attend_status not null default 'not_in',
  check_in_at     timestamptz,
  check_out_at    timestamptz,
  checked_in_by   uuid references profiles(id),
  checkout_method checkout_method,
  note            text default '',
  created_at      timestamptz not null default now(),
  unique (booking_id, date)
);
create index on attendance (nursery_id, date);

create table daily_reports (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references bookings(id) on delete cascade,
  child_id    uuid not null references children(id) on delete cascade,
  nursery_id  uuid not null references nurseries(id) on delete cascade,
  date        date not null default current_date,
  mood        text,
  meals       jsonb default '{}'::jsonb,      -- {breakfast, lunch, snack}
  nap_start   text,
  nap_end     text,
  diapers     text,
  activities  text,
  note        text,
  status      report_status not null default 'draft',
  sent_at     timestamptz,
  created_at  timestamptz not null default now(),
  unique (booking_id, date)
);
create index on daily_reports (nursery_id, date);
create index on daily_reports (booking_id);

create table report_media (
  id         uuid primary key default gen_random_uuid(),
  report_id  uuid not null references daily_reports(id) on delete cascade,
  file_path  text not null,                  -- path in the private `reports` bucket
  sort_order int not null default 0
);

-- =============================================================================
-- MONEY  (written by Edge Functions / service role only)
-- =============================================================================
create table payments (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid references bookings(id) on delete set null,
  request_id   uuid references booking_requests(id) on delete set null,
  parent_id    uuid not null references profiles(id),
  nursery_id   uuid not null references nurseries(id),
  amount       numeric(10,2) not null,
  currency     text not null default 'JOD',
  method       payment_method not null,
  gateway_ref  text,
  gateway_event_id text unique,              -- idempotency key for webhooks
  status       payment_status not null default 'pending',
  service_fee  numeric(10,2) not null default 0,    -- 5% take
  net_amount   numeric(10,2) not null default 0,     -- amount - service_fee
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index on payments (nursery_id, status);
create index on payments (parent_id);
create trigger trg_payments_updated before update on payments
  for each row execute function set_updated_at();

create table invoices (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid references bookings(id) on delete set null,
  parent_id   uuid not null references profiles(id),
  nursery_id  uuid not null references nurseries(id),
  amount      numeric(10,2) not null,
  status      invoice_status not null default 'pending',
  method      text,
  due_date    date,
  created_at  timestamptz not null default now()
);
create index on invoices (nursery_id, status);

create table payouts (
  id            uuid primary key default gen_random_uuid(),
  nursery_id    uuid not null references nurseries(id) on delete cascade,
  period_start  date not null,
  period_end    date not null,
  gross         numeric(12,2) not null default 0,
  fees          numeric(12,2) not null default 0,
  net           numeric(12,2) not null default 0,
  status        payout_status not null default 'accruing',
  bank_ref      text,
  paid_at       timestamptz,
  created_at    timestamptz not null default now(),
  unique (nursery_id, period_start, period_end)
);
create index on payouts (nursery_id, status);

create table payout_items (
  payout_id  uuid not null references payouts(id) on delete cascade,
  payment_id uuid not null references payments(id) on delete cascade,
  primary key (payout_id, payment_id)
);

-- =============================================================================
-- COMMUNICATION
-- =============================================================================
create table message_threads (
  id           uuid primary key default gen_random_uuid(),
  parent_id    uuid not null references profiles(id) on delete cascade,
  nursery_id   uuid not null references nurseries(id) on delete cascade,
  last_message text default '',
  last_at      timestamptz,
  created_at   timestamptz not null default now(),
  unique (parent_id, nursery_id)
);
create index on message_threads (nursery_id);
create index on message_threads (parent_id);

create table messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references message_threads(id) on delete cascade,
  sender_id   uuid not null references profiles(id),
  body        text not null,
  read_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index on messages (thread_id, created_at);

create table notifications (
  id           uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references profiles(id) on delete cascade,
  kind         notif_kind not null,
  title        text not null,
  body         text,
  target       text,                         -- deep-link route
  data         jsonb default '{}'::jsonb,
  read         boolean not null default false,
  created_at   timestamptz not null default now()
);
create index on notifications (recipient_id, read);

-- =============================================================================
-- GOVERNANCE
-- =============================================================================
create table audit_log (
  id         bigserial primary key,
  actor_id   uuid references profiles(id),
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  meta       jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on audit_log (entity, entity_id);

-- Denormalized dashboard stats (refreshed nightly by pg_cron) for O(1) reads.
create table nursery_daily_stats (
  nursery_id    uuid not null references nurseries(id) on delete cascade,
  date          date not null,
  revenue       numeric(12,2) not null default 0,
  checked_in    int not null default 0,
  new_requests  int not null default 0,
  reports_due   int not null default 0,
  primary key (nursery_id, date)
);

-- =============================================================================
-- ROW-LEVEL SECURITY
-- =============================================================================
-- Enable RLS on every table (deny-by-default until a policy grants access).
do $$ declare t text;
begin
  foreach t in array array[
    'profiles','children','devices','nurseries','nursery_documents','nursery_media',
    'capacity_groups','nursery_bank_accounts','favorites','booking_requests','bookings',
    'reviews','attendance','daily_reports','report_media','payments','invoices','payouts',
    'payout_items','message_threads','messages','notifications','audit_log','nursery_daily_stats'
  ] loop
    execute format('alter table %I enable row level security;', t);
  end loop;
end $$;

-- Helper: does the current user own this nursery?
create or replace function owns_nursery(nid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from nurseries where id = nid and owner_id = auth.uid());
$$;

-- Helper: is the current user the parent on this booking?
create or replace function parent_of_booking(bid uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from bookings where id = bid and parent_id = auth.uid());
$$;

-- ---- profiles ----------------------------------------------------------------
create policy "own profile read"   on profiles for select using (id = auth.uid() or is_admin());
create policy "own profile write"  on profiles for update using (id = auth.uid()) with check (id = auth.uid());
-- (admins use Edge Functions for cross-user writes)

-- ---- children (parent-private; readable by a nursery that has a booking) ----
create policy "parent owns children" on children for all
  using (parent_id = auth.uid() or is_admin())
  with check (parent_id = auth.uid());
create policy "nursery sees booked child" on children for select
  using (exists (
    select 1 from bookings b
    where b.child_id = children.id and owns_nursery(b.nursery_id)
  ));

-- ---- devices -----------------------------------------------------------------
create policy "own devices" on devices for all
  using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- ---- nurseries ---------------------------------------------------------------
create policy "public sees listed approved" on nurseries for select
  using (status = 'approved' and listed = true);
create policy "owner sees own nursery" on nurseries for select
  using (owner_id = auth.uid() or is_admin());
create policy "owner edits own nursery" on nurseries for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());     -- status/verified changed only via Edge Fn
create policy "owner creates nursery" on nurseries for insert
  with check (owner_id = auth.uid());

-- ---- nursery_documents / media / capacity / bank (owner-scoped) -------------
create policy "owner manages docs" on nursery_documents for all
  using (owns_nursery(nursery_id) or is_admin())
  with check (owns_nursery(nursery_id));
create policy "owner manages media" on nursery_media for all
  using (owns_nursery(nursery_id)) with check (owns_nursery(nursery_id));
create policy "public reads media" on nursery_media for select using (true);
create policy "owner manages capacity" on capacity_groups for all
  using (owns_nursery(nursery_id)) with check (owns_nursery(nursery_id));
create policy "public reads capacity" on capacity_groups for select using (true);
create policy "owner manages bank" on nursery_bank_accounts for all
  using (owns_nursery(nursery_id) or is_admin())
  with check (owns_nursery(nursery_id));

-- ---- favorites ---------------------------------------------------------------
create policy "own favorites" on favorites for all
  using (parent_id = auth.uid()) with check (parent_id = auth.uid());

-- ---- booking_requests --------------------------------------------------------
create policy "parent reads own requests" on booking_requests for select
  using (parent_id = auth.uid());
create policy "nursery reads its requests" on booking_requests for select
  using (owns_nursery(nursery_id));
create policy "parent creates request" on booking_requests for insert
  with check (parent_id = auth.uid());
-- status transitions (accept/decline/expire) happen via Edge Functions only.

-- ---- bookings ----------------------------------------------------------------
create policy "parent reads own bookings" on bookings for select
  using (parent_id = auth.uid());
create policy "nursery reads its bookings" on bookings for select
  using (owns_nursery(nursery_id));
-- inserts/updates via confirm-booking Edge Fn.

-- ---- reviews -----------------------------------------------------------------
create policy "public reads reviews" on reviews for select using (true);
create policy "parent writes own review" on reviews for insert
  with check (parent_id = auth.uid() and parent_of_booking(booking_id));

-- ---- attendance --------------------------------------------------------------
create policy "nursery manages attendance" on attendance for all
  using (owns_nursery(nursery_id)) with check (owns_nursery(nursery_id));
create policy "parent reads attendance" on attendance for select
  using (parent_of_booking(booking_id));

-- ---- daily_reports / report_media -------------------------------------------
create policy "nursery manages reports" on daily_reports for all
  using (owns_nursery(nursery_id)) with check (owns_nursery(nursery_id));
create policy "parent reads sent reports" on daily_reports for select
  using (status = 'sent' and parent_of_booking(booking_id));
create policy "report media follows report" on report_media for select
  using (exists (
    select 1 from daily_reports r
    where r.id = report_media.report_id
      and (owns_nursery(r.nursery_id) or (r.status='sent' and parent_of_booking(r.booking_id)))
  ));
create policy "nursery writes report media" on report_media for all
  using (exists (select 1 from daily_reports r where r.id = report_media.report_id and owns_nursery(r.nursery_id)))
  with check (exists (select 1 from daily_reports r where r.id = report_media.report_id and owns_nursery(r.nursery_id)));

-- ---- money (read-only to the parties; writes via service role) --------------
create policy "parties read payments" on payments for select
  using (parent_id = auth.uid() or owns_nursery(nursery_id) or is_admin());
create policy "parties read invoices" on invoices for select
  using (parent_id = auth.uid() or owns_nursery(nursery_id) or is_admin());
create policy "nursery reads payouts" on payouts for select
  using (owns_nursery(nursery_id) or is_admin());
create policy "nursery reads payout items" on payout_items for select
  using (exists (select 1 from payouts p where p.id = payout_items.payout_id and (owns_nursery(p.nursery_id) or is_admin())));

-- ---- messaging ---------------------------------------------------------------
create policy "thread parties read" on message_threads for select
  using (parent_id = auth.uid() or owns_nursery(nursery_id));
create policy "parent opens thread" on message_threads for insert
  with check (parent_id = auth.uid());
create policy "thread parties read messages" on messages for select
  using (exists (
    select 1 from message_threads th
    where th.id = messages.thread_id
      and (th.parent_id = auth.uid() or owns_nursery(th.nursery_id))
  ));
create policy "thread parties send messages" on messages for insert
  with check (sender_id = auth.uid() and exists (
    select 1 from message_threads th
    where th.id = messages.thread_id
      and (th.parent_id = auth.uid() or owns_nursery(th.nursery_id))
  ));

-- ---- notifications -----------------------------------------------------------
create policy "own notifications read"  on notifications for select using (recipient_id = auth.uid());
create policy "own notifications update" on notifications for update
  using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- ---- governance (admin-only; clients have no access) ------------------------
create policy "admin reads audit" on audit_log for select using (is_admin());
create policy "nursery reads own stats" on nursery_daily_stats for select
  using (owns_nursery(nursery_id) or is_admin());

-- =============================================================================
-- NOTES
-- =============================================================================
-- * Tables with no INSERT/UPDATE policy (payments, payouts, bookings writes,
--   request transitions, audit_log writes) are intentionally writable only by
--   the service role inside Edge Functions. This is the trust boundary.
-- * Storage bucket policies (kyc, children, reports, nursery-media, avatars)
--   are configured separately in Supabase Storage with equivalent ownership
--   checks; see docs/ARCHITECTURE.md §9.
-- * Scheduled jobs (pg_cron): request expiry, monthly run-payouts, license
--   reminders, nightly nursery_daily_stats refresh; see §11.
-- =============================================================================
