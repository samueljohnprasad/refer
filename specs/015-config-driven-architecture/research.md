# Research: Config-Driven Plugin Architecture

**Date**: 2026-09-03  
**Feature**: `specs/015-config-driven-architecture`

---

## 1. Config Validation Strategy

**Decision**: Typed config schema validated at bootstrap using a schema-declaration library (e.g., Zod or a lightweight TypeScript type assertion).  
**Rationale**: Runtime schema validation catches malformed configs before any plugin initializes, surfacing errors early with clear messages rather than crashing mid-render. Zod is already a transitive dependency in the Expo ecosystem (via numerous Expo libraries), so using it does not add a net-new dependency.  
**Alternatives considered**:  
- `JSON Schema` + `ajv`: valid but adds `ajv` explicitly; Zod integrates natively with TypeScript types.  
- Manual `if/else` guards: Not DRY, no type inference, high maintenance.

---

## 2. Plugin Registry Pattern

**Decision**: A lightweight singleton Plugin Registry object (not a framework) where each domain plugin self-registers via a `register(plugin: PluginContract)` call during module load.  
**Rationale**: Keeps the Orchestrator free of any direct imports from domain modules (SRP, dependency inversion). Adding a new domain = adding one `register()` call in the plugin's own `plugin.ts`; removing a domain = removing it from the active list in `app.config.json`. Zero core changes required (SC-2).  
**Alternatives considered**:  
- Third-party IoC container (InversifyJS, tsyringe): overkill for ~10 plugins; violates YAGNI.  
- Manual switch/case in Orchestrator: violates Open/Closed principle; every new plugin requires a core edit.

---

## 3. Cross-Domain Communication

**Decision**: Domain plugins communicate through the existing Redux Toolkit store (shared selectors/actions) or via explicit callback props. Direct cross-domain file imports are prohibited.  
**Rationale**: The app already uses Redux Toolkit for global state (constitution). This keeps communication explicit and traceable without introducing an event-bus library.  
**Alternatives considered**:  
- Custom event bus: additional dep, additional surface area; YAGNI since Redux already solves this.  
- Direct imports across domain folders: violates DDD boundary rules and creates cyclic deps.

---

## 4. No-Hardcoding Enforcement

**Decision**: ESLint rules (`no-magic-numbers`, custom `no-hardcoded-strings` rule) augment the existing lint config to flag violations at CI time.  
**Rationale**: Automated enforcement is the only reliable way to prevent regressions. Manual code review alone is insufficient at scale.  
**Alternatives considered**:  
- Runtime assertion on string literals: possible but noisy; lint-time is earlier and cheaper.

---

## 5. Plugin Activation Gate

**Decision**: Each plugin declares a string `id` matching a key in `app.config.json → plugins`. If the key is absent or `enabled: false`, the Orchestrator skips registration.  
**Rationale**: Simple key lookup is O(1), deterministic, and requires no runtime evaluation. Satisfies SC-2 (zero core code changes to toggle a plugin).  
**Alternatives considered**:  
- Remote feature flags (LaunchDarkly, etc.): introduces network dependency, latency, and an SDK. Out of scope per YAGNI.  
- File-system presence checks: fragile; breaks tree-shaking and bundle optimization.

---

## 6. DRY / Shared Component Strategy

**Decision**: Reusable UI primitives (buttons, cards, layout shells) already living in `components/ui/` are canonicalized as the shared component library. Any duplicate found in domain folders during discovery is moved here.  
**Rationale**: The constitution already mandates reusable shared components. This research step confirms the existing `components/ui/` directory is the correct target, not a new package.  
**Alternatives considered**:  
- A separate npm package for shared components: overly complex for a single-app repo; YAGNI.

---

## NEEDS CLARIFICATION Resolutions

*No items required clarification. All decisions above are based on existing project constraints from `constitution.md`, `AGENTS.md`, and the app's established dependencies.*
