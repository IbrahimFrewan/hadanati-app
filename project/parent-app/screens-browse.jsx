// screens-browse.jsx — P-08 Results, P-07 Filters, P-06 Map.
(function () {
  const { Icon, StatusBar, Placeholder, AvailBadge, Button, TopBar, Sheet, Pill, ResultCard, getNursery } = window;
  const C = window.DS.C, F = window.DS.F;
  const AGE_LABEL = { infant: "Infant (0–1)", toddler: "Toddler (1–3)", preschool: "Preschool (3–5)" };

  // ---- P-08 Results ----------------------------------------------------
  function Results() {
    const { nav } = window.useApp();
    const NURSERIES = window.NURSERIES;
    const initAges = nav.params.ages || [];
    const [ages, setAges] = React.useState(initAges);
    const [sortSheet, setSortSheet] = React.useState(false);
    const [sort, setSort] = React.useState("distance");
    const SORTS = { distance: "Distance", price: "Price", rating: "Rating", availability: "Availability" };
    let list = NURSERIES.filter((n) => (ages.length ? n.ages.some((a) => ages.includes(a)) : true));
    if (sort === "price") list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Nurseries" subtitle={`${list.length} in Abdoun · Amman`} onBack={() => nav.back()} right={<button onClick={() => nav.go("map", {})} style={{ width: 40, height: 40, borderRadius: 999, border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: C.ink }}><Icon name="mapAlt" size={20} /></button>} />
        {/* search + sort */}
        <div style={{ padding: "0 18px 12px", display: "flex", gap: 9 }}>
          <div onClick={() => nav.go("filters", {})} style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 12, padding: "0 13px", height: 44, cursor: "pointer" }}>
            <Icon name="search" size={18} stroke={C.mut} /><span style={{ fontSize: 13.5, color: C.mut }}>Search nurseries…</span>
          </div>
          <button onClick={() => setSortSheet(true)} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${C.line}`, background: "#fff", borderRadius: 12, padding: "0 13px", height: 44, cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.ink }}><Icon name="list" size={16} stroke={C.mut} />{SORTS[sort]}</button>
        </div>
        {/* active filter chips */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "0 18px 12px", scrollbarWidth: "none" }}>
          <Pill icon="sliders" onClick={() => nav.go("filters", {})}>Filters</Pill>
          {ages.map((a) => (
            <span key={a} style={{ display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0, background: C.tint, color: C.dgreen, borderRadius: 999, padding: "8px 11px", fontSize: 13, fontWeight: 600 }}>
              {AGE_LABEL[a].split(" (")[0]} <button onClick={() => setAges(ages.filter((x) => x !== a))} style={{ border: "none", background: "transparent", cursor: "pointer", color: C.dgreen, display: "grid", placeItems: "center", padding: 0 }}><Icon name="x" size={13} /></button>
            </span>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 18px 96px", display: "flex", flexDirection: "column", gap: 14 }}>
          {list.length === 0 ? (
            <window.EmptyView motif="stroller" title="No matches" body="Try removing a filter or widening your area." ctaLabel="Clear filters" onCta={() => setAges([])} />
          ) : list.map((n) => <ResultCard key={n.id} n={n} />)}
        </div>

        <Sheet open={sortSheet} onClose={() => setSortSheet(false)} title="Sort by">
          {Object.entries(SORTS).map(([k, v]) => (
            <button key={k} onClick={() => { setSort(k); setSortSheet(false); }} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 4px", border: "none", borderBottom: `1px solid ${C.line}`, background: "transparent", cursor: "pointer", fontFamily: F.body, fontSize: 15, color: C.ink, fontWeight: sort === k ? 700 : 400 }}>
              {v}{sort === k && <Icon name="check" size={19} stroke={C.green} />}
            </button>
          ))}
        </Sheet>
      </div>
    );
  }

  // ---- P-07 Filters ----------------------------------------------------
  function Filters() {
    const { nav } = window.useApp();
    const NURSERIES = window.NURSERIES;
    const [ages, setAges] = React.useState(nav.params.ages || []);
    const [type, setType] = React.useState("monthly");
    const [price, setPrice] = React.useState(300);
    const [services, setServices] = React.useState([]);
    const [hours, setHours] = React.useState("any");
    const [rating, setRating] = React.useState(0);
    const tog = (v, set, arr) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
    const SERVICES = ["Meals", "Transport", "Special needs", "Bilingual", "CCTV", "Outdoor"];
    const count = NURSERIES.filter((n) => (ages.length ? n.ages.some((a) => ages.includes(a)) : true) && n.priceFrom <= price && n.rating >= rating).length;

    const Group = ({ title, children }) => (
      <div style={{ marginBottom: 24 }}>
        <h3 style={{ margin: "0 0 12px", fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.ink }}>{title}</h3>
        {children}
      </div>
    );
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Filters" onBack={() => nav.back()} right={<button onClick={() => { setAges([]); setServices([]); setPrice(300); setRating(0); setHours("any"); }} style={{ border: "none", background: "transparent", color: C.dgreen, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: F.body }}>Reset</button>} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 24px" }}>
          <Group title="Age group">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{Object.keys(AGE_LABEL).map((a) => <Pill key={a} active={ages.includes(a)} onClick={() => tog(a, setAges, ages)}>{AGE_LABEL[a].split(" (")[0]}</Pill>)}</div>
          </Group>
          <Group title="Booking type">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["hourly", "daily", "weekly", "monthly"].map((t) => <Pill key={t} active={type === t} onClick={() => setType(t)}>{t[0].toUpperCase() + t.slice(1)}</Pill>)}</div>
          </Group>
          <Group title={`Price · up to ${price} JD/${type === "hourly" ? "hr" : "mo"}`}>
            <input type="range" min={type === "hourly" ? 2 : 80} max={type === "hourly" ? 20 : 400} value={price} onChange={(e) => setPrice(+e.target.value)} style={{ width: "100%", accentColor: C.green }} />
          </Group>
          <Group title="Services">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{SERVICES.map((s) => <Pill key={s} active={services.includes(s)} onClick={() => tog(s, setServices, services)}>{s}</Pill>)}</div>
          </Group>
          <Group title="Operating hours">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{[["any", "Any"], ["full", "Full day"], ["half", "Half day"]].map(([k, v]) => <Pill key={k} active={hours === k} onClick={() => setHours(k)}>{v}</Pill>)}</div>
          </Group>
          <Group title="Minimum rating">
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{[[0, "Any"], [4, "4.0+"], [4.5, "4.5+"]].map(([k, v]) => <Pill key={v} active={rating === k} onClick={() => setRating(k)} icon={k ? "star" : undefined}>{v}</Pill>)}</div>
          </Group>
        </div>
        <div style={{ padding: "12px 22px 26px", borderTop: `1px solid ${C.line}` }}>
          <Button full size="lg" disabled={count === 0} onClick={() => nav.replace("results", { ages })}>{count === 0 ? "No matches" : `Show ${count} ${count === 1 ? "result" : "results"}`}</Button>
        </div>
      </div>
    );
  }

  // ---- P-06 Map --------------------------------------------------------
  function MapView() {
    const { nav } = window.useApp();
    const NURSERIES = window.NURSERIES;
    const [sel, setSel] = React.useState(null);
    const pins = [
      { n: NURSERIES[0], top: "30%", left: "26%" },
      { n: NURSERIES[1], top: "46%", left: "62%" },
      { n: NURSERIES[2], top: "64%", left: "38%" },
      { n: NURSERIES[3], top: "24%", left: "70%" },
    ];
    return (
      <div style={{ height: "100%", position: "relative", background: "#e8ece4", overflow: "hidden" }}>
        {/* faux map */}
        <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,#dfe6da 0 38px,#e8ece4 38px 76px), repeating-linear-gradient(90deg,#0000 0 60px,#d7ded1 60px 62px)" }} />
        {/* fuzzed district areas (FR-AC-01) */}
        {pins.map((p, i) => <div key={i} style={{ position: "absolute", top: p.top, left: p.left, width: 120, height: 120, transform: "translate(-50%,-50%)", borderRadius: 999, background: "#3f8a5a22", border: "1px dashed #3f8a5a66" }} />)}
        {/* header overlay */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <StatusBar />
          <div style={{ padding: "4px 16px", display: "flex", gap: 9, alignItems: "center" }}>
            <button onClick={() => nav.back()} style={{ width: 42, height: 42, borderRadius: 999, border: "none", background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: C.ink, boxShadow: "0 2px 8px #0002" }}><Icon name="chevLeft" size={22} /></button>
            <div style={{ flex: 1, background: "#fff", borderRadius: 12, height: 42, display: "flex", alignItems: "center", gap: 8, padding: "0 13px", boxShadow: "0 2px 8px #0001" }}><Icon name="pin" size={17} stroke={C.green} /><span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>Abdoun, Amman</span></div>
            <button onClick={() => nav.replace("results", {})} style={{ width: 42, height: 42, borderRadius: 999, border: "none", background: C.header, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "0 2px 8px #0002" }}><Icon name="list" size={20} /></button>
          </div>
        </div>
        {/* approximate-location notice */}
        <div style={{ position: "absolute", top: 96, left: "50%", transform: "translateX(-50%)", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 6, background: "#fffffff2", borderRadius: 999, padding: "6px 12px", fontSize: 11, color: C.mut, fontWeight: 600, boxShadow: "0 2px 8px #0001", whiteSpace: "nowrap" }}><Icon name="info" size={13} stroke={C.mut} />Approximate areas shown until you book</div>
        {/* cluster pins */}
        {pins.map((p, i) => (
          <button key={i} onClick={() => setSel(p.n)} style={{ position: "absolute", top: p.top, left: p.left, transform: "translate(-50%,-50%)", zIndex: 3, border: "none", cursor: "pointer", background: sel === p.n ? C.header : "#fff", color: sel === p.n ? "#fff" : C.dgreen, borderRadius: 999, padding: "7px 12px", fontFamily: F.display, fontWeight: 800, fontSize: 13, boxShadow: "0 4px 12px #0003", display: "inline-flex", alignItems: "center", gap: 5 }}>
            <Icon name="pin" size={15} />{p.n.priceFrom}
          </button>
        ))}
        <button onClick={() => setSel(null)} style={{ position: "absolute", bottom: sel ? 200 : 28, left: "50%", transform: "translateX(-50%)", zIndex: 3, border: "none", cursor: "pointer", background: "#fff", color: C.dgreen, borderRadius: 999, padding: "10px 18px", fontFamily: F.body, fontWeight: 700, fontSize: 13, boxShadow: "0 4px 12px #0002", display: "inline-flex", alignItems: "center", gap: 7, transition: "bottom .2s" }}><Icon name="refresh" size={16} />Search this area</button>
        {/* mini card */}
        {sel && (
          <div className="fade-up" style={{ position: "absolute", left: 16, right: 16, bottom: 24, zIndex: 4, background: "#fff", borderRadius: 18, padding: 12, display: "flex", gap: 12, boxShadow: "0 12px 30px #0003", cursor: "pointer" }} onClick={() => nav.go("nursery", { id: sel.id })}>
            <div style={{ width: 70, height: 70, flexShrink: 0 }}><Placeholder label="photo" radius={12} tone="#3f8a5a" src={sel.img} seed={sel.id} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ margin: "0 0 3px", fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.ink }}>{sel.name}</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><window.Rating value={sel.rating} count={sel.reviews} size={12} /><AvailBadge avail={sel.avail} /></div>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.dgreen, fontFamily: F.display }}>{sel.priceFrom} JD<span style={{ fontSize: 11, color: C.mut, fontWeight: 600 }}> /{sel.unit}</span></span>
            </div>
            <Icon name="chevRight" size={20} stroke={C.mut} />
          </div>
        )}
      </div>
    );
  }

  window.SCREENS = Object.assign(window.SCREENS || {}, { results: Results, filters: Filters, map: MapView });
})();
