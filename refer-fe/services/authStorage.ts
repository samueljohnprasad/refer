import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';
import api from './api';

export type StoredAuth = {
  token: string | null;
  user: User | null;
};

export async function saveAuth(auth: StoredAuth): Promise<void> {
  // Save token to both AsyncStorage and our centralized API service
  if (auth.token) {
    await AsyncStorage.setItem('token', auth.token);
    // Set token in the API service for all future requests
    api.setToken(auth.token);
  } else {
    await AsyncStorage.removeItem('token');
    api.clearToken();
  }
  
  // Save user data
  if (auth.user) {
    await AsyncStorage.setItem('user', JSON.stringify(auth.user));
  } else {
    await AsyncStorage.removeItem('user');
  }
}

export async function loadAuth(): Promise<StoredAuth> {
  const tokenStr: string | null = await AsyncStorage.getItem('token');
  const userStr: string | null = await AsyncStorage.getItem('user');
  
  // Parse user data
  let user: User | null = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }
  
  // Set token in the API service if it exists
  if (tokenStr) {
    api.setToken(tokenStr);
  }
  
  return {
    token: tokenStr ?? null,
    user,
  };
}

export async function clearAuth(): Promise<void> {
  // Clear from both AsyncStorage and our centralized API service
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
  
  // Clear token from the API service
  api.clearToken();
}
