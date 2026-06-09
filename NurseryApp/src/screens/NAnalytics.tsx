import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, Pill, SectionTitle } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const BARS = [3, 5, 4, 6, 7, 5, 8, 9, 7, 10, 12, 9, 11, 13];
const MAX = Math.max(...BARS);

const KPIS = [
  { label: 'Bookings', value: '38', delta: '+18%', icon: 'calendar', up: true },
  { label: 'Revenue', value: '5,420 JD', delta: '+12%', icon: 'moneyIn', up: true },
  { label: 'Profile views', value: '412', delta: '+34%', icon: 'eye', up: true },
  { label: 'Avg. rating', value: '4.8', delta: '−0.1', icon: 'star', up: false },
];

export function NAnalytics() {
  const navigation = useNavigation<Nav>();
  const { lang } = useN();
  const [range, setRange] = useState('30d');

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar
        title={t(lang, 'analytics')}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="download" size={19} color={C.ink} />
          </TouchableOpacity>
        }
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, gap: 7, paddingBottom: 14 }}>
        {[['7d', '7 days'], ['30d', '30 days'], ['3m', '3 months']].map(([k, l]) => (
          <Pill key={k} active={range === k} onPress={() => setRange(k)}>{l}</Pill>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* KPIs */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
          {KPIS.map((k) => (
            <View key={k.label} style={{ width: '47%', backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 13 }}>
              <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                <Icon name={k.icon as any} size={17} color={C.dgreen} />
              </View>
              <Text style={{ fontFamily: F.displayExtraBold, fontSize: 20, fontWeight: '800', color: C.ink, marginBottom: 1 }}>{k.value}</Text>
              <Text style={{ fontSize: 11, color: C.mut, marginBottom: 5 }}>{k.label}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Icon name={k.up ? 'arrowUp' : 'arrowDown'} size={11} color={k.up ? C.green : C.danger} />
                <Text style={{ fontSize: 10.5, fontWeight: '700', color: k.up ? C.green : C.danger }}>{k.delta}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bookings bar chart */}
        <SectionTitle title={t(lang, 'bookingsDaily')} />
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 16, marginBottom: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 5, height: 130 }}>
            {BARS.map((v, i) => (
              <View key={i} style={{ flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                <View style={{ height: `${(v / MAX) * 100}%`, backgroundColor: i === BARS.length - 1 ? C.green : '#cfe0cf', borderRadius: 4 }} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 9 }}>
            <Text style={{ fontSize: 9.5, color: C.mut }}>14 days ago</Text>
            <Text style={{ fontSize: 9.5, color: C.mut }}>Yesterday</Text>
            <Text style={{ fontSize: 9.5, color: C.mut }}>Today</Text>
          </View>
        </View>

        {/* Funnel */}
        <SectionTitle title={t(lang, 'funnel30d')} />
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 16, marginBottom: 22 }}>
          {[['Profile views', 412, 100], ['Booking requests', 64, 16], ['Accepted', 51, 12], ['Completed', 38, 9]].map(([l, v, pct], i, arr) => (
            <View key={l as string} style={{ marginBottom: i === arr.length - 1 ? 0 : 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.ink }}>{l as string}</Text>
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.dgreen, fontFamily: F.displayBold }}>
                  {v}<Text style={{ fontSize: 10.5, color: C.mut, fontWeight: '500' }}> · {pct}%</Text>
                </Text>
              </View>
              <View style={{ height: 6, borderRadius: 999, backgroundColor: C.cream, overflow: 'hidden' }}>
                <View style={{ width: `${pct as number}%`, height: '100%', backgroundColor: C.green }} />
              </View>
            </View>
          ))}
        </View>

        {/* Age breakdown */}
        <SectionTitle title={t(lang, 'bookingsByAge')} />
        <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 16 }}>
          {[['Toddler 1–3 yrs', 22, '#3f8a5a'], ['Preschool 3–5 yrs', 11, '#6b54b0'], ['Infant 0–1 yr', 5, '#e7a93a']].map(([l, v, c]) => {
            const pct = Math.round((v as number) / 38 * 100);
            return (
              <View key={l as string} style={{ marginBottom: 11 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.ink }}>{l as string}</Text>
                  <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.ink, fontFamily: F.displayBold }}>
                    {v}<Text style={{ color: C.mut, fontWeight: '500', fontSize: 10.5 }}> · {pct}%</Text>
                  </Text>
                </View>
                <View style={{ height: 6, borderRadius: 999, backgroundColor: C.cream, overflow: 'hidden' }}>
                  <View style={{ width: `${pct}%`, height: '100%', backgroundColor: c as string }} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
