// deno-lint-ignore-file no-explicit-any
// Internal endpoint to fan out a notification (durable row + Expo push).
// Requires the service-role key; intended to be called server-to-server.
import { corsHeaders, json } from "../_shared/cors.ts";
import { notifyUser } from "../_shared/notify.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const key = req.headers.get("apikey") ?? req.headers.get("Authorization")?.replace("Bearer ", "");
  if (key !== Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
    return json({ error: "forbidden" }, 403);
  }

  const { recipientId, kind, title, body, target, data } = await req.json().catch(() => ({}));
  if (!recipientId || !title) return json({ error: "recipientId and title required" }, 400);

  const pushed = await notifyUser(recipientId, { kind: kind ?? "system", title, body, target, data });
  return json({ ok: true, pushed });
});
