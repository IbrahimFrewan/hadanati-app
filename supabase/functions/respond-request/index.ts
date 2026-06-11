// deno-lint-ignore-file no-explicit-any
// Nursery accepts or declines a pending booking request.
//   accept  -> capture the held payment, create the booking, bump capacity
//   decline -> refund the held payment
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient, audit, getCaller } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await getCaller(req);
  if (!caller) return json({ error: "unauthorized" }, 401);

  const { requestId, decision } = await req.json().catch(() => ({}));
  if (!requestId || !["accept", "decline"].includes(decision)) {
    return json({ error: "requestId and decision (accept|decline) required" }, 400);
  }

  const db = adminClient();

  const { data: r } = await db.from("booking_requests")
    .select("id, parent_id, nursery_id, child_id, type, price, unit, status, from_date")
    .eq("id", requestId).single();
  if (!r) return json({ error: "not found" }, 404);
  if (r.status !== "pending") return json({ error: "already resolved" }, 409);

  // Caller must own the nursery.
  const { data: nursery } = await db.from("nurseries")
    .select("owner_id").eq("id", r.nursery_id).single();
  if (!nursery || nursery.owner_id !== caller.id) return json({ error: "forbidden" }, 403);

  if (decision === "decline") {
    await db.from("booking_requests").update({ status: "declined" }).eq("id", requestId);
    await db.from("payments").update({ status: "refunded" }).eq("request_id", requestId);
    await notify(db, r.parent_id, "booking", "Request declined",
      "Your booking request was declined and refunded.");
    await audit(caller.id, "decline_request", "booking_requests", requestId, {});
    return json({ ok: true, status: "declined" });
  }

  // accept: capture payment + create booking
  await db.from("booking_requests").update({ status: "accepted" }).eq("id", requestId);
  await db.from("payments").update({ status: "captured" }).eq("request_id", requestId);

  const { data: booking, error: bErr } = await db.from("bookings").insert({
    request_id: r.id, parent_id: r.parent_id, nursery_id: r.nursery_id,
    child_id: r.child_id, type: r.type, status: "confirmed",
    start_date: r.from_date, price: r.price, unit: r.unit,
  }).select("id").single();
  if (bErr) return json({ error: bErr.message }, 400);

  await db.from("payments").update({ booking_id: booking.id }).eq("request_id", requestId);
  await notify(db, r.parent_id, "booking", "Request accepted",
    "Great news — your booking was accepted!");
  await audit(caller.id, "accept_request", "booking_requests", requestId, { bookingId: booking.id });
  return json({ ok: true, status: "accepted", bookingId: booking.id });
});

async function notify(db: any, recipientId: string, kind: string, title: string, body: string) {
  await db.from("notifications").insert({ recipient_id: recipientId, kind, title, body });
}
