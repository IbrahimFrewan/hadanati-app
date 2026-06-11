// deno-lint-ignore-file no-explicit-any
// Nursery accepts or declines a pending booking request.
//   accept  -> capture the held payment, create the booking, bump capacity
//   decline -> refund the held payment
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient, audit, getCaller } from "../_shared/auth.ts";
import { notifyUser } from "../_shared/notify.ts";

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
    await notifyUser(r.parent_id, {
      kind: "booking", title: "Request declined",
      body: "Your booking request was declined and refunded.", target: "bookings",
    });
    await audit(caller.id, "decline_request", "booking_requests", requestId, {});
    return json({ ok: true, status: "declined" });
  }

  // accept: authoritative capacity check FIRST — the parent-side check at
  // request time can be stale by the time the nursery accepts.
  const { data: child } = await db.from("children")
    .select("group_").eq("id", r.child_id).single();
  if (child?.group_) {
    const { data: grp } = await db.from("capacity_groups")
      .select("total, filled")
      .eq("nursery_id", r.nursery_id).eq("group_", child.group_).maybeSingle();
    if (grp && grp.filled >= grp.total) {
      return json({ error: "no capacity in this age group" }, 409);
    }
  }

  // capture payment + create booking (+ invoice). capacity_groups.filled is
  // kept in sync automatically by the bookings trigger (sync_capacity).
  await db.from("booking_requests").update({ status: "accepted" }).eq("id", requestId);
  await db.from("payments").update({ status: "captured" }).eq("request_id", requestId);

  const { data: booking, error: bErr } = await db.from("bookings").insert({
    request_id: r.id, parent_id: r.parent_id, nursery_id: r.nursery_id,
    child_id: r.child_id, type: r.type, status: "confirmed",
    start_date: r.from_date, price: r.price, unit: r.unit,
  }).select("id").single();
  if (bErr) return json({ error: bErr.message }, 400);

  await db.from("payments").update({ booking_id: booking.id }).eq("request_id", requestId);

  // Record a paid invoice for the captured payment.
  await db.from("invoices").insert({
    booking_id: booking.id, parent_id: r.parent_id, nursery_id: r.nursery_id,
    amount: r.price, status: "paid", method: "card",
  });

  await notifyUser(r.parent_id, {
    kind: "booking", title: "Request accepted",
    body: "Great news — your booking was accepted!", target: "bookings",
  });
  await audit(caller.id, "accept_request", "booking_requests", requestId, { bookingId: booking.id });
  return json({ ok: true, status: "accepted", bookingId: booking.id });
});
