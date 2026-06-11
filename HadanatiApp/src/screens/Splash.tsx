import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, LangToggle } from '../components';
import { useApp } from '../context/AppContext';
import { t, Lang } from '../i18n';

const { width: W } = Dimensions.get('window');

const slides = [
  { titleKey: 'slide1Title', bodyKey: 'slide1Body', icon: 'leaf' as const },
  { titleKey: 'slide2Title', bodyKey: 'slide2Body', icon: 'calendar' as const },
  { titleKey: 'slide3Title', bodyKey: 'slide3Body', icon: 'image' as const },
];

function Brand({ light, isRTL }: { light?: boolean; isRTL?: boolean }) {
  return (
    <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: 9 }}>
      <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: light ? '#ffffff22' : C.header, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="leaf" size={22} color={light ? '#fff' : C.cream} />
      </View>
      <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 22, color: light ? '#fff' : C.header }}>حضانتي</Text>
    </View>
  );
}

export function SplashScreen({ navigation }: any) {
  const { lang, actions } = useApp();
  const isRTL = lang === 'ar';
  const [idx, setIdx] = useState(0);
  const [uiLang, setUiLang] = useState(lang === 'ar' ? 'ع' : 'EN');
  const scrollRef = useRef<ScrollView>(null);
  const slide = slides[idx];
  const isLast = idx === slides.length - 1;

  const handleLang = (l: string) => {
    setUiLang(l);
    const newLang: Lang = l === 'ع' ? 'ar' : 'en';
    actions.setLang(newLang);
  };

  const goTo = (i: number) => {
    setIdx(i);
    scrollRef.current?.scrollTo({ x: i * W, animated: true });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIdx = Math.round(e.nativeEvent.contentOffset.x / W);
    if (newIdx !== idx) setIdx(newIdx);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      {/* Header */}
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingTop: 4, paddingBottom: 8 }}>
        <Brand isRTL={isRTL} />
        <LangToggle lang={uiLang} onSet={handleLang} />
      </View>

      {/* Swipeable hero cards */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          style={{ flex: 1 }}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {slides.map((sl, i) => (
            <View key={i} style={{ width: W, paddingHorizontal: 26, justifyContent: 'center' }}>
              <View
                style={{ height: 286, borderRadius: 28, backgroundColor: C.header, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', marginBottom: 28 }}
              >
                <View style={{ width: 150, height: 150, borderRadius: 36, backgroundColor: '#ffffff14', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={sl.icon} size={80} color={C.cream} />
                </View>
              </View>

              <Text style={{ fontFamily: F.displayBold, fontSize: 30, fontWeight: '700', color: C.ink, lineHeight: 36, marginBottom: 10, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                {t(lang, sl.titleKey)}
              </Text>
              <Text style={{ fontSize: 14.5, color: C.mut, lineHeight: 22, textAlign: lang === 'ar' ? 'right' : 'left' }}>
                {t(lang, sl.bodyKey)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Dots */}
      <View style={{ flexDirection: 'row', gap: 7, justifyContent: 'center', marginBottom: 22 }}>
        {slides.map((_, k) => (
          <TouchableOpacity key={k} onPress={() => goTo(k)} style={{ height: 7, borderRadius: 999, width: k === idx ? 26 : 7, backgroundColor: k === idx ? C.green : '#d8ddd3' }} />
        ))}
      </View>

      {/* Actions */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 26 }}>
        <Button
          full size="lg"
          iconRight={isLast ? 'arrowRight' : undefined}
          onPress={() => {
            if (isLast) {
              navigation.replace('register');
            } else {
              goTo(idx + 1);
            }
          }}
        >
          {isLast ? t(lang, 'getStarted') : t(lang, 'next')}
        </Button>
        <TouchableOpacity onPress={() => navigation.replace('login')} style={{ marginTop: 14, alignItems: 'center' }}>
          <Text style={{ fontFamily: F.body, fontSize: 13.5, color: C.mut }}>
            {t(lang, 'loginPrompt')}<Text style={{ color: C.dgreen, fontWeight: '700' }}>{t(lang, 'login')}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
