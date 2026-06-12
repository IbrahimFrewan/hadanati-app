import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Field } from '../components';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { t } from '../i18n';

export function LoginScreen({ navigation }: any) {
  const { lang, store, actions } = useApp();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const isRTL = lang === 'ar';

  const digits = phone.replace(/\D/g, '');
  const valid = digits.length === 9 && digits[0] === '7';

  const submit = async () => {
    if (!valid) { setErr(t(lang, 'phoneError')); return; }

    // Backend wired: send a real SMS OTP (the server is the source of truth for
    // who is registered), then verify on the next screen.
    if (isSupabaseConfigured) {
      setErr(''); setLoading(true);
      try {
        // Login must NOT create a new account for an unregistered number.
        await actions.auth.sendOtp(digits, false);
        navigation.push('otp', { phone: digits, mode: 'login' });
      } catch {
        // Supabase rejects unknown numbers when shouldCreateUser is false.
        setErr(t(lang, 'phoneNotRegistered'));
      } finally {
        setLoading(false);
      }
      return;
    }

    // Mock fallback (no backend configured): validate against the local store.
    if (!store.user.phone || store.user.phone !== digits) {
      setErr(t(lang, 'phoneNotRegistered'));
      return;
    }
    setErr('');
    setLoading(true);
    setTimeout(() => { setLoading(false); navigation.push('otp', { phone: digits, mode: 'login' }); }, 700);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      {/* Login is reached via replace() from Splash, so there may be no screen
          to go back to — fall back to the onboarding. */}
      <TopBar title={t(lang, 'login')} onBack={() => navigation.canGoBack() ? navigation.goBack() : navigation.replace('splash')} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24, paddingTop: 8 }} keyboardShouldPersistTaps="handled">
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink, marginBottom: 8, textAlign: isRTL ? 'right' : 'left' }}>
            {t(lang, 'welcomeBack')}
          </Text>
          <Text style={{ fontSize: 13.5, color: C.mut, lineHeight: 21, textAlign: isRTL ? 'right' : 'left', fontFamily: F.body }}>
            {t(lang, 'loginSubtitle')}
          </Text>
        </View>

        <Field
          label={t(lang, 'mobileNumber')}
          icon="phone"
          prefix="+962"
          placeholder="7 9123 4567"
          value={phone}
          onChangeText={v => { setPhone(v); setErr(''); }}
          keyboardType="phone-pad"
          error={err}
          autoFocus
        />

        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 9, backgroundColor: C.cream, borderRadius: 12, padding: 13, marginTop: 6 }}>
          <Icon name="shield" size={17} color={C.dgreen} />
          <Text style={{ fontSize: 12, color: C.mut, lineHeight: 18, flex: 1, textAlign: isRTL ? 'right' : 'left', fontFamily: F.body }}>
            {t(lang, 'noPasswordNote')}
          </Text>
        </View>
      </ScrollView>

      <View style={{ padding: 24, paddingTop: 10, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button full size="lg" disabled={!valid || loading} onPress={submit}>
          {loading ? t(lang, 'sendingCode') : t(lang, 'sendLoginCode')}
        </Button>
        <View style={{ marginTop: 14, alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: C.mut, fontFamily: F.body }}>
            {t(lang, 'newHere')}{' '}
            <Text
              onPress={() => navigation.replace('register')}
              style={{ color: C.dgreen, fontWeight: '700', fontFamily: F.bodyBold }}
            >
              {t(lang, 'createAccount')}
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
