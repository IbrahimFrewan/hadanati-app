// screens-nursery.jsx — P-09 Nursery profile (trust & convert).
(function () {
  const { Icon, StatusBar, Placeholder, AvailBadge, Rating, Verified, Button, FavBtn, getNursery } = window;
  const C = window.DS.C, F = window.DS.F;
  const AGES = { infant: "Infant · 0–1 yr", toddler: "Toddler · 1–3 yrs", preschool: "Preschool · 3–5 yrs" };

  function Section({ title, children, action, onAction }) {
    return (
      <div style={{ padding: "20px 22px", borderTop: `8px solid ${C.cream}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 13 }}>
          <h3 style={{ margin: 0, fontFamily: F.display, fontSize: 18, fontWeight: 700, color: C.ink }}>{title}</h3>
          {action && <button onClick={onAction} style={{ border: "none", background: "transparent", color: C.green, fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: F.body }}>{action}</button>}
        </div>
        {children}
      </div>
    );
  }

  function Policy({ icon, title, body }) {
    const [open, setOpen] = React.useState(false);
    return (
      <div style={{ borderBottom: `1px solid ${C.line}` }}>
        <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 11, padding: "13px 0", border: "none", background: "transparent", cursor: "pointer", fontFamily: F.body }}>
          <span style={{ width: 34, height: 34, borderRadius: 10, background: C.cream, color: C.dgreen, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={icon} size={18} /></span>
          <span style={{ flex: 1, textAlign: "left", fontSize: 14, fontWeight: 600, color: C.ink }}>{title}</span>
          <Icon name={open ? "chevUp" : "chevDown"} size={18} stroke={C.mut} />
        </button>
        {open && <p style={{ margin: "0 0 14px 45px", fontSize: 12.5, color: C.mut, lineHeight: 1.55 }}>{body}</p>}
      </div>
    );
  }

  function Nursery() {
    const { nav, actions } = window.useApp();
    const n = getNursery(nav.params.id) || window.NURSERIES[0];
    const plans = [
      { type: "hourly", label: "Hourly", price: 6, unit: "hr", note: "Drop-in, min 2 hours" },
      { type: "daily", label: "Daily", price: 14, unit: "day", note: "Full day 7am–5pm" },
      { type: "weekly", label: "Weekly", price: 65, unit: "wk", note: "5 days, meals included" },
      { type: "monthly", label: "Monthly", price: n.priceFrom, unit: "mo", note: "Auto-renews, cancel anytime" },
    ];
    const reviews = [
      { name: "Rana K.", rating: 5, date: "May 2026", text: "The daily photo reports made my first month back at work so much easier. Staff are warm and professional." },
      { name: "Omar S.", rating: 5, date: "Apr 2026", text: "Clean, safe and genuinely caring. Yara settled in within a week." },
    ];
    const book = () => { actions.setDraft({ nurseryId: n.id, nurseryName: n.name }); nav.go("bookType", {}); };

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 12 }}>
          {/* gallery */}
          <div style={{ position: "relative", height: 280 }}>
            <Placeholder label="gallery · photo / video" radius={0} tone="#3f8a5a" src={n.img} seed={n.id} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#1c332488 0 64px,#0000 120px)" }} />
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 2 }}>
              <StatusBar color="#fff" />
              <div style={{ display: "flex", justifyContent: "space-between", padding: "2px 16px" }}>
                <button onClick={() => nav.back()} style={{ width: 42, height: 42, borderRadius: 999, border: "none", background: "#ffffffe6", cursor: "pointer", display: "grid", placeItems: "center", color: C.ink }}><Icon name="chevLeft" size={22} /></button>
                <div style={{ display: "flex", gap: 9 }}>
                  <button style={{ width: 42, height: 42, borderRadius: 999, border: "none", background: "#ffffffe6", cursor: "pointer", display: "grid", placeItems: "center", color: C.ink }}><Icon name="send" size={19} /></button>
                  <FavBtn id={n.id} light size={42} />
                </div>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 12, right: 12, display: "flex", gap: 6 }}>
              {["photos", "▶ video", "+12"].map((t, i) => <span key={i} style={{ background: "#1c3324cc", color: "#fff", fontSize: 11, fontWeight: 600, padding: "4px 9px", borderRadius: 999 }}>{t}</span>)}
            </div>
          </div>

          {/* identity */}
          <div style={{ padding: "18px 22px 4px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
              <h1 style={{ flex: 1, minWidth: 0, margin: 0, fontFamily: F.display, fontSize: 25, fontWeight: 700, color: C.ink, lineHeight: 1.15 }}>{n.name}</h1>
              <span style={{ flexShrink: 0 }}><AvailBadge avail={n.avail} /></span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10, flexWrap: "wrap" }}>
              <Rating value={n.rating} count={n.reviews} size={13} />
              <Verified />
              <span style={{ fontSize: 12.5, color: C.mut, display: "inline-flex", alignItems: "center", gap: 4 }}><Icon name="pin" size={14} stroke={C.mut} />{n.district}</span>
            </div>
            <p style={{ margin: "14px 0 0", fontSize: 13.5, color: C.mut, lineHeight: 1.6 }}>A warm, licensed nursery offering {n.tag.toLowerCase()}. Small group sizes, qualified early-years staff, and a calm, nurturing environment your child will love.</p>
          </div>

          <Section title="Ages & availability">
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {n.ages.map((a, i) => (
                <div key={a} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", background: C.cream, borderRadius: 12 }}>
                  <Icon name="users" size={18} stroke={C.dgreen} />
                  <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{AGES[a]}</span>
                  <AvailBadge avail={i === 0 ? n.avail : "available"} />
                </div>
              ))}
            </div>
          </Section>

          <Section title="Pricing">
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {plans.map((p) => (
                <div key={p.type} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px", border: `1px solid ${C.line}`, borderRadius: 14 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color: C.ink }}>{p.label}</p>
                    <p style={{ margin: 0, fontSize: 11.5, color: C.mut }}>{p.note}</p>
                  </div>
                  <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 17, color: C.dgreen }}>{p.price}<span style={{ fontSize: 11, color: C.mut, fontWeight: 600 }}> JD/{p.unit}</span></span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Services">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 9 }}>
              {[["meal", "Meals included"], ["users", "Small groups"], ["shield", "CCTV & secure"], ["smile", "Outdoor garden"], ["globe", "Bilingual"], ["calendar", "Transport"]].map(([ic, l]) => (
                <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: 12.5, fontWeight: 600, color: C.ink, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 999, padding: "8px 13px" }}><Icon name={ic} size={15} stroke={C.dgreen} />{l}</span>
              ))}
            </div>
          </Section>

          <Section title="Hours & policies">
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 13px", background: C.cream, borderRadius: 12, marginBottom: 6 }}>
              <Icon name="clock" size={18} stroke={C.dgreen} /><span style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>Sun–Thu · 7:00 AM – 5:00 PM</span>
            </div>
            <Policy icon="info" title="Sick-child policy" body="Children with fever or contagious symptoms must stay home for 24 hours. We'll notify you immediately if your child becomes unwell." />
            <Policy icon="clock" title="Late-pickup policy" body="A 5 JD fee applies for every 15 minutes after closing. Please message us if you're running late." />
            <Policy icon="creditCard" title="Refund & cancellation" body="Cancel up to 48 hours before the start date for a full refund. Monthly plans can be cancelled before the renewal date." />
          </Section>

          <Section title="Location">
            <div style={{ position: "relative", height: 150, borderRadius: 14, overflow: "hidden", background: "#e8ece4" }}>
              <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg,#dfe6da 0 30px,#e8ece4 30px 60px)" }} />
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 120, height: 120, borderRadius: 999, background: "#3f8a5a22", border: "1px dashed #3f8a5a66" }} />
              <span style={{ position: "absolute", bottom: 10, left: 10, background: "#fffffff2", borderRadius: 999, padding: "5px 11px", fontSize: 11, fontWeight: 600, color: C.mut, display: "inline-flex", alignItems: "center", gap: 5 }}><Icon name="info" size={13} stroke={C.mut} />Exact address shared after booking</span>
            </div>
          </Section>

          <Section title="Reviews" action="See all" onAction={() => {}}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ fontFamily: F.display, fontWeight: 800, fontSize: 34, color: C.ink }}>{n.rating}</span>
              <div><Rating value="" size={14} /><div style={{ display: "flex", gap: 1 }}>{[0,1,2,3,4].map(i => <Icon key={i} name="star" size={15} fill={C.amber} stroke={C.amber} />)}</div><p style={{ margin: "3px 0 0", fontSize: 11.5, color: C.mut }}>{n.reviews} verified reviews</p></div>
            </div>
            {reviews.map((r, i) => (
              <div key={i} style={{ padding: "13px 0", borderTop: `1px solid ${C.line}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 7 }}>
                  <span style={{ width: 34, height: 34, borderRadius: 999, background: C.cream, color: C.dgreen, display: "grid", placeItems: "center", fontFamily: F.display, fontWeight: 700, fontSize: 14 }}>{r.name[0]}</span>
                  <div style={{ flex: 1 }}><p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: C.ink }}>{r.name}</p><p style={{ margin: 0, fontSize: 11, color: C.mut }}>{r.date} · <span style={{ color: C.green, fontWeight: 600 }}>Verified booking</span></p></div>
                  <div style={{ display: "flex", gap: 1 }}>{Array.from({ length: r.rating }).map((_, k) => <Icon key={k} name="star" size={13} fill={C.amber} stroke={C.amber} />)}</div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: C.mut, lineHeight: 1.55 }}>{r.text}</p>
              </div>
            ))}
          </Section>
        </div>

        {/* sticky book */}
        <div style={{ borderTop: `1px solid ${C.line}`, background: "#fff", padding: "12px 20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: C.mut }}>From</p>
            <p style={{ margin: 0, fontFamily: F.display, fontWeight: 800, fontSize: 21, color: C.ink }}>{n.priceFrom} JD<span style={{ fontSize: 12, color: C.mut, fontWeight: 600 }}>/{n.unit}</span></p>
          </div>
          <Button full size="lg" disabled={n.avail === "full"} iconRight="arrowRight" onClick={book} style={{ flex: 1 }}>{n.avail === "full" ? "Join waitlist" : "Book now"}</Button>
        </div>
      </div>
    );
  }

  window.SCREENS = Object.assign(window.SCREENS || {}, { nursery: Nursery });
})();
