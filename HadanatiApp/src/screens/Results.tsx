import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar, Pill, NurseryImage, AvailBadge, Rating, Verified, EmptyView } from '../components';
import { useApp } from '../context/AppContext';
import { NURSERIES } from '../data';
import { t } from '../i18n';

function FavBtn({ id }: { id: string }) {
  const { store, actions } = useApp();
  const on = store.favorites.includes(id);
  return (
    <TouchableOpacity onPress={() => actions.toggleFav(id)} style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="heart" size={17} color={on ? C.danger : C.mut} fill={on ? C.danger : 'none'} />
    </TouchableOpacity>
  );
}

function ResultCard({ n, onPress }: { n: typeof NURSERIES[0]; onPress: () => void }) {
  const { lang } = useApp();
  const AGE_LABEL: Record<string, string> = { infant: t(lang, 'infant'), toddler: t(lang, 'toddler'), preschool: t(lang, 'preschool') };
  return (
    <TouchableOpacity onPress={onPress} style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 18, overflow: 'hidden', flexShrink: 0 }}>
      <View style={{ height: 132, padding: 11, position: 'relative' }}>
        <View style={{ flex: 1, borderRadius: 14, overflow: 'hidden' }}>
          <NurseryImage src={n.img} seed={n.id} radius={14} />
        </View>
        {n.sponsored && (
          <View style={{ position: 'absolute', top: 17, left: 17, backgroundColor: C.amber, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 9 }}>
            <Text style={{ color: '#3a2c08', fontSize: 9.5, fontWeight: '800' }}>{t(lang, 'sponsored')}</Text>
          </View>
        )}
        <View style={{ position: 'absolute', top: 17, right: 17 }}><FavBtn id={n.id} /></View>
        <View style={{ position: 'absolute', bottom: 17, right: 17 }}><AvailBadge avail={n.avail} label={t(lang, n.avail)} /></View>
      </View>
      <View style={{ paddingTop: 4, paddingBottom: 15, paddingHorizontal: 15 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ fontFamily: F.displayBold, fontSize: 17, fontWeight: '700', color: C.ink, lineHeight: 22, marginBottom: 4 }} numberOfLines={2}>{n.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Rating value={n.rating} count={n.reviews} size={12} />
              {n.verified && <Verified size={11} label={t(lang, 'verified')} />}
            </View>
          </View>
          <View style={{ alignItems: 'flex-end', flexShrink: 0 }}>
            <Text style={{ fontFamily: F.displayBold, fontSize: 17, fontWeight: '800', color: C.dgreen }}>{n.priceFrom} JD</Text>
            <Text style={{ fontSize: 10.5, color: C.mut }}>from / {n.unit === 'mo' ? 'month' : 'hour'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
          {n.ages.map(a => (
            <View key={a} style={{ backgroundColor: C.tint, paddingVertical: 3, paddingHorizontal: 9, borderRadius: 999 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.dgreen }}>{AGE_LABEL[a]}</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginLeft: 'auto' }}>
            <Icon name="pin" size={12} color={C.mut} />
            <Text style={{ fontSize: 11, color: C.mut }}>{n.district} · 2.3 km</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ResultsScreen({ navigation, route }: any) {
  const { lang } = useApp();
  const initAges: string[] = route.params?.ages || [];
  const [ages, setAges] = useState(initAges);
  const [sort, setSort] = useState('distance');
  const [sortSheet, setSortSheet] = useState(false);
  const SORTS: Record<string, string> = {
    distance: t(lang, 'distance'),
    price: t(lang, 'price'),
    rating: t(lang, 'rating'),
    availability: t(lang, 'availability'),
  };
  const AGE_LABEL: Record<string, string> = { infant: t(lang, 'infant'), toddler: t(lang, 'toddler'), preschool: t(lang, 'preschool') };

  let list = NURSERIES.filter(n => ages.length ? n.ages.some(a => ages.includes(a)) : true);
  if (sort === 'price') list = [...list].sort((a, b) => a.priceFrom - b.priceFrom);
  if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <TopBar
        title={t(lang, 'nurseries')}
        subtitle={`${list.length} in Abdoun · Amman`}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity onPress={() => navigation.push('map', {})} style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="mapAlt" size={20} color={C.ink} />
          </TouchableOpacity>
        }
      />

      {/* Search + sort */}
      <View style={{ paddingHorizontal: 18, paddingBottom: 12, flexDirection: 'row', gap: 9 }}>
        <TouchableOpacity onPress={() => navigation.push('filters', {})} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 12, paddingHorizontal: 13, height: 44 }}>
          <Icon name="search" size={18} color={C.mut} />
          <Text style={{ fontSize: 13.5, color: C.mut, fontFamily: F.body }}>{t(lang, 'searchNurseries')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSortSheet(true)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: C.line, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 13, height: 44 }}>
          <Icon name="list" size={16} color={C.mut} />
          <Text style={{ fontFamily: F.bodyBold, fontSize: 13, fontWeight: '600', color: C.ink }}>{SORTS[sort]}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 12, maxHeight: 50 }} contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}>
        <Pill icon="sliders" onPress={() => navigation.push('filters', {})}>{t(lang, 'filters')}</Pill>
        {ages.map(a => (
          <TouchableOpacity key={a} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.tint, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 11 }} onPress={() => setAges(ages.filter(x => x !== a))}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.dgreen, fontFamily: F.bodyBold }}>{AGE_LABEL[a]}</Text>
            <Icon name="x" size={13} color={C.dgreen} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={list}
        keyExtractor={n => n.id}
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 96, gap: 14, paddingTop: 4 }}
        ListEmptyComponent={<EmptyView title={t(lang, 'noMatches')} body={t(lang, 'noMatchesBody')} ctaLabel={t(lang, 'clearFilters')} onCta={() => setAges([])} />}
        renderItem={({ item: n }) => <ResultCard n={n} onPress={() => navigation.push('nursery', { id: n.id })} />}
      />

      {/* Sort sheet */}
      <Modal visible={sortSheet} transparent animationType="slide" onRequestClose={() => setSortSheet(false)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: '#1c281e66' }} onPress={() => setSortSheet(false)} activeOpacity={1}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity activeOpacity={1} style={{ backgroundColor: '#fff', borderRadius: 26, padding: 20, paddingTop: 14 }}>
            <View style={{ width: 40, height: 4, borderRadius: 999, backgroundColor: '#e7e2d6', alignSelf: 'center', marginBottom: 14 }} />
            <Text style={{ fontFamily: F.displayBold, fontSize: 20, fontWeight: '700', color: C.ink, marginBottom: 16 }}>{t(lang, 'sortBy')}</Text>
            {Object.entries(SORTS).map(([k, v]) => (
              <TouchableOpacity key={k} onPress={() => { setSort(k); setSortSheet(false); }} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: C.line }}>
                <Text style={{ fontFamily: sort === k ? F.bodyBold : F.body, fontSize: 15, color: C.ink, fontWeight: sort === k ? '700' : '400' }}>{v}</Text>
                {sort === k && <Icon name="check" size={19} color={C.green} />}
              </TouchableOpacity>
            ))}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
