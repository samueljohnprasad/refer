# Implementation Plan: Arun's Night Audit

**Branch**: `013-aruns-night-audit` | **Date**: 2026-09-02 | **Spec**: [spec.md](./spec.md)

## Summary
Refactor the "Arun's two versions of the night" microlearning exercise to replace repetitive cards with a temporal timeline, progressive in-place reveals, and a clean rewind animation. The goal is to distinctly separate objective evidence from subjective interpretation while minimizing cognitive load and scrolling.

## Technical Context

**Language/Version**: TypeScript

**Primary Dependencies**: React Native, Expo Router, NativeWind/Tailwind, `react-native-reanimated`

**Storage**: Redux Toolkit (global), React hooks (local)

**Testing**: Manual iOS simulator verification, `npx tsc --noEmit`

**Target Platform**: iOS 26+

**Project Type**: Mobile App Component (Microlearning Engine)

**Performance Goals**: 60fps for the 300-450ms rewind animation, no layout thrashing

**Constraints**: Must adhere to strict UI/UX guidelines in Constitution (minimal styling, single interaction per phase)

**Scale/Scope**: Refactoring a single microlearning exercise category engine

## Constitution Check

*GATE: Passed. The design aligns with one learning job per exercise, one active decision, deterministic state, and ponytail-mode minimal implementation.*

## Project Structure

### Documentation (this feature)

```text
specs/013-aruns-night-audit/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── exercise/
│   │   ├── TimelineRewindCategoryEngine.tsx
│   │   ├── timelineRewindStyles.ts
├── domains/
│   ├── journey/
│   │   ├── learning/
│   │   │   ├── v1LearningEngineTypes.ts
```

**Structure Decision**: Create a new `TimelineRewindCategoryEngine.tsx` under `src/components/exercise/` to keep the logic focused entirely on this specific temporal interaction, fulfilling the single-responsibility principle and keeping files under 300 lines.
