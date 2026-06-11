import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, Field } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NLogin() {
  const navigation = useNavigation<Nav>();
  const { lang, store } = useN();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <RNStatusBar barStyle="dark-content" />
      {/* Header with motif */}
      <View style={{ backgroundColor: C.header, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, paddingBottom: 32, paddingTop: 60, paddingHorizontal: 26, alignItems: 'center', overflow: 'hidden' }}>
        <View style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: '#ffffff0e' }} />
        <View style={{ position: 'absolute', bottom: -30, left: -20, width: 120, height: 120, borderRadius: 60, backgroundColor: '#ffffff0a' }} />
        <View style={{ width: 60, height: 60, borderRadius: 18, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Icon name="leaf" size={30} color={C.dgreen} />
        </View>
        <Text style={{ fontFamily: F.displayExtraBold, fontSize: 28, color: C.cream, marginBottom: 4 }}>حضانتي</Text>
        <Text style={{ fontFamily: F.displayBold, fontSize: 14, color: '#ffffffaa' }}>Nursery Provider</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 26, paddingTop: 30 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 24, color: C.ink, marginBottom: 5 }}>{t(lang, 'welcomeBack')}</Text>
        <Text style={{ fontFamily: F.body, fontSize: 14, color: C.mut, marginBottom: 28 }}>{t(lang, 'loginSubtitle')}</Text>

        <Field
          label={t(lang, 'phone')}
          value={phone}
          onChangeText={v => { setPhone(v); setErr(''); }}
          placeholder="+962 7X XXX XXXX"
          keyboardType="phone-pad"
          icon="phone"
        />
        <Field
          label={t(lang, 'password')}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry
          icon="lock"
        />

        <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 24, marginTop: -4 }}>
          <Text style={{ fontFamily: F.body, color: C.green, fontSize: 13 }}>{t(lang, 'forgotPassword')}</Text>
        </TouchableOpacity>

        {err ? (
          <Text style={{ fontFamily: F.body, fontSize: 13, color: C.danger, marginBottom: 12, textAlign: 'center' }}>{err}</Text>
        ) : null}
        <Button onPress={() => {
          const digits = phone.replace(/\D/g, '');
          const regPhone = store.registration.phone.replace(/\D/g, '');
          if (regPhone && digits !== regPhone) {
            setErr(t(lang, 'phoneNotRegistered'));
            return;
          }
          if (!regPhone) {
            setErr(t(lang, 'phoneNotRegistered'));
            return;
          }
          setErr('');
          navigation.replace('MainTabs');
        }} full size="lg">
          {t(lang, 'signIn')}
        </Button>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 22 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: C.line }} />
          <Text style={{ marginHorizontal: 14, color: C.mut, fontSize: 12 }}>or</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: C.line }} />
        </View>

        <Button onPress={() => navigation.navigate('NRegister')} variant="secondary" full>
          {t(lang, 'register')}
        </Button>
      </ScrollView>
    </View>
  );
}
