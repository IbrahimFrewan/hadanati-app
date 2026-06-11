import { useState } from "react";
import { supabase, callFunction } from "../lib/supabase";
import { useAsync } from "../lib/useAsync";
import { jod, day } from "../lib/format";
import type { Payment, Payout } from "../lib/types";
import { PageHeader, StatusBadge, StatCard, Loading } from "../components/ui";

export function FinancePage() {
  const { data, loading, error, reload } = useAsync(async () => {
    const [payments, payouts] = await Promise.all([
      supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("payouts").select("*").order("period_end", { ascending: false }).limit(50),
    ]);
    return {
      payments: (payments.data as Payment[]) ?? [],
      payouts: (payouts.data as Payout[]) ?? [],
    };
  }, []);

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function runPayouts() {
    setBusy(true); setMsg("");
    try {
      const res: any = await callFunction("run-payouts", {});
      setMsg(`Payout run complete — ${res?.payouts?.length ?? 0} nursery payout(s) created.`);
      reload();
    } catch (e: any) { setMsg(e?.message ?? "Run failed"); }
    finally { setBusy(false); }
  }

  const fees = (data?.payments ?? [])
    .filter((p) => p.status === "captured")
    .reduce((a, p) => a + Number(p.service_fee), 0);

  return (
    <div>
      <PageHeader title="Finance" subtitle="Payments & monthly settlements"
        actions={<button className="btn primary" disabled={busy} onClick={runPayouts}>
          {busy ? "Running…" : "Run monthly payouts"}</button>} />

      {msg && <div className="notice">{msg}</div>}

      {!data ? <Loading error={error} /> : (
        <>
          <div className="stat-grid">
            <StatCard label="Platform fees (captured)" value={jod(fees)} />
            <StatCard label="Payments shown" value={data.payments.length} />
            <StatCard label="Payout runs" value={data.payouts.length} />
          </div>

          <h3 className="section">Recent payments</h3>
          <table className="data">
            <thead><tr><th>Amount</th><th>Fee</th><th>Net</th><th>Method</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {data.payments.map((p) => (
                <tr key={p.id}>
                  <td>{jod(p.amount)}</td>
                  <td>{jod(p.service_fee)}</td>
                  <td>{jod(p.net_amount)}</td>
                  <td>{p.method}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td>{day(p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="section">Payouts</h3>
          <table className="data">
            <thead><tr><th>Period</th><th>Gross</th><th>Fees</th><th>Net</th><th>Status</th></tr></thead>
            <tbody>
              {data.payouts.map((p) => (
                <tr key={p.id}>
                  <td>{day(p.period_start)} – {day(p.period_end)}</td>
                  <td>{jod(p.gross)}</td>
                  <td>{jod(p.fees)}</td>
                  <td>{jod(p.net)}</td>
                  <td><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
