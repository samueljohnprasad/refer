# Data Model: Config-Driven Plugin Architecture

**Feature**: `specs/015-config-driven-architecture`  
**Date**: 2026-09-03

---

## Entities

### 1. AppConfig (root configuration payload)

The single authoritative config document loaded at bootstrap.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | `string` (semver) | ✅ | Schema version for forward compatibility checks |
| `plugins` | `Record<string, PluginConfig>` | ✅ | Map of plugin ID → plugin-level config |
| `theme` | `ThemeConfig` | ✅ | Design token overrides (colors, spacing scale) |
| `content` | `ContentConfig` | ✅ | All user-facing strings and labels (no hardcoding) |

**Validation rules**:
- `version` must match a supported semver range declared by the loader.
- `plugins` keys must match registered plugin IDs exactly; unknown keys produce a warning, not an error.
- No field may contain therapeutic text, PII, or user-generated content.

---

### 2. PluginConfig (per-plugin configuration slice)

Nested under `AppConfig.plugins[pluginId]`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | `boolean` | ✅ | Whether the plugin is active in this environment |
| `settings` | `Record<string, unknown>` | ❌ | Plugin-specific typed settings (each plugin declares its own settings sub-schema) |

**Validation rules**:
- `enabled` is strictly boolean; strings like `"true"` are rejected.
- `settings` is validated by the owning plugin's own schema declaration (not by the core).

---

### 3. PluginContract (the interface every plugin must implement)

| Field / Method | Type | Description |
|----------------|------|-------------|
| `id` | `string` | Globally unique identifier. Must match the key in `AppConfig.plugins`. |
| `version` | `string` | Plugin semver. Logged at bootstrap for diagnostics. |
| `dependencies` | `string[]` | IDs of other plugins this plugin requires to be active. Orchestrator validates at boot. |
| `initialize(config: PluginConfig): void` | function | Called once per app session when plugin is activated. Must be idempotent. |
| `teardown?(): void` | function (optional) | Called if plugin is deactivated. Must clean up subscriptions and side effects. |
| `routes?: RouteDefinition[]` | optional | Expo Router route definitions contributed by this plugin. |
| `storeSlices?: StoreSlice[]` | optional | Redux Toolkit slices contributed to the global store. |

**State transitions**:

```
UNREGISTERED → (register()) → REGISTERED
REGISTERED   → (Orchestrator + enabled:true) → ACTIVE
REGISTERED   → (Orchestrator + enabled:false) → SKIPPED
ACTIVE       → (teardown()) → INACTIVE
```

---

### 4. ThemeConfig

| Field | Type | Description |
|-------|------|-------------|
| `colorOverrides` | `Partial<Record<TokenKey, string>>` | Override named design tokens at runtime. Must reference existing keys from `lib/tokens.ts`. |

**Validation rules**:
- Keys must be a valid `TokenKey` (enforced by TypeScript type).
- Raw hex values must match `#rrggbb` or `#rrggbbaa` format.

---

### 5. ContentConfig

All user-visible strings live here. No hardcoded strings in component source files.

| Field | Type | Description |
|-------|------|-------------|
| `strings` | `Record<string, string>` | Key → display string. Keys are dot-notation paths (e.g. `rewards.chestCTA`). |
| `locale` | `string` | BCP-47 locale tag (e.g. `en`). Single locale for MVP; i18n extension deferred. |

**Validation rules**:
- No string value may contain medical advice, diagnostic language, or treatment claims.
- Keys must be consumed by at least one active component (linter enforces no orphaned keys).

---

## Relationships

```
AppConfig
  ├── plugins: Record<id, PluginConfig>   (1-to-many)
  ├── theme: ThemeConfig                   (1-to-1)
  └── content: ContentConfig              (1-to-1)

PluginRegistry
  └── registered plugins: PluginContract[]   (collection)

Orchestrator
  ├── reads: AppConfig
  ├── reads: PluginRegistry
  └── activates: PluginContract (where AppConfig.plugins[id].enabled === true)
```
