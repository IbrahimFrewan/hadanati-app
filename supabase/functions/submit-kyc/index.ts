// deno-lint-ignore-file no-explicit-any
// Nursery owner submits their nursery for KYC review: validates that the
// required documents are uploaded, then moves the nursery draft -> pending.
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient, audit, getCaller } from "../_shared/auth.ts";

const REQUIRED: string[] = ["license", "commercial", "owner_id"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await getCaller(req);
  if (!caller) return json({ error: "unauthorized" }, 401);

  const { nurseryId } = await req.json().catch(() => ({}));
  if (!nurseryId) return json({ error: "nurseryId required" }, 400);

  const db = adminClient();

  // Caller must own this nursery.
  const { data: nursery } = await db.from("nurseries")
    .select("id, owner_id, status").eq("id", nurseryId).single();
  if (!nursery || nursery.owner_id !== caller.id) {
    return json({ error: "forbidden" }, 403);
  }

  // All required docs present?
  const { data: docs } = await db.from("nursery_documents")
    .select("type").eq("nursery_id", nurseryId);
  const have = new Set((docs ?? []).map((d: any) => d.type));
  const missing = REQUIRED.filter((t) => !have.has(t));
  if (missing.length) return json({ error: "missing documents", missing }, 400);

  const { error } = await db.from("nurseries")
    .update({ status: "pending" }).eq("id", nurseryId);
  if (error) return json({ error: error.message }, 400);

  await audit(caller.id, "submit_kyc", "nurseries", nurseryId, {});
  return json({ ok: true, status: "pending" });
});
