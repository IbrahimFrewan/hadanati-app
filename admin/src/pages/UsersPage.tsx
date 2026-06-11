import { useState } from "react";
import { supabase, callFunction } from "../lib/supabase";
import { useAsync } from "../lib/useAsync";
import { day } from "../lib/format";
import type { Profile } from "../lib/types";
import { PageHeader, StatusBadge, Loading, Empty } from "../components/ui";

export function UsersPage() {
  const [role, setRole] = useState<string>("all");
  const { data, loading, error, reload } = useAsync(async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id, role, full_name, phone, email, status, created_at")
      .order("created_at", { ascending: false });
    return (data as Profile[]) ?? [];
  }, []);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(u: Profile, status: "active" | "suspended") {
    setBusyId(u.id);
    try { await callFunction("admin-action", { action: "set_user_status", userId: u.id, status }); reload(); }
    finally { setBusyId(null); }
  }

  const rows = (data ?? []).filter((u) => role === "all" || u.role === role);

  return (
    <div>
      <PageHeader title="Users" subtitle="Parents, nursery owners, and admins"
        actions={
          <select className="search" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="all">All roles</option>
            <option value="parent">Parents</option>
            <option value="nursery_owner">Nursery owners</option>
            <option value="admin">Admins</option>
          </select>
        } />
      {!data ? <Loading error={error} /> : rows.length === 0 ? <Empty text="No users found." /> : (
        <table className="data">
          <thead><tr><th>Name</th><th>Role</th><th>Phone</th><th>Email</th><th>Status</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {rows.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.full_name || "—"}</strong></td>
                <td>{u.role}</td>
                <td>{u.phone ?? "—"}</td>
                <td>{u.email ?? "—"}</td>
                <td><StatusBadge status={u.status} /></td>
                <td>{day(u.created_at)}</td>
                <td>
                  {u.role !== "admin" && (
                    u.status === "active"
                      ? <button className="btn ghost sm" disabled={busyId === u.id} onClick={() => setStatus(u, "suspended")}>Suspend</button>
                      : <button className="btn ghost sm" disabled={busyId === u.id} onClick={() => setStatus(u, "active")}>Reactivate</button>
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
