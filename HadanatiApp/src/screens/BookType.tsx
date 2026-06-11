import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Stepper, NurseryImage, AvatarImage } from '../components';
import { useApp } from '../context/AppContext';
import { NURSERIES, getNursery } from '../data';
import { t } from '../i18n';

const PLAN: Record<string, { price: number; unit: string; def: string }> = {
  hourly: { price: 6, unit: 'hr', def: 'Drop-in care, billed per hour (min 2 hrs).' },
  daily: { price: 14, unit: 'day', def: 'Full days, 7 AM – 5 PM, meals included.' },
  weekly: { price: 65, unit: 'wk', def: 'A recurring 5-day weekday pattern.' },
  monthly: { price: 160, unit: 'mo', def: 'A subscription that auto-renews each month.' },
};
const planPrice = (type: string, n: typeof NURSERIES[0]) =>
  type === 'monthly' && n ? n.priceFrom : PLAN[type].price;

export function BookTypeScreen({ navigation }: any) {
  const { store, lang, actions } = useApp();
  const n = getNursery(store.draft.nurseryId) || NURSERIES[0];
  const [type, setType] = useState<string>(store.draft.type || 'monthly');
  const [children, setChildren] = useState<string[]>(
    store.draft.childId ? [store.draft.childId] : store.children[0] ? [store.children[0].id] : []
  );
  const isRTL = lang === 'ar';

  const toggleChild = (id: string) => {
    setChildren(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const totalPrice = planPrice(type, n) * Math.max(children.length, 1);

  const cont = () => {
    actions.setDraft({ type, childId: children[0] || '', childIds: children, price: totalPrice, unit: PLAN[type].unit, nurseryId: n.id, nurseryName: n.name });
    navigation.push('schedule', {});
  };

  const TYPES = ['hourly', 'daily', 'weekly', 'monthly'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={n.name} subtitle={`${t(lang, 'step1')}${t(lang, 'stepOf')}`} onBack={() => navigation.goBack()} />
      <Stepper step={0} total={3} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 22 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 23, fontWeight: '700', color: C.ink, marginBottom: 16, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'howOften')}</Text>

        <View style={{ gap: 11, marginBottom: 26 }}>
          {TYPES.map(k => {
            const on = type === k;
            const p = PLAN[k];
            return (
              <TouchableOpacity
                key={k} onPress={() => setType(k)}
                style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 13, padding: 15, borderRadius: 16, borderWidth: 1.5, borderColor: on ? C.green : C.line, backgroundColor: on ? C.tint : '#fff' }}
              >
                <View style={{ width: 22, height: 22, borderRadius: 11, flexShrink: 0, borderWidth: on ? 0 : 1.5, borderColor: C.line, backgroundColor: on ? C.green : '#fff', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <Icon name="check" size={15} color="#fff" />}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, fontFamily: F.bodyBold }}>{t(lang, k)}</Text>
                    <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 15, color: C.dgreen }}>{planPrice(k, n)} JD<Text style={{ fontSize: 11, color: C.mut, fontWeight: '600' }}>/{p.unit}</Text></Text>
                  </View>
                  <Text style={{ fontSize: 11.5, color: C.mut, marginTop: 3, lineHeight: 17, textAlign: isRTL ? 'right' : 'left' }}>{p.def}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={{ fontFamily: F.displayBold, fontSize: 17, fontWeight: '700', color: C.ink, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'forWhichChild')}</Text>
        <Text style={{ fontSize: 12, color: C.mut, marginBottom: 10, textAlign: isRTL ? 'right' : 'left' }}>Select one or more children</Text>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: 10 }}>
          {store.children.map(ch => {
            const on = children.includes(ch.id);
            return (
              <TouchableOpacity key={ch.id} onPress={() => toggleChild(ch.id)} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 9, paddingRight: isRTL ? 8 : 14, paddingLeft: isRTL ? 14 : 8, paddingVertical: 8, borderRadius: 999, borderWidth: 1.5, borderColor: on ? C.green : C.line, backgroundColor: on ? C.tint : '#fff' }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: C.line }}>
                  <AvatarImage seed={ch.id} size={32} uri={ch.photoUri || undefined} />
                </View>
                <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink, fontFamily: F.bodyBold }}>{ch.name}</Text>
                {on && <Icon name="check" size={15} color={C.dgreen} />}
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity onPress={() => navigation.push('children', {})} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 7, paddingHorizontal: 15, paddingVertical: 8, borderRadius: 999, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.line, backgroundColor: '#fff' }}>
            <Icon name="plus" size={16} color={C.dgreen} />
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.dgreen, fontFamily: F.bodyBold }}>{t(lang, 'addChild')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={{ padding: 22, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line }}>
        {children.length > 1 && (
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 13, color: C.mut }}>{children.length} {t(lang, 'children')} × {planPrice(type, n)} JD/{PLAN[type].unit}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.dgreen, fontFamily: F.displayBold }}>{totalPrice} JD/{PLAN[type].unit}</Text>
          </View>
        )}
        <Button full size="lg" disabled={children.length === 0} iconRight="arrowRight" onPress={cont}>{t(lang, 'continue')}</Button>
      </View>
    </SafeAreaView>
  );
}
