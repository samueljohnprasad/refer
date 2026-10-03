// ponytail: clean language switcher hook with reactive isRTL state and reactive language state
import { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  changeLanguage,
  clearLanguagePreference,
  type SupportedLanguage,
  RTL_LANGUAGES,
  LANGUAGE_STORAGE_KEY,
} from '@/src/lib/i18n';

export interface UseLanguageReturn {
  currentLanguage: string;
  isCustomLanguage: boolean;
  isRTL: boolean;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  resetToDeviceLanguage: () => Promise<void>;
}

export function useLanguage(): UseLanguageReturn {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => i18n.language || 'en');
  const [isCustomLanguage, setIsCustomLanguage] = useState<boolean>(false);
  const [isRTL, setIsRTL] = useState<boolean>(() =>
    RTL_LANGUAGES.includes((i18n.language || 'en') as SupportedLanguage)
  );

  useEffect(() => {
    let isMounted = true;
    void AsyncStorage.getItem(LANGUAGE_STORAGE_KEY).then((stored) => {
      if (isMounted) {
        setIsCustomLanguage(Boolean(stored));
      }
    });

    const handleLanguageChanged = (lng: string): void => {
      setCurrentLanguage(lng);
      setIsRTL(RTL_LANGUAGES.includes(lng as SupportedLanguage));
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      isMounted = false;
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const setLanguage = useCallback(
    async (lang: SupportedLanguage): Promise<void> => {
      await changeLanguage(lang);
      setCurrentLanguage(lang);
      setIsCustomLanguage(true);
      setIsRTL(RTL_LANGUAGES.includes(lang));
    },
    []
  );

  const resetToDeviceLanguage = useCallback(async (): Promise<void> => {
    await clearLanguagePreference();
    setCurrentLanguage(i18n.language);
    setIsCustomLanguage(false);
    setIsRTL(RTL_LANGUAGES.includes(i18n.language as SupportedLanguage));
  }, [i18n]);

  return {
    currentLanguage,
    isCustomLanguage,
    isRTL,
    setLanguage,
    resetToDeviceLanguage,
  };
}
