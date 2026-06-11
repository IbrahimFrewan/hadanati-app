import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button } from '../components';
import { useApp } from '../context/AppContext';
import { getNursery } from '../data';
import { t } from '../i18n';

const PLAN_LABEL: Record<string, string> = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

export function ConfirmScreen({ navigation }: any) {
  const { store, lang } = useApp();
  const n = getNursery(store.draft.nurseryId);
  const childIds: string[] = store.draft.childIds?.length ? store.draft.childIds : (store.draft.childId ? [store.draft.childId] : []);
  const childNames = childIds.map((id: string) => store.children.find(c => c.id === id)?.name).filter(Boolean).join(' & ') || 'Your child';
  const ref = 'HD-' + (store.draft.bookingId || 'b3').toUpperCase() + '-2026';
  const isRTL = lang === 'ar';

  return (
    <View style={{ flex: 1, backgroundColor: C.header }}>
      {/* Motif dots placeholder */}
      <View style={{ position: 'absolute', inset: 0, opacity: 0.07 }} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
          <View style={{ width: 92, height: 92, borderRadius: 46, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
            <Icon name="check" size={50} color={C.green} />
          </View>
          <Text style={{ fontFamily: F.displayBold, fontSize: 30, fontWeight: '700', color: C.cream, textAlign: 'center', marginBottom: 8 }}>{t(lang, 'youreBooked')}</Text>
          <Text style={{ fontSize: 14, color: C.cream, opacity: 0.85, lineHeight: 22, textAlign: 'center', marginBottom: 4 }}>
            {childNames}{t(lang, 'spotConfirmed')}<Text style={{ fontWeight: '700' }}>{n?.name || ''}</Text>{t(lang, 'spotConfirmed2')}
          </Text>
          <Text style={{ fontSize: 12, color: C.cream, opacity: 0.65 }}>Ref {ref}</Text>
        </View>

        <View style={{ backgroundColor: '#fff', borderRadius: 26, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, padding: 22, paddingBottom: 26 }}>
          <View style={{ gap: 12, marginBottom: 18 }}>
            {[['calendar', store.draft.dates || 'Upcoming'], ['users', `${PLAN_LABEL[store.draft.type || 'monthly']} · ${childNames}`]].map(([ic, v]) => (
              <View key={ic} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 11 }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={ic as any} size={18} color={C.dgreen} />
                </View>
                <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>{v}</Text>
              </View>
            ))}
          </View>

          {/* Contact unlocked */}
          <View style={{ backgroundColor: C.tint, borderRadius: 16, padding: 15, marginBottom: 18 }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Icon name="lock" size={14} color={C.dgreen} />
              <Text style={{ fontSize: 12, fontWeight: '700', color: C.dgreen, fontFamily: F.bodyBold }}>{t(lang, 'contactUnlocked')}</Text>
            </View>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 9 }}>
              <Button variant="secondary" icon="phone" style={{ flex: 1 }} onPress={() => {}}>{t(lang, 'call')}</Button>
              <Button icon="chat" style={{ flex: 1 }} onPress={() => navigation.navigate('tabs', { screen: 'messages' })}>{t(lang, 'message')}</Button>
            </View>
          </View>

          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 11 }}>
            <Button variant="outline" icon="calendar" onPress={() => navigation.navigate('tabs', { screen: 'bookings' })} style={{ flex: 1 }}>{t(lang, 'viewBooking')}</Button>
            <Button onPress={() => navigation.navigate('tabs', { screen: 'home' })} style={{ flex: 1 }}>{t(lang, 'done')}</Button>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
