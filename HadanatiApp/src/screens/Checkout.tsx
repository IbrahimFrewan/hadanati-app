import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Stepper, NurseryImage } from '../components';
import { useApp } from '../context/AppContext';
import { NURSERIES, getNursery } from '../data';
import { t } from '../i18n';

export function CheckoutScreen({ navigation }: any) {
  const { store, lang, actions } = useApp();
  const n = getNursery(store.draft.nurseryId) || NURSERIES[0];
  const childIds: string[] = store.draft.childIds?.length ? store.draft.childIds : (store.draft.childId ? [store.draft.childId] : []);
  const childNames = childIds.map(id => store.children.find(c => c.id === id)?.name).filter(Boolean).join(' & ') || 'Child';
  const type = store.draft.type || 'monthly';
  const sub = store.draft.price || 160;
  const fee = Math.round(sub * 0.05);
  const total = sub + fee;
  const [pay, setPay] = useState('card');
  const [timer, setTimer] = useState(599);
  const [processing, setProcessing] = useState(false);
  const isRTL = lang === 'ar';

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const mm = Math.floor(timer / 60), ss = String(timer % 60).padStart(2, '0');
  const PAYS = [
    ['card', 'creditCard', t(lang, 'creditCard')],
    ['cliq', 'phone', t(lang, 'cliqTransfer')],
    ['wallet', 'wallet', t(lang, 'efawateercom')],
  ];

  const doPay = () => {
    setProcessing(true);
    setTimeout(() => { actions.confirmBooking(); navigation.replace('confirm', {}); }, 1300);
  };

  const Row = ({ label, value, bold }: { label: string; value: string; bold?: boolean }) => (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', paddingVertical: 7 }}>
      <Text style={{ fontFamily: bold ? F.displayBold : F.body, fontSize: bold ? 15 : 13.5, fontWeight: bold ? '800' : '500', color: bold ? C.ink : C.mut }}>{label}</Text>
      <Text style={{ fontFamily: bold ? F.displayBold : F.body, fontSize: bold ? 15 : 13.5, fontWeight: bold ? '800' : '500', color: bold ? C.dgreen : C.ink }}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'checkout')} subtitle={`${t(lang, 'step3')}${t(lang, 'stepOf')}`} onBack={() => navigation.goBack()} />
      <Stepper step={2} total={3} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 22 }}>
        {/* Timer */}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 7, backgroundColor: '#fbeede', borderRadius: 12, padding: 13, marginBottom: 18 }}>
          <Icon name="clock" size={16} color="#9a6310" />
          <Text style={{ fontSize: 12.5, fontWeight: '600', color: '#9a6310', flex: 1 }}>
            {t(lang, 'spotHeld')}<Text style={{ fontVariant: ['tabular-nums'] }}>{mm}:{ss}</Text>
          </Text>
        </View>

        {/* Summary */}
        <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 15, marginBottom: 18 }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 12, marginBottom: 13 }}>
            <View style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
              <NurseryImage src={n.img} seed={n.id} radius={12} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink, marginBottom: 3 }}>{n.name}</Text>
              <Text style={{ fontSize: 12, color: C.mut }}>{t(lang, type)} · {childNames}</Text>
            </View>
          </View>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, paddingTop: 11, borderTopWidth: 1, borderTopColor: C.line }}>
            <Icon name="calendar" size={15} color={C.mut} />
            <Text style={{ fontSize: 12.5, color: C.mut }}>{store.draft.dates || 'Upcoming'}</Text>
          </View>
        </View>

        {/* Payment methods */}
        <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink, marginBottom: 11 }}>{t(lang, 'paymentMethod')}</Text>
        <View style={{ gap: 9, marginBottom: 16 }}>
          {PAYS.map(([k, ic, l]) => { const on = pay === k; return (
            <TouchableOpacity key={k} onPress={() => setPay(k)} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: on ? C.green : C.line, backgroundColor: on ? C.tint : '#fff' }}>
              <Icon name={ic as any} size={20} color={C.dgreen} />
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold, textAlign: isRTL ? 'right' : 'left' }}>{l}</Text>
              <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: on ? 0 : 1.5, borderColor: C.line, backgroundColor: on ? C.green : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                {on && <Icon name="check" size={13} color="#fff" />}
              </View>
            </TouchableOpacity>
          ); })}
        </View>

        {/* Promo */}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 9, marginBottom: 18 }}>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 13, height: 46 }}>
            <Icon name="tag" size={17} color={C.mut} />
            <Text style={{ fontSize: 13, color: C.mut }}>{t(lang, 'promoCode')}</Text>
          </View>
          <Button variant="secondary" size="sm" onPress={() => {}}>{t(lang, 'apply')}</Button>
        </View>

        {/* Totals */}
        <View style={{ backgroundColor: C.cream, borderRadius: 16, paddingVertical: 8, paddingHorizontal: 15 }}>
          <Row label={t(lang, 'subtotal')} value={`${sub} JD`} />
          <Row label={t(lang, 'serviceFee')} value={`${fee} JD`} />
          <View style={{ borderTopWidth: 1, borderTopColor: C.line, marginTop: 4 }}>
            <Row label={t(lang, 'total')} value={`${total} JD`} bold />
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 7, marginTop: 14, alignItems: 'flex-start' }}>
          <Icon name="lock" size={15} color={C.mut} />
          <Text style={{ fontSize: 11, color: C.mut, lineHeight: 17, flex: 1 }}>{t(lang, 'pciNote')}</Text>
        </View>
      </ScrollView>

      <View style={{ padding: 22, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button full size="lg" disabled={processing || timer <= 0} onPress={doPay}>
          {processing ? t(lang, 'processing') : timer <= 0 ? t(lang, 'holdExpired') : `${t(lang, 'pay')}${total} JD`}
        </Button>
      </View>
    </SafeAreaView>
  );
}
