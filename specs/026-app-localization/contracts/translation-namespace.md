# Contract: Translation Namespace Schema

**Feature**: 026-app-localization
**Date**: 2026-10-03

---

## Overview

This contract defines the interface between the Happy app and its translation files, whether bundled locally or served from CDN. It governs file naming, JSON key format, plural key conventions, CDN URL structure, and the offline fallback boundary.

---

## 1. CDN URL Contract

**Pattern**: `{CDN_BASE}/{lang}/{namespace}.json`

**CDN_BASE**: `https://cdn.happy.app/locales`

**Examples**:
- `https://cdn.happy.app/locales/fr/common.json`
- `https://cdn.happy.app/locales/ar/exercises.json`
- `https://cdn.happy.app/locales/zh/habits.json`

**Requirements**:
- Response MUST be `Content-Type: application/json`
- Response MUST be a flat or nested JSON object (no JSON arrays at root)
- Response MUST use UTF-8 encoding
- CDN MUST serve via HTTPS
- Cache lifetime: minimum 1 hour (`Cache-Control: max-age=3600`)
- Cache busting: use `?v=N` query param in `i18next-http-backend` config when deploying breaking changes

---

## 2. Namespace File Contract

Each locale folder MUST contain exactly these 5 files:

| File | Namespace key | Loaded for screens |
|:---|:---|:---|
| `common.json` | `'common'` | All screens |
| `exercises.json` | `'exercises'` | Exercise flow |
| `journal.json` | `'journal'` | Journal screens |
| `habits.json` | `'habits'` | Habits tracker |
| `settings.json` | `'settings'` | Settings + language picker |

Missing files trigger fallback to English equivalent. No error thrown to user.

---

## 3. JSON Key Format Contract

**Format**: Nested JSON, dot-notation addressing, camelCase keys

```json
{
  "category": {
    "subcategory": {
      "label": "Translated string here"
    }
  }
}
```

**Interpolation** (variables inside strings):
- Use `{{variableName}}` syntax
- Example: `"greeting": "Hello, {{name}}!"`

**Plurals** (`compatibilityJSON: 'v3'` format — required for React Native):
- `_one` suffix for singular
- `_other` suffix for plural (and default)
- Example:
  ```json
  {
    "streak": {
      "message_one": "{{count}} day streak!",
      "message_other": "{{count}} day streak!"
    }
  }
  ```
- Called with: `t('streak.message', { count: 7 })`

**Prohibited**:
- Arrays at any level (use indexed keys if needed: `item_0`, `item_1`)
- Null values (use empty string `""` for intentionally blank)
- HTML tags in translation strings (React Native renders raw text)

---

## 4. Supported Languages Contract

| Code | Language | RTL | v1 Bundled (EN only) |
|:---|:---|:---|:---|
| `en` | English | No | ✅ Bundled |
| `fr` | French | No | CDN only |
| `de` | German | No | CDN only |
| `es` | Spanish | No | CDN only |
| `ar` | Arabic | **Yes** | CDN only |
| `pt` | Portuguese | No | CDN only |
| `it` | Italian | No | CDN only |
| `zh` | Chinese (Simplified) | No | CDN only |

**Adding a new language**: Add locale code to `SUPPORTED_LANGUAGES` in `src/lib/i18n/index.ts`, upload 5 JSON files to CDN. No App Store release required.

---

## 5. `useLanguage` Hook Contract

```typescript
interface UseLanguageReturn {
  currentLanguage: string;           // Active locale code: 'en', 'fr', etc.
  isRTL: boolean;                    // True when active language is RTL
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  resetToDeviceLanguage: () => Promise<void>;
}
```

**Guarantees**:
- `setLanguage()` persists choice to AsyncStorage AND updates i18n engine atomically
- `resetToDeviceLanguage()` removes AsyncStorage preference AND reverts to device locale
- `isRTL` updates synchronously (layout reflects after app restart on iOS for RTL changes)

---

## 6. initI18n() Contract

```typescript
export async function initI18n(): Promise<void>
```

**Guarantees**:
- Idempotent: safe to call multiple times (guarded by `i18n.isInitialized`)
- Reads language preference from AsyncStorage first; falls back to device locale
- Applies RTL settings before i18n engine initializes
- If AsyncStorage read fails: silently defaults to device locale

**Called from**: `app/_layout.tsx` → `useEffect` at root layout mount (once)

---

## 7. changeLanguage() Contract

```typescript
export async function changeLanguage(lang: SupportedLanguage): Promise<void>
```

**Guarantees**:
- Writes new preference to AsyncStorage
- Applies RTL flags via `I18nManager`
- Calls `i18n.changeLanguage(lang)` — triggers re-render of all `useTranslation` consumers
- Does NOT reload the app (caller must prompt user for RTL languages)
