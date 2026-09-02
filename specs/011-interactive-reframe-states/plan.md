# Implementation Plan: Interactive Reframe Correct/Wrong States

**Branch**: `011-interactive-reframe-states` | **Date**: 2026-09-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-interactive-reframe-states/spec.md`

## Summary

The Interactive Reframe exercise will be extended to support two branching choices, representing correct and incorrect application of the cognitive model. Instead of generic feedback, selecting the incorrect option will reveal a downward spiral consequence chain before letting the user try again, while the correct option will reveal the CBT shift. This will be built using the existing `InteractiveReframeCategoryEngine` and `InteractiveReframeStagger`, leveraging `react-native-reanimated` for progressive disclosure.

## Technical Context

**Language/Version**: TypeScript, React Native

**Primary Dependencies**: `react-native-reanimated`, `expo-haptics`, NativeWind (Tailwind)

**Storage**: Supabase (PostgreSQL) for exercise completion data

**Testing**: Manual testing via iOS simulator and UI component test screens

**Target Platform**: iOS 26+

**Project Type**: Mobile App

**Performance Goals**: 60fps animations for layout transitions (`LinearTransition`)

**Constraints**: Adherence to Constitution Principle I (One learning job), Principle II (One active decision), and Principle VI (Calm Design). No global error styling for mistakes.

**Scale/Scope**: Refactoring one existing exercise engine component to handle two choices instead of a single tap-to-advance flow.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Principle I (One Learning Job)**: PASS. The exercise teaches applying the reframe.
- **Principle II (One Active Decision)**: PASS. The user faces two choices, and upon selection, the consequence is revealed progressively before the next control (Try Again or Continue) appears.
- **Principle III (Resumable State)**: PASS. The phase enum will be updated to track correct/wrong reveals.
- **Principle IV (Internal Buttons Update)**: PASS. The choices update the in-place workspace; Continue is only shown at the end.
- **Principle V (Private Data)**: PASS. Only state phase and step index will be recorded.
- **Principle VI (Premium Design)**: PASS. The design removes harsh red error boundaries and uses smooth reanimated transitions.
- **Principle VII (Minimal Code)**: PASS. Leveraging existing stagger components and the existing engine.

## Project Structure

### Documentation (this feature)

```text
specs/011-interactive-reframe-states/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
└── components/
    └── exercise/
        ├── InteractiveReframeCategoryEngine.tsx
        ├── InteractiveReframeStagger.tsx
        └── InteractiveReframeWrongStagger.tsx (new or extended)
```

**Structure Decision**: The changes are localized to the existing `InteractiveReframe` components within `src/components/exercise/`.

## Complexity Tracking

No violations. No extra tracking needed.
