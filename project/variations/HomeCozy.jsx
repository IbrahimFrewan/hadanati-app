// HomeCozy.jsx — Direction A: "Soft & Cozy". Pillowy cream cards, soft green,
// generous rounding, friendly. Full P-05 home/search screen, interactive.
(function () {
  const { Icon, Placeholder, StatusBar, AvailBadge, useHome, StateSwitcher, Motif, MotifBackdrop, DISTRICTS, AGE_GROUPS, NURSERIES, RECENT } = window;
  const INK = "#2b3a2e", MUT = "#7c8579", GREEN = "#4e9d6b", DGREEN = "#356a48", CREAM = "#f6f3ea", LINE = "#ebe5d7";

  function Chip({ active, children, onClick, sub }) {
    return (
      <button onClick={onClick} style={{
        flex: "1 1 0", minWidth: 0, cursor: "pointer", fontFamily: "Rubik, sans-serif",
        border: active ? `1.5px solid ${GREEN}` : `1.5px solid ${LINE}`,
        background: active ? "#e9f2ea" : "#fff", borderRadius: 18, padding: "11px 8px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 1,
        transition: "all .18s",
      }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: active ? DGREEN : INK }}>{children}</span>
        <span style={{ fontSize: 10.5, color: active ? GREEN : MUT, fontWeight: 500 }}>{sub}</span>
      </button>
    );
  }

  function SponsoredCard({ n }) {
    return (
      <div style={{
        width: 244, flexShrink: 0, background: "#fff", borderRadius: 24, overflow: "hidden",
        border: `1px solid ${LINE}`, boxShadow: "0 6px 18px #3a5c421a",
      }}>
        <div style={{ position: "relative", height: 132, padding: 10 }}>
          <Placeholder label="nursery photo" radius={16} tone="#5b8c6b" />
          <span style={{
            position: "absolute", top: 16, left: 16, background: "#fff", color: DGREEN,
            fontSize: 10, fontWeight: 700, letterSpacing: ".05em", padding: "3px 8px",
            borderRadius: 999, textTransform: "uppercase", boxShadow: "0 2px 6px #0000001a",
          }}>Sponsored</span>
          <button style={{
            position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: 999,
            border: "none", background: "#ffffffe6", color: GREEN, cursor: "pointer",
            display: "grid", placeItems: "center",
          }}><Icon name="heart" size={17} /></button>
        </div>
        <div style={{ padding: "4px 14px 15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12.5, fontWeight: 600, color: INK }}>
              <Icon name="star" size={14} fill="#e7a93a" stroke="#e7a93a" />{n.rating}
              <span style={{ color: MUT, fontWeight: 500 }}>({n.reviews})</span>
            </span>
            <AvailBadge avail={n.avail} />
          </div>
          <h4 style={{ margin: "0 0 3px", fontFamily: "'Baloo 2', cursive", fontSize: 16.5, fontWeight: 600, color: INK, lineHeight: 1.15 }}>{n.name}</h4>
          <p style={{ margin: "0 0 9px", fontSize: 11.5, color: MUT }}>{n.tag}</p>
          <div style={{ display: "flex", alignItems: "baseline", gap: 3 }}>
            <span style={{ fontSize: 17, fontWeight: 700, color: DGREEN, fontFamily: "'Baloo 2', cursive" }}>{n.priceFrom} JD</span>
            <span style={{ fontSize: 11, color: MUT }}>/ {n.unit === "mo" ? "month" : "hour"}</span>
          </div>
        </div>
      </div>
    );
  }

  function NearbyRow({ n }) {
    return (
      <div style={{ display: "flex", gap: 12, padding: 10, background: "#fff", borderRadius: 20, border: `1px solid ${LINE}` }}>
        <div style={{ width: 76, height: 76, flexShrink: 0 }}><Placeholder label="photo" radius={14} tone="#5b8c6b" /></div>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0, fontFamily: "'Baloo 2', cursive", fontSize: 14.5, fontWeight: 600, color: INK }}>{n.name}</h4>
            <Icon name="heart" size={17} stroke={MUT} />
          </div>
          <p style={{ margin: "2px 0 6px", fontSize: 11.5, color: MUT, display: "flex", alignItems: "center", gap: 3 }}>
            <Icon name="pin" size={12} stroke={MUT} />{n.district} · {n.tag.split(" · ")[0]}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 600, color: INK }}>
              <Icon name="star" size={13} fill="#e7a93a" stroke="#e7a93a" />{n.rating}
            </span>
            <AvailBadge avail={n.avail} />
            <span style={{ marginLeft: "auto", fontSize: 12.5, fontWeight: 700, color: DGREEN }}>{n.priceFrom} JD</span>
          </div>
        </div>
      </div>
    );
  }

  function Sheet({ open, district, onPick, onClose }) {
    if (!open) return null;
    return (
      <div onClick={onClose} style={{ position: "absolute", inset: 0, zIndex: 40, background: "#2b3a2e44", display: "flex", alignItems: "flex-end", borderRadius: 30 }}>
        <div onClick={(e) => e.stopPropagation()} className="fade-up" style={{
          width: "100%", background: "#fff", borderRadius: "26px 26px 30px 30px", padding: "10px 18px 26px",
          maxHeight: "70%", overflowY: "auto",
        }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: LINE, margin: "4px auto 16px" }} />
          <h3 style={{ margin: "0 0 4px", fontFamily: "'Baloo 2', cursive", fontSize: 19, color: INK }}>Choose your area</h3>
          <p style={{ margin: "0 0 16px", fontSize: 12.5, color: MUT }}>Amman, Jordan</p>
          {DISTRICTS.map((d) => (
            <button key={d} onClick={() => onPick(d)} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "13px 4px",
              border: "none", borderBottom: `1px solid ${LINE}`, background: "transparent", cursor: "pointer",
              fontFamily: "Rubik, sans-serif", fontSize: 14.5, color: INK, fontWeight: d === district ? 600 : 400,
            }}>
              <span style={{ width: 32, height: 32, borderRadius: 999, background: d === district ? "#e9f2ea" : CREAM, color: d === district ? GREEN : MUT, display: "grid", placeItems: "center" }}>
                <Icon name="pin" size={16} />
              </span>
              {d}
              {d === district && <Icon name="check" size={18} stroke={GREEN} style={{ marginLeft: "auto" }} />}
            </button>
          ))}
        </div>
      </div>
    );
  }

  function HomeCozy() {
    const h = useHome();
    const sponsored = NURSERIES.filter((n) => n.sponsored);
    const nearby = NURSERIES;
    const navItems = [["home", "Home"], ["calendar", "Bookings"], ["chat", "Messages"], ["bell", "Alerts"], ["user", "Profile"]];

    return (
     <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <StateSwitcher value={h.state} onChange={h.setState} accent={GREEN} />
      <div style={{ width: 390, height: 844, background: CREAM, borderRadius: 30, overflow: "hidden", position: "relative", fontFamily: "Rubik, sans-serif", color: INK, boxShadow: "0 30px 70px -20px #2b3a2e40", display: "flex", flexDirection: "column" }}>
        <MotifBackdrop color="#356a48" opacity={0.06} />
        <div style={{ position: "relative", zIndex: 1 }}><StatusBar /></div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 18px 100px", position: "relative", zIndex: 1 }}>
          {/* greeting */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: MUT }}>Good morning,</p>
              <h2 style={{ margin: 0, fontFamily: "'Baloo 2', cursive", fontSize: 23, fontWeight: 700, color: INK, display: "inline-flex", alignItems: "center", gap: 7 }}>Layla <Motif name="rattle" size={24} c1="#e7a93a" c2="#f6dfa6" ink="#9a6b18" /></h2>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ position: "relative", width: 44, height: 44, borderRadius: 16, border: `1px solid ${LINE}`, background: "#fff", color: INK, cursor: "pointer", display: "grid", placeItems: "center" }}>
                <Icon name="bell" size={21} />
                <span style={{ position: "absolute", top: 11, right: 12, width: 8, height: 8, borderRadius: 999, background: "#e07a5f", border: "2px solid #fff" }} />
              </button>
              <div style={{ width: 44, height: 44, borderRadius: 16, overflow: "hidden", border: `1px solid ${LINE}` }}><Placeholder label="you" radius={0} tone="#b08968" /></div>
            </div>
          </div>

          {/* location */}
          {h.state === "denied" ? (
            <div style={{ background: "#fbeede", border: "1px solid #f0d9b8", borderRadius: 18, padding: 14, marginBottom: 14, display: "flex", gap: 11, alignItems: "center" }}>
              <span style={{ width: 38, height: 38, borderRadius: 12, background: "#fff", color: "#b06d22", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="crosshair" size={20} /></span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#7a4f17" }}>Location is off</p>
                <p style={{ margin: 0, fontSize: 11.5, color: "#a06a2a" }}>Pick your area manually to see nurseries nearby.</p>
              </div>
              <button onClick={() => h.setSheet("district")} style={{ border: "none", background: "#b06d22", color: "#fff", fontFamily: "Rubik", fontWeight: 600, fontSize: 12.5, padding: "9px 13px", borderRadius: 12, cursor: "pointer" }}>Choose</button>
            </div>
          ) : (
            <button onClick={() => h.setSheet("district")} style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: `1px solid ${LINE}`, borderRadius: 999, padding: "8px 13px 8px 11px", cursor: "pointer", marginBottom: 14, fontFamily: "Rubik" }}>
              <span style={{ color: GREEN, display: "grid", placeItems: "center" }}><Icon name="pin" size={17} /></span>
              <span style={{ fontSize: 13.5, fontWeight: 600, color: INK }}>{h.district}, Amman</span>
              <Icon name="chevDown" size={16} stroke={MUT} />
            </button>
          )}

          {/* search */}
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <div onClick={() => h.setFocused(true)} style={{ flex: 1, display: "flex", alignItems: "center", gap: 9, background: "#fff", border: `1.5px solid ${h.focused ? GREEN : LINE}`, borderRadius: 18, padding: "0 14px", height: 52, cursor: "text", transition: "border .18s" }}>
              <Icon name="search" size={20} stroke={h.focused ? GREEN : MUT} />
              <span style={{ fontSize: 14.5, color: h.focused ? INK : MUT }}>Search nurseries…</span>
            </div>
            <button style={{ width: 52, height: 52, borderRadius: 18, border: "none", background: GREEN, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center", boxShadow: "0 6px 16px #4e9d6b55" }}>
              <Icon name="sliders" size={22} />
            </button>
          </div>

          {/* age chips */}
          <div style={{ display: "flex", gap: 9, marginBottom: 26 }}>
            {AGE_GROUPS.map((a) => (
              <Chip key={a.id} active={h.ages.includes(a.id)} sub={a.sub} onClick={() => h.toggleAge(a.id)}>{a.label}</Chip>
            ))}
          </div>

          {h.state === "empty" ? (
            <EmptyState onWiden={() => h.setSheet("district")} />
          ) : (
            <>
              {/* sponsored */}
              <SectionHead title="Featured nurseries" action="See all" />
              <div style={{ display: "flex", gap: 13, overflowX: "auto", margin: "0 -18px 26px", padding: "4px 18px 8px", scrollbarWidth: "none" }}>
                {h.state === "loading"
                  ? [0, 1].map((i) => <div key={i} className="skel" style={{ width: 244, height: 248, borderRadius: 24, flexShrink: 0 }} />)
                  : sponsored.map((n) => <SponsoredCard key={n.id} n={n} />)}
              </div>

              {/* recent or nearby */}
              {h.focused && h.state === "default" && (
                <div style={{ marginBottom: 26 }}>
                  <SectionHead title="Recent searches" action="Clear" />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {RECENT.map((r, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 4px", borderBottom: `1px solid ${LINE}` }}>
                        <span style={{ width: 34, height: 34, borderRadius: 999, background: "#fff", border: `1px solid ${LINE}`, color: MUT, display: "grid", placeItems: "center" }}><Icon name="clock" size={17} /></span>
                        <div style={{ flex: 1 }}>
                          <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: INK }}>{r.q}</p>
                          <p style={{ margin: 0, fontSize: 11.5, color: MUT }}>{r.sub}</p>
                        </div>
                        <Icon name="arrowRight" size={17} stroke={MUT} />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <SectionHead title="Near you" action="Map" actionIcon="mapAlt" />
              <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
                {h.state === "loading"
                  ? [0, 1, 2].map((i) => <div key={i} className="skel" style={{ height: 96, borderRadius: 20 }} />)
                  : nearby.map((n) => <NearbyRow key={n.id} n={n} />)}
              </div>
            </>
          )}
        </div>

        {/* bottom nav */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5, background: "#fffffff2", backdropFilter: "blur(10px)", borderTop: `1px solid ${LINE}`, padding: "10px 14px 20px", display: "flex", justifyContent: "space-between" }}>
          {navItems.map(([icon, label]) => {
            const on = h.tab === icon;
            return (
              <button key={icon} onClick={() => h.setTab(icon)} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? GREEN : MUT, flex: 1 }}>
                <Icon name={icon} size={23} fill={on ? "#e9f2ea" : "none"} />
                <span style={{ fontSize: 10, fontWeight: on ? 600 : 500, fontFamily: "Rubik" }}>{label}</span>
              </button>
            );
          })}
        </div>

        <Sheet open={h.sheet === "district"} district={h.district} onPick={(d) => { h.setDistrict(d); h.setSheet(null); if (h.state === "denied") h.setState("default"); }} onClose={() => h.setSheet(null)} />
      </div>
     </div>
    );
  }

  function SectionHead({ title, action, actionIcon }) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontFamily: "'Baloo 2', cursive", fontSize: 17.5, fontWeight: 600, color: INK }}>{title}</h3>
        <button style={{ border: "none", background: "transparent", cursor: "pointer", color: GREEN, fontSize: 12.5, fontWeight: 600, fontFamily: "Rubik", display: "flex", alignItems: "center", gap: 4 }}>
          {actionIcon && <Icon name={actionIcon} size={15} />}{action}
        </button>
      </div>
    );
  }

  function EmptyState({ onWiden }) {
    return (
      <div style={{ textAlign: "center", padding: "26px 16px 10px" }}>
        <div style={{ width: 104, height: 104, margin: "0 auto 18px", borderRadius: 30, background: "#e9f2ea", display: "grid", placeItems: "center" }}>
          <Motif name="teddy" size={76} c1="#cba47a" c2="#e7cfa6" ink="#4a3b2a" />
        </div>
        <h3 style={{ margin: "0 0 6px", fontFamily: "'Baloo 2', cursive", fontSize: 19, color: INK }}>No nurseries here yet</h3>
        <p style={{ margin: "0 auto 18px", fontSize: 13, color: MUT, maxWidth: 250, lineHeight: 1.5 }}>We couldn't find nurseries in this area. Try widening your search or pick a nearby district.</p>
        <button onClick={onWiden} style={{ border: "none", background: "#4e9d6b", color: "#fff", fontFamily: "Rubik", fontWeight: 600, fontSize: 14, padding: "13px 22px", borderRadius: 16, cursor: "pointer", boxShadow: "0 8px 20px #4e9d6b55" }}>Widen the search</button>
      </div>
    );
  }

  window.HomeCozy = HomeCozy;
})();
