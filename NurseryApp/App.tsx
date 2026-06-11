import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, Baloo2_500Medium, Baloo2_700Bold, Baloo2_800ExtraBold } from '@expo-google-fonts/baloo-2';
import { Rubik_400Regular, Rubik_500Medium, Rubik_700Bold } from '@expo-google-fonts/rubik';
import { Cairo_400Regular, Cairo_500Medium, Cairo_700Bold, Cairo_800ExtraBold } from '@expo-google-fonts/cairo';
import { NurseryProvider } from './src/context/NurseryContext';
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
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.header }}>
        <ActivityIndicator color={C.cream} size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NurseryProvider>
          <RootNavigator />
        </NurseryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
