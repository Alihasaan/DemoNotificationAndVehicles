import React, { createContext, useState, useContext, useEffect } from 'react';
import PocketBase from 'pocketbase';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

interface AuthContextData {
  isAuthenticated: boolean;
  user: any;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    passwordConfirm: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const pb = new PocketBase('http://10.0.2.2:8090'); // Replace with your PocketBase URL http://127.0.0.1:8090 , http://10.0.2.2:8090

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('authToken');
      const storedModel = await SecureStore.getItemAsync('authModel');

      if (storedToken && storedModel) {
        pb.authStore.save(storedToken, JSON.parse(storedModel));
        setIsAuthenticated(true);
        setUser(JSON.parse(storedModel));
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveAuthToStorage = async (token: string, model: any) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
      await SecureStore.setItemAsync('authModel', JSON.stringify(model));
    } catch (error) {
      console.error('Error saving auth to storage:', error);
    }
  };

  const clearAuthStorage = async () => {
    try {
      await SecureStore.deleteItemAsync('authToken');
      await SecureStore.deleteItemAsync('authModel');
    } catch (error) {
      console.error('Error clearing auth storage:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const authData = await pb
        .collection('users')
        .authWithPassword(email, password);
      setIsAuthenticated(true);
      setUser(authData.record);
      await saveAuthToStorage(pb.authStore.token, authData.record);
    } catch (error: any) {
      if (error.status === 400) {
        throw new Error('Invalid email or password');
      } else if (error.status === 404) {
        throw new Error('User does not exist');
      } else {
        throw new Error(
          'Unable to connect to the server. Please try again later.',
        );
      }
    }
  };

  const register = async (
    email: string,
    password: string,
    passwordConfirm: string,
  ) => {
    try {
      const user = await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
      });
      await login(email, password);
    } catch (error: any) {
      if (error.response?.data?.email?.code === 'validation.unique') {
        throw new Error('Email already exists');
      } else if (error.status === 400) {
        throw new Error('Invalid registration data');
      } else {
        throw new Error('Registration failed. Please try again later.');
      }
    }
  };

  const logout = async () => {
    pb.authStore.clear();
    setIsAuthenticated(false);
    setUser({});
    await clearAuthStorage();
    router.replace('/login');
  };

  if (isLoading) {
    return null; // Or return a loading spinner component
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
