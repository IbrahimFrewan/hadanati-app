import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Field, AvatarImage } from '../components';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

export function ProfileSetupScreen({ navigation }: any) {
  const { store, lang, actions } = useApp();
  const [name, setName] = useState(store.user.name);
  const [email, setEmail] = useState('');

  const save = () => {
    actions.patch({ user: { ...store.user, name, email } });
    navigation.replace('tabs');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'yourProfile')} onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <View style={{ marginBottom: 22 }}>
          <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink, marginBottom: 8, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(lang, 'niceToMeetYou')}</Text>
          <Text style={{ fontSize: 13.5, color: C.mut, lineHeight: 20, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(lang, 'profileSubtitle')}</Text>
        </View>

        <View style={{ alignItems: 'center', marginBottom: 26 }}>
          <TouchableOpacity style={{ position: 'relative' }}>
            <View style={{ width: 96, height: 96, borderRadius: 48, overflow: 'hidden', borderWidth: 2, borderColor: C.line, backgroundColor: '#e0d8c8' }}>
              <AvatarImage seed="new-user" size={96} />
            </View>
            <View style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' }}>
              <Icon name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <Field
          label={t(lang, 'fullName')}
          placeholder={t(lang, 'fullNamePlaceholder')}
          value={name}
          onChangeText={setName}
        />
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

      <View style={{ padding: 24, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button full size="lg" disabled={!name.trim()} onPress={save}>{t(lang, 'saveAndContinue')}</Button>
      </View>
    </SafeAreaView>
  );
}
