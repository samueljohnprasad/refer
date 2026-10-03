# Feature Specification: App Localization (i18next + expo-localization)

**Feature Branch**: `026-app-localization`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "Implement full localization for the Happy app using i18next + react-i18next + expo-localization with OTA translation support, RTL, typed keys, and language switcher"

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - App Renders in Device Language (Priority: P1)

A user opens Happy with their iPhone set to French. The app displays all text in French without any manual action.

**Why this priority**: This is the core value of localization — users shouldn't have to configure anything to see their language. Failing this breaks every other localization story.

**Independent Test**: Change device language to French in iOS Settings, kill and relaunch Happy. All visible labels, navigation, exercise prompts, and button copy appear in French.

**Acceptance Scenarios**:

1. **Given** a device set to a supported language (French), **When** the user opens the app, **Then** all text is displayed in French
2. **Given** a device set to an unsupported language (e.g., Thai), **When** the user opens the app, **Then** all text falls back to English
3. **Given** the device language is Arabic (RTL), **When** the user opens the app, **Then** layouts mirror correctly right-to-left

---

### User Story 2 - User Changes Language in Settings (Priority: P2)

A bilingual user (English/Spanish) wants to switch the app to Spanish without changing their iPhone language.

**Why this priority**: Power users need in-app language control. This also enables QA testing across languages without device resets.

**Independent Test**: Open Settings → Language → select Español. App immediately reflects Spanish. Close and reopen — Spanish persists.

**Acceptance Scenarios**:

1. **Given** the user is on the Language settings screen, **When** they select Español, **Then** the app updates all text to Spanish without requiring a restart (except RTL changes)
2. **Given** a language was explicitly set, **When** the user closes and reopens the app, **Then** the selected language is remembered
3. **Given** the user selects "Use Device Language", **When** confirmed, **Then** the app reverts to following device locale

---

### User Story 3 - Copy Fixes Delivered Without App Update (Priority: P3)

The content team notices a translation error in the French exercises. They want to fix it without going through a 7-day App Store review cycle.

**Why this priority**: Enables fast iteration on translation quality. Direct business value for content/marketing teams.

**Independent Test**: Update a French translation JSON on the CDN. Next time the app fetches translations (foreground after 24h), the corrected copy appears automatically.

**Acceptance Scenarios**:

1. **Given** a translation JSON is updated on the CDN, **When** the app fetches fresh translations, **Then** the updated copy appears without any app release
2. **Given** the device is offline, **When** the app launches, **Then** it displays the bundled English fallback translations instead of failing
3. **Given** the CDN is unreachable, **When** the app launches, **Then** no crash occurs and bundled translations load normally

---

### Edge Cases

- What happens when a translation key is missing in a non-English locale? → Falls back to English string; dev console warns in debug builds
- What happens when RTL language (Arabic) is selected on iOS? → A restart prompt appears, RTL takes effect after restart
- What happens if `getLocales()` returns an empty array? → App defaults to English
- What happens if AsyncStorage read fails at launch? → App defaults to device language and continues normally

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The app MUST display all user-facing text using the active locale translation files (no hardcoded strings in UI components)
- **FR-002**: The app MUST detect the device language at first launch and apply it automatically if it is a supported language
- **FR-003**: The app MUST fall back to English for any unsupported device language
- **FR-004**: The app MUST persist the user's explicit language choice across app restarts
- **FR-005**: The app MUST load translation strings for the active language from a remote CDN on each foreground session (when online)
- **FR-006**: The app MUST bundle English translations as an offline fallback so the app is fully usable without a network connection
- **FR-007**: The app MUST support namespace-split translations: `common`, `exercises`, `journal`, `habits`, `settings`
- **FR-008**: The app MUST support RTL layout for Arabic and other RTL languages via the OS layout direction mechanism
- **FR-009**: The app MUST expose a language picker in Settings allowing users to switch to any supported language
- **FR-010**: All translation keys MUST be TypeScript-typed (no `any`) so missing keys are caught at compile time
- **FR-011**: The app MUST log missing translation keys in development builds without crashing
- **FR-012**: The app MUST refresh locale detection when returning from background on iOS (iOS locale is session-static)

### Key Entities

- **SupportedLanguage**: Enum of supported locale codes (`en`, `fr`, `de`, `es`, `ar`, `pt`, `it`, `zh`). Governs which languages are selectable and which CDN paths are requested.
- **TranslationNamespace**: Feature-scoped translation file group (`common`, `exercises`, `journal`, `habits`, `settings`). Each namespace maps to a JSON file per locale.
- **LanguagePreference**: The stored user choice (or absence of one) that determines whether the app follows device locale or a pinned language.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user with a French device sees the app fully in French on first launch — no configuration required
- **SC-002**: Language switching in Settings takes effect in under 2 seconds (excluding RTL restart)
- **SC-003**: A content fix deployed to the CDN reaches 100% of online users within one foreground session after the fix is published
- **SC-004**: The app launches and operates normally with all text visible when offline (English fallback)
- **SC-005**: Zero TypeScript compilation errors related to translation key access (`npx tsc --noEmit` passes)
- **SC-006**: All 8 supported languages display correct copy with no visible English placeholder strings

---

## Assumptions

- Supported languages for v1: English, French, German, Spanish, Arabic, Portuguese, Italian, Chinese (Simplified). Additional languages can be added by uploading new JSON files to CDN with no code change.
- CDN URL base (`https://cdn.happy.app/locales/`) is provisioned before implementation begins. Developers will use a local file server or bundled resources during development.
- RTL support is limited to Arabic in v1. A system restart prompt is acceptable for RTL language switches on iOS (React Native requirement).
- Translation JSON files for all 8 languages will be produced by a professional translation service before the feature ships. Implementation does not include translation writing.
- `@react-native-async-storage/async-storage` is already used elsewhere in the app (confirmed via package.json).
- The Settings screen already exists; this feature adds a Language subsection to it.
- The app targets iOS 26+ only. Android support is explicitly out of scope.
