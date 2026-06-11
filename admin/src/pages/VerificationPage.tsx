import { useState } from "react";
import { supabase, callFunction } from "../lib/supabase";
import { useAsync } from "../lib/useAsync";
import { day } from "../lib/format";
import type { Nursery, NurseryDocument } from "../lib/types";
import { PageHeader, StatusBadge, Loading, Empty } from "../components/ui";

async function loadPending(): Promise<Nursery[]> {
  const { data, error } = await supabase
    .from("nurseries")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data as Nursery[]) ?? [];
}

export function VerificationPage() {
  const { data, loading, error, reload } = useAsync(loadPending, []);
  const [selected, setSelected] = useState<Nursery | null>(null);

  return (
    <div>
      <PageHeader title="Verification queue" subtitle="Review KYC documents and approve or reject nurseries" />
      {!data ? <Loading error={error} /> : data.length === 0 ? (
        <Empty text="No nurseries awaiting review. 🎉" />
      ) : (
        <div className="split">
          <table className="data">
            <thead><tr><th>Nursery</th><th>District</th><th>Submitted</th><th>Status</th></tr></thead>
            <tbody>
              {data.map((n) => (
                <tr key={n.id} className={selected?.id === n.id ? "row-active" : "row-click"}
                    onClick={() => setSelected(n)}>
                  <td><strong>{n.name}</strong></td>
                  <td>{n.district ?? "—"}</td>
                  <td>{day(n.created_at)}</td>
                  <td><StatusBadge status={n.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {selected && (
            <ReviewPanel nursery={selected} onDone={() => { setSelected(null); reload(); }} />
          )}
        </div>
      )}
    </div>
  );
}

function ReviewPanel({ nursery, onDone }: { nursery: Nursery; onDone: () => void }) {
  const { data: docs } = useAsync<NurseryDocument[]>(async () => {
    const { data } = await supabase.from("nursery_documents").select("*").eq("nursery_id", nursery.id);
    return (data as NurseryDocument[]) ?? [];
  }, [nursery.id]);

  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function act(action: "approve_nursery" | "reject_nursery") {
    setBusy(true); setMsg("");
    try {
      await callFunction("admin-action", { action, nurseryId: nursery.id, reason });
      onDone();
    } catch (e: any) {
      setMsg(e?.message ?? "Action failed");
    } finally { setBusy(false); }
  }

  async function viewDoc(path: string) {
    const bucketPath = path.replace(/^kyc\//, "");
    const { data, error } = await supabase.storage.from("kyc").createSignedUrl(bucketPath, 60);
    if (error || !data) { setMsg("Could not open document (not uploaded yet?)"); return; }
    window.open(data.signedUrl, "_blank");
  }

  return (
    <div className="panel">
      <h2>{nursery.name}</h2>
      <div className="kv"><span>District</span><b>{nursery.district ?? "—"}</b></div>
      <div className="kv"><span>Phone</span><b>{nursery.phone ?? "—"}</b></div>
      <div className="kv"><span>Tagline</span><b>{nursery.tagline ?? "—"}</b></div>

      <h3>Documents</h3>
      <div className="docs">
        {(docs ?? []).map((d) => (
          <button key={d.id} className="doc-chip" onClick={() => viewDoc(d.file_path)}>
            📄 {d.type}
          </button>
        ))}
        {docs && docs.length === 0 && <span className="muted">No documents uploaded.</span>}
      </div>

      <label>Reason / notes (recorded in audit log)</label>
      <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3}
        placeholder="Optional for approve; recommended for reject" />

      {msg && <div className="error">{msg}</div>}
      <div className="row-btns">
        <button className="btn danger" disabled={busy} onClick={() => act("reject_nursery")}>Reject</button>
        <button className="btn primary" disabled={busy} onClick={() => act("approve_nursery")}>Approve & list</button>
      </div>
    </div>
  );
}
