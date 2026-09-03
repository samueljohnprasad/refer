# Implementation Plan: Config-Driven Plugin Architecture

**Branch**: `015-config-driven-architecture` | **Date**: 2026-09-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/015-config-driven-architecture/spec.md`

---

## Summary

Establish a config-driven, plugin/plug-out domain architecture for the Happy app. All business rules, thresholds, display values, and feature availability are externalized to a typed configuration schema. Domain capabilities are implemented as independent bounded-context modules that register themselves through a shared plugin registry; the Core Orchestrator depends only on the registry interface, never on concrete domains. DRY, SRP, YAGNI, and no-hardcoding constraints are enforced at the code-structure and lint level.

---

## Technical Context

**Language/Version**: TypeScript (strict)

**Primary Dependencies**: Expo Router (routing), Redux Toolkit (global state), NativeWind/Tailwind (styles), React Native — all existing. No new dependencies introduced.

**Storage**: Existing local persistence layer (as used by other features in the app).

**Testing**: TypeScript type-checker (`npx tsc --noEmit`) + iOS Simulator visual verification per project constitution. No automated test suites authored.

**Target Platform**: iOS 26+ (per constitution)

**Project Type**: Mobile app (Expo / React Native)

**Performance Goals**: Plugin bootstrap must not add perceptible delay to app startup. Config load must complete synchronously or with a fast async waterfall before the first screen renders.

**Constraints**: No new state-management libraries. No Android support. Components/hooks/helpers ≤ 300 lines (constitution). No inline styles except dynamic values.

**Scale/Scope**: Designed to support the existing and upcoming feature domains in the app (~10 plugins). Not pre-built for a hypothetical plugin marketplace.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| **I. One Learning Job Per Exercise** | ✅ PASS | This feature is infrastructure, not an exercise. No learning interaction is affected. |
| **II. One Active Decision at a Time** | ✅ PASS | No user-facing UI is changed. Plugin registration is sequential and deterministic. |
| **III. Resumable, Deterministic State** | ✅ PASS | Config is loaded once at bootstrap; plugins must not hold conflicting ephemeral state. |
| **IV. Internal Buttons / Continue Advances** | ✅ PASS | No exercise UI is touched. |
| **V. Private Data — Store IDs and State Only** | ✅ PASS | Config schema must not include PII or therapeutic text. Keys only. |
| **VI. Premium, Editorial, Calm Design** | ✅ PASS | No visual changes. Design tokens remain in `lib/tokens.ts`. |
| **VII. Minimal, Ponytail-Mode Code (YAGNI)** | ✅ PASS | Architecture mandates smallest usable plugin interface; no speculative APIs. |

**No violations. Gate passed.**

---

## Project Structure

### Documentation (this feature)

```text
specs/015-config-driven-architecture/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── contracts/
│   └── plugin-interface.md   ← Phase 1 output
├── quickstart.md        ← Phase 1 output
└── tasks.md             ← Phase 2 output ($speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── core/
│   ├── config/
│   │   ├── schema.ts          # Zod-validated config type (single source of truth)
│   │   ├── loader.ts          # Loads + validates the config at bootstrap
│   │   └── index.ts           # Re-exports
│   ├── registry/
│   │   ├── PluginRegistry.ts  # Singleton registry — register/resolve plugins
│   │   └── index.ts
│   └── orchestrator/
│       ├── Orchestrator.ts    # Reads registry; bootstraps active plugins only
│       └── index.ts
├── plugins/               # One folder per bounded-context domain
│   ├── rewards/           # Example: course rewards feature
│   │   ├── config.ts      # Domain config slice type
│   │   ├── plugin.ts      # Implements PluginContract
│   │   ├── store/
│   │   ├── hooks/
│   │   └── components/
│   └── [other-domain]/
├── shared/
│   ├── components/        # Extracted reusable UI primitives (DRY)
│   ├── hooks/
│   └── types/
└── constants/             # All non-config compile-time constants (e.g. route names)

config/
└── app.config.json        # Runtime config payload (no hardcoded values in src/)
```

**Structure Decision**: Single-project mobile layout. Feature domains live under `src/plugins/`, each self-contained. Cross-cutting shared code lives under `src/shared/`. Core bootstrap infrastructure lives under `src/core/`. Config payload lives in `config/` at the repo root (outside `src/` so it can be swapped without code changes).

---

## Complexity Tracking

*No constitution violations requiring justification.*
