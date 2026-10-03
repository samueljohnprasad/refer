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
import onboardingEn from '../../locales/en/onboarding.json';

import commonFr from '../../locales/fr/common.json';
import homeFr from '../../locales/fr/home.json';
import journalFr from '../../locales/fr/journal.json';
import settingsFr from '../../locales/fr/settings.json';
import onboardingFr from '../../locales/fr/onboarding.json';
import habitsFr from '../../locales/fr/habits.json';

import commonEs from '../../locales/es/common.json';
import homeEs from '../../locales/es/home.json';
import journalEs from '../../locales/es/journal.json';
import settingsEs from '../../locales/es/settings.json';
import onboardingEs from '../../locales/es/onboarding.json';
import habitsEs from '../../locales/es/habits.json';

import commonDe from '../../locales/de/common.json';
import homeDe from '../../locales/de/home.json';
import journalDe from '../../locales/de/journal.json';
import settingsDe from '../../locales/de/settings.json';
import onboardingDe from '../../locales/de/onboarding.json';
import habitsDe from '../../locales/de/habits.json';

import commonAr from '../../locales/ar/common.json';
import homeAr from '../../locales/ar/home.json';
import journalAr from '../../locales/ar/journal.json';
import settingsAr from '../../locales/ar/settings.json';
import onboardingAr from '../../locales/ar/onboarding.json';
import habitsAr from '../../locales/ar/habits.json';

import commonPt from '../../locales/pt/common.json';
import homePt from '../../locales/pt/home.json';
import journalPt from '../../locales/pt/journal.json';
import settingsPt from '../../locales/pt/settings.json';
import onboardingPt from '../../locales/pt/onboarding.json';
import habitsPt from '../../locales/pt/habits.json';

import commonIt from '../../locales/it/common.json';
import homeIt from '../../locales/it/home.json';
import journalIt from '../../locales/it/journal.json';
import settingsIt from '../../locales/it/settings.json';
import onboardingIt from '../../locales/it/onboarding.json';
import habitsIt from '../../locales/it/habits.json';

import commonZh from '../../locales/zh/common.json';
import homeZh from '../../locales/zh/home.json';
import journalZh from '../../locales/zh/journal.json';
import settingsZh from '../../locales/zh/settings.json';
import onboardingZh from '../../locales/zh/onboarding.json';
import habitsZh from '../../locales/zh/habits.json';

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
      ns: ['common', 'home', 'exercises', 'journal', 'habits', 'settings', 'onboarding'],
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
          onboarding: onboardingEn,
        },
        fr: { common: commonFr, home: homeFr, settings: settingsFr, onboarding: onboardingFr, exercises: {}, journal: journalFr, habits: habitsFr },
        es: { common: commonEs, home: homeEs, settings: settingsEs, onboarding: onboardingEs, exercises: {}, journal: journalEs, habits: habitsEs },
        de: { common: commonDe, home: homeDe, settings: settingsDe, onboarding: onboardingDe, exercises: {}, journal: journalDe, habits: habitsDe },
        ar: { common: commonAr, home: homeAr, settings: settingsAr, onboarding: onboardingAr, exercises: {}, journal: journalAr, habits: habitsAr },
        pt: { common: commonPt, home: homePt, settings: settingsPt, onboarding: onboardingPt, exercises: {}, journal: journalPt, habits: habitsPt },
        it: { common: commonIt, home: homeIt, settings: settingsIt, onboarding: onboardingIt, exercises: {}, journal: journalIt, habits: habitsIt },
        zh: { common: commonZh, home: homeZh, settings: settingsZh, onboarding: onboardingZh, exercises: {}, journal: journalZh, habits: habitsZh },
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
