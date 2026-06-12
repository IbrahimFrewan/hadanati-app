import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Pill, AvatarPlaceholder } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NReportCompose() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'NReportCompose'>>();
  const { lang, store, actions } = useN();
  const child = store.roster.find((k) => k.id === route.params.childId) || store.roster[0] || ({ id: '', name: '—', group: '' } as any);

  const [mood, setMood] = useState('happy');
  const [meals, setMeals] = useState({ breakfast: 'all', lunch: 'most', snack: 'all' });
  const [napStart, setNapStart] = useState('12:30');
  const [napEnd, setNapEnd] = useState('13:55');
  const [activities, setActivities] = useState(['Garden play', 'Story time']);
  const [photos, setPhotos] = useState([0, 1, 2]);
  const [note, setNote] = useState(`${child.name.split(' ')[0]} had a wonderful day! She loved finger-painting and made a little friend at story time.`);
  const [sending, setSending] = useState(false);

  const ACT_OPTIONS = ['Garden play', 'Story time', 'Painting', 'Music & movement', 'Sensory bins', 'Outdoor', 'Reading corner', 'Blocks'];
  const MOODS: [string, string, string][] = [['happy', 'Happy', '#2f7a44'], ['calm', 'Calm', '#2f6ab0'], ['playful', 'Playful', '#b06d22']];
  const ATE = ['none', 'some', 'most', 'all'];
  const tog = (v: string) => setActivities((a) => a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);

  const Section = ({ icon, title, sub, children }: { icon: string; title: string; sub?: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 22 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 11 }}>
        <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon as any} size={15} color={C.dgreen} />
        </View>
        <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.ink, flex: 1 }}>{title}</Text>
        {sub && <Text style={{ fontSize: 11, color: C.mut }}>{sub}</Text>}
      </View>
      {children}
    </View>
  );

  const send = async () => {
    setSending(true);
    try {
      // Persists to the server (status 'sent', parent gains read access) when
      // a backend is configured; no-op otherwise.
      await actions.sendDailyReport(child.id, {
        mood, meals, napStart, napEnd,
        activities: activities.join(', '), note,
      });
      navigation.replace('NReports');
    } catch (e) {
      console.warn('[report]', e);
      setSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar
        title="Daily report"
        subtitle={`${child.name} · ${child.group}`}
        onBack={() => navigation.goBack()}
        right={
          <TouchableOpacity>
            <Text style={{ fontFamily: F.bodyBold, color: C.dgreen, fontWeight: '700', fontSize: 13 }}>{t(lang, 'saveDraft')}</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24, paddingTop: 8 }} showsVerticalScrollIndicator={false}>
        {/* Child header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, backgroundColor: C.cream, borderRadius: 14, marginBottom: 22 }}>
          <AvatarPlaceholder size={50} tone="#cba47a" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 16, color: C.ink }}>{child.name}</Text>
            <Text style={{ fontSize: 11.5, color: C.mut, marginTop: 1 }}>{child.parent} · {child.age}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Icon name="checkCircle" size={13} color={C.green} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.green }}>In {child.inAt}</Text>
          </View>
        </View>

        <Section icon="smile" title={t(lang, 'mood')}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {MOODS.map(([k, l, c]) => {
              const on = mood === k;
              return (
                <TouchableOpacity key={k} onPress={() => setMood(k)} style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1.5, borderColor: on ? c : C.line, backgroundColor: on ? c + '1f' : '#fff', alignItems: 'center' }}>
                  <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 13.5, color: on ? c : C.ink }}>{l}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section icon="meal" title={t(lang, 'meals')}>
          {Object.entries(meals).map(([meal, val]) => (
            <View key={meal} style={{ marginBottom: 11 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink, textTransform: 'capitalize', marginBottom: 6 }}>{meal}</Text>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {ATE.map((a) => {
                  const on = val === a;
                  return (
                    <TouchableOpacity key={a} onPress={() => setMeals({ ...meals, [meal]: a })} style={{ flex: 1, paddingVertical: 8, borderRadius: 9, borderWidth: 1.5, borderColor: on ? C.green : C.line, backgroundColor: on ? C.tint : '#fff', alignItems: 'center' }}>
                      <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 12, color: on ? C.dgreen : C.ink, textTransform: 'capitalize' }}>{a}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </Section>

        <Section icon="sleep" title={t(lang, 'nap')}>
          <View style={{ flexDirection: 'row', gap: 9 }}>
            <View style={{ flex: 1, borderWidth: 1.5, borderColor: C.line, borderRadius: 12, padding: 10 }}>
              <Text style={{ fontSize: 11, color: C.mut, marginBottom: 3 }}>{t(lang, 'start')}</Text>
              <TextInput value={napStart} onChangeText={setNapStart} style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 16, color: C.ink, padding: 0 }} />
            </View>
            <View style={{ flex: 1, borderWidth: 1.5, borderColor: C.line, borderRadius: 12, padding: 10 }}>
              <Text style={{ fontSize: 11, color: C.mut, marginBottom: 3 }}>{t(lang, 'end')}</Text>
              <TextInput value={napEnd} onChangeText={setNapEnd} style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 16, color: C.ink, padding: 0 }} />
            </View>
            <View style={{ flex: 1, backgroundColor: C.tint, borderRadius: 12, padding: 10 }}>
              <Text style={{ fontSize: 11, color: C.dgreen, fontWeight: '600', marginBottom: 3 }}>{t(lang, 'duration')}</Text>
              <Text style={{ fontFamily: F.displayBold, fontWeight: '800', fontSize: 16, color: C.dgreen }}>1h 25m</Text>
            </View>
          </View>
        </Section>

        <Section icon="play" title={t(lang, 'activities')} sub={`${activities.length} selected`}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
            {ACT_OPTIONS.map((a) => <Pill key={a} active={activities.includes(a)} onPress={() => tog(a)}>{a}</Pill>)}
          </View>
        </Section>

        <Section icon="image" title="Photos" sub={`${photos.length}/8`}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
            {photos.map((p, i) => (
              <View key={p} style={{ width: 72, height: 72, borderRadius: 11, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <Icon name="image" size={24} color={C.dgreen} />
                <TouchableOpacity onPress={() => setPhotos(photos.filter((x) => x !== p))} style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 999, backgroundColor: '#1c3324cc', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="x" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 8 && (
              <TouchableOpacity onPress={() => setPhotos([...photos, photos.length])} style={{ width: 72, height: 72, borderRadius: 11, borderWidth: 1.5, borderColor: C.line, borderStyle: 'dashed', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="plus" size={22} color={C.dgreen} />
              </TouchableOpacity>
            )}
          </View>
        </Section>

        <Section icon="chat" title={t(lang, 'noteToParent')} sub={`${note.length}/300`}>
          <TextInput
            value={note}
            onChangeText={(v) => setNote(v.slice(0, 300))}
            multiline
            numberOfLines={4}
            placeholder="A warm note about your child's day…"
            placeholderTextColor={C.mut}
            style={{ borderWidth: 1.5, borderColor: C.line, borderRadius: 14, padding: 13, fontFamily: F.body, fontSize: 13.5, color: C.ink, minHeight: 100, textAlignVertical: 'top' }}
          />
        </Section>
      </ScrollView>

      <View style={{ paddingHorizontal: 22, paddingVertical: 12, paddingBottom: 26, borderTopWidth: 1, borderTopColor: C.line }}>
        <Button full size="lg" disabled={sending} iconRight={sending ? undefined : 'send'} onPress={send}>
          {sending ? t(lang, 'sendingToParent') : t(lang, 'sendToParent')}
        </Button>
      </View>
    </View>
  );
}
