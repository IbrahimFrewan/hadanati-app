// deno-lint-ignore-file no-explicit-any
// Parent confirms a booking request. Server is authoritative on capacity and
// price. Creates the booking_request (status=pending) and a payment row
// (status=authorized — funds held in escrow until the nursery accepts).
//
// NOTE: real gateway authorization is integrated where marked; here we record
// the intent so the lifecycle is complete and testable end-to-end.
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient, audit, getCaller } from "../_shared/auth.ts";

const FEE_RATE = 0.05; // 5% platform take

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await getCaller(req);
  if (!caller) return json({ error: "unauthorized" }, 401);

  const body = await req.json().catch(() => ({}));
  const { nurseryId, childId, type, ageGroup, schedule, fromDate, method } = body;
  if (!nurseryId || !childId || !type) {
    return json({ error: "nurseryId, childId, type required" }, 400);
  }

  const db = adminClient();

  // The child must belong to the caller.
  const { data: child } = await db.from("children")
    .select("id, parent_id").eq("id", childId).single();
  if (!child || child.parent_id !== caller.id) return json({ error: "forbidden" }, 403);

  // Nursery must be approved & listed, and price is read from the server.
  const { data: nursery } = await db.from("nurseries")
    .select("id, status, listed, price_hourly, price_daily, price_weekly, price_monthly")
    .eq("id", nurseryId).single();
  if (!nursery || nursery.status !== "approved" || !nursery.listed) {
    return json({ error: "nursery not bookable" }, 400);
  }
  const priceMap: Record<string, { price: number | null; unit: string }> = {
    hourly:  { price: nursery.price_hourly,  unit: "hr" },
    daily:   { price: nursery.price_daily,   unit: "day" },
    weekly:  { price: nursery.price_weekly,  unit: "wk" },
    monthly: { price: nursery.price_monthly, unit: "mo" },
  };
  const chosen = priceMap[type];
  if (!chosen || chosen.price == null) return json({ error: "price unavailable" }, 400);

  // Authoritative capacity check for the requested age group (if provided).
  if (ageGroup) {
    const { data: grp } = await db.from("capacity_groups")
      .select("total, filled").eq("nursery_id", nurseryId).eq("group_", ageGroup).maybeSingle();
    if (grp && grp.filled >= grp.total) return json({ error: "no capacity" }, 409);
  }

  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  const { data: request, error: reqErr } = await db.from("booking_requests").insert({
    parent_id: caller.id, nursery_id: nurseryId, child_id: childId,
    type, schedule: schedule ?? null, from_date: fromDate ?? null,
    price: chosen.price, unit: chosen.unit, status: "pending", expires_at: expiresAt,
  }).select("id").single();
  if (reqErr) return json({ error: reqErr.message }, 400);

  // Authorize payment (escrow). Replace this block with the gateway call.
  const amount = Number(chosen.price);
  const serviceFee = Math.round(amount * FEE_RATE * 100) / 100;
  await db.from("payments").insert({
    request_id: request.id, parent_id: caller.id, nursery_id: nurseryId,
    amount, currency: "JOD", method: method ?? "card",
    status: "authorized", service_fee: serviceFee, net_amount: amount - serviceFee,
  });

  await audit(caller.id, "create_request", "booking_requests", request.id, { nurseryId, type });
  return json({ ok: true, requestId: request.id, price: amount, unit: chosen.unit });
});
