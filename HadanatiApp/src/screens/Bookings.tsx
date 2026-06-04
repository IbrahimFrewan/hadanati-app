import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, StatusPill, NurseryImage, EmptyView } from '../components';
import { useApp } from '../context/AppContext';
import { getNursery } from '../data';
import { t } from '../i18n';

const TABS: Record<string, string[]> = {
  upcoming: ['confirmed', 'pending', 'requested'],
  active: ['active'],
  past: ['completed', 'cancelled'],
};
const PLAN_LABEL: Record<string, string> = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

export function BookingsScreen({ navigation }: any) {
  const { store, setStore, lang } = useApp();
  const [tab, setTab] = useState('active');
  const [cancelTarget, setCancelTarget] = useState<any>(null);
  const isRTL = lang === 'ar';

  const child = (id: string) => store.children.find(c => c.id === id);
  const list = store.bookings.filter(b => TABS[tab].includes(b.status));

  const doCancel = () => {
    setStore(s => ({ ...s, bookings: s.bookings.map(b => b.id === cancelTarget.id ? { ...b, status: 'cancelled' } : b) }));
    setCancelTarget(null);
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
          const n = getNursery(b.nurseryId); const ch = child(b.childId); if (!n) return null;
          return (
            <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff', flexShrink: 0 }}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 13, padding: 13 }}>
                <View style={{ width: 62, height: 62, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                  <NurseryImage src={n.img} seed={n.id} radius={12} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', gap: 8 }}>
                    <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink, flex: 1 }} numberOfLines={1}>{n.name}</Text>
                    <StatusPill status={b.status} label={STATUS_LABELS[b.status]} />
                  </View>
                  <Text style={{ fontSize: 12, color: C.mut, marginBottom: 5 }}>{PLAN_LABEL[b.type]} · {ch?.name || ''}</Text>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 5 }}>
                    <Icon name="calendar" size={13} color={C.dgreen} />
                    <Text style={{ fontSize: 12, color: C.ink, fontWeight: '600', fontFamily: F.bodyBold }}>{b.dates}</Text>
                  </View>
                </View>
              </View>
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

      {/* Cancel sheet */}
      <Modal visible={!!cancelTarget} transparent animationType="slide" onRequestClose={() => setCancelTarget(null)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#1c281e66' }} onPress={() => setCancelTarget(null)} activeOpacity={1}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', borderRadius: 26, padding: 20, paddingTop: 14 }}>
            <View style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#e7e2d6', alignSelf: 'center', marginBottom: 14 }} />
            <Text style={{ fontFamily: F.displayBold, fontSize: 20, fontWeight: '700', color: C.ink, marginBottom: 16 }}>{t(lang, 'cancelBooking')}</Text>
            {cancelTarget && (
              <>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, backgroundColor: '#e4f1e6', borderRadius: 12, padding: 13, marginBottom: 16 }}>
                  <Icon name="checkCircle" size={20} color="#2f7a44" />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#2f7a44', fontFamily: F.bodyBold }}>{t(lang, 'fullRefund')}{cancelTarget.price} JD</Text>
                    <Text style={{ fontSize: 11.5, color: '#3d7a4f' }}>{t(lang, 'cancelEarly')}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: C.mut, lineHeight: 20, marginBottom: 18 }}>
                  {t(lang, 'cancelInfo')}{cancelTarget.n.name}{t(lang, 'cancelInfo2')}
                </Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 11 }}>
                  <Button variant="secondary" onPress={() => setCancelTarget(null)} style={{ flex: 1 }}>{t(lang, 'keepBooking')}</Button>
                  <Button variant="danger" onPress={doCancel} style={{ flex: 1 }}>{t(lang, 'cancelRefund')}</Button>
                </View>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
