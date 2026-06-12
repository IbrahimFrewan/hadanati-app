import { useSafeAreaInsets } from 'react-native-safe-area-context';
import React from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Image, ScrollView,
} from 'react-native';
import { C, F } from '../theme';
import { Icon } from './Icon';
import { useN } from '../context/NurseryContext';

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
  const { lang } = useN();
  const insets = useSafeAreaInsets();
  const isRTL = lang === 'AR';
  const dark = theme === 'dark';
  const textColor = dark ? C.cream : C.ink;
  const backIcon = isRTL ? 'chevRight' : 'chevLeft';

  return (
    // Top safe-area inset lives here so every screen using TopBar clears the
    // status bar (screens use plain View roots).
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingTop: insets.top + 6, paddingBottom: 12, zIndex: 2 }}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={{
          width: 40, height: 40, borderRadius: 999,
          borderWidth: 1, borderColor: dark ? '#ffffff2e' : C.line,
          backgroundColor: dark ? '#ffffff1f' : '#fff',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={backIcon as any} size={22} color={textColor} />
        </TouchableOpacity>
      ) : <View style={{ width: 40 }} />}
      <View style={{ flex: 1, alignItems: 'center', minWidth: 0 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: textColor }} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && <Text style={{ fontSize: 11.5, color: dark ? '#ffffffaa' : C.mut, marginTop: 1 }}>{subtitle}</Text>}
      </View>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

// ---- Field --------------------------------------------------------
export function Field({
  label, value, onChangeText, placeholder, secureTextEntry, hint, error,
  icon, maxLength, keyboardType, multiline,
}: {
  label?: string; value: string; onChangeText?: (v: string) => void;
  placeholder?: string; secureTextEntry?: boolean; hint?: string; error?: string;
  icon?: string; maxLength?: number; keyboardType?: any; multiline?: boolean;
}) {
  return (
    <View style={{ marginBottom: 16 }}>
      {label && <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.ink, marginBottom: 7, fontFamily: F.bodyBold }}>{label}</Text>}
      <View style={{
        flexDirection: 'row', alignItems: multiline ? 'flex-start' : 'center', gap: 9,
        backgroundColor: '#fff', borderWidth: 1.5, borderColor: error ? C.danger : C.line,
        borderRadius: 14, paddingHorizontal: 14, minHeight: 52, paddingVertical: multiline ? 12 : 0,
      }}>
        {icon && <Icon name={icon as any} size={19} color={C.mut} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.mut}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
          keyboardType={keyboardType}
          multiline={multiline}
          style={{ flex: 1, fontFamily: F.body, fontSize: 14.5, color: C.ink, padding: 0, textAlignVertical: multiline ? 'top' : 'center' }}
        />
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

// ---- Pill ---------------------------------------------------------
export function Pill({ children, active, onPress }: {
  children: React.ReactNode; active?: boolean; onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 8, paddingHorizontal: 14, borderRadius: 999,
        borderWidth: 1.5, borderColor: active ? C.green : C.line,
        backgroundColor: active ? C.tint : '#fff',
      }}
    >
      <Text style={{ fontFamily: F.bodyBold, fontSize: 13, fontWeight: '600', color: active ? C.dgreen : C.ink }}>{children}</Text>
    </TouchableOpacity>
  );
}

// ---- StatusPill ---------------------------------------------------
const STATUS_STYLES: Record<string, { bg: string; fg: string }> = {
  confirmed: { bg: '#e4f1e6', fg: '#2f7a44' },
  accepted: { bg: '#e4f1e6', fg: '#2f7a44' },
  pending: { bg: '#fbeede', fg: '#b06d22' },
  declined: { bg: '#fbe9e4', fg: '#c2543c' },
  cancelled: { bg: '#fbe9e4', fg: '#c2543c' },
};

export function StatusPill({ status, label }: { status: string; label?: string }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending;
  return (
    <View style={{ paddingVertical: 4, paddingHorizontal: 10, borderRadius: 999, backgroundColor: s.bg }}>
      <Text style={{ fontFamily: F.bodyBold, fontSize: 11, fontWeight: '700', color: s.fg }}>
        {label || (status.charAt(0).toUpperCase() + status.slice(1))}
      </Text>
    </View>
  );
}

// ---- Rating -------------------------------------------------------
export function Rating({ value, count, size = 13 }: { value: number | string; count?: number; size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Icon name="star" size={size + 1} color={C.amber} fill={C.amber} />
      <Text style={{ fontFamily: F.bodyBold, fontSize: size, fontWeight: '600', color: C.ink }}>{value}</Text>
      {count != null && <Text style={{ fontSize: size, color: C.mut }}>({count})</Text>}
    </View>
  );
}

// ---- Verified -----------------------------------------------------
export function Verified({ size = 13 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <Icon name="shield" size={size + 3} color={C.green} />
      <Text style={{ fontFamily: F.bodyBold, fontSize: size, fontWeight: '600', color: C.green }}>Verified</Text>
    </View>
  );
}

// ---- AvatarPlaceholder -------------------------------------------
export function AvatarPlaceholder({ size = 44, tone = '#cba47a', initial }: {
  size?: number; tone?: string; initial?: string;
}) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: tone, alignItems: 'center', justifyContent: 'center' }}>
      {initial ? (
        <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: size * 0.4, color: '#fff' }}>{initial}</Text>
      ) : null}
    </View>
  );
}

// ---- SectionTitle -------------------------------------------------
export function SectionTitle({ title, action, onAction }: {
  title: string; action?: string; onAction?: () => void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
      <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink }}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ fontFamily: F.body, color: C.green, fontSize: 12.5, fontWeight: '600' }}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ---- EmptyView ----------------------------------------------------
export function EmptyView({ title, body }: { title: string; body: string }) {
  return (
    <View style={{ alignItems: 'center', padding: 44 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <Icon name="leaf" size={40} color={C.green} />
      </View>
      <Text style={{ fontFamily: F.displayBold, fontSize: 20, fontWeight: '700', color: C.ink, marginBottom: 7, textAlign: 'center' }}>{title}</Text>
      <Text style={{ fontSize: 13, color: C.mut, textAlign: 'center', maxWidth: 250, lineHeight: 20 }}>{body}</Text>
    </View>
  );
}

// ---- Sheet (bottom sheet) ----------------------------------------
export function Sheet({
  open, onClose, title, children, height = 480,
}: {
  open: boolean; onClose: () => void; title?: string; children: React.ReactNode; height?: number;
}) {
  if (!open) return null;
  return (
    <View style={{
      position: 'absolute', inset: 0, top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#00000055', justifyContent: 'flex-end', zIndex: 100,
    }}>
      <TouchableOpacity style={{ position: 'absolute', inset: 0 }} onPress={onClose} />
      <View style={{
        backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 22, paddingBottom: 34, maxHeight: height,
      }}>
        <View style={{ width: 36, height: 4, borderRadius: 999, backgroundColor: C.line, alignSelf: 'center', marginBottom: 18 }} />
        {title ? <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 14 }}>{title}</Text> : null}
        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </View>
    </View>
  );
}
