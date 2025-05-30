import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-devsettings';
import AuthStack from './src/navigation/AuthStack';
import { enableScreens } from 'react-native-screens';

import { FloatingDevButton } from './src/components/DevTools/FloatingDevButton';
import { AuthProvider, AuthContext } from './src/context/AuthContext';

// Enable Hermes debugging
if (__DEV__) {
  require('react-devtools-core').connectToDevTools({
    host: 'localhost',
    port: 8097,
  });

}

enableScreens();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      networkMode: 'always',
    },
  },
});

function AppContent() {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
      {__DEV__ && <FloatingDevButton />}
    </>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </QueryClientProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
