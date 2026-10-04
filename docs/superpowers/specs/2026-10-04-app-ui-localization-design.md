# Expo Application UI Localization Design

**Date:** 2026-10-04

## Goal

Localize every user-facing string shipped inside the Happy Expo application across the eight existing supported languages, without changing database content or the meaning of stored data.

## Scope

Included:

- Route titles, navigation labels, buttons, placeholders, alerts, errors, empty/loading states, accessibility labels, notifications, toasts, permission prompts, paywall copy, chart labels, and formatted dates/numbers.
- Bundled TypeScript, JSON, and other app-shipped exercise/configuration copy, including prompts, options, explanations, feedback, validation, summaries, and safety copy.
- Existing locale bundles: `en`, `fr`, `de`, `es`, `ar`, `pt`, `it`, and `zh`.
- Language selection, device-language detection, persistence, fallback behavior, interpolation/plurals, and Arabic RTL layout behavior.

Excluded:

- Supabase schemas, migrations, seed data, database-authored course content, and server API payloads.
- User-entered journal text, reflections, coping-card text, voice transcripts, and other user-generated content.
- AI-generated responses and server-generated prose. App-controlled labels around those responses remain in scope.
- App Store metadata, screenshots, marketing copy, or subscription localization.
- New languages, dependency additions, or a CDN/OTA translation rollout unless separately approved.

## Current State

The app already has i18next, react-i18next, expo-localization, AsyncStorage persistence, eight locale directories, eight namespaces, a language settings screen, and partial exercise-copy mapping. The implementation is incomplete:

- Many route, screen, shared-component, hook, notification, permission, accessibility, chart, premium, and exercise strings remain literal English.
- Bundled exercise configuration is only partially connected to the existing copy adapter.
- `CDN_BASE` is defined but no HTTP backend is wired; this plan keeps translations bundled.
- Reset-to-device behavior currently persists the detected language again, which can prevent future OS-language changes from applying.
- RTL is enabled for Arabic, but physical-direction styles and restart behavior need an explicit audit.
- Locale JSON key parity exists in the current snapshot, but no completeness or placeholder validator exists.

## Design

### 1. Keep one translation boundary

All app-owned UI copy resolves through `useTranslation()` or a small typed helper that receives the current i18n context. New code uses semantic keys, never source-text hashes. Existing hashed exercise-copy keys remain stable during migration and are replaced incrementally where practical.

The eight existing namespaces remain the ownership model:

`common`, `home`, `journal`, `onboarding`, `exercises`, `journeys`, `habits`, and `settings`.

Feature-specific copy belongs to its feature namespace; shared controls and cross-feature states belong to `common`.

### 2. Separate UI chrome from bundled authored exercise copy

Shared exercise controls, headers, timers, feedback panels, retry states, and accessibility labels use normal translation keys. Bundled exercise configs use a typed copy resolver so authored fields are localized without changing answer IDs, field keys, option IDs, scoring rules, telemetry names, or response shapes.

The resolver must translate declared copy fields only and leave machine fields and user responses unchanged. It must support interpolation values and preserve the existing English fallback while exposing missing keys in development validation.

### 3. Keep database content outside this change

Database-owned course content remains database-owned and is not silently translated on-device. If server content is later localized, that will require a separate content/data design. This plan only removes app-owned English fallbacks where they are UI chrome and localizes content that is actually bundled in the Expo application.

### 4. Make locale behavior deterministic

English is the bundled fallback. Device detection is used only when no explicit language preference exists. A “use device language” state must remain an unset preference rather than writing the detected language back to storage. Language changes persist only when explicitly selected. Locale-aware dates, numbers, plural forms, interpolation, and accessibility labels use the active language.

Arabic remains the RTL verification language. Switching into or out of RTL must use the existing iOS restart requirement and must not claim that layout changed before restart.

### 5. Verify with static and focused runtime checks

Verification covers JSON validity, namespace/key parity, interpolation parity, untranslated-key detection, remaining app-owned literals, type/lint status, language persistence, fallback, and RTL. Exercise verification follows the learning path: render, answer, evaluate, show feedback, retry, complete, and persist. No database content or schema test is added.

## Success Criteria

- No production Expo UI surface contains an unapproved hardcoded user-facing string.
- All eight locale bundles contain the same key structure and required interpolation variables.
- Bundled exercise copy is localized without changing evaluation IDs, stored response formats, or telemetry contracts.
- Explicit language selection persists; device-language mode follows the OS on a later foreground event.
- English fallback is intentional and observable, not an accidental hardcoded bypass.
- Arabic RTL has no known physical-direction regressions in reviewed production surfaces.
- `npm run lint` remains passing, and localization validation/type checks have documented pass criteria.

