// ds.jsx — حضانتي Editorial design system: tokens + UI primitives.
// Builds on helpers (Icon, Placeholder, Motif, MotifBackdrop, StatusBar, AvailBadge).
(function () {
  const { Icon } = window;

  const C = {
    ink: "#243528", mut: "#7c8579", soft: "#9aa195",
    green: "#3f8a5a", dgreen: "#2c5a3d", header: "#2f5e41",
    cream: "#f4f0e6", page: "#ffffff", line: "#e9e3d4",
    amber: "#e7a93a", danger: "#d9694e", info: "#3f7a8a",
    tint: "#dfeae0",
  };
  const F = { display: "'Baloo 2', cursive", body: "Rubik, sans-serif" };

  // ---- Button ----------------------------------------------------------
  function Button({ children, onClick, variant = "primary", full, size = "md", icon, iconRight, disabled, style = {} }) {
    const pads = { sm: "9px 14px", md: "13px 20px", lg: "16px 24px" };
    const fonts = { sm: 13, md: 14.5, lg: 16 };
    const skins = {
      primary: { background: disabled ? "#cdd6cd" : C.header, color: "#fff", border: "none" },
      secondary: { background: C.cream, color: C.dgreen, border: `1px solid ${C.line}` },
      ghost: { background: "transparent", color: C.dgreen, border: "none" },
      outline: { background: "#fff", color: C.dgreen, border: `1.5px solid ${C.green}` },
      danger: { background: "#fbe9e4", color: C.danger, border: "none" },
    };
    return (
      <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: full ? "100%" : "auto", padding: pads[size], borderRadius: 14,
        fontFamily: F.body, fontSize: fonts[size], fontWeight: 700, cursor: disabled ? "default" : "pointer",
        ...skins[variant], ...style,
      }}>
        {icon && <Icon name={icon} size={size === "lg" ? 20 : 18} />}
        {children}
        {iconRight && <Icon name={iconRight} size={size === "lg" ? 20 : 18} />}
      </button>
    );
  }

  // ---- TopBar ----------------------------------------------------------
  function TopBar({ title, onBack, right, theme = "light", subtitle }) {
    const dark = theme === "dark";
    return (
      <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 8, padding: "6px 16px 12px", color: dark ? C.cream : C.ink }}>
        {onBack ? (
          <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 999, border: dark ? "1px solid #ffffff2e" : `1px solid ${C.line}`, background: dark ? "#ffffff1f" : "#fff", color: "inherit", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
            <Icon name="chevLeft" size={22} />
          </button>
        ) : <span style={{ width: 40 }} />}
        <div style={{ flex: 1, textAlign: "center", minWidth: 0 }}>
          <h2 style={{ margin: 0, fontFamily: F.display, fontSize: 18, fontWeight: 700, lineHeight: 1.1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h2>
          {subtitle && <p style={{ margin: "1px 0 0", fontSize: 11.5, color: dark ? "#ffffffaa" : C.mut }}>{subtitle}</p>}
        </div>
        <div style={{ width: 40, display: "flex", justifyContent: "flex-end", flexShrink: 0 }}>{right}</div>
      </div>
    );
  }

  // ---- Card ------------------------------------------------------------
  function Card({ children, onClick, pad = 16, style = {} }) {
    return (
      <div onClick={onClick} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, padding: pad, cursor: onClick ? "pointer" : "default", ...style }}>
        {children}
      </div>
    );
  }

  // ---- Field -----------------------------------------------------------
  function Field({ label, value, onChange, placeholder, type = "text", hint, error, prefix, suffix, icon, maxLength, inputMode, autoFocus, onFocus }) {
    return (
      <label style={{ display: "block", marginBottom: 16 }}>
        {label && <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: C.ink, marginBottom: 7 }}>{label}</span>}
        <span style={{ display: "flex", alignItems: "center", gap: 9, background: "#fff", border: `1.5px solid ${error ? C.danger : C.line}`, borderRadius: 14, padding: "0 14px", height: 52 }}>
          {icon && <Icon name={icon} size={19} stroke={C.mut} />}
          {prefix && <span style={{ fontSize: 14.5, fontWeight: 600, color: C.ink }}>{prefix}</span>}
          <input value={value} onChange={(e) => onChange && onChange(e.target.value)} placeholder={placeholder} type={type} maxLength={maxLength} inputMode={inputMode} autoFocus={autoFocus} onFocus={onFocus}
            style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: F.body, fontSize: 14.5, color: C.ink }} />
          {suffix}
        </span>
        {(hint || error) && <span style={{ display: "block", fontSize: 11.5, color: error ? C.danger : C.mut, marginTop: 6 }}>{error || hint}</span>}
      </label>
    );
  }

  // ---- Toggle ----------------------------------------------------------
  function Toggle({ on, onChange }) {
    return (
      <button onClick={() => onChange(!on)} style={{ width: 46, height: 27, borderRadius: 999, border: "none", cursor: "pointer", background: on ? C.green : "#d3d9d0", position: "relative", transition: "background .18s", flexShrink: 0 }}>
        <span style={{ position: "absolute", top: 3, left: on ? 22 : 3, width: 21, height: 21, borderRadius: 999, background: "#fff", transition: "left .18s", boxShadow: "0 1px 3px #0003" }} />
      </button>
    );
  }

  // ---- SectionTitle ----------------------------------------------------
  function SectionTitle({ title, sub, action, onAction }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
        <h3 style={{ margin: 0, fontFamily: F.display, fontSize: 19, fontWeight: 700, color: C.ink }}>{title}</h3>
        {sub && !action && <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: C.green }}>{sub}</span>}
        {action && <button onClick={onAction} style={{ border: "none", background: "transparent", cursor: "pointer", color: C.green, fontSize: 12.5, fontWeight: 600, fontFamily: F.body }}>{action}</button>}
      </div>
    );
  }

  // ---- Pill ------------------------------------------------------------
  function Pill({ children, active, onClick, icon }) {
    return (
      <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: 600, padding: "8px 14px", borderRadius: 999, border: active ? `1.5px solid ${C.green}` : `1.5px solid ${C.line}`, background: active ? C.tint : "#fff", color: active ? C.dgreen : C.ink }}>
        {icon && <Icon name={icon} size={15} />}{children}
      </button>
    );
  }

  // ---- StatusPill (booking statuses) -----------------------------------
  const STATUS = {
    confirmed: { label: "Confirmed", bg: "#e4f1e6", fg: "#2f7a44" },
    active: { label: "Active", bg: "#e3eefb", fg: "#2f6ab0" },
    pending: { label: "Pending", bg: "#fbeede", fg: "#b06d22" },
    completed: { label: "Completed", bg: "#eef0ec", fg: "#6b7568" },
    cancelled: { label: "Cancelled", bg: "#fbe9e4", fg: "#c2543c" },
    requested: { label: "Requested", bg: "#f0ecfb", fg: "#6b54b0" },
  };
  function StatusPill({ status }) {
    const s = STATUS[status] || STATUS.pending;
    return <span style={{ display: "inline-flex", alignItems: "center", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: s.bg, color: s.fg, fontFamily: F.body }}>{s.label}</span>;
  }

  // ---- Stepper (progress dots for flows) -------------------------------
  function Stepper({ step, total }) {
    return (
      <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "2px 0 10px" }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{ height: 5, borderRadius: 999, width: i === step ? 22 : 5, background: i <= step ? C.green : "#d8ddd3", transition: "all .2s" }} />
        ))}
      </div>
    );
  }

  // ---- EmptyView -------------------------------------------------------
  function EmptyView({ motif = "balloon", title, body, ctaLabel, onCta, c1 = "#cfe0cf", c2 = "#3f8a5a" }) {
    const { Motif } = window;
    return (
      <div style={{ textAlign: "center", padding: "44px 24px" }}>
        <div style={{ width: 96, height: 96, margin: "0 auto 18px", display: "grid", placeItems: "center" }}><Motif name={motif} size={88} c1={c1} c2={c2} ink={C.dgreen} /></div>
        <h3 style={{ margin: "0 0 7px", fontFamily: F.display, fontSize: 20, fontWeight: 700, color: C.ink }}>{title}</h3>
        <p style={{ margin: "0 auto 20px", fontSize: 13, color: C.mut, maxWidth: 250, lineHeight: 1.55 }}>{body}</p>
        {ctaLabel && <Button onClick={onCta}>{ctaLabel}</Button>}
      </div>
    );
  }

  // ---- Sheet (generic bottom sheet) ------------------------------------
  function Sheet({ open, onClose, title, children, height }) {
    if (!open) return null;
    return (
      <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 50, background: "#1c281e66", display: "flex", alignItems: "flex-end", borderRadius: 30 }}>
        <div onClick={(e) => e.stopPropagation()} className="fade-up" style={{ width: "100%", maxHeight: height || "82%", background: "#fff", borderRadius: "26px 26px 30px 30px", padding: "10px 20px 26px", overflowY: "auto", fontFamily: F.body }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "#e7e2d6", margin: "4px auto 14px" }} />
          {title && <h3 style={{ margin: "0 0 16px", fontFamily: F.display, fontSize: 20, fontWeight: 700, color: C.ink }}>{title}</h3>}
          {children}
        </div>
      </div>
    );
  }

  // ---- Verified badge --------------------------------------------------
  function Verified({ size = 13, label = "Verified" }) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: size, fontWeight: 600, color: C.green, fontFamily: F.body }}>
        <Icon name="shield" size={size + 3} stroke={C.green} />{label}
      </span>
    );
  }

  // ---- Rating ----------------------------------------------------------
  function Rating({ value, count, size = 13 }) {
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: size, fontWeight: 600, color: C.ink, fontFamily: F.body }}>
        <Icon name="star" size={size + 1} fill={C.amber} stroke={C.amber} />{value}
        {count != null && <span style={{ color: C.mut, fontWeight: 500 }}>({count})</span>}
      </span>
    );
  }

  window.DS = { C, F };
  Object.assign(window, { Button, TopBar, Card, Field, Toggle, SectionTitle, Pill, StatusPill, Stepper, EmptyView, Sheet, Verified, Rating });
})();
