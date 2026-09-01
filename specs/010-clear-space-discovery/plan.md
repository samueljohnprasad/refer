# Implementation Plan: Clear Space Guided Discovery

**Branch**: `010-clear-space-discovery` | **Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/010-clear-space-discovery/spec.md`

## Summary

Refactor the `ToolkitShelf` exercise engine (used for "Four valid ways to clear space") to use progressive disclosure. Instead of rendering the taxonomy of tools as a top carousel alongside the context choices, the interaction will be staged. State 1 will exclusively show the moment choices. Upon selection, State 2 will hide unselected moments, display the chosen moment in a selected brand state, and reveal the mapped tool/strategy as a clean, non-interactive information block.

## Technical Context

**Language/Version**: TypeScript, React Native

**Primary Dependencies**: Expo, React Native

**Storage**: Redux store (persisted state via `V1CategoryEngineProps`)

**Testing**: iOS Simulator, Expo Go

**Target Platform**: iOS 26+

**Project Type**: Mobile App

**Performance Goals**: 60fps layout transitions.

**Constraints**: Constitution constraints (One Active Decision, Reusable UI Components - specifically `CourseExerciseOptionButton`).

**Scale/Scope**: Refactor `src/components/exercise/ToolkitShelfCategoryEngine.tsx` to handle the new two-step state machine (`selecting_moment` -> `revealing_tool`).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- I. One Learning Job Per Exercise: PASS - interaction focuses strictly on mapping context to a tool.
- II. One Active Decision or Control at a Time: PASS - explicitly designed to fulfill this by removing the competing top carousel.
- III. Resumable, Deterministic State: PASS - state is determined by `selectedMomentIndex` and `phase`.
- IV. Internal Buttons Update; Only Final Continue Advances: PASS - "Continue" advances.
- V. Private Data: PASS.
- VI. Premium, Editorial, Calm Design: PASS - reducing visual clutter, removing duplicate highlight states.
- VII. Minimal, Ponytail-Mode Code: PASS.
- Reusable UI Components: PASS - will migrate the custom pressables to `CourseExerciseOptionButton`.

## Project Structure

### Documentation (this feature)

```text
specs/010-clear-space-discovery/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
└── tasks.md             
```

### Source Code (repository root)

```text
src/
└── components/
    └── exercise/
        ├── ToolkitShelfCategoryEngine.tsx
        ├── CourseExerciseOptionButton.tsx (reused)
        └── CourseExerciseHeading.tsx (reused)
```

**Structure Decision**: Refactor existing component `ToolkitShelfCategoryEngine.tsx`.
