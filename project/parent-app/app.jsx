// app.jsx — حضانتي Parent app shell: store (context), stack router, phone
// frame, bottom nav, and a screen-jumper for review. Renders into #root.
(function () {
  const { Icon, MotifBackdrop, DS } = window;
  const C = DS.C, F = DS.F;

  const AppCtx = React.createContext(null);
  const useApp = () => React.useContext(AppCtx);
  window.useApp = useApp;

  // ---- seed store ------------------------------------------------------
  function seed() {
    return {
      user: { name: "Layla Haddad", phone: "7 9123 4567", email: "", photo: false },
      children: [
        { id: "c1", name: "Yara", dob: "2023-04-12", ageGroup: "toddler", allergies: "Peanuts", photo: false },
      ],
      favorites: ["n2"],
      draft: {},
      bookings: [
        { id: "b1", nurseryId: "n2", childId: "c1", type: "monthly", status: "active", dates: "Started 1 May 2026", price: 160, unit: "mo" },
        { id: "b2", nurseryId: "n4", childId: "c1", type: "daily", status: "pending", dates: "Mon 9 Jun 2026", price: 14, unit: "day" },
      ],
      notifications: [
        { id: "t1", kind: "report", title: "New daily report", body: "Yara's day at Olive Tree Kids is ready.", time: "2h ago", read: false, target: "reportFeed" },
        { id: "t2", kind: "attendance", title: "Checked in", body: "Yara was checked in at 8:32 AM.", time: "5h ago", read: false, target: null },
        { id: "t3", kind: "emergency", title: "Early closure today", body: "Olive Tree Kids closes at 2 PM due to weather.", time: "1d ago", read: true, target: null },
        { id: "t4", kind: "payment", title: "Payment received", body: "Your May subscription was paid.", time: "3d ago", read: true, target: null },
      ],
      threads: [
        { id: "th1", nurseryId: "n2", unread: 2, last: "See you at pickup! 🌿", time: "10:24", messages: [
          { me: false, text: "Good morning! Yara had a lovely breakfast today.", time: "8:40" },
          { me: true, text: "That's wonderful, thank you!", time: "9:02" },
          { me: false, text: "She's napping now, all settled.", time: "10:20" },
          { me: false, text: "See you at pickup! 🌿", time: "10:24" },
        ] },
      ],
    };
  }

  function ParentApp() {
    const [store, setStore] = React.useState(seed);
    const [stack, setStack] = React.useState(() => {
      try { const s = JSON.parse(localStorage.getItem("hadanati_nav")); if (s && s.length) return s; } catch (e) {}
      return [{ id: "splash" }];
    });
    const [tab, setTab] = React.useState("home");
    React.useEffect(() => { try { localStorage.setItem("hadanati_nav", JSON.stringify(stack)); } catch (e) {} }, [stack]);

    const cur = stack[stack.length - 1];
    const nav = {
      cur, params: cur.params || {},
      go: (id, params) => setStack((s) => [...s, { id, params }]),
      replace: (id, params) => setStack((s) => [...s.slice(0, -1), { id, params }]),
      back: () => setStack((s) => (s.length > 1 ? s.slice(0, -1) : s)),
      reset: (id, params) => setStack([{ id, params }]),
      tab: (t) => { setTab(t); setStack([{ id: t }]); },
    };

    const actions = {
      patch: (p) => setStore((s) => ({ ...s, ...p })),
      setDraft: (d) => setStore((s) => ({ ...s, draft: { ...s.draft, ...d } })),
      toggleFav: (id) => setStore((s) => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter((x) => x !== id) : [...s.favorites, id] })),
      addChild: (ch) => setStore((s) => ({ ...s, children: [...s.children, { ...ch, id: "c" + (s.children.length + 1) }] })),
      confirmBooking: () => setStore((s) => {
        const d = s.draft; const id = "b" + (s.bookings.length + 1);
        const nb = { id, nurseryId: d.nurseryId, childId: d.childId, type: d.type, status: "confirmed", dates: d.dates || "Upcoming", price: d.price, unit: d.unit };
        return { ...s, bookings: [nb, ...s.bookings], draft: { ...s.draft, bookingId: id } };
      }),
      readNotifs: () => setStore((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      sendMessage: (threadId, text) => setStore((s) => ({ ...s, threads: s.threads.map((t) => t.id === threadId ? { ...t, last: text, unread: 0, messages: [...t.messages, { me: true, text, time: "now" }] } : t) })),
    };

    const NAV_ROOTS = ["home", "bookings", "messages", "notifications", "profile"];
    const NAV_EXTRA = ["results"]; // search results keeps the tab bar (highlight Home)
    const showNav = NAV_ROOTS.includes(cur.id) || NAV_EXTRA.includes(cur.id);
    const navActive = NAV_ROOTS.includes(cur.id) ? cur.id : "home";
    const SCREENS = window.SCREENS || {};
    const Screen = SCREENS[cur.id];

    return (
      <AppCtx.Provider value={{ store, setStore, nav, actions }}>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", gap: 14, padding: "20px 16px 40px" }}>
          <Jumper nav={nav} cur={cur.id} />
          <div style={{ width: 390, height: 844, background: C.page, borderRadius: 34, overflow: "hidden", position: "relative", fontFamily: F.body, color: C.ink, boxShadow: "0 30px 80px -24px #2b3a2e55", display: "flex", flexDirection: "column" }}>
            <div key={stack.length + cur.id} className="scr" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", position: "relative" }}>
              {Screen ? <Screen /> : <Stub id={cur.id} />}
            </div>
            {showNav && <BottomNav tab={navActive} nav={nav} unread={store.notifications.filter((n) => !n.read).length} msgs={store.threads.reduce((a, t) => a + t.unread, 0)} />}
          </div>
        </div>
      </AppCtx.Provider>
    );
  }

  function BottomNav({ tab, nav, unread, msgs }) {
    const items = [["home", "Home"], ["bookings", "Bookings"], ["messages", "Messages"], ["notifications", "Alerts"], ["profile", "Profile"]];
    const badge = { notifications: unread, messages: msgs };
    return (
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5, background: "#fffffff5", backdropFilter: "blur(10px)", borderTop: `1px solid ${C.line}`, padding: "10px 12px 20px", display: "flex", justifyContent: "space-between" }}>
        {items.map(([id, label]) => {
          const on = tab === id; const b = badge[id];
          return (
            <button key={id} onClick={() => nav.tab(id)} style={{ position: "relative", border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, color: on ? C.header : C.mut, flex: 1 }}>
              <Icon name={id === "home" ? "home" : id === "bookings" ? "calendar" : id === "messages" ? "chat" : id === "notifications" ? "bell" : "user"} size={23} fill={on ? C.tint : "none"} />
              <span style={{ fontSize: 10, fontWeight: on ? 700 : 500 }}>{label}</span>
              {b > 0 && <span style={{ position: "absolute", top: -2, right: "50%", marginRight: -16, minWidth: 16, height: 16, padding: "0 4px", borderRadius: 999, background: C.danger, color: "#fff", fontSize: 9.5, fontWeight: 700, display: "grid", placeItems: "center", border: "2px solid #fff" }}>{b}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // ---- Screen jumper (review aid, sits above the phone) ----------------
  const META = [
    ["Onboarding", [["splash", "P-01 Splash"], ["register", "P-02 Register"], ["otp", "P-03 OTP"], ["profileSetup", "P-04 Profile setup"]]],
    ["Discover", [["home", "P-05 Home"], ["map", "P-06 Map"], ["filters", "P-07 Filters"], ["results", "P-08 Results"], ["nursery", "P-09 Nursery"]]],
    ["Booking", [["bookType", "P-10 Type"], ["schedule", "P-11 Schedule"], ["checkout", "P-12 Checkout"], ["confirm", "P-13 Confirmation"], ["bookings", "P-14 My bookings"]]],
    ["Child & reports", [["children", "P-15 Children"], ["reportFeed", "P-16 Report feed"], ["reportDetail", "P-17 Report detail"]]],
    ["Comms", [["messages", "P-18 Messages"], ["notifications", "P-19 Notifications"], ["review", "P-20 Review"]]],
    ["Account", [["profile", "P-21 Profile"], ["support", "P-22 Support"]]],
  ];
  const DEFAULT_PARAMS = { nursery: { id: "n2" }, results: {}, schedule: { type: "monthly" }, reportDetail: { id: "r1" }, reportFeed: { childId: "c1" }, messages: {}, review: { nurseryId: "n2" } };

  function Jumper({ nav, cur }) {
    const SCREENS = window.SCREENS || {};
    return (
      <div style={{ width: 390, display: "flex", alignItems: "center", gap: 10, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: "8px 12px", boxShadow: "0 2px 6px #0000000a" }}>
        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 14, color: C.header, whiteSpace: "nowrap" }}>حضانتي</span>
        <span style={{ fontSize: 11, color: C.mut, fontFamily: F.body }}>Parent</span>
        <select value={SCREENS[cur] ? cur : ""} onChange={(e) => { const id = e.target.value; if (id) nav.reset(id, DEFAULT_PARAMS[id]); }}
          style={{ marginLeft: "auto", fontFamily: F.body, fontSize: 12.5, color: C.ink, border: `1px solid ${C.line}`, borderRadius: 9, padding: "6px 8px", background: C.cream, cursor: "pointer", maxWidth: 200 }}>
          <option value="">Jump to screen…</option>
          {META.map(([group, items]) => (
            <optgroup key={group} label={group}>
              {items.filter(([id]) => SCREENS[id]).map(([id, label]) => <option key={id} value={id}>{label}</option>)}
            </optgroup>
          ))}
        </select>
      </div>
    );
  }

  function Stub({ id }) {
    const { nav } = useApp();
    return (
      <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 30, textAlign: "center" }}>
        <div>
          <Icon name="sparkle" size={40} stroke={C.green} />
          <h3 style={{ fontFamily: F.display, color: C.ink, margin: "12px 0 6px" }}>“{id}” coming soon</h3>
          <p style={{ color: C.mut, fontSize: 13, margin: "0 0 16px" }}>This screen is part of the next build batch.</p>
          <window.Button onClick={() => nav.tab("home")}>Back to Home</window.Button>
        </div>
      </div>
    );
  }

  window.ParentApp = ParentApp;
  window.HAD = { AppCtx, seed, BottomNav, META, DEFAULT_PARAMS };
})();
