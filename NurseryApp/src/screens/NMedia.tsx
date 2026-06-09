import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { TopBar } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NMedia() {
  const navigation = useNavigation<Nav>();
  const { lang } = useN();
  const [tab, setTab] = useState<'photos' | 'video' | 'cover'>('photos');
  const [picked, setPicked] = useState<string[]>([]);
  const photos = Array.from({ length: 9 }).map((_, i) => 'p' + i);
  const toggle = (id: string) => setPicked((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar
        title={t(lang, 'mediaTitle')}
        onBack={() => navigation.goBack()}
        right={
          picked.length === 0 ? (
            <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 999, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setPicked([])}>
              <Text style={{ fontFamily: F.bodyBold, color: C.danger, fontWeight: '700', fontSize: 13 }}>{t(lang, 'delete')}</Text>
            </TouchableOpacity>
          )
        }
      />

      {/* Tab strip */}
      <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 22, paddingBottom: 14 }}>
        {([['photos', `${t(lang, 'photos')} · 9`], ['video', `${t(lang, 'video')} · 1`], ['cover', t(lang, 'cover')]] as const).map(([k, l]) => (
          <TouchableOpacity key={k} onPress={() => setTab(k)} style={{ flex: 1, paddingVertical: 9, borderRadius: 11, alignItems: 'center', backgroundColor: tab === k ? C.header : C.cream }}>
            <Text style={{ fontFamily: F.bodyBold, fontSize: 12.5, fontWeight: '700', color: tab === k ? '#fff' : C.mut }}>{l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {tab === 'photos' && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
            {photos.map((id, i) => (
              <TouchableOpacity key={id} onPress={() => toggle(id)} style={{ width: '31%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', position: 'relative', backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="image" size={28} color={C.dgreen} />
                {picked.includes(id) && <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 3, borderColor: C.green, borderRadius: 12, backgroundColor: '#3f8a5a22' }} />}
                <View style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 999, backgroundColor: picked.includes(id) ? C.green : '#ffffffcc', alignItems: 'center', justifyContent: 'center', borderWidth: picked.includes(id) ? 0 : 1, borderColor: '#fff' }}>
                  {picked.includes(id) && <Icon name="check" size={14} color="#fff" />}
                </View>
                {i === 0 && (
                  <View style={{ position: 'absolute', bottom: 6, left: 6, backgroundColor: '#fff', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 999 }}>
                    <Text style={{ fontSize: 9.5, fontWeight: '800', color: C.dgreen, textTransform: 'uppercase', letterSpacing: 0.5 }}>Cover</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={{ width: '31%', aspectRatio: 1, borderWidth: 1.5, borderColor: C.line, borderStyle: 'dashed', backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={26} color={C.dgreen} />
            </TouchableOpacity>
          </View>
        )}

        {tab === 'video' && (
          <View>
            <View style={{ height: 220, borderRadius: 14, overflow: 'hidden', backgroundColor: '#1c3324', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#1c3324aa' }} />
              <View style={{ width: 60, height: 60, borderRadius: 999, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="play2" size={26} color={C.dgreen} />
              </View>
              <Text style={{ position: 'absolute', bottom: 16, color: '#cfe0cf', fontSize: 13 }}>intro · 0:48</Text>
            </View>
            <Text style={{ marginTop: 12, fontSize: 12.5, color: C.mut, lineHeight: 20 }}>{t(lang, 'videoHint')}</Text>
          </View>
        )}

        {tab === 'cover' && (
          <View>
            <Text style={{ fontSize: 12.5, color: C.mut, marginBottom: 12 }}>{t(lang, 'coverHint')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
              {photos.slice(0, 6).map((id, i) => (
                <View key={id} style={{ width: '31%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', position: 'relative', borderWidth: i === 0 ? 3 : 0, borderColor: C.green }}>
                  <Icon name="image" size={28} color={C.dgreen} />
                  {i === 0 && (
                    <View style={{ position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 999, backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="check" size={14} color="#fff" />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
