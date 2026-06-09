import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { SectionTitle } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function StatCard({ icon, label, value, accentBg, sub, onPress }: {
  icon: string; label: string; value: string | number; accentBg?: string; sub?: string; onPress?: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={{
      flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line,
      borderRadius: 16, padding: 13,
    }}>
      <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: accentBg || C.tint, alignItems: 'center', justifyContent: 'center', marginBottom: 9 }}>
        <Icon name={icon as any} size={18} color={C.dgreen} />
      </View>
      <Text style={{ fontFamily: F.displayExtraBold, fontSize: 22, fontWeight: '800', color: C.ink, lineHeight: 24, marginBottom: 2 }}>{value}</Text>
      <Text style={{ fontSize: 11.5, color: C.mut, fontWeight: '500' }}>{label}</Text>
      {sub && (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 5 }}>
          <Icon name="arrowUp" size={11} color={C.green} />
          <Text style={{ fontSize: 10.5, color: C.green, fontWeight: '700' }}>{sub}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function QuickBtn({ icon, label, onPress }: { icon: string; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{
      flexDirection: 'row', alignItems: 'center', gap: 10, padding: 13,
      backgroundColor: C.cream, borderWidth: 1, borderColor: C.line, borderRadius: 14,
    }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon as any} size={18} color={C.dgreen} />
      </View>
      <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink, fontFamily: F.bodyBold, flex: 1 }}>{label}</Text>
    </TouchableOpacity>
  );
}

export function Dashboard() {
  const navigation = useNavigation<Nav>();
  const { lang, store, actions } = useN();
  const insets = useSafeAreaInsets();
  const pending = store.requests.filter((r) => r.status === 'pending').length;
  const inToday = store.roster.filter((k) => k.status === 'in').length;
  const reportsDue = store.roster.filter((k) => k.status === 'in' || k.status === 'out').length;
  const todayRevenue = store.invoices.filter((i) => i.status === 'paid' && /1 Jun/.test(i.date)).reduce((a, i) => a + i.amount, 0);

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="light-content" backgroundColor={C.header} />
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* GREEN HEADER */}
        <View style={{ backgroundColor: C.header, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, paddingHorizontal: 22, paddingBottom: 22, paddingTop: insets.top + 12, overflow: 'hidden' }}>
          <View style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: '#ffffff0a' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}>
              <View style={{ width: 42, height: 42, borderRadius: 999, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#ffffff44' }}>
                <Icon name="leaf" size={20} color={C.dgreen} />
              </View>
              <View>
                <Text style={{ fontSize: 11.5, color: '#ffffffbb', fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase' }}>Nursery</Text>
                <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 19, color: C.cream }}>{store.nursery.name}</Text>
              </View>
            </View>
            <TouchableOpacity style={{ position: 'relative', width: 42, height: 42, borderRadius: 999, borderWidth: 1, borderColor: '#ffffff2e', backgroundColor: '#ffffff1f', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="chat" size={20} color={C.cream} />
              {store.threads.some((th) => th.unread > 0) && (
                <View style={{ position: 'absolute', top: 8, right: 9, width: 9, height: 9, borderRadius: 999, backgroundColor: C.amber, borderWidth: 2, borderColor: C.header }} />
              )}
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12 }}>
            <View>
              <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.cream, lineHeight: 32, marginBottom: 4 }}>
                {t(lang, 'goodMorning')}{'\n'}Hanan 🌱
              </Text>
              <Text style={{ fontSize: 13, color: '#ffffffbb' }}>Tuesday · 2 June 2026</Text>
            </View>
          </View>

          {/* Listed status pill */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#ffffff14', borderWidth: 1, borderColor: '#ffffff22', borderRadius: 12, padding: 10, marginTop: 18 }}>
            <View style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: store.nursery.listed ? '#a5dab1' : '#e88c70' }} />
            <Text style={{ flex: 1, fontSize: 12.5, fontWeight: '600', color: C.cream }}>
              {store.nursery.listed ? t(lang, 'listedVisible') : t(lang, 'hiddenFromSearch')}
            </Text>
            <TouchableOpacity onPress={() => actions.setListed(!store.nursery.listed)} style={{ borderWidth: 1, borderColor: '#ffffff3a', borderRadius: 999, paddingHorizontal: 11, paddingVertical: 5 }}>
              <Text style={{ color: C.cream, fontWeight: '700', fontSize: 11.5, fontFamily: F.bodyBold }}>
                {store.nursery.listed ? t(lang, 'pause') : t(lang, 'resume')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ padding: 20, paddingBottom: 0 }}>
          {/* Pending requests alert */}
          {pending > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('NRequests')} style={{
              flexDirection: 'row', alignItems: 'center', gap: 11,
              backgroundColor: '#fbeede', borderWidth: 1, borderColor: '#f0d9b8',
              borderRadius: 14, padding: 12, marginBottom: 16,
            }}>
              <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="bell" size={20} color="#b06d22" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '700', color: '#7a4f17', fontFamily: F.bodyBold }}>{pending} {t(lang, 'pendingRequests')}</Text>
                <Text style={{ fontSize: 11.5, color: '#a06a2a', marginTop: 1 }}>{t(lang, 'expiresAlert')}</Text>
              </View>
              <Icon name="chevRight" size={20} color="#b06d22" />
            </TouchableOpacity>
          )}

          {/* KPI grid */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <StatCard icon="users" label={t(lang, 'checkedInToday')} value={inToday} onPress={() => navigation.navigate('Attendance')} />
            <StatCard icon="bell" label={t(lang, 'newRequests')} value={pending} accentBg="#fbeede" onPress={() => navigation.navigate('NRequests')} />
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <StatCard icon="moneyIn" label={t(lang, 'todayRevenue')} value={`${todayRevenue} JD`} sub="+12% vs Mon" onPress={() => navigation.navigate('NBilling')} />
            <StatCard icon="image" label={t(lang, 'reportsToSend')} value={`${reportsDue - 4}/${reportsDue}`} onPress={() => navigation.navigate('NReports')} />
          </View>

          {/* Today schedule */}
          <SectionTitle title={t(lang, 'todaySchedule')} action={t(lang, 'calendar')} onAction={() => navigation.navigate('NCalendar')} />
          <View style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, padding: 4, marginBottom: 20 }}>
            {[
              { time: '8:00 – 12:00', group: 'Sunshine (Toddler)', count: 11, total: 12 },
              { time: '9:00 – 12:00', group: 'Tiny Sprouts (Infant)', count: 4, total: 6 },
              { time: '8:30 – 5:00', group: 'Rainbow (Preschool)', count: 9, total: 14 },
            ].map((sl, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 11, borderTopWidth: i ? 1 : 0, borderTopColor: C.line }}>
                <View style={{ width: 64 }}>
                  <Text style={{ fontFamily: F.displayBold, fontSize: 12, fontWeight: '700', color: C.dgreen }}>{sl.time}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink }}>{sl.group}</Text>
                  <Text style={{ fontSize: 11.5, color: C.mut }}>{sl.count} of {sl.total} children</Text>
                </View>
                <View style={{ paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999, backgroundColor: sl.count >= sl.total - 1 ? '#fbeede' : '#e4f1e6' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: sl.count >= sl.total - 1 ? '#b06d22' : C.green }}>
                    {Math.round(sl.count / sl.total * 100)}%
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Quick actions */}
          <SectionTitle title={t(lang, 'quickActions')} />
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
            <View style={{ flex: 1 }}>
              <QuickBtn icon="qrScan" label={t(lang, 'checkInQr')} onPress={() => navigation.navigate('Attendance')} />
            </View>
            <View style={{ flex: 1 }}>
              <QuickBtn icon="image" label={t(lang, 'composeReport')} onPress={() => navigation.navigate('NReportCompose', { childId: 'k1' })} />
            </View>
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <QuickBtn icon="users" label={t(lang, 'viewRoster')} onPress={() => navigation.navigate('Attendance')} />
            </View>
            <View style={{ flex: 1 }}>
              <QuickBtn icon="moneyIn" label={t(lang, 'invoices')} onPress={() => navigation.navigate('NBilling')} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
