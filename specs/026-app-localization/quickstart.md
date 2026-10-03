# Quickstart Validation Guide: App Localization (026)

**Date**: 2026-10-03
**Plan**: [plan.md](plan.md) | **Contracts**: [contracts/translation-namespace.md](contracts/translation-namespace.md)

---

## Prerequisites

Before validating, ensure:

1. `npx expo install i18next react-i18next i18next-http-backend` has been run
2. `src/lib/i18n/index.ts` and `src/lib/i18n/types.ts` exist
3. `src/locales/en/*.json` files exist with at least one key each
4. `initI18n()` is called in `app/_layout.tsx`
5. `app.json` has `expo-localization` plugin configured:
   ```json
   ["expo-localization", { "supportsRTL": true, "forcesRTL": false }]
   ```

---

## Validation Scenario 1: TypeScript Compilation Passes

**What this proves**: All typed `t()` calls reference valid keys; no missing key errors at compile time.

**Command**:
```bash
npx tsc --noEmit
```

**Expected outcome**: Zero errors. Any `t('nonexistent.key')` would produce a TypeScript error.

---

## Validation Scenario 2: Device Language Detection (English)

**What this proves**: App boots correctly with device in English, no crashes.

**Steps**:
1. Ensure iOS Simulator is set to English (default)
2. Run: `npm run ios`
3. Open the app

**Expected outcome**:
- App launches without error
- Navigation tab labels appear in English
- Dev console shows: no `[i18n] Missing key` warnings

---

## Validation Scenario 3: Language Switch (French)

**What this proves**: In-app language change works, persists, and loads French strings.

**Steps**:
1. App is running
2. Navigate to Settings → Language
3. Select "Français"

**Expected outcome**:
- Settings screen labels update to French immediately
- Navigation labels update to French
- Close and reopen app → French is still active
- Dev console shows French namespace loaded from bundled fallback (or CDN if configured)

---

## Validation Scenario 4: Offline Fallback (English)

**What this proves**: App works fully offline with bundled English strings.

**Steps**:
1. Put iOS Simulator in airplane mode (`Device → Toggle Wi-Fi Off`)
2. Kill and relaunch app
3. Switch language to French (offline)

**Expected outcome**:
- App launches successfully with English strings (bundled fallback)
- When switching to French offline: French CDN load fails silently → falls back to English
- No crash, no blank labels, no error screen

---

## Validation Scenario 5: Missing Key Warning (Dev Mode)

**What this proves**: Missing translation keys surface as dev warnings, not silent blanks.

**Steps**:
1. Add a temporary fake key call in any component: `t('fake.nonexistent.key')`
2. Run app in development mode

**Expected outcome**:
- Dev console shows: `[i18n] Missing key: common:fake.nonexistent.key [en]`
- UI shows the key string itself (i18next default fallback behavior) — no crash

**Cleanup**: Remove the test call.

---

## Validation Scenario 6: RTL Layout (Arabic)

**What this proves**: RTL layout applies after restart when Arabic is selected.

**Steps**:
1. Navigate to Settings → Language → select Arabic (العربية)
2. App shows a "Please restart the app to apply Arabic layout" prompt
3. Terminate and relaunch app

**Expected outcome**:
- After relaunch, layout is mirrored right-to-left
- Navigation tabs are on the right side
- Text aligns right
- `I18nManager.isRTL` returns `true`

---

## Validation Scenario 7: iOS AppState Refresh

**What this proves**: Locale detection refreshes when iOS brings app to foreground.

**Steps**:
1. Run app (no explicit language set — device English)
2. Press Home button (background app)
3. Change iOS device language to French via Settings.app
4. Return to Happy app (foreground)

**Expected outcome**:
- App detects updated device locale on `AppState` `active` event
- If no explicit language preference stored → app updates to French automatically
- If user had explicitly set a language → user preference is preserved

---

## Artifact References

- [Data Model](data-model.md) — `SupportedLanguage`, `LanguagePreference`, `TranslationNamespace` entities
- [Translation Contract](contracts/translation-namespace.md) — CDN URL format, JSON key conventions, plural format
- [Research](research.md) — Library decision rationale
- [Skill](../../.agents/skills/expo-localization-i18next/SKILL.md) — Implementation reference card
- [Research doc](../../docs/localization-research.md) — Full primary-source implementation code
