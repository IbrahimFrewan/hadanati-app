import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const EVENTS = [
  { d: 0, h: 8, dur: 4, group: 'Sunshine', color: '#3f8a5a', count: 11 },
  { d: 0, h: 9, dur: 3, group: 'Tiny Sprouts', color: '#e7a93a', count: 4 },
  { d: 1, h: 8, dur: 9, group: 'Sunshine', color: '#3f8a5a', count: 11 },
  { d: 1, h: 9, dur: 8, group: 'Rainbow', color: '#6b54b0', count: 9 },
  { d: 2, h: 8, dur: 9, group: 'Sunshine', color: '#3f8a5a', count: 12 },
  { d: 2, h: 13, dur: 3, group: 'Mira (hourly)', color: '#2f6ab0', count: 1 },
  { d: 3, h: 8, dur: 4, group: 'Karim (trial)', color: '#e7a93a', count: 1 },
  { d: 3, h: 8, dur: 5, group: 'Sunshine', color: '#3f8a5a', count: 11 },
  { d: 4, h: 9, dur: 6, group: 'Rainbow', color: '#6b54b0', count: 9 },
];

const ROW_H = 38;
const TIME_W = 32;

export function NCalendar() {
  const navigation = useNavigation<Nav>();
  const { lang } = useN();
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 6, paddingBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chevLeft" size={18} color={C.ink} />
          </TouchableOpacity>
          <Text style={{ fontFamily: F.displayBold, fontSize: 24, fontWeight: '700', color: C.ink }}>{t(lang, 'calendarTitle')}</Text>
        </View>
        <View style={{ flexDirection: 'row', backgroundColor: C.cream, borderRadius: 999, padding: 3 }}>
          {(['day', 'week', 'month'] as const).map((v) => (
            <TouchableOpacity key={v} onPress={() => setView(v)} style={{ paddingHorizontal: 13, paddingVertical: 6, borderRadius: 999, backgroundColor: view === v ? C.header : 'transparent' }}>
              <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 11.5, color: view === v ? '#fff' : C.mut, textTransform: 'capitalize' }}>{v}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingBottom: 10 }}>
        <TouchableOpacity style={{ width: 34, height: 34, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevLeft" size={18} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 15, color: C.ink }}>Jun 1 – 5, 2026</Text>
        <TouchableOpacity style={{ width: 34, height: 34, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chevRight" size={18} color={C.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Week grid */}
        <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff', position: 'relative' }}>
          {/* Header row */}
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: TIME_W }} />
            {DAYS.map((d, i) => (
              <View key={d} style={{ flex: 1, paddingVertical: 8, alignItems: 'center', backgroundColor: i === 1 ? C.tint : 'transparent', borderBottomWidth: 1, borderBottomColor: C.line }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: i === 1 ? C.dgreen : C.ink }}>{d}</Text>
                <Text style={{ fontFamily: F.displayBold, fontSize: 15, fontWeight: '800', color: i === 1 ? C.dgreen : C.ink, marginTop: 1 }}>{i + 1}</Text>
              </View>
            ))}
          </View>
          {/* Time rows */}
          {HOURS.map((h, hi) => (
            <View key={h} style={{ flexDirection: 'row', height: ROW_H, borderTopWidth: hi === 0 ? 0 : 1, borderTopColor: C.line }}>
              <View style={{ width: TIME_W, justifyContent: 'flex-start', paddingTop: 2, paddingRight: 4 }}>
                <Text style={{ fontSize: 9.5, color: C.mut, fontWeight: '600', textAlign: 'right' }}>{h}</Text>
              </View>
              {DAYS.map((_, d) => (
                <View key={d} style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: C.line }} />
              ))}
            </View>
          ))}
          {/* Events overlay */}
          {EVENTS.map((ev, i) => {
            const topOffset = 36 + (ev.h - 8) * ROW_H + 1;
            const colW = `${(100 - TIME_W) / 5}%` as any;
            return (
              <View key={i} style={{
                position: 'absolute',
                top: topOffset,
                left: TIME_W + ev.d * ((100) / 5 * 3.2),
                width: 58,
                height: ev.dur * ROW_H - 4,
                backgroundColor: ev.color + '22',
                borderLeftWidth: 3,
                borderLeftColor: ev.color,
                borderRadius: 6,
                padding: 4,
                overflow: 'hidden',
              }}>
                <Text style={{ fontSize: 9.5, fontWeight: '700', color: ev.color, lineHeight: 12 }}>{ev.group}</Text>
                <Text style={{ fontSize: 9, fontWeight: '600', color: ev.color, opacity: 0.8 }}>{ev.count} ch</Text>
              </View>
            );
          })}
        </View>

        {/* Legend */}
        <View style={{ flexDirection: 'row', gap: 13, marginTop: 14, flexWrap: 'wrap' }}>
          {[['#3f8a5a', 'Monthly group'], ['#e7a93a', 'Daily/Trial'], ['#2f6ab0', 'Hourly'], ['#6b54b0', 'Preschool']].map(([c, l]) => (
            <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <View style={{ width: 9, height: 9, borderRadius: 3, backgroundColor: c }} />
              <Text style={{ fontSize: 11, color: C.mut, fontWeight: '600' }}>{l}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
