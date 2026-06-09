import React from 'react';
import { View, Text, TouchableOpacity, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NApproval() {
  const navigation = useNavigation<Nav>();
  const { lang, store, actions } = useN();
  const status = store.approvalStatus;

  const configs = {
    pending: {
      icon: 'clock' as const, iconBg: '#fbeede', iconColor: '#b06d22',
      title: t(lang, 'underReview'), subtitle: t(lang, 'reviewSubtitle'),
      body: t(lang, 'reviewBody'),
      ctaLabel: null,
    },
    approved: {
      icon: 'checkCircle' as const, iconBg: C.tint, iconColor: C.green,
      title: t(lang, 'approved'), subtitle: t(lang, 'approvedSubtitle'),
      body: t(lang, 'approvedBody'),
      ctaLabel: t(lang, 'goToDashboard'),
    },
    rejected: {
      icon: 'alert' as const, iconBg: '#fbe9e4', iconColor: C.danger,
      title: t(lang, 'rejected'), subtitle: t(lang, 'rejectedSubtitle'),
      body: 'Please re-upload clear copies of your license and commercial registration.',
      ctaLabel: t(lang, 'resubmit'),
    },
  };

  const cfg = configs[status];

  return (
    <View style={{ flex: 1, backgroundColor: C.header }}>
      <RNStatusBar barStyle="light-content" />
      <View style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: '#ffffff08' }} />
      <View style={{ position: 'absolute', bottom: 60, left: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: '#ffffff06' }} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ width: 88, height: 88, borderRadius: 999, backgroundColor: cfg.iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <Icon name={cfg.icon} size={46} color={cfg.iconColor} />
        </View>

        <Text style={{ fontFamily: F.displayExtraBold, fontSize: 28, color: C.cream, textAlign: 'center', marginBottom: 8 }}>{cfg.title}</Text>
        <Text style={{ fontFamily: F.displayBold, fontSize: 15, color: '#ffffffcc', textAlign: 'center', marginBottom: 12 }}>{cfg.subtitle}</Text>
        <Text style={{ fontFamily: F.body, fontSize: 13.5, color: '#ffffff99', textAlign: 'center', lineHeight: 22, maxWidth: 280 }}>{cfg.body}</Text>

        {cfg.ctaLabel && (
          <View style={{ marginTop: 36 }}>
            <Button onPress={() => navigation.replace('MainTabs')} variant="outline" size="lg">
              {cfg.ctaLabel}
            </Button>
          </View>
        )}

        {/* Dev switcher */}
        <View style={{ marginTop: 40, flexDirection: 'row', gap: 8 }}>
          {(['pending', 'approved', 'rejected'] as const).map((s) => (
            <TouchableOpacity key={s} onPress={() => actions.setApproval(s)} style={{
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999,
              backgroundColor: status === s ? '#ffffff33' : '#ffffff11',
            }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
