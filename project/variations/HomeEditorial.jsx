// HomeEditorial.jsx — Direction B: "Bold & Editorial". Deep-green header block,
// big display type, floating search card, color-blocking. Interactive P-05.
(function () {
  const { Icon, Placeholder, StatusBar, AvailBadge, useHome, StateSwitcher, DistrictSheet, Motif, MotifBackdrop, AGE_GROUPS, NURSERIES, RECENT } = window;
  const INK = "#243528", MUT = "#7c8579", GREEN = "#3f8a5a", DGREEN = "#2c5a3d", HEADER = "#2f5e41", CREAM = "#f4f0e6", LINE = "#e9e3d4";

  function FeatureCard({ n, big }) {
    return (
      <div style={{ width: big ? "100%" : 268, flexShrink: 0, background: "#fff", borderRadius: 20, overflow: "hidden", border: `1px solid ${LINE}` }}>
        <div style={{ position: "relative", height: big ? 168 : 138 }}>
          <Placeholder label="nursery photo" radius={0} tone="#3f8a5a" />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#0000 40%,#1c3324cc)" }} />
          <span style={{ position: "absolute", top: 13, left: 13, background: "#e7a93a", color: "#3a2c08", fontSize: 9.5, fontWeight: 800, letterSpacing: ".08em", padding: "4px 9px", borderRadius: 6, textTransform: "uppercase" }}>Sponsored</span>
          <div style={{ position: "absolute", left: 14, right: 14, bottom: 12, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div>
              <h4 style={{ margin: "0 0 3px", fontFamily: "'Baloo 2', cursive", fontSize: big ? 22 : 18, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{n.name}</h4>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "#fff" }}>
                <Icon name="star" size={14} fill="#e7a93a" stroke="#e7a93a" />{n.rating} <span style={{ opacity: .8 }}>· {n.district}</span>
              </span>
            </div>
            <AvailBadge avail={n.avail} />
          </div>
        </div>
        <div style={{ padding: "12px 15px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12.5, color: MUT }}>{n.tag}</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: DGREEN, fontFamily: "'Baloo 2', cursive" }}>{n.priceFrom}<span style={{ fontSize: 11, fontWeight: 600, color: MUT }}> JD/{n.unit}</span></span>
        </div>
      </div>
    );
  }

  function ListRow({ n }) {
    return (
      <div style={{ display: "flex", gap: 14, padding: "14px 4px", borderBottom: `1px solid ${LINE}` }}>
        <div style={{ width: 64, height: 64, flexShrink: 0 }}><Placeholder label="photo" radius={14} tone="#3f8a5a" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h4 style={{ margin: "0 0 2px", fontFamily: "'Baloo 2', cursive", fontSize: 16, fontWeight: 600, color: INK }}>{n.name}</h4>
            <span style={{ fontSize: 15, fontWeight: 800, color: DGREEN, fontFamily: "'Baloo 2', cursive" }}>{n.priceFrom}<span style={{ fontSize: 10.5, color: MUT, fontWeight: 600 }}> /{n.unit}</span></span>
          </div>
          <p style={{ margin: "0 0 7px", fontSize: 12, color: MUT }}>{n.district} · {n.tag.split(" · ")[0]}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, color: INK }}><Icon name="star" size={13} fill="#e7a93a" stroke="#e7a93a" />{n.rating}</span>
            <AvailBadge avail={n.avail} />
          </div>
        </div>
      </div>
    );
  }

  function HomeEditorial() {
    const h = useHome();
    const sponsored = NURSERIES.filter((n) => n.sponsored);
    const navItems = [["home", "Home"], ["calendar", "Bookings"], ["chat", "Messages"], ["bell", "Alerts"], ["user", "Profile"]];

    return (
     <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <StateSwitcher value={h.state} onChange={h.setState} accent={GREEN} />
      <div style={{ width: 390, height: 844, background: "#fff", borderRadius: 30, overflow: "hidden", position: "relative", fontFamily: "Rubik, sans-serif", color: INK, boxShadow: "0 30px 70px -20px #2b3a2e40", display: "flex", flexDirection: "column" }}>
        <MotifBackdrop color="#2f5e41" opacity={0.05} />
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 96, position: "relative", zIndex: 1 }}>
          {/* GREEN HEADER */}
          <div style={{ background: HEADER, borderRadius: "0 0 30px 30px", padding: "0 22px 46px", color: CREAM, position: "relative", overflow: "hidden" }}>
            <MotifBackdrop color="#f4f0e6" opacity={0.08} size={170} />
            <div style={{ position: "relative", zIndex: 1 }}>
            <StatusBar color={CREAM} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4, marginBottom: 22 }}>
              {h.state === "denied" ? (
                <button onClick={() => h.setSheet("district")} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#ffffff22", border: "1px solid #ffffff33", borderRadius: 999, padding: "7px 13px", cursor: "pointer", color: CREAM, fontFamily: "Rubik" }}>
                  <Icon name="crosshair" size={16} /><span style={{ fontSize: 13, fontWeight: 600 }}>Set your area</span>
                </button>
              ) : (
                <button onClick={() => h.setSheet("district")} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ffffff1f", border: "1px solid #ffffff2e", borderRadius: 999, padding: "7px 13px", cursor: "pointer", color: CREAM, fontFamily: "Rubik" }}>
                  <Icon name="pin" size={16} /><span style={{ fontSize: 13, fontWeight: 600 }}>{h.district}, Amman</span><Icon name="chevDown" size={15} />
                </button>
              )}
              <div style={{ display: "flex", gap: 9 }}>
                <button style={{ position: "relative", width: 42, height: 42, borderRadius: 999, border: "1px solid #ffffff2e", background: "#ffffff1f", color: CREAM, cursor: "pointer", display: "grid", placeItems: "center" }}>
                  <Icon name="bell" size={20} /><span style={{ position: "absolute", top: 9, right: 10, width: 8, height: 8, borderRadius: 999, background: "#e7a93a", border: `2px solid ${HEADER}` }} />
                </button>
                <div style={{ width: 42, height: 42, borderRadius: 999, overflow: "hidden", border: "1px solid #ffffff3a" }}><Placeholder label="you" radius={0} tone="#b08968" /></div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, marginBottom: 24 }}>
              <h1 style={{ margin: 0, fontFamily: "'Baloo 2', cursive", fontSize: 33, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-.01em" }}>
                Find care<br />you can trust.
              </h1>
              <Motif name="teddy" size={88} c1="#f4f0e6" c2="#cfe0cf" ink="#2f5e41" style={{ flexShrink: 0, marginBottom: 2 }} />
            </div>
            </div>
          </div>

          {/* FLOATING SEARCH */}
          <div style={{ padding: "0 22px", marginTop: -28, position: "relative", zIndex: 2 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: 9, boxShadow: "0 14px 34px -10px #2b3a2e44", display: "flex", gap: 9 }}>
              <div onClick={() => h.setFocused(true)} style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, padding: "0 12px", cursor: "text" }}>
                <Icon name="search" size={20} stroke={GREEN} />
                <span style={{ fontSize: 14.5, color: h.focused ? INK : MUT }}>Nursery, area or service…</span>
              </div>
              <button style={{ width: 48, height: 48, borderRadius: 14, border: "none", background: HEADER, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}><Icon name="sliders" size={21} /></button>
            </div>
          </div>

          <div style={{ padding: "22px 22px 0" }}>
            {/* age groups bold */}
            <div style={{ display: "flex", gap: 9, overflowX: "auto", margin: "0 -22px 28px", padding: "2px 22px", scrollbarWidth: "none" }}>
              {AGE_GROUPS.map((a) => {
                const on = h.ages.includes(a.id);
                return (
                  <button key={a.id} onClick={() => h.toggleAge(a.id)} style={{ flexShrink: 0, cursor: "pointer", fontFamily: "Rubik", border: "none", background: on ? HEADER : CREAM, color: on ? CREAM : INK, borderRadius: 14, padding: "10px 16px", display: "flex", flexDirection: "column", lineHeight: 1.15, transition: "all .18s" }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{a.label}</span>
                    <span style={{ fontSize: 11, opacity: .7 }}>{a.sub}</span>
                  </button>
                );
              })}
            </div>

            {h.state === "empty" ? <EmptyB onWiden={() => h.setSheet("district")} /> : (
              <>
                <Head title="Featured" sub="Sponsored" />
                {h.state === "loading" ? (
                  <div className="skel" style={{ height: 240, borderRadius: 20, marginBottom: 28 }} />
                ) : (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ marginBottom: 13 }}><FeatureCard n={sponsored[0]} big /></div>
                    <div style={{ display: "flex", gap: 13, overflowX: "auto", margin: "0 -22px", padding: "2px 22px 8px", scrollbarWidth: "none" }}>
                      {sponsored.slice(1).concat(NURSERIES.filter(n=>!n.sponsored).slice(0,1)).map((n) => <FeatureCard key={n.id} n={n} />)}
                    </div>
                  </div>
                )}

                {h.focused && h.state === "default" && (
                  <div style={{ marginBottom: 28 }}>
                    <Head title="Recent" />
                    {RECENT.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 4px", borderBottom: `1px solid ${LINE}` }}>
                        <Icon name="clock" size={18} stroke={MUT} />
                        <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{r.q}</p><p style={{ margin: 0, fontSize: 11.5, color: MUT }}>{r.sub}</p></div>
                        <Icon name="arrowRight" size={17} stroke={MUT} />
                      </div>
                    ))}
                  </div>
                )}

                <Head title="Nurseries near you" sub="Map" />
                {h.state === "loading"
                  ? [0, 1, 2].map((i) => <div key={i} className="skel" style={{ height: 92, borderRadius: 14, marginBottom: 10 }} />)
                  : NURSERIES.map((n) => <ListRow key={n.id} n={n} />)}
              </>
            )}
          </div>
        </div>

        {/* bottom nav */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5, background: "#fffffff5", backdropFilter: "blur(10px)", borderTop: `1px solid ${LINE}`, padding: "10px 14px 20px", display: "flex", justifyContent: "space-between" }}>
          {navItems.map(([icon, label]) => {
            const on = h.tab === icon;
            return (
              <button key={icon} onClick={() => h.setTab(icon)} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? HEADER : MUT, flex: 1 }}>
                <Icon name={icon} size={23} fill={on ? "#dfeae0" : "none"} />
                <span style={{ fontSize: 10, fontWeight: on ? 600 : 500 }}>{label}</span>
              </button>
            );
          })}
        </div>

        <DistrictSheet open={h.sheet === "district"} district={h.district} accent={GREEN} ink={INK} onPick={(d) => { h.setDistrict(d); h.setSheet(null); if (h.state === "denied") h.setState("default"); }} onClose={() => h.setSheet(null)} />
      </div>
     </div>
    );
  }

  function Head({ title, sub }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontFamily: "'Baloo 2', cursive", fontSize: 21, fontWeight: 700, color: INK }}>{title}</h3>
        {sub && <span style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase", color: GREEN }}>{sub}</span>}
      </div>
    );
  }

  function EmptyB({ onWiden }) {
    return (
      <div style={{ textAlign: "center", padding: "20px 16px" }}>
        <div style={{ width: 92, height: 92, margin: "0 auto 16px", display: "grid", placeItems: "center" }}><Motif name="stroller" size={88} c1="#cfe0cf" c2="#3f8a5a" ink="#2c5a3d" /></div>
        <h3 style={{ margin: "0 0 6px", fontFamily: "'Baloo 2', cursive", fontSize: 22, color: INK }}>Nothing in this area</h3>
        <p style={{ margin: "0 auto 18px", fontSize: 13, color: MUT, maxWidth: 240, lineHeight: 1.5 }}>No nurseries match here yet. Widen the radius to see more options.</p>
        <button onClick={onWiden} style={{ border: "none", background: HEADER, color: "#fff", fontFamily: "Rubik", fontWeight: 700, fontSize: 14, padding: "13px 24px", borderRadius: 14, cursor: "pointer" }}>Widen the search</button>
      </div>
    );
  }

  window.HomeEditorial = HomeEditorial;
})();
