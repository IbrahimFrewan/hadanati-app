-- =============================================================================
-- Seed data for LOCAL DEVELOPMENT (`supabase start` / `supabase db reset`).
-- Do NOT run against production.
-- =============================================================================
-- Creates three auth users (admin, a nursery owner, a parent). The
-- `on_auth_user_created` trigger auto-creates their public.profiles rows with
-- the role taken from raw_app_meta_data.role. We then add a pending nursery so
-- the admin Verification queue has something to review immediately.
--
-- Login for the admin dashboard:  admin@hadanati.test  /  Passw0rd!
-- =============================================================================

-- Fixed UUIDs so we can reference them below.
-- admin  : 11111111-1111-1111-1111-111111111111
-- owner  : 22222222-2222-2222-2222-222222222222
-- parent : 33333333-3333-3333-3333-333333333333

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111',
   'authenticated', 'authenticated', 'admin@hadanati.test',
   crypt('Passw0rd!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"],"role":"admin"}',
   '{"full_name":"Platform Admin"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222',
   'authenticated', 'authenticated', 'owner@hadanati.test',
   crypt('Passw0rd!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"],"role":"nursery_owner"}',
   '{"full_name":"Olive Tree Owner"}', now(), now(), '', '', '', ''),
  ('00000000-0000-0000-0000-000000000000', '33333333-3333-3333-3333-333333333333',
   'authenticated', 'authenticated', 'parent@hadanati.test',
   crypt('Passw0rd!', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"],"role":"parent"}',
   '{"full_name":"Layla Parent"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;

-- The trigger created profiles; enrich them.
update profiles set phone = '0791234567', email = 'parent@hadanati.test'
  where id = '33333333-3333-3333-3333-333333333333';

-- A pending nursery awaiting KYC review (shows in the admin Verification queue).
insert into nurseries (id, owner_id, name, district, phone, tagline, price_monthly, status, listed)
values (
  '44444444-4444-4444-4444-444444444444',
  '22222222-2222-2222-2222-222222222222',
  'Olive Tree Kids', 'Sweifieh', '065551234',
  'Outdoor garden · Transport', 160, 'pending', false
) on conflict (id) do nothing;

insert into nursery_documents (nursery_id, type, file_path, status) values
  ('44444444-4444-4444-4444-444444444444', 'license',    'kyc/44444444-4444-4444-4444-444444444444/license.pdf',    'pending'),
  ('44444444-4444-4444-4444-444444444444', 'commercial', 'kyc/44444444-4444-4444-4444-444444444444/commercial.pdf', 'pending'),
  ('44444444-4444-4444-4444-444444444444', 'owner_id',   'kyc/44444444-4444-4444-4444-444444444444/owner_id.pdf',   'pending')
on conflict do nothing;

insert into capacity_groups (nursery_id, name, group_, total, filled) values
  ('44444444-4444-4444-4444-444444444444', 'Tiny Sprouts', 'infant',    6,  4),
  ('44444444-4444-4444-4444-444444444444', 'Sunshine',     'toddler',  12, 11),
  ('44444444-4444-4444-4444-444444444444', 'Rainbow',      'preschool',14,  9)
on conflict do nothing;
