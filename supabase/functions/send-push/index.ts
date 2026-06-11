// deno-lint-ignore-file no-explicit-any
// Central push fan-out. Writes a durable notification row (best-effort) and
// pushes to every registered device of the recipient via the Expo Push API.
// Called by other functions/triggers with the service role.
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient } from "../_shared/auth.ts";

const EXPO_PUSH = "https://exp.host/--/api/v2/push/send";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Internal only: require the service-role key.
  const key = req.headers.get("apikey") ?? req.headers.get("Authorization")?.replace("Bearer ", "");
  if (key !== Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")) {
    return json({ error: "forbidden" }, 403);
  }

  const { recipientId, kind, title, body, target, data } = await req.json().catch(() => ({}));
  if (!recipientId || !title) return json({ error: "recipientId and title required" }, 400);

  const db = adminClient();

  // Durable in-app notification first.
  await db.from("notifications").insert({
    recipient_id: recipientId, kind: kind ?? "system", title,
    body: body ?? "", target: target ?? null, data: data ?? {},
  });

  // Then best-effort push to the user's devices.
  const { data: devices } = await db.from("devices")
    .select("expo_push_token").eq("profile_id", recipientId);
  const messages = (devices ?? []).map((d: any) => ({
    to: d.expo_push_token, sound: "default", title, body: body ?? "",
    data: { target, ...data },
  }));

  if (messages.length) {
    await fetch(EXPO_PUSH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    }).catch(() => {});
  }

  return json({ ok: true, pushed: messages.length });
});
