import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  IconButton,
  Snackbar,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      await login(email, password);
      router.replace('/(tabs)/home');
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label='Email'
        value={email}
        onChangeText={text => {
          setEmail(text);
          validateEmail(text);
        }}
        mode='outlined'
        style={styles.input}
        keyboardType='email-address'
        autoCapitalize='none'
        error={!!emailError}
        disabled={isLoading}
      />
      <HelperText type='error' visible={!!emailError}>
        {emailError}
      </HelperText>

      <TextInput
        label='Password'
        value={password}
        onChangeText={text => {
          setPassword(text);
          validatePassword(text);
        }}
        secureTextEntry={!showPassword}
        mode='outlined'
        style={styles.input}
        error={!!passwordError}
        disabled={isLoading}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
      />
      <HelperText type='error' visible={!!passwordError}>
        {passwordError}
      </HelperText>

      <Button
        mode='contained'
        onPress={handleLogin}
        style={styles.button}
        loading={isLoading}
        disabled={isLoading}
      >
        Login
      </Button>
      <Text style={styles.text}>Don't have an account?</Text>
      <Button
        mode='outlined'
        onPress={() => router.push('/register')}
        style={styles.button}
        disabled={isLoading}
      >
        Register
      </Button>

      <Snackbar
        visible={!!errorMessage}
        onDismiss={() => setErrorMessage('')}
        action={{
          label: 'Close',
          onPress: () => setErrorMessage(''),
        }}
        duration={3000}
      >
        {errorMessage}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 12,
  },
  text: {
    textAlign: 'center',
    marginTop: 16,
  },
});

export default LoginScreen;
