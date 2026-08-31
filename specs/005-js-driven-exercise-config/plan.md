# Implementation Plan: JS-Driven Exercise Config for Journey Map Exercises

**Branch**: `005-js-driven-exercise-config` | **Date**: 2026-08-30 | **Spec**: [spec.md](../spec.md)

**Input**: Feature specification from `/specs/005-js-driven-exercise-config/spec.md`

## Summary

Expand `CourseExerciseCategoryConfig` to include semantic configuration groups (e.g. presentation, layout, feedback, validation) in order to eliminate scattered identity-based conditional logic (`category === ...`) across the codebase, particularly in `microlearningContentValidation.ts` and the 7 legacy `*BatchTransition.ts` files.

## Technical Context

**Language/Version**: TypeScript / React Native

**Primary Dependencies**: Expo Router, React Native

**Storage**: N/A (Hardcoded configurations in code)

**Testing**: Manual iOS simulator testing and `tsc --noEmit` (no automated tests per Constitution)

**Target Platform**: iOS 26+

**Project Type**: Mobile app

**Performance Goals**: N/A (Compile-time config resolution)

**Constraints**: Strict typing without `any`, no functional or visual changes to existing exercises, O(1) complexity for validation dispatch.

**Scale/Scope**: Refactoring ~30 exercise engine configurations and 1 giant validation switch block.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. One Learning Job Per Exercise**: Maintained.
- [x] **II. One Active Decision or Control**: Maintained.
- [x] **III. Resumable, Deterministic State**: Maintained.
- [x] **IV. Internal Buttons Update**: Maintained.
- [x] **V. Private Data**: Maintained.
- [x] **VI. Premium, Editorial, Calm Design**: Maintained (no visual changes).
- [x] **VII. Minimal, Ponytail-Mode Code (YAGNI)**: Passes. We are actively removing duplicated conditional logic and simplifying the architecture.

## Project Structure

### Documentation (this feature)

```text
specs/005-js-driven-exercise-config/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   └── exercise/
│       ├── courseExerciseCategoryConfig.ts
│       ├── courseExerciseCategoryEngineRegistry.ts
│       └── microlearning/
│           └── microlearningContentValidation.ts
└── domains/
    └── journey/
        └── learning/
            ├── courseExercisePrimaryTransition.ts
            ├── courseExerciseBatchTransitions.ts
            └── *BatchTransition.ts (to be deleted)
```

**Structure Decision**: Code modifications are constrained to `src/components/exercise/` and `src/domains/journey/learning/` to unify validation, layout flags, and interaction state transitions within the new `CourseExerciseCategoryConfig` interface.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations.
