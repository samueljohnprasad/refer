# Plugin Interface Contract

**Feature**: `specs/015-config-driven-architecture`  
**Version**: 1.0.0  
**Date**: 2026-09-03

---

## Purpose

This contract defines the **exact interface** every domain plugin must satisfy to integrate with the Core Orchestrator. It is the only cross-boundary coupling between the core and any domain. A plugin that does not satisfy this contract will not be loadable.

---

## Plugin Self-Registration

Every plugin module must call `PluginRegistry.register(plugin)` exactly once during module initialization (i.e. at import time, before the Orchestrator runs).

```
Registration call: PluginRegistry.register(plugin: PluginContract)
Timing: synchronous, at module load
Idempotency: re-registering the same id is a runtime error
```

---

## PluginContract Interface

```
interface PluginContract {
  // ─── Identity ───────────────────────────────────────────────────────────────
  readonly id: string
    // Globally unique. Must exactly match the key in AppConfig.plugins.
    // Allowed characters: [a-z0-9-]. No spaces, no uppercase.

  readonly version: string
    // Semver string (e.g. "1.0.0"). Logged at bootstrap; not enforced by core.

  // ─── Dependency Declaration ──────────────────────────────────────────────────
  readonly dependencies: ReadonlyArray<string>
    // IDs of other plugins that must be ACTIVE before this plugin can initialize.
    // Core refuses to boot if a dependency is missing or disabled.
    // Use [] if no dependencies.

  // ─── Lifecycle ───────────────────────────────────────────────────────────────
  initialize(config: PluginConfig): void
    // Called once per app session when the plugin is activated.
    // MUST be idempotent (safe to call again after a hot reload).
    // MUST NOT perform async operations that block the Orchestrator.
    // MUST NOT import from other domain plugin folders.

  teardown?(): void
    // Optional. Called if the plugin transitions from ACTIVE → INACTIVE.
    // MUST unsubscribe all listeners and clear side effects.

  // ─── Contributions (all optional) ────────────────────────────────────────────
  routes?: ReadonlyArray<RouteDefinition>
    // Expo Router route definitions contributed to the app routing tree.

  storeSlices?: ReadonlyArray<StoreSlice>
    // Redux Toolkit slices contributed to the global store at bootstrap.
}
```

---

## RouteDefinition Shape

```
interface RouteDefinition {
  path: string         // Expo Router path string (e.g. "/(tabs)/rewards")
  component: () => React.ComponentType<unknown>   // Lazy import factory
}
```

---

## PluginConfig Shape (from AppConfig)

```
interface PluginConfig {
  enabled: boolean
  settings: Record<string, unknown>   // Plugin-specific; validated by plugin's own schema
}
```

---

## Orchestrator Contract (what plugins may rely on)

The Orchestrator guarantees:

1. `initialize()` is called **after** all declared `dependencies` have been initialized.
2. `initialize()` is called **at most once** per plugin per app session.
3. `teardown()` (if present) is called before the plugin's store slices and routes are removed.
4. The Orchestrator never directly imports from a domain plugin folder. It depends only on `PluginRegistry`.

---

## Prohibited Patterns (contract violations)

| Pattern | Reason |
|---------|--------|
| Import from another domain's folder | Breaks DDD boundary; creates cyclic dep risk |
| Hardcoded string or number in plugin source | Violates no-hardcoding constraint; use `AppConfig.content` |
| Async `initialize()` that blocks Orchestrator | Undefined boot order; use lazy loading within the plugin |
| Re-registering same `id` | Registry enforces uniqueness; second call throws |
| Storing therapeutic text in Redux state | Violates Constitution Principle V |

---

## Example Plugin Skeleton (reference only)

```
// plugins/rewards/plugin.ts
import { PluginRegistry } from '@/core/registry'
import type { PluginContract, PluginConfig } from '@/core/registry'
import { rewardsSlice } from './store/rewardsSlice'

const rewardsPlugin: PluginContract = {
  id: 'rewards',
  version: '1.0.0',
  dependencies: [],

  initialize(config: PluginConfig): void {
    // ponytail: minimal — just validate settings shape and ready state
  },

  storeSlices: [rewardsSlice],
}

PluginRegistry.register(rewardsPlugin)
export default rewardsPlugin
```

This is illustrative only. Implementation details belong in `tasks.md`.
