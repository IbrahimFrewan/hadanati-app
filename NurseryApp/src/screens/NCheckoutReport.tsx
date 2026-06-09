import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, TopBar, Pill, Sheet, AvatarPlaceholder } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

function toMin(time: string) {
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i);
  if (!m) return 0;
  let h = +m[1], mm = +m[2];
  if (m[3]) { const pm = /pm/i.test(m[3]); if (pm && h < 12) h += 12; if (!pm && h === 12) h = 0; }
  return h * 60 + mm;
}
function fmtDur(min: number) {
  if (min < 0) min += 24 * 60;
  const h = Math.floor(min / 60), m = min % 60;
  return (h > 0 ? `${h}h ` : '') + `${m}m`;
}

export function NCheckoutReport() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'NCheckoutReport'>>();
  const { lang, store, actions } = useN();
  const child = store.roster.find((k) => k.id === route.params.childId) || store.roster[0];
  const now = '4:18 PM';

  const [pickupTime] = useState(now);
  const [pickupBy, setPickupBy] = useState(child.parent);
  const [verifyMethod, setVerifyMethod] = useState<'id' | 'qr' | 'known'>('id');
  const [showVerify, setShowVerify] = useState(false);
  const [mood, setMood] = useState('happy');
  const [meals, setMeals] = useState({ breakfast: 'all', lunch: 'most', snack: 'all' });
  const [napStart, setNapStart] = useState('12:30');
  const [napEnd, setNapEnd] = useState('13:55');
  const [diapers, setDiapers] = useState(2);
  const [activities, setActivities] = useState(['Garden play', 'Story time']);
  const [photos, setPhotos] = useState([0, 1, 2]);
  const [note, setNote] = useState(`${child.name.split(' ')[0]} had a wonderful day! Enjoyed garden play and made a friend at story time.`);
  const [signing, setSigning] = useState(false);

  const ACT_OPTIONS = ['Garden play', 'Story time', 'Painting', 'Music', 'Sensory', 'Outdoor', 'Blocks', 'Reading'];
  const MOODS: [string, string, string][] = [['happy', 'Happy', '#2f7a44'], ['calm', 'Calm', '#2f6ab0'], ['fussy', 'Fussy', '#b06d22']];
  const ATE = ['none', 'some', 'most', 'all'];
  const VERIFY = { id: ['ID checked', 'shield'], qr: ['QR scanned', 'qrScan'], known: ['Recognised', 'user'] } as const;

  const napDur = fmtDur(toMin(napEnd) - toMin(napStart));
  const stayDur = fmtDur(toMin(pickupTime) - toMin(child.inAt || '8:30'));
  const togAct = (v: string) => setActivities((a) => a.includes(v) ? a.filter((x) => x !== v) : [...a, v]);

  const send = () => {
    setSigning(true);
    setTimeout(() => {
      actions.checkOut(child.id);
      navigation.replace('NCheckoutDone', { childId: child.id, time: pickupTime, by: pickupBy, stay: stayDur });
    }, 900);
  };

  const Section = ({ icon, title, sub, children }: { icon: string; title: string; sub?: string; children: React.ReactNode }) => (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <View style={{ width: 26, height: 26, borderRadius: 8, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon as any} size={14} color={C.dgreen} />
        </View>
        <Text style={{ fontFamily: F.displayBold, fontSize: 15.5, fontWeight: '700', color: C.ink, flex: 1 }}>{title}</Text>
        {sub && <Text style={{ fontSize: 11, color: C.mut }}>{sub}</Text>}
      </View>
      {children}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.page }}>
      <RNStatusBar barStyle="dark-content" />
      <TopBar title={t(lang, 'checkOutTitle')} subtitle={`${child.name} · ${child.group}`} onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Pickup hero */}
        <View style={{ backgroundColor: C.header, borderRadius: 18, padding: 17, marginBottom: 18, overflow: 'hidden', position: 'relative' }}>
          <View style={{ position: 'absolute', top: -28, right: -28, width: 130, height: 130, borderRadius: 65, backgroundColor: '#ffffff10' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 }}>
            <Icon name="clock" size={13} color="#ffffffbb" />
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#ffffffbb' }}>{t(lang, 'pickup')}</Text>
          </View>
          <Text style={{ fontFamily: F.displayExtraBold, fontSize: 38, fontWeight: '800', color: C.cream, letterSpacing: -0.5, lineHeight: 42, marginBottom: 2 }}>{pickupTime}</Text>
          <Text style={{ fontSize: 12.5, color: '#ffffffcc', marginBottom: 14 }}>
            In nursery {child.inAt || '8:30'} → {pickupTime} · <Text style={{ fontWeight: '700' }}>{stayDur}</Text>
          </Text>
          <View style={{ backgroundColor: '#ffffff18', borderRadius: 12, padding: 9, flexDirection: 'row', alignItems: 'center', gap: 11 }}>
            <AvatarPlaceholder size={36} tone="#cfa274" />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10.5, color: '#ffffffbb', fontWeight: '600' }}>{t(lang, 'pickedUpBy')}</Text>
              <Text style={{ fontFamily: F.displayBold, fontSize: 15, fontWeight: '700', color: '#fff' }}>{pickupBy}</Text>
            </View>
            <TouchableOpacity onPress={() => setShowVerify(true)} style={{ backgroundColor: '#ffffff22', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Icon name={VERIFY[verifyMethod][1] as any} size={12} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 11.5, fontWeight: '600' }}>{VERIFY[verifyMethod][0]}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Child header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <AvatarPlaceholder size={46} tone="#cba47a" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 15.5, color: C.ink }}>{child.name}</Text>
            <Text style={{ fontSize: 11.5, color: C.mut }}>{child.age} · {child.group}{child.note ? ` · ${child.note}` : ''}</Text>
          </View>
          {child.note ? <View style={{ width: 26, height: 26, borderRadius: 999, backgroundColor: '#fbe9e4', alignItems: 'center', justifyContent: 'center' }}><Icon name="alert" size={13} color="#b06d22" /></View> : null}
        </View>

        {/* Divider */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: C.line }} />
          <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 12, color: C.mut, textTransform: 'uppercase', letterSpacing: 0.6 }}>{t(lang, 'todaysReport')}</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: C.line }} />
        </View>

        <Section icon="smile" title={t(lang, 'mood')}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {MOODS.map(([k, l, c]) => {
              const on = mood === k;
              return (
                <TouchableOpacity key={k} onPress={() => setMood(k)} style={{ flex: 1, paddingVertical: 11, borderRadius: 12, borderWidth: 1.5, borderColor: on ? c : C.line, backgroundColor: on ? c + '1f' : '#fff', alignItems: 'center' }}>
                  <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 13.5, color: on ? c : C.ink }}>{l}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Section>

        <Section icon="meal" title={t(lang, 'meals')}>
          {Object.entries(meals).map(([meal, val]) => (
            <View key={meal} style={{ marginBottom: 9 }}>
              <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.ink, textTransform: 'capitalize', marginBottom: 5 }}>{meal}</Text>
              <View style={{ flexDirection: 'row', gap: 5 }}>
                {ATE.map((a) => {
                  const on = val === a;
                  return (
                    <TouchableOpacity key={a} onPress={() => setMeals({ ...meals, [meal]: a })} style={{ flex: 1, paddingVertical: 7, borderRadius: 9, borderWidth: 1.5, borderColor: on ? C.green : C.line, backgroundColor: on ? C.tint : '#fff', alignItems: 'center' }}>
                      <Text style={{ fontFamily: F.bodyBold, fontWeight: '700', fontSize: 12, color: on ? C.dgreen : C.ink, textTransform: 'capitalize' }}>{a}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </Section>

        <Section icon="sleep" title={t(lang, 'nap')} sub={napDur}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <View style={{ flex: 1, borderWidth: 1.5, borderColor: C.line, borderRadius: 12, padding: 9 }}>
              <Text style={{ fontSize: 11, color: C.mut, marginBottom: 2 }}>{t(lang, 'start')}</Text>
              <TextInput value={napStart} onChangeText={setNapStart} style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 15, color: C.ink, padding: 0 }} />
            </View>
            <View style={{ flex: 1, borderWidth: 1.5, borderColor: C.line, borderRadius: 12, padding: 9 }}>
              <Text style={{ fontSize: 11, color: C.mut, marginBottom: 2 }}>{t(lang, 'end')}</Text>
              <TextInput value={napEnd} onChangeText={setNapEnd} style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 15, color: C.ink, padding: 0 }} />
            </View>
          </View>
        </Section>

        <Section icon="drop" title={t(lang, 'diapers')} sub={`${diapers} change${diapers === 1 ? '' : 's'}`}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: C.line, borderRadius: 12, padding: 9 }}>
            <TouchableOpacity onPress={() => setDiapers(Math.max(0, diapers - 1))} style={{ width: 32, height: 32, borderRadius: 999, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="minus" size={16} color={C.ink} />
            </TouchableOpacity>
            <Text style={{ flex: 1, textAlign: 'center', fontFamily: F.displayBold, fontSize: 22, fontWeight: '800', color: C.ink }}>{diapers}</Text>
            <TouchableOpacity onPress={() => setDiapers(diapers + 1)} style={{ width: 32, height: 32, borderRadius: 999, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="plus" size={16} color={C.dgreen} />
            </TouchableOpacity>
          </View>
        </Section>

        <Section icon="play" title={t(lang, 'activities')} sub={`${activities.length} chosen`}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {ACT_OPTIONS.map((a) => <Pill key={a} active={activities.includes(a)} onPress={() => togAct(a)}>{a}</Pill>)}
          </View>
        </Section>

        <Section icon="image" title="Photos" sub={`${photos.length}/6`}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {photos.map((p) => (
              <View key={p} style={{ width: 72, height: 72, borderRadius: 11, backgroundColor: C.tint, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="image" size={24} color={C.dgreen} />
                <TouchableOpacity onPress={() => setPhotos(photos.filter((x) => x !== p))} style={{ position: 'absolute', top: 4, right: 4, width: 20, height: 20, borderRadius: 999, backgroundColor: '#1c3324cc', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="x" size={11} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
            {photos.length < 6 && (
              <TouchableOpacity onPress={() => setPhotos([...photos, photos.length + 9])} style={{ width: 72, height: 72, borderRadius: 11, borderWidth: 1.5, borderColor: C.line, borderStyle: 'dashed', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="camera" size={20} color={C.dgreen} />
              </TouchableOpacity>
            )}
          </View>
        </Section>

        <Section icon="chat" title={t(lang, 'noteToParent')} sub={`${note.length}/300`}>
          <TextInput
            value={note}
            onChangeText={(v) => setNote(v.slice(0, 300))}
            multiline
            numberOfLines={3}
            style={{ borderWidth: 1.5, borderColor: C.line, borderRadius: 14, padding: 12, fontFamily: F.body, fontSize: 13.5, color: C.ink, minHeight: 80, textAlignVertical: 'top' }}
          />
        </Section>
      </ScrollView>

      <View style={{ paddingHorizontal: 22, paddingVertical: 11, paddingBottom: 22, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <Button full size="lg" disabled={signing} iconRight={signing ? undefined : 'check'} onPress={send}>
          {signing ? t(lang, 'signingOut') : t(lang, 'signOutSend')}
        </Button>
      </View>

      {/* Verify sheet */}
      <Sheet open={showVerify} onClose={() => setShowVerify(false)} title={t(lang, 'confirmPickup')} height={480}>
        <Text style={{ fontSize: 13, color: C.mut, lineHeight: 21, marginBottom: 14 }}>Choose how you verified the person picking up {child.name.split(' ')[0]}.</Text>
        {([['qr', t(lang, 'scannedQr'), t(lang, 'mostSecure')], ['id', t(lang, 'checkedId'), t(lang, 'approvedGuardian')], ['known', t(lang, 'recognised'), t(lang, 'dailyCaregiver')]] as const).map(([k, l, sub]) => {
          const on = verifyMethod === k;
          return (
            <TouchableOpacity key={k} onPress={() => setVerifyMethod(k as any)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginBottom: 8, borderWidth: 1.5, borderColor: on ? C.green : C.line, backgroundColor: on ? C.tint : '#fff', borderRadius: 14 }}>
              <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: on ? C.green : C.cream, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={VERIFY[k][1] as any} size={18} color={on ? '#fff' : C.dgreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: F.displayBold, fontWeight: '700', fontSize: 14, color: C.ink }}>{l}</Text>
                <Text style={{ fontSize: 11.5, color: C.mut, marginTop: 1 }}>{sub}</Text>
              </View>
              {on && <Icon name="checkCircle" size={20} color={C.green} />}
            </TouchableOpacity>
          );
        })}
        <Text style={{ fontSize: 11.5, color: C.mut, fontWeight: '600', marginTop: 10, marginBottom: 6 }}>{t(lang, 'nameOnRecord')}</Text>
        <TextInput value={pickupBy} onChangeText={setPickupBy} style={{ borderWidth: 1.5, borderColor: C.line, borderRadius: 12, padding: 11, fontFamily: F.body, fontSize: 14, color: C.ink, backgroundColor: '#fff', marginBottom: 14 }} />
        <Button full onPress={() => setShowVerify(false)}>Confirm</Button>
      </Sheet>
    </View>
  );
}
