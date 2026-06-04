// screens-account.jsx — P-21 Profile / Settings, P-22 Support.
(function () {
  const { Icon, StatusBar, Placeholder, Button, TopBar, Toggle, Sheet, getNursery } = window;
  const C = window.DS.C, F = window.DS.F;

  function Row({ icon, label, value, onClick, danger, right, last }) {
    return (
      <div onClick={onClick} role={onClick ? "button" : undefined} style={{ width: "100%", display: "flex", alignItems: "center", gap: 13, padding: "14px 4px", borderBottom: last ? "none" : `1px solid ${C.line}`, background: "transparent", cursor: onClick ? "pointer" : "default", fontFamily: F.body, textAlign: "left" }}>
        <span style={{ width: 36, height: 36, borderRadius: 10, background: danger ? "#fbe9e4" : C.cream, color: danger ? C.danger : C.dgreen, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={icon} size={18} /></span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: danger ? C.danger : C.ink }}>{label}</span>
        {value && <span style={{ fontSize: 12.5, color: C.mut }}>{value}</span>}
        {right || (onClick && !danger && <Icon name="chevRight" size={18} stroke={C.mut} />)}
      </div>
    );
  }
  function GroupT({ children }) { return <h3 style={{ margin: "22px 0 6px", fontSize: 11.5, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: C.soft }}>{children}</h3>; }

  function Profile() {
    const { nav, store } = window.useApp();
    const [prefs, setPrefs] = React.useState({ reports: true, attendance: true, payments: true, marketing: false });
    const [lang, setLang] = React.useState("EN");
    const [del, setDel] = React.useState(false);
    const tog = (k) => setPrefs((p) => ({ ...p, [k]: !p[k] }));

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <div style={{ flex: 1, overflowY: "auto", padding: "6px 22px 96px" }}>
          <h1 style={{ margin: "0 0 18px", fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.ink }}>Profile</h1>
          {/* identity card */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 15, border: `1px solid ${C.line}`, borderRadius: 18, marginBottom: 6 }}>
            <div style={{ width: 60, height: 60, borderRadius: 999, overflow: "hidden", border: `1px solid ${C.line}` }}><Placeholder label="" radius={0} tone="#b08968" seed={store.user.name} /></div>
            <div style={{ flex: 1 }}><h3 style={{ margin: "0 0 2px", fontFamily: F.display, fontSize: 18, fontWeight: 700, color: C.ink }}>{store.user.name}</h3><p style={{ margin: 0, fontSize: 12.5, color: C.mut }}>+962 {store.user.phone}</p></div>
            <button style={{ width: 38, height: 38, borderRadius: 999, border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: C.mut }}><Icon name="edit" size={17} /></button>
          </div>

          <GroupT>Family</GroupT>
          <div><Row icon="users" label="My children" value={`${store.children.length}`} onClick={() => nav.go("children", {})} /><Row icon="heart" label="Saved nurseries" value={`${store.favorites.length}`} onClick={() => nav.tab("home")} /><Row icon="wallet" label="Payment methods" value="1 card" onClick={() => {}} last /></div>

          <GroupT>Notifications</GroupT>
          <div>
            <Row icon="image" label="Daily reports" right={<Toggle on={prefs.reports} onChange={() => tog("reports")} />} />
            <Row icon="checkCircle" label="Attendance alerts" right={<Toggle on={prefs.attendance} onChange={() => tog("attendance")} />} />
            <Row icon="wallet" label="Payment reminders" right={<Toggle on={prefs.payments} onChange={() => tog("payments")} />} />
            <Row icon="gift" label="Offers & news" right={<Toggle on={prefs.marketing} onChange={() => tog("marketing")} />} last />
          </div>

          <GroupT>Preferences</GroupT>
          <div>
            <Row icon="globe" label="Language" right={<div style={{ display: "inline-flex", background: C.cream, borderRadius: 999, padding: 3 }}>{["EN", "ع"].map((l) => <button key={l} onClick={() => setLang(l)} style={{ border: "none", cursor: "pointer", fontFamily: F.body, fontWeight: 700, fontSize: 12, padding: "5px 11px", borderRadius: 999, background: lang === l ? C.header : "transparent", color: lang === l ? "#fff" : C.mut }}>{l}</button>)}</div>} />
            <Row icon="info" label="Help & support" onClick={() => nav.go("support", {})} />
            <Row icon="shield" label="Terms & privacy" onClick={() => {}} last />
          </div>

          <div style={{ margin: "24px 0 0", padding: "10px 14px", background: C.cream, borderRadius: 12, display: "flex", gap: 9, alignItems: "center" }}>
            <Icon name="lock" size={16} stroke={C.mut} /><span style={{ fontSize: 11, color: C.mut, lineHeight: 1.4 }}>Sensitive changes (payments, password) require an OTP re-verification.</span>
          </div>

          <div style={{ marginTop: 12 }}>
            <Row icon="logout" label="Log out" onClick={() => { try { localStorage.removeItem("hadanati_nav"); } catch (e) {} nav.reset("splash"); }} />
            <Row icon="trash" label="Delete account" danger onClick={() => setDel(true)} last />
          </div>
        </div>

        <Sheet open={del} onClose={() => setDel(false)} title="Delete account?">
          <p style={{ margin: "0 0 14px", fontSize: 13.5, color: C.mut, lineHeight: 1.6 }}>This permanently removes your profile, children, saved nurseries and message history.</p>
          <div style={{ background: "#fbeede", borderRadius: 12, padding: "12px 14px", marginBottom: 18, display: "flex", gap: 9 }}><Icon name="alert" size={18} stroke="#b06d22" /><span style={{ fontSize: 12.5, color: "#8a5a16", lineHeight: 1.5 }}>You have <b>active bookings</b>. These must be cancelled or completed before deletion.</span></div>
          <div style={{ display: "flex", gap: 11 }}><Button variant="secondary" onClick={() => setDel(false)} style={{ flex: 1 }}>Keep account</Button><Button variant="danger" onClick={() => setDel(false)} style={{ flex: 1 }}>Delete</Button></div>
        </Sheet>
      </div>
    );
  }

  // ---- P-22 Support ----------------------------------------------------
  function Faq({ q, a }) {
    const [o, setO] = React.useState(false);
    return (
      <div style={{ borderBottom: `1px solid ${C.line}` }}>
        <button onClick={() => setO(!o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px 0", border: "none", background: "transparent", cursor: "pointer", fontFamily: F.body, textAlign: "left" }}>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.ink }}>{q}</span><Icon name={o ? "chevUp" : "chevDown"} size={18} stroke={C.mut} />
        </button>
        {o && <p style={{ margin: "0 0 14px", fontSize: 12.5, color: C.mut, lineHeight: 1.6 }}>{a}</p>}
      </div>
    );
  }
  function Support() {
    const { nav, store } = window.useApp();
    const active = store.bookings.find((b) => b.status === "active");
    const n = active && getNursery(active.nurseryId);
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Help & support" onBack={() => nav.back()} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 24px" }}>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", background: C.header, color: C.cream, padding: 18, marginBottom: 20 }}>
            <window.MotifBackdrop color="#f4f0e6" opacity={0.08} size={140} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <h3 style={{ margin: "0 0 5px", fontFamily: F.display, fontSize: 19, fontWeight: 700 }}>How can we help?</h3>
              <p style={{ margin: "0 0 14px", fontSize: 12.5, opacity: .85, lineHeight: 1.5 }}>Search articles or start a conversation — we usually reply within an hour.</p>
              <div style={{ display: "flex", gap: 9 }}><Button variant="secondary" icon="chat" style={{ flex: 1 }}>Start chat</Button><Button variant="secondary" icon="mail" style={{ flex: 1 }}>Open ticket</Button></div>
            </div>
          </div>

          {n && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: `1px solid ${C.line}`, borderRadius: 14, marginBottom: 20 }}>
            <Icon name="paperclip" size={17} stroke={C.dgreen} /><span style={{ flex: 1, fontSize: 12.5, color: C.ink }}>Attached: <b>active booking</b> at {n.name}</span><span style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>Auto</span>
          </div>}

          <h3 style={{ margin: "0 0 6px", fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.ink }}>Popular questions</h3>
          <Faq q="How do I cancel a booking?" a="Open My Bookings, choose the booking and tap Cancel. You'll see the exact refund before confirming, based on the nursery's policy." />
          <Faq q="When is the nursery's contact shared?" a="To keep everyone safe, exact contact details and the precise location unlock right after your booking is confirmed." />
          <Faq q="How do daily reports work?" a="While a booking is active, the nursery posts a daily report with meals, naps, activities and photos — you'll get a notification each time." />
          <Faq q="How are refunds processed?" a="Refunds return to your original payment method, typically within 5–7 business days." />

          <h3 style={{ margin: "24px 0 6px", fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.ink }}>Your tickets</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "13px", border: `1px solid ${C.line}`, borderRadius: 14 }}>
            <span style={{ width: 36, height: 36, borderRadius: 10, background: "#e4f1e6", color: "#2f7a44", display: "grid", placeItems: "center" }}><Icon name="checkCircle" size={18} /></span>
            <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.ink }}>Refund question</p><p style={{ margin: 0, fontSize: 11.5, color: C.mut }}>Resolved · 28 May</p></div>
            <Icon name="chevRight" size={18} stroke={C.mut} />
          </div>
        </div>
      </div>
    );
  }

  window.SCREENS = Object.assign(window.SCREENS || {}, { profile: Profile, support: Support });
})();
