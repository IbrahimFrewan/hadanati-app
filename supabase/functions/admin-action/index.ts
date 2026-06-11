// deno-lint-ignore-file no-explicit-any
// Privileged admin operations. Admin-only; every action is audited.
// Actions: approve_nursery | reject_nursery | suspend_nursery |
//          reactivate_nursery | set_user_status
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient, audit, getCaller, roleOf } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await getCaller(req);
  if (!caller) return json({ error: "unauthorized" }, 401);
  if ((await roleOf(caller.id)) !== "admin") return json({ error: "forbidden" }, 403);

  const { action, nurseryId, userId, reason, status } = await req.json().catch(() => ({}));
  const db = adminClient();

  switch (action) {
    case "approve_nursery": {
      if (!nurseryId) return json({ error: "nurseryId required" }, 400);
      const { error } = await db.from("nurseries").update({
        status: "approved", verified: true, listed: true,
        reviewed_by: caller.id, reviewed_at: new Date().toISOString(),
      }).eq("id", nurseryId);
      if (error) return json({ error: error.message }, 400);
      await db.from("nursery_documents").update({
        status: "approved", reviewed_by: caller.id, reviewed_at: new Date().toISOString(),
      }).eq("nursery_id", nurseryId);
      await audit(caller.id, "approve_nursery", "nurseries", nurseryId, { reason });
      return json({ ok: true });
    }

    case "reject_nursery": {
      if (!nurseryId) return json({ error: "nurseryId required" }, 400);
      const { error } = await db.from("nurseries").update({
        status: "rejected", verified: false, listed: false,
        reviewed_by: caller.id, reviewed_at: new Date().toISOString(),
      }).eq("id", nurseryId);
      if (error) return json({ error: error.message }, 400);
      await audit(caller.id, "reject_nursery", "nurseries", nurseryId, { reason });
      return json({ ok: true });
    }

    case "suspend_nursery": {
      if (!nurseryId) return json({ error: "nurseryId required" }, 400);
      const { error } = await db.from("nurseries").update({
        status: "suspended", listed: false,
      }).eq("id", nurseryId);
      if (error) return json({ error: error.message }, 400);
      await audit(caller.id, "suspend_nursery", "nurseries", nurseryId, { reason });
      return json({ ok: true });
    }

    case "reactivate_nursery": {
      if (!nurseryId) return json({ error: "nurseryId required" }, 400);
      const { error } = await db.from("nurseries").update({
        status: "approved", listed: true,
      }).eq("id", nurseryId);
      if (error) return json({ error: error.message }, 400);
      await audit(caller.id, "reactivate_nursery", "nurseries", nurseryId, { reason });
      return json({ ok: true });
    }

    case "set_user_status": {
      if (!userId || !status) return json({ error: "userId and status required" }, 400);
      if (!["active", "suspended", "deleted"].includes(status)) {
        return json({ error: "invalid status" }, 400);
      }
      const { error } = await db.from("profiles").update({ status }).eq("id", userId);
      if (error) return json({ error: error.message }, 400);
      await audit(caller.id, "set_user_status", "profiles", userId, { status, reason });
      return json({ ok: true });
    }

    default:
      return json({ error: "unknown action" }, 400);
  }
});
