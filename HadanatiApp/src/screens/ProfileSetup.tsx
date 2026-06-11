import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { F } from '../theme';
import { Button, TopBar, Field } from '../components';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

export function ProfileSetupScreen({ navigation }: any) {
  const { store, lang, actions } = useApp();
  const isRTL = lang === 'ar';
  const [email, setEmail] = useState('');

  const save = () => {
    // updateUser also persists to the backend when one is configured.
    actions.updateUser({ email });
    navigation.replace('tabs');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: store.user.name ? '#f7f5f0' : '#f7f5f0' }}>
      <TopBar title={t(lang, 'yourProfile')} onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: '#1c2b1e', marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'niceToMeetYou')}</Text>
          <Text style={{ fontSize: 13.5, color: '#7a8c7d', lineHeight: 20, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'profileSubtitle')}</Text>
        </View>
        <Field
          label={t(lang, 'email')}
          icon="mail"
          placeholder={t(lang, 'emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          hint={t(lang, 'emailHint')}
        />
      </ScrollView>

      <View style={{ padding: 24, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e8e4da' }}>
        <Button full size="lg" onPress={save}>{t(lang, 'saveAndContinue')}</Button>
      </View>
    </SafeAreaView>
  );
}
