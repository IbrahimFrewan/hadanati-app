import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Sheet } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PLAN: Record<string, string> = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

function fmtTime(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function expiryStyle(s: number) {
  if (s < 6 * 3600) return { fg: '#c2543c', bg: '#fbe9e4' };
  if (s < 12 * 3600) return { fg: '#b06d22', bg: '#fbeede' };
  return { fg: '#3d7a4f', bg: '#e4f1e6' };
}

function Row({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.line }}>
      <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon as any} size={17} color={C.dgreen} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 11.5, color: C.mut, marginBottom: 1 }}>{label}</Text>
        <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>{value}</Text>
      </View>
    </View>
  );
}

export function NRequestDetail() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'NRequestDetail'>>();
  const { lang, store, actions } = useN();
  const r = store.requests.find((x) => x.id === route.params.id) || store.requests[0];
  const [decline, setDecline] = useState(false);
  const exp = expiryStyle(r.expiresIn || 0);

  const accept = () => {
    actions.respondRequest(r.id, 'accepted');
    navigation.goBack();
  };
  const declineConfirm = () => {
    actions.respondRequest(r.id, 'declined');
    setDecline(false);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar title={t(lang, 'requestDetail')} subtitle={r.parent} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 22 }} showsVerticalScrollIndicator={false}>
        {r.status === 'pending' && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: exp.bg, borderRadius: 12, padding: 10, marginBottom: 18 }}>
            <Icon name="clock" size={17} color={exp.fg} />
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: exp.fg, flex: 1 }}>
              {t(lang, 'expiresIn')} {fmtTime(r.expiresIn)} · {t(lang, 'autoDecline')}
            </Text>
          </View>
        )}

        {/* Parent block */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderWidth: 1, borderColor: C.line, borderRadius: 16, marginBottom: 18 }}>
          <View style={{ width: 52, height: 52, borderRadius: 999, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 19, color: C.dgreen }}>{r.parent[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: F.displayBold, fontSize: 17, fontWeight: '700', color: C.ink, marginBottom: 3 }}>{r.parent}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Icon name="lock" size={12} color={C.mut} />
              <Text style={{ fontSize: 12, color: C.mut }}>+962 ••• •• {r.phoneLast}</Text>
              <Text style={{ fontSize: 12, color: r.paid ? C.green : '#b06d22', fontWeight: '700', marginLeft: 6 }}>
                · {r.paid ? 'Paid' : 'Awaiting payment'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chat" size={18} color={C.dgreen} />
          </TouchableOpacity>
        </View>

        <Text style={{ fontFamily: F.displayBold, fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 4 }}>{t(lang, 'bookingDetails')}</Text>
        <Row icon="users" label={t(lang, 'child')} value={r.child} />
        <Row icon="calendar" label={t(lang, 'schedule')} value={`${PLAN[r.type]} · ${r.from}`} />
        <Row icon="moneyIn" label={t(lang, 'price')} value={`${r.price} JD / ${r.unit}`} />

        {r.note ? (
          <>
            <Text style={{ fontFamily: F.displayBold, fontSize: 15, fontWeight: '700', color: C.ink, marginTop: 20, marginBottom: 8 }}>{t(lang, 'noteFromParent')}</Text>
            <View style={{ backgroundColor: C.cream, borderLeftWidth: 3, borderLeftColor: C.green, borderRadius: 10, padding: 14 }}>
              <Text style={{ fontSize: 13, color: C.ink, lineHeight: 21 }}>{r.note}</Text>
            </View>
          </>
        ) : null}

        <Text style={{ fontFamily: F.displayBold, fontSize: 15, fontWeight: '700', color: C.ink, marginTop: 20, marginBottom: 8 }}>{t(lang, 'capacityCheck')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#e4f1e6', borderRadius: 12, padding: 12 }}>
          <Icon name="checkCircle" size={18} color="#2f7a44" />
          <Text style={{ fontSize: 13, color: '#2f7a44', fontWeight: '600', flex: 1 }}>
            Spot available in <Text style={{ fontWeight: '700' }}>Sunshine (Toddler)</Text> · 11 of 12
          </Text>
        </View>
      </ScrollView>

      {r.status === 'pending' && (
        <View style={{ paddingHorizontal: 22, paddingVertical: 12, paddingBottom: 26, borderTopWidth: 1, borderTopColor: C.line, flexDirection: 'row', gap: 11 }}>
          <Button variant="danger" onPress={() => setDecline(true)} style={{ flex: 1 }}>{t(lang, 'declineRequest')}</Button>
          <Button onPress={accept} style={{ flex: 2 }} icon="check">{t(lang, 'acceptRequest')}</Button>
        </View>
      )}

      <Sheet open={decline} onClose={() => setDecline(false)} title={t(lang, 'declineTitle')} height={480}>
        <Text style={{ fontSize: 13, color: C.mut, lineHeight: 21, marginBottom: 14 }}>{t(lang, 'declineBody')}</Text>
        <View style={{ gap: 9, marginBottom: 18 }}>
          {[t(lang, 'declineReason1'), t(lang, 'declineReason2'), t(lang, 'declineReason3'), t(lang, 'declineReason4')].map((reason) => (
            <TouchableOpacity key={reason} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13, borderWidth: 1, borderColor: C.line, borderRadius: 12, backgroundColor: '#fff' }}>
              <Text style={{ fontSize: 13.5, color: C.ink, flex: 1 }}>{reason}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ flexDirection: 'row', gap: 11 }}>
          <Button variant="secondary" onPress={() => setDecline(false)} style={{ flex: 1 }}>{t(lang, 'keep')}</Button>
          <Button variant="danger" onPress={declineConfirm} style={{ flex: 1 }}>{t(lang, 'declineAndRefund')}</Button>
        </View>
      </Sheet>
    </View>
  );
}
