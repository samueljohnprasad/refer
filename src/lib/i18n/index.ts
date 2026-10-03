// ponytail: minimal robust i18n setup with expo-localization and async-storage
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

import commonEn from '../../locales/en/common.json';
import homeEn from '../../locales/en/home.json';
import exercisesEn from '../../locales/en/exercises.json';
import journalEn from '../../locales/en/journal.json';
import habitsEn from '../../locales/en/habits.json';
import settingsEn from '../../locales/en/settings.json';

import commonFr from '../../locales/fr/common.json';
import homeFr from '../../locales/fr/home.json';
import settingsFr from '../../locales/fr/settings.json';

import commonEs from '../../locales/es/common.json';
import homeEs from '../../locales/es/home.json';
import settingsEs from '../../locales/es/settings.json';

import commonDe from '../../locales/de/common.json';
import homeDe from '../../locales/de/home.json';
import settingsDe from '../../locales/de/settings.json';

import commonAr from '../../locales/ar/common.json';
import homeAr from '../../locales/ar/home.json';
import settingsAr from '../../locales/ar/settings.json';

import commonPt from '../../locales/pt/common.json';
import homePt from '../../locales/pt/home.json';
import settingsPt from '../../locales/pt/settings.json';

import commonIt from '../../locales/it/common.json';
import homeIt from '../../locales/it/home.json';
import settingsIt from '../../locales/it/settings.json';

import commonZh from '../../locales/zh/common.json';
import homeZh from '../../locales/zh/home.json';
import settingsZh from '../../locales/zh/settings.json';

export const LANGUAGE_STORAGE_KEY = '@happy/language';
export const CDN_BASE = 'https://cdn.happy.app/locales';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es', 'ar', 'pt', 'it', 'zh'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: readonly SupportedLanguage[] = ['ar'] as const;

export function getDeviceLanguage(): SupportedLanguage {
  const locales = Localization.getLocales();
  const tag = locales[0]?.languageCode ?? 'en';
  const lang = tag.split('-')[0].toLowerCase();
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)
    ? (lang as SupportedLanguage)
    : 'en';
}

export function applyRTL(lang: SupportedLanguage): void {
  const isRTL = RTL_LANGUAGES.includes(lang);
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
}

export async function initI18n(): Promise<void> {
  if (i18n.isInitialized) {
    return;
  }

  let savedLang: SupportedLanguage | null = null;
  try {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)) {
      savedLang = stored as SupportedLanguage;
    }
  } catch (error) {
    console.warn('[i18n] Failed reading saved language from storage', error);
  }

  const lng: SupportedLanguage = savedLang ?? getDeviceLanguage();
  applyRTL(lng);

  await i18n
    .use(initReactI18next)
    .init({
      lng,
      fallbackLng: 'en',
      supportedLngs: [...SUPPORTED_LANGUAGES],
      ns: ['common', 'home', 'exercises', 'journal', 'habits', 'settings'],
      defaultNS: 'common',
      compatibilityJSON: 'v4',
      resources: {
        en: {
          common: commonEn,
          home: homeEn,
          exercises: exercisesEn,
          journal: journalEn,
          habits: habitsEn,
          settings: settingsEn,
        },
        fr: { common: commonFr, home: homeFr, settings: settingsFr, exercises: {}, journal: {}, habits: {} },
        es: { common: commonEs, home: homeEs, settings: settingsEs, exercises: {}, journal: {}, habits: {} },
        de: { common: commonDe, home: homeDe, settings: settingsDe, exercises: {}, journal: {}, habits: {} },
        ar: { common: commonAr, home: homeAr, settings: settingsAr, exercises: {}, journal: {}, habits: {} },
        pt: { common: commonPt, home: homePt, settings: settingsPt, exercises: {}, journal: {}, habits: {} },
        it: { common: commonIt, home: homeIt, settings: settingsIt, exercises: {}, journal: {}, habits: {} },
        zh: { common: commonZh, home: homeZh, settings: settingsZh, exercises: {}, journal: {}, habits: {} },
      },
      partialBundledLanguages: true,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      saveMissing: __DEV__,
      missingKeyHandler: (lngs: readonly string[], ns: string, key: string): void => {
        if (__DEV__) {
          console.warn(`[i18n] Missing key: ${ns}:${key} [${lngs.join(',')}]`);
        }
      },
    });
}

export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch (error) {
    console.warn('[i18n] Failed to persist language', error);
  }
  applyRTL(lang);
  await i18n.changeLanguage(lang);
}

export async function clearLanguagePreference(): Promise<void> {
  try {
    await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
  } catch (error) {
    console.warn('[i18n] Failed to clear language preference', error);
  }
  await changeLanguage(getDeviceLanguage());
}

export { i18n };
