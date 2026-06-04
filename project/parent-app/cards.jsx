// cards.jsx — shared nursery card components + helpers for the Parent app.
(function () {
  const { Icon, Placeholder, AvailBadge, Rating, Verified } = window;
  const C = window.DS.C, F = window.DS.F;

  const getNursery = (id) => (window.NURSERIES || []).find((n) => n.id === id);
  const priceStr = (n) => `${n.priceFrom} JD/${n.unit}`;

  function FavBtn({ id, light, size = 32 }) {
    const { store, actions } = window.useApp();
    const on = store.favorites.includes(id);
    return (
      <button onClick={(e) => { e.stopPropagation(); actions.toggleFav(id); }} style={{ width: size, height: size, borderRadius: 999, border: "none", cursor: "pointer", background: light ? "#ffffffe6" : "#fff", color: on ? C.danger : C.mut, display: "grid", placeItems: "center", boxShadow: light ? "0 2px 6px #0002" : "none" }}>
        <Icon name="heart" size={Math.round(size * 0.52)} fill={on ? C.danger : "none"} stroke={on ? C.danger : C.mut} />
      </button>
    );
  }

  // Big or carousel feature card with image overlay (used on Home).
  function FeatureCard({ n, big }) {
    const { nav } = window.useApp();
    return (
      <div onClick={() => nav.go("nursery", { id: n.id })} style={{ width: big ? "100%" : 268, flexShrink: 0, background: "#fff", borderRadius: 20, overflow: "hidden", border: `1px solid ${C.line}`, cursor: "pointer" }}>
        <div style={{ position: "relative", height: big ? 168 : 138 }}>
          <Placeholder label="nursery photo" radius={0} tone="#3f8a5a" src={n.img} seed={n.id} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0000 40%,#1c3324cc)" }} />
          {n.sponsored && <span style={{ position: "absolute", top: 13, left: 13, background: C.amber, color: "#3a2c08", fontSize: 9.5, fontWeight: 800, letterSpacing: ".08em", padding: "4px 9px", borderRadius: 6, textTransform: "uppercase" }}>Sponsored</span>}
          <div style={{ position: "absolute", top: 11, right: 11 }}><FavBtn id={n.id} light /></div>
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <h4 style={{ margin: "0 0 3px", fontFamily: F.display, fontSize: big ? 22 : 18, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{n.name}</h4>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#fff" }}><Icon name="star" size={14} fill={C.amber} stroke={C.amber} />{n.rating} <span style={{ opacity: .8 }}>· {n.district}</span></span>
            </div>
            <AvailBadge avail={n.avail} />
          </div>
        </div>
        <div style={{ padding: "12px 15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12.5, color: C.mut }}>{n.tag}</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: C.dgreen, fontFamily: F.display }}>{n.priceFrom}<span style={{ fontSize: 11, fontWeight: 600, color: C.mut }}> JD/{n.unit}</span></span>
        </div>
      </div>
    );
  }

  // Compact horizontal row (Home "near you").
  function ListRow({ n }) {
    const { nav } = window.useApp();
    return (
      <div onClick={() => nav.go("nursery", { id: n.id })} style={{ display: "flex", gap: 14, padding: "14px 4px", borderBottom: `1px solid ${C.line}`, cursor: "pointer" }}>
        <div style={{ width: 64, height: 64, flexShrink: 0 }}><Placeholder label="photo" radius={14} tone="#3f8a5a" src={n.img} seed={n.id} /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <h4 style={{ margin: "0 0 2px", fontFamily: F.display, fontSize: 16, fontWeight: 600, color: C.ink }}>{n.name}</h4>
            <span style={{ fontSize: 15, fontWeight: 800, color: C.dgreen, fontFamily: F.display, whiteSpace: "nowrap" }}>{n.priceFrom}<span style={{ fontSize: 10.5, color: C.mut, fontWeight: 600 }}> /{n.unit}</span></span>
          </div>
          <p style={{ margin: "0 0 7px", fontSize: 12, color: C.mut }}>{n.district} · {n.tag.split(" · ")[0]}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}><Rating value={n.rating} size={12} /><AvailBadge avail={n.avail} /></div>
        </div>
      </div>
    );
  }

  // Full result card (Results list).
  const AGE_LABEL = { infant: "Infant", toddler: "Toddler", preschool: "Preschool" };
  function ResultCard({ n }) {
    const { nav } = window.useApp();
    return (
      <div onClick={() => nav.go("nursery", { id: n.id })} style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", cursor: "pointer", flexShrink: 0 }}>
        <div style={{ position: "relative", height: 132, padding: 11 }}>
          <Placeholder label="nursery photo" radius={14} tone="#3f8a5a" src={n.img} seed={n.id} />
          {n.sponsored && <span style={{ position: "absolute", top: 17, left: 17, background: C.amber, color: "#3a2c08", fontSize: 9.5, fontWeight: 800, letterSpacing: ".08em", padding: "4px 9px", borderRadius: 6, textTransform: "uppercase" }}>Sponsored</span>}
          <div style={{ position: "absolute", top: 17, right: 17 }}><FavBtn id={n.id} light /></div>
          <span style={{ position: "absolute", bottom: 17, right: 17 }}><AvailBadge avail={n.avail} /></span>
        </div>
        <div style={{ padding: "4px 15px 15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ margin: "0 0 4px", fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.ink, lineHeight: 1.15 }}>{n.name}</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><Rating value={n.rating} count={n.reviews} size={12} />{n.verified && <Verified size={11} />}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: C.dgreen, fontFamily: F.display }}>{n.priceFrom} JD</span>
              <p style={{ margin: 0, fontSize: 10.5, color: C.mut }}>from / {n.unit === "mo" ? "month" : "hour"}</p>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
            {n.ages.map((a) => <span key={a} style={{ fontSize: 11, fontWeight: 600, color: C.dgreen, background: C.tint, padding: "3px 9px", borderRadius: 999 }}>{AGE_LABEL[a]}</span>)}
            <span style={{ fontSize: 11, color: C.mut, display: "inline-flex", alignItems: "center", gap: 3, marginLeft: "auto" }}><Icon name="pin" size={12} stroke={C.mut} />{n.district} · 2.3 km</span>
          </div>
        </div>
      </div>
    );
  }

  Object.assign(window, { getNursery, priceStr, FeatureCard, ListRow, ResultCard, FavBtn });
})();
