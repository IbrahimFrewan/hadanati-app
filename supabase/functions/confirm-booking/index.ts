// deno-lint-ignore-file no-explicit-any
// Parent submits a booking request. The SERVER is authoritative on price:
//   per-child amount = unit price (from nurseries) × qty (duration units).
// Supports multiple children: one request + one escrow payment per child, so
// the nursery can accept/decline each child independently against capacity.
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient, audit, getCaller } from "../_shared/auth.ts";
import { notifyUser } from "../_shared/notify.ts";

const FEE_RATE = 0.05; // 5% platform take

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const caller = await getCaller(req);
  if (!caller) return json({ error: "unauthorized" }, 401);

  const body = await req.json().catch(() => ({}));
  const { nurseryId, type, ageGroup, schedule, fromDate, method } = body;
  // Accept childIds[] (multi-child) with childId as a back-compat fallback.
  const childIds: string[] = Array.isArray(body.childIds) && body.childIds.length
    ? body.childIds : (body.childId ? [body.childId] : []);
  // qty = duration units (hours for hourly, days for daily, 1 for weekly/monthly).
  const qty = Math.max(1, Math.min(200, Number(body.qty) || 1));

  if (!nurseryId || !childIds.length || !type) {
    return json({ error: "nurseryId, childIds, type required" }, 400);
  }

  const db = adminClient();

  // Every child must belong to the caller.
  const { data: children } = await db.from("children")
    .select("id, parent_id").in("id", childIds);
  if (!children || children.length !== childIds.length ||
      children.some((c: any) => c.parent_id !== caller.id)) {
    return json({ error: "forbidden" }, 403);
  }

  // Nursery must be approved & listed; price comes from the server.
  const { data: nursery } = await db.from("nurseries")
    .select("id, owner_id, status, listed, price_hourly, price_daily, price_weekly, price_monthly")
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

  // Soft capacity check (authoritative one happens again at accept time).
  if (ageGroup) {
    const { data: grp } = await db.from("capacity_groups")
      .select("total, filled").eq("nursery_id", nurseryId).eq("group_", ageGroup).maybeSingle();
    if (grp && grp.filled >= grp.total) return json({ error: "no capacity" }, 409);
  }

  // Authoritative per-child amount: unit price × duration units.
  const perChild = Math.round(Number(chosen.price) * qty * 100) / 100;
  const expiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
  const requestIds: string[] = [];

  for (const childId of childIds) {
    const { data: request, error: reqErr } = await db.from("booking_requests").insert({
      parent_id: caller.id, nursery_id: nurseryId, child_id: childId,
      type, schedule: schedule ?? null, from_date: fromDate ?? null,
      price: perChild, unit: chosen.unit, status: "pending", expires_at: expiresAt,
    }).select("id").single();
    if (reqErr) return json({ error: reqErr.message, created: requestIds }, 400);

    const serviceFee = Math.round(perChild * FEE_RATE * 100) / 100;
    await db.from("payments").insert({
      request_id: request.id, parent_id: caller.id, nursery_id: nurseryId,
      amount: perChild, currency: "JOD", method: method ?? "card",
      status: "authorized", service_fee: serviceFee, net_amount: perChild - serviceFee,
    });
    requestIds.push(request.id);
  }

  if (nursery.owner_id) {
    await notifyUser(nursery.owner_id, {
      kind: "booking", title: "New booking request",
      body: childIds.length > 1
        ? `A parent requested a booking for ${childIds.length} children — review before it expires.`
        : "A parent requested a booking — review it before it expires.",
      target: "nRequests",
    });
  }

  await audit(caller.id, "create_request", "booking_requests", requestIds[0] ?? null,
    { nurseryId, type, qty, children: childIds.length, perChild });
  return json({
    ok: true, requestIds, perChild, qty,
    total: Math.round(perChild * childIds.length * 100) / 100, unit: chosen.unit,
  });
});
