import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const NAV = [
  { to: "/", label: "Dashboard", icon: "📊", end: true },
  { to: "/verification", label: "Verification", icon: "✅" },
  { to: "/nurseries", label: "Nurseries", icon: "🏠" },
  { to: "/users", label: "Users", icon: "👥" },
  { to: "/bookings", label: "Bookings", icon: "📅" },
  { to: "/finance", label: "Finance", icon: "💳" },
  { to: "/audit", label: "Audit log", icon: "📜" },
];

export function Layout() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  async function logout() {
    await signOut();
    navigate("/login", { replace: true });
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">🌿 <span>Hadanati</span></div>
        <nav>
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) => "nav-item" + (isActive ? " active" : "")}>
              <span className="ico">{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="who">{profile?.full_name || "Admin"}</div>
          <button className="btn ghost sm" onClick={logout}>Sign out</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
