// deno-lint-ignore-file no-explicit-any
// Cancel a booking (parent or owning nursery) or a still-pending request
// (parent). Captured/held payments are refunded (gateway call goes here),
// the counterpart is notified, capacity resyncs via the bookings trigger,
// and everything is audited.
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient, audit, getCaller } from "../_shared/auth.ts";
import { notifyUser } from "../_shared/notify.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await getCaller(req);
  if (!caller) return json({ error: "unauthorized" }, 401);

  const { bookingId, requestId, reason } = await req.json().catch(() => ({}));
  const db = adminClient();

  // ---- cancel a pending request (parent only) --------------------------------
  if (requestId) {
    const { data: r } = await db.from("booking_requests")
      .select("id, parent_id, nursery_id, status").eq("id", requestId).single();
    if (!r) return json({ error: "not found" }, 404);
    if (r.parent_id !== caller.id) return json({ error: "forbidden" }, 403);
    if (r.status !== "pending") return json({ error: "already resolved" }, 409);

    await db.from("booking_requests").update({ status: "declined" }).eq("id", requestId);
    await db.from("payments").update({ status: "refunded" })
      .eq("request_id", requestId).in("status", ["authorized", "pending"]);
    await audit(caller.id, "cancel_request", "booking_requests", requestId, { reason });
    return json({ ok: true, status: "cancelled", refunded: true });
  }

  // ---- cancel a booking (parent or owning nursery) ---------------------------
  if (!bookingId) return json({ error: "bookingId or requestId required" }, 400);

  const { data: b } = await db.from("bookings")
    .select("id, parent_id, nursery_id, status, price").eq("id", bookingId).single();
  if (!b) return json({ error: "not found" }, 404);

  const { data: nursery } = await db.from("nurseries")
    .select("owner_id, name").eq("id", b.nursery_id).single();
  const isParent = b.parent_id === caller.id;
  const isOwner = nursery?.owner_id === caller.id;
  if (!isParent && !isOwner) return json({ error: "forbidden" }, 403);
  if (!["confirmed", "active"].includes(b.status)) {
    return json({ error: "booking cannot be cancelled" }, 409);
  }

  await db.from("bookings").update({ status: "cancelled" }).eq("id", bookingId);
  // Refund the held/captured payment. (Real gateway refund call goes here.)
  await db.from("payments").update({ status: "refunded" })
    .eq("booking_id", bookingId).in("status", ["authorized", "captured"]);
  await db.from("invoices").delete()
    .eq("booking_id", bookingId).eq("status", "pending");

  const other = isParent ? nursery?.owner_id : b.parent_id;
  if (other) {
    await notifyUser(other, {
      kind: "booking", title: "Booking cancelled",
      body: isParent
        ? "A parent cancelled a booking — the spot has been released."
        : `${nursery?.name ?? "The nursery"} cancelled a booking. The payment was refunded.`,
      target: isParent ? "nRequests" : "bookings",
    });
  }

  await audit(caller.id, "cancel_booking", "bookings", bookingId,
    { by: isParent ? "parent" : "nursery", reason });
  return json({ ok: true, status: "cancelled", refunded: true });
});
