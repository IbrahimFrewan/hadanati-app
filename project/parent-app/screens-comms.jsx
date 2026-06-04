// screens-comms.jsx — P-18 Messages, P-19 Notifications, P-20 Write review.
(function () {
  const { Icon, StatusBar, Placeholder, Button, TopBar, EmptyView, getNursery } = window;
  const C = window.DS.C, F = window.DS.F;

  // ---- P-18 Messages ---------------------------------------------------
  function Messages() {
    const { nav, store, actions } = window.useApp();
    const [open, setOpen] = React.useState(null);
    const [text, setText] = React.useState("");
    const thread = store.threads.find((t) => t.id === open);
    const send = () => { if (!text.trim()) return; actions.sendMessage(open, text.trim()); setText(""); };

    if (thread) {
      const n = getNursery(thread.nurseryId);
      return (
        <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
          <StatusBar />
          <TopBar title={n ? n.name : "Chat"} subtitle="Usually replies in ~1h" onBack={() => setOpen(null)} right={<button style={{ width: 40, height: 40, borderRadius: 999, border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: C.ink }}><Icon name="phone" size={18} /></button>} />
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 18px", display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ alignSelf: "center", display: "inline-flex", alignItems: "center", gap: 6, background: C.cream, color: C.mut, fontSize: 10.5, padding: "5px 11px", borderRadius: 999, margin: "4px 0 8px", textAlign: "center" }}><Icon name="shield" size={13} stroke={C.mut} />Messages are in-app only for safety</div>
            {thread.messages.map((msg, i) => (
              <div key={i} style={{ maxWidth: "78%", alignSelf: msg.me ? "flex-end" : "flex-start", background: msg.me ? C.header : "#fff", color: msg.me ? "#fff" : C.ink, border: msg.me ? "none" : `1px solid ${C.line}`, borderRadius: msg.me ? "16px 16px 5px 16px" : "16px 16px 16px 5px", padding: "10px 13px" }}>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.45 }}>{msg.text}</p>
                <p style={{ margin: "4px 0 0", fontSize: 9.5, opacity: .6, textAlign: "right" }}>{msg.time}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 16px 22px", borderTop: `1px solid ${C.line}`, display: "flex", gap: 9, alignItems: "center" }}>
            <button style={{ width: 42, height: 42, borderRadius: 999, border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: C.mut, flexShrink: 0 }}><Icon name="paperclip" size={19} /></button>
            <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Message…" style={{ flex: 1, minWidth: 0, height: 44, border: `1px solid ${C.line}`, borderRadius: 999, padding: "0 16px", outline: "none", fontFamily: F.body, fontSize: 14, background: "#fff", color: C.ink }} />
            <button onClick={send} style={{ width: 44, height: 44, borderRadius: 999, border: "none", background: text.trim() ? C.header : "#cdd6cd", color: "#fff", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name="send" size={19} /></button>
          </div>
        </div>
      );
    }

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <div style={{ padding: "6px 22px 12px" }}><h1 style={{ margin: 0, fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.ink }}>Messages</h1></div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 22px 96px" }}>
          {store.threads.length === 0 ? <EmptyView motif="balloon" title="No messages yet" body="Once you book, you can chat with the nursery here." /> : store.threads.map((t) => {
            const n = getNursery(t.nurseryId);
            return (
              <button key={t.id} onClick={() => setOpen(t.id)} style={{ width: "100%", display: "flex", gap: 13, padding: "13px 0", border: "none", borderBottom: `1px solid ${C.line}`, background: "transparent", cursor: "pointer", alignItems: "center", textAlign: "left" }}>
                <div style={{ width: 52, height: 52, borderRadius: 999, overflow: "hidden", flexShrink: 0 }}><Placeholder label="" radius={0} tone="#3f8a5a" src={n ? n.img : undefined} seed={t.nurseryId} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}><h4 style={{ margin: 0, fontFamily: F.display, fontSize: 15.5, fontWeight: 700, color: C.ink }}>{n ? n.name : ""}</h4><span style={{ fontSize: 11, color: C.mut }}>{t.time}</span></div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 3 }}><p style={{ margin: 0, fontSize: 12.5, color: t.unread ? C.ink : C.mut, fontWeight: t.unread ? 600 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.last}</p>{t.unread > 0 && <span style={{ minWidth: 18, height: 18, borderRadius: 999, background: C.green, color: "#fff", fontSize: 10.5, fontWeight: 700, display: "grid", placeItems: "center", padding: "0 5px", flexShrink: 0 }}>{t.unread}</span>}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- P-19 Notifications ---------------------------------------------
  const KIND = { report: ["image", "#2f7a44", "#e4f1e6"], attendance: ["checkCircle", "#2f6ab0", "#e3eefb"], payment: ["wallet", "#6b7568", "#eef0ec"], emergency: ["alert", "#c2543c", "#fbe9e4"] };
  function Notifications() {
    const { nav, store, actions } = window.useApp();
    React.useEffect(() => { const id = setTimeout(() => actions.readNotifs(), 1200); return () => clearTimeout(id); }, []);
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <div style={{ padding: "6px 22px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h1 style={{ margin: 0, fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.ink }}>Notifications</h1>
          <button onClick={() => actions.readNotifs()} style={{ border: "none", background: "transparent", color: C.dgreen, fontWeight: 600, fontSize: 12.5, cursor: "pointer", fontFamily: F.body }}>Mark all read</button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "0 22px 96px", display: "flex", flexDirection: "column", gap: 10 }}>
          {store.notifications.map((nt) => {
            const [ic, fg, bg] = KIND[nt.kind] || KIND.report; const emerg = nt.kind === "emergency";
            return (
              <button key={nt.id} onClick={() => nt.target && nav.go(nt.target, { childId: "c1" })} style={{ display: "flex", gap: 12, padding: 14, borderRadius: 16, border: emerg ? `1.5px solid ${fg}55` : `1px solid ${C.line}`, background: emerg ? bg : nt.read ? "#fff" : "#fbfdfb", cursor: nt.target ? "pointer" : "default", textAlign: "left", alignItems: "flex-start", position: "relative" }}>
                <span style={{ width: 38, height: 38, borderRadius: 10, background: bg, color: fg, display: "grid", placeItems: "center", flexShrink: 0 }}><Icon name={ic} size={19} stroke={fg} /></span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: emerg ? fg : C.ink }}>{nt.title}</p><span style={{ fontSize: 10.5, color: C.mut, whiteSpace: "nowrap" }}>{nt.time}</span></div>
                  <p style={{ margin: "3px 0 0", fontSize: 12.5, color: emerg ? "#8a3d2c" : C.mut, lineHeight: 1.45 }}>{nt.body}</p>
                </div>
                {!nt.read && <span style={{ position: "absolute", top: 16, right: 14, width: 8, height: 8, borderRadius: 999, background: C.green }} />}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- P-20 Write review ----------------------------------------------
  function Review() {
    const { nav } = window.useApp();
    const n = getNursery(nav.params.nurseryId) || window.NURSERIES[0];
    const [stars, setStars] = React.useState(0);
    const [text, setText] = React.useState("");
    const [done, setDone] = React.useState(false);
    if (done) return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar /><TopBar title="Review" onBack={() => nav.back()} />
        <div style={{ flex: 1 }}><EmptyView motif="teddy" title="Thank you!" body="Your verified review helps other parents choose with confidence." ctaLabel="Done" onCta={() => nav.back()} c1="#cba47a" c2="#e7cfa6" /></div>
      </div>
    );
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Write a review" onBack={() => nav.back()} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, overflow: "hidden" }}><Placeholder label="" radius={0} tone="#3f8a5a" src={n.img} seed={n.id} /></div>
            <div><h3 style={{ margin: "0 0 2px", fontFamily: F.display, fontSize: 17, fontWeight: 700, color: C.ink }}>{n.name}</h3><p style={{ margin: 0, fontSize: 12, color: C.green, fontWeight: 600 }}>Verified booking · completed</p></div>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: C.ink }}>How was your experience?</p>
          <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
            {[1, 2, 3, 4, 5].map((s) => <button key={s} onClick={() => setStars(s)} style={{ border: "none", background: "transparent", cursor: "pointer", padding: 0, color: s <= stars ? C.amber : "#d8ddd3" }}><Icon name="star" size={38} fill={s <= stars ? C.amber : "none"} stroke={s <= stars ? C.amber : "#d8ddd3"} /></button>)}
          </div>
          <p style={{ margin: "0 0 9px", fontSize: 14, fontWeight: 600, color: C.ink }}>Tell other parents more</p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="What did your child love? How was the communication?" rows={5} style={{ width: "100%", border: `1.5px solid ${C.line}`, borderRadius: 14, padding: 14, outline: "none", fontFamily: F.body, fontSize: 14, color: C.ink, resize: "none", marginBottom: 14 }} />
          <button style={{ display: "inline-flex", alignItems: "center", gap: 8, border: `1.5px dashed ${C.line}`, background: "#fff", borderRadius: 12, padding: "11px 16px", cursor: "pointer", fontFamily: F.body, fontSize: 13, fontWeight: 600, color: C.dgreen }}><Icon name="camera" size={18} />Add photos</button>
        </div>
        <div style={{ padding: "12px 22px 26px", borderTop: `1px solid ${C.line}` }}>
          <Button full size="lg" disabled={!stars} onClick={() => setDone(true)}>Submit review</Button>
        </div>
      </div>
    );
  }

  window.SCREENS = Object.assign(window.SCREENS || {}, { messages: Messages, notifications: Notifications, review: Review });
})();
