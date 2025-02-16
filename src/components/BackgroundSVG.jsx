import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const BackgroundSVG = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for gradient rendering
    const timer = setTimeout(() => {
      setIsLoading(false);
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
          backgroundColor: '#fff', // Add white background to make spinner visible
        }}
      >
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
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
      </Defs>

      {/* Sky background */}
      <Path d="M0 0h1440v900H0z" fill="url(#skyGradient)" />

      {/* Back mountain - V shape */}
      <Path d="M0 900V600L720 300L1440 600V900H0z" fill="url(#mountainGradient)" opacity="0.5" />

      {/* Middle mountain - V shape */}
      <Path d="M0 900V700L720 400L1440 700V900H0z" fill="url(#mountainGradient)" opacity="0.65" />

      {/* Front mountain - V shape */}
      <Path d="M0 900V800L720 500L1440 800V900H0z" fill="url(#mountainGradient)" opacity="0.8" />
    </Svg>
  );
};

export default BackgroundSVG;
