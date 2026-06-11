import { supabase } from "../lib/supabase";
import { useAsync } from "../lib/useAsync";
import { jod } from "../lib/format";
import { PageHeader, StatCard, Loading } from "../components/ui";

async function loadStats() {
  const count = (q: any) => q.then((r: any) => r.count ?? 0);

  const [pending, nurseries, users, bookings, payments] = await Promise.all([
    count(supabase.from("nurseries").select("id", { count: "exact", head: true }).eq("status", "pending")),
    count(supabase.from("nurseries").select("id", { count: "exact", head: true })),
    count(supabase.from("profiles").select("id", { count: "exact", head: true })),
    count(supabase.from("bookings").select("id", { count: "exact", head: true })),
    supabase.from("payments").select("net_amount, status").eq("status", "captured"),
  ]);

  const revenue = (payments.data ?? []).reduce(
    (a: number, p: any) => a + Number(p.net_amount), 0,
  );

  return { pending, nurseries, users, bookings, revenue };
}

export function DashboardPage() {
  const { data, loading, error } = useAsync(loadStats, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Platform overview" />
      {!data ? <Loading error={error} /> : (
        <div className="stat-grid">
          <StatCard label="Pending verification" value={data.pending} tone={data.pending ? "warn" : ""} />
          <StatCard label="Total nurseries" value={data.nurseries} />
          <StatCard label="Total users" value={data.users} />
          <StatCard label="Bookings" value={data.bookings} />
          <StatCard label="Captured revenue (net)" value={jod(data.revenue)} />
        </div>
      )}
    </div>
  );
}
