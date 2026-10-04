// ponytail: language preference and actual native layout direction
import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { I18nManager } from 'react-native';
import {
  changeLanguage,
  clearLanguagePreference,
  getStoredLanguagePreference,
  type SupportedLanguage,
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
  const preferenceReadVersion = useRef(0);

  useEffect(() => {
    let isMounted = true;
    const readVersion = preferenceReadVersion.current;
    void getStoredLanguagePreference()
      .then((stored) => {
        if (isMounted && readVersion === preferenceReadVersion.current) {
          setIsCustomLanguage(Boolean(stored));
        }
      })
      .catch((error) => console.warn('[i18n] Failed reading language preference', error));

    const handleLanguageChanged = (lng: string): void => {
      setCurrentLanguage(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      isMounted = false;
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const setLanguage = useCallback(
    async (lang: SupportedLanguage): Promise<void> => {
      preferenceReadVersion.current += 1;
      await changeLanguage(lang);
      setCurrentLanguage(lang);
      setIsCustomLanguage(true);
    },
    []
  );

  const resetToDeviceLanguage = useCallback(async (): Promise<void> => {
    preferenceReadVersion.current += 1;
    await clearLanguagePreference();
    setCurrentLanguage(i18n.language);
    setIsCustomLanguage(false);
  }, [i18n]);

  return {
    currentLanguage,
    isCustomLanguage,
    isRTL: I18nManager.isRTL,
    setLanguage,
    resetToDeviceLanguage,
  };
}
