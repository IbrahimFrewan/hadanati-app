import { supabase } from "../lib/supabase";
import { useAsync } from "../lib/useAsync";
import { date } from "../lib/format";
import type { AuditEntry } from "../lib/types";
import { PageHeader, Loading, Empty } from "../components/ui";

export function AuditLogPage() {
  const { data, loading, error } = useAsync(async () => {
    const { data } = await supabase
      .from("audit_log").select("*").order("created_at", { ascending: false }).limit(200);
    return (data as AuditEntry[]) ?? [];
  }, []);

  return (
    <div>
      <PageHeader title="Audit log" subtitle="Immutable record of administrative actions" />
      {!data ? <Loading error={error} /> : data.length === 0 ? <Empty text="No actions recorded yet." /> : (
        <table className="data">
          <thead><tr><th>When</th><th>Action</th><th>Entity</th><th>Details</th></tr></thead>
          <tbody>
            {data.map((a) => (
              <tr key={a.id}>
                <td>{date(a.created_at)}</td>
                <td><code>{a.action}</code></td>
                <td>{a.entity}</td>
                <td className="meta">{Object.keys(a.meta ?? {}).length ? JSON.stringify(a.meta) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
