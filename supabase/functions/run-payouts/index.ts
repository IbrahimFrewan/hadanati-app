// deno-lint-ignore-file no-explicit-any
// Monthly settlement. Aggregates the previous month's CAPTURED payments per
// nursery into a payouts row (gross / fees / net) and links each payment via
// payout_items. Invoked by pg_cron (1st of the month) or manually by an admin
// from the dashboard. Idempotent per (nursery, period).
import { corsHeaders, json } from "../_shared/cors.ts";
import { adminClient, audit, getCaller, roleOf } from "../_shared/auth.ts";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  // Allow either an admin user (manual trigger) or the cron service-role call.
  const caller = await getCaller(req);
  const isCron = req.headers.get("x-cron") === Deno.env.get("CRON_SECRET");
  if (!isCron) {
    if (!caller || (await roleOf(caller.id)) !== "admin") {
      return json({ error: "forbidden" }, 403);
    }
  }

  const body = await req.json().catch(() => ({}));
  // Default to the previous calendar month.
  const now = new Date();
  const periodStart = body.periodStart ??
    new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 10);
  const periodEnd = body.periodEnd ??
    new Date(now.getFullYear(), now.getMonth(), 0).toISOString().slice(0, 10);

  const db = adminClient();

  // All captured payments in the window, not yet assigned to a payout.
  const { data: payments, error } = await db.from("payments")
    .select("id, nursery_id, amount, service_fee, net_amount")
    .eq("status", "captured")
    .gte("created_at", periodStart)
    .lte("created_at", `${periodEnd}T23:59:59Z`);
  if (error) return json({ error: error.message }, 400);

  const { data: existing } = await db.from("payout_items").select("payment_id");
  const assigned = new Set((existing ?? []).map((x: any) => x.payment_id));

  const byNursery = new Map<string, any[]>();
  for (const p of payments ?? []) {
    if (assigned.has(p.id)) continue;
    (byNursery.get(p.nursery_id) ?? byNursery.set(p.nursery_id, []).get(p.nursery_id))!.push(p);
  }

  const results: any[] = [];
  for (const [nurseryId, list] of byNursery) {
    const gross = list.reduce((a, p) => a + Number(p.amount), 0);
    const fees = list.reduce((a, p) => a + Number(p.service_fee), 0);
    const net = list.reduce((a, p) => a + Number(p.net_amount), 0);

    const { data: payout, error: poErr } = await db.from("payouts").upsert({
      nursery_id: nurseryId, period_start: periodStart, period_end: periodEnd,
      gross, fees, net, status: "pending",
    }, { onConflict: "nursery_id,period_start,period_end" }).select("id").single();
    if (poErr) { results.push({ nurseryId, error: poErr.message }); continue; }

    await db.from("payout_items").insert(
      list.map((p) => ({ payout_id: payout.id, payment_id: p.id })),
    );
    // Disburse here via bank/CLIQ transfer, then mark paid.
    results.push({ nurseryId, payoutId: payout.id, gross, fees, net, count: list.length });
  }

  await audit(caller?.id ?? null, "run_payouts", "payouts", null, { periodStart, periodEnd, count: results.length });
  return json({ ok: true, periodStart, periodEnd, payouts: results });
});
