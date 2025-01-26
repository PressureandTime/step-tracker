import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../pages/Login/Login';
import BottomTabNavigator from './BottomTabNavigator';
import { AuthContext } from '../context/AuthContext';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={Login} />
      )}
    </Stack.Navigator>
  );
};

export default AuthStack;
