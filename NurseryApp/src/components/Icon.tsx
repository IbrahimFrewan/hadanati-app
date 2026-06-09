import React from 'react';
import Svg, { Path, Circle, Rect, G, Line } from 'react-native-svg';

type IconName =
  | 'pin' | 'search' | 'chevDown' | 'chevUp' | 'chevRight' | 'chevLeft'
  | 'x' | 'clock' | 'heart' | 'star' | 'home' | 'calendar' | 'chat' | 'bell' | 'user'
  | 'arrowRight' | 'arrowUp' | 'arrowDown' | 'check' | 'leaf' | 'sparkle' | 'refresh'
  | 'bookmark' | 'plus' | 'minus' | 'send' | 'camera' | 'edit' | 'trash'
  | 'logout' | 'globe' | 'shield' | 'info' | 'phone' | 'lock'
  | 'qr' | 'qrScan' | 'creditCard' | 'tag' | 'alert' | 'checkCircle' | 'dots' | 'eye'
  | 'download' | 'upload' | 'image' | 'meal' | 'sleep' | 'smile' | 'play' | 'play2'
  | 'chart' | 'users' | 'wallet' | 'moneyIn' | 'badge' | 'drop' | 'globe2'
  | 'settings' | 'bell2' | 'star2' | 'list' | 'grid';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 22, color = 'currentColor', fill = 'none', strokeWidth = 1.8 }: Props) {
  const props = {
    width: size, height: size, viewBox: '0 0 24 24',
    fill, stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'pin': return <Svg {...props}><Path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11Z" /><Circle cx="12" cy="10" r="2.6" /></Svg>;
    case 'search': return <Svg {...props}><Circle cx="11" cy="11" r="7" /><Path d="m20 20-3.2-3.2" /></Svg>;
    case 'chevDown': return <Svg {...props}><Path d="m6 9 6 6 6-6" /></Svg>;
    case 'chevUp': return <Svg {...props}><Path d="m6 15 6-6 6 6" /></Svg>;
    case 'chevRight': return <Svg {...props}><Path d="m9 6 6 6-6 6" /></Svg>;
    case 'chevLeft': return <Svg {...props}><Path d="m15 6-6 6 6 6" /></Svg>;
    case 'x': return <Svg {...props}><Path d="M6 6 18 18M18 6 6 18" /></Svg>;
    case 'clock': return <Svg {...props}><Circle cx="12" cy="12" r="9" /><Path d="M12 7v5l3 2" /></Svg>;
    case 'heart': return <Svg {...props}><Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" /></Svg>;
    case 'star': return <Svg {...props}><Path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 17.9 6.8 20.7l1-5.9-4.3-4.2 5.9-.9L12 3.5Z" /></Svg>;
    case 'star2': return <Svg {...props}><Path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.2 1 5.9L12 17.9 6.8 20.7l1-5.9-4.3-4.2 5.9-.9L12 3.5Z" /></Svg>;
    case 'home': return <Svg {...props}><Path d="M4 11.5 12 4l8 7.5" /><Path d="M6 10v10h12V10" /><Path d="M10 20v-6h4v6" /></Svg>;
    case 'calendar': return <Svg {...props}><Rect x="4" y="5.5" width="16" height="15" rx="2.5" /><Path d="M8 3.5v4M16 3.5v4M4 10h16" /></Svg>;
    case 'chat': return <Svg {...props}><Path d="M5 6h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H9l-4 3.5V8a2 2 0 0 1 2-2Z" /></Svg>;
    case 'bell': return <Svg {...props}><Path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><Path d="M10 20a2 2 0 0 0 4 0" /></Svg>;
    case 'bell2': return <Svg {...props}><Path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" /><Path d="M10 20a2 2 0 0 0 4 0" /></Svg>;
    case 'user': return <Svg {...props}><Circle cx="12" cy="8" r="4" /><Path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></Svg>;
    case 'arrowRight': return <Svg {...props}><Path d="M5 12h14M13 6l6 6-6 6" /></Svg>;
    case 'arrowUp': return <Svg {...props}><Path d="M12 19V5M5 12l7-7 7 7" /></Svg>;
    case 'arrowDown': return <Svg {...props}><Path d="M12 5v14M5 12l7 7 7-7" /></Svg>;
    case 'check': return <Svg {...props}><Path d="m5 12.5 4.5 4.5L19 6.5" /></Svg>;
    case 'leaf': return <Svg {...props}><Path d="M5 19c0-8 6-13 14-14 1 9-4 15-14 14Zm0 0c4-4 6.5-6 9-7.5" /></Svg>;
    case 'sparkle': return <Svg {...props}><Path d="M12 3v6M12 15v6M3 12h6M15 12h6M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3" /></Svg>;
    case 'refresh': return <Svg {...props}><Path d="M20 11a8 8 0 1 0-.6 4M20 5v6h-6" /></Svg>;
    case 'bookmark': return <Svg {...props}><Path d="M7 4h10v16l-5-3.5L7 20V4Z" /></Svg>;
    case 'plus': return <Svg {...props}><Path d="M12 5v14M5 12h14" /></Svg>;
    case 'minus': return <Svg {...props}><Path d="M5 12h14" /></Svg>;
    case 'send': return <Svg {...props}><Path d="M4 12 20 4l-6 16-3-7-7-1Z" /></Svg>;
    case 'camera': return <Svg {...props}><Path d="M3 8.5h3l1.5-2.5h9L17 8.5h3a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Z" /><Circle cx="12" cy="13" r="3.4" /></Svg>;
    case 'edit': return <Svg {...props}><Path d="M5 19h3l9-9-3-3-9 9v3ZM14 6l3 3" /></Svg>;
    case 'trash': return <Svg {...props}><Path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" /></Svg>;
    case 'settings': return <Svg {...props}><Circle cx="12" cy="12" r="3.2" /><Path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8" /></Svg>;
    case 'logout': return <Svg {...props}><Path d="M14 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 12h9M16 9l3 3-3 3" /></Svg>;
    case 'globe': return <Svg {...props}><Circle cx="12" cy="12" r="9" /><Path d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9Z" /></Svg>;
    case 'globe2': return <Svg {...props}><Circle cx="12" cy="12" r="9" /><Path d="M3 12h18M12 3c2.6 2.4 4 5.6 4 9s-1.4 6.6-4 9c-2.6-2.4-4-5.6-4-9s1.4-6.6 4-9Z" /></Svg>;
    case 'shield': return <Svg {...props}><Path d="M12 3 5 6v6c0 4.2 3 7.5 7 9 4-1.5 7-4.8 7-9V6l-7-3Zm-2.5 9 2 2 4-4" /></Svg>;
    case 'info': return <Svg {...props}><Circle cx="12" cy="12" r="9" /><Path d="M12 11v5M12 8h0" /></Svg>;
    case 'phone': return <Svg {...props}><Path d="M6 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5V18a2 2 0 0 1-2 2A14 14 0 0 1 4 6a2 2 0 0 1 2-2Z" /></Svg>;
    case 'lock': return <Svg {...props}><Rect x="5" y="11" width="14" height="9" rx="2" /><Path d="M8 11V8a4 4 0 0 1 8 0v3" /></Svg>;
    case 'qr': return <Svg {...props}><Rect x="4" y="4" width="6" height="6" rx="1" /><Rect x="14" y="4" width="6" height="6" rx="1" /><Rect x="4" y="14" width="6" height="6" rx="1" /><Path d="M14 14h2v2M20 14v6M16 18h4M14 20h0" /></Svg>;
    case 'qrScan': return <Svg {...props}><Rect x="4" y="4" width="6" height="6" rx="1" /><Rect x="14" y="4" width="6" height="6" rx="1" /><Rect x="4" y="14" width="6" height="6" rx="1" /><Path d="M14 14h2v2M20 14v6M16 18h4M14 20h0M3 8.5V5a1 1 0 0 1 1-1h2.5M13.5 3H19a1 1 0 0 1 1 1v2.5M3 13.5V19a1 1 0 0 1 1 1h2.5" /></Svg>;
    case 'creditCard': return <Svg {...props}><Rect x="3" y="6" width="18" height="12" rx="2.5" /><Path d="M3 10h18M7 15h4" /></Svg>;
    case 'tag': return <Svg {...props}><Path d="M4 12V5a1 1 0 0 1 1-1h7l8 8-8 8-8-8Z" /><Circle cx="8.5" cy="8.5" r="1.4" /></Svg>;
    case 'alert': return <Svg {...props}><Path d="M12 4 2.5 20h19L12 4Z" /><Path d="M12 10v5M12 18h0" /></Svg>;
    case 'checkCircle': return <Svg {...props}><Circle cx="12" cy="12" r="9" /><Path d="m8 12 2.5 2.5L16 9" /></Svg>;
    case 'dots': return <Svg {...props}><Circle cx="5" cy="12" r="1.4" /><Circle cx="12" cy="12" r="1.4" /><Circle cx="19" cy="12" r="1.4" /></Svg>;
    case 'eye': return <Svg {...props}><Path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" /><Circle cx="12" cy="12" r="3" /></Svg>;
    case 'download': return <Svg {...props}><Path d="M12 4v11m0 0 4-4m-4 4-4-4M5 19h14" /></Svg>;
    case 'upload': return <Svg {...props}><Path d="M12 20V9m0 0 4 4m-4-4-4 4M5 5h14" /></Svg>;
    case 'image': return <Svg {...props}><Rect x="3" y="5" width="18" height="14" rx="2" /><Circle cx="8.5" cy="10" r="1.8" /><Path d="m4 18 5-5 4 3.5 3-2.5 4 4" /></Svg>;
    case 'meal': return <Svg {...props}><Path d="M6 3v8a2 2 0 0 0 4 0V3M8 11v10M16 3c-1.6 0-3 2-3 5s1 4 3 4v9" /></Svg>;
    case 'sleep': return <Svg {...props}><Path d="M16 4a8 8 0 1 0 4 14 7 7 0 0 1-4-14Z" /></Svg>;
    case 'smile': return <Svg {...props}><Circle cx="12" cy="12" r="9" /><Path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h0M15 9.5h0" /></Svg>;
    case 'play': return <Svg {...props}><Path d="M8 5.5v13l11-6.5-11-6.5Z" /></Svg>;
    case 'play2': return <Svg {...props}><Circle cx="12" cy="12" r="9" /><Path d="M10 8.5v7l5.5-3.5-5.5-3.5Z" /></Svg>;
    case 'chart': return <Svg {...props}><Path d="M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-7" /></Svg>;
    case 'users': return <Svg {...props}><Circle cx="9" cy="8" r="3.4" /><Path d="M3 19a6 6 0 0 1 12 0M16 5.5a3.4 3.4 0 0 1 0 6.6M21 19a6 6 0 0 0-4-5.6" /></Svg>;
    case 'wallet': return <Svg {...props}><Rect x="3" y="6" width="18" height="13" rx="2.5" /><Path d="M3 10h18M16.5 13.5h0" /></Svg>;
    case 'moneyIn': return <Svg {...props}><Path d="M12 3v12M8 11l4 4 4-4" /><Path d="M5 19h14" /><Path d="M3 7.5h4.5M3 11.5h2.5" /></Svg>;
    case 'badge': return <Svg {...props}><Path d="M12 3 14.5 8H20l-4.5 3.5 1.5 5.5L12 14l-5 3 1.5-5.5L4 8h5.5L12 3Z" /></Svg>;
    case 'drop': return <Svg {...props}><Path d="M12 3c0 0-7 6.5-7 11a7 7 0 0 0 14 0c0-4.5-7-11-7-11Z" /></Svg>;
    case 'list': return <Svg {...props}><Path d="M8 6h12M8 12h12M8 18h12M4 6h0M4 12h0M4 18h0" /></Svg>;
    case 'grid': return <Svg {...props}><Rect x="4" y="4" width="7" height="7" rx="1.5" /><Rect x="13" y="4" width="7" height="7" rx="1.5" /><Rect x="4" y="13" width="7" height="7" rx="1.5" /><Rect x="13" y="13" width="7" height="7" rx="1.5" /></Svg>;
    default: return null;
  }
}
