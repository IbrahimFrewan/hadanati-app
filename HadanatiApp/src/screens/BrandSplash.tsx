import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
import { F } from '../theme';

const { width: W, height: H } = Dimensions.get('window');
const GREEN = '#8ea870';
const WHITE = 'rgba(255,255,255,1)';
const WHITE_DIM = 'rgba(255,255,255,0.35)';

// Programmatic Hadanati logo: house outline + heart + leaves + sparkle dots
function HadanatiLogo({ size = 120 }: { size?: number }) {
  const s = size / 100; // scale factor (designed at 100 units)
  const w = (n: number) => n * s;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Sparkle dots */}
      <View style={{ position: 'absolute', top: w(10), left: w(50) - w(3.2), width: w(6.4), height: w(6.4), borderRadius: w(3.2), backgroundColor: WHITE }} />
      <View style={{ position: 'absolute', top: w(15), left: w(36), width: w(4.8), height: w(4.8), borderRadius: w(2.4), backgroundColor: WHITE_DIM }} />
      <View style={{ position: 'absolute', top: w(15), right: w(36), width: w(4.8), height: w(4.8), borderRadius: w(2.4), backgroundColor: WHITE_DIM }} />

      {/* Roof - two diagonal lines meeting at a peak */}
      {/* Left roof side */}
      <View style={{
        position: 'absolute', top: w(24), left: w(22),
        width: w(36), height: w(6),
        backgroundColor: WHITE,
        borderRadius: w(3),
        transform: [{ rotate: '36deg' }, { translateY: w(8) }],
      }} />
      {/* Right roof side */}
      <View style={{
        position: 'absolute', top: w(24), right: w(22),
        width: w(36), height: w(6),
        backgroundColor: WHITE,
        borderRadius: w(3),
        transform: [{ rotate: '-36deg' }, { translateY: w(8) }],
      }} />

      {/* House walls - left */}
      <View style={{ position: 'absolute', top: w(42), left: w(24), width: w(6), height: w(38), borderRadius: w(3), backgroundColor: WHITE }} />
      {/* House walls - right */}
      <View style={{ position: 'absolute', top: w(42), right: w(24), width: w(6), height: w(38), borderRadius: w(3), backgroundColor: WHITE }} />
      {/* House walls - bottom */}
      <View style={{ position: 'absolute', top: w(74), left: w(24), right: w(24), height: w(6), borderRadius: w(3), backgroundColor: WHITE }} />

      {/* Heart */}
      <View style={{ position: 'absolute', top: w(47), left: w(50) - w(14), width: w(28), height: w(22), alignItems: 'center' }}>
        {/* Left bulge */}
        <View style={{ position: 'absolute', top: 0, left: 0, width: w(14), height: w(14), borderRadius: w(7), backgroundColor: WHITE }} />
        {/* Right bulge */}
        <View style={{ position: 'absolute', top: 0, right: 0, width: w(14), height: w(14), borderRadius: w(7), backgroundColor: WHITE }} />
        {/* Bottom point (diamond/rotated square) */}
        <View style={{ position: 'absolute', top: w(7), left: 0, right: 0, height: w(15), backgroundColor: WHITE, transform: [{ rotate: '45deg' }], borderRadius: w(2) }} />
      </View>

      {/* Left leaf */}
      <View style={{ position: 'absolute', bottom: w(12), left: w(25), width: w(14), height: w(24), borderRadius: w(7), backgroundColor: WHITE, transform: [{ rotate: '-20deg' }] }} />
      {/* Right leaf */}
      <View style={{ position: 'absolute', bottom: w(12), right: w(25), width: w(14), height: w(24), borderRadius: w(7), backgroundColor: WHITE, transform: [{ rotate: '20deg' }] }} />
    </View>
  );
}

// Decorative dot pattern background
function DotPattern() {
  const dots = [];
  const spacing = 38;
  const cols = Math.ceil(W / spacing) + 2;
  const rows = Math.ceil(H / spacing) + 2;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <View
          key={`${r}-${c}`}
          style={{
            position: 'absolute',
            top: r * spacing - 10,
            left: c * spacing - 10,
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: 'rgba(255,255,255,0.12)',
          }}
        />
      );
    }
  }
  return <View style={StyleSheet.absoluteFillObject} pointerEvents="none">{dots}</View>;
}

export function BrandSplashScreen({ navigation }: any) {
  const scale = useRef(new Animated.Value(0.7)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence: dots fade → logo scale+fade → text fade → hold → exit
    Animated.sequence([
      Animated.timing(dotOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, friction: 5, tension: 60, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(1200),
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(textOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(dotOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start(() => {
      navigation.replace('splash');
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: GREEN, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={{ opacity: dotOpacity, ...StyleSheet.absoluteFillObject }}>
        <DotPattern />
      </Animated.View>

      <Animated.View style={{ transform: [{ scale }], opacity, alignItems: 'center' }}>
        <HadanatiLogo size={160} />
      </Animated.View>

      <Animated.View style={{ opacity: textOpacity, alignItems: 'center', marginTop: 24 }}>
        <Text style={{ fontFamily: F.displayBold, fontSize: 38, fontWeight: '700', color: WHITE, letterSpacing: 1 }}>حضانتي</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', marginTop: 4, letterSpacing: 2 }}>HADANATI</Text>
      </Animated.View>
    </View>
  );
}
