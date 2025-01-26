import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import 'react-native-devsettings';
import AuthStack from './src/navigation/AuthStack';
import { enableScreens } from 'react-native-screens';
import { startNetworkLogging } from 'react-native-network-logger';
import { FloatingDevButton } from './src/components/DevTools/FloatingDevButton';

// Enable Hermes debugging
if (__DEV__) {
  require('react-devtools-core').connectToDevTools({
    host: 'localhost',
    port: 8097,
  });
  // Start network logging in development mode
  startNetworkLogging();
}

enableScreens();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'always',
    },
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <AuthStack />
            </NavigationContainer>
          </QueryClientProvider>
          {__DEV__ && <FloatingDevButton />}
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
