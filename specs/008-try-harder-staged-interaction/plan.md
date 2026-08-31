# Implementation Plan: Staged Interaction for "Try Harder to Sleep"

**Branch**: `008-try-harder-staged-interaction` | **Date**: 2026-08-31 | **Spec**: specs/008-try-harder-staged-interaction/spec.md

**Input**: Feature specification from `specs/008-try-harder-staged-interaction/spec.md`

## Summary

Refactor the "Try harder to sleep" exercise (`ParadoxCard`) into a progressive, state-driven interaction (`ready` -> `result` -> `explanation`). Remove the simultaneous display of expectation and result cards, remove the disabled "Push the button above" CTA, and use the global footer CTA to drive the sequence. 

## Technical Context

**Language/Version**: TypeScript (React Native / Expo)
**Primary Dependencies**: `react-native-reanimated`, `expo-haptics`
**Target Platform**: iOS/Android
**Project Type**: mobile-app
**Performance Goals**: 60fps animations
**Scale/Scope**: Refactoring a single interactive exercise component and its configuration.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*
Passes. The plan emphasizes simplicity, YAGNI, standard brand components, and strict state machines.

## Project Structure

### Documentation (this feature)

```text
specs/008-try-harder-staged-interaction/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
```

### Source Code

```text
src/
├── exercises/
│   └── ParadoxCard/
│       └── config.ts
├── components/
│   └── exercise/
│       ├── ParadoxCardCategoryEngine.tsx
│       └── paradoxCardStyles.ts
supabase/
└── seed/
    └── sleep_reset_section_1.sql
```

**Structure Decision**: Modifying the existing component and config.

## Complexity Tracking

No violations.
