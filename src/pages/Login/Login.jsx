import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import BackgroundSVG from '../../components/BackgroundSVG';
import { useMutation } from '@tanstack/react-query';
import { setAuthTokens } from '../../utils/auth';
import { apiClient } from '../../utils/apiClient';
import { styles } from './LoginStyles';
import { AuthContext } from '../../context/AuthContext';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { setIsAuthenticated } = useContext(AuthContext);

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      console.log('Starting login request...');
      const response = await apiClient.post('/api/login', {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      try {
        console.log('Storing authentication tokens...');
        const success = await setAuthTokens(data?.token);
        if (success) {
          console.log('Authentication successful');
          setIsAuthenticated(true);
        } else {
          setError('Failed to store authentication data');
        }
      } catch (error) {
        console.error('Error in login success handler:', error);
        setError('Failed to complete login process');
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (!error.response) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Login failed. Please try again.');
      }
    },
  });

  const handleLogin = () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    loginMutation.mutate({
      email: email.trim(),
      password: password,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.backgroundImage}>
        <BackgroundSVG />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.title}>Conquer Your Summit</Text>
        <Text style={styles.subtitle}>Ready for your next adventure.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[styles.input, emailFocused && styles.inputFocused]}
            placeholder="Enter your email"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={email}
            onChangeText={setEmail}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={[styles.input, passwordFocused && styles.inputFocused]}
            placeholder="Enter your password"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={password}
            onChangeText={setPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={loginMutation.isLoading}
        >
          <Text style={styles.loginButtonText}>Login</Text>
          {loginMutation.isLoading && (
            <ActivityIndicator style={styles.loadingSpinner} color="#2C5364" size="small" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
