import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, actions }: {
  title: string; subtitle?: string; actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {actions && <div className="actions">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, tone }: { label: string; value: ReactNode; tone?: string }) {
  return (
    <div className={"stat-card" + (tone ? ` ${tone}` : "")}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

const TONES: Record<string, string> = {
  pending: "badge-amber", draft: "badge-grey", approved: "badge-green",
  rejected: "badge-red", suspended: "badge-red", active: "badge-green",
  confirmed: "badge-green", completed: "badge-grey", cancelled: "badge-red",
  captured: "badge-green", authorized: "badge-amber", refunded: "badge-grey",
  failed: "badge-red", paid: "badge-green", accruing: "badge-grey", deleted: "badge-red",
};

export function StatusBadge({ status }: { status: string }) {
  return <span className={"badge " + (TONES[status] ?? "badge-grey")}>{status}</span>;
}

export function Loading({ error }: { error?: string | null }) {
  if (error) return <div className="error block">{error}</div>;
  return <div className="muted pad">Loading…</div>;
}

export function Empty({ text }: { text: string }) {
  return <div className="empty">{text}</div>;
}
