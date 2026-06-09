import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, SectionTitle } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NSettlements() {
  const navigation = useNavigation<Nav>();
  const { lang, store } = useN();
  const next = store.payouts.find((p) => p.status === 'accruing');

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar title={t(lang, 'settlements')} subtitle={t(lang, 'payoutsToBank')} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
        {/* Next payout card */}
        {next && (
          <View style={{ backgroundColor: C.header, borderRadius: 18, padding: 18, marginBottom: 18, overflow: 'hidden', position: 'relative' }}>
            <View style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: 70, backgroundColor: '#ffffff07' }} />
            <Text style={{ fontSize: 11, color: '#ffffffbb', fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>{t(lang, 'nextPayout')}</Text>
            <Text style={{ fontFamily: F.displayExtraBold, fontWeight: '800', fontSize: 32, color: C.cream, marginBottom: 12 }}>
              {next.net} <Text style={{ fontSize: 14, color: '#ffffffbb', fontWeight: '600' }}>JD</Text>
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 12, color: '#ffffffcc' }}>Settles on 1 Jul · Cairo Amman Bank ••3421</Text>
              <View style={{ backgroundColor: '#ffffff22', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.cream }}>{next.period.split(' (')[0]}</Text>
              </View>
            </View>
          </View>
        )}

        <SectionTitle title={t(lang, 'payoutMethod')} action={t(lang, 'change')} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1, borderColor: C.line, borderRadius: 14, marginBottom: 24 }}>
          <View style={{ width: 44, height: 44, borderRadius: 11, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="creditCard" size={20} color={C.dgreen} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink }}>Cairo Amman Bank</Text>
            <Text style={{ fontSize: 11.5, color: C.mut, marginTop: 1 }}>IBAN ••• ••• ••• 3421 · Hanan Al-Khalili</Text>
          </View>
          <View style={{ backgroundColor: '#e4f1e6', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999 }}>
            <Text style={{ fontSize: 10.5, fontWeight: '700', color: C.green }}>Verified</Text>
          </View>
        </View>

        <SectionTitle title={t(lang, 'history')} />
        {store.payouts.map((p) => (
          <View key={p.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line }}>
            <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: p.status === 'paid' ? '#e4f1e6' : C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name={p.status === 'paid' ? 'checkCircle' : 'refresh'} size={19} color={p.status === 'paid' ? '#2f7a44' : C.dgreen} />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ fontFamily: F.displayBold, fontSize: 14.5, fontWeight: '700', color: C.ink, marginBottom: 2 }}>{p.period.split(' (')[0]}</Text>
              <Text style={{ fontSize: 11.5, color: C.mut }}>{p.gross} JD − {p.fees} JD fees · {p.status === 'paid' ? `Paid ${p.date}` : 'Settles 1 Jul'}</Text>
            </View>
            <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 15, color: C.dgreen }}>{p.net} JD</Text>
          </View>
        ))}

        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginTop: 14 }}>
          <Icon name="info" size={14} color={C.mut} />
          <Text style={{ fontSize: 11, color: C.mut, lineHeight: 18, flex: 1 }}>{t(lang, 'feeNote')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}
