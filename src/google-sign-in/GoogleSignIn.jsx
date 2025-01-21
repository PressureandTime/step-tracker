import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// // Initialize Google Sign-In
// GoogleSignin.configure({
//   webClientId: '1023700507024-qovl7t6dijqjio8p868toj91e1q7i134.apps.googleusercontent.com',
// });

GoogleSignin.configure({
  iosClientId: '1023700507024-qovl7t6dijqjio8p868toj91e1q7i134.apps.googleusercontent.com',
});

const GoogleSignInButton = () => {
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info:', userInfo);
      // Handle successful sign-in here
      // You can send this data to your backend or handle it as needed
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Operation is in progress already');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available or outdated');
      } else {
        console.error('Error:', error);
      }
    }
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: '#4285F4',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
      }}
      onPress={signIn}
    >
      <Text style={{ color: 'white', textAlign: 'center' }}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;
