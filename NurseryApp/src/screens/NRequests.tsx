import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { StatusPill, EmptyView } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const PLAN: Record<string, string> = { hourly: 'Hourly', daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };

function fmtTime(s: number) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function expiryStyle(s: number) {
  if (s < 6 * 3600) return { fg: '#c2543c', bg: '#fbe9e4' };
  if (s < 12 * 3600) return { fg: '#b06d22', bg: '#fbeede' };
  return { fg: '#3d7a4f', bg: '#e4f1e6' };
}

export function NRequests() {
  const navigation = useNavigation<Nav>();
  const { lang, store } = useN();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<'pending' | 'accepted' | 'declined'>('pending');

  const list = store.requests.filter((r) => r.status === tab);
  const counts = {
    pending: store.requests.filter((r) => r.status === 'pending').length,
    accepted: store.requests.filter((r) => r.status === 'accepted').length,
    declined: store.requests.filter((r) => r.status === 'declined').length,
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <View style={{ paddingHorizontal: 22, paddingTop: insets.top + 6, paddingBottom: 12 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink }}>{t(lang, 'requests')}</Text>
      </View>

      {/* Tab strip */}
      <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 22, paddingBottom: 14 }}>
        {(['pending', 'accepted', 'declined'] as const).map((tabKey) => (
          <TouchableOpacity key={tabKey} onPress={() => setTab(tabKey)} style={{
            flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center',
            backgroundColor: tab === tabKey ? C.header : C.cream,
          }}>
            <Text style={{ fontFamily: F.bodyBold, fontSize: 13, fontWeight: '700', color: tab === tabKey ? '#fff' : C.mut, textTransform: 'capitalize' }}>
              {t(lang, tabKey)} {counts[tabKey] > 0 ? `· ${counts[tabKey]}` : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24, gap: 13 }} showsVerticalScrollIndicator={false}>
        {list.length === 0 ? (
          <EmptyView title={`No ${tab} requests`} body={tab === 'pending' ? t(lang, 'pendingBody') : 'Nothing here yet.'} />
        ) : list.map((r) => {
          const exp = tab === 'pending' ? expiryStyle(r.expiresIn) : null;
          return (
            <TouchableOpacity key={r.id} onPress={() => navigation.navigate('NRequestDetail', { id: r.id })} style={{
              backgroundColor: '#fff', borderWidth: 1, borderColor: C.line,
              borderRadius: 18, padding: 14,
            }}>
              <View style={{ flexDirection: 'row', gap: 12, alignItems: 'stretch' }}>
                <View style={{ width: 48, height: 48, borderRadius: 999, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center' }}>
                  <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 17, color: C.dgreen }}>{r.parent[0]}</Text>
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontFamily: F.displayBold, fontSize: 15.5, fontWeight: '700', color: C.ink, marginBottom: 2 }}>{r.parent}</Text>
                  <Text style={{ fontSize: 12.5, color: C.mut, marginBottom: 5 }}>{r.child}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon name="calendar" size={13} color={C.dgreen} />
                    <Text style={{ fontSize: 12, color: C.ink, fontWeight: '600' }}>{PLAN[r.type]} · {r.from}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, flexShrink: 0 }}>
                  {tab === 'pending' && exp ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: exp.bg, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 999 }}>
                      <Icon name="clock" size={12} color={exp.fg} />
                      <Text style={{ fontSize: 11, fontWeight: '700', color: exp.fg }}>{fmtTime(r.expiresIn)}</Text>
                    </View>
                  ) : (
                    <StatusPill status={r.status} />
                  )}
                  <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 16, color: C.dgreen }}>
                    {r.price} <Text style={{ fontSize: 10.5, color: C.mut, fontWeight: '600' }}>JD/{r.unit}</Text>
                  </Text>
                </View>
              </View>
              {r.note && tab === 'pending' && (
                <View style={{ marginTop: 11, padding: 9, backgroundColor: C.cream, borderRadius: 10, borderLeftWidth: 3, borderLeftColor: C.green }}>
                  <Text style={{ fontSize: 12.5, color: C.mut, lineHeight: 19 }}>"{r.note}"</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
