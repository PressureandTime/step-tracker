import React, { useEffect } from 'react';
import { View, SafeAreaView } from 'react-native';


export const NetworkLogScreen = () => {
  useEffect(() => {
    // Start network logging when the component mounts

    return () => {
      // Optional cleanup if needed
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>

    </SafeAreaView>
  );
};
