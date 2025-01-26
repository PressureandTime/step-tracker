import React, { useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';
import NetworkLogger, { startNetworkLogging } from 'react-native-network-logger';

export const NetworkLogScreen = () => {
  useEffect(() => {
    // Start network logging when the component mounts
    startNetworkLogging();
    return () => {
      // Optional cleanup if needed
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <NetworkLogger />
      </View>
    </SafeAreaView>
  );
};
