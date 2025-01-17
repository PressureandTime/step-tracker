import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { registerUser, confirmAccountActivation } from '../api/auth';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      if (!recaptchaToken) {
        throw new Error('Please complete the reCAPTCHA verification');
      }
      return registerUser({ ...data, recaptchaToken });
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

  const onRecaptchaVerify = (token) => {
    setRecaptchaToken(token);
    setModalVisible(false);
    registerMutation.mutate({ email, password });
  };

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
    setModalVisible(true);
  };

  const recaptchaHTML = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://www.google.com/recaptcha/api.js" async defer></script>
      </head>
      <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
        <div class="g-recaptcha"
          data-sitekey="6LeXjzMqAAAAAH9K_xefUwbJ0sxc0cp9GCSNAGcU"
          data-callback="onRecaptchaVerified"
          data-size="normal">
        </div>
        <script>
          window.onRecaptchaVerified = function(token) {
            window.ReactNativeWebView.postMessage(token);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        {message ? (
          <Text
            style={[styles.message, message.includes('failed') ? styles.error : styles.success]}
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
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={registerMutation.isPending}
        >
          <Text style={styles.buttonText}>
            {registerMutation.isPending ? 'Registering...' : 'Register'}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <WebView
            source={{ html: recaptchaHTML }}
            onMessage={(event) => {
              onRecaptchaVerify(event.nativeEvent.data);
            }}
            style={styles.webview}
          />
        </View>
      </Modal>
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
  error: {
    backgroundColor: '#FFE5E5',
    color: '#D8000C',
  },
  success: {
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
});

export default RegistrationScreen;
