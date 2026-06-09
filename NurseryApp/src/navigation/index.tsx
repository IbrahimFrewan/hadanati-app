import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { useN } from '../context/NurseryContext';

// Screens
import { NLogin } from '../screens/NLogin';
import { NRegister } from '../screens/NRegister';
import { NKyc } from '../screens/NKyc';
import { NApproval } from '../screens/NApproval';
import { Dashboard } from '../screens/Dashboard';
import { Attendance } from '../screens/Attendance';
import { NCheckoutReport } from '../screens/NCheckoutReport';
import { NCheckoutDone } from '../screens/NCheckoutDone';
import { NRequests } from '../screens/NRequests';
import { NRequestDetail } from '../screens/NRequestDetail';
import { NCalendar } from '../screens/NCalendar';
import { NProfile } from '../screens/NProfile';
import { NMedia } from '../screens/NMedia';
import { NCapacity } from '../screens/NCapacity';
import { NReports } from '../screens/NReports';
import { NReportCompose } from '../screens/NReportCompose';
import { NBilling } from '../screens/NBilling';
import { NSettlements } from '../screens/NSettlements';
import { NAnalytics } from '../screens/NAnalytics';
import { NMessages } from '../screens/NMessages';
import { NProfileAccount } from '../screens/NProfileAccount';

export type RootStackParamList = {
  NLogin: undefined;
  NRegister: undefined;
  NKyc: undefined;
  NApproval: undefined;
  MainTabs: undefined;
  Attendance: undefined;
  NCheckoutReport: { childId: string };
  NCheckoutDone: { childId: string; time: string; by: string; stay: string };
  NRequests: undefined;
  NRequestDetail: { id: string };
  NCalendar: undefined;
  NProfile: undefined;
  NMedia: undefined;
  NCapacity: undefined;
  NReports: undefined;
  NReportCompose: { childId: string };
  NBilling: undefined;
  NSettlements: undefined;
  NAnalytics: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function CustomTabBar({ state, descriptors, navigation }: any) {
  const { store } = useN();
  const insets = useSafeAreaInsets();
  const pending = store.requests.filter((r) => r.status === 'pending').length;
  const msgs = store.threads.reduce((a, t) => a + t.unread, 0);

  const tabs = [
    { key: 'DashboardTab', label: 'Home', icon: 'home' },
    { key: 'AttendanceTab', label: 'Attendance', icon: 'users' },
    { key: 'RequestsTab', label: 'Requests', icon: 'bell' },
    { key: 'MessagesTab', label: 'Inbox', icon: 'chat' },
    { key: 'AccountTab', label: 'Account', icon: 'user' },
  ];
  const badges: Record<string, number> = { RequestsTab: pending, MessagesTab: msgs };

  return (
    <View style={{
      flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.96)',
      borderTopWidth: 1, borderTopColor: C.line,
      paddingTop: 10, paddingBottom: insets.bottom + 10,
      paddingHorizontal: 12,
    }}>
      {state.routes.map((route: any, index: number) => {
        const focused = state.index === index;
        const tab = tabs[index];
        const badge = badges[route.name] || 0;
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={{ flex: 1, alignItems: 'center', gap: 3, position: 'relative' }}
          >
            <Icon name={tab.icon as any} size={23} color={focused ? C.header : C.mut} fill={focused ? C.tint : 'none'} />
            <Text style={{ fontSize: 10, fontWeight: focused ? '700' : '500', color: focused ? C.header : C.mut, fontFamily: focused ? F.bodyBold : F.body }}>{tab.label}</Text>
            {badge > 0 && (
              <View style={{
                position: 'absolute', top: -2, right: '50%', marginRight: -18,
                minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 999,
                backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center',
                borderWidth: 2, borderColor: '#fff',
              }}>
                <Text style={{ color: '#fff', fontSize: 9.5, fontWeight: '700' }}>{badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="DashboardTab" component={Dashboard} />
      <Tab.Screen name="AttendanceTab" component={Attendance} />
      <Tab.Screen name="RequestsTab" component={NRequests} />
      <Tab.Screen name="MessagesTab" component={NMessages} />
      <Tab.Screen name="AccountTab" component={NProfileAccount} />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { store } = useN();
  const isApproved = store.approvalStatus === 'approved';

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="NLogin" component={NLogin} />
        <Stack.Screen name="NRegister" component={NRegister} />
        <Stack.Screen name="NKyc" component={NKyc} />
        <Stack.Screen name="NApproval" component={NApproval} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Attendance" component={Attendance} />
        <Stack.Screen name="NCheckoutReport" component={NCheckoutReport} />
        <Stack.Screen name="NCheckoutDone" component={NCheckoutDone} />
        <Stack.Screen name="NRequests" component={NRequests} />
        <Stack.Screen name="NRequestDetail" component={NRequestDetail} />
        <Stack.Screen name="NCalendar" component={NCalendar} />
        <Stack.Screen name="NProfile" component={NProfile} />
        <Stack.Screen name="NMedia" component={NMedia} />
        <Stack.Screen name="NCapacity" component={NCapacity} />
        <Stack.Screen name="NReports" component={NReports} />
        <Stack.Screen name="NReportCompose" component={NReportCompose} />
        <Stack.Screen name="NBilling" component={NBilling} />
        <Stack.Screen name="NSettlements" component={NSettlements} />
        <Stack.Screen name="NAnalytics" component={NAnalytics} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
