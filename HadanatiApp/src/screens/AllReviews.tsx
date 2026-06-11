import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, Rating, NurseryImage } from '../components';
import { useApp } from '../context/AppContext';
import { getNursery } from '../data';
import { t } from '../i18n';

const MOCK_REVIEWS = [
  { name: 'Rana K.', rating: 5, date: 'May 2026', text: 'The daily photo reports made my first month back at work so much easier. Staff are warm and professional.' },
  { name: 'Omar S.', rating: 5, date: 'Apr 2026', text: 'Clean, safe and genuinely caring. Yara settled in within a week.' },
  { name: 'Nadia F.', rating: 4, date: 'Mar 2026', text: 'Great bilingual programme and lovely outdoor space. Pickup is always smooth.' },
  { name: 'Tariq M.', rating: 5, date: 'Feb 2026', text: 'Our son has flourished since joining. Teachers send thoughtful updates every day.' },
  { name: 'Lina H.', rating: 4, date: 'Jan 2026', text: 'Good facilities and attentive staff. Would love slightly more flexibility with hours.' },
  { name: 'Basil A.', rating: 5, date: 'Dec 2025', text: 'Immaculate nursery, very experienced team. Highly recommend to any parent in the area.' },
  { name: 'Reem J.', rating: 5, date: 'Nov 2025', text: 'My daughter asks to go every morning. That says it all!' },
  { name: 'Khalid N.', rating: 4, date: 'Oct 2025', text: 'Excellent Montessori approach, well-structured days and a supportive team.' },
];

export function AllReviewsScreen({ navigation, route }: any) {
  const { lang } = useApp();
  const isRTL = lang === 'ar';
  const nurseryId = route.params?.nurseryId;
  const n = getNursery(nurseryId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'reviews')} onBack={() => navigation.goBack()} />
      {n && (
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, paddingHorizontal: 22, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line }}>
          <View style={{ width: 44, height: 44, borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
            <NurseryImage src={n.img} seed={n.id} radius={10} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: F.displayBold, fontSize: 15, fontWeight: '700', color: C.ink, textAlign: isRTL ? 'right' : 'left' }}>{n.name}</Text>
            <Rating value={n.rating} count={n.reviews} size={12} />
          </View>
        </View>
      )}
      <FlatList
        data={MOCK_REVIEWS}
        keyExtractor={(_, i) => String(i)}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 40, paddingTop: 4 }}
        renderItem={({ item: r }) => (
          <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: C.line }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 14, color: C.dgreen }}>{r.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold, textAlign: isRTL ? 'right' : 'left' }}>{r.name}</Text>
                <Text style={{ fontSize: 11, color: C.mut }}>{r.date} · <Text style={{ color: C.green, fontWeight: '600' }}>{t(lang, 'verifiedBooking')}</Text></Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 1 }}>
                {Array.from({ length: r.rating }).map((_, k) => (
                  <Icon key={k} name="star" size={13} color={C.amber} fill={C.amber} />
                ))}
              </View>
            </View>
            <Text style={{ fontSize: 13.5, color: C.mut, lineHeight: 21, textAlign: isRTL ? 'right' : 'left' }}>{r.text}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
