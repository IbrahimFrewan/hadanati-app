import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, NurseryImage, EmptyView } from '../components';
import { useApp } from '../context/AppContext';
import { getNursery } from '../data';
import { t } from '../i18n';

const MOODS: Record<string, { label: string; labelAr: string; c: string; bg: string }> = {
  happy:   { label: 'Happy',   labelAr: 'سعيد',   c: '#2f7a44', bg: '#e4f1e6' },
  calm:    { label: 'Calm',    labelAr: 'هادئ',   c: '#2f6ab0', bg: '#e3eefb' },
  playful: { label: 'Playful', labelAr: 'مرح',    c: '#b06d22', bg: '#fbeede' },
};

const MOCK_REPORTS = [
  { id: 'r1', childId: 'c1', nurseryId: 'n2', date: 'Today · 2 Jun',       mood: 'happy',   sleep: '1h 25m', mealsCount: 3, media: 5, unread: true  },
  { id: 'r2', childId: 'c1', nurseryId: 'n2', date: 'Yesterday · 1 Jun',   mood: 'playful', sleep: '1h 10m', mealsCount: 3, media: 3, unread: false },
  { id: 'r3', childId: 'c1', nurseryId: 'n2', date: 'Fri · 30 May',        mood: 'calm',    sleep: '1h 40m', mealsCount: 3, media: 4, unread: false },
];

export function ReportFeedScreen({ navigation, route }: any) {
  const { store, lang } = useApp();
  const isRTL = lang === 'ar';
  const [childId, setChildId] = useState<string>(route.params?.childId || store.children[0]?.id || 'c1');
  const reports = MOCK_REPORTS.filter(r => r.childId === childId);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'dailyReports')} onBack={() => navigation.goBack()} />

      {/* Child switcher */}
      {store.children.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 12, gap: 9, flexDirection: isRTL ? 'row-reverse' : 'row' }}
        >
          {store.children.map(ch => {
            const on = ch.id === childId;
            return (
              <TouchableOpacity
                key={ch.id}
                onPress={() => setChildId(ch.id)}
                style={{
                  flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8,
                  paddingVertical: 6, paddingLeft: 6, paddingRight: 14,
                  borderRadius: 999, borderWidth: 1.5,
                  borderColor: on ? C.green : C.line,
                  backgroundColor: on ? C.tint : '#fff',
                }}
              >
                <View style={{ width: 28, height: 28, borderRadius: 999, backgroundColor: C.cream, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="user" size={16} color={C.mut} />
                </View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, fontFamily: F.bodyBold }}>{ch.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <FlatList
        data={reports}
        keyExtractor={r => r.id}
        contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 4, paddingBottom: 40, gap: 14 }}
        ListEmptyComponent={<EmptyView title={t(lang, 'noReportsTitle')} body={t(lang, 'noReportsBody')} />}
        renderItem={({ item: r }) => {
          const n = getNursery(r.nurseryId);
          const m = MOODS[r.mood] || MOODS.happy;
          const moodLabel = lang === 'ar' ? m.labelAr : m.label;
          return (
            <TouchableOpacity
              onPress={() => navigation.push('reportDetail', { id: r.id })}
              style={{ borderWidth: 1, borderColor: C.line, borderRadius: 18, overflow: 'hidden', backgroundColor: '#fff', position: 'relative' }}
            >
              {/* Unread dot */}
              {r.unread && (
                <View style={{ position: 'absolute', top: 14, [isRTL ? 'left' : 'right']: 14, width: 9, height: 9, borderRadius: 999, backgroundColor: C.danger, zIndex: 2 }} />
              )}

              <View style={{ padding: 14, paddingBottom: 11 }}>
                {/* Header row: date+nursery on left, mood badge on right */}
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink, marginBottom: 1, textAlign: isRTL ? 'right' : 'left' }}>{r.date}</Text>
                    <Text style={{ fontSize: 11.5, color: C.mut, textAlign: isRTL ? 'right' : 'left' }}>{n?.name || ''}</Text>
                  </View>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 5, backgroundColor: m.bg, paddingVertical: 5, paddingHorizontal: 11, borderRadius: 999, marginLeft: r.unread ? 18 : 0 }}>
                    <Icon name="smile" size={14} color={m.c} />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: m.c, fontFamily: F.bodyBold }}>{moodLabel}</Text>
                  </View>
                </View>

                {/* Stats row */}
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 16 }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                    <Icon name="meal" size={16} color={C.dgreen} />
                    <Text style={{ fontSize: 12.5, color: C.ink, fontWeight: '600' }}>{r.mealsCount} meals</Text>
                  </View>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 6 }}>
                    <Icon name="sleep" size={16} color={C.dgreen} />
                    <Text style={{ fontSize: 12.5, color: C.ink, fontWeight: '600' }}>{r.sleep} nap</Text>
                  </View>
                </View>
              </View>

              {/* Photo strip */}
              <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 4, paddingBottom: 4 }}>
                {[0, 1, 2].map(i => (
                  <View key={i} style={{ flex: 1, height: 88, borderRadius: i === 0 ? 10 : i === 2 ? 10 : 0, overflow: 'hidden', position: 'relative' }}>
                    <NurseryImage seed={r.id + '-' + i} radius={0} />
                    {i === 2 && r.media > 3 && (
                      <View style={{ position: 'absolute', inset: 0, backgroundColor: '#1c3324aa', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontFamily: F.displayBold, fontWeight: '700', fontSize: 15 }}>+{r.media - 2}</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
