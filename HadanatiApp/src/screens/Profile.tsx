import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Toggle, AvatarImage, LangToggle } from '../components';
import { useApp } from '../context/AppContext';
import { Lang, t } from '../i18n';

function GroupTitle({ children }: { children: string }) {
  return (
    <Text style={{ marginTop: 22, marginBottom: 6, fontSize: 11.5, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: '#9aa195', fontFamily: F.bodyBold }}>
      {children}
    </Text>
  );
}

function Row({
  icon, label, value, onPress, danger, right, last, isRTL,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
  right?: React.ReactNode;
  last?: boolean;
  isRTL?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        gap: 13,
        paddingVertical: 14,
        paddingHorizontal: 4,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: C.line,
      }}
    >
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: danger ? '#fbe9e4' : C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name={icon as any} size={18} color={danger ? C.danger : C.dgreen} />
      </View>
      <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', fontFamily: F.bodyBold, color: danger ? C.danger : C.ink, textAlign: isRTL ? 'right' : 'left' }}>
        {label}
      </Text>
      {value ? <Text style={{ fontSize: 12.5, color: C.mut }}>{value}</Text> : null}
      {right ? right : (onPress && !danger ? <Icon name={isRTL ? 'chevLeft' : 'chevRight'} size={18} color={C.mut} /> : null)}
    </TouchableOpacity>
  );
}

export function ProfileScreen({ navigation }: any) {
  const { store, lang, actions } = useApp();
  const isRTL = lang === 'ar';

  const [reports, setReports] = useState(true);
  const [attendance, setAttendance] = useState(true);
  const [payments, setPayments] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [uiLang, setUiLang] = useState<string>(lang === 'ar' ? 'ع' : 'EN');

  const handleLang = (l: string) => {
    setUiLang(l);
    actions.setLang((l === 'ع' ? 'ar' : 'en') as Lang);
  };

  const handleLogout = () => {
    const parent = navigation.getParent();
    if (parent) {
      parent.reset({ index: 0, routes: [{ name: 'splash' }] });
    } else {
      navigation.navigate('splash');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t(lang, 'deleteAccountTitle'),
      t(lang, 'deleteAccountBody'),
      [
        { text: t(lang, 'keepAccount'), style: 'cancel' },
        { text: t(lang, 'delete'), style: 'destructive', onPress: () => {} },
      ],
    );
  };

  const user = store.user || { name: '', phone: '', photoUri: undefined };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.page }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 96 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink, paddingTop: 6, paddingBottom: 18, textAlign: isRTL ? 'right' : 'left' }}>
          {t(lang, 'profile')}
        </Text>

        {/* Identity card */}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 14, padding: 15, borderWidth: 1, borderColor: C.line, borderRadius: 18, marginBottom: 6 }}>
          <View style={{ width: 60, height: 60, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: C.line, flexShrink: 0 }}>
            <AvatarImage seed={user.name} size={60} uri={user.photoUri || undefined} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 2, textAlign: isRTL ? 'right' : 'left' }}>
              {user.name}
            </Text>
            <Text style={{ fontSize: 12.5, color: C.mut, textAlign: isRTL ? 'right' : 'left' }}>
              +962 {user.phone}
            </Text>
          </View>
          <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="edit" size={17} color={C.mut} />
          </TouchableOpacity>
        </View>

        <GroupTitle>{t(lang, 'family')}</GroupTitle>
        <View>
          <Row
            icon="users"
            label={t(lang, 'myChildren')}
            value={String(store.children.length)}
            onPress={() => navigation.getParent()?.navigate('children')}
            isRTL={isRTL}
          />
          <Row
            icon="heart"
            label={t(lang, 'savedNurseries')}
            value={String(store.favorites.length)}
            onPress={() => {}}
            isRTL={isRTL}
          />
          <Row
            icon="wallet"
            label={t(lang, 'paymentMethods')}
            value={t(lang, 'oneCard')}
            onPress={() => {}}
            last
            isRTL={isRTL}
          />
        </View>

        <GroupTitle>{t(lang, 'notificationsTitle')}</GroupTitle>
        <View>
          <Row icon="image" label={t(lang, 'dailyReportsToggle')} right={<Toggle on={reports} onChange={setReports} />} isRTL={isRTL} />
          <Row icon="checkCircle" label={t(lang, 'attendanceAlerts')} right={<Toggle on={attendance} onChange={setAttendance} />} isRTL={isRTL} />
          <Row icon="wallet" label={t(lang, 'paymentReminders')} right={<Toggle on={payments} onChange={setPayments} />} isRTL={isRTL} />
          <Row icon="gift" label={t(lang, 'offersNews')} right={<Toggle on={marketing} onChange={setMarketing} />} last isRTL={isRTL} />
        </View>

        <GroupTitle>{t(lang, 'preferencesTitle')}</GroupTitle>
        <View>
          <Row
            icon="globe"
            label={t(lang, 'language')}
            right={<LangToggle lang={uiLang} onSet={handleLang} />}
            isRTL={isRTL}
          />
          <Row
            icon="info"
            label={t(lang, 'helpSupport')}
            onPress={() => navigation.getParent()?.navigate('support')}
            isRTL={isRTL}
          />
          <Row icon="shield" label={t(lang, 'termsPrivacy')} onPress={() => {}} last isRTL={isRTL} />
        </View>

        {/* Security note */}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 9, marginTop: 24, padding: 12, backgroundColor: C.cream, borderRadius: 12 }}>
          <Icon name="lock" size={16} color={C.mut} />
          <Text style={{ fontSize: 11, color: C.mut, lineHeight: 17, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>
            {t(lang, 'sensitiveNote')}
          </Text>
        </View>

        <View style={{ marginTop: 12 }}>
          <Row icon="logout" label={t(lang, 'logOut')} onPress={handleLogout} isRTL={isRTL} />
          <Row icon="trash" label={t(lang, 'deleteAccount')} danger onPress={handleDeleteAccount} last isRTL={isRTL} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
