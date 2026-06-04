import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Stepper, Toggle } from '../components';
import { useApp } from '../context/AppContext';
import { NURSERIES, getNursery } from '../data';
import { t } from '../i18n';

const PLAN: Record<string, { label: string; price: number; unit: string }> = {
  hourly: { label: 'Hourly', price: 6, unit: 'hr' },
  daily: { label: 'Daily', price: 14, unit: 'day' },
  weekly: { label: 'Weekly', price: 65, unit: 'wk' },
  monthly: { label: 'Monthly', price: 160, unit: 'mo' },
};

export function ScheduleScreen({ navigation }: any) {
  const { store, lang, actions } = useApp();
  const n = getNursery(store.draft.nurseryId) || NURSERIES[0];
  const type = store.draft.type || 'monthly';
  const unitPrice = store.draft.price || PLAN[type].price;
  const [dates, setDates] = useState<number[]>([]);
  const [slots, setSlots] = useState<string[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [autorenew, setAutorenew] = useState(true);
  const isRTL = lang === 'ar';

  const TIMES = ['8:00', '9:00', '10:00', '11:00', '13:00', '14:00'];
  const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu'];
  const tog = <T,>(v: T, arr: T[], set: (a: T[]) => void) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  let qty = 1, summary = '';
  if (type === 'hourly') { qty = slots.length; summary = `${qty} hour${qty !== 1 ? 's' : ''}`; }
  else if (type === 'daily') { qty = dates.length; summary = `${qty} day${qty !== 1 ? 's' : ''}`; }
  else if (type === 'weekly') { qty = 1; summary = `${days.length} weekday pattern`; }
  else { qty = 1; summary = autorenew ? t(lang, 'autoRenew') : 'One month'; }

  const total = unitPrice * (type === 'hourly' || type === 'daily' ? Math.max(qty, 0) : 1);
  const ready = (type === 'hourly' && slots.length > 0) || (type === 'daily' && dates.length > 0) || (type === 'weekly' && days.length > 0) || type === 'monthly';

  const cont = () => {
    const datesStr = type === 'monthly' ? 'Starts 1 Jul 2026' : type === 'weekly' ? days.join(', ') : type === 'hourly' ? `9 Jun · ${slots.join(', ')}` : dates.map(d => d + ' Jun').join(', ');
    actions.setDraft({ dates: datesStr, price: total, qty });
    navigation.push('checkout', {});
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'chooseSchedule')} subtitle={`${t(lang, 'step2')}${t(lang, 'stepOf')}`} onBack={() => navigation.goBack()} />
      <Stepper step={1} total={3} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 22 }}>
        {/* Plan badge */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: C.cream, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 13, marginBottom: 18, alignSelf: 'flex-start' }}>
          <Icon name="checkCircle" size={15} color={C.dgreen} />
          <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.dgreen, fontFamily: F.bodyBold }}>{t(lang, type)}{t(lang, 'plan')}</Text>
        </View>

        {/* Hourly time slots */}
        {type === 'hourly' && (
          <>
            <Text style={{ fontFamily: F.displayBold, fontSize: 17, color: C.ink, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'pickTimeSlots')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
              {TIMES.map((ti, i) => { const on = slots.includes(ti); const full = i === 3;
                return <TouchableOpacity key={ti} disabled={full} onPress={() => tog(ti, slots, setSlots)} style={{ flex: 1, minWidth: '30%', paddingVertical: 13, borderRadius: 12, borderWidth: 1.5, borderColor: on ? C.green : C.line, backgroundColor: full ? C.cream : on ? C.tint : '#fff', alignItems: 'center' }}>
                  <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 13.5, color: full ? '#c2c7bd' : on ? C.dgreen : C.ink, textDecorationLine: full ? 'line-through' : 'none' }}>{ti}</Text>
                </TouchableOpacity>;
              })}
            </View>
          </>
        )}

        {/* Daily calendar */}
        {type === 'daily' && (
          <>
            <Text style={{ fontFamily: F.displayBold, fontSize: 17, color: C.ink, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'selectDates')}</Text>
            <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <TouchableOpacity style={{ padding: 4 }}><Icon name="chevLeft" size={18} color={C.mut} /></TouchableOpacity>
                <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 15, color: C.ink }}>June 2026</Text>
                <TouchableOpacity style={{ padding: 4 }}><Icon name="chevRight" size={18} color={C.mut} /></TouchableOpacity>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {['S','M','T','W','T','F','S'].map((d, i) => <Text key={i} style={{ width: `${100/7}%`, textAlign: 'center', fontSize: 10.5, color: C.mut, fontWeight: '600', paddingVertical: 2 }}>{d}</Text>)}
                <View style={{ width: `${100/7}%` }} />
                {Array.from({ length: 30 }).map((_, i) => {
                  const d = i + 1; const on = dates.includes(d); const past = d < 6;
                  return <TouchableOpacity key={d} disabled={past} onPress={() => tog(d, dates, setDates)} style={{ width: `${100/7}%`, aspectRatio: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? C.header : 'transparent' }}>
                    <Text style={{ fontFamily: on ? F.bodyBold : F.body, fontSize: 13, fontWeight: on ? '700' : '500', color: past ? '#cfd4cb' : on ? '#fff' : C.ink }}>{d}</Text>
                  </TouchableOpacity>;
                })}
              </View>
            </View>
          </>
        )}

        {/* Weekly pattern */}
        {type === 'weekly' && (
          <>
            <Text style={{ fontFamily: F.displayBold, fontSize: 17, color: C.ink, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'weekdayPattern')}</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              {WD.map(d => { const on = days.includes(d);
                return <TouchableOpacity key={d} onPress={() => tog(d, days, setDays)} style={{ flex: 1, minWidth: 56, paddingVertical: 13, borderRadius: 12, borderWidth: 1.5, borderColor: on ? C.green : C.line, backgroundColor: on ? C.tint : '#fff', alignItems: 'center' }}>
                  <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 13, color: on ? C.dgreen : C.ink }}>{d}</Text>
                </TouchableOpacity>;
              })}
            </View>
          </>
        )}

        {/* Monthly */}
        {type === 'monthly' && (
          <>
            <Text style={{ fontFamily: F.displayBold, fontSize: 17, color: C.ink, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'startDate')}</Text>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 11, padding: 14, borderWidth: 1, borderColor: C.line, borderRadius: 14, marginBottom: 14 }}>
              <Icon name="calendar" size={20} color={C.dgreen} />
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>1 July 2026</Text>
              <Icon name="chevDown" size={18} color={C.mut} />
            </View>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: C.cream, borderRadius: 14 }}>
              <Icon name="refresh" size={19} color={C.dgreen} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink, fontFamily: F.bodyBold }}>{t(lang, 'autoRenew')}</Text>
                <Text style={{ fontSize: 11.5, color: C.mut }}>{t(lang, 'autoRenewSub')}</Text>
              </View>
              <Toggle on={autorenew} onChange={setAutorenew} />
            </View>
          </>
        )}
      </ScrollView>

      <View style={{ padding: 22, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line }}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <View>
            <Text style={{ fontSize: 11.5, color: C.mut }}>{ready ? summary : t(lang, 'selectSchedule')}</Text>
            <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 21, color: C.ink }}>{total} JD<Text style={{ fontSize: 12, color: C.mut, fontWeight: '600' }}>{type === 'monthly' ? '/mo' : type === 'weekly' ? '/wk' : ''}</Text></Text>
          </View>
        </View>
        <Button full size="lg" disabled={!ready} iconRight="arrowRight" onPress={cont}>{t(lang, 'continueToPayment')}</Button>
      </View>
    </SafeAreaView>
  );
}
