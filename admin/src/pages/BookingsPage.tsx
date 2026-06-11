import { supabase } from "../lib/supabase";
import { useAsync } from "../lib/useAsync";
import { jod, day } from "../lib/format";
import { PageHeader, StatusBadge, Loading, Empty } from "../components/ui";

interface BookingRow {
  id: string; type: string; status: string; price: number; unit: string; created_at: string;
  nurseries: { name: string } | null;
  profiles: { full_name: string } | null;
}

export function BookingsPage() {
  const { data, loading, error } = useAsync(async () => {
    const { data } = await supabase
      .from("bookings")
      .select("id, type, status, price, unit, created_at, nurseries(name), profiles!bookings_parent_id_fkey(full_name)")
      .order("created_at", { ascending: false })
      .limit(200);
    return (data as unknown as BookingRow[]) ?? [];
  }, []);

  return (
    <div>
      <PageHeader title="Bookings" subtitle="Recent bookings across the platform" />
      {!data ? <Loading error={error} /> : data.length === 0 ? <Empty text="No bookings yet." /> : (
        <table className="data">
          <thead><tr><th>Nursery</th><th>Parent</th><th>Type</th><th>Price</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            {data.map((b) => (
              <tr key={b.id}>
                <td><strong>{b.nurseries?.name ?? "—"}</strong></td>
                <td>{b.profiles?.full_name ?? "—"}</td>
                <td>{b.type}</td>
                <td>{jod(b.price)} / {b.unit}</td>
                <td><StatusBadge status={b.status} /></td>
                <td>{day(b.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
