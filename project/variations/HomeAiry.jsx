// HomeAiry.jsx — Direction C: "Calm & Airy". Spacious, near-white warm bg,
// hairline dividers, minimal shadows, restrained accents. Interactive P-05.
(function () {
  const { Icon, Placeholder, StatusBar, AvailBadge, useHome, StateSwitcher, DistrictSheet, Motif, MotifBackdrop, AGE_GROUPS, NURSERIES, RECENT } = window;
  const INK = "#2a332c", MUT = "#8b9089", GREEN = "#5a8c6a", DGREEN = "#456e52", BG = "#fbfaf5", LINE = "#ece8dd";

  function SoftCard({ n }) {
    return (
      <div style={{ width: 210, flexShrink: 0 }}>
        <div style={{ position: "relative", height: 142, marginBottom: 10 }}>
          <Placeholder label="nursery photo" radius={20} tone="#5a8c6a" />
          <button style={{ position: "absolute", top: 10, right: 10, width: 30, height: 30, borderRadius: 999, border: "none", background: "#ffffffdd", color: GREEN, cursor: "pointer", display: "grid", placeItems: "center" }}><Icon name="heart" size={16} /></button>
          {n.sponsored && <span style={{ position: "absolute", bottom: 10, left: 10, background: "#ffffffe6", color: DGREEN, fontSize: 9.5, fontWeight: 600, letterSpacing: ".06em", padding: "3px 8px", borderRadius: 999, textTransform: "uppercase" }}>Sponsored</span>}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
          <h4 style={{ margin: 0, fontFamily: "'Baloo 2', cursive", fontSize: 15.5, fontWeight: 600, color: INK }}>{n.name}</h4>
          <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, color: INK }}><Icon name="star" size={13} fill="#e0a838" stroke="#e0a838" />{n.rating}</span>
        </div>
        <p style={{ margin: "0 0 8px", fontSize: 11.5, color: MUT }}>{n.district} · {n.tag.split(" · ")[0]}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <AvailBadge avail={n.avail} />
          <span style={{ fontSize: 13.5, fontWeight: 700, color: DGREEN, fontFamily: "'Baloo 2', cursive" }}>{n.priceFrom} JD<span style={{ fontSize: 10.5, color: MUT, fontWeight: 500 }}>/{n.unit}</span></span>
        </div>
      </div>
    );
  }

  function ListItem({ n, last }) {
    return (
      <div style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: last ? "none" : `1px solid ${LINE}`, alignItems: "center" }}>
        <div style={{ width: 58, height: 58, flexShrink: 0 }}><Placeholder label="photo" radius={16} tone="#5a8c6a" /></div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ margin: "0 0 2px", fontFamily: "'Baloo 2', cursive", fontSize: 15.5, fontWeight: 600, color: INK }}>{n.name}</h4>
          <p style={{ margin: 0, fontSize: 11.5, color: MUT, display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Icon name="star" size={12} fill="#e0a838" stroke="#e0a838" />{n.rating}</span>
            <span>{n.district}</span>
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 3px", fontSize: 13.5, fontWeight: 700, color: DGREEN, fontFamily: "'Baloo 2', cursive" }}>{n.priceFrom} JD</p>
          <AvailBadge avail={n.avail} />
        </div>
      </div>
    );
  }

  function HomeAiry() {
    const h = useHome();
    const featured = NURSERIES.filter((n) => n.sponsored).concat(NURSERIES.filter((n) => !n.sponsored));
    const navItems = [["home", "Home"], ["calendar", "Bookings"], ["chat", "Messages"], ["bell", "Alerts"], ["user", "Profile"]];

    return (
     <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <StateSwitcher value={h.state} onChange={h.setState} accent={GREEN} />
      <div style={{ width: 390, height: 844, background: BG, borderRadius: 30, overflow: "hidden", position: "relative", fontFamily: "Rubik, sans-serif", color: INK, boxShadow: "0 30px 70px -20px #2b3a2e40", display: "flex", flexDirection: "column" }}>
        <MotifBackdrop color="#5a8c6a" opacity={0.045} size={240} />
        <div style={{ position: "relative", zIndex: 1 }}><StatusBar /></div>
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 24px 96px", position: "relative", zIndex: 1 }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h2 style={{ margin: "0 0 8px", fontFamily: "'Baloo 2', cursive", fontSize: 26, fontWeight: 600, color: INK, lineHeight: 1.1 }}>Hello, Layla</h2>
              {h.state === "denied" ? (
                <button onClick={() => h.setSheet("district")} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: "none", cursor: "pointer", color: "#b06d22", fontFamily: "Rubik", padding: 0 }}>
                  <Icon name="crosshair" size={15} /><span style={{ fontSize: 13, fontWeight: 600, borderBottom: "1px solid #b06d2255" }}>Set your area</span>
                </button>
              ) : (
                <button onClick={() => h.setSheet("district")} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "transparent", border: "none", cursor: "pointer", color: MUT, fontFamily: "Rubik", padding: 0 }}>
                  <Icon name="pin" size={15} stroke={GREEN} /><span style={{ fontSize: 13, fontWeight: 500, color: INK }}>{h.district}, Amman</span><Icon name="chevDown" size={14} />
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <button style={{ position: "relative", width: 40, height: 40, borderRadius: 999, border: `1px solid ${LINE}`, background: "#fff", color: INK, cursor: "pointer", display: "grid", placeItems: "center" }}>
                <Icon name="bell" size={19} /><span style={{ position: "absolute", top: 9, right: 10, width: 7, height: 7, borderRadius: 999, background: "#d98b34", border: "2px solid #fff" }} />
              </button>
              <div style={{ width: 40, height: 40, borderRadius: 999, overflow: "hidden", border: `1px solid ${LINE}` }}><Placeholder label="you" radius={0} tone="#b08968" /></div>
            </div>
          </div>

          {/* search */}
          <div onClick={() => h.setFocused(true)} style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", border: `1px solid ${h.focused ? GREEN : LINE}`, borderRadius: 16, padding: "0 16px", height: 50, marginBottom: 16, cursor: "text", transition: "border .18s" }}>
            <Icon name="search" size={19} stroke={MUT} />
            <span style={{ flex: 1, fontSize: 14, color: h.focused ? INK : MUT }}>Search nurseries…</span>
            <span style={{ width: 1, height: 22, background: LINE }} />
            <button style={{ border: "none", background: "transparent", cursor: "pointer", color: GREEN, display: "flex", alignItems: "center", gap: 5, fontFamily: "Rubik", fontSize: 13, fontWeight: 600, padding: 0 }}><Icon name="sliders" size={18} />Filter</button>
          </div>

          {/* age chips */}
          <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
            {AGE_GROUPS.map((a) => {
              const on = h.ages.includes(a.id);
              return (
                <button key={a.id} onClick={() => h.toggleAge(a.id)} style={{ flex: 1, cursor: "pointer", fontFamily: "Rubik", border: on ? `1px solid ${GREEN}` : `1px solid ${LINE}`, background: on ? "#fff" : "transparent", color: on ? DGREEN : MUT, borderRadius: 12, padding: "9px 6px", fontSize: 12.5, fontWeight: 600, transition: "all .18s" }}>{a.label}</button>
              );
            })}
          </div>

          {h.state === "empty" ? <EmptyC onWiden={() => h.setSheet("district")} /> : (
            <>
              <Label text="Featured" action="See all" />
              {h.state === "loading" ? (
                <div style={{ display: "flex", gap: 16, marginBottom: 32, overflow: "hidden" }}>{[0, 1].map((i) => <div key={i} className="skel" style={{ width: 210, height: 220, borderRadius: 20, flexShrink: 0 }} />)}</div>
              ) : (
                <div style={{ display: "flex", gap: 18, overflowX: "auto", margin: "0 -24px 32px", padding: "2px 24px 6px", scrollbarWidth: "none" }}>
                  {featured.map((n) => <SoftCard key={n.id} n={n} />)}
                </div>
              )}

              {h.focused && h.state === "default" && (
                <div style={{ marginBottom: 32 }}>
                  <Label text="Recent" action="Clear" />
                  {RECENT.map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 0", borderBottom: `1px solid ${LINE}` }}>
                      <Icon name="clock" size={17} stroke={MUT} />
                      <span style={{ flex: 1, fontSize: 14, color: INK }}>{r.q}</span>
                      <span style={{ fontSize: 11.5, color: MUT }}>{r.sub}</span>
                    </div>
                  ))}
                </div>
              )}

              <Label text="Near you" action="View map" />
              {h.state === "loading"
                ? [0, 1, 2].map((i) => <div key={i} className="skel" style={{ height: 70, borderRadius: 14, marginBottom: 12 }} />)
                : NURSERIES.map((n, i) => <ListItem key={n.id} n={n} last={i === NURSERIES.length - 1} />)}
            </>
          )}
        </div>

        {/* bottom nav */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5, background: "#fbfaf5f2", backdropFilter: "blur(10px)", borderTop: `1px solid ${LINE}`, padding: "10px 18px 20px", display: "flex", justifyContent: "space-between" }}>
          {navItems.map(([icon, label]) => {
            const on = h.tab === icon;
            return (
              <button key={icon} onClick={() => h.setTab(icon)} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? DGREEN : MUT, flex: 1 }}>
                <Icon name={icon} size={23} fill={on ? "#e6efe8" : "none"} />
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

  function Label({ text, action }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 11.5, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: MUT }}>{text}</h3>
        <button style={{ border: "none", background: "transparent", cursor: "pointer", color: GREEN, fontSize: 12.5, fontWeight: 600, fontFamily: "Rubik" }}>{action}</button>
      </div>
    );
  }

  function EmptyC({ onWiden }) {
    return (
      <div style={{ textAlign: "center", padding: "30px 16px" }}>
        <div style={{ width: 96, height: 96, margin: "0 auto 18px", display: "grid", placeItems: "center" }}><Motif name="balloon" size={84} c1="#cfe1d4" c2="#eaf2ec" ink="#5a8c6a" /></div>
        <h3 style={{ margin: "0 0 8px", fontFamily: "'Baloo 2', cursive", fontSize: 20, fontWeight: 600, color: INK }}>Nothing nearby yet</h3>
        <p style={{ margin: "0 auto 22px", fontSize: 13, color: MUT, maxWidth: 230, lineHeight: 1.55 }}>No nurseries found in this area. Try a wider radius or a nearby district.</p>
        <button onClick={onWiden} style={{ border: `1px solid ${GREEN}`, background: "#fff", color: DGREEN, fontFamily: "Rubik", fontWeight: 600, fontSize: 14, padding: "12px 24px", borderRadius: 14, cursor: "pointer" }}>Widen the search</button>
      </div>
    );
  }

  window.HomeAiry = HomeAiry;
})();
