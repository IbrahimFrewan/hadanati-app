import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return <div className="centered">Loading…</div>;
  }
  if (!session || profile?.role !== "admin") {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
