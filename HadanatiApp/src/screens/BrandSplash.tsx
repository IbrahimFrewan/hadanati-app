import React, { useEffect, useRef } from 'react';
import { View, Animated, Dimensions, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const { width: W, height: H } = Dimensions.get('window');
const GREEN = '#8ea870';

function DotPattern() {
  const dots = [];
  const spacing = 44;
  const cols = Math.ceil(W / spacing) + 1;
  const rows = Math.ceil(H / spacing) + 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <View
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            top: r * spacing,
            left: c * spacing,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.14)',
          }}
        />
      );
    }
  }
  return <View style={StyleSheet.absoluteFillObject} pointerEvents="none">{dots}</View>;
}

export function BrandSplashScreen({ navigation }: any) {
  const scale = useRef(new Animated.Value(0.78)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(dotOpacity, { toValue: 1, duration: 350, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 65, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      ]),
      Animated.delay(1300),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 280, useNativeDriver: true }),
        Animated.timing(dotOpacity, { toValue: 0, duration: 280, useNativeDriver: true }),
      ]),
    ]).start(() => {
      navigation.replace('splash');
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar style="light" />

      <Animated.View style={{ opacity: dotOpacity, ...StyleSheet.absoluteFillObject }}>
        <DotPattern />
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Image
          source={require('../../assets/logo-white.png')}
          style={{ width: 220, height: 300 }}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
}
