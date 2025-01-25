import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { View } from 'react-native';
import { RegistrationScreen } from './src/screens/RegistrationScreen';
import 'react-native-devsettings';

// Required for react-native-screens
import { enableScreens } from 'react-native-screens';
enableScreens();

const queryClient = new QueryClient();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <BottomTabNavigator />
            </NavigationContainer>
          </QueryClientProvider>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
