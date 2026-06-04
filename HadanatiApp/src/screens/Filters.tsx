import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { TopBar, Pill, Button } from '../components';
import { useApp } from '../context/AppContext';
import { NURSERIES } from '../data';
import { t } from '../i18n';

export function FiltersScreen({ navigation, route }: any) {
  const { lang } = useApp();
  const [ages, setAges] = useState<string[]>(route.params?.ages || []);
  const [type, setType] = useState('monthly');
  const [price, setPrice] = useState(300);
  const [services, setServices] = useState<string[]>([]);
  const [hours, setHours] = useState('any');
  const [rating, setRating] = useState(0);

  const tog = (v: string, arr: string[], set: (a: string[]) => void) =>
    set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  const SERVICES = ['Meals', 'Transport', 'Special needs', 'Bilingual', 'CCTV', 'Outdoor'];
  const count = NURSERIES.filter(n =>
    (ages.length ? n.ages.some(a => ages.includes(a)) : true) &&
    n.priceFrom <= price && n.rating >= rating
  ).length;

  const AGE_KEYS = ['infant', 'toddler', 'preschool'];
  const TYPES = ['hourly', 'daily', 'weekly', 'monthly'];
  const HOURS = [['any', 'any'], ['full', 'fullDay'], ['half', 'halfDay']];
  const RATINGS = [[0, 'any'], [4, '4.0+'], [4.5, '4.5+']];

  const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink, marginBottom: 12 }}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar
        title={t(lang, 'filters')}
        onBack={() => navigation.goBack()}
        right={
          <Text onPress={() => { setAges([]); setServices([]); setPrice(300); setRating(0); setHours('any'); }}
            style={{ fontFamily: F.bodyBold, color: C.dgreen, fontWeight: '700', fontSize: 13 }}>
            {t(lang, 'reset')}
          </Text>
        }
      />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 22 }}>
        <Group title={t(lang, 'ageGroup')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {AGE_KEYS.map(a => <Pill key={a} active={ages.includes(a)} onPress={() => tog(a, ages, setAges)}>{t(lang, a)}</Pill>)}
          </View>
        </Group>

        <Group title={t(lang, 'bookingType')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {TYPES.map(tp => <Pill key={tp} active={type === tp} onPress={() => setType(tp)}>{t(lang, tp)}</Pill>)}
          </View>
        </Group>

        <Group title={`${t(lang, 'priceUpTo')}${price} JD/${type === 'hourly' ? 'hr' : 'mo'}`}>
          <View style={{ height: 40, backgroundColor: C.cream, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 13, color: C.mut }}>Price slider: {price} JD</Text>
          </View>
        </Group>

        <Group title={t(lang, 'services')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {SERVICES.map(s => <Pill key={s} active={services.includes(s)} onPress={() => tog(s, services, setServices)}>{s}</Pill>)}
          </View>
        </Group>

        <Group title={t(lang, 'operatingHours')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {HOURS.map(([k, lk]) => <Pill key={k} active={hours === k} onPress={() => setHours(k as string)}>{t(lang, lk as string)}</Pill>)}
          </View>
        </Group>

        <Group title={t(lang, 'minimumRating')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {RATINGS.map(([k, v]) => <Pill key={String(v)} active={rating === k} onPress={() => setRating(k as number)} icon={k ? 'star' : undefined}>{String(v)}</Pill>)}
          </View>
        </Group>
      </ScrollView>

      <View style={{ padding: 22, paddingTop: 12, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button full size="lg" disabled={count === 0} onPress={() => navigation.replace('results', { ages })}>
          {count === 0 ? t(lang, 'noMatchesFilter') : `${t(lang, 'showResults')}${count} ${count === 1 ? t(lang, 'result') : t(lang, 'results')}`}
        </Button>
      </View>
    </SafeAreaView>
  );
}
