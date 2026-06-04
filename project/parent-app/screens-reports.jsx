// screens-reports.jsx — P-16 Daily report feed, P-17 Report detail.
(function () {
  const { Icon, StatusBar, Placeholder, TopBar, getNursery } = window;
  const C = window.DS.C, F = window.DS.F;

  const MOODS = { happy: { label: "Happy", c: "#2f7a44", bg: "#e4f1e6" }, calm: { label: "Calm", c: "#2f6ab0", bg: "#e3eefb" }, playful: { label: "Playful", c: "#b06d22", bg: "#fbeede" } };
  const REPORTS = [
    { id: "r1", childId: "c1", date: "Today · 2 Jun", nurseryId: "n2", mood: "happy", sleep: "1h 25m", meals: [["Breakfast", "All"], ["Lunch", "Most"], ["Snack", "All"]], activities: ["Garden play", "Story time", "Painting"], notes: "Yara had a wonderful day! She loved finger-painting and made a little friend at story time. Ate really well today.", media: 5, unread: true },
    { id: "r2", childId: "c1", date: "Yesterday · 1 Jun", nurseryId: "n2", mood: "playful", sleep: "1h 10m", meals: [["Breakfast", "Most"], ["Lunch", "All"], ["Snack", "Some"]], activities: ["Music & movement", "Sensory bins", "Outdoor"], notes: "Energetic morning with music and movement. Settled nicely for her nap.", media: 3, unread: false },
    { id: "r3", childId: "c1", date: "Fri · 30 May", nurseryId: "n2", mood: "calm", sleep: "1h 40m", meals: [["Breakfast", "All"], ["Lunch", "Most"], ["Snack", "All"]], activities: ["Reading corner", "Blocks"], notes: "A calm, cozy day. Yara enjoyed quiet time in the reading corner.", media: 4, unread: false },
  ];

  function ReportFeed() {
    const { nav, store } = window.useApp();
    const childId = nav.params.childId || (store.children[0] && store.children[0].id);
    const child = store.children.find((c) => c.id === childId) || store.children[0];
    const list = REPORTS.filter((r) => r.childId === childId);

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Daily reports" onBack={() => nav.back()} right={<button style={{ width: 40, height: 40, borderRadius: 999, border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: C.ink }}><Icon name="calendar" size={19} /></button>} />
        {/* child switcher */}
        {store.children.length > 0 && (
          <div style={{ display: "flex", gap: 9, padding: "0 22px 12px" }}>
            {store.children.map((ch) => {
              const on = ch.id === childId;
              return <button key={ch.id} onClick={() => nav.replace("reportFeed", { childId: ch.id })} style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", fontFamily: F.body, padding: "6px 14px 6px 6px", borderRadius: 999, border: on ? `1.5px solid ${C.green}` : `1.5px solid ${C.line}`, background: on ? C.tint : "#fff" }}><span style={{ width: 28, height: 28, borderRadius: 999, overflow: "hidden" }}><Placeholder label="" radius={0} tone="#b08968" seed={ch.id} /></span><span style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{ch.name}</span></button>;
            })}
          </div>
        )}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          {list.map((r) => {
            const n = getNursery(r.nurseryId); const m = MOODS[r.mood];
            return (
              <div key={r.id} onClick={() => nav.go("reportDetail", { id: r.id })} style={{ border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", background: "#fff", cursor: "pointer", position: "relative", flexShrink: 0 }}>
                {r.unread && <span style={{ position: "absolute", top: 14, right: 14, width: 9, height: 9, borderRadius: 999, background: C.danger, zIndex: 2 }} />}
                <div style={{ padding: "14px 15px 11px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <div><p style={{ margin: "0 0 1px", fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.ink }}>{r.date}</p><p style={{ margin: 0, fontSize: 11.5, color: C.mut }}>{n ? n.name : ""}</p></div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, background: m.bg, color: m.c, fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 999, marginRight: r.unread ? 14 : 0 }}><Icon name="smile" size={14} stroke={m.c} />{m.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.ink, fontWeight: 600 }}><Icon name="meal" size={16} stroke={C.dgreen} />{r.meals.length} meals</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.ink, fontWeight: 600 }}><Icon name="sleep" size={16} stroke={C.dgreen} />{r.sleep} nap</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4, padding: "0 4px 4px" }}>
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} style={{ flex: 1, height: 88, position: "relative" }}><Placeholder label="photo" radius={i === 0 ? 10 : i === 2 ? 10 : 0} tone="#3f8a5a" seed={r.id + "-" + i} />{i === 2 && <span style={{ position: "absolute", inset: 0, background: "#1c3324aa", borderRadius: 10, display: "grid", placeItems: "center", color: "#fff", fontFamily: F.display, fontWeight: 700, fontSize: 15 }}>+{r.media - 2}</span>}</div>)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function ReportDetail() {
    const { nav } = window.useApp();
    const r = REPORTS.find((x) => x.id === nav.params.id) || REPORTS[0];
    const n = getNursery(r.nurseryId); const m = MOODS[r.mood];
    const Block = ({ icon, title, children }) => (
      <div style={{ padding: "18px 22px", borderTop: `8px solid ${C.cream}` }}>
        <h3 style={{ margin: "0 0 12px", fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.ink, display: "flex", alignItems: "center", gap: 9 }}><span style={{ width: 32, height: 32, borderRadius: 9, background: C.tint, color: C.dgreen, display: "grid", placeItems: "center" }}><Icon name={icon} size={17} /></span>{title}</h3>
        {children}
      </div>
    );
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title={r.date} subtitle={n ? n.name : ""} onBack={() => nav.back()} />
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 24 }}>
          <div style={{ padding: "4px 22px 8px" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: m.bg, color: m.c, fontSize: 13, fontWeight: 700, padding: "7px 14px", borderRadius: 999 }}><Icon name="smile" size={16} stroke={m.c} />Mood: {m.label}</span>
          </div>
          <Block icon="image" title="Photos">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
              {Array.from({ length: 4 }).map((_, i) => <div key={i} style={{ height: 120 }}><Placeholder label="photo" radius={12} tone="#3f8a5a" seed={r.id + "-d" + i} /></div>)}
            </div>
          </Block>
          <Block icon="meal" title="Meals">
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {r.meals.map(([meal, ate]) => <div key={meal} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 13px", background: C.cream, borderRadius: 12 }}><span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{meal}</span><span style={{ fontSize: 12.5, fontWeight: 700, color: C.dgreen }}>{ate} eaten</span></div>)}
            </div>
          </Block>
          <Block icon="sleep" title="Sleep">
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px", background: C.cream, borderRadius: 12 }}><Icon name="clock" size={18} stroke={C.dgreen} /><span style={{ fontSize: 13.5, color: C.ink, fontWeight: 600 }}>Napped {r.sleep} · 12:30 – 1:55 PM</span></div>
          </Block>
          <Block icon="play" title="Activities">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{r.activities.map((a) => <span key={a} style={{ fontSize: 12.5, fontWeight: 600, color: C.ink, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 999, padding: "8px 13px" }}>{a}</span>)}</div>
          </Block>
          <Block icon="chat" title="Staff note">
            <p style={{ margin: 0, fontSize: 13.5, color: C.mut, lineHeight: 1.65 }}>{r.notes}</p>
            <p style={{ margin: "14px 0 0", fontSize: 11.5, color: C.soft, display: "flex", alignItems: "center", gap: 6 }}><Icon name="lock" size={13} stroke={C.soft} />Shared privately with you while your booking is active.</p>
          </Block>
        </div>
      </div>
    );
  }

  window.SCREENS = Object.assign(window.SCREENS || {}, { reportFeed: ReportFeed, reportDetail: ReportDetail });
})();
