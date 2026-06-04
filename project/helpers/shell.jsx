// shell.jsx — shared bits across the three home-screen directions:
// status bar, availability badge, state switcher, and the home-state hook.
(function () {
  function useHome(initial = "default") {
    const [state, setState] = React.useState(initial);
    const [district, setDistrict] = React.useState("Abdoun");
    const [ages, setAges] = React.useState([]);
    const [sheet, setSheet] = React.useState(null);
    const [focused, setFocused] = React.useState(false);
    const [tab, setTab] = React.useState("home");
    const toggleAge = (id) =>
      setAges((a) => (a.includes(id) ? a.filter((x) => x !== id) : [...a, id]));
    return { state, setState, district, setDistrict, ages, toggleAge, sheet, setSheet, focused, setFocused, tab, setTab };
  }

  function StatusBar({ color = "#2b3a2e" }) {
    return (
      <div style={{
        height: 44, display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 22px", color, fontFamily: "Rubik, sans-serif", flexShrink: 0,
      }}>
        <span style={{ fontSize: 14, fontWeight: 600, letterSpacing: ".02em" }}>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="17" height="11" viewBox="0 0 17 11" fill={color}><rect x="0" y="7" width="3" height="4" rx="1"/><rect x="4.5" y="5" width="3" height="6" rx="1"/><rect x="9" y="2.5" width="3" height="8.5" rx="1"/><rect x="13.5" y="0" width="3" height="11" rx="1"/></svg>
          <svg width="16" height="11" viewBox="0 0 16 11" fill={color}><path d="M8 2.2c2 0 3.8.8 5.1 2L8 9.6 2.9 4.2A7.3 7.3 0 0 1 8 2.2Z" opacity="0.95"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="1" y="1" width="20" height="10" rx="3" stroke={color} strokeOpacity="0.5"/><rect x="2.5" y="2.5" width="15" height="7" rx="1.6" fill={color}/><rect x="22.5" y="4" width="1.6" height="4" rx="0.8" fill={color} fillOpacity="0.5"/></svg>
        </div>
      </div>
    );
  }

  const AVAIL = {
    available: { label: "Available", bg: "#e4f1e6", fg: "#2f7a44", dot: "#43a960" },
    limited: { label: "Few spots", bg: "#fbeede", fg: "#b06d22", dot: "#d98b34" },
    full: { label: "Full", bg: "#efece5", fg: "#8a8577", dot: "#a8a496" },
  };
  function AvailBadge({ avail, radius = 999 }) {
    const a = AVAIL[avail];
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 5, background: a.bg, color: a.fg,
        fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: radius,
        fontFamily: "Rubik, sans-serif", whiteSpace: "nowrap",
      }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: a.dot }} />
        {a.label}
      </span>
    );
  }

  // State switcher rendered ABOVE the phone (outside the screen) on the canvas.
  function StateSwitcher({ value, onChange, accent = "#4e9d6b" }) {
    const opts = [["default", "Default"], ["loading", "Loading"], ["empty", "Empty"], ["denied", "No location"]];
    return (
      <div style={{
        display: "flex", gap: 4, padding: 4, background: "#fff", borderRadius: 12,
        border: "1px solid #e7e2d6", marginBottom: 14, fontFamily: "Rubik, sans-serif",
        boxShadow: "0 1px 2px #00000008",
      }}>
        {opts.map(([id, label]) => (
          <button key={id} onClick={() => onChange(id)} style={{
            border: "none", cursor: "pointer", fontFamily: "inherit", fontSize: 11.5,
            fontWeight: 600, padding: "6px 11px", borderRadius: 8,
            background: value === id ? accent : "transparent",
            color: value === id ? "#fff" : "#8a8577",
          }}>{label}</button>
        ))}
      </div>
    );
  }

  // Shared bottom-sheet district picker (accent-themed).
  function DistrictSheet({ open, district, onPick, onClose, accent = "#4e9d6b", ink = "#2b3a2e", radius = 30 }) {
    if (!open) return null;
    const DISTRICTS = window.DISTRICTS, Icon = window.Icon;
    return (
      <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 40, background: "#2b3a2e55", display: "flex", alignItems: "flex-end", borderRadius: radius }}>
        <div onClick={(e) => e.stopPropagation()} className="fade-up" style={{ width: "100%", background: "#fff", borderRadius: `26px 26px ${radius}px ${radius}px`, padding: "10px 18px 26px", maxHeight: "72%", overflowY: "auto", fontFamily: "Rubik, sans-serif" }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "#e7e2d6", margin: "4px auto 16px" }} />
          <h3 style={{ margin: "0 0 4px", fontFamily: "'Baloo 2', cursive", fontSize: 19, color: ink }}>Choose your area</h3>
          <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#8a8577" }}>Amman, Jordan</p>
          {DISTRICTS.map((d) => (
            <button key={d} onClick={() => onPick(d)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "13px 4px", border: "none", borderBottom: "1px solid #ebe5d7", background: "transparent", cursor: "pointer", fontFamily: "Rubik, sans-serif", fontSize: 14.5, color: ink, fontWeight: d === district ? 600 : 400 }}>
              <span style={{ width: 32, height: 32, borderRadius: 999, background: d === district ? accent + "1f" : "#f6f3ea", color: d === district ? accent : "#8a8577", display: "grid", placeItems: "center" }}><Icon name="pin" size={16} /></span>
              {d}
              {d === district && <Icon name="check" size={18} stroke={accent} style={{ marginLeft: "auto" }} />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  Object.assign(window, { useHome, StatusBar, AvailBadge, StateSwitcher, DistrictSheet });
})();
