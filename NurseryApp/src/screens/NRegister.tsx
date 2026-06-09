import React, { useState } from 'react';
import { View, Text, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Button, Field, TopBar } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NRegister() {
  const navigation = useNavigation<Nav>();
  const { lang, actions } = useN();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    businessName: '', license: '', commercial: '',
    owner: '', phone: '', email: '',
    address: '', district: '',
  });

  const patch = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const steps = [
    {
      title: t(lang, 'businessInfo'),
      fields: (
        <>
          <Field label={t(lang, 'businessName')} value={form.businessName} onChangeText={patch('businessName')} />
          <Field label={t(lang, 'licenseNumber')} value={form.license} onChangeText={patch('license')} />
          <Field label={t(lang, 'commercialReg')} value={form.commercial} onChangeText={patch('commercial')} />
        </>
      ),
    },
    {
      title: t(lang, 'ownerInfo'),
      fields: (
        <>
          <Field label={t(lang, 'ownerName')} value={form.owner} onChangeText={patch('owner')} />
          <Field label={t(lang, 'ownerPhone')} value={form.phone} onChangeText={patch('phone')} keyboardType="phone-pad" icon="phone" />
          <Field label={t(lang, 'ownerEmail')} value={form.email} onChangeText={patch('email')} keyboardType="email-address" icon="mail" />
        </>
      ),
    },
    {
      title: t(lang, 'locationInfo'),
      fields: (
        <>
          <Field label={t(lang, 'address')} value={form.address} onChangeText={patch('address')} icon="pin" />
          <Field label={t(lang, 'district')} value={form.district} onChangeText={patch('district')} />
        </>
      ),
    },
  ];

  const isLast = step === steps.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar title={t(lang, 'registerTitle')} onBack={() => step === 0 ? navigation.goBack() : setStep(step - 1)} />

      {/* Step indicator */}
      <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', paddingBottom: 10 }}>
        {steps.map((_, i) => (
          <View key={i} style={{ height: 5, borderRadius: 999, width: i === step ? 22 : 5, backgroundColor: i <= step ? C.green : '#d8ddd3' }} />
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 22, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: C.cream, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 14, marginBottom: 20, alignSelf: 'flex-start' }}>
          <Text style={{ fontFamily: F.body, fontSize: 12, color: C.dgreen, fontWeight: '600' }}>
            {t(lang, 'step')} {step + 1} {t(lang, 'of')} {steps.length} · {steps[step].title}
          </Text>
        </View>

        {steps[step].fields}
      </ScrollView>

      <View style={{ padding: 22, paddingBottom: 34, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button
          onPress={() => {
            if (isLast) {
              actions.setReg(form);
              navigation.navigate('NKyc');
            } else {
              setStep(step + 1);
            }
          }}
          full
          size="lg"
          icon={isLast ? undefined : undefined}
          iconRight={isLast ? undefined : 'arrowRight'}
        >
          {isLast ? t(lang, 'submit') : t(lang, 'next')}
        </Button>
      </View>
    </View>
  );
}
