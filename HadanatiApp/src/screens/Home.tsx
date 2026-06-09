import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal, FlatList, TextInput,
} from 'react-native';
import Svg, { Defs, LinearGradient as SVGGrad, Stop, Rect as SVGRect } from 'react-native-svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { SectionTitle, NurseryImage, AvatarImage, AvailBadge, Rating } from '../components';
import { useApp } from '../context/AppContext';
import { NURSERIES, DISTRICTS } from '../data';
import { t } from '../i18n';

function CardGradient({ height }: { height: number }) {
  return (
    <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height }} pointerEvents="none">
      <Svg height={height} width="100%" preserveAspectRatio="none">
        <Defs>
          <SVGGrad id="cg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0.3" stopColor="#000000" stopOpacity={0} />
            <Stop offset="1" stopColor="#1a3322" stopOpacity={0.85} />
          </SVGGrad>
        </Defs>
        <SVGRect x="0" y="0" width="100%" height={height} fill="url(#cg)" />
      </Svg>
    </View>
  );
}

function FavBtn({ id }: { id: string }) {
  const { store, actions } = useApp();
  const on = store.favorites.includes(id);
  return (
    <TouchableOpacity onPress={() => actions.toggleFav(id)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="heart" size={17} color={on ? C.danger : C.mut} fill={on ? C.danger : 'none'} />
    </TouchableOpacity>
  );
}

function FeatureCard({ n, big, onPress }: { n: typeof NURSERIES[0]; big?: boolean; onPress: () => void }) {
  const { lang } = useApp();
  return (
    <TouchableOpacity onPress={onPress} style={{ width: big ? '100%' : 268, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.line, backgroundColor: '#fff' }}>
      <View style={{ height: big ? 168 : 138, position: 'relative' }}>
        <NurseryImage src={n.img} seed={n.id} radius={0} />
        <CardGradient height={big ? 168 : 138} />
        {n.sponsored && (
          <View style={{ position: 'absolute', top: 13, left: 13, backgroundColor: C.amber, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 9 }}>
            <Text style={{ color: '#3a2c08', fontSize: 9.5, fontWeight: '800', letterSpacing: 0.8, textTransform: 'uppercase' }}>{t(lang, 'sponsored')}</Text>
          </View>
        )}
        <View style={{ position: 'absolute', top: 11, right: 11 }}><FavBtn id={n.id} /></View>
        <View style={{ position: 'absolute', left: 14, right: 14, bottom: 12, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: F.displayBold, fontSize: big ? 22 : 18, fontWeight: '700', color: '#fff', lineHeight: big ? 26 : 22, marginBottom: 3 }}>{n.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="star" size={14} color={C.amber} fill={C.amber} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#fff' }}>{n.rating} · {n.district}</Text>
            </View>
          </View>
          <AvailBadge avail={n.avail} label={t(lang, n.avail)} />
        </View>
      </View>
      <View style={{ padding: 12, paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 12.5, color: C.mut }}>{n.tag}</Text>
        <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '800', color: C.dgreen }}>{n.priceFrom}<Text style={{ fontSize: 11, fontWeight: '600', color: C.mut }}> JD/{n.unit}</Text></Text>
      </View>
    </TouchableOpacity>
  );
}

function ListRow({ n, onPress }: { n: typeof NURSERIES[0]; onPress: () => void }) {
  const { lang } = useApp();
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', gap: 14, paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: C.line }}>
      <View style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 14, overflow: 'hidden' }}>
        <NurseryImage src={n.img} seed={n.id} radius={14} />
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
          <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '600', color: C.ink, flex: 1 }} numberOfLines={1}>{n.name}</Text>
          <Text style={{ fontFamily: F.displayBold, fontSize: 15, fontWeight: '800', color: C.dgreen, whiteSpace: 'nowrap' }}>{n.priceFrom}<Text style={{ fontSize: 10.5, color: C.mut, fontWeight: '600' }}> /{n.unit}</Text></Text>
        </View>
        <Text style={{ fontSize: 12, color: C.mut, marginBottom: 7 }}>{n.district} · {n.tag.split(' · ')[0]}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
          <Rating value={n.rating} size={12} />
          <AvailBadge avail={n.avail} label={t(lang, n.avail)} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

function DistrictSheet({ open, district, onPick, onClose }: { open: boolean; district: string; onPick: (d: string) => void; onClose: () => void }) {
  const { lang } = useApp();
  const [q, setQ] = useState('');
  const filtered = q.trim() ? DISTRICTS.filter(d => d.toLowerCase().includes(q.toLowerCase())) : DISTRICTS;
  const isRTL = lang === 'ar';

  if (!open) return null;
  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: '#2b3a2e55' }} onPress={onClose} activeOpacity={1}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', borderRadius: 26, padding: 18, paddingTop: 14, maxHeight: '78%' }}>
          <View style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#e7e2d6', alignSelf: 'center', marginBottom: 16 }} />
          <Text style={{ fontFamily: F.displayBold, fontSize: 19, color: C.ink, marginBottom: 4, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'chooseArea')}</Text>
          <Text style={{ fontSize: 12.5, color: C.mut, marginBottom: 12, textAlign: isRTL ? 'right' : 'left' }}>{t(lang, 'amman')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: C.cream, borderRadius: 12, paddingHorizontal: 13, paddingVertical: 10, marginBottom: 10 }}>
            <Icon name="search" size={17} color={C.mut} />
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={lang === 'ar' ? 'ابحث عن منطقة…' : 'Search areas…'}
              placeholderTextColor={C.mut}
              style={{ flex: 1, fontSize: 14, color: C.ink, fontFamily: F.body, padding: 0, textAlign: isRTL ? 'right' : 'left' }}
            />
            {q.length > 0 && (
              <TouchableOpacity onPress={() => setQ('')}>
                <Icon name="x" size={16} color={C.mut} />
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filtered}
            keyExtractor={d => d}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item: d }) => (
              <TouchableOpacity onPress={() => { onPick(d); setQ(''); }} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 11, paddingVertical: 13, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#ebe5d7' }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: d === district ? C.green + '1f' : '#f6f3ea', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="pin" size={16} color={d === district ? C.green : C.mut} />
                </View>
                <Text style={{ flex: 1, fontSize: 14.5, color: C.ink, fontWeight: d === district ? '600' : '400', fontFamily: d === district ? F.bodyBold : F.body, textAlign: isRTL ? 'right' : 'left' }}>{d}</Text>
                {d === district && <Icon name="check" size={18} color={C.green} />}
              </TouchableOpacity>
            )}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

export function HomeScreen({ navigation }: any) {
  const { store, lang } = useApp();
  const [district, setDistrict] = useState('Abdoun');
  const [sheet, setSheet] = useState(false);
  const first = (store.user.name || 'there').split(' ')[0];
  const sponsored = NURSERIES.filter(n => n.sponsored);
  const isRTL = lang === 'ar';

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 96 }} showsVerticalScrollIndicator={false}>
        {/* Green header */}
        <View style={{ backgroundColor: C.header, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingHorizontal: 22, paddingBottom: 54, overflow: 'hidden' }}>
          <SafeAreaView edges={['top']}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 22 }}>
              <TouchableOpacity
                onPress={() => setSheet(true)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff1f', borderWidth: 1, borderColor: '#ffffff2e', borderRadius: 999, paddingVertical: 7, paddingHorizontal: 13 }}
              >
                <Icon name="pin" size={16} color={C.cream} />
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.cream, fontFamily: F.bodyBold }}>{district}, Amman</Text>
                <Icon name="chevDown" size={15} color={C.cream} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 9 }}>
                <TouchableOpacity onPress={() => navigation.navigate('notifications')} style={{ position: 'relative', width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: '#ffffff2e', backgroundColor: '#ffffff1f', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="bell" size={20} color={C.cream} />
                  {store.notifications.some(n => !n.read) && (
                    <View style={{ position: 'absolute', top: 9, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: C.amber, borderWidth: 2, borderColor: C.header }} />
                  )}
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('profile')} style={{ width: 42, height: 42, borderRadius: 21, overflow: 'hidden', borderWidth: 1, borderColor: '#ffffff3a' }}>
                  <AvatarImage seed={store.user.name} size={42} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10 }}>
              <View>
                <Text style={{ fontFamily: F.displayBold, fontSize: 29, fontWeight: '700', color: C.cream, lineHeight: 34, letterSpacing: -0.3, textAlign: isRTL ? 'right' : 'left' }}>
                  {t(lang, 'hello')}{first},{'\n'}{t(lang, 'findCare')}
                </Text>
              </View>
              <Icon name="leaf" size={80} color={C.cream} />
            </View>
          </SafeAreaView>
        </View>

        {/* Floating search */}
        <View style={{ paddingHorizontal: 22, marginTop: -28, zIndex: 2 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 9, shadowColor: '#2b3a2e', shadowOpacity: 0.27, shadowRadius: 17, shadowOffset: { width: 0, height: 7 }, elevation: 10, flexDirection: 'row', gap: 9 }}>
            <TouchableOpacity
              onPress={() => navigation.push('results', {})}
              style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 12 }}
            >
              <Icon name="search" size={20} color={C.green} />
              <Text style={{ fontSize: 14.5, color: C.mut, fontFamily: F.body }}>{t(lang, 'searchPlaceholder')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.push('filters', {})}
              style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="sliders" size={21} color="#fff" />
            </TouchableOpacity>
          </View>

        </View>

        <View style={{ paddingHorizontal: 22, paddingTop: 22 }}>
          <SectionTitle title={t(lang, 'featured')} sub={t(lang, 'sponsored')} />
          <View style={{ marginBottom: 28 }}>
            <View style={{ marginBottom: 13 }}>
              <FeatureCard n={sponsored[0]} big onPress={() => navigation.push('nursery', { id: sponsored[0].id })} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -22 }} contentContainerStyle={{ paddingHorizontal: 22, gap: 13 }}>
              {sponsored.slice(1).concat(NURSERIES.filter(n => !n.sponsored).slice(0, 1)).map(n => (
                <FeatureCard key={n.id} n={n} onPress={() => navigation.push('nursery', { id: n.id })} />
              ))}
            </ScrollView>
          </View>

          <SectionTitle title={t(lang, 'nurseriesNearYou')} action={t(lang, 'viewMap')} onAction={() => navigation.push('map', {})} />
          {NURSERIES.map(n => (
            <ListRow key={n.id} n={n} onPress={() => navigation.push('nursery', { id: n.id })} />
          ))}
        </View>
      </ScrollView>

      <DistrictSheet open={sheet} district={district} onPick={d => { setDistrict(d); setSheet(false); }} onClose={() => setSheet(false)} />
    </View>
  );
}
