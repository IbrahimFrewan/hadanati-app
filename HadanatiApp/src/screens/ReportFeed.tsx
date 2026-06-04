import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, NurseryImage, EmptyView } from '../components';
import { useApp } from '../context/AppContext';
import { getNursery } from '../data';
import { t } from '../i18n';

const MOCK_REPORTS = [
  { id: 'r1', childId: 'c1', nurseryId: 'n2', date: 'Today', title: 'Yara', mood: 'Happy', meals: 'Good appetite', sleep: '2h nap', imgSeed: 'report1' },
  { id: 'r2', childId: 'c1', nurseryId: 'n2', date: 'Yesterday', title: 'Yara', mood: 'Playful', meals: 'Ate well', sleep: '1.5h nap', imgSeed: 'report2' },
  { id: 'r3', childId: 'c1', nurseryId: 'n2', date: '2 days ago', title: 'Yara', mood: 'Calm', meals: 'Light lunch', sleep: '2h nap', imgSeed: 'report3' },
];

export function ReportFeedScreen({ navigation, route }: any) {
  const { store, lang } = useApp();
  const childId = route.params?.childId || store.children[0]?.id;
  const child = store.children.find(c => c.id === childId);
  const isRTL = lang === 'ar';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'dailyReports')} onBack={() => navigation.goBack()} />
      <FlatList
        data={MOCK_REPORTS}
        keyExtractor={r => r.id}
        contentContainerStyle={{ padding: 22, gap: 14, paddingBottom: 40 }}
        ListEmptyComponent={<EmptyView title={t(lang, 'noReportsTitle')} body={t(lang, 'noReportsBody')} />}
        renderItem={({ item: r }) => {
          const n = getNursery(r.nurseryId);
          return (
            <TouchableOpacity onPress={() => navigation.push('reportDetail', { id: r.id })} style={{ borderWidth: 1, borderColor: C.line, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff' }}>
              <View style={{ height: 120 }}>
                <NurseryImage src={`https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=640&q=70`} seed={r.imgSeed} radius={0} />
                <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: C.header, borderRadius: 8, paddingVertical: 3, paddingHorizontal: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{r.date}</Text>
                </View>
              </View>
              <View style={{ padding: 14 }}>
                <Text style={{ fontFamily: F.displayBold, fontSize: 17, fontWeight: '700', color: C.ink, marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
                  {r.title}{t(lang, 'reportTitle')}
                </Text>
                <Text style={{ fontSize: 12, color: C.mut, marginBottom: 10, textAlign: isRTL ? 'right' : 'left' }}>
                  {t(lang, 'reportSubtitle')}{n?.name || ''}
                </Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 14, flexWrap: 'wrap' }}>
                  {[['smile', r.mood], ['meal', r.meals], ['sleep', r.sleep]].map(([ic, val]) => (
                    <View key={ic} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 5 }}>
                      <Icon name={ic as any} size={15} color={C.dgreen} />
                      <Text style={{ fontSize: 12, color: C.mut }}>{val}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
