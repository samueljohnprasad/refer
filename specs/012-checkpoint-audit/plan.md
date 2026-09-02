# Implementation Plan: Sleep Science Checkpoint UI/UX & Learning Flow Audit

**Branch**: `012-checkpoint-audit` | **Date**: 2026-09-02 | **Spec**: specs/012-checkpoint-audit/spec.md

**Input**: Feature specification from `specs/012-checkpoint-audit/spec.md`

## Summary

Refactor the `CourseCheckpoint` exercise into a fast, non-punitive retrieval & causal reinforcement engine. Replace heavy school-test copy with warm reassurance, remove fake "Try again" loops and disabled placeholder buttons, render explanations on soft neutral learning surfaces (no large pink error cards), isolate red styling to incorrect option badges, and wire up question-level progress tracking (`Question 1 of 4`).

## Technical Context

**Language/Version**: TypeScript 5.x / React Native (Expo)
**Primary Dependencies**: `react-native-reanimated`, `expo-haptics`, NativeWind
**Target Platform**: iOS / Mobile Web
**Project Type**: mobile-app
**Performance Goals**: Instantaneous screen transitions with smooth layout animations (60fps)
**Scale/Scope**: Refactoring `CourseCheckpointCategoryEngine.tsx`, category registry/config, and seed curriculum data.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*
- **Principle I (Think Before Coding / Clear Models)**: Solves the root UX problem of test anxiety by shifting from evaluation to retrieval practice and causal repair.
- **Principle II (Simplicity & YAGNI)**: Eliminates dead-end "Try again" loops, removes disabled placeholder buttons, and cuts redundant copy.
- **Principle III (Surgical Changes)**: Keeps edits targeted to checkpoint engine, registry config, and database seed content.
- **Principle IV (Design System Consistency)**: Enforces unified tokens (cream/sage surfaces, restrained error red, rounded cards, forest green headers).

## Project Structure

### Documentation (this feature)

```text
specs/012-checkpoint-audit/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── checklists/
    └── requirements.md
```

### Source Code

```text
src/
├── components/
│   ├── exercise/
│   │   ├── CourseCheckpointCategoryEngine.tsx
│   │   ├── courseCheckpointContent.ts
│   │   ├── courseExerciseFinalBatchRegistry.ts
│   │   └── courseExerciseCategoryConfig.ts
│   └── node/
│       ├── NodeEngineRouter.tsx
│       └── NodeExerciseScreen.tsx
supabase/
└── seed/
    └── sleep_reset_section_1.sql
```

## Complexity Tracking

No architectural violations. Adheres to clean React Native functional components under 300 lines with single responsibility.
