import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Animated, Easing } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, RadialGradient, Circle } from 'react-native-svg';

const BackgroundSVG = () => {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const moveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Simulate loading time for gradient rendering
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Start fade-in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.ease,
      }).start();

      // Start subtle mountain movement animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(moveAnim, {
            toValue: 1,
            duration: 20000,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
          Animated.timing(moveAnim, {
            toValue: 0,
            duration: 20000,
            useNativeDriver: true,
            easing: Easing.ease,
          }),
        ])
      ).start();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#64B5F6', // Match sky gradient start color
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
      <Animated.View
        style={{
          transform: [
            {
              translateY: moveAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -5], // Subtle vertical movement
              }),
            },
          ],
        }}
      >
        <Svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <Defs>
            <LinearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#64B5F6" />
              <Stop offset="45%" stopColor="#2196F3" />
              <Stop offset="75%" stopColor="#1976D2" />
              <Stop offset="100%" stopColor="#1565C0" />
            </LinearGradient>
            <LinearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#90CAF9" />
              <Stop offset="100%" stopColor="#64B5F6" />
            </LinearGradient>
            <LinearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#82B1FF" />
              <Stop offset="100%" stopColor="#448AFF" />
            </LinearGradient>
            <RadialGradient id="sunGlow" cx="50%" cy="10%" r="50%" fx="50%" fy="10%">
              <Stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
              <Stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </RadialGradient>
          </Defs>

          {/* Sky background */}
          <Path d="M0 0h1440v900H0z" fill="url(#skyGradient)" />

          {/* Sun glow effect */}
          <Circle cx="720" cy="150" r="100" fill="url(#sunGlow)" />

          {/* Sun */}
          <Circle cx="720" cy="150" r="40" fill="rgba(255, 255, 255, 0.9)" />

          {/* Back mountain - V shape */}
          <Path
            d="M0 900V600L720 300L1440 600V900H0z"
            fill="url(#mountainGradient)"
            opacity="0.5"
          />

          {/* Middle mountain - V shape */}
          <Path
            d="M0 900V700L720 400L1440 700V900H0z"
            fill="url(#mountainGradient2)"
            opacity="0.65"
          />

          {/* Front mountain - V shape */}
          <Path
            d="M0 900V800L720 500L1440 800V900H0z"
            fill="url(#mountainGradient)"
            opacity="0.8"
          />
        </Svg>
      </Animated.View>
    </Animated.View>
  );
};

export default BackgroundSVG;
