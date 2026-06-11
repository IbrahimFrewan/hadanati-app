// deno-lint-ignore-file no-explicit-any
// Single notification path: writes a durable in-app notification row AND pushes
// to every registered device of the recipient via the Expo Push API.
// Used by the marketplace functions and by the send-push endpoint.
import { adminClient } from "./auth.ts";

const EXPO_PUSH = "https://exp.host/--/api/v2/push/send";

export interface NotifyInput {
  kind: string;
  title: string;
  body?: string;
  target?: string | null;
  data?: Record<string, unknown>;
}

export async function notifyUser(recipientId: string, n: NotifyInput): Promise<number> {
  const db = adminClient();

  // Durable in-app notification first (drives the in-app list).
  await db.from("notifications").insert({
    recipient_id: recipientId,
    kind: n.kind,
    title: n.title,
    body: n.body ?? "",
    target: n.target ?? null,
    data: n.data ?? {},
  });

  // Best-effort push to the user's devices.
  const { data: devices } = await db.from("devices")
    .select("expo_push_token").eq("profile_id", recipientId);

  const messages = (devices ?? []).map((d: any) => ({
    to: d.expo_push_token, sound: "default", title: n.title, body: n.body ?? "",
    data: { target: n.target ?? null, ...(n.data ?? {}) },
  }));

  if (messages.length) {
    await fetch(EXPO_PUSH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    }).catch(() => {});
  }
  return messages.length;
}
