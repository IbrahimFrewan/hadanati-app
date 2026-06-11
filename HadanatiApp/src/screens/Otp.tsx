import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar } from '../components';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { t } from '../i18n';

export function OtpScreen({ navigation, route }: any) {
  const { lang, store, actions } = useApp();
  const isRTL = lang === 'ar';
  const phone = route.params?.phone || '7 9123 4567';
  const mode = route.params?.mode || 'register';
  const masked = '+962 ' + String(phone).slice(0, 1) + ' •••• ' + String(phone).slice(-2);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const [err, setErr] = useState('');
  const refs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timer <= 0) return;
    const id = setTimeout(() => setTimer(timer - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, '').slice(-1);
    const next = [...code]; next[i] = d; setCode(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
    if (next.every(x => x)) submit(next.join(''));
  };

  const submit = async (full: string) => {
    setErr('');
    setVerifying(true);

    if (isSupabaseConfigured) {
      try {
        await actions.auth.verifyOtp(phone, full);
        // Now authenticated: persist the details captured during sign-up.
        if (mode !== 'login') {
          actions.updateUser({
            name: store.user.name, phone: store.user.phone, photoUri: store.user.photoUri,
          });
        }
        navigation.replace(mode === 'login' ? 'tabs' : 'profileSetup');
      } catch (e: any) {
        setVerifying(false);
        setErr(e?.message ?? 'Invalid code — please try again.');
        setCode(['', '', '', '', '', '']);
        refs.current[0]?.focus();
      }
      return;
    }

    // Mock fallback (no backend configured).
    setTimeout(() => navigation.replace(mode === 'login' ? 'tabs' : 'profileSetup'), 800);
  };

  const onKey = (i: number, key: string) => {
    if (key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'verifyNumber')} onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <View style={{ marginBottom: 26 }}>
          <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink, marginBottom: 8, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(lang, 'enterCode')}</Text>
          <Text style={{ fontSize: 13.5, color: C.mut, lineHeight: 20, textAlign: lang === 'ar' ? 'right' : 'left' }}>
            {t(lang, 'sentTo')}<Text style={{ fontWeight: '700', color: C.ink }}>{masked}</Text>.{' '}
            <Text onPress={() => navigation.goBack()} style={{ color: C.dgreen, fontWeight: '700' }}>{t(lang, 'edit')}</Text>
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 9, marginBottom: 22 }}>
          {code.map((d, i) => (
            <TextInput
              key={i}
              ref={el => { refs.current[i] = el; }}
              value={d}
              onChangeText={v => setDigit(i, v)}
              onKeyPress={({ nativeEvent }) => onKey(i, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={i === 0}
              style={{
                flex: 1, height: 60, textAlign: 'center',
                fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink,
                borderWidth: 1.5, borderColor: d ? C.green : C.line,
                borderRadius: 14, backgroundColor: '#fff',
              }}
            />
          ))}
        </View>

        {err ? (
          <Text style={{ fontSize: 13, color: C.danger, marginBottom: 12, textAlign: isRTL ? 'right' : 'left', fontFamily: F.body }}>{err}</Text>
        ) : null}

        {verifying ? (
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 7 }}>
            <Icon name="checkCircle" size={17} color={C.green} />
            <Text style={{ fontSize: 13, color: C.green, fontWeight: '600', textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'verifying')}</Text>
          </View>
        ) : (
          <Text style={{ fontSize: 13, color: C.mut, textAlign: isRTL ? 'right' : 'left' }}>
            {timer > 0 ? (
              <>{t(lang, 'resendIn')}<Text style={{ fontWeight: '700', color: C.ink }}>0:{String(timer).padStart(2, '0')}</Text></>
            ) : (
              <Text onPress={() => setTimer(30)} style={{ color: C.dgreen, fontWeight: '700' }}>{t(lang, 'resendCode')}</Text>
            )}
          </Text>
        )}

        <View style={{ marginTop: 22, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 9, backgroundColor: C.cream, borderRadius: 12, padding: 13 }}>
          <Icon name="info" size={17} color={C.mut} />
          <Text style={{ fontSize: 11.5, color: C.mut, flex: 1, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'demoHint')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
