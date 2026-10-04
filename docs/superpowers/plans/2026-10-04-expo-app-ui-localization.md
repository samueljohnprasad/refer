# Expo Application UI Localization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Localize every user-facing string shipped in the Expo application across the existing eight languages, excluding database content and user/server-generated prose.

**Architecture:** Keep the existing bundled i18next/react-i18next architecture and eight namespaces. Migrate app-owned UI through semantic translation keys, and migrate bundled exercise/config copy through a typed resolver that translates only declared copy fields while preserving IDs, scoring fields, telemetry, and user responses.

**Tech Stack:** Expo SDK 56, React Native, TypeScript, i18next, react-i18next, expo-localization, AsyncStorage, NativeWind, Jest/Expo checks, oxlint.

**Spec:** `docs/superpowers/specs/2026-10-04-app-ui-localization-design.md`

## Global Constraints

- Localize only strings shipped inside the Expo application; do not modify Supabase schemas, migrations, seed data, or database-authored content.
- Keep the supported languages exactly `en`, `fr`, `de`, `es`, `ar`, `pt`, `it`, and `zh`.
- English remains the bundled fallback.
- Use semantic translation keys for new work; do not create new source-text-hash keys.
- Preserve IDs, scoring fields, response shapes, telemetry event names, and user-generated content.
- Keep React components, hooks, and helpers at or below 300 lines.
- Preserve existing uncommitted user changes; do not reset, reformat, or broad-clean unrelated files.
- Do not add test cases; use validators, type checks, lint, static audits, and focused manual/runtime verification.
- Do not add dependencies or implement CDN/OTA translations in this plan.

## Review Focus

- A string embedded in a hook, alert, notification, accessibility prop, config object, or native permission description must be found even when it is not JSX text; cover with the app-owned literal audit in Task 1.
- A translated exercise label must not alter option IDs, answer keys, evaluator inputs, or telemetry fields; cover with the resolver contract in Task 6 and focused exercise-flow verification in Task 5.
- Interpolation and plural variables must match across all eight locales; cover with the locale validator in Task 1.
- Reset-to-device must not persist a snapshot of the current device language; cover with the runtime behavior check in Task 2.
- Arabic layout must use logical direction and restart semantics across production surfaces; cover with the RTL audit in Task 10.

### Task 1: Establish inventory and namespace ownership

**Files:**
- Create: `scripts/validate-localization.mjs`
- Create: `docs/localization-ui-inventory.md`
- Modify: `src/lib/i18n/types.ts`
- Modify: `src/lib/i18n/index.ts`

**Interfaces:**
- Produces a checked inventory of app-owned copy sources and namespace ownership for Tasks 3–9.
- Produces validator rules for locale JSON, key parity, interpolation parity, and approved exclusions.

- [ ] **Step 1: Record the current string-source inventory**

  Enumerate production `app/`, `src/`, `components/`, and `hooks/` files containing user-facing JSX text, string props, alerts, notifications, toasts, permission copy, config labels, and bundled exercise content. Mark dev/test-only routes and excluded DB/user/server content explicitly.

- [ ] **Step 2: Define namespace ownership and key naming rules**

  Document ownership for `common`, `home`, `journal`, `onboarding`, `exercises`, `journeys`, `habits`, and `settings`; update i18next resource typing when the inventory identifies missing namespace coverage.

- [ ] **Step 3: Implement the read-only locale validator**

  In `scripts/validate-localization.mjs`, validate JSON syntax, locale/namespace parity against `src/locales/en`, interpolation-variable parity, and an explicit allowlist for intentional English/product names. The validator must return a non-zero exit code for drift.

- [ ] **Step 4: Run the inventory validator**

  Run: `node scripts/validate-localization.mjs`

  Expected: the command reports the current baseline clearly; it may fail for known migration gaps, but it must distinguish missing keys, placeholder drift, and unapproved literals.

### Task 2: Complete the i18n runtime contract

**Files:**
- Modify: `src/lib/i18n/index.ts`
- Modify: `src/hooks/useLanguage.ts`
- Modify: `app/_layout.tsx`
- Modify: `app/tabs/screens/(settings)/language.tsx`
- Modify: `src/locales/*/settings.json`

**Interfaces:**
- Consumes `SupportedLanguage`, `getDeviceLanguage()`, and the existing AsyncStorage key.
- Produces deterministic initialization, explicit-language persistence, device-language reset, fallback, and RTL restart behavior.

- [ ] **Step 1: Separate explicit preference from device mode**

  Change the language state contract so clearing the stored preference does not immediately write the detected language back. On foreground, re-read the device language only when no explicit preference exists.

- [ ] **Step 2: Harden initialization and fallback**

  Keep all eight locale resources bundled, preserve `useSuspense: false`, retain the English fallback, and make missing-key warnings development-only and actionable.

- [ ] **Step 3: Make RTL state explicit**

  Preserve Arabic as the RTL language, show the restart prompt only when the direction changes, and keep the UI state truthful until the required iOS restart occurs.

- [ ] **Step 4: Verify runtime behavior statically**

  Run: `npx tsc --noEmit --pretty false`

  Expected: no new i18n/type errors attributable to this task; record pre-existing unrelated errors separately.

### Task 3: Localize app shell, routes, and settings

**Files:**
- Modify: `app/+not-found.tsx`
- Modify: `app/modal.tsx`
- Modify: `app/tabs/**/_layout.tsx`
- Modify: `app/tabs/screens/(settings)/*.tsx`
- Modify: `src/screens/SettingsScreen/**`
- Modify: `src/components/settings/**`
- Modify: `src/locales/*/{common,settings}.json`

- [ ] **Step 1: Replace production route literals with namespace keys**

  Migrate not-found, modal, tab titles, settings labels, navigation actions, errors, and accessibility labels. Keep developer/test-only screens out of the production key set unless they are reachable in production.

- [ ] **Step 2: Consolidate duplicate settings copy ownership**

  Use one key per user-facing concept across route and screen implementations without changing navigation behavior.

- [ ] **Step 3: Run focused static checks**

  Run: `node scripts/validate-localization.mjs`

  Expected: no new app-shell literals or missing settings/common keys.

### Task 4: Localize onboarding, journal, recording, and permissions

**Files:**
- Modify: `src/screens/OnboardingScreen/**`
- Modify: `src/screens/JournalEntryScreen/**`
- Modify: `src/screens/DiscoveryScreen/**`
- Modify: `hooks/useAudioRecording.tsx`
- Modify: `src/screens/**/hooks/**` for permission and recording flows
- Modify: `src/locales/*/{onboarding,journal,common}.json`

- [ ] **Step 1: Migrate onboarding and paywall-adjacent copy**

  Cover trial/free-path copy, progress charts, discount actions, testimonials, validation, loading, and accessibility descriptions with interpolation/plural keys.

- [ ] **Step 2: Migrate journal and recording surfaces**

  Cover placeholders, save/delete dialogs, feelings/tags labels, transcript states, image/audio permissions, and error/empty states. Keep journal text and transcripts as values, not translation keys.

- [ ] **Step 3: Verify formatting inputs**

  Replace forced `en-US` date/number formatting in touched flows with active-locale formatting and document any intentionally fixed product formats.

- [ ] **Step 4: Run lint**

  Run: `npm run lint`

  Expected: exit 0; warnings must not include newly introduced localization violations.

### Task 5: Localize shared exercise runtime chrome

**Files:**
- Modify: `src/components/exercise/**`
- Modify: `src/components/node/**`
- Modify: `src/screens/ExerciseFlowScreen/**`
- Modify: `src/locales/*/exercises.json`

- [ ] **Step 1: Migrate shared controls and state copy**

  Cover step headers, buttons, timers, sliders, option controls, feedback panels, retry/skip/status labels, loading/error states, and accessibility labels.

- [ ] **Step 2: Replace hardcoded fallback literals**

  Move generic fallback copy such as correctness, review, practice, and completion labels into `exercises` or `common`; leave server-authored content untouched.

- [ ] **Step 3: Verify the learning loop**

  Verify at least one representative flow per shared engine: render → answer → evaluate → feedback → retry → completion. Confirm translated labels do not enter evaluator IDs or persisted response payloads.

### Task 6: Localize bundled exercise/config content

**Files:**
- Modify: `src/hooks/useExerciseCopy.ts`
- Modify: `src/lib/i18n/exerciseCopy.ts`
- Modify: `src/components/exercise/ExerciseCopyText.tsx`
- Modify: `src/components/exercise/steps/**`
- Modify: `src/exercises/**/config.ts`
- Modify: `src/exercises/**/customSteps.tsx`
- Modify: `src/locales/*/exercises.json`

- [ ] **Step 1: Define stable semantic copy identifiers**

  Extend the existing adapter so new bundled copy uses stable exercise/field identifiers instead of hashing source text. Preserve old mappings until each caller is migrated.

- [ ] **Step 2: Localize declared copy fields only**

  Resolve titles, subtitles, prompts, labels, placeholders, options, explanations, authored feedback, validation, summaries, and safety copy. Do not translate IDs, answer keys, field names, enum values, scores, durations, or user responses.

- [ ] **Step 3: Migrate representative exercise families**

  Cover ABC analysis, thought reframing, gratitude reframe, grounding, breathing/mindfulness, body scan, and decatastrophizing configs, then apply the same schema to remaining bundled exercise configs.

- [ ] **Step 4: Validate content behavior**

  Run the existing exercise/content validators plus `node scripts/validate-localization.mjs`. Expected: all migrated copy resolves for every locale with English fallback only where explicitly allowed, and scoring fields remain byte-for-byte structurally stable.

### Task 7: Finish journey, catalog, timeline, and insight UI

**Files:**
- Modify: `src/domains/journey/ui/**`
- Modify: `src/domains/timeline/ui/**`
- Modify: `src/screens/InsightsScreen/**`
- Modify: `src/hooks/insights/**`
- Modify: `src/locales/*/{journeys,home,common}.json`

- [ ] **Step 1: Migrate journey/catalog UI-owned strings**

  Cover section/node states, catalog actions, empty/unavailable states, sign-up prompts, headers, tooltips, and accessibility labels. Do not translate content loaded from Supabase.

- [ ] **Step 2: Migrate insight and timeline states**

  Cover tabs, chart states, narratives owned by the app, errors, empty states, and hook-generated labels.

- [ ] **Step 3: Centralize active-locale date/number formatting**

  Replace forced locale/date format calls in touched timeline and insight flows with helpers based on `i18n.language`, preserving stable data values.

- [ ] **Step 4: Run locale validation**

  Run: `node scripts/validate-localization.mjs && npm run lint`

  Expected: pass with no new journey/timeline/insight key or literal violations.

### Task 8: Localize gamification, charts, premium, habits, modals, and shared primitives

**Files:**
- Modify: `src/components/Achievements/**`
- Modify: `src/components/Challenges/**`
- Modify: `src/components/Rewards/**`
- Modify: `src/components/charts/**`
- Modify: `src/components/premium/**`
- Modify: `src/components/habits/**`
- Modify: `src/components/modals/**`
- Modify: `components/**`
- Modify: `src/locales/*/{common,habits,home}.json`

- [ ] **Step 1: Migrate shared primitives first**

  Cover reusable buttons, cards, headers, modal actions, loading/error states, and accessibility labels before feature-specific strings.

- [ ] **Step 2: Migrate feature surfaces**

  Cover achievements, challenges, rewards, XP, charts, premium/trial gates, habits, and confirmation modals with plural/interpolation keys.

- [ ] **Step 3: Preserve product and billing semantics**

  Keep product identifiers, prices supplied by RevenueCat, entitlement IDs, and server/account values unchanged; translate only app-owned labels and explanatory copy.

- [ ] **Step 4: Run lint and locale validation**

  Run: `npm run lint && node scripts/validate-localization.mjs`

  Expected: pass without hardcoded production labels in the touched surfaces.

### Task 9: Localize background, notification, toast, and system copy

**Files:**
- Modify: `src/hooks/useTooltipScheduler.ts`
- Modify: `src/hooks/insights/useTemporalPatterns.ts`
- Modify: `src/hooks/data/useMentalHealthNodePress.ts`
- Modify: `src/hooks/useStreakSaverNotification.ts`
- Modify: `src/components/notifications/**`
- Modify: permission/recording hooks identified by the inventory
- Modify: `src/locales/*/{common,home,settings}.json`

- [ ] **Step 1: Convert deferred messages to translation descriptors**

  Store stable translation keys plus interpolation data in scheduled notifications/toasts rather than translated text captured before language changes.

- [ ] **Step 2: Migrate permission and system alerts**

  Localize app-owned permission explanations and error alerts while preserving OS-controlled permission dialog behavior.

- [ ] **Step 3: Verify language-change timing**

  Confirm a scheduled message resolves in the current language when delivered, and dynamic counts/names remain values.

- [ ] **Step 4: Run static validation**

  Run: `node scripts/validate-localization.mjs`

  Expected: no unapproved hook/notification/toast literals remain.

### Task 10: Complete RTL and locale-aware layout verification

**Files:**
- Modify: production files identified by the RTL audit
- Modify: `global.css` or shared styling only where a reviewed logical-direction correction is needed
- Modify: `src/locales/ar/*.json` only for approved copy corrections
- Create: `docs/localization-rtl-checklist.md`

- [ ] **Step 1: Audit physical-direction styling**

  Review `ml-*`, `mr-*`, `pl-*`, `pr-*`, `text-left`, `left`, and `right` in production surfaces; convert only touched localization-sensitive layout to logical direction utilities or runtime direction values.

- [ ] **Step 2: Review Arabic production surfaces**

  Check navigation, headers, forms, exercises, charts, modals, icons, progress indicators, and accessibility labels. Record any intentional non-mirrored icons.

- [ ] **Step 3: Document restart semantics**

  Ensure the language screen states clearly that iOS requires restart when direction changes and does not claim immediate RTL layout.

- [ ] **Step 4: Run static verification**

  Run: `node scripts/validate-localization.mjs && npm run lint`

  Expected: locale validation and lint pass; checklist records the remaining runtime-only verification boundary.

### Task 11: Final completeness and handoff verification

**Files:**
- Modify: `scripts/validate-localization.mjs`
- Modify: `docs/localization-ui-inventory.md`
- Create: `docs/localization-release-checklist.md`

- [ ] **Step 1: Make the validator enforce the final inventory**

  Fail on invalid JSON, key parity drift, placeholder drift, missing required namespace keys, and newly added unapproved app-owned literals. Keep explicit exclusions for DB/user/server content and dev/test-only routes.

- [ ] **Step 2: Run the narrow verification set**

  Run: `node scripts/validate-localization.mjs && npm run lint && npx tsc --noEmit --pretty false`

  Expected: localization validation and lint pass; typecheck has no new localization errors. Report unrelated pre-existing type errors separately if they remain.

- [ ] **Step 3: Complete focused runtime checks**

  Verify initial device detection, explicit language persistence, reset-to-device behavior, English fallback, interpolation/plurals, one representative bundled exercise per family, scheduled notification language resolution, and Arabic RTL restart behavior.

- [ ] **Step 4: Record release boundaries**

  Update the release checklist with supported locales, known exclusions, remaining database-content limitation, and static/simulator/behavioral verification status. Do not claim simulator verification unless it is actually performed.
