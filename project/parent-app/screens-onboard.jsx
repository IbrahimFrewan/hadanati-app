// screens-onboard.jsx — P-01 Splash, P-02 Register, P-03 OTP, P-04 Profile setup.
(function () {
  const { Icon, StatusBar, Motif, MotifBackdrop, Button, TopBar, Field, Toggle, Stepper } = window;
  const C = window.DS.C, F = window.DS.F;

  function Brand({ light }) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span style={{ width: 38, height: 38, borderRadius: 12, background: light ? "#ffffff22" : C.header, color: light ? "#fff" : C.cream, display: "grid", placeItems: "center" }}><Icon name="leaf" size={22} /></span>
        <span style={{ fontFamily: F.display, fontWeight: 700, fontSize: 22, color: light ? "#fff" : C.header }}>حضانتي</span>
      </div>
    );
  }

  function LangToggle() {
    const [lang, setLang] = React.useState("EN");
    return (
      <div style={{ display: "inline-flex", background: C.cream, borderRadius: 999, padding: 3, border: `1px solid ${C.line}` }}>
        {["EN", "ع"].map((l) => (
          <button key={l} onClick={() => setLang(l)} style={{ border: "none", cursor: "pointer", fontFamily: F.body, fontWeight: 700, fontSize: 12.5, padding: "5px 11px", borderRadius: 999, background: lang === l ? C.header : "transparent", color: lang === l ? "#fff" : C.mut }}>{l}</button>
        ))}
      </div>
    );
  }

  // ---- P-01 Splash / Onboarding ---------------------------------------
  function Splash() {
    const { nav } = window.useApp();
    const [i, setI] = React.useState(0);
    const slides = [
      { title: "Find care you trust", body: "Browse licensed nurseries near you, filtered for your child's age and needs.", motif: "balloon", c1: "#cfe0cf", c2: "#3f8a5a" },
      { title: "Book in a few taps", body: "Hourly, daily or monthly — reserve a verified spot and pay securely in-app.", motif: "blocks", c1: "#3f8a5a", c2: "#e7cf9c" },
      { title: "Follow their day", body: "Meals, naps, photos and notes — see how your little one's day went, in real time.", motif: "teddy", c1: "#cba47a", c2: "#e7cfa6" },
    ];
    const s = slides[i]; const last = i === slides.length - 1;
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <div style={{ padding: "4px 22px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Brand /><LangToggle />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 26px" }}>
          <div onClick={() => setI((i + 1) % slides.length)} style={{ position: "relative", height: 286, borderRadius: 28, background: C.header, overflow: "hidden", display: "grid", placeItems: "center", marginBottom: 28, cursor: "pointer" }}>
            <MotifBackdrop color="#f4f0e6" opacity={0.07} size={150} />
            <div key={i} className="scr" style={{ position: "relative", zIndex: 1, display: "grid", placeItems: "center" }}>
              <div style={{ width: 150, height: 150, borderRadius: 36, background: "#ffffff14", display: "grid", placeItems: "center" }}>
                <Motif name={s.motif} size={108} c1={s.c1} c2={s.c2} ink="#2f5e41" />
              </div>
            </div>
          </div>
          <div key={"t" + i} className="scr">
            <h1 style={{ margin: "0 0 10px", fontFamily: F.display, fontSize: 30, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>{s.title}</h1>
            <p style={{ margin: 0, fontSize: 14.5, color: C.mut, lineHeight: 1.55, maxWidth: 300 }}>{s.body}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 7, justifyContent: "center", marginBottom: 22 }}>
          {slides.map((_, k) => (
            <button key={k} onClick={() => setI(k)} style={{ border: "none", cursor: "pointer", padding: 0, height: 7, borderRadius: 999, width: k === i ? 26 : 7, background: k === i ? C.green : "#d8ddd3", transition: "all .2s" }} />
          ))}
        </div>
        <div style={{ padding: "0 24px 26px" }}>
          <Button full size="lg" iconRight={last ? "arrowRight" : undefined} onClick={() => (last ? nav.go("register") : setI(i + 1))}>{last ? "Get started" : "Next"}</Button>
          <button onClick={() => nav.go("register")} style={{ width: "100%", marginTop: 14, border: "none", background: "transparent", cursor: "pointer", fontFamily: F.body, fontSize: 13.5, color: C.mut }}>
            I already have an account · <span style={{ color: C.dgreen, fontWeight: 700 }}>Log in</span>
          </button>
        </div>
      </div>
    );
  }

  // ---- P-02 Registration ----------------------------------------------
  function Register() {
    const { nav } = window.useApp();
    const [phone, setPhone] = React.useState("");
    const [agree, setAgree] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [err, setErr] = React.useState("");
    const digits = phone.replace(/\D/g, "");
    const valid = digits.length === 9 && digits[0] === "7";
    const submit = () => {
      if (!valid) { setErr("Enter a valid Jordan mobile number (9 digits, starts with 7)."); return; }
      setErr(""); setLoading(true);
      setTimeout(() => { setLoading(false); nav.go("otp", { phone: digits }); }, 900);
    };
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Create your account" onBack={() => nav.back()} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 24px" }}>
          <div style={{ marginBottom: 24 }}>
            <h1 style={{ margin: "0 0 8px", fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.ink }}>What's your number?</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: C.mut, lineHeight: 1.5 }}>We'll text you a code to verify it. No password needed.</p>
          </div>
          <Field label="Mobile number" icon="phone" prefix="+962" placeholder="7 9123 4567" value={phone} onChange={(v) => { setPhone(v); setErr(""); }} inputMode="tel" error={err} autoFocus />
          <div onClick={() => setAgree(!agree)} style={{ display: "flex", gap: 11, alignItems: "flex-start", cursor: "pointer", padding: "6px 2px", marginTop: 4 }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, flexShrink: 0, border: agree ? "none" : `1.5px solid ${C.line}`, background: agree ? C.green : "#fff", color: "#fff", display: "grid", placeItems: "center", marginTop: 1 }}>{agree && <Icon name="check" size={15} />}</span>
            <span style={{ fontSize: 12.5, color: C.mut, lineHeight: 1.5 }}>I agree to the <span style={{ color: C.dgreen, fontWeight: 700 }}>Terms of Service</span> and <span style={{ color: C.dgreen, fontWeight: 700 }}>Privacy Policy</span>.</span>
          </div>
        </div>
        <div style={{ padding: "10px 24px 26px", borderTop: `1px solid ${C.line}` }}>
          <Button full size="lg" disabled={!valid || !agree || loading} onClick={submit}>{loading ? "Sending code…" : "Send code"}</Button>
        </div>
      </div>
    );
  }

  // ---- P-03 OTP --------------------------------------------------------
  function Otp() {
    const { nav } = window.useApp();
    const phone = nav.params.phone || "7 9123 4567";
    const masked = "+962 " + String(phone).slice(0, 1) + " •••• " + String(phone).slice(-2);
    const [code, setCode] = React.useState(["", "", "", "", "", ""]);
    const [t, setT] = React.useState(30);
    const [verifying, setVerifying] = React.useState(false);
    const refs = React.useRef([]);
    React.useEffect(() => { if (t <= 0) return; const id = setTimeout(() => setT(t - 1), 1000); return () => clearTimeout(id); }, [t]);
    const setDigit = (i, v) => {
      const d = v.replace(/\D/g, "").slice(-1);
      const next = [...code]; next[i] = d; setCode(next);
      if (d && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
      if (next.every((x) => x)) { setVerifying(true); setTimeout(() => nav.replace("profileSetup"), 800); }
    };
    const onKey = (i, e) => { if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1] && refs.current[i - 1].focus(); };
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Verify your number" onBack={() => nav.back()} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 24px" }}>
          <div style={{ marginBottom: 26 }}>
            <h1 style={{ margin: "0 0 8px", fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.ink }}>Enter the code</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: C.mut, lineHeight: 1.5 }}>Sent to <b style={{ color: C.ink }}>{masked}</b>. <button onClick={() => nav.back()} style={{ border: "none", background: "transparent", color: C.dgreen, fontWeight: 700, cursor: "pointer", fontFamily: F.body, fontSize: 13.5, padding: 0 }}>Edit</button></p>
          </div>
          <div style={{ display: "flex", gap: 9, marginBottom: 22 }}>
            {code.map((d, i) => (
              <input key={i} ref={(el) => (refs.current[i] = el)} value={d} onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} inputMode="numeric" maxLength={1} autoFocus={i === 0}
                style={{ flex: 1, minWidth: 0, height: 60, textAlign: "center", fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.ink, border: `1.5px solid ${d ? C.green : C.line}`, borderRadius: 14, outline: "none", background: "#fff" }} />
            ))}
          </div>
          {verifying ? (
            <p style={{ fontSize: 13, color: C.green, fontWeight: 600, display: "flex", alignItems: "center", gap: 7 }}><Icon name="checkCircle" size={17} stroke={C.green} /> Verifying…</p>
          ) : (
            <p style={{ fontSize: 13, color: C.mut }}>{t > 0 ? <>Resend code in <b style={{ color: C.ink }}>0:{String(t).padStart(2, "0")}</b></> : <button onClick={() => setT(30)} style={{ border: "none", background: "transparent", color: C.dgreen, fontWeight: 700, cursor: "pointer", fontFamily: F.body, fontSize: 13, padding: 0 }}>Resend code</button>}</p>
          )}
          <div style={{ marginTop: 22, display: "flex", gap: 9, alignItems: "center", background: C.cream, borderRadius: 12, padding: "10px 13px" }}>
            <Icon name="info" size={17} stroke={C.mut} /><span style={{ fontSize: 11.5, color: C.mut }}>Demo: enter any 6 digits to continue.</span>
          </div>
        </div>
      </div>
    );
  }

  // ---- P-04 Profile completion ----------------------------------------
  function ProfileSetup() {
    const { nav, store, actions } = window.useApp();
    const [name, setName] = React.useState(store.user.name);
    const [email, setEmail] = React.useState("");
    const save = () => { actions.patch({ user: { ...store.user, name, email } }); nav.reset("home"); };
    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: C.page }}>
        <StatusBar />
        <TopBar title="Your profile" onBack={() => nav.back()} />
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 24px 24px" }}>
          <div style={{ marginBottom: 22 }}>
            <h1 style={{ margin: "0 0 8px", fontFamily: F.display, fontSize: 26, fontWeight: 700, color: C.ink }}>Nice to meet you</h1>
            <p style={{ margin: 0, fontSize: 13.5, color: C.mut, lineHeight: 1.5 }}>Just your name to get started — the rest is optional.</p>
          </div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 26 }}>
            <button style={{ position: "relative", border: "none", background: "transparent", cursor: "pointer" }}>
              <div style={{ width: 96, height: 96, borderRadius: 999, overflow: "hidden", border: `2px solid ${C.line}` }}><window.Placeholder label="add photo" radius={0} tone="#b08968" /></div>
              <span style={{ position: "absolute", bottom: 0, right: 0, width: 32, height: 32, borderRadius: 999, background: C.header, color: "#fff", display: "grid", placeItems: "center", border: "2px solid #fff" }}><Icon name="camera" size={16} /></span>
            </button>
          </div>
          <Field label="Full name" placeholder="Layla Haddad" value={name} onChange={setName} />
          <Field label="Email (optional)" icon="mail" placeholder="you@email.com" value={email} onChange={setEmail} type="email" hint="For receipts and important updates." />
        </div>
        <div style={{ padding: "10px 24px 26px", borderTop: `1px solid ${C.line}` }}>
          <Button full size="lg" disabled={!name.trim()} onClick={save}>Save & continue</Button>
        </div>
      </div>
    );
  }

  window.SCREENS = Object.assign(window.SCREENS || {}, { splash: Splash, register: Register, otp: Otp, profileSetup: ProfileSetup });
})();
