import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Field, AvatarImage, EmptyView } from '../components';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

function derive(dob: string) {
  if (!dob) return 'toddler';
  const y = (Date.now() - new Date(dob).getTime()) / 31557600000;
  return y < 1 ? 'infant' : y < 3 ? 'toddler' : 'preschool';
}

function ageStr(dob: string) {
  if (!dob) return '';
  const m = Math.floor((Date.now() - new Date(dob).getTime()) / 2629800000);
  return m < 24 ? `${m} months` : `${Math.floor(m / 12)} years`;
}

export function ChildrenScreen({ navigation }: any) {
  const { store, lang, actions } = useApp();
  const [form, setForm] = useState<{ name: string; dob: string; allergies: string } | null>(null);
  const isRTL = lang === 'ar';

  const AGE_LABELS: Record<string, string> = {
    infant: t(lang, 'ageGroupInfant'),
    toddler: t(lang, 'ageGroupToddler'),
    preschool: t(lang, 'ageGroupPreschool'),
  };

  const save = () => {
    if (!form) return;
    actions.addChild({ name: form.name, dob: form.dob, ageGroup: derive(form.dob), allergies: form.allergies, photo: false });
    setForm(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar
        title={t(lang, 'myChildren')}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => setForm({ name: '', dob: '', allergies: '' })} style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        }
      />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 22 }}>
        {store.children.length === 0 ? (
          <EmptyView
            title={t(lang, 'addChildTitle')}
            body={t(lang, 'addChildBody')}
            ctaLabel={t(lang, 'addChildCta')}
            onCta={() => setForm({ name: '', dob: '', allergies: '' })}
          />
        ) : (
          <View style={{ gap: 13 }}>
            {store.children.map(ch => (
              <View key={ch.id} style={{ borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 15 }}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 13, alignItems: 'center' }}>
                  <View style={{ width: 58, height: 58, borderRadius: 29, overflow: 'hidden', borderWidth: 1, borderColor: C.line, flexShrink: 0 }}>
                    <AvatarImage seed={ch.id} size={58} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 2 }}>{ch.name}</Text>
                    <Text style={{ fontSize: 12.5, color: C.mut }}>{ageStr(ch.dob)} · {AGE_LABELS[ch.ageGroup]?.split(' · ')[0] || ch.ageGroup}</Text>
                  </View>
                  <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="edit" size={17} color={C.mut} />
                  </TouchableOpacity>
                </View>
                {ch.allergies ? (
                  <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, marginTop: 12, backgroundColor: '#fbeede', borderRadius: 10, padding: 9 }}>
                    <Icon name="alert" size={16} color="#b06d22" />
                    <Text style={{ fontSize: 12, color: '#8a5a16', fontWeight: '600', fontFamily: F.bodyBold }}>{t(lang, 'allergiesLabel')}{ch.allergies}</Text>
                  </View>
                ) : null}
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 9, marginTop: 12 }}>
                  <Button variant="secondary" size="sm" icon="calendar" onPress={() => navigation.navigate('bookings')} style={{ flex: 1 }}>{t(lang, 'bookings')}</Button>
                  <Button variant="secondary" size="sm" icon="image" onPress={() => navigation.push('reportFeed', { childId: ch.id })} style={{ flex: 1 }}>{t(lang, 'bookingReports')}</Button>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add child sheet */}
      <Modal visible={!!form} transparent animationType="slide" onRequestClose={() => setForm(null)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#1c281e66' }} onPress={() => setForm(null)} activeOpacity={1}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', borderRadius: 26, padding: 20, paddingTop: 14 }}>
            <View style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#e7e2d6', alignSelf: 'center', marginBottom: 14 }} />
            <Text style={{ fontFamily: F.displayBold, fontSize: 20, fontWeight: '700', color: C.ink, marginBottom: 16 }}>{t(lang, 'addAChild')}</Text>
            {form && (
              <>
                <View style={{ alignItems: 'center', marginBottom: 18 }}>
                  <TouchableOpacity style={{ position: 'relative' }}>
                    <View style={{ width: 80, height: 80, borderRadius: 40, overflow: 'hidden', borderWidth: 2, borderColor: C.line }}>
                      <AvatarImage seed="new-child" size={80} />
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' }}>
                      <Icon name="camera" size={14} color="#fff" />
                    </View>
                  </TouchableOpacity>
                </View>
                <Field label={t(lang, 'childName')} placeholder={t(lang, 'childNamePlaceholder')} value={form.name} onChangeText={v => setForm({ ...form, name: v })} autoFocus />
                <Field label={t(lang, 'dateOfBirth')} placeholder="YYYY-MM-DD" value={form.dob} onChangeText={v => setForm({ ...form, dob: v })} hint={form.dob ? `Age group: ${AGE_LABELS[derive(form.dob)]?.split(' · ')[0] || '—'} — used to match nurseries.` : t(lang, 'dobHint')} />
                <Field label={t(lang, 'allergies')} icon="alert" placeholder={t(lang, 'allergiesPlaceholder')} value={form.allergies} onChangeText={v => setForm({ ...form, allergies: v })} />
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginBottom: 16 }}>
                  <Icon name="lock" size={14} color={C.mut} />
                  <Text style={{ fontSize: 11, color: C.mut, lineHeight: 17, flex: 1 }}>{t(lang, 'medicalNote')}</Text>
                </View>
                <Button full size="lg" disabled={!form.name.trim() || !form.dob} onPress={save}>{t(lang, 'saveChild')}</Button>
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
