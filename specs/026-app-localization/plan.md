# Implementation Plan: App Localization (i18next + expo-localization)

**Branch**: `026-app-localization` | **Date**: 2026-10-03 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/026-app-localization/spec.md`

---

## Summary

Implement full internationalization for the Happy app using `expo-localization` for device locale detection and `i18next + react-i18next` for translation management. Translations are split by feature namespace and loaded from a remote CDN (with bundled English fallback for offline). A language preference persists in `AsyncStorage`. RTL (Arabic) is supported via `I18nManager`. All translation keys are TypeScript-typed via declaration merging. A language picker row is added to the existing Settings screen.

---

## Technical Context

**Language/Version**: TypeScript 6.0.3, React Native (Expo SDK 56), iOS 26+ only

**Primary Dependencies**:
- `expo-localization ~56.0.6` (already installed) — device locale detection
- `i18next ^23.x` (new) — translation engine
- `react-i18next ^14.x` (new) — React integration
- `i18next-http-backend ^2.x` (new) — CDN translation loading
- `@react-native-async-storage/async-storage 2.2.0` (already installed) — language preference persistence

**Storage**: AsyncStorage (language preference key: `@happy/language`)

**Testing**: TypeScript type check (`npx tsc --noEmit`), manual iOS Simulator testing. No automated test cases per constitution.

**Target Platform**: iOS 26+ only

**Project Type**: Mobile app (Expo Router)

**Performance Goals**: Language switch < 2s; app launch with locale detection < 100ms additional overhead

**Constraints**: Offline-capable (bundled English fallback); no Android support; RTL requires app restart on iOS

**Scale/Scope**: 50,000 users; 8 supported languages; 5 translation namespaces; translations served from CDN

---

## Constitution Check

*GATE: Must pass before Phase 0. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|:---|:---|:---|
| **I. One Learning Job Per Exercise** | ✅ PASS | Localization is infrastructure; no exercise learning mix |
| **II. One Active Decision at a Time** | ✅ PASS | Language picker is a standard list selection |
| **III. Resumable, Deterministic State** | ✅ PASS | Language preference persisted to AsyncStorage; restored on launch |
| **IV. Internal Buttons Update; Only Final Continue Advances** | ✅ PASS | Language picker changes language in-place; no navigation side-effects |
| **V. Private Data — Store IDs and State, Never Text** | ✅ PASS | Only locale code (`'en'`, `'fr'`) stored; no user therapeutic content |
| **VI. Premium, Editorial, Calm Design** | ✅ PASS | Language picker follows existing Settings row pattern; no new visual patterns introduced |
| **VII. Minimal, Ponytail-Mode Code (YAGNI)** | ✅ PASS | 3 new files (`i18n/index.ts`, `i18n/types.ts`, `useLanguage.ts`), 1 updated hook location, 5 locale JSON dirs |

**Gate result: PASS — no violations. Proceed to Phase 0.**

---

## Project Structure

### Documentation (this feature)

```text
specs/026-app-localization/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── translation-namespace.md
└── tasks.md             # Phase 2 — created by $speckit-tasks
```

### Source Code (new files + touched files)

```text
src/
  lib/
    i18n/
      index.ts           ← NEW: initI18n(), changeLanguage(), SupportedLanguage type
      types.ts           ← NEW: typed t() via i18next declaration merge
  locales/
    en/
      common.json        ← NEW
      exercises.json     ← NEW
      journal.json       ← NEW
      habits.json        ← NEW
      settings.json      ← NEW
    fr/  de/  es/  ar/  pt/  it/  zh/   ← NEW (same structure per locale)
  hooks/
    useLanguage.ts       ← NEW: currentLanguage, isRTL, setLanguage(), resetToDeviceLanguage()

app/
  _layout.tsx            ← TOUCH: call initI18n() in useEffect, add AppState refresh

app/tabs/screens/(settings)/
  settings.tsx           ← TOUCH: add Language row that opens language picker
```
