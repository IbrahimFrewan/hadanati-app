import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, NurseryImage, Button, EmptyView } from '../components';
import { getNursery } from '../data';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

export function ReviewScreen({ navigation, route }: any) {
  const { lang } = useApp();
  const isRTL = lang === 'ar';
  const nurseryId = route.params?.nurseryId;
  const n = getNursery(nurseryId);

  const [stars, setStars] = useState(0);
  const [text, setText] = useState('');
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
        <TopBar title={t(lang, 'review')} onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#e4f1e6', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
            <Icon name="checkCircle" size={36} color="#2f7a44" />
          </View>
          <Text style={{ fontFamily: F.displayBold, fontSize: 24, fontWeight: '700', color: C.ink, marginBottom: 10, textAlign: 'center' }}>{t(lang, 'thankYou')}</Text>
          <Text style={{ fontSize: 14, color: C.mut, textAlign: 'center', lineHeight: 22, marginBottom: 28 }}>{t(lang, 'reviewSubmitted')}</Text>
          <Button full onPress={() => navigation.goBack()}>{t(lang, 'done')}</Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar title={t(lang, 'writeReview')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: 40 }}>
        {/* Nursery header */}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, marginBottom: 22 }}>
          <View style={{ width: 52, height: 52, borderRadius: 14, overflow: 'hidden' }}>
            <NurseryImage src={n?.img} seed={nurseryId} radius={14} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: F.displayBold, fontSize: 17, fontWeight: '700', color: C.ink, marginBottom: 2, textAlign: isRTL ? 'right' : 'left' }}>{n?.name || ''}</Text>
            <Text style={{ fontSize: 12, color: C.green, fontWeight: '600', textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'verifiedBooking')}</Text>
          </View>
        </View>

        {/* Star rating */}
        <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: F.bodyBold, color: C.ink, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'howWasExperience')}</Text>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: 10, marginBottom: 24 }}>
          {[1, 2, 3, 4, 5].map(s => (
            <TouchableOpacity key={s} onPress={() => setStars(s)}>
              <Icon name="star" size={38} color={s <= stars ? C.amber : '#d8ddd3'} fill={s <= stars ? C.amber : 'none'} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Text input */}
        <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: F.bodyBold, color: C.ink, marginBottom: 9, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'tellOtherParents')}</Text>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t(lang, 'reviewPlaceholder')}
          placeholderTextColor={C.mut}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          style={{ borderWidth: 1.5, borderColor: C.line, borderRadius: 14, padding: 14, fontFamily: F.body, fontSize: 14, color: C.ink, marginBottom: 14, minHeight: 120, textAlign: isRTL ? 'right' : 'left' }}
        />

        {/* Add photos button */}
        <TouchableOpacity style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 8, borderWidth: 1.5, borderColor: C.line, borderStyle: 'dashed', borderRadius: 12, padding: 13, backgroundColor: '#fff', alignSelf: isRTL ? 'flex-end' : 'flex-start' }}>
          <Icon name="camera" size={18} color={C.dgreen} />
          <Text style={{ fontFamily: F.bodyBold, fontSize: 13, fontWeight: '600', color: C.dgreen }}>{t(lang, 'addPhotos')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={{ padding: 16, paddingBottom: 26, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button full size="lg" disabled={!stars} onPress={() => setDone(true)}>{t(lang, 'submitReview')}</Button>
      </View>
    </SafeAreaView>
  );
}
