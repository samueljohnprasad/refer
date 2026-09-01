# Implementation Plan: Staged Test Builder

**Branch**: `009-staged-test-builder` | **Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/009-staged-test-builder/spec.md`

## Summary

Refactor the `IfThenPlan` (Set up the next small test) exercise into a staged interaction builder with three distinct states: choose trigger, choose action (filtered), and review summary. Ensures one decision per screen, no premature CTAs, and highly reusable components (standard cards and option buttons).

## Technical Context

**Language/Version**: TypeScript, React Native
**Primary Dependencies**: Expo, Expo Router, React Native
**Storage**: Redux store (persisted state via `V1CategoryEngineProps`)
**Testing**: iOS Simulator, Expo Go
**Target Platform**: iOS 26+
**Project Type**: Mobile App
**Performance Goals**: Fluid layout transitions between states without layout thrashing; 60fps animations
**Constraints**: Follow Constitution (one decision per screen, reusable components only, calm brand colors).
**Scale/Scope**: Refactor `IfThenPlanCategoryEngine` and `IfThenPlan` content config to support nested dependencies instead of two flat arrays.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- I. One Learning Job Per Exercise: PASS - the staging directly supports this by separating the choices.
- II. One Active Decision or Control at a Time: PASS - explicitly designed to fulfill this.
- III. Resumable, Deterministic State: PASS - state indices will be stored deterministically.
- IV. Internal Buttons Update; Only Final Continue Advances: PASS - "Save to My Plans" moves to completion.
- V. Private Data: PASS - storing indices/IDs.
- VI. Premium, Editorial, Calm Design: PASS - reusing existing components.
- VII. Minimal, Ponytail-Mode Code: PASS - standard hooks, no 300+ line files, reusing generic option buttons.
- Exercise Constraint: Do not make UI components specific to a single exercise. Always extract and use generic, highly reusable shared components (e.g., standard cards, option buttons) across all exercises. PASS.

## Project Structure

### Documentation (this feature)

```text
specs/009-staged-test-builder/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output ($speckit-plan command)
├── data-model.md        # Phase 1 output ($speckit-plan command)
├── quickstart.md        # Phase 1 output ($speckit-plan command)
└── tasks.md             # Phase 2 output ($speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── exercise/
│       ├── IfThenPlanCategoryEngine.tsx
│       ├── CourseExerciseOptionButton.tsx (reused)
│       └── CourseExerciseShell.tsx (reused)
└── exercises/
    └── IfThenPlan/
        └── config.ts
```

**Structure Decision**: Refactor existing components. No new folders needed.
