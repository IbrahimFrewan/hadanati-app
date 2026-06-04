// screens-home.jsx — P-05 Home / Search (Parent app, navigable).
(function () {
  const { Icon, StatusBar, Motif, MotifBackdrop, DistrictSheet, SectionTitle, FeatureCard, ListRow } = window;
  const C = window.DS.C, F = window.DS.F;

  function Home() {
    const { nav, store } = window.useApp();
    const NURSERIES = window.NURSERIES, AGE_GROUPS = window.AGE_GROUPS, RECENT = window.RECENT;
    const first = (store.user.name || "there").split(" ")[0];
    const [district, setDistrict] = React.useState("Abdoun");
    const [sheet, setSheet] = React.useState(false);
    const sponsored = NURSERIES.filter((n) => n.sponsored);

    return (
      <div style={{ height: "100%", overflowY: "auto", paddingBottom: 96, position: "relative" }}>
        {/* GREEN HEADER */}
        <div style={{ background: C.header, borderRadius: "0 0 30px 30px", padding: "0 22px 54px", color: C.cream, position: "relative", overflow: "hidden" }}>
          <MotifBackdrop color="#f4f0e6" opacity={0.08} size={170} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <StatusBar color={C.cream} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, marginBottom: 22 }}>
              <button onClick={() => setSheet(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ffffff1f", border: "1px solid #ffffff2e", borderRadius: 999, padding: "7px 13px", cursor: "pointer", color: C.cream, fontFamily: F.body }}>
                <Icon name="pin" size={16} /><span style={{ fontSize: 13, fontWeight: 600 }}>{district}, Amman</span><Icon name="chevDown" size={15} />
              </button>
              <div style={{ display: "flex", gap: 9 }}>
                <button onClick={() => nav.tab("notifications")} style={{ position: "relative", width: 42, height: 42, borderRadius: 999, border: "1px solid #ffffff2e", background: "#ffffff1f", color: C.cream, cursor: "pointer", display: "grid", placeItems: "center" }}>
                  <Icon name="bell" size={20} />{store.notifications.some((n) => !n.read) && <span style={{ position: "absolute", top: 9, right: 10, width: 8, height: 8, borderRadius: 999, background: C.amber, border: `2px solid ${C.header}` }} />}
                </button>
                <button onClick={() => nav.tab("profile")} style={{ width: 42, height: 42, borderRadius: 999, overflow: "hidden", border: "1px solid #ffffff3a", padding: 0, cursor: "pointer" }}><window.Placeholder label="you" radius={0} tone="#b08968" seed={store.user.name} /></button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
              <h1 style={{ margin: 0, fontFamily: F.display, fontSize: 29, fontWeight: 700, lineHeight: 1.12, letterSpacing: "-.01em" }}>Hello {first},<br />find care<br />you trust.</h1>
              <Motif name="teddy" size={80} c1="#f4f0e6" c2="#cfe0cf" ink="#2f5e41" style={{ flexShrink: 0, marginBottom: 2 }} />
            </div>
          </div>
        </div>

        {/* FLOATING SEARCH */}
        <div style={{ padding: "0 22px", marginTop: -28, position: "relative", zIndex: 2 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 9, boxShadow: "0 14px 34px -10px #2b3a2e44", display: "flex", gap: 9 }}>
            <div onClick={() => nav.go("results", {})} style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "0 12px", cursor: "text" }}>
              <Icon name="search" size={20} stroke={C.green} /><span style={{ fontSize: 14.5, color: C.mut }}>Nursery, area or service…</span>
            </div>
            <button onClick={() => nav.go("filters", {})} style={{ width: 48, height: 48, borderRadius: 14, border: "none", background: C.header, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}><Icon name="sliders" size={21} /></button>
          </div>
          {/* age quick-filters for search */}
          <div style={{ display: "flex", gap: 9, overflowX: "auto", margin: "14px -22px 0", padding: "2px 22px", scrollbarWidth: "none" }}>
            {AGE_GROUPS.map((a) => (
              <button key={a.id} onClick={() => nav.go("results", { ages: [a.id] })} style={{ flexShrink: 0, cursor: "pointer", fontFamily: F.body, border: `1px solid ${C.line}`, background: "#fff", color: C.ink, borderRadius: 14, padding: "9px 16px", display: "flex", flexDirection: "column", lineHeight: 1.15 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{a.label}</span><span style={{ fontSize: 11, color: C.mut }}>{a.sub}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ padding: "22px 22px 0" }}>
          <SectionTitle title="Featured" sub="Sponsored" />
          <div style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 13 }}><FeatureCard n={sponsored[0]} big /></div>
            <div style={{ display: "flex", gap: 13, overflowX: "auto", margin: "0 -22px", padding: "2px 22px 8px", scrollbarWidth: "none" }}>
              {sponsored.slice(1).concat(NURSERIES.filter((n) => !n.sponsored).slice(0, 1)).map((n) => <FeatureCard key={n.id} n={n} />)}
            </div>
          </div>

          <SectionTitle title="Nurseries near you" action="View map" onAction={() => nav.go("map", {})} />
          {NURSERIES.map((n) => <ListRow key={n.id} n={n} />)}
        </div>

        <DistrictSheet open={sheet} district={district} accent={C.green} ink={C.ink} onPick={(d) => { setDistrict(d); setSheet(false); }} onClose={() => setSheet(false)} />
      </div>
    );
  }

  window.SCREENS = Object.assign(window.SCREENS || {}, { home: Home });
})();
