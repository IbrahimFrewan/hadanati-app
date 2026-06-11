import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, NurseryImage, Button } from '../components';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

const REPORT = {
  id: 'r1', childName: 'Yara', date: 'Wednesday, 4 Jun 2026',
  mood: '😊 Happy and energetic all day',
  meals: [
    { time: '8:30 AM', label: 'Breakfast', desc: 'Oats with banana — ate well' },
    { time: '12:00 PM', label: 'Lunch', desc: 'Rice and vegetables — full portion' },
    { time: '3:00 PM', label: 'Snack', desc: 'Apple slices and crackers' },
  ],
  sleep: '12:30 PM – 2:30 PM · 2 hours, settled easily',
  activities: ['Circle time · songs and movement', 'Outdoor play · 45 min', 'Craft · hand-print art', 'Story time · "The Very Hungry Caterpillar"'],
  notes: "Yara had a wonderful day! She was particularly engaged during the crafts session and made a beautiful handprint butterfly. She's been asking about her new friend Laila — they played together most of the afternoon.",
  photos: ['s1', 's2', 's3', 's4'],
};

export function ReportDetailScreen({ navigation }: any) {
  const { lang } = useApp();
  const isRTL = lang === 'ar';

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 22 }}>
      <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink, marginBottom: 10, textAlign: isRTL ? 'right' : 'left' }}>{title}</Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar
        title={t(lang, 'dailyReport')}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="download" size={18} color={C.ink} />
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 40 }}>
        {/* Header card */}
        <View style={{ backgroundColor: C.header, borderRadius: 18, padding: 18, marginBottom: 22, overflow: 'hidden' }}>
          <Text style={{ fontFamily: F.displayBold, fontSize: 22, fontWeight: '700', color: C.cream, marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>
            {REPORT.childName}{t(lang, 'reportTitle')}
          </Text>
          <Text style={{ fontSize: 12.5, color: '#ffffffaa', textAlign: isRTL ? 'right' : 'left' }}>{REPORT.date}</Text>
          <View style={{ marginTop: 12, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, backgroundColor: '#ffffff18', borderRadius: 10, padding: 10 }}>
            <Text style={{ fontSize: 20 }}>😊</Text>
            <Text style={{ fontSize: 13, color: C.cream, flex: 1, fontWeight: '600', textAlign: isRTL ? 'right' : 'left' }}>{REPORT.mood}</Text>
          </View>
        </View>

        <Section title={t(lang, 'meals')}>
          <View style={{ gap: 8 }}>
            {REPORT.meals.map((m, i) => (
              <View key={i} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 11, padding: 13, backgroundColor: C.cream, borderRadius: 12 }}>
                <Icon name="meal" size={18} color={C.dgreen} />
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', marginBottom: 2 }}>
                    <Text style={{ fontFamily: F.bodyBold, fontSize: 13.5, fontWeight: '700', color: C.ink, textAlign: isRTL ? 'right' : 'left' }}>{m.label}</Text>
                    <Text style={{ fontSize: 11.5, color: C.mut, textAlign: isRTL ? 'right' : 'left' }}>{m.time}</Text>
                  </View>
                  <Text style={{ fontSize: 12.5, color: C.mut, textAlign: isRTL ? 'right' : 'left' }}>{m.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t(lang, 'sleep')}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 11, padding: 13, backgroundColor: C.tint, borderRadius: 12 }}>
            <Icon name="sleep" size={18} color={C.dgreen} />
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>{REPORT.sleep}</Text>
          </View>
        </Section>

        <Section title={t(lang, 'activities')}>
          <View style={{ gap: 8 }}>
            {REPORT.activities.map((a, i) => (
              <View key={i} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 13, borderWidth: 1, borderColor: C.line, borderRadius: 12 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.green, flexShrink: 0 }} />
                <Text style={{ fontSize: 13.5, color: C.ink, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>{a}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t(lang, 'notes')}>
          <View style={{ padding: 14, backgroundColor: C.cream, borderRadius: 14 }}>
            <Text style={{ fontSize: 13.5, color: C.mut, lineHeight: 22, textAlign: isRTL ? 'right' : 'left' }}>{REPORT.notes}</Text>
          </View>
        </Section>

        <Section title={t(lang, 'photos')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {REPORT.photos.map((p, i) => (
              <View key={i} style={{ width: '47%', height: 120, borderRadius: 14, overflow: 'hidden' }}>
                <NurseryImage seed={p} radius={14} />
              </View>
            ))}
          </View>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
