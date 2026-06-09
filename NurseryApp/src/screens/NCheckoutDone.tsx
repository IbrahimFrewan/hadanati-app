import React from 'react';
import { View, Text, StatusBar as RNStatusBar } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { Button, AvatarPlaceholder } from '../components';
import { RootStackParamList } from '../navigation';
import { t } from '../i18n';
import { useN } from '../context/NurseryContext';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function NCheckoutDone() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<RouteProp<RootStackParamList, 'NCheckoutDone'>>();
  const { lang, store } = useN();
  const { childId, time, by, stay } = route.params;
  const child = store.roster.find((k) => k.id === childId) || store.roster[0];

  return (
    <View style={{ flex: 1, backgroundColor: C.header }}>
      <RNStatusBar barStyle="light-content" />
      <View style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: 120, backgroundColor: '#ffffff08' }} />
      <View style={{ position: 'absolute', bottom: 60, left: -40, width: 180, height: 180, borderRadius: 90, backgroundColor: '#ffffff06' }} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
        <View style={{ width: 88, height: 88, borderRadius: 999, backgroundColor: '#ffffff22', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <Icon name="checkCircle" size={52} color={C.cream} />
        </View>

        <Text style={{ fontFamily: F.displayExtraBold, fontSize: 28, color: C.cream, textAlign: 'center', marginBottom: 6 }}>{t(lang, 'checkedOutTitle')}</Text>
        <Text style={{ fontFamily: F.body, fontSize: 14, color: '#ffffffbb', textAlign: 'center', marginBottom: 28 }}>{child.name} · {child.group}</Text>

        <View style={{ backgroundColor: '#ffffff14', borderRadius: 18, padding: 20, width: '100%', borderWidth: 1, borderColor: '#ffffff22', gap: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12.5, color: '#ffffffbb', fontWeight: '600' }}>{t(lang, 'pickup')}</Text>
            <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.cream }}>{time}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: '#ffffff22' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12.5, color: '#ffffffbb', fontWeight: '600' }}>{t(lang, 'pickedUpBy')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <AvatarPlaceholder size={24} tone="#cfa274" />
              <Text style={{ fontFamily: F.bodyBold, fontSize: 14, fontWeight: '600', color: C.cream }}>{by}</Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: '#ffffff22' }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 12.5, color: '#ffffffbb', fontWeight: '600' }}>{t(lang, 'stayDuration')}</Text>
            <Text style={{ fontFamily: F.displayBold, fontSize: 16, fontWeight: '700', color: C.cream }}>{stay}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: '#ffffff22' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="checkCircle" size={16} color={C.tint} />
            <Text style={{ fontSize: 12.5, color: '#ffffffbb', fontWeight: '600' }}>{t(lang, 'reportSent')}</Text>
          </View>
        </View>

        <View style={{ marginTop: 28, width: '100%' }}>
          <Button variant="outline" onPress={() => navigation.navigate('MainTabs')} full size="lg">
            {t(lang, 'backToAttendance')}
          </Button>
        </View>
      </View>
    </View>
  );
}
