// deno-lint-ignore-file no-explicit-any
// Pickup/drop-off pass (QR-lite, child-safety critical):
//   action=issue  — the PARENT gets a short one-time code for one of their
//                   bookings, valid today. Only a hash is stored.
//   action=verify — the NURSERY enters the code; on match the child is checked
//                   in (if out) or out (if in), method 'scanned_qr', and the
//                   code is consumed.
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient, audit, getCaller } from "../_shared/auth.ts";

const today = () => new Date().toISOString().slice(0, 10);

async function sha256(s: string): Promise<string> {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(d)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await getCaller(req);
  if (!caller) return json({ error: "unauthorized" }, 401);

  const { action, bookingId, code } = await req.json().catch(() => ({}));
  const db = adminClient();

  if (action === "issue") {
    if (!bookingId) return json({ error: "bookingId required" }, 400);
    const { data: b } = await db.from("bookings")
      .select("id, parent_id, nursery_id, child_id, status").eq("id", bookingId).single();
    if (!b || b.parent_id !== caller.id) return json({ error: "forbidden" }, 403);
    if (!["confirmed", "active"].includes(b.status)) {
      return json({ error: "booking not active" }, 409);
    }

    // 6-char unambiguous code (no 0/O/1/I).
    const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    const buf = new Uint8Array(6);
    crypto.getRandomValues(buf);
    const pass = Array.from(buf).map((x) => alphabet[x % alphabet.length]).join("");

    await db.from("attendance").upsert({
      booking_id: b.id, child_id: b.child_id, nursery_id: b.nursery_id,
      date: today(), pickup_code_hash: await sha256(pass),
    }, { onConflict: "booking_id,date" });

    await audit(caller.id, "issue_pass", "attendance", b.id, {});
    return json({ ok: true, code: pass, validFor: today() });
  }

  if (action === "verify") {
    if (!code) return json({ error: "code required" }, 400);
    // Caller must be a nursery owner; match the code against today's rows of
    // their nursery only.
    const { data: nursery } = await db.from("nurseries")
      .select("id").eq("owner_id", caller.id).limit(1).maybeSingle();
    if (!nursery) return json({ error: "forbidden" }, 403);

    const hash = await sha256(String(code).trim().toUpperCase());
    const { data: row } = await db.from("attendance")
      .select("id, booking_id, child_id, status")
      .eq("nursery_id", nursery.id).eq("date", today())
      .eq("pickup_code_hash", hash).maybeSingle();
    if (!row) return json({ error: "invalid or expired code" }, 404);

    const checkingIn = row.status !== "in";
    await db.from("attendance").update({
      status: checkingIn ? "in" : "out",
      ...(checkingIn
        ? { check_in_at: new Date().toISOString(), checked_in_by: caller.id }
        : { check_out_at: new Date().toISOString(), checkout_method: "scanned_qr" }),
      pickup_code_hash: null, // one-time use
    }).eq("id", row.id);

    const { data: child } = await db.from("children")
      .select("name, parent:profiles!children_parent_id_fkey(full_name)")
      .eq("id", row.child_id).single();

    await audit(caller.id, checkingIn ? "pass_check_in" : "pass_check_out", "attendance", row.id, {});
    return json({
      ok: true, result: checkingIn ? "checked_in" : "checked_out",
      child: child?.name ?? "Child",
      parent: (child as any)?.parent?.full_name ?? "",
    });
  }

  return json({ error: "action must be issue|verify" }, 400);
});
