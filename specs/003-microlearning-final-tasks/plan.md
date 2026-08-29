# Implementation Plan: Microlearning Final Tasks

**Branch**: `[003-microlearning-final-tasks]` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/003-microlearning-final-tasks/spec.md`

## Summary

Implement the 12th and final microlearning UI, the "Recall Warmup", alongside the strict, privacy-preserving telemetry foundation. Finally, conduct a repository-wide audit script to guarantee all 11 microlearning categories have zero legacy fallback code or non-compliant seed data shapes.

## Technical Context

**Language/Version**: TypeScript

**Primary Dependencies**: React Native, Expo, NativeWind, React Native Reanimated

**Storage**: Local app state and unified console logger (for analytics bus mock)

**Testing**: Developer test screen fixtures (no test suites per Constitution)

**Target Platform**: iOS 26+

**Project Type**: Mobile app

**Performance Goals**: 60fps card transitions

**Constraints**: Strict therapeutic data privacy (no free text in telemetry payload), single active control at a time.

**Scale/Scope**: 1 UI Engine, 1 Telemetry module, 1 Audit script

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- I. One Learning Job Per Exercise: PASS (Recall focuses solely on assessing knowledge).
- II. One Active Decision or Control at a Time: PASS (Recall hides the answer until requested, then hides the request when grading is shown).
- III. Resumable, Deterministic State: PASS (Recall state tracks the current card index strictly).
- IV. Internal Buttons Update; Only Final Continue Advances: PASS.
- V. Private Data — Store IDs and State, Never Therapeutic Text: PASS (Telemetry strictly enforces dropping text fields).
- VI. Premium, Editorial, Calm Design: PASS (Sage/white/ink, Geist/Cormorant fonts).
- VII. Minimal, Ponytail-Mode Code (YAGNI): PASS (Simple TS script for audit instead of heavy CLI tools).

## Project Structure

### Documentation (this feature)

```text
specs/003-microlearning-final-tasks/
├── plan.md              # This file ($speckit-plan command output)
├── research.md          # Phase 0 output ($speckit-plan command)
├── data-model.md        # Phase 1 output ($speckit-plan command)
├── quickstart.md        # Phase 1 output ($speckit-plan command)
├── contracts/           # Phase 1 output ($speckit-plan command)
└── tasks.md             # Phase 2 output ($speckit-tasks command - NOT created by $speckit-plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── exercise/
│       ├── microlearning/
│       │   ├── microlearningAnalytics.ts
│       │   ├── RecallWarmupCategoryEngine.tsx
│       │   └── recallWarmupState.ts
│       └── ...
├── domains/
│   └── journey/
│       └── learning/
│           ├── types.ts (Update for recall_warmup)
│           └── ...
└── scripts/
    └── auditMicrolearningContent.ts
```

**Structure Decision**: Add the new engine into the existing microlearning structure. Create a dedicated module for telemetry to avoid cluttering the engines. Create a script in the root `scripts/` directory for the seed audit.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

*No violations.*
