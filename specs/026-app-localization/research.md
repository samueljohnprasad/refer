# Research: App Localization (026)

**Date**: 2026-10-03
**Spec**: [spec.md](spec.md)

All findings sourced from primary documentation. No NEEDS CLARIFICATION items remain.

---

## Decision 1: Translation Engine

**Decision**: `i18next ^23.x` + `react-i18next ^14.x`

**Rationale**:
- Most mature React Native i18n library (10+ years, 18M weekly downloads)
- Native `compatibilityJSON: 'v3'` option for Hermes/React Native plurals
- `react: { useSuspense: false }` required setting supported out of the box
- Plugin ecosystem: `i18next-http-backend` for OTA loading
- Works with professional TMS tools (Crowdin, Phrase) for future scaling
- Industry-standard key-value JSON approach familiar to all translators

**Alternatives considered**:
- **LinguiJS**: ~2KB smaller runtime but requires compile step (`lingui compile`) in CI/CD, no OTA-capable CDN backend, smaller RN ecosystem. Rejected.
- **react-intl (FormatJS)**: ~15KB runtime (heaviest), ICU-only format, no http backend. Rejected.
- **i18n-js**: Lightweight but no OTA support, no namespace splitting, not maintained for production scale. Rejected.

---

## Decision 2: Locale Detection

**Decision**: `expo-localization ~56.0.6` (already installed)

**Rationale**:
- Official Expo package — synchronous `getLocales()` reads native OS language preferences
- Returns `languageCode` (BCP 47 subtag), `textDirection` ('ltr'|'rtl'), `currencyCode`, `timeZone`
- **iOS caveat**: Data is static per session — must re-call on `AppState` `active` event
- **Android caveat**: Out of scope (iOS 26+ only)

**Key API used**:
```typescript
Localization.getLocales()[0].languageCode  // 'en', 'fr', 'ar'
Localization.getLocales()[0].textDirection // 'ltr' | 'rtl'
```

---

## Decision 3: OTA Translation Loading

**Decision**: `i18next-http-backend ^2.x`

**Rationale**:
- `loadPath: 'https://cdn.happy.app/locales/{{lng}}/{{ns}}.json'` pattern
- `partialBundledLanguages: true` + `resources: { en: { ... } }` = English bundled as offline fallback
- Content team can fix typos by uploading new JSON to CDN — zero App Store release
- Cache invalidation via `queryStringParams: { v: '2' }` on CDN path when needed
- `i18next-chained-backend` is NOT needed — single backend with bundled fallback covers the use case

---

## Decision 4: Language Persistence

**Decision**: `@react-native-async-storage/async-storage` (already installed, v2.2.0)

**Rationale**: Already a dependency. Stores a single string key `@happy/language`. Simple read-on-init, write-on-change pattern. No MMKV needed — locale preference is read once at app start, not on hot paths.

---

## Decision 5: RTL Support

**Decision**: `React Native I18nManager.forceRTL()` triggered by locale change

**Rationale**:
- Only Arabic (`ar`) targeted for RTL in v1
- `I18nManager.allowRTL(true)` + `I18nManager.forceRTL(true)` applied in `applyRTL()` before i18n init
- **iOS constraint**: RTL layout change requires app restart to take effect. User shown a "Please restart the app" prompt when switching to/from Arabic.
- NativeWind logical properties (`ms-`, `ps-`, `me-`, `pe-`) used throughout UI for auto-flip on RTL

---

## Decision 6: Namespace Strategy

**Decision**: 5 feature-scoped namespaces

| Namespace | Scope | Estimated keys |
|:---|:---|:---|
| `common` | Buttons, errors, navigation, shared labels | ~50 |
| `exercises` | CBT exercise titles, prompts, options, feedback | ~200 |
| `journal` | Journal prompts, mood labels, reflection copy | ~80 |
| `habits` | Habit names, streak text, time-of-day labels | ~60 |
| `settings` | Settings labels, language picker, preferences | ~30 |

Lazy loading per namespace via `i18next-http-backend` — each JSON loaded on demand.

---

## Decision 7: TypeScript Typed Keys

**Decision**: Declaration merging in `src/lib/i18n/types.ts`

**Rationale**:
- i18next v23 supports `CustomTypeOptions` interface for typed `t()`
- Type is inferred from English JSON files via `typeof import('...')`
- Zero runtime cost — compile-time only
- Missing keys caught by `npx tsc --noEmit` before shipping

---

## Decision 8: `compatibilityJSON: 'v3'` Requirement

**Decision**: Always set for React Native / Hermes

**Rationale**: i18next v21+ changed plural key format. `compatibilityJSON: 'v3'` restores the `_one` / `_other` suffix format required for Hermes compatibility. Without it, pluralization breaks silently on device.

---

## Summary Table

| Topic | Decision | Source |
|:---|:---|:---|
| Translation engine | i18next v23 + react-i18next v14 | https://react.i18next.com |
| Locale detection | expo-localization SDK 56 | https://docs.expo.dev/versions/latest/sdk/localization/ |
| OTA loading | i18next-http-backend v2 | https://github.com/i18next/i18next-http-backend |
| Persistence | AsyncStorage (existing) | Already in package.json |
| RTL | I18nManager.forceRTL() | https://reactnative.dev/docs/i18nmanager |
| Type safety | CustomTypeOptions declaration | https://www.i18next.com/overview/typescript |
| Namespace split | 5 feature namespaces | Best practice from i18next docs |
| Hermes plural compat | compatibilityJSON: 'v3' | https://www.i18next.com/misc/migration-guide#json-format-v4 |
