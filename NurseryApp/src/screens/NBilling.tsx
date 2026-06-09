import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, Pill } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const INV_STYLE: Record<string, { label: string; bg: string; fg: string }> = {
  paid: { label: 'Paid', bg: '#e4f1e6', fg: '#2f7a44' },
  pending: { label: 'Pending', bg: '#fbeede', fg: '#b06d22' },
  overdue: { label: 'Overdue', bg: '#fbe9e4', fg: '#c2543c' },
};

export function NBilling() {
  const navigation = useNavigation<Nav>();
  const { lang, store } = useN();
  const [tab, setTab] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');

  const list = store.invoices.filter((i) => tab === 'all' || i.status === tab);
  const totals = {
    paid: store.invoices.filter((i) => i.status === 'paid').reduce((a, i) => a + i.amount, 0),
    pending: store.invoices.filter((i) => i.status === 'pending').reduce((a, i) => a + i.amount, 0),
    overdue: store.invoices.filter((i) => i.status === 'overdue').reduce((a, i) => a + i.amount, 0),
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar
        title={t(lang, 'billing')}
        subtitle="June 2026"
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="download" size={19} color={C.ink} />
          </TouchableOpacity>
        }
      />

      {/* Totals header */}
      <View style={{ paddingHorizontal: 22, paddingBottom: 14 }}>
        <View style={{ backgroundColor: C.header, borderRadius: 16, padding: 16, overflow: 'hidden', position: 'relative' }}>
          <View style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: '#ffffff0a' }} />
          <Text style={{ fontSize: 11, color: '#ffffffbb', fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 4 }}>{t(lang, 'collectedThisMonth')}</Text>
          <Text style={{ fontFamily: F.displayExtraBold, fontWeight: '800', fontSize: 30, color: C.cream, marginBottom: 14 }}>
            {totals.paid + totals.pending} <Text style={{ fontSize: 14, color: '#ffffffbb', fontWeight: '600' }}>JD</Text>
          </Text>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            {[['Paid', totals.paid, '#a5dab1'], ['Pending', totals.pending, '#e7a93a'], ['Overdue', totals.overdue, '#e88c70']].map(([l, v, c]) => (
              <View key={l as string}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 999, backgroundColor: c as string }} />
                  <Text style={{ fontSize: 10.5, color: '#ffffffbb', fontWeight: '600' }}>{l as string}</Text>
                </View>
                <Text style={{ fontFamily: F.displayBold, fontSize: 15, fontWeight: '800', color: C.cream }}>{v as number} JD</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 22, gap: 7, paddingBottom: 12 }}>
        {(['all', 'paid', 'pending', 'overdue'] as const).map((k) => (
          <Pill key={k} active={tab === k} onPress={() => setTab(k)}>{k.charAt(0).toUpperCase() + k.slice(1)}</Pill>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {list.map((inv) => {
          const s = INV_STYLE[inv.status];
          return (
            <View key={inv.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: C.line }}>
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: s.bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={inv.status === 'paid' ? 'checkCircle' : inv.status === 'pending' ? 'clock' : 'alert'} size={19} color={s.fg} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontFamily: F.displayBold, fontSize: 14.5, fontWeight: '700', color: C.ink, marginBottom: 2 }}>
                  {inv.parent} <Text style={{ color: C.mut, fontWeight: '500' }}>· {inv.child}</Text>
                </Text>
                <Text style={{ fontSize: 11.5, color: C.mut }}>{inv.date}{inv.method !== '—' ? ` · ${inv.method.toUpperCase()}` : ''}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 15, color: C.dgreen }}>{inv.amount} JD</Text>
                <Text style={{ fontSize: 10.5, fontWeight: '700', color: s.fg }}>{s.label}</Text>
              </View>
            </View>
          );
        })}
        {list.length === 0 && (
          <Text style={{ textAlign: 'center', padding: 40, color: C.mut }}>{t(lang, 'noInvoices')}</Text>
        )}
      </ScrollView>
    </View>
  );
}
