import React, { useState, useContext } from 'react';
import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { setAuthTokens } from '../../utils/auth';
import { apiClient } from '../../utils/apiClient';
import { styles } from './LoginStyles';
import { AuthContext } from '../../context/AuthContext';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
        const success = await setAuthTokens(data.access_token);
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
      <View style={styles.formContainer}>
        <TextInput
          style={[styles.input, loginMutation.isPending && styles.inputDisabled]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loginMutation.isPending}
        />
        <TextInput
          style={[styles.input, loginMutation.isPending && styles.inputDisabled]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loginMutation.isPending}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={[styles.loginButton, loginMutation.isPending && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
