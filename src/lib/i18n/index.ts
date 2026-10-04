// ponytail: minimal robust i18n setup with expo-localization and async-storage
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

import commonEn from '../../locales/en/common.json';
import homeEn from '../../locales/en/home.json';
import exercisesEn from '../../locales/en/exercises.json';
import exercisesEnCourseCopy from '../../locales/en/exerciseFlowCourseContent.json';
import exercisesEnModuleCopy from '../../locales/en/exerciseFlowModuleContent.json';
import exercisesEnRendererCopy from '../../locales/en/exerciseFlowRendererCopy.json';
import exercisesEnSharedCopy from '../../locales/en/exerciseFlowSharedCopy.json';
import journalEn from '../../locales/en/journal.json';
import habitsEn from '../../locales/en/habits.json';
import settingsEn from '../../locales/en/settings.json';
import onboardingEn from '../../locales/en/onboarding.json';
import journeysEn from '../../locales/en/journeys.json';
import insightsEn from '../../locales/en/insights.json';
import trackingEn from '../../locales/en/tracking.json';
import timelineSamplesEn from '../../locales/en/timelineSamples.json';

import commonFr from '../../locales/fr/common.json';
import homeFr from '../../locales/fr/home.json';
import journalFr from '../../locales/fr/journal.json';
import settingsFr from '../../locales/fr/settings.json';
import onboardingFr from '../../locales/fr/onboarding.json';
import habitsFr from '../../locales/fr/habits.json';
import journeysFr from '../../locales/fr/journeys.json';
import exercisesFr from '../../locales/fr/exercises.json';
import exercisesFrCourseCopy from '../../locales/fr/exerciseFlowCourseContent.json';
import exercisesFrModuleCopy from '../../locales/fr/exerciseFlowModuleContent.json';
import exercisesFrRendererCopy from '../../locales/fr/exerciseFlowRendererCopy.json';
import exercisesFrSharedCopy from '../../locales/fr/exerciseFlowSharedCopy.json';
import insightsFr from '../../locales/fr/insights.json';
import trackingFr from '../../locales/fr/tracking.json';
import timelineSamplesFr from '../../locales/fr/timelineSamples.json';

import commonEs from '../../locales/es/common.json';
import homeEs from '../../locales/es/home.json';
import journalEs from '../../locales/es/journal.json';
import settingsEs from '../../locales/es/settings.json';
import onboardingEs from '../../locales/es/onboarding.json';
import habitsEs from '../../locales/es/habits.json';
import journeysEs from '../../locales/es/journeys.json';
import exercisesEs from '../../locales/es/exercises.json';
import exercisesEsCourseCopy from '../../locales/es/exerciseFlowCourseContent.json';
import exercisesEsModuleCopy from '../../locales/es/exerciseFlowModuleContent.json';
import exercisesEsRendererCopy from '../../locales/es/exerciseFlowRendererCopy.json';
import exercisesEsSharedCopy from '../../locales/es/exerciseFlowSharedCopy.json';
import insightsEs from '../../locales/es/insights.json';
import trackingEs from '../../locales/es/tracking.json';
import timelineSamplesEs from '../../locales/es/timelineSamples.json';

import commonDe from '../../locales/de/common.json';
import homeDe from '../../locales/de/home.json';
import journalDe from '../../locales/de/journal.json';
import settingsDe from '../../locales/de/settings.json';
import onboardingDe from '../../locales/de/onboarding.json';
import habitsDe from '../../locales/de/habits.json';
import journeysDe from '../../locales/de/journeys.json';
import exercisesDe from '../../locales/de/exercises.json';
import exercisesDeCourseCopy from '../../locales/de/exerciseFlowCourseContent.json';
import exercisesDeModuleCopy from '../../locales/de/exerciseFlowModuleContent.json';
import exercisesDeRendererCopy from '../../locales/de/exerciseFlowRendererCopy.json';
import exercisesDeSharedCopy from '../../locales/de/exerciseFlowSharedCopy.json';
import insightsDe from '../../locales/de/insights.json';
import trackingDe from '../../locales/de/tracking.json';
import timelineSamplesDe from '../../locales/de/timelineSamples.json';

import commonAr from '../../locales/ar/common.json';
import homeAr from '../../locales/ar/home.json';
import journalAr from '../../locales/ar/journal.json';
import settingsAr from '../../locales/ar/settings.json';
import onboardingAr from '../../locales/ar/onboarding.json';
import habitsAr from '../../locales/ar/habits.json';
import journeysAr from '../../locales/ar/journeys.json';
import exercisesAr from '../../locales/ar/exercises.json';
import exercisesArCourseCopy from '../../locales/ar/exerciseFlowCourseContent.json';
import exercisesArModuleCopy from '../../locales/ar/exerciseFlowModuleContent.json';
import exercisesArRendererCopy from '../../locales/ar/exerciseFlowRendererCopy.json';
import exercisesArSharedCopy from '../../locales/ar/exerciseFlowSharedCopy.json';
import insightsAr from '../../locales/ar/insights.json';
import trackingAr from '../../locales/ar/tracking.json';
import timelineSamplesAr from '../../locales/ar/timelineSamples.json';

import commonPt from '../../locales/pt/common.json';
import homePt from '../../locales/pt/home.json';
import journalPt from '../../locales/pt/journal.json';
import settingsPt from '../../locales/pt/settings.json';
import onboardingPt from '../../locales/pt/onboarding.json';
import habitsPt from '../../locales/pt/habits.json';
import journeysPt from '../../locales/pt/journeys.json';
import exercisesPt from '../../locales/pt/exercises.json';
import exercisesPtCourseCopy from '../../locales/pt/exerciseFlowCourseContent.json';
import exercisesPtModuleCopy from '../../locales/pt/exerciseFlowModuleContent.json';
import exercisesPtRendererCopy from '../../locales/pt/exerciseFlowRendererCopy.json';
import exercisesPtSharedCopy from '../../locales/pt/exerciseFlowSharedCopy.json';
import insightsPt from '../../locales/pt/insights.json';
import trackingPt from '../../locales/pt/tracking.json';
import timelineSamplesPt from '../../locales/pt/timelineSamples.json';

import commonIt from '../../locales/it/common.json';
import homeIt from '../../locales/it/home.json';
import journalIt from '../../locales/it/journal.json';
import settingsIt from '../../locales/it/settings.json';
import onboardingIt from '../../locales/it/onboarding.json';
import habitsIt from '../../locales/it/habits.json';
import journeysIt from '../../locales/it/journeys.json';
import exercisesIt from '../../locales/it/exercises.json';
import exercisesItCourseCopy from '../../locales/it/exerciseFlowCourseContent.json';
import exercisesItModuleCopy from '../../locales/it/exerciseFlowModuleContent.json';
import exercisesItRendererCopy from '../../locales/it/exerciseFlowRendererCopy.json';
import exercisesItSharedCopy from '../../locales/it/exerciseFlowSharedCopy.json';
import insightsIt from '../../locales/it/insights.json';
import trackingIt from '../../locales/it/tracking.json';
import timelineSamplesIt from '../../locales/it/timelineSamples.json';

import commonZh from '../../locales/zh/common.json';
import homeZh from '../../locales/zh/home.json';
import journalZh from '../../locales/zh/journal.json';
import settingsZh from '../../locales/zh/settings.json';
import onboardingZh from '../../locales/zh/onboarding.json';
import habitsZh from '../../locales/zh/habits.json';
import journeysZh from '../../locales/zh/journeys.json';
import exercisesZh from '../../locales/zh/exercises.json';
import exercisesZhCourseCopy from '../../locales/zh/exerciseFlowCourseContent.json';
import exercisesZhModuleCopy from '../../locales/zh/exerciseFlowModuleContent.json';
import exercisesZhRendererCopy from '../../locales/zh/exerciseFlowRendererCopy.json';
import exercisesZhSharedCopy from '../../locales/zh/exerciseFlowSharedCopy.json';
import insightsZh from '../../locales/zh/insights.json';
import trackingZh from '../../locales/zh/tracking.json';
import timelineSamplesZh from '../../locales/zh/timelineSamples.json';

function composeExerciseNamespace<T extends { flow: { ui: object } }>(
  base: T,
  ...copyShards: Record<string, string>[]
) {
  return {
    ...base,
    flow: {
      ...base.flow,
      ui: { ...base.flow.ui, copy: Object.assign({}, ...copyShards) },
    },
  };
}

const exercisesByLocale = {
  en: composeExerciseNamespace(exercisesEn, exercisesEnCourseCopy, exercisesEnModuleCopy, exercisesEnRendererCopy, exercisesEnSharedCopy),
  fr: composeExerciseNamespace(exercisesFr, exercisesFrCourseCopy, exercisesFrModuleCopy, exercisesFrRendererCopy, exercisesFrSharedCopy),
  de: composeExerciseNamespace(exercisesDe, exercisesDeCourseCopy, exercisesDeModuleCopy, exercisesDeRendererCopy, exercisesDeSharedCopy),
  es: composeExerciseNamespace(exercisesEs, exercisesEsCourseCopy, exercisesEsModuleCopy, exercisesEsRendererCopy, exercisesEsSharedCopy),
  ar: composeExerciseNamespace(exercisesAr, exercisesArCourseCopy, exercisesArModuleCopy, exercisesArRendererCopy, exercisesArSharedCopy),
  pt: composeExerciseNamespace(exercisesPt, exercisesPtCourseCopy, exercisesPtModuleCopy, exercisesPtRendererCopy, exercisesPtSharedCopy),
  it: composeExerciseNamespace(exercisesIt, exercisesItCourseCopy, exercisesItModuleCopy, exercisesItRendererCopy, exercisesItSharedCopy),
  zh: composeExerciseNamespace(exercisesZh, exercisesZhCourseCopy, exercisesZhModuleCopy, exercisesZhRendererCopy, exercisesZhSharedCopy),
};

export const LANGUAGE_STORAGE_KEY = '@happy/language';
export const CDN_BASE = 'https://cdn.happy.app/locales';

export const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es', 'ar', 'pt', 'it', 'zh'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES: readonly SupportedLanguage[] = ['ar'] as const;
let languageActionVersion = 0;
let languageChangeQueue: Promise<void> = Promise.resolve();

function queueLanguageChange(lang: SupportedLanguage, expectedVersion?: number): Promise<boolean> {
  const change = languageChangeQueue.then(async () => {
    if (expectedVersion !== undefined && expectedVersion !== languageActionVersion) return false;
    const needsRestart = I18nManager.isRTL !== RTL_LANGUAGES.includes(lang);
    applyRTL(lang);
    await i18n.changeLanguage(lang);
    return needsRestart;
  });
  languageChangeQueue = change.then(() => {}, () => {});
  return change;
}

export async function getStoredLanguagePreference(): Promise<SupportedLanguage | null> {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  return stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)
    ? (stored as SupportedLanguage)
    : null;
}

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
    savedLang = await getStoredLanguagePreference();
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
      ns: ['common', 'home', 'exercises', 'journal', 'habits', 'settings', 'onboarding', 'journeys', 'insights', 'tracking', 'timelineSamples'],
      defaultNS: 'common',
      compatibilityJSON: 'v4',
      resources: {
        en: {
          common: commonEn,
          home: homeEn,
          exercises: exercisesByLocale.en,
          journal: journalEn,
          habits: habitsEn,
          settings: settingsEn,
          onboarding: onboardingEn,
          journeys: journeysEn,
          insights: insightsEn,
          tracking: trackingEn,
          timelineSamples: timelineSamplesEn,
        },
        fr: { common: commonFr, home: homeFr, settings: settingsFr, onboarding: onboardingFr, exercises: exercisesByLocale.fr, journal: journalFr, habits: habitsFr, journeys: journeysFr, insights: insightsFr, tracking: trackingFr, timelineSamples: timelineSamplesFr },
        es: { common: commonEs, home: homeEs, settings: settingsEs, onboarding: onboardingEs, exercises: exercisesByLocale.es, journal: journalEs, habits: habitsEs, journeys: journeysEs, insights: insightsEs, tracking: trackingEs, timelineSamples: timelineSamplesEs },
        de: { common: commonDe, home: homeDe, settings: settingsDe, onboarding: onboardingDe, exercises: exercisesByLocale.de, journal: journalDe, habits: habitsDe, journeys: journeysDe, insights: insightsDe, tracking: trackingDe, timelineSamples: timelineSamplesDe },
        ar: { common: commonAr, home: homeAr, settings: settingsAr, onboarding: onboardingAr, exercises: exercisesByLocale.ar, journal: journalAr, habits: habitsAr, journeys: journeysAr, insights: insightsAr, tracking: trackingAr, timelineSamples: timelineSamplesAr },
        pt: { common: commonPt, home: homePt, settings: settingsPt, onboarding: onboardingPt, exercises: exercisesByLocale.pt, journal: journalPt, habits: habitsPt, journeys: journeysPt, insights: insightsPt, tracking: trackingPt, timelineSamples: timelineSamplesPt },
        it: { common: commonIt, home: homeIt, settings: settingsIt, onboarding: onboardingIt, exercises: exercisesByLocale.it, journal: journalIt, habits: habitsIt, journeys: journeysIt, insights: insightsIt, tracking: trackingIt, timelineSamples: timelineSamplesIt },
        zh: { common: commonZh, home: homeZh, settings: settingsZh, onboarding: onboardingZh, exercises: exercisesByLocale.zh, journal: journalZh, habits: habitsZh, journeys: journeysZh, insights: insightsZh, tracking: trackingZh, timelineSamples: timelineSamplesZh },
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
          console.warn(`[i18n] Missing ${ns}:${key} for ${lngs.join(',')}. Add it to src/locales/<language>/${ns}.json (including en for fallback).`);
        }
      },
    });
}

export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  languageActionVersion += 1;
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  await queueLanguageChange(lang);
}

export async function clearLanguagePreference(): Promise<void> {
  languageActionVersion += 1;
  await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
  await queueLanguageChange(getDeviceLanguage());
}

export async function refreshDeviceLanguage(): Promise<boolean> {
  if (!i18n.isInitialized) return false;
  const refreshVersion = languageActionVersion;

  try {
    if (await getStoredLanguagePreference()) return false;
  } catch (error) {
    console.warn('[i18n] Failed reading language preference on foreground', error);
    return false;
  }
  if (refreshVersion !== languageActionVersion) return false;

  const deviceLanguage = getDeviceLanguage();
  if (i18n.language === deviceLanguage) return false;
  return queueLanguageChange(deviceLanguage, refreshVersion);
}

export { i18n };
