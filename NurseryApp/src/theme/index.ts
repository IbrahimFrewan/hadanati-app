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

export const F = { ...LATIN_FONTS };

export let IS_RTL = false;

export function setLangFonts(lang: string) {
  Object.assign(F, lang === 'AR' ? ARABIC_FONTS : LATIN_FONTS);
  IS_RTL = lang === 'AR';
}

// Inject the active font into EVERY <Text> by default (texts without an
// explicit fontFamily otherwise fall back to the system font — visible with
// Arabic). Explicit fontFamily still wins.
import React from 'react';
import { Text } from 'react-native';
const RNText = Text as any;
if (RNText.render && !RNText.__fontPatched) {
  RNText.__fontPatched = true;
  const origRender = RNText.render;
  RNText.render = function (...args: any[]) {
    const el = origRender.apply(this, args);
    return React.cloneElement(el, { style: [{ fontFamily: F.body }, el.props.style] });
  };
}
