import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Image,
  StyleSheet, ActivityIndicator, I18nManager,
} from 'react-native';
import { C, F } from '../theme';
import { Icon } from './Icon';
import { useApp } from '../context/AppContext';

// ---- Button -------------------------------------------------------
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export function Button({
  children, onPress, variant = 'primary', full, size = 'md',
  icon, iconRight, disabled, style,
}: {
  children?: React.ReactNode; onPress?: () => void; variant?: ButtonVariant;
  full?: boolean; size?: ButtonSize; icon?: string; iconRight?: string;
  disabled?: boolean; style?: object;
}) {
  const pads: Record<ButtonSize, object> = {
    sm: { paddingVertical: 9, paddingHorizontal: 14 },
    md: { paddingVertical: 13, paddingHorizontal: 20 },
    lg: { paddingVertical: 16, paddingHorizontal: 24 },
  };
  const fonts: Record<ButtonSize, number> = { sm: 13, md: 14.5, lg: 16 };
  const skins: Record<ButtonVariant, object> = {
    primary: { backgroundColor: disabled ? '#cdd6cd' : C.header },
    secondary: { backgroundColor: C.cream, borderWidth: 1, borderColor: C.line },
    ghost: { backgroundColor: 'transparent' },
    outline: { backgroundColor: '#fff', borderWidth: 1.5, borderColor: C.green },
    danger: { backgroundColor: '#fbe9e4' },
  };
  const textColors: Record<ButtonVariant, string> = {
    primary: '#fff', secondary: C.dgreen, ghost: C.dgreen, outline: C.dgreen, danger: C.danger,
  };
  const iconSize = size === 'lg' ? 20 : 18;

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
        width: full ? '100%' : undefined, borderRadius: 14, ...pads[size], ...skins[variant],
      }, style]}
    >
      {icon && <Icon name={icon as any} size={iconSize} color={textColors[variant]} />}
      <Text style={{ fontFamily: F.bodyBold, fontSize: fonts[size], color: textColors[variant], fontWeight: '700' }}>
        {children}
      </Text>
      {iconRight && <Icon name={iconRight as any} size={iconSize} color={textColors[variant]} />}
    </TouchableOpacity>
  );
}

// ---- TopBar -------------------------------------------------------
export function TopBar({
  title, onBack, right, theme = 'light', subtitle,
}: {
  title: string; onBack?: () => void; right?: React.ReactNode;
  theme?: 'light' | 'dark'; subtitle?: string;
}) {
  const { lang } = useApp();
  const isRTL = lang === 'ar';
  const dark = theme === 'dark';
  const textColor = dark ? C.cream : C.ink;
  // In RTL, back arrow points right
  const backIcon = isRTL ? 'chevRight' : 'chevLeft';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: 6, paddingBottom: 12, zIndex: 2 }}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={{
          width: 40, height: 40, borderRadius: 999,
          borderWidth: dark ? 1 : 1, borderColor: dark ? '#ffffff2e' : C.line,
          backgroundColor: dark ? '#ffffff1f' : '#fff',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={backIcon} size={22} color={textColor} />
        </TouchableOpacity>
      ) : <View style={{ width: 40 }} />}
      <View style={{ flex: 1, alignItems: 'center', minWidth: 0 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: textColor, lineHeight: 22 }} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && <Text style={{ fontSize: 11.5, color: dark ? '#ffffffaa' : C.mut, marginTop: 1 }}>{subtitle}</Text>}
      </View>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

// ---- Card ---------------------------------------------------------
export function Card({ children, onPress, pad = 16, style }: {
  children: React.ReactNode; onPress?: () => void; pad?: number; style?: object;
}) {
  const content = (
    <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: pad, ...style }}>
      {children}
    </View>
  );
  if (onPress) return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  return content;
}

// ---- Field --------------------------------------------------------
export function Field({
  label, value, onChangeText, placeholder, secureTextEntry, hint, error,
  prefix, suffix, icon, maxLength, keyboardType, autoFocus, onFocus,
}: {
  label?: string; value: string; onChangeText?: (v: string) => void;
  placeholder?: string; secureTextEntry?: boolean; hint?: string; error?: string;
  prefix?: string; suffix?: React.ReactNode; icon?: string; maxLength?: number;
  keyboardType?: any; autoFocus?: boolean; onFocus?: () => void;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.ink, marginBottom: 7, fontFamily: F.bodyBold }}>{label}</Text>}
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 9,
        backgroundColor: '#fff', borderWidth: 1.5, borderColor: error ? C.danger : C.line,
        borderRadius: 14, paddingHorizontal: 14, height: 52,
      }}>
        {icon && <Icon name={icon as any} size={19} color={C.mut} />}
        {prefix && <Text style={{ fontSize: 14.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>{prefix}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.mut}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          onFocus={onFocus}
          style={{ flex: 1, fontFamily: F.body, fontSize: 14.5, color: C.ink, padding: 0 }}
        />
        {suffix}
      </View>
      {(hint || error) && <Text style={{ fontSize: 11.5, color: error ? C.danger : C.mut, marginTop: 6 }}>{error || hint}</Text>}
    </View>
  );
}

// ---- Toggle -------------------------------------------------------
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <TouchableOpacity
      onPress={() => onChange(!on)}
      style={{ width: 46, height: 27, borderRadius: 999, backgroundColor: on ? C.green : '#d3d9d0', justifyContent: 'center', position: 'relative' }}
    >
      <View style={{
        position: 'absolute', top: 3, left: on ? 22 : 3, width: 21, height: 21,
        borderRadius: 999, backgroundColor: '#fff',
        shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 2, elevation: 2,
      }} />
    </TouchableOpacity>
  );
}

// ---- SectionTitle -------------------------------------------------
export function SectionTitle({ title, sub, action, onAction }: {
  title: string; sub?: string; action?: string; onAction?: () => void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
      <Text style={{ fontFamily: F.displayBold, fontSize: 19, fontWeight: '700', color: C.ink }}>{title}</Text>
      {sub && !action && <Text style={{ fontSize: 11.5, fontWeight: '700', letterSpacing: 0.6, textTransform: 'uppercase', color: C.green }}>{sub}</Text>}
      {action && <TouchableOpacity onPress={onAction}><Text style={{ fontFamily: F.body, color: C.green, fontSize: 12.5, fontWeight: '600' }}>{action}</Text></TouchableOpacity>}
    </View>
  );
}

// ---- Pill ---------------------------------------------------------
export function Pill({ children, active, onPress, icon }: {
  children: React.ReactNode; active?: boolean; onPress?: () => void; icon?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999,
        borderWidth: active ? 1.5 : 1.5,
        borderColor: active ? C.green : C.line,
        backgroundColor: active ? C.tint : '#fff',
      }}
    >
      {icon && <Icon name={icon as any} size={15} color={active ? C.dgreen : C.ink} />}
      <Text style={{ fontFamily: F.bodyBold, fontSize: 13, fontWeight: '600', color: active ? C.dgreen : C.ink }}>{children}</Text>
    </TouchableOpacity>
  );
}

// ---- StatusPill ---------------------------------------------------
const STATUS_MAP: Record<string, { label: string; bg: string; fg: string }> = {
  confirmed: { label: 'confirmedStatus', bg: '#e4f1e6', fg: '#2f7a44' },
  active: { label: 'activeStatus', bg: '#e3eefb', fg: '#2f6ab0' },
  pending: { label: 'pendingStatus', bg: '#fbeede', fg: '#b06d22' },
  completed: { label: 'completedStatus', bg: '#eef0ec', fg: '#6b7568' },
  cancelled: { label: 'cancelledStatus', bg: '#fbe9e4', fg: '#c2543c' },
  requested: { label: 'requestedStatus', bg: '#f0ecfb', fg: '#6b54b0' },
};

export function StatusPill({ status, label }: { status: string; label?: string }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: s.bg }}>
      <Text style={{ fontFamily: F.bodyBold, fontSize: 11, fontWeight: '700', color: s.fg }}>{label || status}</Text>
    </View>
  );
}

// ---- Stepper ------------------------------------------------------
export function Stepper({ step, total }: { step: number; total: number }) {
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', paddingVertical: 6, paddingBottom: 10 }}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={{
          height: 5, borderRadius: 999, width: i === step ? 22 : 5,
          backgroundColor: i <= step ? C.green : '#d8ddd3',
        }} />
      ))}
    </View>
  );
}

// ---- EmptyView ----------------------------------------------------
export function EmptyView({ title, body, ctaLabel, onCta }: {
  title: string; body: string; ctaLabel?: string; onCta?: () => void;
}) {
  return (
    <View style={{ alignItems: 'center', padding: 44 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <Icon name="leaf" size={40} color={C.green} />
      </View>
      <Text style={{ fontFamily: F.displayBold, fontSize: 20, fontWeight: '700', color: C.ink, marginBottom: 7, textAlign: 'center' }}>{title}</Text>
      <Text style={{ fontSize: 13, color: C.mut, textAlign: 'center', maxWidth: 250, lineHeight: 20, marginBottom: 20 }}>{body}</Text>
      {ctaLabel && <Button onPress={onCta}>{ctaLabel}</Button>}
    </View>
  );
}

// ---- AvailBadge ---------------------------------------------------
const AVAIL: Record<string, { label: string; bg: string; fg: string; dot: string }> = {
  available: { label: 'available', bg: '#e4f1e6', fg: '#2f7a44', dot: '#43a960' },
  limited: { label: 'limited', bg: '#fbeede', fg: '#b06d22', dot: '#d98b34' },
  full: { label: 'full', bg: '#efece5', fg: '#8a8577', dot: '#a8a496' },
};

export function AvailBadge({ avail, label }: { avail: string; label?: string }) {
  const a = AVAIL[avail] || AVAIL.available;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: a.bg, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 999 }}>
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: a.dot }} />
      <Text style={{ fontFamily: F.bodyBold, fontSize: 11, fontWeight: '600', color: a.fg }}>{label || avail}</Text>
    </View>
  );
}

// ---- Rating -------------------------------------------------------
export function Rating({ value, count, size = 13 }: { value: number | string; count?: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Icon name="star" size={size + 1} color={C.amber} fill={C.amber} />
      <Text style={{ fontFamily: F.bodyBold, fontSize: size, fontWeight: '600', color: C.ink }}>{value}</Text>
      {count != null && <Text style={{ fontSize: size, color: C.mut, fontWeight: '500' }}>({count})</Text>}
    </View>
  );
}

// ---- Verified -----------------------------------------------------
export function Verified({ size = 13, label = 'Verified' }: { size?: number; label?: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Icon name="shield" size={size + 3} color={C.green} />
      <Text style={{ fontFamily: F.bodyBold, fontSize: size, fontWeight: '600', color: C.green }}>{label}</Text>
    </View>
  );
}

// ---- NurseryImage -------------------------------------------------
export function NurseryImage({ src, seed, radius = 16, style }: {
  src?: string; seed?: string; radius?: number; style?: object;
}) {
  const [err, setErr] = useState(false);
  const uri = err ? `https://picsum.photos/seed/${seed || 'x'}/600/400` : src;
  return (
    <View style={{ flex: 1, borderRadius: radius, overflow: 'hidden', backgroundColor: '#dfe8dc', ...style }}>
      {uri ? (
        <Image source={{ uri }} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onError={() => setErr(true)} resizeMode="cover" />
      ) : null}
    </View>
  );
}

// ---- AvatarImage --------------------------------------------------
export function AvatarImage({ seed, size = 60, radius }: { seed?: string; size?: number; radius?: number }) {
  const uri = `https://i.pravatar.cc/240?u=${encodeURIComponent(seed || 'guest')}`;
  return (
    <View style={{ width: size, height: size, borderRadius: radius ?? size / 2, overflow: 'hidden', backgroundColor: '#e0d8c8' }}>
      <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="cover" />
    </View>
  );
}

// ---- LangToggle ---------------------------------------------------
export function LangToggle({ lang, onSet }: { lang: string; onSet: (l: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: C.cream, borderRadius: 999, padding: 3, borderWidth: 1, borderColor: C.line }}>
      {['EN', 'ع'].map(l => (
        <TouchableOpacity
          key={l}
          onPress={() => onSet(l)}
          style={{
            paddingVertical: 5, paddingHorizontal: 11, borderRadius: 999,
            backgroundColor: lang === l ? C.header : 'transparent',
          }}
        >
          <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 12.5, color: lang === l ? '#fff' : C.mut }}>{l}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
