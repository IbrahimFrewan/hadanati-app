import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, Pill, AvatarPlaceholder } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NReports() {
  const navigation = useNavigation<Nav>();
  const { lang, store } = useN();
  const [day, setDay] = useState(0);

  const days = [
    ['Today · 2 Jun', store.roster.filter((k) => k.status === 'in').length, 4],
    ['Yesterday · 1 Jun', 6, 6],
    ['Fri · 30 May', 6, 6],
  ] as [string, number, number][];

  const presentChildren = store.roster.filter((k) => k.status !== 'absent');

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar
        title={t(lang, 'dailyReports')}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="calendar" size={19} color={C.ink} />
          </TouchableOpacity>
        }
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, gap: 8, paddingBottom: 14 }}>
        {days.map(([label], i) => (
          <Pill key={label} active={day === i} onPress={() => setDay(i)}>{label.split(' · ')[0]}</Pill>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Completion bar */}
        <View style={{ backgroundColor: C.cream, borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.ink }}>
              {days[day][0]} · {days[day][1]} of {days[day][2]} posted
            </Text>
            {days[day][1] === days[day][2] && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <Icon name="checkCircle" size={13} color={C.green} />
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.green }}>{t(lang, 'allSent')}</Text>
              </View>
            )}
          </View>
          <View style={{ height: 6, borderRadius: 999, backgroundColor: '#e3ddcd', overflow: 'hidden' }}>
            <View style={{ width: `${(days[day][1] / days[day][2]) * 100}%`, height: '100%', backgroundColor: C.green }} />
          </View>
        </View>

        {presentChildren.map((k, i) => {
          const sent = day !== 0 || i < 4;
          return (
            <View key={k.id} style={{ flexDirection: 'row', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.line, alignItems: 'center' }}>
              <AvatarPlaceholder size={44} tone="#cba47a" />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: F.displayBold, fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 2 }}>{k.name}</Text>
                <Text style={{ fontSize: 11.5, color: C.mut }}>
                  {k.group}{sent && day !== 0 ? ' · sent 4:32 PM' : sent ? ' · sent 11:14 AM' : ''}
                </Text>
              </View>
              {sent ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#e4f1e6', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 999 }}>
                  <Icon name="checkCircle" size={13} color={C.green} />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: C.green }}>{t(lang, 'sent')}</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('NReportCompose', { childId: k.id })} style={{ backgroundColor: C.header, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 10 }}>
                  <Text style={{ color: '#fff', fontFamily: F.bodyBold, fontWeight: '700', fontSize: 12.5 }}>{t(lang, 'compose')}</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {day === 0 && (
          <TouchableOpacity onPress={() => navigation.navigate('NReportCompose', { childId: 'k1' })} style={{ width: '100%', marginTop: 18, padding: 13, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: C.line, borderStyle: 'dashed', backgroundColor: '#fff', borderRadius: 14 }}>
            <Icon name="upload" size={18} color={C.dgreen} />
            <Text style={{ color: C.dgreen, fontWeight: '700', fontSize: 13.5, fontFamily: F.bodyBold }}>{t(lang, 'bulkUpload')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
