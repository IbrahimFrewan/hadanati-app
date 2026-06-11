# Hadanati Supabase backend

The deployable backend: database schema (migrations), storage buckets, seed
data, and Edge Functions. See `../docs/ARCHITECTURE.md` for the full design.

## Prerequisites
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker (for the local stack)

## Local development

```bash
supabase start            # boots Postgres + Auth + Storage + Studio locally
supabase db reset         # applies migrations/ then seed.sql
```

`db reset` runs every file in `migrations/` in order, then `seed.sql` (demo
admin, a pending nursery for the verification queue, sample capacity).

Local URLs and keys are printed by `supabase start` — put the API URL + anon
key into `../admin/.env.local`.

## Deploy to a hosted project

```bash
supabase link --project-ref <your-ref>
supabase db push                       # apply migrations
supabase functions deploy              # deploy all Edge Functions
```

Set function secrets (Project Settings → Edge Functions):
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are injected
automatically; add `CRON_SECRET` (for the payout cron) and any payment-gateway
keys.

### Enable the access-token hook (required for roles)

`profiles.role` is the source of truth for authorization. A Custom Access Token
Hook injects it into every JWT as `app_metadata.role`, which `is_admin()` /
`role_of()` read. Locally this is on via `config.toml`. For a hosted project,
enable it once: **Authentication → Hooks → Customize Access Token** →
`public.custom_access_token_hook`. (RLS also has a safe DB fallback, so admin
access still works before the hook is enabled — but enable it for correctness.)

### Making an admin

Admins are never created by client sign-up (a client can only set non-privileged
roles). Create the user, then promote in SQL:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

The new role lands in the JWT on the user's next sign-in (or token refresh).

## Layout
```
config.toml                 project config (auth: phone OTP + email, storage)
migrations/
  *_init.sql                tables, enums, indexes, RLS, triggers
  *_storage.sql             storage buckets + object RLS
seed.sql                    LOCAL-ONLY demo data
functions/
  _shared/                  cors + auth/admin helpers
  admin-action/             approve/reject/suspend/reactivate, set user status
  submit-kyc/               nursery -> pending after docs uploaded
  confirm-booking/          parent request + escrow authorize (capacity-checked)
  respond-request/          nursery accept (capture+booking) / decline (refund)
  run-payouts/              monthly settlement aggregation
  send-push/                durable notification + Expo push fan-out
```

## Scheduled jobs (pg_cron)
After deploy, schedule (SQL or dashboard):
- every 5 min — expire `booking_requests` past `expires_at` (+ refund)
- monthly 1st — invoke `run-payouts`
- daily — license-expiry reminders; nightly `nursery_daily_stats` refresh
