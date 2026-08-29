# Implementation Plan: whatif-and-checkpoint

**Branch**: `[002-whatif-and-checkpoint]` | **Date**: 2026-08-24 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/002-whatif-and-checkpoint/spec.md`

## Summary

Implement user-paced state machines for the What-If Machine (removing timers) and Course Checkpoint (presenting one strictly-typed item at a time). Replaces `any[]` with discriminated unions and ensures compliance with the Constitution's "One Active Decision" and strict typing rules.

## Technical Context

**Language/Version**: TypeScript
**Primary Dependencies**: Expo Router, React Native, NativeWind, Reanimated
**Storage**: Transient local state (restored via `createWhatIfResponse` / `createCheckpointResponse`); persisted as generic `Record<string, unknown>` via journey engine.
**Testing**: Verification via iOS Simulator (`npm run ios`) and TypeScript (`npx tsc --noEmit`). No automated tests per Constitution.
**Target Platform**: iOS 26+ only.
**Project Type**: Mobile app (Expo).
**Performance Goals**: 60fps animations for transitions.
**Constraints**: Strict content validators must reject malformed data.
**Scale/Scope**: 50,000 users.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **I. One Learning Job**: Passes. Checkpoint items are focused.
- **II. One Active Decision**: Passes. What-If uses "Next consequence" instead of timers. Checkpoint shows exactly one item at a time.
- **III. Resumable State**: Passes. State restoring functions will rigorously check bounds.
- **IV. Internal Buttons Update**: Passes. "Run it" updates state; "Continue" advances.
- **V. Private Data**: Passes. Only option IDs and concept IDs are tracked.
- **VI. Premium Design**: Passes. Uses `lib/tokens.ts` and standard typography.
- **VII. Minimal Code**: Passes. Strict types, components will be split if > 300 lines.

## Project Structure

### Documentation (this feature)

```text
specs/002-whatif-and-checkpoint/
├── plan.md              
├── research.md          
├── data-model.md        
├── quickstart.md        
├── contracts/           
└── tasks.md             
```

### Source Code (repository root)

```text
src/
├── components/
│   └── exercise/
│       ├── whatif/
│       │   ├── WhatIfCategoryEngine.tsx
│       │   ├── whatIfContent.ts
│       │   ├── whatIfResponse.ts
│       │   └── whatIfState.ts
│       └── checkpoint/
│           ├── CheckpointCategoryEngine.tsx
│           ├── checkpointContent.ts
│           ├── checkpointResponse.ts
│           └── checkpointState.ts
└── domains/
    └── journey/
        └── learning/
```

**Structure Decision**: Code lives in the shared `src/components/exercise/` directory, following the pattern established by the Dialogue redesign, split into feature-specific folders to keep file sizes under 300 lines.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | | |
