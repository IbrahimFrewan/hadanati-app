# Hadanati Admin

Administration dashboard for the Hadanati platform — nursery KYC approvals,
user management, bookings oversight, finance/payouts, and the audit log.
React + Vite + TypeScript, talking to Supabase. Admin-only (enforced by the
`admin` role + RLS); it uses the **anon key only** and never holds the
service-role key — privileged writes go through the `admin-action` Edge Function.

## Run locally

```bash
cd admin
cp .env.example .env.local      # fill VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
npm install
npm run dev                     # http://localhost:5173
```

With the local Supabase stack seeded (see ../supabase), sign in with:

```
admin@hadanati.test  /  Passw0rd!
```

## Scripts
- `npm run dev` — dev server
- `npm run build` — typecheck (`tsc --noEmit`) + production build to `dist/`
- `npm run preview` — serve the built app
- `npm run typecheck` — types only

## Deploy
`npm run build` produces a static `dist/` — host on Vercel, Netlify, Cloudflare
Pages, or Supabase hosting. Set the two `VITE_*` env vars in the host.

## Structure
```
src/
  auth/        AuthContext (session+role), RequireAdmin guard, LoginPage
  components/  Layout (sidebar), ui (StatCard, StatusBadge, tables…)
  lib/         supabase client + callFunction, types, format, useAsync
  pages/       Dashboard, Verification (KYC), Nurseries, Users, Bookings,
               Finance (+ run payouts), AuditLog
```
