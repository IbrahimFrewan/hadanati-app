// screens-booking.jsx — P-10 Type, P-11 Schedule, P-12 Checkout, P-13 Confirmation.
(function () {
  const { Icon, StatusBar, Placeholder, Button, TopBar, Stepper, Toggle, Sheet, getNursery } = window;
  const C = window.DS.C, F = window.DS.F;

  const PLAN = {
    hourly: { label: "Hourly", price: 6, unit: "hr", def: "Drop-in care, billed per hour (min 2 hrs)." },
    daily: { label: "Daily", price: 14, unit: "day", def: "Full days, 7 AM – 5 PM, meals included." },
    weekly: { label: "Weekly", price: 65, unit: "wk", def: "A recurring 5-day weekday pattern." },
    monthly: { label: "Monthly", price: 160, unit: "mo", def: "A subscription that auto-renews each month." },
  };
  const planPrice = (type, n) => (type === "monthly" && n ? n.priceFrom : PLAN[type].price);

  // ---- P-10 Booking type ----------------------------------------------
  function BookType() {
    const { nav, store, actions } = window.useApp();
    const n = getNursery(store.draft.nurseryId) || window.NURSERIES[0];
    const [type, setType] = React.useState(store.draft.type || "monthly");
    const [child, setChild] = React.useState(store.draft.childId || (store.children[0] && store.children[0].id));
    const cont = () => { actions.setDraft({ type, childId: child, price: planPrice(type, n), unit: PLAN[type].unit, nurseryId: n.id, nurseryName: n.name }); nav.go("schedule", {}); };
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title={n.name} subtitle="Step 1 of 3" onBack={() => nav.back()} />
        <Stepper step={0} total={3} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 20px" }}>
          <h1 style={{ margin: "0 0 16px", fontFamily: F.display, fontSize: 23, fontWeight: 700, color: C.ink }}>How often?</h1>
          <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 26 }}>
            {Object.entries(PLAN).map(([k, p]) => {
              const on = type === k;
              return (
                <button key={k} onClick={() => setType(k)} style={{ textAlign: "left", cursor: "pointer", fontFamily: F.body, display: "flex", alignItems: "center", gap: 13, padding: 15, borderRadius: 16, border: on ? `1.5px solid ${C.green}` : `1.5px solid ${C.line}`, background: on ? C.tint : "#fff" }}>
                  <span style={{ width: 22, height: 22, borderRadius: 999, flexShrink: 0, border: on ? "none" : `1.5px solid ${C.line}`, background: on ? C.green : "#fff", color: "#fff", display: "grid", placeItems: "center" }}>{on && <Icon name="check" size={15} />}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 15, fontWeight: 700, color: C.ink }}>{p.label}</span><span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 15, color: C.dgreen }}>{planPrice(k, n)} JD<span style={{ fontSize: 11, color: C.mut, fontWeight: 600 }}>/{p.unit}</span></span></div>
                    <p style={{ margin: "3px 0 0", fontSize: 11.5, color: C.mut, lineHeight: 1.4 }}>{p.def}</p>
                  </div>
                </button>
              );
            })}
          </div>
          <h3 style={{ margin: "0 0 12px", fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.ink }}>For which child?</h3>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {store.children.map((ch) => {
              const on = child === ch.id;
              return (
                <button key={ch.id} onClick={() => setChild(ch.id)} style={{ display: "inline-flex", alignItems: "center", gap: 9, cursor: "pointer", fontFamily: F.body, padding: "8px 14px 8px 8px", borderRadius: 999, border: on ? `1.5px solid ${C.green}` : `1.5px solid ${C.line}`, background: on ? C.tint : "#fff" }}>
                  <span style={{ width: 32, height: 32, borderRadius: 999, overflow: "hidden", border: `1px solid ${C.line}` }}><Placeholder label="" radius={0} tone="#b08968" seed={ch.id} /></span>
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{ch.name}</span>
                </button>
              );
            })}
            <button onClick={() => nav.go("children", {})} style={{ display: "inline-flex", alignItems: "center", gap: 7, cursor: "pointer", fontFamily: F.body, padding: "8px 15px", borderRadius: 999, border: `1.5px dashed ${C.line}`, background: "#fff", color: C.dgreen, fontWeight: 700, fontSize: 13.5 }}><Icon name="plus" size={16} />Add child</button>
          </div>
        </div>
        <div style={{ padding: "12px 22px 26px", borderTop: `1px solid ${C.line}` }}>
          <Button full size="lg" disabled={!child} iconRight="arrowRight" onClick={cont}>Continue</Button>
        </div>
      </div>
    );
  }

  // ---- P-11 Schedule ---------------------------------------------------
  function Schedule() {
    const { nav, store, actions } = window.useApp();
    const n = getNursery(store.draft.nurseryId) || window.NURSERIES[0];
    const type = store.draft.type || "monthly";
    const unitPrice = store.draft.price || planPrice(type, n);
    const [dates, setDates] = React.useState([]);
    const [slots, setSlots] = React.useState([]);
    const [days, setDays] = React.useState([]);
    const [autorenew, setAutorenew] = React.useState(true);
    const TIMES = ["8:00", "9:00", "10:00", "11:00", "13:00", "14:00"];
    const WD = ["Sun", "Mon", "Tue", "Wed", "Thu"];
    const tog = (v, arr, set) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

    let qty = 1, summary = "";
    if (type === "hourly") { qty = slots.length; summary = `${qty} hour${qty !== 1 ? "s" : ""}`; }
    else if (type === "daily") { qty = dates.length; summary = `${qty} day${qty !== 1 ? "s" : ""}`; }
    else if (type === "weekly") { qty = 1; summary = `${days.length} weekday pattern`; }
    else { qty = 1; summary = autorenew ? "Auto-renews monthly" : "One month"; }
    const total = unitPrice * (type === "hourly" || type === "daily" ? Math.max(qty, 0) : 1);
    const ready = (type === "hourly" && slots.length) || (type === "daily" && dates.length) || (type === "weekly" && days.length) || type === "monthly";
    const cont = () => {
      const datesStr = type === "monthly" ? "Starts 1 Jul 2026" : type === "weekly" ? days.join(", ") : type === "hourly" ? `9 Jun · ${slots.join(", ")}` : dates.map((d) => d + " Jun").join(", ");
      actions.setDraft({ dates: datesStr, price: total, qty }); nav.go("checkout", {});
    };

    const Cal = ({ multi }) => (
      <div style={{ background: "#fff", border: `1px solid ${C.line}`, borderRadius: 16, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><button style={{ border: "none", background: "transparent", cursor: "pointer", color: C.mut }}><Icon name="chevLeft" size={18} /></button><span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 15, color: C.ink }}>June 2026</span><button style={{ border: "none", background: "transparent", cursor: "pointer", color: C.mut }}><Icon name="chevRight" size={18} /></button></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, textAlign: "center" }}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i} style={{ fontSize: 10.5, color: C.mut, fontWeight: 600, padding: "2px 0" }}>{d}</span>)}
          {Array.from({ length: 1 }).map((_, i) => <span key={"e" + i} />)}
          {Array.from({ length: 30 }).map((_, i) => {
            const d = i + 1; const on = dates.includes(d); const past = d < 6;
            return <button key={d} disabled={past} onClick={() => tog(d, dates, setDates)} style={{ aspectRatio: "1", border: "none", borderRadius: 10, cursor: past ? "default" : "pointer", fontFamily: F.body, fontSize: 13, fontWeight: on ? 700 : 500, background: on ? C.header : "transparent", color: past ? "#cfd4cb" : on ? "#fff" : C.ink }}>{d}</button>;
          })}
        </div>
      </div>
    );

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Choose schedule" subtitle="Step 2 of 3" onBack={() => nav.back()} />
        <Stepper step={1} total={3} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 20px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: C.cream, borderRadius: 999, padding: "6px 13px", marginBottom: 18, fontSize: 12.5, fontWeight: 700, color: C.dgreen }}><Icon name="checkCircle" size={15} stroke={C.dgreen} />{PLAN[type].label} plan</div>

          {type === "hourly" && <><h3 style={{ margin: "0 0 12px", fontFamily: F.display, fontSize: 17, color: C.ink }}>Pick time slots · 9 Jun</h3><div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 9 }}>{TIMES.map((t, i) => { const on = slots.includes(t); const full = i === 3; return <button key={t} disabled={full} onClick={() => tog(t, slots, setSlots)} style={{ padding: "13px 0", borderRadius: 12, border: on ? `1.5px solid ${C.green}` : `1.5px solid ${C.line}`, background: full ? C.cream : on ? C.tint : "#fff", color: full ? "#c2c7bd" : on ? C.dgreen : C.ink, fontWeight: 700, fontSize: 13.5, cursor: full ? "default" : "pointer", fontFamily: F.body, textDecoration: full ? "line-through" : "none" }}>{t}</button>; })}</div></>}

          {(type === "daily") && <><h3 style={{ margin: "0 0 12px", fontFamily: F.display, fontSize: 17, color: C.ink }}>Select dates</h3><Cal multi /></>}

          {type === "weekly" && <><h3 style={{ margin: "0 0 12px", fontFamily: F.display, fontSize: 17, color: C.ink }}>Weekday pattern</h3><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{WD.map((d) => { const on = days.includes(d); return <button key={d} onClick={() => tog(d, days, setDays)} style={{ flex: 1, minWidth: 56, padding: "13px 0", borderRadius: 12, border: on ? `1.5px solid ${C.green}` : `1.5px solid ${C.line}`, background: on ? C.tint : "#fff", color: on ? C.dgreen : C.ink, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: F.body }}>{d}</button>; })}</div></>}

          {type === "monthly" && <><h3 style={{ margin: "0 0 12px", fontFamily: F.display, fontSize: 17, color: C.ink }}>Start date</h3><div style={{ display: "flex", alignItems: "center", gap: 11, padding: "14px", border: `1px solid ${C.line}`, borderRadius: 14, marginBottom: 14 }}><Icon name="calendar" size={20} stroke={C.dgreen} /><span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.ink }}>1 July 2026</span><Icon name="chevDown" size={18} stroke={C.mut} /></div><div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px", background: C.cream, borderRadius: 14 }}><Icon name="refresh" size={19} stroke={C.dgreen} /><div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: C.ink }}>Auto-renew monthly</p><p style={{ margin: 0, fontSize: 11.5, color: C.mut }}>Cancel anytime before renewal.</p></div><Toggle on={autorenew} onChange={setAutorenew} /></div></>}
        </div>
        <div style={{ padding: "12px 22px 26px", borderTop: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div><p style={{ margin: 0, fontSize: 11.5, color: C.mut }}>{ready ? summary : "Select your schedule"}</p><p style={{ margin: 0, fontFamily: F.display, fontWeight: 800, fontSize: 21, color: C.ink }}>{total} JD<span style={{ fontSize: 12, color: C.mut, fontWeight: 600 }}>{type === "monthly" ? "/mo" : type === "weekly" ? "/wk" : ""}</span></p></div>
          </div>
          <Button full size="lg" disabled={!ready} iconRight="arrowRight" onClick={cont}>Continue to payment</Button>
        </div>
      </div>
    );
  }

  // ---- P-12 Checkout ---------------------------------------------------
  function Checkout() {
    const { nav, store, actions } = window.useApp();
    const n = getNursery(store.draft.nurseryId) || window.NURSERIES[0];
    const child = store.children.find((c) => c.id === store.draft.childId);
    const type = store.draft.type || "monthly";
    const sub = store.draft.price || planPrice(type, n);
    const fee = Math.round(sub * 0.05);
    const total = sub + fee;
    const [pay, setPay] = React.useState("card");
    const [t, setT] = React.useState(599);
    const [processing, setProcessing] = React.useState(false);
    React.useEffect(() => { if (t <= 0) return; const id = setTimeout(() => setT(t - 1), 1000); return () => clearTimeout(id); }, [t]);
    const mm = Math.floor(t / 60), ss = String(t % 60).padStart(2, "0");
    const PAYS = [["card", "creditCard", "Credit / debit card"], ["cliq", "phone", "CliQ transfer"], ["wallet", "wallet", "eFAWATEERcom"]];
    const doPay = () => { setProcessing(true); setTimeout(() => { actions.confirmBooking(); nav.replace("confirm", {}); }, 1300); };

    const Row = ({ label, value, bold }) => <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", fontSize: bold ? 15 : 13.5, fontWeight: bold ? 800 : 500, color: bold ? C.ink : C.mut, fontFamily: bold ? F.display : F.body }}><span>{label}</span><span style={{ color: bold ? C.dgreen : C.ink }}>{value}</span></div>;
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Checkout" subtitle="Step 3 of 3" onBack={() => nav.back()} />
        <Stepper step={2} total={3} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, background: "#fbeede", color: "#9a6310", borderRadius: 12, padding: "10px 13px", marginBottom: 18, fontSize: 12.5, fontWeight: 600 }}><Icon name="clock" size={16} stroke="#9a6310" />Spot held for <b style={{ fontVariantNumeric: "tabular-nums" }}>{mm}:{ss}</b></div>
          {/* summary */}
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 15, marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 12, marginBottom: 13 }}>
              <div style={{ width: 56, height: 56, flexShrink: 0 }}><Placeholder label="photo" radius={12} tone="#3f8a5a" src={n.img} seed={n.id} /></div>
              <div style={{ flex: 1 }}><h4 style={{ margin: "0 0 3px", fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.ink }}>{n.name}</h4><p style={{ margin: 0, fontSize: 12, color: C.mut }}>{PLAN[type].label} · {child ? child.name : "Child"}</p></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: C.mut, paddingTop: 11, borderTop: `1px solid ${C.line}` }}><Icon name="calendar" size={15} stroke={C.mut} />{store.draft.dates || "Upcoming"}</div>
          </div>
          {/* payment methods */}
          <h3 style={{ margin: "0 0 11px", fontFamily: F.display, fontSize: 16, fontWeight: 700, color: C.ink }}>Payment method</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
            {PAYS.map(([k, ic, l]) => { const on = pay === k; return (
              <button key={k} onClick={() => setPay(k)} style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 14, cursor: "pointer", fontFamily: F.body, border: on ? `1.5px solid ${C.green}` : `1.5px solid ${C.line}`, background: on ? C.tint : "#fff" }}>
                <Icon name={ic} size={20} stroke={C.dgreen} /><span style={{ flex: 1, textAlign: "left", fontSize: 14, fontWeight: 600, color: C.ink }}>{l}</span>
                <span style={{ width: 20, height: 20, borderRadius: 999, border: on ? "none" : `1.5px solid ${C.line}`, background: on ? C.green : "#fff", color: "#fff", display: "grid", placeItems: "center" }}>{on && <Icon name="check" size={13} />}</span>
              </button>
            ); })}
          </div>
          <div style={{ display: "flex", gap: 9, marginBottom: 18 }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}`, borderRadius: 12, padding: "0 13px", height: 46 }}><Icon name="tag" size={17} stroke={C.mut} /><span style={{ fontSize: 13, color: C.mut }}>Promo code</span></div>
            <Button variant="secondary" size="sm">Apply</Button>
          </div>
          <div style={{ background: C.cream, borderRadius: 16, padding: "8px 15px" }}>
            <Row label="Subtotal" value={`${sub} JD`} />
            <Row label="Service fee" value={`${fee} JD`} />
            <div style={{ borderTop: `1px solid ${C.line}`, marginTop: 4 }}><Row label="Total" value={`${total} JD`} bold /></div>
          </div>
          <p style={{ margin: "14px 2px 0", fontSize: 11, color: C.mut, lineHeight: 1.5, display: "flex", gap: 7 }}><Icon name="lock" size={15} stroke={C.mut} />Card details are entered securely via our PCI-compliant payment partner. Free cancellation up to 48h before start.</p>
        </div>
        <div style={{ padding: "12px 22px 26px", borderTop: `1px solid ${C.line}` }}>
          <Button full size="lg" disabled={processing || t <= 0} onClick={doPay}>{processing ? "Processing…" : t <= 0 ? "Hold expired — restart" : `Pay ${total} JD`}</Button>
        </div>
      </div>
    );
  }

  // ---- P-13 Confirmation ----------------------------------------------
  function Confirm() {
    const { nav, store } = window.useApp();
    const n = getNursery(store.draft.nurseryId) || window.NURSERIES[0];
    const child = store.children.find((c) => c.id === store.draft.childId);
    const ref = "HD-" + (store.draft.bookingId || "b3").toUpperCase() + "-2026";
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.header, color: C.cream }}>
        <window.MotifBackdrop color="#f4f0e6" opacity={0.07} size={170} />
        <div style={{ position: "relative", zIndex: 1, flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <StatusBar color={C.cream} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "20px 30px" }}>
            <div className="pop" style={{ width: 92, height: 92, borderRadius: 999, background: "#fff", color: C.green, display: "grid", placeItems: "center", marginBottom: 22 }}><Icon name="check" size={50} /></div>
            <h1 style={{ margin: "0 0 8px", fontFamily: F.display, fontSize: 30, fontWeight: 700 }}>You're booked!</h1>
            <p style={{ margin: "0 0 4px", fontSize: 14, opacity: .85, lineHeight: 1.5 }}>{child ? child.name : "Your child"}'s spot at <b>{n.name}</b> is confirmed.</p>
            <p style={{ margin: 0, fontSize: 12, opacity: .65, fontVariantNumeric: "tabular-nums" }}>Ref {ref}</p>
          </div>
          <div style={{ background: "#fff", color: C.ink, borderRadius: "26px 26px 0 0", padding: "22px 22px 26px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
              {[["calendar", store.draft.dates || "Upcoming"], ["users", `${PLAN[store.draft.type || "monthly"].label} · ${child ? child.name : ""}`]].map(([ic, v]) => (
                <div key={ic} style={{ display: "flex", alignItems: "center", gap: 11 }}><span style={{ width: 36, height: 36, borderRadius: 10, background: C.cream, color: C.dgreen, display: "grid", placeItems: "center" }}><Icon name={ic} size={18} /></span><span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{v}</span></div>
              ))}
            </div>
            {/* unlocked contact */}
            <div style={{ background: C.tint, borderRadius: 16, padding: 15, marginBottom: 18 }}>
              <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 700, color: C.dgreen, display: "flex", alignItems: "center", gap: 6 }}><Icon name="lock" size={14} stroke={C.dgreen} />Contact unlocked</p>
              <div style={{ display: "flex", gap: 9 }}>
                <Button variant="secondary" icon="phone" style={{ flex: 1 }}>Call</Button>
                <Button icon="chat" style={{ flex: 1 }} onClick={() => nav.tab("messages")}>Message</Button>
              </div>
            </div>
            <div style={{ display: "flex", gap: 11 }}>
              <Button variant="outline" icon="calendar" onClick={() => nav.reset("bookings")} style={{ flex: 1 }}>View booking</Button>
              <Button onClick={() => nav.reset("home")} style={{ flex: 1 }}>Done</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  window.SCREENS = Object.assign(window.SCREENS || {}, { bookType: BookType, schedule: Schedule, checkout: Checkout, confirm: Confirm });
})();
