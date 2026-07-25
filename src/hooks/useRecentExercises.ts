// ponytail: simple async storage list for recent exercises (max 5)
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@recent_exercises';
const MAX_ITEMS = 5;

/**
 * Shared tracker to log exercise completion/access
 */
export const trackRecentExercise = async (exerciseId: string): Promise<void> => {
  try {
    const currentJSON = await AsyncStorage.getItem(STORAGE_KEY);
    let currentList: string[] = currentJSON ? JSON.parse(currentJSON) : [];
    
    currentList = currentList.filter((id: string) => id !== exerciseId);
    currentList.unshift(exerciseId);
    currentList = currentList.slice(0, MAX_ITEMS);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentList));
  } catch (error) {
    console.error('Failed to track recent exercise:', error);
  }
};

/**
 * Hook to read recent exercise IDs from storage on mount
 */
export const useRecentExercises = (): { recentIds: string[] } => {
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchRecent = async (): Promise<void> => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          setRecentIds(JSON.parse(json));
        }
      } catch (error) {
        console.error('Failed to fetch recent exercises:', error);
      }
    };
    
    fetchRecent();
  }, []);

  return { recentIds };
};
