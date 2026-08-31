# Implementation Plan: Global Semantic Color System Refactor

**Branch**: `007-semantic-color-system` | **Date**: 2026-08-30 | **Spec**: [spec.md](./spec.md)

**Input**: "remove the legacy"

## Summary

This feature replaces the overlapping, fragmented token layers with a single, highly structured semantic token architecture that scales across the entire product. Crucially, it completely removes the legacy systems (`SAGE.selected`, `BRAND_*`, `THEME`, `LIGHT_TOKENS`, `DARK_TOKENS`, `COURSE_EXERCISE_COLORS`, `CREAM`, `WARM_WHITE`). It separates primitive palettes from semantic roles, introduces first-class `selection` and `disabled` states, decouples `brand` from `success`, ensures WCAG-compliant contrast for `muted` and `warning` text, supports high-contrast accessibility variants, and standardizes elevation.

## Technical Context

**Language/Version**: TypeScript

**Primary Dependencies**: React Native (`DynamicColorIOS`)

**Storage**: N/A

**Testing**: Visual verification in Expo Go / iOS Simulator and TS compilation.

**Target Platform**: iOS

**Project Type**: Mobile App

**Performance Goals**: N/A

**Constraints**: Must completely purge all legacy alias systems and duplication. 

**Scale/Scope**: Massive. Refactors the global theme architecture in `src/theme/` and ripples across the entire app's components to consume the new `SEMANTIC_COLORS` API while simultaneously deleting all deprecated token exports.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **ponytail mode**: Adhered to (eliminates redundant abstraction layers and competing APIs, making the system vastly simpler to consume).
- **impeccable skill**: Adhered to (forces intentional, distinct states for selection vs. correctness, proper elevation over basic shadows, and strict contrast ratios).
- **frontend-clean-architecture**: Adhered to (creates a strict, unidirectional dependency from Primitive Palette -> Semantic Brand Tokens -> Components).

## Project Structure

### Documentation

```text
specs/007-semantic-color-system/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (to be generated later)
```

### Source Code

```text
src/theme/
├── palette.ts         # Primitive raw colors (SAGE, NEUTRAL, RED, ORANGE, etc.)
├── colors.ts          # SEMANTIC_COLORS (The single public API)
├── typography.ts      
├── spacing.ts         
├── radius.ts          
└── elevation.ts       # Elevation shadows
```

**Structure Decision**: The token definitions will be completely moved and structured inside `src/theme/`. All legacy files (e.g., `lib/tokens.ts` if completely replaced) will be deprecated or gutted. All components will import exclusively from `src/theme/`.

## Complexity Tracking

No violations to track. The redesign actively removes complexity by unifying 5+ overlapping token systems into 1 and actively deleting the legacy code.

## Integration with Tailwind (global.css)

As mandated, the `SemanticColors` system will be explicitly bridged into the `global.css` architecture. Instead of solely relying on runtime React Native helpers (like `DynamicColorIOS`), the semantic layer will be exported as CSS variables in `global.css` to allow native Tailwind v4 class usage (`bg-brand-primary`, `text-text-secondary`, `border-border-selected`). 

This ensures that developers can utilize the semantic color system identically via raw TypeScript (`SEMANTIC_COLORS.brand.primary`) OR via Tailwind styling (`className="bg-brand-primary"`), keeping the design system universally accessible and eliminating the need for inline style overrides.
