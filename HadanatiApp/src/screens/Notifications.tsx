import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';
import { t } from '../i18n';

const KIND: Record<string, [string, string, string]> = {
  report:     ['image',       '#2f7a44', '#e4f1e6'],
  attendance: ['checkCircle', '#2f6ab0', '#e3eefb'],
  payment:    ['wallet',      '#6b7568', '#eef0ec'],
  emergency:  ['alert',       '#c2543c', '#fbe9e4'],
};

export function NotificationsScreen({ navigation }: any) {
  const { store, lang, actions } = useApp();
  const isRTL = lang === 'ar';

  useEffect(() => {
    const id = setTimeout(() => actions.readNotifs(), 1200);
    return () => clearTimeout(id);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.page }}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', paddingHorizontal: 22, paddingTop: 6, paddingBottom: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 26, fontWeight: '700', color: C.ink }}>{t(lang, 'notifications')}</Text>
        <TouchableOpacity onPress={() => actions.readNotifs()}>
          <Text style={{ fontFamily: F.bodyBold, fontSize: 12.5, fontWeight: '600', color: C.dgreen }}>{t(lang, 'markAllRead')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={store.notifications}
        keyExtractor={n => n.id}
        contentContainerStyle={{ paddingHorizontal: 22, paddingBottom: 96, gap: 10 }}
        renderItem={({ item: nt }) => {
          const [ic, fg, bg] = KIND[nt.kind] || KIND.report;
          const emerg = nt.kind === 'emergency';
          return (
            <TouchableOpacity
              onPress={() => nt.target && navigation.navigate(nt.target, { childId: 'c1' })}
              activeOpacity={nt.target ? 0.7 : 1}
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                gap: 12,
                padding: 14,
                borderRadius: 16,
                borderWidth: emerg ? 1.5 : 1,
                borderColor: emerg ? fg + '55' : C.line,
                backgroundColor: emerg ? bg : nt.read ? '#fff' : '#fbfdfb',
              }}
            >
              <View style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={ic as any} size={19} color={fg} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', gap: 8 }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '700', fontFamily: F.bodyBold, color: emerg ? fg : C.ink, flex: 1 }}>{nt.title}</Text>
                  <Text style={{ fontSize: 10.5, color: C.mut }}>{nt.time}</Text>
                </View>
                <Text style={{ fontSize: 12.5, color: emerg ? '#8a3d2c' : C.mut, marginTop: 3, lineHeight: 18 }}>{nt.body}</Text>
              </View>
              {!nt.read && (
                <View style={{ position: 'absolute', top: 16, right: isRTL ? undefined : 14, left: isRTL ? 14 : undefined, width: 8, height: 8, borderRadius: 4, backgroundColor: C.green }} />
              )}
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
}
