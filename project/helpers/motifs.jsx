// motifs.jsx — simple, friendly childcare vector motifs (flat shapes only).
// Built from circles / rounded rects / soft paths. Exported as <Motif name=.. />.
(function () {
  const M = {
    // Teddy bear face
    teddy: ({ c1, c2, ink }) => (
      <>
        <circle cx="18" cy="17" r="9" fill={c1} />
        <circle cx="46" cy="17" r="9" fill={c1} />
        <circle cx="18" cy="17" r="4.4" fill={c2} />
        <circle cx="46" cy="17" r="4.4" fill={c2} />
        <circle cx="32" cy="35" r="20" fill={c1} />
        <ellipse cx="32" cy="41" rx="10.5" ry="8.5" fill={c2} />
        <circle cx="24.5" cy="32" r="2.5" fill={ink} />
        <circle cx="39.5" cy="32" r="2.5" fill={ink} />
        <ellipse cx="32" cy="37.5" rx="3" ry="2.4" fill={ink} />
        <path d="M32 39.6v3.2" stroke={ink} strokeWidth="1.8" strokeLinecap="round" />
      </>
    ),
    // Balloon with string
    balloon: ({ c1, c2, ink }) => (
      <>
        <ellipse cx="30" cy="25" rx="16" ry="19" fill={c1} />
        <ellipse cx="24" cy="19" rx="4.5" ry="6" fill={c2} opacity="0.6" />
        <path d="M27 43.5h6l-3 4.5z" fill={c1} />
        <path d="M30 48q5 7-2 14" stroke={ink} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </>
    ),
    // Baby rattle
    rattle: ({ c1, c2, ink }) => (
      <>
        <circle cx="27" cy="21" r="15" fill={c1} />
        <circle cx="27" cy="21" r="6.5" fill={c2} />
        <rect x="23" y="34" width="8" height="22" rx="4" fill={c1} />
        <circle cx="27" cy="58" r="5.5" fill={c2} />
        <circle cx="46" cy="14" r="3" fill={c2} />
        <circle cx="13" cy="32" r="2.4" fill={c2} />
      </>
    ),
    // Stacked ABC blocks
    blocks: ({ c1, c2, ink }) => (
      <>
        <rect x="6" y="32" width="26" height="26" rx="6" fill={c1} />
        <rect x="33" y="32" width="25" height="26" rx="6" fill={c2} />
        <rect x="20" y="7" width="25" height="25" rx="6" fill={c2} />
        <text x="19" y="51" fontFamily="'Baloo 2',sans-serif" fontSize="15" fontWeight="700" fill={ink} textAnchor="middle">A</text>
        <text x="45.5" y="51" fontFamily="'Baloo 2',sans-serif" fontSize="15" fontWeight="700" fill={c1} textAnchor="middle">B</text>
        <text x="32.5" y="26" fontFamily="'Baloo 2',sans-serif" fontSize="15" fontWeight="700" fill={ink} textAnchor="middle">C</text>
      </>
    ),
    // Stroller / pram (simplified)
    stroller: ({ c1, c2, ink }) => (
      <>
        <path d="M10 14a22 22 0 0 1 22 22H10z" fill={c1} />
        <path d="M32 36V18a18 18 0 0 1 16 18z" fill={c2} />
        <rect x="8" y="35" width="44" height="4.5" rx="2.2" fill={ink} opacity="0.55" />
        <path d="M48 20l8-6" stroke={ink} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
        <circle cx="18" cy="52" r="6" fill="none" stroke={ink} strokeWidth="3" opacity="0.7" />
        <circle cx="42" cy="52" r="6" fill="none" stroke={ink} strokeWidth="3" opacity="0.7" />
      </>
    ),
    // Cloud
    cloud: ({ c1, c2 }) => (
      <path d="M16 44a10 10 0 0 1 1-19 13 13 0 0 1 25-3 9 9 0 0 1 5 22z" fill={c1} />
    ),
  };

  function Motif({ name, size = 64, c1 = "#cba47a", c2 = "#e7cfa6", ink = "#4a3b2a", style }) {
    const body = M[name];
    if (!body) return null;
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={style}>
        {body({ c1, c2, ink })}
      </svg>
    );
  }

  window.Motif = Motif;
})();
