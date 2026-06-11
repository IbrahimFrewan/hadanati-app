import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Baloo2_500Medium,
  Baloo2_700Bold,
  Baloo2_800ExtraBold,
} from '@expo-google-fonts/baloo-2';
import {
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
} from '@expo-google-fonts/rubik';
import {
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_700Bold,
  Cairo_800ExtraBold,
} from '@expo-google-fonts/cairo';

import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation';
import { C } from './src/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Baloo2_500Medium,
    Baloo2_700Bold,
    Baloo2_800ExtraBold,
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_700Bold,
    Cairo_800ExtraBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: C.header, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={C.cream} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AppProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </AppProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
