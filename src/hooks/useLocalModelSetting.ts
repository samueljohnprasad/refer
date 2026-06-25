import { atom, useAtom } from 'jotai';
import { atomWithStorage, createJSONStorage } from 'jotai/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GLOBAL_AI_CONFIG } from '@/src/constants/ai';

// Create a persistence adapter for Jotai using AsyncStorage
const storage = createJSONStorage<string>(() => AsyncStorage);

// This atom will automatically sync with AsyncStorage
export const localModelAtom = atomWithStorage<string>(
  '@local_model_url',
  GLOBAL_AI_CONFIG.LLAMA_MODEL_URL,
  storage
);

export function useLocalModelSetting() {
  const [modelUrl, setModelUrl] = useAtom(localModelAtom);

  // With atomWithStorage, loading state is practically instant, 
  // but we can expose it as false to keep the API compatible.
  return { 
    modelUrl, 
    setModel: setModelUrl, 
    isLoading: false 
  };
}
