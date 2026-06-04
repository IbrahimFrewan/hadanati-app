// print.jsx — paged print harness: renders every Parent screen into its own
// phone frame, one per page, for PDF export.
(function () {
  const { DS } = window; const C = DS.C, F = DS.F;
  const { AppCtx, seed, BottomNav, META, DEFAULT_PARAMS } = window.HAD;
  const NAV_ROOTS = ["home", "bookings", "messages", "notifications", "profile"];
  const NAV_EXTRA = ["results"];

  function PhonePage({ id, label }) {
    const SCREENS = window.SCREENS || {};
    const Screen = SCREENS[id];
    const [store, setStore] = React.useState(() => {
      const s = seed();
      s.draft = { nurseryId: "n2", nurseryName: "Olive Tree Kids", type: "monthly", childId: "c1", price: 160, unit: "mo", dates: "Starts 1 Jul 2026", bookingId: "b3" };
      return s;
    });
    const params = DEFAULT_PARAMS[id] || {};
    const nav = { cur: { id, params }, params, go() {}, replace() {}, back() {}, reset() {}, tab() {} };
    const actions = { patch() {}, setDraft() {}, toggleFav() {}, addChild() {}, confirmBooking() {}, readNotifs() {}, sendMessage() {} };
    const showNav = NAV_ROOTS.includes(id) || NAV_EXTRA.includes(id);
    const navActive = NAV_ROOTS.includes(id) ? id : "home";
    if (!Screen) return null;
    return (
      <div className="page">
        <div className="cap">{label}</div>
        <div className="phone">
          <AppCtx.Provider value={{ store, setStore, nav, actions }}>
            <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", position: "relative" }}>
              <Screen />
            </div>
            {showNav && <BottomNav tab={navActive} nav={nav} unread={store.notifications.filter((n) => !n.read).length} msgs={store.threads.reduce((a, t) => a + t.unread, 0)} />}
          </AppCtx.Provider>
        </div>
      </div>
    );
  }

  function PrintDeck() {
    const flat = [];
    META.forEach(([group, items]) => items.forEach(([id, label]) => { if ((window.SCREENS || {})[id]) flat.push({ id, label }); }));
    return (
      <div>
        <div className="cover">
          <div className="cover-badge">حضانتي</div>
          <h1>Parent App</h1>
          <p>{flat.length} screens · Bold &amp; Editorial system</p>
        </div>
        {flat.map((s) => <PhonePage key={s.id} id={s.id} label={s.label} />)}
      </div>
    );
  }
  window.PrintDeck = PrintDeck;
})();
