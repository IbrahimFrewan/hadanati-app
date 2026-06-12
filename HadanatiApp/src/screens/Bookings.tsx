import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, FlatList, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, StatusPill, NurseryImage, EmptyView } from '../components';
import { useApp } from '../context/AppContext';
import { getNursery } from '../data';
import QRCode from 'react-native-qrcode-svg';
import { t } from '../i18n';

const TABS: Record<string, string[]> = {
  upcoming: ['confirmed', 'pending', 'requested'],
  active: ['active'],
  past: ['completed', 'cancelled'],
};
const PLAN_LABEL: Record<string, string> = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

export function BookingsScreen({ navigation }: any) {
  const { store, setStore, lang, actions } = useApp();
  const [tab, setTab] = useState('active');
  const [cancelTarget, setCancelTarget] = useState<any>(null);
  const [qrModal, setQrModal] = useState<string | null>(null);
  const isRTL = lang === 'ar';
  const insets = useSafeAreaInsets();

  const child = (id: string) => store.children.find(c => c.id === id);
  const childNames = (b: any) => {
    const ids: string[] = b.childIds?.length ? b.childIds : (b.childId ? [b.childId] : []);
    return ids.map((id: string) => child(id)?.name).filter(Boolean).join(', ');
  };
  const list = store.bookings.filter(b => TABS[tab].includes(b.status));

  const doCancel = () => {
    // Updates local state AND calls the cancel-booking Edge Function (refund)
    // when the backend is configured.
    actions.cancelBooking(cancelTarget.id);
    setCancelTarget(null);
  };

  const showPickupCode = async (bookingId: string) => {
    try {
      setQrModal(await actions.issuePickupCode(bookingId));
    } catch (e: any) {
      Alert.alert('', e?.message ?? 'Could not get a pickup code.');
    }
  };

  const STATUS_LABELS: Record<string, string> = {
    confirmed: t(lang, 'confirmedStatus'), active: t(lang, 'activeStatus'),
    pending: t(lang, 'pendingStatus'), completed: t(lang, 'completedStatus'),
    cancelled: t(lang, 'cancelledStatus'), requested: t(lang, 'requestedStatus'),
  };

  const TAB_KEYS = ['upcoming', 'active', 'past'];
  const TAB_LABELS: Record<string, string> = { upcoming: t(lang, 'upcoming'), active: t(lang, 'active'), past: t(lang, 'past') };
  const EMPTY_TITLES: Record<string, string> = { upcoming: t(lang, 'noUpcomingBookings'), active: t(lang, 'noActiveBookings'), past: t(lang, 'noPastBookings') };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <View style={{ paddingHorizontal: 22, paddingTop: 6, paddingBottom: 14 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'myBookings')}</Text>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 22, marginBottom: 14 }}>
        {TAB_KEYS.map(tk => {
          const on = tab === tk;
          const cnt = store.bookings.filter(b => TABS[tk].includes(b.status)).length;
          return (
            <TouchableOpacity key={tk} onPress={() => setTab(tk)} style={{ flex: 1, borderRadius: 11, paddingVertical: 9, backgroundColor: on ? C.header : C.cream, alignItems: 'center' }}>
              <Text style={{ fontFamily: F.bodyBold, fontSize: 13, fontWeight: '700', color: on ? '#fff' : C.mut, textTransform: 'capitalize' }}>
                {TAB_LABELS[tk]}{cnt > 0 ? ` · ${cnt}` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={list}
        keyExtractor={b => b.id}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 96, gap: 13, paddingTop: 4 }}
        ListEmptyComponent={
          <EmptyView
            title={EMPTY_TITLES[tab]}
            body={tab === 'upcoming' ? t(lang, 'findNursery') : t(lang, 'nothingHere')}
            ctaLabel={tab === 'upcoming' ? t(lang, 'findNursery') : undefined}
            onCta={() => navigation.navigate('home')}
          />
        }
        renderItem={({ item: b }) => {
          const n = getNursery(b.nurseryId); if (!n) return null;
          return (
            <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff', flexShrink: 0 }}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 13, padding: 13 }}>
                <View style={{ width: 62, height: 62, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                  <NurseryImage src={n.img} seed={n.id} radius={12} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', gap: 8 }}>
                    <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink, flex: 1, textAlign: isRTL ? 'right' : 'left' }} numberOfLines={1}>{n.name}</Text>
                    <StatusPill status={b.status} label={STATUS_LABELS[b.status]} />
                  </View>
                  <Text style={{ fontSize: 12, color: C.mut, marginBottom: 5, textAlign: isRTL ? 'right' : 'left' }}>{PLAN_LABEL[b.type]} · {childNames(b)}</Text>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 5 }}>
                    <Icon name="calendar" size={13} color={C.dgreen} />
                    <Text style={{ fontSize: 12, color: C.ink, fontWeight: '600', fontFamily: F.bodyBold }}>{b.dates}</Text>
                  </View>
                </View>
              </View>
              {(b.status === 'confirmed' || b.status === 'active') && (
                <TouchableOpacity onPress={() => showPickupCode(b.id)} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 11, backgroundColor: C.tint, borderTopWidth: 1, borderTopColor: C.line }}>
                  <Icon name="qr" size={17} color={C.dgreen} />
                  <Text style={{ fontFamily: F.bodyBold, fontSize: 13, fontWeight: '700', color: C.dgreen }}>{t(lang, 'pickupCode')}</Text>
                </TouchableOpacity>
              )}
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', borderTopWidth: 1, borderTopColor: C.line }}>
                <TouchableOpacity onPress={() => navigation.push('nursery', { id: n.id })} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 }}>
                  <Icon name="eye" size={16} color={C.dgreen} /><Text style={{ fontFamily: F.bodyBold, fontSize: 12.5, fontWeight: '600', color: C.dgreen }}>{t(lang, 'view')}</Text>
                </TouchableOpacity>
                {b.status !== 'cancelled' && b.status !== 'completed' && (
                  <>
                    <View style={{ width: 1, backgroundColor: C.line }} />
                    <TouchableOpacity onPress={() => navigation.navigate('messages')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 }}>
                      <Icon name="chat" size={16} color={C.dgreen} /><Text style={{ fontFamily: F.bodyBold, fontSize: 12.5, fontWeight: '600', color: C.dgreen }}>{t(lang, 'message')}</Text>
                    </TouchableOpacity>
                  </>
                )}
                {(b.status === 'confirmed' || b.status === 'pending' || b.status === 'active') && (
                  <>
                    <View style={{ width: 1, backgroundColor: C.line }} />
                    <TouchableOpacity onPress={() => setCancelTarget({ id: b.id, price: b.price, n })} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 }}>
                      <Icon name="x" size={16} color={C.danger} /><Text style={{ fontFamily: F.bodyBold, fontSize: 12.5, fontWeight: '600', color: C.danger }}>{t(lang, 'cancel')}</Text>
                    </TouchableOpacity>
                  </>
                )}
                {b.status === 'completed' && (
                  <>
                    <View style={{ width: 1, backgroundColor: C.line }} />
                    <TouchableOpacity onPress={() => navigation.push('nursery', { id: n.id })} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 }}>
                      <Icon name="refresh" size={16} color={C.dgreen} /><Text style={{ fontFamily: F.bodyBold, fontSize: 12.5, fontWeight: '600', color: C.dgreen }}>{t(lang, 'rebook')}</Text>
                    </TouchableOpacity>
                    <View style={{ width: 1, backgroundColor: C.line }} />
                    <TouchableOpacity onPress={() => navigation.push('review', { nurseryId: n.id })} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 }}>
                      <Icon name="star" size={16} color={C.dgreen} /><Text style={{ fontFamily: F.bodyBold, fontSize: 12.5, fontWeight: '600', color: C.dgreen }}>{t(lang, 'review')}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          );
        }}
      />

      {cancelTarget && (
        <TouchableOpacity
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#1c281e66', zIndex: 10 }}
          onPress={() => setCancelTarget(null)}
          activeOpacity={1}
        >
          <View style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', borderRadius: 26, padding: 20, paddingTop: 14, paddingBottom: Math.max(insets.bottom, 20) }} onPress={e => e.stopPropagation()}>
            <View style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#e7e2d6', alignSelf: 'center', marginBottom: 14 }} />
            <Text style={{ fontFamily: F.displayBold, fontSize: 20, fontWeight: '700', color: C.ink, marginBottom: 16, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'cancelBooking')}</Text>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, backgroundColor: '#e4f1e6', borderRadius: 12, padding: 13, marginBottom: 16 }}>
              <Icon name="checkCircle" size={20} color="#2f7a44" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#2f7a44', fontFamily: F.bodyBold, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'fullRefund')}{cancelTarget.price} JD</Text>
                <Text style={{ fontSize: 11.5, color: '#3d7a4f', textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'cancelEarly')}</Text>
              </View>
            </View>
            <Text style={{ fontSize: 13, color: C.mut, lineHeight: 20, marginBottom: 18, textAlign: isRTL ? 'right' : 'left' }}>
              {t(lang, 'cancelInfo')}{cancelTarget.n.name}{t(lang, 'cancelInfo2')}
            </Text>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 11 }}>
              <Button variant="secondary" onPress={() => setCancelTarget(null)} style={{ flex: 1 }}>{t(lang, 'keepBooking')}</Button>
              <Button variant="danger" onPress={doCancel} style={{ flex: 1 }}>{t(lang, 'cancelRefund')}</Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Pickup QR — the nursery scans this at drop-off/pickup */}
      {qrModal && (
        <TouchableOpacity activeOpacity={1} onPress={() => setQrModal(null)} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#1c281ecc', zIndex: 10, alignItems: 'center', justifyContent: 'center', padding: 30 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 26, padding: 26, alignItems: 'center', alignSelf: 'stretch' }}>
            <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 6, textAlign: 'center' }}>{t(lang, 'pickupCodeTitle')}</Text>
            <Text style={{ fontFamily: F.body, fontSize: 12.5, color: C.mut, textAlign: 'center', lineHeight: 19, marginBottom: 18 }}>{t(lang, 'pickupCodeBody')}</Text>
            <View style={{ padding: 14, borderRadius: 16, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff' }}>
              <QRCode value={qrModal} size={188} color={C.ink} backgroundColor="#ffffff" />
            </View>
            <Text style={{ fontFamily: F.displayBold, fontSize: 24, letterSpacing: 6, color: C.dgreen, marginTop: 16 }}>{qrModal}</Text>
            <Button full onPress={() => setQrModal(null)} style={{ marginTop: 18 }}>{lang === 'ar' ? 'تم' : 'Done'}</Button>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}
