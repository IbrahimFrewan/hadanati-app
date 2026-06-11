// deno-lint-ignore-file no-explicit-any
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

/** Service-role client — bypasses RLS. Use ONLY after authorizing the caller. */
export function adminClient() {
  return createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });
}

/** Resolve the calling user from the request's Authorization header. */
export async function getCaller(req: Request) {
  const authHeader = req.headers.get("Authorization") ?? "";
  const client = createClient(SUPABASE_URL, ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false },
  });
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
}

/** Look up a user's role from their profile (source of truth). */
export async function roleOf(userId: string): Promise<string> {
  const db = adminClient();
  const { data } = await db.from("profiles").select("role").eq("id", userId)
    .single();
  return data?.role ?? "parent";
}

/** Append an immutable audit-log entry. */
export async function audit(
  actorId: string | null,
  action: string,
  entity: string,
  entityId: string | null,
  meta: Record<string, any> = {},
) {
  await adminClient().from("audit_log").insert({
    actor_id: actorId,
    action,
    entity,
    entity_id: entityId,
    meta,
  });
}
