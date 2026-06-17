# Hadanati Admin — static portal (Bootstrap 5 + vanilla JS)

A no-build administration portal in **plain HTML + CSS + Bootstrap 5** (no React,
no Tailwind, no bundler). Talks to Supabase via the official browser SDK loaded
from a CDN. Same features as before: dashboard, KYC verification, nurseries,
users, bookings, finance/payouts, and the audit log — restyled with a polished
three-column dashboard layout in the Hadanati green brand.

## Files
```
admin-html/
  login.html              sign-in (admin-only)
  index.html              dashboard (stats + 7-day chart + activity)
  verification.html       KYC review → approve/reject
  nurseries.html          list, search, suspend/reactivate
  users.html              parents/owners/admins, suspend/reactivate
  bookings.html           recent bookings
  finance.html            payments, payouts, "run monthly payouts"
  audit.html              admin action log
  assets/css/styles.css   the theme (Bootstrap is loaded from CDN)
  assets/js/config.js     ← put your Supabase URL + anon key here
  assets/js/app.js        client, helpers, auth guard, sidebar
```

## Run it on your device

1. **Add your keys.** Open `assets/js/config.js` and fill:
   ```js
   window.HADANATI_CONFIG = {
     SUPABASE_URL: "https://YOUR-PROJECT.supabase.co",
     SUPABASE_ANON_KEY: "YOUR-ANON-KEY",
   };
   ```
   (From Supabase → Settings → API. The anon key is public by design; security
   is enforced by RLS + the admin role.)

2. **Serve the folder** (don't open the files with `file://` — the SDK needs
   http). Any static server works:
   ```bash
   cd admin-html
   python3 -m http.server 8077        # → http://localhost:8077/login.html
   ```
   or `npx serve .`, or VS Code's "Live Server" extension.

3. **Sign in** with an admin account (create the user in Supabase, then
   `update profiles set role='admin' where email='you@…';`).

## Deploy (optional)
It's fully static — drag the `admin-html` folder onto Netlify/Vercel, or push to
GitHub Pages. Just keep `assets/js/config.js` filled (or inject it per-host).

## Notes
- Requires the Supabase backend from `../supabase` to be deployed (schema +
  Edge Functions + the access-token hook). See `../supabase/README.md`.
- This replaces the old React/Vite portal in `../admin/` (which you can delete).
- CDNs used: Bootstrap 5.3, Bootstrap Icons, Chart.js 4, @supabase/supabase-js 2,
  Plus Jakarta Sans (Google Fonts). All need internet at runtime.
