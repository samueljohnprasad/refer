# Review B — Reality check: architecture-engagement-logging

Reviewed 2026-11-15. Spine: `../architecture-engagement-logging.md`. Read-only; no spine or code file was changed. Paths are relative to the repo root.

**Overall verdict:** most file, table and behaviour claims are true to the repo. Six Stack rows list the declared range floor, not the installed version. Three things the spine speaks of as existing do not exist. The `_plain` suffix is exactly i18next's context convention, which is usable but changes how the helper must be written.

**Counts:** Critical 0 · Major 7 · Minor 8 · Confirmed without issue 24

Legend for "Checked against": **repo** = read in this repo; **installed** = read in `node_modules`; **web** = i18next documentation (i18next.com, via Context7); **not confirmed** = could not verify.

---

## 1. Stack table

Two lockfiles exist (`package-lock.json`, `yarn.lock`), both modified and uncommitted; `bun.lock` is deleted in the working tree. Both lockfiles and `node_modules` agree on every version below.

| Row | Spine | `package.json` | Resolved (both locks, installed) | Result |
|---|---|---|---|---|
| Expo | 58.0.24 | `^58.0.24` (:90) | 58.0.24 | Match |
| React Native | 0.88.1 | `0.88.1` (:142) | 0.88.1 | Match |
| React | 19.3.0 | `19.3.0` (:138) | 19.3.0 | Match |
| Expo Router | 58.0.31 | `~58.0.31` (:112) | 58.0.31 | Match |
| TanStack Query | 5.90.4 | `^5.90.4` (:79) | **5.107.1** | Spine lists range floor |
| Supabase JS | 2.75.0 | `^2.75.0` (:78) | **2.119.0** | Spine lists range floor |
| Reanimated | 4.7.1 | `4.7.1` (:153) | 4.7.1 | Match |
| AsyncStorage | 2.2.0 | `2.2.0` (:65) | 2.2.0 | Match |
| i18next | 26.4.2 | `^26.4.2` (:124) | **26.7.2** | Spine lists range floor |
| react-i18next | 17.0.15 | `^17.0.15` (:141) | **17.1.13** | Spine lists range floor |
| PostHog RN | 4.78.4 | `^4.78.4` (:136) | **4.86.0** | Spine lists range floor |
| NativeWind | 4.2.5 | `^4.2.5` (:135) | **4.2.7** | Spine lists range floor |
| TypeScript | 6.0.3 | `~6.0.3` (:189) | 6.0.3 | Match |
| Jest | 30.5.2 | `~30.5.2` (:183) | 30.5.2 | Match |

Checked against: repo and installed. The memlog says the stack was "not web-verified"; that is accurate and the rows were also not lock-verified.

**Major B1.** Six rows are the declared minimum, not what runs. Fix: list resolved versions, or head the column "Declared range". Also pick one lockfile.

"No new dependency is added": consistent with the Seed. Nothing in AD-12..AD-24 needs a package that is not installed.

---

## 2. i18n `_plain` suffix (AD-23)

### What the repo config is

`src/lib/i18n/index.ts:226-266`: `fallbackLng: 'en'`, `defaultNS: 'common'`, 11 namespaces, `compatibilityJSON: 'v4'`, `partialBundledLanguages: true`, `saveMissing: __DEV__`. **No** `keySeparator`, `nsSeparator`, `contextSeparator`, `pluralSeparator`, `returnEmptyString` or `returnNull` override. Eight bundled languages (`:164`).

Separators in force (installed i18next 26.7.2, `node_modules/i18next/dist/cjs/i18next.js`):

| Option | Value | Where |
|---|---|---|
| `keySeparator` | `.` | `:323-324` |
| `nsSeparator` | `:` | `:536` |
| `pluralSeparator` | `_` | `:1801` |
| `contextSeparator` | `_` | `:1802` |
| `returnEmptyString` | `true` | `:1814` |

### Findings

| # | Claim or risk | Result | Checked against |
|---|---|---|---|
| a | `_plain` collides with a plural suffix | No. v4 plural suffixes are `_zero _one _two _few _many _other`; existing keys use `_one`/`_other` (e.g. `src/locales/en/settings.json:104-105`) | repo, web |
| b | `_plain` collides with the context convention | **It is the context convention.** With the default separator, `t('key', { context: 'plain' })` looks up `key_plain` then `key` (`i18next.js:875-895`; docs "Context": `friend_male`) | installed, web |
| c | "One helper resolves the tone and falls back to the base key" | Works, but the order matters. A helper that calls `t('key_plain')` and then `t('key')` gets English `key_plain` from `fallbackLng` before it ever tries the user's own-language `key`. Using `context: 'plain'` falls back to the base key **inside each language** first, because the language loop is the outer loop (`:858-895`) | installed |
| d | "An empty Plain value means the line is not shown" | Supported: `''` is a valid lookup while `returnEmptyString` is `true` (`:907-908`), so `t` returns `''`. If anyone later sets `returnEmptyString: false`, every hidden line reappears as the base line | installed |
| e | Plain + plural on one line | Key order must be `key_plain_one`, not `key_one_plain` (`:875-886`; docs "Combining with plurals": `friend_male_one`). The spine's "`<key>_plain`" does not say this | installed, web |
| f | "Every new string is an i18n key with an English `defaultValue`" | Precedent exists (`src/domains/journal/ui/GuidedReflectionModal.tsx:53`). But resources are typed from the English JSON (`src/lib/i18n/types.ts:30-46`), so a key that exists only as a `defaultValue` is not in the typed key set. Whether that fails `tsc` here was not compiled | repo; type error **not confirmed** |
| g | Existing `_plain` keys or `context:` use that could clash | None found in `src/locales/en` or in `t(...)` calls | repo |
| h | Namespace for the new keys | Not stated in the spine. `home` and `exercises` both exist | repo |

**Major B2.** Write AD-23 as: "Plain is the i18next context `plain`; the helper is `t(key, { context: tone === 'plain' ? 'plain' : undefined })`". This uses built-in behaviour, gives the correct per-language fallback, and needs no custom resolver. Add the plural order and the namespace.

---

## 3. `moods` columns (AD-16, AD-18, AD-20)

`database.types.ts:844-871`. Columns: `id`, `input_method`, `journal_entry_id`, `main_mood` (enum `terrible|bad|fine|good|great`, `:2245`), `mood_score` (number, nullable), `selected_date` (string, nullable), `user_id`.

| Need | Present | Note |
|---|---|---|
| AD-18: `mood_score` 1–5 written by the check-in | Yes | `hooks/data/useEmotionLogger.tsx:107` writes `mood_score: emotionId` (1–5) |
| AD-16: a row marks a showed-up day | Yes | Only `selected_date` carries time; there is **no `created_at`** and no local-date column |
| AD-20: band of an entry's local day | Derivable | Requires converting `selected_date` to the device local day |

Things the spine does not account for (checked against repo):

- `selected_date` is written as a UTC instant, `new Date().toISOString()` (`useEmotionLogger.tsx:104`). `exercise_entries.selected_date` is a local `YYYY-MM-DD` string (`buildEntryPayload.ts:9-10,34`). Same column name, different meaning. A join "by local day" must convert one side.
- Each tap **inserts** a row (`useEmotionLogger.tsx:99-108`); a day can hold several scores. "The band today" is not defined for that case.
- Journal saves also write `moods.mood_score` (`hooks/post/useSaveJournal.ts:114`, `hooks/post/useBulkImportJournals.ts:90`), defaulting to 3 (`src/utils/mood.ts:4-18`). AD-16's "a `moods` row" therefore includes journal rows.
- `mood_score` is nullable; rows with `null` exist as a type possibility. `moodBand(null)` needs a defined result.

**Major B3.** The columns are sufficient; the rules built on them are under-specified.

---

## 4. Names the spine relies on

### Exists as described

| Name | Location | Checked |
|---|---|---|
| `src/domains/exercises/{domain,data,ui}` | dirs present; `data/exerciseEntryStatus.repo.ts` confirms the `.repo.ts` convention | repo |
| `src/domains/thoughtCatcher/{domain,data,ui}` | present | repo |
| `buildEntryPayload` | `src/domains/thoughtCatcher/data/buildEntryPayload.ts:12`; catch-only = `status: 'completed'` (`:27`), fair fields only when `draft.checked` (`:17-21`); `schema_version: 4` (`:26`) | repo |
| `ThoughtCatcherResponse` | `src/types/exerciseFlow.ts:320-328`; no `trap` field today | repo |
| `CognitiveDistortionKey` | `src/screens/ThoughtReframingScreen/types.ts:25-35` (10 values), re-exported in `exerciseFlow.ts:12-27` | repo |
| `ReflectionData.trap` | `src/domains/onboarding/domain/types.ts:42` | repo (type differs, see B6) |
| Generic config, schema 4 | `src/exercises/thoughtCatcher/config.ts:32-57`; `migrate` spreads unknown fields, so an added `trap` survives read-only rendering | repo |
| `buildExerciseRoute` | `src/screens/ExercisesScreen/exerciseScreenUtils.ts:56-66`; always returns `/tabs/screens/exercise-flow?...` | repo |
| Route `/tabs/screens/thought-catcher` | `app/tabs/screens/(exercises)/thought-catcher.tsx`; registered `_layout.tsx:47`; pushed from `HomeContainer.tsx:100` | repo |
| `useExerciseMutation` | `src/hooks/useExerciseMutation.ts:24`; upsert on primary key (`:60-64`); resets `completed_at` on every completed save (`:56-58`); invalidates 7 keys (`:73-79`) | repo |
| `exercise_entries` columns | `database.types.ts:418-434`: `id`, `status`, `response`, `selected_date`, `completed_at`, `created_at`, `schema_version`, … | repo |
| Legacy statuses `summary`, `checker_completed` | read at `src/screens/ExercisesScreen/hooks/useCBTHistory.ts:83` | repo |
| `happy.reflections` | `src/domains/home/data/reflectionsStorage.ts:7`; Home counts come from it (`HomeContainer.tsx:49`) | repo |
| `useEmotionLogger` | `hooks/data/useEmotionLogger.tsx:118` (root `hooks/`, not `src/`) | repo |
| Five mood chips | `src/domains/home/ui/presentation/views/MoodCheckInView.tsx:9-15` | repo |
| `HomeContainer` | `src/domains/home/ui/containers/HomeContainer.tsx:27` | repo |
| `crisisActive` hardwired false | `HomeContainer.tsx:96` | repo |
| Help sheet | `src/domains/home/ui/presentation/views/HelpSheet.tsx` | repo |
| `coping_cards` | `src/hooks/useCopingCards.ts:49`; wizard writes it (`ThoughtCatcherContainer.tsx:123`) | repo |
| `SavedReflectionCard` | `src/domains/onboarding/ui/presentation/components/SavedReflectionCard.tsx:20` | repo (location issue, see B7) |
| `["week_practice_days", user?.id]` | `src/screens/ExercisesScreen/hooks/useWeekPracticeDays.ts:14` | repo (behaviour differs, see B5) |
| PostHog client | singleton `posthog` at `src/config/posthog.ts:24`; call sites use `usePostHog()` (`src/hooks/useRetentionTracker.ts:49`) | repo |
| `daily.service.ts` reads entries with no status filter | `supabase/functions/_shared/reflection-engine/services/daily.service.ts`, the `exercise_entries` select filters only by `user_id` and `created_at` | repo |
| `PracticeCompletionV1` | `src/domains/practice/data/practiceCompletion.repo.ts:3,55`; table in `supabase/migrations/20261015120000_practice_completions.sql` | repo |
| Both runtimes write `thought_catcher` | wizard `ThoughtCatcherContainer.tsx:88`; generic `ExerciseFlowRunner.tsx:93` | repo |
| Hardcoded English in domain files | `thoughtCatcher/domain/steps.ts` (`WRITING_RULES`, `nextLabel`), `useHomeScene.ts:34-39` | repo |
| `@happy/` key prefix | `HomeContainer.tsx:24-25`, `src/lib/i18n/index.ts:161` | repo |
| Jest preset | `package.json:28-30` (`jest-expo`); `jest` and `jest-expo` 58.0.14 installed | repo, installed |

### Stated as existing, but not in the repo

| # | Spine wording | Reality | Severity |
|---|---|---|---|
| B4 | AD-14 "the AsyncStorage draft" | No draft is persisted. State is `useState` (`ThoughtCatcherContainer.tsx:24`); leaving shows "What you wrote so far won't be saved" (`:114`) | Major |
| B8 | Paradigm: the shape "`home` … already use[s]"; AD-17 `src/domains/home/domain` | `src/domains/home` has `data/` and `ui/` only | Minor |
| B5 | Conventions: a save invalidates "the existing list … plus `["week_practice_days"]`" | The key exists but is **not** in the existing list (`useExerciseMutation.ts:73-79`), and a mood log does not invalidate it (`useEmotionLogger.tsx:165-190`). The existing hook counts any status by `created_at` and ignores `moods` (`useWeekPracticeDays.ts:19-23`). The Seed names a new `useWeekShowedUp`; if both live on one key with different shapes the cache breaks | Major |

### Described inaccurately

| # | Spine wording | Reality | Severity |
|---|---|---|---|
| B6 | AD-15: `trap` is "the same name `ReflectionData` already uses" | Same name, different type: `TrapType`, 7 values, `'should'` (`onboarding/domain/enums.ts:10-18`) vs `CognitiveDistortionKey`, 10 values, `'should_statements'`. `saveReflection.ts:3` notes the wizard leaves `trap` undefined | Major |
| B7 | Capability Map: saved-card variants live in `SavedReflectionCard` | It is onboarding-domain UI and takes `ReflectionData`, not an exercise entry. The wizard currently renders its own `KeepCard`. Using it from `thoughtCatcher` breaks the spine's own restated AD-9 | Major |
| B9 | Conventions: query keys "first element lower_snake_case … as today" | True for exercise keys; false for mood keys (`daily-moods`, `daily-emotions`, `daily-moods-range`) | Minor |
| B10 | AD-16 status list | `useExerciseStats.ts:75` counts `completed` only; `useCBTHistory.ts:83` counts three statuses. The TS type `ExerciseStatus` is `"draft" | "in_progress" | "completed"` (`exerciseFlow.ts:109`): the legacy values are not in the type, and `draft` is not mentioned by the spine | Minor |
| B11 | AD-22 "more ad-hoc key styles" / `@happy/<name>_v1` | No existing key has this exact form. `@happy/…` keys have no version; `_v1` keys have no `@happy/` prefix (`@reminders_config_v1`). An install-date key already exists in a third style: `@happy:retention_first_launch_date` (`useRetentionTracker.ts:9`) | Minor |

---

## 5. New names (do not exist yet; a builder creates them)

| Name | Kind | Introduced by |
|---|---|---|
| `entryRung(entry)` | function, `src/domains/exercises/domain` | AD-13 |
| `ThoughtCatcherResponse.trap` | optional field | AD-15 |
| `usePracticeCounts`, `useWeekShowedUp` | container hooks | AD-16, Seed |
| practice counts repo, recall repo | `*.repo.ts` in `src/domains/exercises/data` | Seed |
| `resolveHomeAsk(inputs, now)` and its input/output types | function, **new dir** `src/domains/home/domain` | AD-17 |
| `moodBand(score)` | function | AD-18 |
| `isHardEntry(...)` | function | AD-19 |
| Recall exclusion set | AsyncStorage value | AD-20 |
| `pickAskLine(localDate, installDate, window)`, `pickStems(entryOrdinal)` | functions | AD-21 |
| `@happy/<name>_v1` keys: tone, ask-shown date, recall exclusions, draft, tone-card-seen | AsyncStorage keys | AD-22 |
| Prefs adapters (`exercises/data`, `home/data`), draft adapter (`thoughtCatcher/data`) | files | AD-22, Seed |
| Tone helper and every `<key>_plain` key | i18n | AD-23 |
| `src/domains/exercises/data/loggingEvents.ts` and its event functions | file | AD-24 |
| Trap step and step-up step in `thoughtCatcher/domain/steps.ts` | step ids (not named by the spine) | Seed |
| Thought Catcher persisted draft | AsyncStorage value | AD-14 |
| Any test file | none exists in the repo | Conventions |

---

## 6. AsyncStorage, upsert and Jest usage

| Claim | Result | Checked against |
|---|---|---|
| AsyncStorage is read and written through thin adapter files | Partly true. `reflectionsStorage.ts` is an adapter; `HomeContainer.tsx:55,68,82-86,115` and `useEmotionLogger.tsx` call AsyncStorage inline. AD-22's "one adapter file per domain" is a new discipline, not current practice | repo |
| Values are JSON strings with tolerant reads | True in `reflectionsStorage.ts:12-21` (try/catch, `Array.isArray`). No stored value carries a version field today, so "versioned" means the key suffix only | repo |
| "Clearing storage must leave the app in a valid default state" | Plausible: existing readers default on `null`. Not tested | repo; behaviour **not confirmed** |
| Upserting the same `id` rewrites the row | True: `.upsert(row)` with `id` present targets the primary key (`useExerciseMutation.ts:50-64`). `created_at` is not in the payload and is kept; `completed_at` is overwritten | repo |
| The wizard can pass the `id` | `save(payload, id?)` supports it (`:16-19`). The wizard does not capture the returned row today (`ThoughtCatcherContainer.tsx:88`) | repo |
| Upsert needs an authenticated user | `mutationFn` throws without `user.id` (`:33-35`). Anonymous Supabase users have an id; if anonymous sign-in is disabled the session is `null` (`src/context/AuthContext.tsx:216-222`) and nothing is written | repo |
| "Each domain rule ships one co-located Jest test" | Jest 30.5.2 and `jest-expo` are installed and the preset is set. **There is no test file anywhere in the repo.** `npm test` runs `jest --watchAll`, which does not exit in CI. `@types/jest` is not installed and `tsconfig.json` includes all `**/*.ts`, so co-located tests may fail type-checking | repo, installed; type failure **not confirmed** |
| `@/` imports resolve under Jest | `jest-expo` maps `tsconfig.json` paths (`node_modules/jest-expo/jest-preset.js:32,164`) | installed |
| Domain rules are testable without mocks | True if they stay pure as AD-13..AD-21 require. Note `buildEntryPayload(draft, now = new Date())` defaults to the real clock (`buildEntryPayload.ts:12`); it is in `data/`, so the "no clock read" rule does not cover it | repo |
| `react-test-renderer` matches React | No: `19.0.0` vs React `19.3.0` (`package.json:187`). Irrelevant to pure-function tests; relevant if container tests are added | repo |

---

## 7. Remaining claims

| Claim | Result | Checked against |
|---|---|---|
| "No column, status value or `schema_version` changes" (AD-13, AD-15) | Holds: `response` is `Json`; adding an optional field needs no migration | repo |
| "The generic-flow config … renders past entries" | `ExercisesScreen.tsx:87` opens completed entries with `readOnly: true` through the generic route | repo |
| "Thought Reframing stays on the generic flow" | `ExercisesScreen.tsx:91` and `ThoughtCatcherContainer.tsx:164` route it there | repo |
| AD-24 "call sites never call `posthog.capture` directly" | New discipline. The singleton makes a non-hook module possible | repo |
| Research events (§9.2) carry no free text | True of the listed properties; `trap_choice`, `belief_before/after`, `mood_today` are enums and numbers | repo (document) |
| "No flag system exists" (Deferred) | No feature-flag module found under `src/`; PostHog is present but no flag calls were found in the domains read | repo; exhaustive search **not confirmed** |
| "Not built in code today" (Distressed variant) | `crisisActive` false on Home. The wizard does have a crisis sheet (`matchesCrisis`, `ThoughtCatcherContainer.tsx:9,60-65`) | repo |
| i18next context key format and plural combination | Confirmed in i18next docs ("Context", "JSON format v4") | web |

---

## Findings by severity

**Major (7)**
- B1 Six Stack rows show the declared floor, not the resolved version.
- B2 `_plain` is the i18next context suffix; a naive helper leaks English Plain text into other locales; plural order and namespace unstated.
- B3 `moods` has the columns, but `selected_date` is a UTC instant, a day can hold several rows, journals also write scores, and `mood_score` is nullable.
- B4 The Thought Catcher draft AD-14 refers to does not exist.
- B5 `["week_practice_days"]` exists but is not invalidated by saves or mood logs and has different semantics from AD-16.
- B6 `ReflectionData.trap` is a different enum from `CognitiveDistortionKey`.
- B7 `SavedReflectionCard` is onboarding UI over `ReflectionData`, not a shared saved card over entries.

**Minor (8)**
- B8 `src/domains/home/domain` does not exist.
- B9 Query-key casing claim is false for mood keys.
- B10 Legacy statuses are not in `ExerciseStatus`; `draft` is unmentioned.
- B11 `@happy/<name>_v1` is a new style; an install-date key exists in a third style.
- B12 No test file exists; `npm test` is watch mode; `@types/jest` missing.
- B13 Two lockfiles, both dirty, plus a deleted `bun.lock`.
- B14 `useEmotionLogger` is in root `hooks/data`, outside the domain layers the Paradigm describes; `MoodCheckInView` (presentation) calls it directly, against "JSX only".
- B15 Typed i18n resources may reject `defaultValue`-only keys (not confirmed by compiling).
