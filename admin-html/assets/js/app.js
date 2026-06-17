/* =========================================================================
   Shared app layer: Supabase client, helpers, auth guard, sidebar shell.
   Plain ES (no modules/build) — loaded after the supabase-js UMD bundle.
   ========================================================================= */
(function () {
  const cfg = window.HADANATI_CONFIG || {};
  window.CONFIGURED = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY &&
    !cfg.SUPABASE_URL.includes("YOUR-PROJECT"));

  // Create the client (placeholder values are harmless until a call is made).
  window.sb = window.supabase.createClient(
    cfg.SUPABASE_URL || "https://placeholder.supabase.co",
    cfg.SUPABASE_ANON_KEY || "placeholder-key"
  );

  /* ---- formatting helpers ---- */
  window.fmt = {
    jod: (n) => `${Number(n || 0).toFixed(2)} JOD`,
    date: (s) => s ? new Date(s).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }) : "—",
    day: (s) => s ? new Date(s).toLocaleDateString("en-GB", { dateStyle: "medium" }) : "—",
    initials: (name) => (name || "").split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "؟",
    esc: (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])),
  };

  const TONES = {
    pending: "b-amber", draft: "b-grey", approved: "b-green", rejected: "b-red",
    suspended: "b-red", active: "b-green", confirmed: "b-green", completed: "b-grey",
    cancelled: "b-red", captured: "b-green", authorized: "b-amber", refunded: "b-grey",
    failed: "b-red", paid: "b-green", accruing: "b-grey", deleted: "b-red", expired: "b-grey",
  };
  window.badge = (s) => `<span class="badge-soft ${TONES[s] || "b-grey"}">${fmt.esc(s)}</span>`;

  /* ---- Edge Function invoke (with the user's session token) ---- */
  window.callFn = async (name, body) => {
    const { data, error } = await window.sb.functions.invoke(name, { body });
    if (error) throw error;
    return data;
  };

  /* ---- auth ---- */
  window.signOut = async () => { await window.sb.auth.signOut(); location.replace("login.html"); };

  // Guards a protected page: must be signed in AND have role 'admin'.
  window.requireAdmin = async () => {
    if (!window.CONFIGURED) {
      document.body.innerHTML =
        '<div class="login-wrap"><div class="login-card text-center">' +
        '<div class="logo"><i class="bi bi-leaf"></i></div>' +
        '<h5 class="fw-bold">Backend not configured</h5>' +
        '<p class="text-muted small">Open <code>assets/js/config.js</code> and set your Supabase URL and anon key, then reload.</p>' +
        "</div></div>";
      throw new Error("not configured");
    }
    const { data: { session } } = await window.sb.auth.getSession();
    if (!session) { location.replace("login.html"); throw new Error("no session"); }
    const { data: prof } = await window.sb.from("profiles").select("role, full_name").eq("id", session.user.id).single();
    if (!prof || prof.role !== "admin") {
      await window.sb.auth.signOut();
      location.replace("login.html?denied=1");
      throw new Error("not admin");
    }
    window.ADMIN = { id: session.user.id, name: prof.full_name || "Admin", email: session.user.email };
    return window.ADMIN;
  };

  /* ---- sidebar shell ---- */
  const NAV = [
    { key: "dashboard", href: "index.html", icon: "bi-grid-1x2", label: "Dashboard" },
    { key: "verification", href: "verification.html", icon: "bi-patch-check", label: "Verification" },
    { key: "nurseries", href: "nurseries.html", icon: "bi-house-heart", label: "Nurseries" },
    { key: "users", href: "users.html", icon: "bi-people", label: "Users" },
    { key: "bookings", href: "bookings.html", icon: "bi-calendar2-check", label: "Bookings" },
    { key: "finance", href: "finance.html", icon: "bi-wallet2", label: "Finance" },
    { key: "audit", href: "audit.html", icon: "bi-clipboard-data", label: "Audit log" },
  ];
  window.renderSidebar = (active) => {
    const el = document.getElementById("sidebar");
    if (!el) return;
    el.className = "sidebar";
    el.innerHTML =
      '<div class="brand"><div class="logo"><i class="bi bi-leaf"></i></div><b>Hadanati</b></div>' +
      '<nav class="nav-rail">' +
      NAV.map((n) => `<a href="${n.href}" class="${n.key === active ? "active" : ""}"><i class="bi ${n.icon}"></i>${n.label}</a>`).join("") +
      "</nav>" +
      '<div class="side-card"><h6>Compliance team</h6><p>Review nurseries and keep the marketplace safe.</p></div>' +
      '<div class="foot">' +
      '<a class="nav-rail-foot d-flex align-items-center gap-2 text-decoration-none px-2 py-2" style="color:var(--mut);font-weight:600" href="https://code.claude.com/docs" target="_blank"><i class="bi bi-info-circle"></i> Help</a>' +
      '<a class="d-flex align-items-center gap-2 text-decoration-none px-2 py-2" style="color:var(--danger);font-weight:600;cursor:pointer" onclick="signOut()"><i class="bi bi-box-arrow-right"></i> Sign out</a>' +
      "</div>";
  };

  // Small helper to render a loading state into a container id.
  window.loading = (id) => { const e = document.getElementById(id); if (e) e.innerHTML = '<div class="spinner-pad"><div class="spinner-border text-secondary"></div></div>'; };
  window.errBox = (id, msg) => { const e = document.getElementById(id); if (e) e.innerHTML = `<div class="empty text-danger">${fmt.esc(msg)}</div>`; };
})();
