// screens-bookings.jsx — P-14 My Bookings.
(function () {
  const { Icon, StatusBar, Placeholder, Button, Sheet, StatusPill, EmptyView, getNursery } = window;
  const C = window.DS.C, F = window.DS.F;
  const PLAN_LABEL = { hourly: "Hourly", daily: "Daily", weekly: "Weekly", monthly: "Monthly" };
  const TABS = { upcoming: ["confirmed", "pending", "requested"], active: ["active"], past: ["completed", "cancelled"] };

  function MyBookings() {
    const { nav, store, setStore } = window.useApp();
    const [tab, setTab] = React.useState("active");
    const [cancel, setCancel] = React.useState(null);
    const child = (id) => store.children.find((c) => c.id === id);
    const list = store.bookings.filter((b) => TABS[tab].includes(b.status));
    const doCancel = () => { setStore((s) => ({ ...s, bookings: s.bookings.map((b) => b.id === cancel.id ? { ...b, status: "cancelled" } : b) })); setCancel(null); };

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <div style={{ padding: "6px 22px 14px" }}>
          <h1 style={{ margin: 0, fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.ink }}>My bookings</h1>
        </div>
        <div style={{ display: "flex", gap: 4, padding: "0 22px 14px" }}>
          {Object.keys(TABS).map((t) => {
            const on = tab === t; const cnt = store.bookings.filter((b) => TABS[t].includes(b.status)).length;
            return <button key={t} onClick={() => setTab(t)} style={{ flex: 1, border: "none", cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: 700, padding: "9px 0", borderRadius: 11, background: on ? C.header : C.cream, color: on ? "#fff" : C.mut, textTransform: "capitalize" }}>{t} {cnt > 0 && `· ${cnt}`}</button>;
          })}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 22px 96px", display: "flex", flexDirection: "column", gap: 13 }}>
          {list.length === 0 ? (
            <EmptyView motif="balloon" title={`No ${tab} bookings`} body={tab === "upcoming" ? "Find a nursery and book your child's spot." : "Nothing here yet."} ctaLabel={tab === "upcoming" ? "Find a nursery" : undefined} onCta={() => nav.tab("home")} />
          ) : list.map((b) => {
            const n = getNursery(b.nurseryId); const ch = child(b.childId); if (!n) return null;
            return (
              <div key={b.id} style={{ border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", background: "#fff", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: 13, padding: 13 }}>
                  <div style={{ width: 62, height: 62, flexShrink: 0 }}><Placeholder label="photo" radius={12} tone="#3f8a5a" src={n.img} seed={n.id} /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><h4 style={{ margin: "0 0 3px", fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.ink }}>{n.name}</h4><StatusPill status={b.status} /></div>
                    <p style={{ margin: "0 0 5px", fontSize: 12, color: C.mut }}>{PLAN_LABEL[b.type]} · {ch ? ch.name : ""}</p>
                    <p style={{ margin: 0, fontSize: 12, color: C.ink, display: "flex", alignItems: "center", gap: 5, fontWeight: 600 }}><Icon name="calendar" size={13} stroke={C.dgreen} />{b.dates}</p>
                  </div>
                </div>
                <div style={{ display: "flex", borderTop: `1px solid ${C.line}` }}>
                  <Act icon="eye" label="View" onClick={() => nav.go("nursery", { id: n.id })} />
                  {b.status !== "cancelled" && b.status !== "completed" && <><Sep /><Act icon="chat" label="Message" onClick={() => nav.tab("messages")} /></>}
                  {(b.status === "confirmed" || b.status === "pending" || b.status === "active") && <><Sep /><Act icon="x" label="Cancel" danger onClick={() => setCancel({ id: b.id, price: b.price, n })} /></>}
                  {b.status === "completed" && <><Sep /><Act icon="refresh" label="Re-book" onClick={() => { nav.go("nursery", { id: n.id }); }} /></>}
                  {b.status === "completed" && <><Sep /><Act icon="star" label="Review" onClick={() => nav.go("review", { nurseryId: n.id })} /></>}
                </div>
              </div>
            );
          })}
        </div>

        <Sheet open={!!cancel} onClose={() => setCancel(null)} title="Cancel booking?">
          {cancel && <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#e4f1e6", borderRadius: 12, padding: "13px", marginBottom: 16 }}>
              <Icon name="checkCircle" size={20} stroke="#2f7a44" />
              <div><p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#2f7a44" }}>Full refund · {cancel.price} JD</p><p style={{ margin: 0, fontSize: 11.5, color: "#3d7a4f" }}>You're cancelling more than 48h before the start date.</p></div>
            </div>
            <p style={{ margin: "0 0 18px", fontSize: 13, color: C.mut, lineHeight: 1.55 }}>Your spot at {cancel.n.name} will be released and the amount refunded to your original payment method within 5–7 days.</p>
            <div style={{ display: "flex", gap: 11 }}>
              <Button variant="secondary" onClick={() => setCancel(null)} style={{ flex: 1 }}>Keep booking</Button>
              <Button variant="danger" onClick={doCancel} style={{ flex: 1 }}>Cancel & refund</Button>
            </div>
          </>}
        </Sheet>
      </div>
    );
  }

  function Act({ icon, label, onClick, danger }) {
    return <button onClick={onClick} style={{ flex: 1, border: "none", background: "transparent", cursor: "pointer", padding: "12px 0", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: F.body, fontSize: 12.5, fontWeight: 600, color: danger ? C.danger : C.dgreen }}><Icon name={icon} size={16} />{label}</button>;
  }
  const Sep = () => <span style={{ width: 1, background: C.line }} />;

  window.SCREENS = Object.assign(window.SCREENS || {}, { bookings: MyBookings });
})();
