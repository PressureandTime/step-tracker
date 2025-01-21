import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RegistrationScreen from './src/screens/RegistrationScreen';
import { StepCounter } from './src/components/StepCounter';
import { ProfilePage } from './src/pages/ProfilePage/ProfilePage';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <View style={styles.container}>
        <RegistrationScreen />
        {/* <StepCounter /> */}
        {/* <ProfilePage /> */}
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});
