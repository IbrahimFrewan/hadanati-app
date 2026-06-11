-- =============================================================================
-- Storage buckets + RLS (companion to docs/ARCHITECTURE.md §9)
-- =============================================================================
-- Path convention: the FIRST folder segment is the owning entity id, so a
-- single policy can authorize by ownership, e.g.  <nursery_id>/<doc>/<file>.
-- Sensitive buckets are private; clients receive short-lived signed URLs.
-- Cross-party reads (a nursery viewing a booked child's photo) are minted
-- server-side by an Edge Function using the service role, so the bucket
-- policies here stay strict.
-- =============================================================================

insert into storage.buckets (id, name, public) values
  ('kyc',           'kyc',           false),
  ('children',      'children',      false),
  ('reports',       'reports',       false),
  ('nursery-media', 'nursery-media', true),
  ('avatars',       'avatars',       true)
on conflict (id) do nothing;

-- ---- kyc (owning nursery + admins only) -------------------------------------
create policy "kyc owner rw" on storage.objects for all
  using (
    bucket_id = 'kyc'
    and (is_admin() or owns_nursery(((storage.foldername(name))[1])::uuid))
  )
  with check (
    bucket_id = 'kyc'
    and owns_nursery(((storage.foldername(name))[1])::uuid)
  );

-- ---- children (parent owns their folder; admins read; nursery via signed URL)
create policy "children parent rw" on storage.objects for all
  using (
    bucket_id = 'children'
    and (is_admin() or ((storage.foldername(name))[1])::uuid = auth.uid())
  )
  with check (
    bucket_id = 'children'
    and ((storage.foldername(name))[1])::uuid = auth.uid()
  );

-- ---- reports (owning nursery rw; parent reads via signed URL) ----------------
create policy "reports owner rw" on storage.objects for all
  using (
    bucket_id = 'reports'
    and (is_admin() or owns_nursery(((storage.foldername(name))[1])::uuid))
  )
  with check (
    bucket_id = 'reports'
    and owns_nursery(((storage.foldername(name))[1])::uuid)
  );

-- ---- nursery-media (public read; owner writes own folder) -------------------
create policy "nursery-media public read" on storage.objects for select
  using (bucket_id = 'nursery-media');
create policy "nursery-media owner write" on storage.objects for insert
  with check (bucket_id = 'nursery-media' and owns_nursery(((storage.foldername(name))[1])::uuid));
create policy "nursery-media owner update" on storage.objects for update
  using (bucket_id = 'nursery-media' and owns_nursery(((storage.foldername(name))[1])::uuid));
create policy "nursery-media owner delete" on storage.objects for delete
  using (bucket_id = 'nursery-media' and owns_nursery(((storage.foldername(name))[1])::uuid));

-- ---- avatars (public read; user writes own folder) --------------------------
create policy "avatars public read" on storage.objects for select
  using (bucket_id = 'avatars');
create policy "avatars owner write" on storage.objects for insert
  with check (bucket_id = 'avatars' and ((storage.foldername(name))[1])::uuid = auth.uid());
create policy "avatars owner update" on storage.objects for update
  using (bucket_id = 'avatars' and ((storage.foldername(name))[1])::uuid = auth.uid());
create policy "avatars owner delete" on storage.objects for delete
  using (bucket_id = 'avatars' and ((storage.foldername(name))[1])::uuid = auth.uid());
