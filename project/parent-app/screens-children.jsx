// screens-children.jsx — P-15 Child management / profiles.
(function () {
  const { Icon, StatusBar, Placeholder, Button, TopBar, Field, Sheet, EmptyView } = window;
  const C = window.DS.C, F = window.DS.F;
  const AGE = { infant: "Infant · 0–1 yr", toddler: "Toddler · 1–3 yrs", preschool: "Preschool · 3–5 yrs" };
  function derive(dob) { if (!dob) return "toddler"; const y = (Date.now() - new Date(dob)) / 31557600000; return y < 1 ? "infant" : y < 3 ? "toddler" : "preschool"; }
  function ageStr(dob) { if (!dob) return ""; const m = Math.floor((Date.now() - new Date(dob)) / 2629800000); return m < 24 ? `${m} months` : `${Math.floor(m / 12)} years`; }

  function Children() {
    const { nav, store, actions } = window.useApp();
    const [form, setForm] = React.useState(null); // {name,dob,allergies}
    const open = () => setForm({ name: "", dob: "", allergies: "" });
    const save = () => { actions.addChild({ name: form.name, dob: form.dob, ageGroup: derive(form.dob), allergies: form.allergies, photo: false }); setForm(null); };

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="My children" onBack={() => nav.back()} right={<button onClick={open} style={{ width: 40, height: 40, borderRadius: 999, border: "none", background: C.header, color: "#fff", cursor: "pointer", display: "grid", placeItems: "center" }}><Icon name="plus" size={20} /></button>} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 22px 24px" }}>
          {store.children.length === 0 ? (
            <EmptyView motif="rattle" title="Add your child" body="Add a child profile to start booking — we use their age to match the right nurseries." ctaLabel="Add child" onCta={open} c1="#e7a93a" c2="#f6dfa6" />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              {store.children.map((ch) => (
                <div key={ch.id} style={{ border: `1px solid ${C.line}`, borderRadius: 18, padding: 15 }}>
                  <div style={{ display: "flex", gap: 13, alignItems: "center" }}>
                    <div style={{ width: 58, height: 58, borderRadius: 999, overflow: "hidden", border: `1px solid ${C.line}`, flexShrink: 0 }}><Placeholder label="" radius={0} tone="#b08968" seed={ch.id} /></div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: "0 0 2px", fontFamily: F.display, fontSize: 18, fontWeight: 700, color: C.ink }}>{ch.name}</h4>
                      <p style={{ margin: 0, fontSize: 12.5, color: C.mut }}>{ageStr(ch.dob)} · {AGE[ch.ageGroup].split(" · ")[0]}</p>
                    </div>
                    <button style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${C.line}`, background: "#fff", cursor: "pointer", display: "grid", placeItems: "center", color: C.mut }}><Icon name="edit" size={17} /></button>
                  </div>
                  {ch.allergies && <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, background: "#fbeede", borderRadius: 10, padding: "9px 12px" }}><Icon name="alert" size={16} stroke="#b06d22" /><span style={{ fontSize: 12, color: "#8a5a16", fontWeight: 600 }}>Allergies: {ch.allergies}</span></div>}
                  <div style={{ display: "flex", gap: 9, marginTop: 12 }}>
                    <Button variant="secondary" size="sm" icon="calendar" onClick={() => nav.tab("bookings")} style={{ flex: 1 }}>Bookings</Button>
                    <Button variant="secondary" size="sm" icon="image" onClick={() => nav.go("reportFeed", { childId: ch.id })} style={{ flex: 1 }}>Reports</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Sheet open={!!form} onClose={() => setForm(null)} title="Add a child">
          {form && <>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
              <button style={{ position: "relative", border: "none", background: "transparent", cursor: "pointer" }}>
                <div style={{ width: 80, height: 80, borderRadius: 999, overflow: "hidden", border: `2px solid ${C.line}` }}><Placeholder label="photo" radius={0} tone="#b08968" /></div>
                <span style={{ position: "absolute", bottom: 0, right: 0, width: 28, height: 28, borderRadius: 999, background: C.header, color: "#fff", display: "grid", placeItems: "center", border: "2px solid #fff" }}><Icon name="camera" size={14} /></span>
              </button>
            </div>
            <Field label="Child's name" placeholder="e.g. Yara" value={form.name} onChange={(v) => setForm({ ...form, name: v })} autoFocus />
            <Field label="Date of birth" type="date" value={form.dob} onChange={(v) => setForm({ ...form, dob: v })} hint={form.dob ? `Age group: ${AGE[derive(form.dob)].split(" · ")[0]} — used to match nurseries.` : "We use this to match the right age group."} />
            <Field label="Allergies / medical notes (optional)" icon="alert" placeholder="e.g. Peanuts, asthma" value={form.allergies} onChange={(v) => setForm({ ...form, allergies: v })} />
            <p style={{ margin: "0 0 16px", fontSize: 11, color: C.mut, lineHeight: 1.5, display: "flex", gap: 7 }}><Icon name="lock" size={14} stroke={C.mut} />Medical notes are sensitive and shared only with the nursery you book.</p>
            <Button full size="lg" disabled={!form.name.trim() || !form.dob} onClick={save}>Save child</Button>
          </>}
        </Sheet>
      </div>
    );
  }

  window.SCREENS = Object.assign(window.SCREENS || {}, { children: Children });
})();
