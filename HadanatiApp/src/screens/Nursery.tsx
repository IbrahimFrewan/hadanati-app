import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Dimensions, FlatList } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, NurseryImage, AvailBadge, Rating, Verified } from '../components';
import { useApp } from '../context/AppContext';
import { NURSERIES, getNursery } from '../data';
import { t } from '../i18n';

const { width: W } = Dimensions.get('window');

const GALLERY_SEEDS = ['a', 'b', 'c', 'd', 'e', 'f'];

function FavBtn({ id, size = 32 }: { id: string; size?: number }) {
  const { store, actions, lang } = useApp();
  const on = store.favorites.includes(id);
  return (
    <TouchableOpacity onPress={() => {
      actions.toggleFav(id);
      actions.showToast(on ? t(lang, 'removedFromFav') : t(lang, 'addedToFav'));
    }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name="heart" size={Math.round(size * 0.52)} color={on ? C.danger : C.mut} fill={on ? C.danger : 'none'} />
    </TouchableOpacity>
  );
}

function GalleryHeader({ n, navigation, isRTL }: { n: typeof NURSERIES[0]; navigation: any; isRTL: boolean }) {
  const [idx, setIdx] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const items = GALLERY_SEEDS.map((s, i) => ({ key: s, img: n.img, seed: n.id + s }));

  return (
    <View style={{ height: 280, position: 'relative' }}>
      <FlatList
        ref={flatRef}
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={it => it.key}
        onMomentumScrollEnd={e => setIdx(Math.round(e.nativeEvent.contentOffset.x / W))}
        renderItem={({ item }) => (
          <View style={{ width: W, height: 280 }}>
            <NurseryImage src={item.img} seed={item.seed} radius={0} />
            <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(28,51,36,0.35)' }} />
          </View>
        )}
      />

      {/* Dot indicators */}
      <View style={{ position: 'absolute', bottom: 50, alignSelf: 'center', flexDirection: 'row', gap: 5 }}>
        {items.map((_, i) => (
          <View key={i} style={{ width: i === idx ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i === idx ? '#fff' : 'rgba(255,255,255,0.5)', transition: 'width 0.2s' as any }} />
        ))}
      </View>

      {/* Nav buttons */}
      <SafeAreaView edges={['top']} style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', padding: 16, paddingTop: 2 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={isRTL ? 'chevRight' : 'chevLeft'} size={22} color={C.ink} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            <TouchableOpacity style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="send" size={19} color={C.ink} />
            </TouchableOpacity>
            <FavBtn id={n.id} size={42} />
          </View>
        </View>
      </SafeAreaView>

      {/* Photo / video pill */}
      <View style={{ position: 'absolute', bottom: 12, right: 12, flexDirection: 'row', gap: 6 }}>
        <TouchableOpacity onPress={() => { flatRef.current?.scrollToIndex({ index: 0, animated: true }); setIdx(0); }}
          style={{ backgroundColor: idx === 0 ? '#fff' : 'rgba(28,51,36,0.8)', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 9 }}>
          <Text style={{ color: idx === 0 ? C.dgreen : '#fff', fontSize: 11, fontWeight: '700' }}>Photos</Text>
        </TouchableOpacity>
        <View style={{ backgroundColor: 'rgba(28,51,36,0.8)', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 9 }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>▶ video</Text>
        </View>
        <View style={{ backgroundColor: 'rgba(28,51,36,0.8)', borderRadius: 999, paddingVertical: 4, paddingHorizontal: 9 }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>{idx + 1}/{items.length}</Text>
        </View>
      </View>
    </View>
  );
}

function Section({ title, children, action, onAction }: { title: string; children: React.ReactNode; action?: string; onAction?: () => void }) {
  return (
    <View style={{ paddingVertical: 20, paddingHorizontal: 22, borderTopWidth: 8, borderTopColor: C.cream }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 18, fontWeight: '700', color: C.ink }}>{title}</Text>
        {action && <TouchableOpacity onPress={onAction}><Text style={{ fontFamily: F.body, color: C.green, fontWeight: '600', fontSize: 12.5 }}>{action}</Text></TouchableOpacity>}
      </View>
      {children}
    </View>
  );
}

function Policy({ icon, title, body }: { icon: string; title: string; body: string }) {
  const [open, setOpen] = useState(false);
  const { lang } = useApp();
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: C.line }}>
      <TouchableOpacity onPress={() => setOpen(!open)} style={{ flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 13 }}>
        <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Icon name={icon as any} size={18} color={C.dgreen} />
        </View>
        <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold, textAlign: lang === 'ar' ? 'right' : 'left' }}>{title}</Text>
        <Icon name={open ? 'chevUp' : 'chevDown'} size={18} color={C.mut} />
      </TouchableOpacity>
      {open && <Text style={{ fontSize: 12.5, color: C.mut, lineHeight: 20, marginBottom: 14, marginLeft: 45, textAlign: lang === 'ar' ? 'right' : 'left' }}>{body}</Text>}
    </View>
  );
}

export function NurseryScreen({ navigation, route }: any) {
  const { lang, actions } = useApp();
  const n = getNursery(route.params?.id) || NURSERIES[0];
  const isRTL = lang === 'ar';
  const insets = useSafeAreaInsets();
  const AGES: Record<string, string> = { infant: t(lang, 'ageGroupInfant'), toddler: t(lang, 'ageGroupToddler'), preschool: t(lang, 'ageGroupPreschool') };

  const plans = [
    { type: 'hourly', label: t(lang, 'hourly'), price: 6, unit: 'hr', note: 'Drop-in, min 2 hours' },
    { type: 'daily', label: t(lang, 'daily'), price: 14, unit: 'day', note: 'Full day 7am–5pm' },
    { type: 'weekly', label: t(lang, 'weekly'), price: 65, unit: 'wk', note: '5 days, meals included' },
    { type: 'monthly', label: t(lang, 'monthly'), price: n.priceFrom, unit: 'mo', note: 'Auto-renews, cancel anytime' },
  ];

  const reviews = [
    { name: 'Rana K.', rating: 5, date: 'May 2026', text: 'The daily photo reports made my first month back at work so much easier. Staff are warm and professional.' },
    { name: 'Omar S.', rating: 5, date: 'Apr 2026', text: 'Clean, safe and genuinely caring. Yara settled in within a week.' },
  ];

  const book = () => {
    actions.setDraft({ nurseryId: n.id, nurseryName: n.name });
    navigation.push('bookType', {});
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 12 }} showsVerticalScrollIndicator={false}>
        <GalleryHeader n={n} navigation={navigation} isRTL={isRTL} />

        {/* Identity */}
        <View style={{ padding: 22, paddingBottom: 4 }}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
            <Text style={{ flex: 1, fontFamily: F.displayBold, fontSize: 25, fontWeight: '700', color: C.ink, lineHeight: 30 }}>{n.name}</Text>
            <View style={{ flexShrink: 0 }}><AvailBadge avail={n.avail} label={t(lang, n.avail)} /></View>
          </View>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
            <Rating value={n.rating} count={n.reviews} size={13} />
            <Verified label={t(lang, 'verified')} />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="pin" size={14} color={C.mut} />
              <Text style={{ fontSize: 12.5, color: C.mut }}>{n.district}</Text>
            </View>
          </View>
          <Text style={{ marginTop: 14, fontSize: 13.5, color: C.mut, lineHeight: 22, textAlign: isRTL ? 'right' : 'left' }}>
            A warm, licensed nursery offering {n.tag.toLowerCase()}. Small group sizes, qualified early-years staff, and a calm, nurturing environment your child will love.
          </Text>
        </View>

        <Section title={t(lang, 'agesAvailability')}>
          <View style={{ gap: 9 }}>
            {n.ages.map((a, i) => (
              <View key={a} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, padding: 13, backgroundColor: C.cream, borderRadius: 12 }}>
                <Icon name="users" size={18} color={C.dgreen} />
                <Text style={{ flex: 1, fontSize: 13.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>{AGES[a]}</Text>
                <AvailBadge avail={i === 0 ? n.avail : 'available'} label={t(lang, i === 0 ? n.avail : 'available')} />
              </View>
            ))}
          </View>
        </Section>

        <Section title={t(lang, 'pricing')}>
          <View style={{ gap: 9 }}>
            {plans.map(p => (
              <View key={p.type} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, padding: 13, borderWidth: 1, borderColor: C.line, borderRadius: 14 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 2, fontFamily: F.bodyBold }}>{p.label}</Text>
                  <Text style={{ fontSize: 11.5, color: C.mut }}>{p.note}</Text>
                </View>
                <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 17, color: C.dgreen }}>{p.price}<Text style={{ fontSize: 11, color: C.mut, fontWeight: '600' }}> JD/{p.unit}</Text></Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t(lang, 'servicesTitle')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
            {[['meal', 'Meals included'], ['users', 'Small groups'], ['shield', 'CCTV & secure'], ['smile', 'Outdoor garden'], ['globe', 'Bilingual'], ['calendar', 'Transport']].map(([ic, l]) => (
              <View key={l} style={{ flexDirection: 'row', alignItems: 'center', gap: 7, backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 999, paddingVertical: 8, paddingHorizontal: 13 }}>
                <Icon name={ic as any} size={15} color={C.dgreen} />
                <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>{l}</Text>
              </View>
            ))}
          </View>
        </Section>

        <Section title={t(lang, 'hoursPolicies')}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, padding: 13, backgroundColor: C.cream, borderRadius: 12, marginBottom: 6 }}>
            <Icon name="clock" size={18} color={C.dgreen} />
            <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>Sun–Thu · 7:00 AM – 5:00 PM</Text>
          </View>
          <Policy icon="info" title="Sick-child policy" body="Children with fever or contagious symptoms must stay home for 24 hours. We'll notify you immediately if your child becomes unwell." />
          <Policy icon="clock" title="Late-pickup policy" body="A 5 JD fee applies for every 15 minutes after closing. Please message us if you're running late." />
          <Policy icon="creditCard" title="Refund & cancellation" body="Cancel up to 48 hours before the start date for a full refund. Monthly plans can be cancelled before the renewal date." />
        </Section>

        <Section title={t(lang, 'location')}>
          <View style={{ height: 150, borderRadius: 14, overflow: 'hidden', backgroundColor: '#e8ece4', position: 'relative' }}>
            <View style={{ position: 'absolute', top: '50%', left: '50%', width: 120, height: 120, borderRadius: 60, backgroundColor: '#3f8a5a22', borderWidth: 1, borderColor: '#3f8a5a66', transform: [{ translateX: -60 }, { translateY: -60 }] }} />
            <View style={{ position: 'absolute', bottom: 10, left: 10, backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 999, paddingVertical: 5, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Icon name="info" size={13} color={C.mut} />
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.mut }}>{t(lang, 'exactAddressAfterBooking')}</Text>
            </View>
          </View>
        </Section>

        <Section title={t(lang, 'reviews')} action={t(lang, 'seeAll')} onAction={() => {}}>
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 34, color: C.ink }}>{n.rating}</Text>
            <View>
              <View style={{ flexDirection: 'row', gap: 1 }}>
                {[0,1,2,3,4].map(i => <Icon key={i} name="star" size={15} color={C.amber} fill={C.amber} />)}
              </View>
              <Text style={{ fontSize: 11.5, color: C.mut, marginTop: 3 }}>{n.reviews}{t(lang, 'verifiedReviews')}</Text>
            </View>
          </View>
          {reviews.map((r, i) => (
            <View key={i} style={{ paddingVertical: 13, borderTopWidth: 1, borderTopColor: C.line }}>
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 14, color: C.dgreen }}>{r.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink, fontFamily: F.bodyBold }}>{r.name}</Text>
                  <Text style={{ fontSize: 11, color: C.mut }}>{r.date} · <Text style={{ color: C.green, fontWeight: '600' }}>{t(lang, 'verifiedBooking')}</Text></Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 1 }}>
                  {Array.from({ length: r.rating }).map((_, k) => <Icon key={k} name="star" size={13} color={C.amber} fill={C.amber} />)}
                </View>
              </View>
              <Text style={{ fontSize: 13, color: C.mut, lineHeight: 20, textAlign: isRTL ? 'right' : 'left' }}>{r.text}</Text>
            </View>
          ))}
        </Section>
      </ScrollView>

      {/* Sticky book bar — above system nav */}
      <View style={{ borderTopWidth: 1, borderTopColor: C.line, backgroundColor: '#fff', paddingTop: 14, paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom, 12) + 8, flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 14 }}>
        <View>
          <Text style={{ fontSize: 11, color: C.mut }}>{t(lang, 'from')}</Text>
          <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 21, color: C.ink }}>{n.priceFrom} JD<Text style={{ fontSize: 12, color: C.mut, fontWeight: '600' }}>/{n.unit}</Text></Text>
        </View>
        <Button full size="lg" disabled={n.avail === 'full'} iconRight="arrowRight" onPress={book} style={{ flex: 1 }}>
          {n.avail === 'full' ? t(lang, 'joinWaitlist') : t(lang, 'bookNow')}
        </Button>
      </View>
    </View>
  );
}
