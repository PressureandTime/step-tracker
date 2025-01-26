import AsyncStorage from '@react-native-async-storage/async-storage';

export const setAuthTokens = async (token) => {
  try {
    console.log('token', token);
    console.log('Setting token:', token);
    await AsyncStorage.setItem('token', token);
    return true;
  } catch (error) {
    console.log('Error storing token:', error);
    return false;
  }
};

export const getAuthTokens = async () => {
  const token = await AsyncStorage.getItem('token');
  console.log('Getting stored token:', token);
  return token;
};

export const clearAuthTokens = async () => {
  await AsyncStorage.removeItem('token');
};
