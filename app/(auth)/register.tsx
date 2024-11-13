import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { router } from 'expo-router';

const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [welcomeSnack, setWelcomeSnack] = useState('');
  const { register } = useAuth();

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
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (confirmPass: string) => {
    if (!confirmPass) {
      setConfirmPasswordError('Please confirm your password');
      return false;
    }
    if (confirmPass !== password) {
      setConfirmPasswordError('Passwords do not match');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      return;
    }

    try {
      setIsLoading(true);
      await register(email, password, confirmPassword);
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setWelcomeSnack('Registration successful.');
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
        disabled={isLoading}
        style={styles.input}
        keyboardType='email-address'
        autoCapitalize='none'
        error={!!emailError}
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
        disabled={isLoading}
        style={styles.input}
        error={!!passwordError}
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

      <TextInput
        label='Confirm Password'
        value={confirmPassword}
        onChangeText={text => {
          setConfirmPassword(text);
          validateConfirmPassword(text);
        }}
        secureTextEntry={!showConfirmPassword}
        mode='outlined'
        disabled={isLoading}
        style={styles.input}
        error={!!confirmPasswordError}
        right={
          <TextInput.Icon
            icon={showConfirmPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          />
        }
      />
      <HelperText type='error' visible={!!confirmPasswordError}>
        {confirmPasswordError}
      </HelperText>

      <Button
        mode='contained'
        onPress={handleRegister}
        style={styles.button}
        loading={isLoading}
      >
        Register
      </Button>
      <Text style={styles.text}>Already have an account?</Text>
      <Button
        mode='outlined'
        onPress={() => router.push('/login')}
        style={styles.button}
      >
        Login
      </Button>
      <Snackbar
        visible={!!welcomeSnack}
        icon={'check_circle'}
        onDismiss={() => setWelcomeSnack('')}
        duration={3000}
      >
        {welcomeSnack}
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

export default RegisterScreen;
