import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, Field, Toggle, Pill, Rating, Verified, SectionTitle } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SERVICES = ['Meals included', 'CCTV & secure', 'Bilingual', 'Outdoor garden', 'Transport', 'Special needs'];

export function NProfile() {
  const navigation = useNavigation<Nav>();
  const { lang, store, actions } = useN();
  const n = store.nursery;
  const [tagline, setTagline] = useState('A warm, licensed nursery offering outdoor garden play and bilingual care.');
  const [phone, setPhone] = useState(n.phone);
  const [hours, setHours] = useState('7:00 AM – 5:00 PM · Sun–Thu');
  const [services, setServices] = useState(['Meals included', 'CCTV & secure', 'Outdoor garden']);
  const togService = (s: string) => setServices((sv) => sv.includes(s) ? sv.filter((x) => x !== s) : [...sv, s]);

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar
        title={t(lang, 'publicProfile')}
        subtitle={t(lang, 'whatParentsSee')}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity>
            <Text style={{ fontFamily: F.bodyBold, color: C.dgreen, fontWeight: '700', fontSize: 13 }}>{t(lang, 'save')}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 28, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
        {/* Completeness bar */}
        <View style={{ backgroundColor: C.cream, borderRadius: 14, padding: 14, marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 7 }}>
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.ink }}>{t(lang, 'profileCompleteness')}</Text>
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.dgreen }}>82%</Text>
          </View>
          <View style={{ height: 6, borderRadius: 999, backgroundColor: '#e3ddcd', overflow: 'hidden' }}>
            <View style={{ width: '82%', height: '100%', backgroundColor: C.green }} />
          </View>
          <Text style={{ marginTop: 8, fontSize: 11.5, color: C.mut }}>{t(lang, 'addPhotos')}</Text>
        </View>

        {/* Identity card */}
        <View style={{ borderWidth: 1, borderColor: C.line, borderRadius: 18, padding: 15, marginBottom: 18 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 13, marginBottom: 14 }}>
            <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: C.tint, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="leaf" size={26} color={C.dgreen} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: C.ink, marginBottom: 3 }}>{n.name}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Rating value={n.rating} count={n.reviews} size={12} />
                <Verified size={11} />
              </View>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('NMedia')} style={{ width: 36, height: 36, borderRadius: 999, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="camera" size={17} color={C.mut} />
            </TouchableOpacity>
          </View>
          <Field label={t(lang, 'taglineLabel')} value={tagline} onChangeText={setTagline} maxLength={120} hint={`${tagline.length}/120 · keep it warm and specific`} />
        </View>

        <SectionTitle title={t(lang, 'photosVideo')} action={t(lang, 'manage')} onAction={() => navigation.navigate('NMedia')} />
        <View style={{ flexDirection: 'row', gap: 7, marginBottom: 24 }}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={{ flex: 1, aspectRatio: 1, backgroundColor: C.tint, borderRadius: 11, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="image" size={24} color={C.dgreen} />
            </View>
          ))}
          <TouchableOpacity onPress={() => navigation.navigate('NMedia')} style={{ flex: 1, aspectRatio: 1, borderWidth: 1.5, borderColor: C.line, borderStyle: 'dashed', backgroundColor: '#fff', borderRadius: 11, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="plus" size={22} color={C.dgreen} />
          </TouchableOpacity>
        </View>

        <SectionTitle title={t(lang, 'services')} />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {SERVICES.map((s) => <Pill key={s} active={services.includes(s)} onPress={() => togService(s)}>{s}</Pill>)}
        </View>

        <SectionTitle title={t(lang, 'hoursContact')} />
        <Field label={t(lang, 'operatingHours')} value={hours} onChangeText={setHours} icon="clock" />
        <Field label={t(lang, 'phoneShown')} value={phone} onChangeText={setPhone} icon="phone" />
        <Field label={t(lang, 'district')} value={n.district} onChangeText={() => {}} icon="pin" hint={t(lang, 'districtHint')} />

        <SectionTitle title={t(lang, 'listing')} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderWidth: 1, borderColor: C.line, borderRadius: 14 }}>
          <Icon name="globe" size={19} color={C.dgreen} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink }}>{t(lang, 'listedInSearch')}</Text>
            <Text style={{ fontSize: 11.5, color: C.mut, marginTop: 1 }}>{t(lang, 'listedDesc')}</Text>
          </View>
          <Toggle on={n.listed} onChange={(b) => actions.setListed(b)} />
        </View>
      </ScrollView>
    </View>
  );
}
