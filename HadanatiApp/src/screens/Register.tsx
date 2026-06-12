import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Field } from '../components';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { t } from '../i18n';

export function RegisterScreen({ navigation }: any) {
  const { lang, actions } = useApp();
  const isRTL = lang === 'ar';
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const digits = phone.replace(/\D/g, '');
  const valid = digits.length === 9 && digits[0] === '7' && name.trim().length >= 2;

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const submit = async () => {
    if (!valid) { setErr('Enter a valid Jordan mobile number (9 digits, starts with 7).'); return; }
    setErr(''); setLoading(true);
    // Keep the entered details locally; they are pushed to the profile once the
    // OTP is verified (and the session exists) on the next screen.
    actions.updateUser({ name: name.trim(), photoUri, phone: digits });

    if (isSupabaseConfigured) {
      try {
        await actions.auth.sendOtp(digits, true);
        navigation.push('otp', { phone: digits, mode: 'register' });
      } catch (e: any) {
        setErr(e?.message ?? 'Could not send the verification code.');
      } finally {
        setLoading(false);
      }
      return;
    }
    setTimeout(() => { setLoading(false); navigation.push('otp', { phone: digits, mode: 'register' }); }, 900);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'createAccount')} onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.replace('splash')} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>

        {/* Photo picker */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={pickPhoto} style={{ position: 'relative' }}>
            <View style={{ width: 90, height: 90, borderRadius: 45, overflow: 'hidden', borderWidth: 2, borderColor: C.line, backgroundColor: C.cream }}>
              {photoUri ? (
                <Image source={{ uri: photoUri }} style={{ width: 90, height: 90 }} />
              ) : (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="user" size={38} color={C.mut} />
                </View>
              )}
            </View>
            <View style={{ position: 'absolute', bottom: 0, right: isRTL ? undefined : 0, left: isRTL ? 0 : undefined, width: 28, height: 28, borderRadius: 14, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' }}>
              <Icon name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={{ marginTop: 8, fontSize: 12, color: C.mut, fontFamily: F.body }}>{photoUri ? 'Tap to change photo' : 'Add your photo (optional)'}</Text>
        </View>

        <Field
          label={t(lang, 'fullName')}
          icon="user"
          placeholder={t(lang, 'fullNamePlaceholder')}
          value={name}
          onChangeText={v => { setName(v); setErr(''); }}
          autoFocus
        />

        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'whatsYourNumber')}</Text>
          <Text style={{ fontSize: 13.5, color: C.mut, lineHeight: 20, textAlign: isRTL ? 'right' : 'left', fontFamily: F.body }}>{t(lang, 'phoneHint')}</Text>
        </View>

        <Field
          label={t(lang, 'mobileNumber')}
          icon="phone"
          prefix="+962"
          placeholder={t(lang, 'phonePlaceholder')}
          value={phone}
          onChangeText={v => { setPhone(v); setErr(''); }}
          keyboardType="phone-pad"
          error={err}
        />

        <TouchableOpacity
          onPress={() => setAgree(!agree)}
          style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 11, alignItems: 'flex-start', padding: 6, marginTop: 4 }}
        >
          <View style={{
            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
            borderWidth: agree ? 0 : 1.5, borderColor: C.line,
            backgroundColor: agree ? C.green : '#fff',
            alignItems: 'center', justifyContent: 'center', marginTop: 1,
          }}>
            {agree && <Icon name="check" size={15} color="#fff" />}
          </View>
          <Text style={{ fontSize: 12.5, color: C.mut, lineHeight: 20, flex: 1, textAlign: isRTL ? 'right' : 'left', fontFamily: F.body }}>
            {t(lang, 'agreeTerms')}
            <Text style={{ color: C.dgreen, fontWeight: '700', fontFamily: F.bodyBold }}>{t(lang, 'termsOfService')}</Text>
            {t(lang, 'and')}
            <Text style={{ color: C.dgreen, fontWeight: '700', fontFamily: F.bodyBold }}>{t(lang, 'privacyPolicy')}</Text>.
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={{ padding: 24, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button full size="lg" disabled={!valid || !agree || loading} onPress={submit}>
          {loading ? t(lang, 'sendingCode') : t(lang, 'sendCode')}
        </Button>
      </View>
    </SafeAreaView>
  );
}
