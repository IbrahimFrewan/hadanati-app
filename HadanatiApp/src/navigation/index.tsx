import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C, F } from '../theme';
import { Icon } from '../components/Icon';
import { useApp } from '../context/AppContext';

// Screens
import { BrandSplashScreen } from '../screens/BrandSplash';
import { SplashScreen } from '../screens/Splash';
import { LoginScreen } from '../screens/Login';
import { RegisterScreen } from '../screens/Register';
import { OtpScreen } from '../screens/Otp';
import { ProfileSetupScreen } from '../screens/ProfileSetup';
import { HomeScreen } from '../screens/Home';
import { ResultsScreen } from '../screens/Results';
import { FiltersScreen } from '../screens/Filters';
import { MapScreen } from '../screens/Map';
import { NurseryScreen } from '../screens/Nursery';
import { BookTypeScreen } from '../screens/BookType';
import { ScheduleScreen } from '../screens/Schedule';
import { CheckoutScreen } from '../screens/Checkout';
import { ConfirmScreen } from '../screens/Confirm';
import { BookingsScreen } from '../screens/Bookings';
import { ChildrenScreen } from '../screens/Children';
import { ReportFeedScreen } from '../screens/ReportFeed';
import { ReportDetailScreen } from '../screens/ReportDetail';
import { MessagesScreen } from '../screens/Messages';
import { NotificationsScreen } from '../screens/Notifications';
import { ReviewScreen } from '../screens/Review';
import { AllReviewsScreen } from '../screens/AllReviews';
import { ProfileScreen } from '../screens/Profile';
import { SupportScreen } from '../screens/Support';
import { t } from '../i18n';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { store, lang } = useApp();
  const unread = store.notifications.filter(n => !n.read).length;
  const msgs = store.threads.reduce((a, th) => a + th.unread, 0);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: {
        backgroundColor: 'rgba(255,255,255,0.97)', borderTopWidth: 1, borderTopColor: C.line,
        paddingTop: 10, paddingBottom: 20, height: 74,
      }}}
      tabBar={(props) => <CustomTabBar {...props} unread={unread} msgs={msgs} lang={lang} />}
    >
      <Tab.Screen name="home" component={HomeScreen} />
      <Tab.Screen name="bookings" component={BookingsScreen} />
      <Tab.Screen name="messages" component={MessagesScreen} />
      <Tab.Screen name="notifications" component={NotificationsScreen} />
      <Tab.Screen name="profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function CustomTabBar({ state, navigation, unread, msgs, lang }: any) {
  const insets = useSafeAreaInsets();
  const items = [
    { name: 'home', icon: 'home', label: t(lang, 'home') },
    { name: 'bookings', icon: 'calendar', label: t(lang, 'bookings') },
    { name: 'messages', icon: 'chat', label: t(lang, 'messages') },
    { name: 'notifications', icon: 'bell', label: t(lang, 'alerts') },
    { name: 'profile', icon: 'user', label: t(lang, 'profile') },
  ];
  const badge: Record<string, number> = { notifications: unread, messages: msgs };
  const bottomPad = Math.max(insets.bottom, 8) + 10;

  return (
    <View style={{ flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.97)', borderTopWidth: 1, borderTopColor: C.line, paddingTop: 10, paddingBottom: bottomPad }}>
      {items.map((item, idx) => {
        const focused = state.index === idx;
        const b = badge[item.name] || 0;
        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => navigation.navigate(item.name)}
            style={{ flex: 1, alignItems: 'center', gap: 3, position: 'relative' }}
          >
            <Icon name={item.icon as any} size={23} color={focused ? C.header : C.mut} fill={focused ? C.tint : 'none'} />
            <Text style={{ fontSize: 10, fontWeight: focused ? '700' : '500', color: focused ? C.header : C.mut, fontFamily: focused ? F.bodyBold : F.body }}>{item.label}</Text>
            {b > 0 && (
              <View style={{ position: 'absolute', top: -2, right: '50%', marginRight: -16, minWidth: 16, height: 16, paddingHorizontal: 4, borderRadius: 999, backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff' }}>
                <Text style={{ color: '#fff', fontSize: 9.5, fontWeight: '700' }}>{b}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: C.page } }}>
      <Stack.Screen name="brandSplash" component={BrandSplashScreen} options={{ cardStyle: { backgroundColor: '#8ea870' } }} />
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="login" component={LoginScreen} />
      <Stack.Screen name="register" component={RegisterScreen} />
      <Stack.Screen name="otp" component={OtpScreen} />
      <Stack.Screen name="profileSetup" component={ProfileSetupScreen} />
      <Stack.Screen name="tabs" component={TabNavigator} />
      <Stack.Screen name="results" component={ResultsScreen} />
      <Stack.Screen name="filters" component={FiltersScreen} />
      <Stack.Screen name="map" component={MapScreen} />
      <Stack.Screen name="nursery" component={NurseryScreen} />
      <Stack.Screen name="bookType" component={BookTypeScreen} />
      <Stack.Screen name="schedule" component={ScheduleScreen} />
      <Stack.Screen name="checkout" component={CheckoutScreen} />
      <Stack.Screen name="confirm" component={ConfirmScreen} />
      <Stack.Screen name="children" component={ChildrenScreen} />
      <Stack.Screen name="reportFeed" component={ReportFeedScreen} />
      <Stack.Screen name="reportDetail" component={ReportDetailScreen} />
      <Stack.Screen name="review" component={ReviewScreen} />
      <Stack.Screen name="allReviews" component={AllReviewsScreen} />
      <Stack.Screen name="support" component={SupportScreen} />
    </Stack.Navigator>
  );
}
