// Row shapes the admin app reads (subset of the full schema).
export type Role = "parent" | "nursery_owner" | "admin";

export interface Profile {
  id: string;
  role: Role;
  full_name: string;
  phone: string | null;
  email: string | null;
  status: "active" | "suspended" | "deleted";
  created_at: string;
}

export type NurseryStatus = "draft" | "pending" | "approved" | "rejected" | "suspended";

export interface Nursery {
  id: string;
  owner_id: string;
  name: string;
  district: string | null;
  phone: string | null;
  tagline: string | null;
  rating: number;
  reviews_count: number;
  verified: boolean;
  listed: boolean;
  status: NurseryStatus;
  created_at: string;
}

export interface NurseryDocument {
  id: string;
  nursery_id: string;
  type: "license" | "commercial" | "owner_id" | "insurance";
  file_path: string;
  status: "pending" | "approved" | "rejected";
}

export interface Booking {
  id: string;
  parent_id: string;
  nursery_id: string;
  type: string;
  status: "confirmed" | "active" | "completed" | "cancelled";
  price: number;
  unit: string;
  created_at: string;
}

export interface Payment {
  id: string;
  nursery_id: string;
  amount: number;
  currency: string;
  method: string;
  status: "pending" | "authorized" | "captured" | "refunded" | "failed";
  service_fee: number;
  net_amount: number;
  created_at: string;
}

export interface Payout {
  id: string;
  nursery_id: string;
  period_start: string;
  period_end: string;
  gross: number;
  fees: number;
  net: number;
  status: "accruing" | "pending" | "paid";
}

export interface AuditEntry {
  id: number;
  actor_id: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  meta: Record<string, unknown>;
  created_at: string;
}
