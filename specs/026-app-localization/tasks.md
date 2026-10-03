# Tasks: App Localization (i18next + expo-localization)

**Branch**: `026-app-localization` | **Date**: 2026-10-03
**Spec**: [spec.md](spec.md) | **Plan**: [plan.md](plan.md)
**Contracts**: [contracts/translation-namespace.md](contracts/translation-namespace.md)
**Quickstart**: [quickstart.md](quickstart.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install packages, create folder structure, add `app.json` plugin config

- [x] T001 Install localization packages: run `npx expo install i18next react-i18next i18next-http-backend` (verify versions in package.json)
- [x] T002 Create directory `src/lib/i18n/` for the i18n engine module
- [x] T003 [P] Create directory `src/locales/en/` and add five placeholder JSON files: `common.json`, `exercises.json`, `journal.json`, `habits.json`, `settings.json` — each with an empty object `{}`
- [x] T004 [P] Add `expo-localization` RTL plugin to `app.json` plugins array: `["expo-localization", { "supportsRTL": true, "forcesRTL": false }]`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core i18n engine and type declarations — MUST be complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Create `src/lib/i18n/index.ts`: implement `SUPPORTED_LANGUAGES` const tuple, `SupportedLanguage` type alias, `RTL_LANGUAGES` array, `getDeviceLanguage()` helper, `applyRTL(lang)` helper (calls `I18nManager.allowRTL` + `forceRTL`), `initI18n()` async function (reads AsyncStorage → device fallback → applies RTL → calls `i18n.use(HttpBackend).use(initReactI18next).init(...)` with `compatibilityJSON: 'v4'`, `react: { useSuspense: false }`, `saveMissing: __DEV__`, `missingKeyHandler` warning), `changeLanguage(lang)` async function (writes AsyncStorage + applies RTL + calls `i18n.changeLanguage`), `clearLanguagePreference()` async function — guard with `if (i18n.isInitialized) return`
- [x] T006 Create `src/lib/i18n/types.ts`: add `declare module 'i18next'` with `CustomTypeOptions` interface that maps all 5 namespaces to `typeof import('../locales/en/{namespace}.json')` — this enables typed `t()` with zero `any`
- [x] T007 Verify TypeScript compilation passes with zero errors: run `npx tsc --noEmit` — fix any type errors in T005/T006 before proceeding

**Checkpoint**: `initI18n()` is importable, typed, and compiles clean. User stories can now begin.

---

## Phase 3: User Story 1 — App Renders in Device Language (Priority: P1) 🎯 MVP

**Goal**: App auto-detects device language at launch and renders all text in that language; falls back to English for unsupported locales; RTL applies for Arabic.

**Independent Test**: Set iOS Simulator language to French → kill app → relaunch → all labels in French. Set to Thai → English shown. Set to Arabic → RTL layout after restart.

### Implementation for User Story 1

- [x] T008 [US1] Wire `initI18n()` into `app/_layout.tsx`: add `useEffect(() => { initI18n().then(() => setI18nReady(true)); }, [])`, add `useState(false)` for `i18nReady`, return `null` until ready — keep change minimal, do not restructure existing layout providers
- [x] T009 [US1] Add `AppState` listener in `app/_layout.tsx`: `AppState.addEventListener('change', (state) => { if (state === 'active') Localization.getLocales(); })` — refresh iOS locale cache on foreground; clean up listener in return
- [x] T010 [P] [US1] Populate `src/locales/en/common.json` with English strings for: navigation tab labels (`home`, `journal`, `exercises`, `habits`, `settings`), common actions (`save`, `cancel`, `done`, `retry`, `skip`), common errors (`generic`, `network`), streak message plural (`message_one`, `message_other` with `{{count}}`)
- [x] T011 [P] [US1] Populate `src/locales/en/exercises.json` with English strings for exercise screen titles and at least 3 CBT exercise keys (use existing hardcoded strings from exercise screens as the source)
- [x] T012 [P] [US1] Populate `src/locales/en/journal.json` with English strings for journal prompt labels, mood labels, and reflection copy (use existing hardcoded strings from journal screens as the source)
- [x] T013 [P] [US1] Populate `src/locales/en/habits.json` with English strings for habit tracker labels, streak text, and time-of-day labels (use existing hardcoded strings from habits screens as the source)
- [x] T014 [US1] Replace hardcoded strings in `app/tabs/(tabs)/home` screens: import `useTranslation('common')`, replace each literal string with `t('navigation.xxx')` or `t('actions.xxx')` — scope to navigation and shared labels only
- [x] T015 [US1] Verify `npx tsc --noEmit` still passes after T008–T014 changes

**Checkpoint**: US1 fully functional — device language auto-detected, English strings render via i18next, RTL flag applied for Arabic device locale.

---

## Phase 4: User Story 2 — User Changes Language in Settings (Priority: P2)

**Goal**: Language picker in Settings lets users pin a language (persisted), switch back to device default, and see the change take effect immediately (or after restart for RTL).

**Independent Test**: Settings → Language → select Español → app text changes to Spanish → close + reopen → Spanish persists → select "Use Device Language" → reverts.

### Implementation for User Story 2

- [x] T016 [US2] Create `src/hooks/useLanguage.ts`: implement `UseLanguageReturn` interface (`currentLanguage: string`, `isRTL: boolean`, `setLanguage(lang: SupportedLanguage): Promise<void>`, `resetToDeviceLanguage(): Promise<void>`); use `useTranslation()` for `i18n` instance; `useState` for `isRTL`; `useCallback` for both setters; call `changeLanguage()` and `clearLanguagePreference()` from `src/lib/i18n/index.ts`
- [x] T017 [US2] Create `src/components/settings/LanguagePicker.tsx`: presentational component that receives `currentLanguage`, `onSelectLanguage(lang: SupportedLanguage)`, `onReset()` props; renders a flat list of supported language options (display name + locale code) using existing Settings row style from `app/tabs/screens/(settings)/settings.tsx`; shows checkmark on active language; shows "Use Device Language" as final row; no logic inside — pure props
- [x] T018 [US2] Add Language row and RTL restart prompt logic to `app/tabs/screens/(settings)/settings.tsx`: import `useLanguage` hook, render `LanguagePicker` component, wire `setLanguage` and `resetToDeviceLanguage` callbacks; add an `Alert` prompt when switching to/from Arabic ("Please restart the app to apply the new layout direction")
- [x] T019 [US2] Populate `src/locales/en/settings.json` with strings for: language picker heading, each language display name in English, "Use Device Language" label, RTL restart alert title and message
- [x] T020 [US2] Create stub locale files for all 7 non-English languages under `src/locales/{fr,de,es,ar,pt,it,zh}/` — each with the same 5 JSON files containing empty objects `{}` (translations to be filled by translation service; app loads from CDN in production)
- [x] T021 [US2] Verify `npx tsc --noEmit` passes and language switching works end-to-end in simulator

**Checkpoint**: US2 fully functional — language picker in Settings, persistence works, RTL restart prompt shows for Arabic.

---

## Phase 5: User Story 3 — OTA Copy Fixes Without App Update (Priority: P3)

**Goal**: Configure `i18next-http-backend` so the app loads translations from CDN at runtime; English stays bundled as offline fallback; CDN failures degrade gracefully.

**Independent Test**: Update a key in the CDN French JSON → foreground the app → French copy updates without a new release. Go offline → English bundled fallback renders normally.

### Implementation for User Story 3

- [x] T022 [US3] Update `src/lib/i18n/index.ts`: add `backend` config to i18n init: `{ loadPath: 'https://cdn.happy.app/locales/{{lng}}/{{ns}}.json' }` and set `partialBundledLanguages: true` so bundled English resources serve as offline fallback for CDN-missing locales
- [x] T023 [US3] Add `resources` object to i18n init options in `src/lib/i18n/index.ts`: include all 5 `require('../locales/en/{ns}.json')` entries under `resources.en` so English is fully bundled and available offline without any CDN request
- [x] T024 [US3] Verify offline fallback behavior: put simulator in airplane mode → launch app with French locale set → confirm English strings render (no blank labels, no crash) — document result in a comment in `src/lib/i18n/index.ts`
- [x] T025 [US3] Verify CDN loading behavior: configure a local static file server (e.g., `npx serve src/locales`) as `CDN_BASE` via a `__DEV__` conditional in `src/lib/i18n/index.ts`; launch app → confirm non-English locale JSON loads from local server; revert `CDN_BASE` to production URL before commit

**Checkpoint**: US3 fully functional — CDN OTA loading works, English offline fallback confirmed, graceful CDN failure.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: NativeWind RTL-safe class audit, missing-key dev warnings, TypeScript final pass

- [x] T026 [P] Audit `app/tabs/(tabs)/home` for hardcoded direction-specific Tailwind classes (`ml-`, `mr-`, `pl-`, `pr-`) and replace with logical equivalents (`ms-`, `me-`, `ps-`, `pe-`) — scope to files touched in T014 only
- [x] T027 [P] Update `src/lib/i18n/types.ts` with complete key types: ensure all keys added in T010–T013 and T019 are reflected in the JSON files so typed `t()` covers the full key surface
- [x] T028 Run full TypeScript check `npx tsc --noEmit` and fix all remaining type errors
- [x] T029 Run quickstart.md Validation Scenarios 1–5 manually in iOS Simulator and confirm each passes; document any failures

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (T001–T004) — **BLOCKS all user stories**
- **US1 (Phase 3)**: Depends on Phase 2 completion (T005–T007)
- **US2 (Phase 4)**: Depends on Phase 2 completion; T016–T018 depend on US1's `initI18n()` being wired (T008)
- **US3 (Phase 5)**: Depends on Phase 2 completion; T022–T023 modify the same file as T005 — do after US1 is stable
- **Polish (Phase 6)**: Depends on all US phases being complete

### User Story Dependencies

- **US1 (P1)**: Unblocked after Phase 2 — no dependency on US2 or US3
- **US2 (P2)**: Requires T008 (`initI18n()` wired in layout) before T016–T018 can be tested end-to-end
- **US3 (P3)**: Requires T005 (i18n init) to exist; modifies init config — do after US1 is stable

### Within Each Story

- Locale JSON population tasks (T010–T013, T019) are [P] — can run in parallel
- Hook before component (`useLanguage` before `LanguagePicker`)
- `LanguagePicker` before settings.tsx integration

### Parallel Opportunities

```
Phase 1 — Parallel:  T003, T004 (different files)
Phase 3 — Parallel:  T010, T011, T012, T013 (different JSON files)
Phase 4 — Parallel:  T019, T020 (JSON files; independent of T016–T018)
Phase 6 — Parallel:  T026, T027 (different files)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T007)
3. Complete Phase 3: US1 (T008–T015)
4. **STOP and VALIDATE**: Quickstart Scenarios 1 + 2 pass
5. Ship — app renders in device language with typed keys

### Incremental Delivery

1. Setup + Foundational → i18n engine ready
2. US1 → Device language detection, English strings, RTL detection ← **MVP**
3. US2 → In-app language picker, persistence
4. US3 → CDN OTA loading, offline fallback
5. Polish → RTL class audit, full TypeScript pass

---

## Notes

- `[P]` = parallelizable (separate files, no shared state dependency)
- `[US1/2/3]` = maps task to user story for traceability
- No test files generated — per constitution, verification is via iOS Simulator + `npx tsc --noEmit`
- Commit after each completed phase checkpoint
- Translation JSON content (non-English locales) is out of scope for implementation — stub files only; content filled by translation service
- CDN base URL uses production value by default; use `__DEV__` conditional to point at local server during development

---

## Phase 7: Convergence

- [x] T030 Extract Language modal and handlers from `src/screens/SettingsScreen/SettingsScreen.tsx` into `src/screens/SettingsScreen/components/LanguageModal.tsx` to restore file under 300-line limit per Constitution VII (contradicts)
- [x] T031 Refactor `app/_layout.tsx` by extracting `RootLayoutNav` or layout subcomponents into a separate component file to restore file under 300-line limit per Constitution VII (contradicts)
