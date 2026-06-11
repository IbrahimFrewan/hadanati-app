import { useState } from "react";
import { supabase, callFunction } from "../lib/supabase";
import { useAsync } from "../lib/useAsync";
import { day } from "../lib/format";
import type { Nursery } from "../lib/types";
import { PageHeader, StatusBadge, Loading, Empty } from "../components/ui";

export function NurseriesPage() {
  const [q, setQ] = useState("");
  const { data, loading, error, reload } = useAsync(async () => {
    const { data } = await supabase.from("nurseries").select("*").order("created_at", { ascending: false });
    return (data as Nursery[]) ?? [];
  }, []);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggle(n: Nursery) {
    setBusyId(n.id);
    const action = n.status === "approved" ? "suspend_nursery" : "reactivate_nursery";
    try { await callFunction("admin-action", { action, nurseryId: n.id }); reload(); }
    finally { setBusyId(null); }
  }

  const rows = (data ?? []).filter((n) =>
    !q || n.name.toLowerCase().includes(q.toLowerCase()) ||
    (n.district ?? "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Nurseries" subtitle="All registered nurseries"
        actions={<input className="search" placeholder="Search name or district…"
          value={q} onChange={(e) => setQ(e.target.value)} />} />
      {!data ? <Loading error={error} /> : rows.length === 0 ? <Empty text="No nurseries found." /> : (
        <table className="data">
          <thead><tr><th>Name</th><th>District</th><th>Rating</th><th>Listed</th><th>Status</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {rows.map((n) => (
              <tr key={n.id}>
                <td><strong>{n.name}</strong></td>
                <td>{n.district ?? "—"}</td>
                <td>{n.rating ? `★ ${n.rating} (${n.reviews_count})` : "—"}</td>
                <td>{n.listed ? "Yes" : "No"}</td>
                <td><StatusBadge status={n.status} /></td>
                <td>{day(n.created_at)}</td>
                <td>
                  {(n.status === "approved" || n.status === "suspended") && (
                    <button className="btn ghost sm" disabled={busyId === n.id} onClick={() => toggle(n)}>
                      {n.status === "approved" ? "Suspend" : "Reactivate"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
