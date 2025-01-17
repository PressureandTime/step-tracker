import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { registerUser, confirmAccountActivation, testApiRequest } from '../api/auth';
import Modal from 'react-native-modal';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  message: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  errorMessage: {
    backgroundColor: '#FFE5E5',
    color: '#D8000C',
  },
  successMessage: {
    backgroundColor: '#DFF2BF',
    color: '#4F8A10',
  },
  modal: {
    margin: 0,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },
  privacyPolicyContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 10,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
  },
  privacyPolicyText: {
    fontSize: 14,
    color: '#333',
  },
});

export default RegistrationScreen;
