-- =============================================================================
-- Auth role wiring — makes profiles.role the single source of truth and gets it
-- into the JWT so RLS can authorize cheaply. Fixes three issues in the initial
-- cut:
--   1. is_admin()/role_of() read app_metadata.role, but nothing populated it
--      for users created through normal sign-up.
--   2. App sign-up passed role via user_metadata, which the trigger never read.
--   3. (Security) reading role from user_metadata naively would let a client
--      escalate itself to 'admin'. We explicitly forbid that.
-- =============================================================================

-- ---- caller's own role, bypassing RLS (prevents recursion in profiles policy)
create or replace function public.my_role()
returns user_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---- role_of(): prefer the JWT claim (set by the hook below); fall back to a
-- direct, RLS-safe lookup so authorization still works if the hook is not yet
-- enabled (e.g. fresh local stack).
create or replace function public.role_of()
returns user_role
language sql stable as $$
  select coalesce(
    nullif(auth.jwt() -> 'app_metadata' ->> 'role', '')::user_role,
    public.my_role(),
    'parent'
  );
$$;

-- ---- sign-up trigger: derive the role correctly AND safely.
-- app_metadata is server-controlled (trusted) so 'admin' is allowed there.
-- user_metadata is client-controlled, so only non-privileged roles are honored
-- from it — a client can never make itself an admin.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
declare
  v_role public.user_role;
begin
  v_role := case
    when new.raw_app_meta_data ->> 'role' in ('parent', 'nursery_owner', 'admin')
      then (new.raw_app_meta_data ->> 'role')::public.user_role
    when new.raw_user_meta_data ->> 'role' in ('parent', 'nursery_owner')
      then (new.raw_user_meta_data ->> 'role')::public.user_role
    else 'parent'::public.user_role
  end;

  insert into public.profiles (id, role, full_name, phone, email)
  values (
    new.id,
    v_role,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.phone,
    new.email
  );
  return new;
end $$;

-- ---- Custom Access Token Hook: inject profiles.role into app_metadata.role on
-- every token issuance. Enable it in config.toml ([auth.hook.custom_access_token])
-- locally and in the dashboard (Authentication → Hooks) for hosted projects.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql stable as $$
declare
  claims jsonb;
  v_role public.user_role;
begin
  select role into v_role from public.profiles where id = (event ->> 'user_id')::uuid;

  claims := coalesce(event -> 'claims', '{}'::jsonb);
  if (claims -> 'app_metadata') is null then
    claims := jsonb_set(claims, '{app_metadata}', '{}'::jsonb);
  end if;

  claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(coalesce(v_role::text, 'parent')));
  event := jsonb_set(event, '{claims}', claims);
  return event;
end $$;

-- The hook runs as the supabase_auth_admin role; grant exactly what it needs
-- and nothing to clients.
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;
grant select on table public.profiles to supabase_auth_admin;

-- Allow the auth admin (only) to read roles for the hook.
drop policy if exists "auth admin reads roles" on public.profiles;
create policy "auth admin reads roles" on public.profiles
  for select to supabase_auth_admin using (true);
