import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, Linking } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { registerUser, confirmAccountActivation, testApiRequest } from '../api/auth';
import Modal from 'react-native-modal';
import { styles } from '../styles/RegistrationScreenStyles';

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [testResponse, setTestResponse] = useState(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      console.log('sending request for register');
      if (!recaptchaToken) {
        throw new Error('Please complete the reCAPTCHA verification');
      }
      return registerUser({ ...data, recaptchaToken, privacyPolicyAccepted });
    },
    onSuccess: (data) => {
      setMessage('Registration successful! Please check your email for activation link.');
      console.log('Registration successful, user ID:', data.userId);
    },
    onError: (error) => {
      setMessage('Registration failed: ' + error.message);
      console.error('Registration failed:', error);
    },
  });

  useEffect(() => {
    const handleDeepLink = async (event) => {
      const url = event.url;
      const match = url.match(/\/activate_account\/(\d+)/);
      if (match) {
        const userId = match[1];
        try {
          await confirmAccountActivation(userId);
          setMessage('Account successfully activated!');
        } catch (error) {
          setMessage('Account activation failed: ' + error.message);
        }
      }
    };

    const subscription = Linking.addListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleRegister = () => {
    if (!email || !password) {
      setMessage('Please fill in all fields');
      return;
    }
    if (!privacyPolicyAccepted) {
      setMessage('Please accept the privacy policy to continue');
      return;
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {message ? (
          <Text
            style={[
              styles.message,
              message.includes('failed') ? styles.errorMessage : styles.successMessage,
            ]}
          >
            {message}
          </Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.privacyPolicyContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setPrivacyPolicyAccepted(!privacyPolicyAccepted)}
          >
            <View style={[styles.checkbox, privacyPolicyAccepted && styles.checkboxChecked]}>
              {privacyPolicyAccepted && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.privacyPolicyText}>
              I accept the privacy policy and terms of service
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { marginTop: 10, backgroundColor: '#34C759' }]}
          onPress={async () => {
            try {
              const data = await testApiRequest();
              setTestResponse(`Received ${data.length} posts`);
              console.log('API Test Response:', data);
            } catch (error) {
              setTestResponse('Test failed: ' + error.message);
              console.error('API Test Error:', error);
            }
          }}
        >
          <Text style={styles.buttonText}>Test API Request</Text>
        </TouchableOpacity>

        {testResponse && (
          <Text style={[styles.message, styles.successMessage]}>{testResponse}</Text>
        )}
      </View>
    </View>
  );
};

export default RegistrationScreen;
