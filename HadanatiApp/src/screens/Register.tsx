import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Field } from '../components';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

export function RegisterScreen({ navigation }: any) {
  const { lang } = useApp();
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const digits = phone.replace(/\D/g, '');
  const valid = digits.length === 9 && digits[0] === '7';

  const submit = () => {
    if (!valid) { setErr('Enter a valid Jordan mobile number (9 digits, starts with 7).'); return; }
    setErr(''); setLoading(true);
    setTimeout(() => { setLoading(false); navigation.push('otp', { phone: digits }); }, 900);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'createAccount')} onBack={() => navigation.goBack()} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 24 }}>
        <View style={{ marginBottom: 24 }}>
          <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink, marginBottom: 8, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(lang, 'whatsYourNumber')}</Text>
          <Text style={{ fontSize: 13.5, color: C.mut, lineHeight: 20, textAlign: lang === 'ar' ? 'right' : 'left' }}>{t(lang, 'phoneHint')}</Text>
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
          style={{ flexDirection: 'row', gap: 11, alignItems: 'flex-start', padding: 6, marginTop: 4 }}
        >
          <View style={{
            width: 22, height: 22, borderRadius: 7, flexShrink: 0,
            borderWidth: agree ? 0 : 1.5, borderColor: C.line,
            backgroundColor: agree ? C.green : '#fff',
            alignItems: 'center', justifyContent: 'center', marginTop: 1,
          }}>
            {agree && <Icon name="check" size={15} color="#fff" />}
          </View>
          <Text style={{ fontSize: 12.5, color: C.mut, lineHeight: 20, flex: 1, textAlign: lang === 'ar' ? 'right' : 'left' }}>
            {t(lang, 'agreeTerms')}
            <Text style={{ color: C.dgreen, fontWeight: '700' }}>{t(lang, 'termsOfService')}</Text>
            {t(lang, 'and')}
            <Text style={{ color: C.dgreen, fontWeight: '700' }}>{t(lang, 'privacyPolicy')}</Text>.
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
