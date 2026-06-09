import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, Toggle, SectionTitle } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NCapacity() {
  const navigation = useNavigation<Nav>();
  const { lang, store } = useN();
  const [cap, setCap] = useState(store.capacity);
  const [prices, setPrices] = useState({ hourly: 6, daily: 14, weekly: 65, monthly: 160 });
  const [seasonal, setSeasonal] = useState(false);
  const [autoDecline, setAutoDecline] = useState(true);

  const adjust = (i: number, delta: number) =>
    setCap((c) => c.map((g, k) => k === i ? { ...g, total: Math.max(g.filled, g.total + delta) } : g));

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar
        title={t(lang, 'capacityPricing')}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity>
            <Text style={{ fontFamily: F.bodyBold, color: C.dgreen, fontWeight: '700', fontSize: 13 }}>{t(lang, 'save')}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
        <SectionTitle title={t(lang, 'capacityByGroup')} />
        <View style={{ gap: 11, marginBottom: 24 }}>
          {cap.map((c, i) => {
            const pct = Math.round(c.filled / c.total * 100);
            const full = c.filled >= c.total - 1;
            return (
              <View key={c.group} style={{ borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <View>
                    <Text style={{ fontFamily: F.displayBold, fontSize: 15.5, fontWeight: '700', color: C.ink, marginBottom: 2 }}>{c.group}</Text>
                    <Text style={{ fontSize: 11.5, color: C.mut }}>{c.age}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999, backgroundColor: full ? '#fbeede' : '#e4f1e6' }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: full ? '#b06d22' : C.green }}>{pct}%</Text>
                  </View>
                </View>
                <View style={{ height: 7, borderRadius: 999, backgroundColor: C.cream, overflow: 'hidden', marginBottom: 11 }}>
                  <View style={{ width: `${pct}%`, height: '100%', backgroundColor: full ? C.amber : C.green }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13 }}>
                  <Text style={{ fontSize: 12, color: C.mut }}>{t(lang, 'capacity')}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line, borderRadius: 10, overflow: 'hidden', marginLeft: 'auto' }}>
                    <TouchableOpacity onPress={() => adjust(i, -1)} disabled={c.total <= c.filled} style={{ width: 32, height: 32, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="minus" size={17} color={c.total <= c.filled ? '#cdd6cd' : C.dgreen} />
                    </TouchableOpacity>
                    <View style={{ width: 44, alignItems: 'center' }}>
                      <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 15, color: C.ink }}>{c.total}</Text>
                    </View>
                    <TouchableOpacity onPress={() => adjust(i, 1)} style={{ width: 32, height: 32, backgroundColor: '#fff', borderLeftWidth: 1, borderLeftColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="plus" size={17} color={C.dgreen} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={{ marginTop: 8, fontSize: 11, color: C.mut }}>
                  <Text style={{ color: C.ink, fontWeight: '700' }}>{c.filled} of {c.total}</Text> spots filled · {c.total - c.filled} {t(lang, 'spotsAvailable')}
                </Text>
              </View>
            );
          })}
        </View>

        <SectionTitle title={t(lang, 'basePricing')} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          {([['hourly', t(lang, 'hourly'), '/hr'], ['daily', t(lang, 'daily'), '/day'], ['weekly', t(lang, 'weekly'), '/wk'], ['monthly', t(lang, 'monthly'), '/mo']] as const).map(([k, l, u]) => (
            <View key={k} style={{ width: '47%', borderWidth: 1, borderColor: C.line, borderRadius: 14, padding: 13 }}>
              <Text style={{ fontSize: 12, color: C.mut, fontWeight: '600', marginBottom: 7 }}>{l}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
                <TextInput
                  value={String(prices[k])}
                  onChangeText={(v) => setPrices({ ...prices, [k]: +v || 0 })}
                  keyboardType="number-pad"
                  style={{ fontFamily: F.displayExtraBold, fontWeight: '800', fontSize: 22, color: C.ink, padding: 0, minWidth: 50 }}
                />
                <Text style={{ fontSize: 12, color: C.mut, fontWeight: '600' }}>JD{u}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: C.cream, borderRadius: 14, marginBottom: 14 }}>
          <Icon name="tag" size={19} color={C.dgreen} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink }}>{t(lang, 'seasonalPricing')}</Text>
            <Text style={{ fontSize: 11.5, color: C.mut, marginTop: 1 }}>{t(lang, 'seasonalDesc')}</Text>
          </View>
          <Toggle on={seasonal} onChange={setSeasonal} />
        </View>

        <SectionTitle title="Auto-decline" />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1, borderColor: C.line, borderRadius: 14 }}>
          <Icon name="clock" size={19} color={C.dgreen} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink }}>{t(lang, 'autoDeclineTitle')}</Text>
            <Text style={{ fontSize: 11.5, color: C.mut, marginTop: 1 }}>{t(lang, 'autoDeclineDesc')}</Text>
          </View>
          <Toggle on={autoDecline} onChange={setAutoDecline} />
        </View>
      </ScrollView>
    </View>
  );
}
