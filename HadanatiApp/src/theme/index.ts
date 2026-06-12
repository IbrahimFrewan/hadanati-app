export const C = {
  ink: '#243528',
  mut: '#7c8579',
  soft: '#9aa195',
  green: '#3f8a5a',
  dgreen: '#2c5a3d',
  header: '#2f5e41',
  cream: '#f4f0e6',
  page: '#ffffff',
  line: '#e9e3d4',
  amber: '#e7a93a',
  danger: '#d9694e',
  info: '#3f7a8a',
  tint: '#dfeae0',
};

// Latin fonts (English UI) and Arabic fonts (Cairo covers Arabic + Latin).
const LATIN_FONTS = {
  display: 'Baloo2_700Bold',
  displayMedium: 'Baloo2_500Medium',
  displayBold: 'Baloo2_700Bold',
  displayExtraBold: 'Baloo2_800ExtraBold',
  body: 'Rubik_400Regular',
  bodyMedium: 'Rubik_500Medium',
  bodyBold: 'Rubik_700Bold',
};

const ARABIC_FONTS = {
  display: 'IBMPlexSansArabic_700Bold',
  displayMedium: 'IBMPlexSansArabic_500Medium',
  displayBold: 'IBMPlexSansArabic_700Bold',
  displayExtraBold: 'IBMPlexSansArabic_700Bold', // IBM Plex Sans Arabic maxes at 700
  body: 'IBMPlexSansArabic_400Regular',
  bodyMedium: 'IBMPlexSansArabic_500Medium',
  bodyBold: 'IBMPlexSansArabic_700Bold',
};

// `F` is a live object: every screen reads `F.bodyBold` etc. in inline styles,
// which re-evaluate each render. `setLangFonts` is called from AppProvider during
// render so that when the language flips, the whole tree paints with the right
// font family (Cairo for Arabic, Baloo2/Rubik for English) without per-usage edits.
export const F = { ...LATIN_FONTS };

// Live RTL flag (ES module live binding). Set from AppProvider during render.
// Shared presentational components read this to flip their internal row order
// and text alignment without each needing to subscribe to context.
export let IS_RTL = false;

export function setLangFonts(lang: 'en' | 'ar') {
  Object.assign(F, lang === 'ar' ? ARABIC_FONTS : LATIN_FONTS);
  IS_RTL = lang === 'ar';
}

// Convenience helpers for inline styles.
export const row = (): 'row' | 'row-reverse' => (IS_RTL ? 'row-reverse' : 'row');
export const textStart = (): 'left' | 'right' => (IS_RTL ? 'right' : 'left');

// Give EVERY <Text> the live brand font by default. RN 0.85's Text is a plain
// function component (no forwardRef .render to patch), so we hook the JSX
// runtime itself — the path Expo/Metro actually uses in production builds.
// Explicit fontFamily in a style still wins (it comes later in the array).
import { Text } from 'react-native';
try {
  const wrap = (orig: any) => (type: any, props: any, ...rest: any[]) => {
    if (type === Text && props) {
      props = { ...props, style: [{ fontFamily: F.body }, props.style] };
    }
    return orig(type, props, ...rest);
  };
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rt = require('react/jsx-runtime') as any;
  if (!rt.__fontPatched) { rt.__fontPatched = true; rt.jsx = wrap(rt.jsx); rt.jsxs = wrap(rt.jsxs); }
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const rtd = require('react/jsx-dev-runtime') as any;
  if (rtd?.jsxDEV && !rtd.__fontPatched) { rtd.__fontPatched = true; rtd.jsxDEV = wrap(rtd.jsxDEV); }
} catch {}
