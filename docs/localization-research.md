# Localization Implementation Research
## Happy App · Expo SDK 56 · iOS 26+

**Primary Sources:**
- https://docs.expo.dev/versions/latest/sdk/localization/
- https://www.i18next.com/overview/configuration-options
- https://react.i18next.com/getting-started
- https://github.com/i18next/i18next-http-backend

---

## 1. Stack Decision

Two-layer architecture (mandatory):

```
Layer 1 — Detection:    expo-localization    reads device locale/RTL from OS
Layer 2 — Translation:  i18next              manages and renders translated strings
```

`expo-localization` is NOT a translation engine. It only reads native OS locale settings.

**Chosen stack:**
```
expo-localization ~56.0.6   (already installed)
i18next ^23.x
react-i18next ^14.x
i18next-http-backend ^2.x   (OTA translations from CDN)
@react-native-async-storage/async-storage  (persist language choice)
```

**Install:**
```bash
npx expo install i18next react-i18next i18next-http-backend @react-native-async-storage/async-storage
```

---

## 2. expo-localization API Reference (SDK 56)

Source: https://docs.expo.dev/versions/latest/sdk/localization/

### getLocales(): Locale[]
Returns array of user's preferred locales in priority order.

```typescript
import * as Localization from 'expo-localization';

const primary = Localization.getLocales()[0];

primary.languageCode;          // 'en', 'fr', 'ar'
primary.regionCode;             // 'US', 'GB'
primary.languageTag;            // 'en-US', 'ar-AE'
primary.textDirection;          // 'ltr' | 'rtl'
primary.currencyCode;           // 'USD', 'EUR'
primary.decimalSeparator;       // '.' or ','
primary.measurementSystem;      // 'metric' | 'us' | 'uk'
```

### getCalendars(): Calendar[]
```typescript
const cal = Localization.getCalendars()[0];
cal.calendar;           // 'gregorian', 'buddhist', 'islamic'
cal.timeZone;           // 'America/New_York', 'Asia/Kolkata'
cal.uses24HourClock;    // true | false
cal.firstWeekday;       // 1 (Monday), 7 (Sunday)
```

### Critical Platform Differences
- **iOS**: Locale data is static per app session — re-run `getLocales()` on `AppState` `active` event
- **Android**: Detects locale changes live without restart

### RTL Config Plugin (app.json)
```json
{
  "plugins": [
    ["expo-localization", { "supportsRTL": true, "forcesRTL": false }]
  ]
}
```

---

## 3. i18next Configuration Options (v23.x)

Source: https://www.i18next.com/overview/configuration-options

### Critical Options for React Native

```typescript
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  supportedLngs: ['en', 'fr', 'es', 'de', 'ar'],
  ns: ['common', 'exercises', 'journal', 'habits', 'settings'],
  defaultNS: 'common',
  compatibilityJSON: 'v3',       // REQUIRED for Hermes/React Native
  interpolation: { escapeValue: false },  // React handles XSS
  react: { useSuspense: false }, // REQUIRED — RN has no Suspense
  saveMissing: __DEV__,
  missingKeyHandler: (lngs, ns, key) => {
    if (__DEV__) console.warn(`[i18n] Missing: ${ns}:${key}`);
  },
});
```

---

## 4. Namespace Design for Happy App

```
src/locales/
  en/
    common.json       ← buttons, errors, navigation labels
    exercises.json    ← CBT exercise titles, prompts, feedback
    journal.json      ← journaling prompts, reflection labels
    habits.json       ← habit tracker, streak text, time-of-day labels
    settings.json     ← preferences, language picker
  fr/ ...  de/ ...  es/ ...  ar/ ...
```

---

## 5. Implementation Files

### 5.1 src/lib/i18n/index.ts

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend, { HttpBackendOptions } from 'i18next-http-backend';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

const LANGUAGE_STORAGE_KEY = '@happy/language';
const CDN_BASE = 'https://cdn.happy.app/locales';
const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es', 'ar', 'pt', 'it', 'zh'] as const;
const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

function getDeviceLanguage(): SupportedLanguage {
  const tag = Localization.getLocales()[0]?.languageCode ?? 'en';
  const lang = tag.split('-')[0].toLowerCase();
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)
    ? (lang as SupportedLanguage)
    : 'en';
}

function applyRTL(lang: SupportedLanguage): void {
  const isRTL = (RTL_LANGUAGES as readonly string[]).includes(lang);
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
  // NOTE: RTL changes require app reload on iOS to take effect
}

export async function initI18n(): Promise<void> {
  if (i18n.isInitialized) return; // ponytail: guard against double init

  const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY) as SupportedLanguage | null;
  const lng = saved ?? getDeviceLanguage();

  applyRTL(lng);

  await i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init<HttpBackendOptions>({
      lng,
      fallbackLng: 'en',
      supportedLngs: [...SUPPORTED_LANGUAGES],
      ns: ['common', 'exercises', 'journal', 'habits', 'settings'],
      defaultNS: 'common',
      compatibilityJSON: 'v3',
      backend: {
        loadPath: `${CDN_BASE}/{{lng}}/{{ns}}.json`,
      },
      resources: {
        en: {
          common: require('../locales/en/common.json'),
          exercises: require('../locales/en/exercises.json'),
          journal: require('../locales/en/journal.json'),
          habits: require('../locales/en/habits.json'),
          settings: require('../locales/en/settings.json'),
        },
      },
      partialBundledLanguages: true,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      saveMissing: __DEV__,
      missingKeyHandler: (lngs, ns, key) => {
        if (__DEV__) console.warn(`[i18n] Missing key: ${ns}:${key} [${lngs.join(',')}]`);
      },
    });
}

export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  applyRTL(lang);
  await i18n.changeLanguage(lang);
}

export async function clearLanguagePreference(): Promise<void> {
  await AsyncStorage.removeItem(LANGUAGE_STORAGE_KEY);
  await changeLanguage(getDeviceLanguage());
}

export { i18n };
```

---

### 5.2 src/lib/i18n/types.ts (Typed t() — no any)

```typescript
import type common from '../locales/en/common.json';
import type exercises from '../locales/en/exercises.json';
import type journal from '../locales/en/journal.json';
import type habits from '../locales/en/habits.json';
import type settings from '../locales/en/settings.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof common;
      exercises: typeof exercises;
      journal: typeof journal;
      habits: typeof habits;
      settings: typeof settings;
    };
  }
}
```

After this: `t('navigation.home')` is fully typed and autocompleted.

---

### 5.3 app/_layout.tsx Integration

```typescript
import { useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { Stack } from 'expo-router';
import { initI18n } from '@/lib/i18n';

export default function RootLayout() {
  const [i18nReady, setI18nReady] = useState(false);

  useEffect(() => {
    initI18n().then(() => setI18nReady(true));
  }, []);

  // iOS: locale is static per session — refresh on foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        // Localization.getLocales() re-reads native locale cache on foreground
      }
    });
    return () => sub.remove();
  }, []);

  if (!i18nReady) return null;

  return <Stack />;
}
```

---

### 5.4 src/hooks/useLanguage.ts

```typescript
import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, clearLanguagePreference, SupportedLanguage } from '@/lib/i18n';

interface UseLanguageReturn {
  currentLanguage: string;
  isRTL: boolean;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  resetToDeviceLanguage: () => Promise<void>;
}

export function useLanguage(): UseLanguageReturn {
  const { i18n } = useTranslation();
  const [isRTL, setIsRTL] = useState<boolean>(i18n.dir() === 'rtl');

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    await changeLanguage(lang);
    setIsRTL(i18n.dir(lang) === 'rtl');
  }, [i18n]);

  const resetToDeviceLanguage = useCallback(async () => {
    await clearLanguagePreference();
    setIsRTL(i18n.dir() === 'rtl');
  }, [i18n]);

  return { currentLanguage: i18n.language, isRTL, setLanguage, resetToDeviceLanguage };
}
```

---

### 5.5 Translation JSON template (en/common.json)

```json
{
  "navigation": {
    "home": "Home",
    "journal": "Journal",
    "exercises": "Exercises",
    "habits": "Habits",
    "settings": "Settings"
  },
  "streak": {
    "message_one": "{{count}} day streak!",
    "message_other": "{{count}} day streak!"
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "network": "No connection. Check your internet."
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "done": "Done",
    "retry": "Retry"
  }
}
```

---

## 6. RTL Implementation

```typescript
// Use NativeWind logical properties for RTL-safe layouts
// ❌ Avoid: <View className="ml-4 items-start" />  (breaks RTL)
// ✅ Use:   <View className="ms-4" />              (margin-start, auto-flips)

// RTL language switch requires app reload on iOS:
// Show user a "Restart app to apply language change" prompt when switching to/from RTL
```

---

## 7. OTA Update Workflow

| Scenario | Action |
|:---|:---|
| Fix typo in copy | Update CDN JSON only — no release |
| Add new language | Add JSON to CDN — app fetches automatically |
| Add new key used in code | Code change + EAS Update publish |
| Add native module | Full `eas build` + App Store submission |

---

## 8. Common Anti-Patterns

| ❌ Wrong | ✅ Right |
|:---|:---|
| `useSuspense: true` | Always `useSuspense: false` in RN |
| Missing `compatibilityJSON: 'v3'` | Required for Hermes |
| `style={{ marginLeft: 16 }}` in RTL apps | NativeWind `ms-4` (margin-start) |
| `i18n.t('key')` outside components | Use `useTranslation()` hook |
| No offline fallback resources | Bundle English JSON as fallback |
| `i18n.isInitialized` not checked | Guard `initI18n()` against double init |

---

## 9. Sources

| Resource | URL |
|:---|:---|
| expo-localization SDK 56 | https://docs.expo.dev/versions/latest/sdk/localization/ |
| i18next config | https://www.i18next.com/overview/configuration-options |
| react-i18next | https://react.i18next.com/getting-started |
| i18next-http-backend | https://github.com/i18next/i18next-http-backend |
| RN I18nManager | https://reactnative.dev/docs/i18nmanager |
