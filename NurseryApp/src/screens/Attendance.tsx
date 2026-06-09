import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, Pill, Sheet, TopBar, AvatarPlaceholder } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const STATUS_STYLES = {
  in: { label: 'Checked in', bg: '#e4f1e6', fg: '#2f7a44', dot: '#43a960' },
  out: { label: 'Not checked in', bg: '#eef0ec', fg: '#6b7568', dot: '#a8a496' },
  absent: { label: 'Absent', bg: '#fbe9e4', fg: '#c2543c', dot: '#d9694e' },
};

export function Attendance() {
  const navigation = useNavigation<Nav>();
  const { lang, store, actions } = useN();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'all' | 'in' | 'out' | 'absent'>('all');
  const [qr, setQr] = useState(false);
  const [scanned, setScanned] = useState<{ name: string; parent: string } | null>(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (qr && !scanned) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [qr, scanned]);

  const roster = store.roster.filter((k) => filter === 'all' || k.status === filter);
  const counts = {
    in: store.roster.filter((k) => k.status === 'in').length,
    out: store.roster.filter((k) => k.status === 'out').length,
    absent: store.roster.filter((k) => k.status === 'absent').length,
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar
        title={t(lang, 'attendance')}
        subtitle="Today · 2 Jun · 9:24 AM"
        right={
          <TouchableOpacity onPress={() => setQr(true)} style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="qrScan" size={20} color="#fff" />
          </TouchableOpacity>
        }
      />

      {/* Summary chips */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 22, paddingBottom: 14 }}>
        {(['in', 'out', 'absent'] as const).map((k) => {
          const s = STATUS_STYLES[k];
          const labels: Record<string, string> = { in: 'In', out: 'Pending', absent: 'Absent' };
          return (
            <View key={k} style={{ flex: 1, backgroundColor: s.bg, borderRadius: 12, padding: 10 }}>
              <Text style={{ fontFamily: F.displayExtraBold, fontSize: 22, fontWeight: '800', color: s.fg }}>{counts[k]}</Text>
              <Text style={{ fontSize: 10.5, fontWeight: '600', color: s.fg }}>{labels[k]}</Text>
            </View>
          );
        })}
      </View>

      {/* Filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, gap: 8, paddingBottom: 12 }}>
        <Pill active={filter === 'all'} onPress={() => setFilter('all')}>All {store.roster.length}</Pill>
        <Pill active={filter === 'in'} onPress={() => setFilter('in')}>In {counts.in}</Pill>
        <Pill active={filter === 'out'} onPress={() => setFilter('out')}>Not in {counts.out}</Pill>
        <Pill active={filter === 'absent'} onPress={() => setFilter('absent')}>Absent {counts.absent}</Pill>
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {roster.map((k) => {
          const s = STATUS_STYLES[k.status];
          return (
            <View key={k.id} style={{ flexDirection: 'row', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.line, alignItems: 'center' }}>
              <View style={{ position: 'relative' }}>
                <AvatarPlaceholder size={44} tone="#cba47a" />
                <View style={{ position: 'absolute', bottom: -1, right: -1, width: 13, height: 13, borderRadius: 999, backgroundColor: s.dot, borderWidth: 2, borderColor: '#fff' }} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: F.displayBold, fontSize: 15.5, fontWeight: '700', color: C.ink, marginBottom: 1 }}>{k.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Text style={{ fontSize: 11.5, color: C.mut }}>{k.age} · {k.group}</Text>
                  {k.note ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Icon name="alert" size={11} color="#b06d22" />
                      <Text style={{ fontSize: 11, color: '#b06d22' }}>Note</Text>
                    </View>
                  ) : null}
                </View>
              </View>
              {k.status === 'in' ? (
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontFamily: F.displayBold, fontSize: 14, fontWeight: '800', color: C.green }}>{k.inAt}</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('NCheckoutReport', { childId: k.id })}>
                    <Text style={{ color: C.danger, fontWeight: '700', fontSize: 11.5, fontFamily: F.bodyBold, marginTop: 2 }}>{t(lang, 'checkOut')}</Text>
                  </TouchableOpacity>
                </View>
              ) : k.status === 'out' ? (
                <View style={{ flexDirection: 'row', gap: 7 }}>
                  <TouchableOpacity onPress={() => actions.markAbsent(k.id)} style={{ width: 36, height: 36, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="x" size={17} color={C.danger} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => actions.checkIn(k.id, '9:24')} style={{ height: 36, paddingHorizontal: 14, borderRadius: 999, backgroundColor: C.header, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon name="check" size={15} color="#fff" />
                    <Text style={{ color: '#fff', fontFamily: F.bodyBold, fontWeight: '700', fontSize: 12.5 }}>In</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ backgroundColor: s.bg, paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999 }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: s.fg }}>Absent</Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* QR Sheet */}
      <Sheet open={qr} onClose={() => { setQr(false); setScanned(null); }} title={scanned ? '' : t(lang, 'scanParentQr')} height={540}>
        {!scanned ? (
          <View>
            <Text style={{ fontSize: 13, color: C.mut, lineHeight: 21, marginBottom: 18 }}>{t(lang, 'scanInstructions')}</Text>
            <View style={{ aspectRatio: 1, maxWidth: 280, alignSelf: 'center', backgroundColor: '#1c2820', borderRadius: 18, overflow: 'hidden', marginBottom: 18, position: 'relative' }}>
              {/* Corner brackets */}
              {[
                { top: 14, left: 14, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 10 },
                { top: 14, right: 14, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 10 },
                { bottom: 14, left: 14, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 10 },
                { bottom: 14, right: 14, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 10 },
              ].map((style, i) => (
                <View key={i} style={[{ position: 'absolute', width: 40, height: 40, borderColor: C.green, borderStyle: 'solid' }, style as any]} />
              ))}
              {/* Scan line */}
              <Animated.View style={{
                position: 'absolute', left: 30, right: 30, height: 2,
                backgroundColor: C.green,
                transform: [{ translateY: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 200] }) }],
              }} />
              <Text style={{ position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center', color: '#cfe0cf', fontSize: 12 }}>{t(lang, 'aligning')}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 11 }}>
              <Button variant="secondary" onPress={() => setQr(false)} style={{ flex: 1 }}>{t(lang, 'cancel')}</Button>
              <Button onPress={() => setScanned({ name: 'Yara H.', parent: 'Layla H.' })} style={{ flex: 1 }} icon="check">{t(lang, 'simulateScan')}</Button>
            </View>
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 10 }}>
            <View style={{ width: 78, height: 78, borderRadius: 999, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name="check" size={42} color="#fff" />
            </View>
            <Text style={{ fontFamily: F.displayBold, fontSize: 21, fontWeight: '700', color: C.ink, marginBottom: 6 }}>Checked in</Text>
            <Text style={{ fontSize: 14, color: C.mut, marginBottom: 4 }}>{scanned.name} · {scanned.parent}</Text>
            <Text style={{ fontFamily: F.displayExtraBold, fontSize: 32, fontWeight: '800', color: C.dgreen, marginBottom: 22 }}>9:24 AM</Text>
            <Button full onPress={() => { actions.checkIn('k1', '9:24'); setQr(false); setScanned(null); }}>{t(lang, 'done')}</Button>
          </View>
        )}
      </Sheet>
    </View>
  );
}
