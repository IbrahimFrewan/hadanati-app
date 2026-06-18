-- =============================================================================
-- DEMO seed for testing the LIVE admin dashboard without the mobile apps.
-- Paste into Supabase → SQL Editor → Run. Creates: an approved+listed nursery,
-- a pending nursery (for the Verification queue), a parent + child, a captured
-- payment, a confirmed booking, and an audit entry. Safe to re-run.
-- To remove later: delete the rows whose ids start with 'dddddddd'/'eeeeeeee'.
-- =============================================================================
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change)
values
 ('00000000-0000-0000-0000-000000000000','dddddddd-0000-0000-0000-000000000001','authenticated','authenticated','demo.owner@hadanati.test', crypt('Demo#2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"],"role":"nursery_owner"}','{"full_name":"Olive Tree Owner"}', now(), now(), '', '', '', ''),
 ('00000000-0000-0000-0000-000000000000','dddddddd-0000-0000-0000-000000000002','authenticated','authenticated','demo.owner2@hadanati.test', crypt('Demo#2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"],"role":"nursery_owner"}','{"full_name":"Sunshine Owner"}', now(), now(), '', '', '', ''),
 ('00000000-0000-0000-0000-000000000000','dddddddd-0000-0000-0000-000000000003','authenticated','authenticated','demo.parent@hadanati.test', crypt('Demo#2026', gen_salt('bf')), now(), '{"provider":"email","providers":["email"],"role":"parent"}','{"full_name":"Layla Parent"}', now(), now(), '', '', '', '')
on conflict (id) do nothing;

update public.profiles set phone='0791234567' where id='dddddddd-0000-0000-0000-000000000003';

-- Approved + listed nursery (shows in Nurseries; would appear in the parent app)
insert into nurseries (id, owner_id, name, district, phone, tagline, price_monthly, price_daily, status, listed, verified, rating, reviews_count)
values ('eeeeeeee-0000-0000-0000-000000000001','dddddddd-0000-0000-0000-000000000001','Olive Tree Kids','Sweifieh','065551234','Outdoor garden · Transport',160,14,'approved',true,true,4.8,12)
on conflict (id) do nothing;

-- Pending nursery (shows in the Verification queue)
insert into nurseries (id, owner_id, name, district, phone, tagline, price_monthly, status, listed)
values ('eeeeeeee-0000-0000-0000-000000000002','dddddddd-0000-0000-0000-000000000002','Sunshine Daycare','Khalda','065559876','Bilingual · Hourly',150,'pending',false)
on conflict (id) do nothing;

insert into nursery_documents (nursery_id, type, file_path, status) values
 ('eeeeeeee-0000-0000-0000-000000000002','license','eeeeeeee-0000-0000-0000-000000000002/license.jpg','pending'),
 ('eeeeeeee-0000-0000-0000-000000000002','commercial','eeeeeeee-0000-0000-0000-000000000002/commercial.jpg','pending'),
 ('eeeeeeee-0000-0000-0000-000000000002','owner_id','eeeeeeee-0000-0000-0000-000000000002/owner_id.jpg','pending')
on conflict do nothing;

insert into capacity_groups (nursery_id, name, group_, total, filled) values
 ('eeeeeeee-0000-0000-0000-000000000001','Sunshine','toddler',12,3)
on conflict do nothing;

insert into children (id, parent_id, name, group_) values
 ('eeeeeeee-0000-0000-0000-0000000000a1','dddddddd-0000-0000-0000-000000000003','Yara','toddler')
on conflict (id) do nothing;

-- A confirmed booking + captured payment + paid invoice (shows in Bookings/Finance)
insert into bookings (id, parent_id, nursery_id, child_id, type, status, price, unit)
values ('eeeeeeee-0000-0000-0000-0000000000b1','dddddddd-0000-0000-0000-000000000003','eeeeeeee-0000-0000-0000-000000000001','eeeeeeee-0000-0000-0000-0000000000a1','monthly','confirmed',160,'mo')
on conflict (id) do nothing;

insert into payments (id, booking_id, parent_id, nursery_id, amount, currency, method, status, service_fee, net_amount)
values ('eeeeeeee-0000-0000-0000-0000000000c1','eeeeeeee-0000-0000-0000-0000000000b1','dddddddd-0000-0000-0000-000000000003','eeeeeeee-0000-0000-0000-000000000001',160,'JOD','card','captured',8,152)
on conflict (id) do nothing;

insert into invoices (booking_id, parent_id, nursery_id, amount, status, method)
values ('eeeeeeee-0000-0000-0000-0000000000b1','dddddddd-0000-0000-0000-000000000003','eeeeeeee-0000-0000-0000-000000000001',160,'paid','card')
on conflict do nothing;
