// data.jsx — shared mock data + a styled image placeholder for the home screen.
(function () {
  const DISTRICTS = ["Abdoun", "Sweifieh", "Khalda", "Deir Ghbar", "Dabouq", "Jabal Amman", "Marj Al Hamam"];

  const AGE_GROUPS = [
    { id: "infant", label: "Infant", sub: "0–1 yr" },
    { id: "toddler", label: "Toddler", sub: "1–3 yrs" },
    { id: "preschool", label: "Preschool", sub: "3–5 yrs" },
  ];

  // availability: "available" | "limited" | "full"
  const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=70`;
  const NURSERIES = [
    { id: "n1", name: "Little Sprouts Nursery", district: "Abdoun", rating: 4.9, reviews: 128, priceFrom: 180, unit: "mo", ages: ["infant", "toddler"], avail: "available", verified: true, sponsored: true, tag: "Montessori · Meals included", img: U("1587654780291-39c9404d746b") },
    { id: "n2", name: "Olive Tree Kids", district: "Sweifieh", rating: 4.8, reviews: 94, priceFrom: 160, unit: "mo", ages: ["toddler", "preschool"], avail: "limited", verified: true, sponsored: true, tag: "Outdoor garden · Transport", img: U("1503676260728-1c00da094a0b") },
    { id: "n3", name: "Sunflower Daycare", district: "Khalda", rating: 4.7, reviews: 76, priceFrom: 6, unit: "hr", ages: ["infant", "toddler", "preschool"], avail: "available", verified: true, sponsored: false, tag: "Hourly care · Bilingual", img: U("1503454537195-1dcabb73ffb9") },
    { id: "n4", name: "Tiny Steps Academy", district: "Deir Ghbar", rating: 4.9, reviews: 210, priceFrom: 220, unit: "mo", ages: ["preschool"], avail: "limited", verified: true, sponsored: false, tag: "STEM play · Special needs", img: U("1597393353415-b3730f3719fe") },
    { id: "n5", name: "Green Garden Nursery", district: "Dabouq", rating: 4.6, reviews: 51, priceFrom: 150, unit: "mo", ages: ["infant", "toddler"], avail: "full", verified: true, sponsored: false, tag: "Organic meals · CCTV", img: U("1503919545889-aef636e10ad4") },
  ];

  // scene pool for galleries / report photos
  const SCENES = [
    "1587654780291-39c9404d746b", "1503676260728-1c00da094a0b", "1503454537195-1dcabb73ffb9",
    "1571210862729-78a52d3779a2", "1503919545889-aef636e10ad4", "1597393353415-b3730f3719fe",
    "1485546246426-74dc88dec4d9", "1544236977-2da95a0c0a1e", "1560859251-d563a49c5e4a",
  ].map(U);
  function hash(str) { let h = 0; str = String(str); for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
  const faceUrl = (seed) => `https://i.pravatar.cc/240?u=${encodeURIComponent(seed || "guest")}`;
  const sceneUrl = (seed) => SCENES[hash(seed || "x") % SCENES.length];

  const RECENT = [
    { q: "Toddler · Sweifieh", sub: "Full day" },
    { q: "Infant care near me", sub: "Monthly" },
    { q: "Olive Tree Kids", sub: "Profile" },
  ];

  // Image slot: tries a themed real photo, falls back to picsum, then to a
  // striped labelled placeholder if both fail (offline). `src` overrides;
  // otherwise it auto-picks a face (tone #b08968) or a nursery scene by seed.
  function Placeholder({ label = "photo", radius = 16, tone = "#5b8c6b", src, seed, face, style = {} }) {
    const auto = src || (face || tone === "#b08968" ? faceUrl(seed || label) : sceneUrl(seed || label));
    const [stage, setStage] = React.useState(0); // 0 primary, 1 picsum, 2 give up
    const url = stage === 0 ? auto : stage === 1 ? `https://picsum.photos/seed/${encodeURIComponent(seed || label || "x")}/600/400` : null;
    return (
      <div style={{
        position: "relative", width: "100%", height: "100%", borderRadius: radius,
        overflow: "hidden",
        background: `repeating-linear-gradient(135deg, ${tone}1f 0 10px, ${tone}12 10px 20px)`,
        ...style,
      }}>
        {url && <img src={url} alt={label} onError={() => setStage((s) => s + 1)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
        {!url && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{
              fontFamily: "'JetBrains Mono','SF Mono',monospace", fontSize: 10.5,
              letterSpacing: ".06em", color: tone, opacity: .85,
              textTransform: "lowercase", padding: "3px 8px", borderRadius: 6,
              background: "#ffffffb0", backdropFilter: "blur(2px)",
            }}>{label}</span>
          </div>
        )}
      </div>
    );
  }

  Object.assign(window, { DISTRICTS, AGE_GROUPS, NURSERIES, RECENT, Placeholder, sceneUrl, faceUrl });
})();
