// ponytail: minimal AsyncStorage wrapper for guest onboarding state
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ReflectionData } from '../domain/types';

const ONBOARDING_KEY = 'happy.onboarding';
const COMPLETED_KEY = 'onboarding_completed';

export async function saveLocalReflection(reflection: ReflectionData): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(reflection));
    await AsyncStorage.setItem(COMPLETED_KEY, 'true');
  } catch {
    // ponytail: safe in guest mode if storage fails
  }
}
