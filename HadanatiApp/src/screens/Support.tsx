import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, Button, NurseryImage } from '../components';
import { useApp } from '../context/AppContext';
import { getNursery } from '../data';
import { t } from '../i18n';

function Faq({ q, a }: { q: string; a: string }) {
  const { lang } = useApp();
  const isRTL = lang === 'ar';
  const [open, setOpen] = useState(false);
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: C.line }}>
      <TouchableOpacity onPress={() => setOpen(!open)} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, paddingVertical: 14 }}>
        <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', fontFamily: F.bodyBold, color: C.ink, textAlign: isRTL ? 'right' : 'left' }}>{q}</Text>
        <Icon name={open ? 'chevUp' : 'chevDown'} size={18} color={C.mut} />
      </TouchableOpacity>
      {open && <Text style={{ fontSize: 12.5, color: C.mut, lineHeight: 22, paddingBottom: 14, textAlign: isRTL ? 'right' : 'left' }}>{a}</Text>}
    </View>
  );
}

export function SupportScreen({ navigation }: any) {
  const { store, lang } = useApp();
  const isRTL = lang === 'ar';
  const active = store.bookings.find(b => b.status === 'active');
  const n = active ? getNursery(active.nurseryId) : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'helpSupport')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 40 }}>
        {/* Green help card */}
        <View style={{ borderRadius: 18, overflow: 'hidden', backgroundColor: C.header, padding: 18, marginBottom: 20 }}>
          <Text style={{ fontFamily: F.displayBold, fontSize: 19, fontWeight: '700', color: C.cream, marginBottom: 5, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'howCanWeHelp')}</Text>
          <Text style={{ fontSize: 12.5, color: '#ffffff99', lineHeight: 20, marginBottom: 14, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'supportSubtitle')}</Text>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 9 }}>
            <Button variant="secondary" icon="chat" style={{ flex: 1 }}>{t(lang, 'startChat')}</Button>
            <Button variant="secondary" icon="mail" style={{ flex: 1 }}>{t(lang, 'openTicket')}</Button>
          </View>
        </View>

        {/* Active booking context */}
        {n && (
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, padding: 13, borderWidth: 1, borderColor: C.line, borderRadius: 14, marginBottom: 20 }}>
            <Icon name="paperclip" size={17} color={C.dgreen} />
            <Text style={{ flex: 1, fontSize: 12.5, color: C.ink, textAlign: isRTL ? 'right' : 'left' }}>
              {t(lang, 'activeBookingAttached')}<Text style={{ fontWeight: '700' }}>{n.name}</Text>
            </Text>
            <Text style={{ fontSize: 11, color: C.green, fontWeight: '600', fontFamily: F.bodyBold }}>{t(lang, 'autoLabel')}</Text>
          </View>
        )}

        {/* FAQ */}
        <Text style={{ fontFamily: F.displayBold, fontSize: 17, fontWeight: '700', color: C.ink, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'popularQuestions')}</Text>
        <Faq q={t(lang, 'faq1Q')} a={t(lang, 'faq1A')} />
        <Faq q={t(lang, 'faq2Q')} a={t(lang, 'faq2A')} />
        <Faq q={t(lang, 'faq3Q')} a={t(lang, 'faq3A')} />
        <Faq q={t(lang, 'faq4Q')} a={t(lang, 'faq4A')} />

        {/* Tickets */}
        <Text style={{ fontFamily: F.displayBold, fontSize: 17, fontWeight: '700', color: C.ink, marginTop: 24, marginBottom: 6, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'yourTickets')}</Text>
        <TouchableOpacity style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 11, padding: 13, borderWidth: 1, borderColor: C.line, borderRadius: 14 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#e4f1e6', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="checkCircle" size={18} color="#2f7a44" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '600', fontFamily: F.bodyBold, color: C.ink, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'refundQuestion')}</Text>
            <Text style={{ fontSize: 11.5, color: C.mut, marginTop: 1, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'resolved')}</Text>
          </View>
          <Icon name={isRTL ? 'chevLeft' : 'chevRight'} size={18} color={C.mut} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
