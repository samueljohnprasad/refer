# Data Model: App Localization (026)

**Date**: 2026-10-03

---

## Core Entities

### SupportedLanguage (type alias)

```typescript
const SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es', 'ar', 'pt', 'it', 'zh'] as const;
type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
// 'en' | 'fr' | 'de' | 'es' | 'ar' | 'pt' | 'it' | 'zh'
```

**Validation rules**:
- Any language code not in this tuple falls back to `'en'`
- RTL languages subset: `['ar']` (v1 scope; extensible array)
- Read from `Localization.getLocales()[0].languageCode` — split on `-` for region-agnostic match (e.g., `'en-AU'` → `'en'`)

---

### LanguagePreference (AsyncStorage record)

| Field | Type | Description |
|:---|:---|:---|
| `key` | `'@happy/language'` | Fixed AsyncStorage key |
| `value` | `SupportedLanguage \| null` | `null` = follow device locale |

**State transitions**:

```
null (follow device)
  ↓ user selects language
SupportedLanguage ('fr')
  ↓ user resets to device
null (follow device)
```

**Validation rules**:
- On read: if stored value not in `SUPPORTED_LANGUAGES`, treat as `null` (device fallback)
- On write: only values from `SUPPORTED_LANGUAGES` allowed
- Read failure (AsyncStorage error): default to device locale, do not crash

---

### TranslationNamespace (enum-like)

| Namespace | File pattern | Primary consumers |
|:---|:---|:---|
| `common` | `{lng}/common.json` | All screens (buttons, errors, nav labels) |
| `exercises` | `{lng}/exercises.json` | Exercise screens |
| `journal` | `{lng}/journal.json` | Journal screens |
| `habits` | `{lng}/habits.json` | Habits tracker screen |
| `settings` | `{lng}/settings.json` | Settings screen, language picker |

**Validation rules**:
- Missing namespace falls back to `defaultNS: 'common'`
- Missing key in active locale falls back to English value; dev console warns

---

### TranslationCatalog (structure per locale)

Each locale directory contains exactly these 5 JSON files:

```text
src/locales/{lng}/
  common.json
  exercises.json
  journal.json
  habits.json
  settings.json
```

**Key naming convention**: `category.subcategory.label` in camelCase, e.g.:
- `navigation.home`
- `streak.message_one` / `streak.message_other` (plural)
- `exercises.cbt.thoughtReframing.title`

**Plural keys** (i18next `compatibilityJSON: 'v3'` format):
```json
{
  "streak": {
    "message_one": "{{count}} day streak!",
    "message_other": "{{count}} day streak!"
  }
}
```

---

### I18nState (runtime, in-memory)

Not persisted. Represents the live i18next instance state.

| Field | Type | Notes |
|:---|:---|:---|
| `language` | `SupportedLanguage` | Active language code |
| `isInitialized` | `boolean` | Guard against double-init |
| `dir()` | `'ltr' \| 'rtl'` | Derived from active language |

---

### RTLState (React Native I18nManager)

| Flag | Value for LTR | Value for Arabic |
|:---|:---|:---|
| `allowRTL` | `false` | `true` |
| `forceRTL` | `false` | `true` |

**Important**: Both flags must be set before i18n init and after every language change. Takes effect after app restart on iOS.

---

## Entity Relationships

```
LanguagePreference (AsyncStorage)
       │
       ▼ read at initI18n()
SupportedLanguage  ──────────────── RTLState (I18nManager)
       │
       ▼ set as i18n.lng
TranslationCatalog
  ├── common.json    (bundled EN + CDN for others)
  ├── exercises.json
  ├── journal.json
  ├── habits.json
  └── settings.json
       │
       ▼ rendered via useTranslation(namespace)
UI Components
```
