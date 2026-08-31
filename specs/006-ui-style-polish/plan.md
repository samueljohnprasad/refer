# Implementation Plan: UI Style Polish

**Branch**: `006-ui-style-polish` | **Date**: 2026-08-30 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/006-ui-style-polish/spec.md`

## Summary

This feature applies the final 10% of UI refinements to the journey map exercises. The technical approach involves targeting the precise style objects in `CourseExerciseFeedbackPanel.tsx`, `IntuitionCheckCategoryEngine.tsx`, and `CourseExerciseShell.tsx` to reduce the feedback icon size, soften the CTA shadow depth, and mute the Skip button typography.

## Technical Context

**Language/Version**: TypeScript (React Native)

**Primary Dependencies**: Expo, React Native SVG (`SvgAppButton`)

**Storage**: N/A

**Testing**: Visual regression via iOS Simulator

**Target Platform**: iOS

**Project Type**: Mobile App

**Performance Goals**: N/A (UI style changes)

**Constraints**: Adherence to the existing `courseExerciseTheme.ts` color tokens.

**Scale/Scope**: ~3 component files modified.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **talk like caveman**: Adhered to (implementation tasks will be minimal).
- **ponytail mode**: Adhered to (no new abstractions, just direct style edits).
- **impeccable skill**: Adhered to (UI refinements follow high-end design intelligence).
- **frontend-clean-architecture**: Adhered to (styling modifications remain in the UI layer).

## Project Structure

### Documentation (this feature)

```text
specs/006-ui-style-polish/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (to be created)
```

### Source Code (repository root)

```text
src/
└── components/
    └── exercise/
        ├── CourseExerciseFeedbackPanel.tsx
        ├── IntuitionCheckCategoryEngine.tsx
        └── CourseExerciseShell.tsx
```

**Structure Decision**: The modifications are isolated to the existing UI components in the `src/components/exercise/` directory. No new files or architectural changes are required.

## Complexity Tracking

No violations to track.
