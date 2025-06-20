import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';

export type StoredAuth = {
  token: string | null;
  user: User | null;
};

export async function saveAuth(auth: StoredAuth): Promise<void> {
  if (auth.token) {
    await AsyncStorage.setItem('token', auth.token);
  } else {
    await AsyncStorage.removeItem('token');
  }
  if (auth.user) {
    await AsyncStorage.setItem('user', JSON.stringify(auth.user));
  } else {
    await AsyncStorage.removeItem('user');
  }
}

export async function loadAuth(): Promise<StoredAuth> {
  const tokenStr: string | null = await AsyncStorage.getItem('token');
  const userStr: string | null = await AsyncStorage.getItem('user');
  let user: User | null = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }
  return {
    token: tokenStr ?? null,
    user,
  };
}

export async function clearAuth(): Promise<void> {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
}
