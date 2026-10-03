---
name: expo-localization-i18next
description: Implement, configure, and maintain localization in the Happy Expo app using i18next + react-i18next + expo-localization. Use when adding translations, new languages, changing language at runtime, setting up RTL, updating translation files, or wiring locale detection. Full implementation is in docs/localization-research.md.
version: 1.0.0
---

# Expo Localization — i18next Stack

**Use this skill for ANY localization work in this repo.**

Research doc: [`docs/localization-research.md`](../../docs/localization-research.md)

---

## Architecture (Two Layers — Always)

```
expo-localization    →  reads device language code, RTL flag, timezone, currency
       +
i18next + react-i18next  →  manages translation strings, renders in components
```

Never use `expo-localization` alone for displaying strings. Never hardcode user-facing strings.

---

## Install Command

```bash
npx expo install i18next react-i18next i18next-http-backend @react-native-async-storage/async-storage
```

> `expo-localization ~56.0.6` is already installed in this repo.

---

## File Structure

```
src/
  lib/
    i18n/
      index.ts        ← initI18n(), changeLanguage(), SupportedLanguage type
      types.ts        ← declare module 'i18next' for typed t()
  hooks/
    useLanguage.ts    ← setLanguage(), isRTL, currentLanguage
  locales/
    en/
      common.json
      exercises.json
      journal.json
      habits.json
      settings.json
    fr/ ... de/ ... es/ ... ar/ ...
app/
  _layout.tsx         ← call initI18n() in useEffect, AppState refresh
```

---

## Critical i18next Settings (React Native)

Always set these two — app will not work correctly without them:

```typescript
compatibilityJSON: 'v3',   // Required for Hermes/React Native plurals
react: { useSuspense: false },  // React Native has no Suspense support
```

---

## Namespace Pattern

Split translation files by feature. Use `ns: ['common', 'exercises', 'journal', 'habits', 'settings']`.

```typescript
// In component:
const { t } = useTranslation('exercises');
t('cbt.title');   // reads from exercises.json

const { t: tCommon } = useTranslation('common');
tCommon('actions.save');   // reads from common.json
```

---

## Language Change (Runtime)

```typescript
import { changeLanguage, SupportedLanguage } from '@/lib/i18n';

await changeLanguage('fr');  // persists to AsyncStorage, applies RTL if needed
```

---

## RTL Support

```typescript
// In applyRTL() inside src/lib/i18n/index.ts:
I18nManager.allowRTL(isRTL);
I18nManager.forceRTL(isRTL);
// Requires app reload on iOS — prompt user after RTL language switch

// In UI — use NativeWind logical properties:
// ✅ className="ms-4 ps-2"   (margin-start, padding-start — auto RTL)
// ❌ className="ml-4 pl-2"   (breaks RTL)
```

---

## OTA Translation Updates

Translations load from CDN via `i18next-http-backend`. English is bundled as offline fallback.

```
Fix copy bug  →  update CDN JSON   →  no App Store release needed
Add language  →  add JSON to CDN   →  no App Store release needed
Add new key   →  update code too   →  EAS Update required
New native module →  eas build     →  App Store submission required
```

---

## TypeScript Typed t()

Add to `src/lib/i18n/types.ts`:
```typescript
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof import('../locales/en/common.json');
      exercises: typeof import('../locales/en/exercises.json');
      journal: typeof import('../locales/en/journal.json');
      habits: typeof import('../locales/en/habits.json');
      settings: typeof import('../locales/en/settings.json');
    };
  }
}
```

---

## expo-localization API Quick Reference

```typescript
import * as Localization from 'expo-localization';

const locale = Localization.getLocales()[0];
locale.languageCode;    // 'en', 'fr', 'ar'
locale.textDirection;   // 'ltr' | 'rtl'
locale.currencyCode;    // 'USD', 'EUR'
locale.languageTag;     // 'en-US'

const cal = Localization.getCalendars()[0];
cal.timeZone;           // 'America/New_York'
cal.uses24HourClock;    // true | false
cal.firstWeekday;       // 1=Monday, 7=Sunday
```

> **iOS warning**: Locale is static per session. Re-call `getLocales()` in `AppState` `active` handler.

---

## Anti-Patterns (Never Do These)

| ❌ Never | ✅ Instead |
|:---|:---|
| `useSuspense: true` | Always `false` in React Native |
| Missing `compatibilityJSON: 'v3'` | Always set |
| `style={{ marginLeft }}` in RTL | Use `ms-` NativeWind class |
| `i18n.t()` outside a component | Use `useTranslation()` hook |
| No English fallback resources | Bundle `en/*.json` in `resources` |
| Double-init i18n | Guard: `if (i18n.isInitialized) return` |
| Hardcoded strings in JSX | Every string goes in locale JSON |

---

## Example Invocations

User: "Add French language to the app"
→ Add `src/locales/fr/*.json`, add `'fr'` to `SUPPORTED_LANGUAGES`, upload to CDN.

User: "Show translated habit names"
→ `useTranslation('habits')`, use `t('habitKey.label')`.

User: "User selected Arabic — enable RTL"
→ `await changeLanguage('ar')`, prompt user to restart app on iOS.

User: "Fix typo in English copy without releasing"
→ Update `en/common.json` on CDN only.

User: "Wire locale detection on app start"
→ See `initI18n()` in `src/lib/i18n/index.ts` — already handles it.
