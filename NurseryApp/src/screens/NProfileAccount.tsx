import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Toggle } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function Row({ icon, label, value, onPress, danger, right }: {
  icon: string; label: string; value?: string; onPress?: () => void; danger?: boolean; right?: React.ReactNode;
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress && !right} style={{ flexDirection: 'row', alignItems: 'center', gap: 13, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: danger ? '#fbe9e4' : C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon as any} size={18} color={danger ? C.danger : C.dgreen} />
      </View>
      <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: danger ? C.danger : C.ink, fontFamily: F.bodyBold }}>{label}</Text>
      {value && <Text style={{ fontSize: 12.5, color: C.mut }}>{value}</Text>}
      {right}
      {onPress && !danger && !right && <Icon name="chevRight" size={18} color={C.mut} />}
    </TouchableOpacity>
  );
}

function GroupTitle({ children }: { children: React.ReactNode }) {
  return <Text style={{ marginTop: 20, marginBottom: 6, fontSize: 11.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: C.soft }}>{children}</Text>;
}

export function NProfileAccount() {
  const navigation = useNavigation<Nav>();
  const { lang, setLang, store } = useN();
  const insets = useSafeAreaInsets();
  const [prefs, setPrefs] = useState({ newReq: true, payouts: true, reviews: true, system: true });

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: insets.bottom + 24, paddingTop: insets.top + 6 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink, marginBottom: 18 }}>{t(lang, 'account')}</Text>

        {/* Identity */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15, borderWidth: 1, borderColor: C.line, borderRadius: 18, marginBottom: 8 }}>
          <View style={{ width: 60, height: 60, borderRadius: 14, backgroundColor: C.tint, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="leaf" size={28} color={C.dgreen} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 2 }}>{store.nursery.name}</Text>
            <Text style={{ fontSize: 12.5, color: C.mut }}>{store.nursery.district} · Verified</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('NProfile')} style={{ width: 38, height: 38, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="edit" size={17} color={C.mut} />
          </TouchableOpacity>
        </View>

        <GroupTitle>{t(lang, 'manage2')}</GroupTitle>
        <View>
          <Row icon="image" label={t(lang, 'publicProfileTitle')} onPress={() => navigation.navigate('NProfile')} />
          <Row icon="camera" label={t(lang, 'photosVideoTitle')} onPress={() => navigation.navigate('NMedia')} />
          <Row icon="users" label={t(lang, 'capacityPricingTitle')} onPress={() => navigation.navigate('NCapacity')} />
          <Row icon="chart" label={t(lang, 'analytics')} onPress={() => navigation.navigate('NAnalytics')} />
        </View>

        <GroupTitle>{t(lang, 'money')}</GroupTitle>
        <View>
          <Row icon="creditCard" label={t(lang, 'billingInvoices')} onPress={() => navigation.navigate('NBilling')} />
          <Row icon="wallet" label={t(lang, 'settlements')} onPress={() => navigation.navigate('NSettlements')} />
        </View>

        <GroupTitle>{t(lang, 'verification')}</GroupTitle>
        <View>
          <Row icon="shield" label={t(lang, 'licenseKyc')} value="Approved" onPress={() => navigation.navigate('NApproval')} />
          <Row icon="badge" label={t(lang, 'licenseExpires')} value="12 Jul 2026" />
        </View>

        <GroupTitle>{t(lang, 'notifications')}</GroupTitle>
        <View>
          <Row icon="bell" label={t(lang, 'newRequestsPref')} right={<Toggle on={prefs.newReq} onChange={(b) => setPrefs({ ...prefs, newReq: b })} />} />
          <Row icon="moneyIn" label={t(lang, 'payoutsPref')} right={<Toggle on={prefs.payouts} onChange={(b) => setPrefs({ ...prefs, payouts: b })} />} />
          <Row icon="star" label={t(lang, 'reviewsPref')} right={<Toggle on={prefs.reviews} onChange={(b) => setPrefs({ ...prefs, reviews: b })} />} />
          <Row icon="info" label={t(lang, 'systemUpdates')} right={<Toggle on={prefs.system} onChange={(b) => setPrefs({ ...prefs, system: b })} />} />
        </View>

        <GroupTitle>{t(lang, 'preferences')}</GroupTitle>
        <View>
          <Row
            icon="globe"
            label={t(lang, 'language')}
            right={
              <View style={{ flexDirection: 'row', backgroundColor: C.cream, borderRadius: 999, padding: 3 }}>
                {['EN', 'AR'].map((l) => (
                  <TouchableOpacity key={l} onPress={() => setLang(l)} style={{ paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999, backgroundColor: lang === l ? C.header : 'transparent' }}>
                    <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 12, color: lang === l ? '#fff' : C.mut }}>{l === 'AR' ? 'ع' : 'EN'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            }
          />
          <Row icon="info" label={t(lang, 'helpSupport')} onPress={() => {}} />
          <Row icon="shield" label={t(lang, 'termsPrivacy')} onPress={() => {}} />
        </View>

        <View style={{ marginTop: 18 }}>
          <Row icon="logout" label={t(lang, 'signOut')} onPress={() => navigation.replace('NLogin')} danger />
        </View>
      </ScrollView>
    </View>
  );
}
