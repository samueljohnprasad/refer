# Implementation Plan: Continue Your Journey Card

**Branch**: `017-continue-journey-card` | **Date**: 2026-09-08 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/017-continue-journey-card/spec.md`

## Summary

Add a compact "Continue Your Journey" card to the Home screen (`JournalCalendarScreen`) positioned directly beneath the streak widget. The card acts as a fast, one-tap resume entry point into the user's active learning journey without navigating through the full journey map first.

The feature reuses the application's existing authoritative course and progression system (`useActiveCourse`, `useJourneyMap`, `selectCurrentNodeForCourse`) and renders five distinct presentation states: Active with next activity (State A), No active course (State B), Course completed (State C), Loading skeleton (State D), and Quiet error fallback (State E). The entire card container is an interactive, unified touch target with pressed feedback adhering to the calm forest/sage/cream design system.

## Technical Context

**Language/Version**: TypeScript 5.x, React Native (Expo SDK 54 / Expo Router v4)

**Primary Dependencies**: React Native, Expo Router, Redux Toolkit, NativeWind (Tailwind CSS), `expo-haptics`, `posthog-react-native`

**Storage**: Supabase remote backend + Redux Toolkit normalized journey store (read-only derivation, no new progress schema)

**Testing**: Static type checking (`npx tsc --noEmit`), iOS Simulator runtime verification (automated unit test suites strictly prohibited by constitution)

**Target Platform**: iOS 26+ only (per Constitution and repo guidelines)

**Project Type**: Mobile app (Expo React Native)

**Performance Goals**: Card updates within <500ms when returning to Home; 60fps interaction animation; zero layout shift/flash

**Constraints**:
- Max 300 lines per file (Principle VII)
- NativeWind / Tailwind CSS only (no inline styles except runtime dynamic values, no `StyleSheet.create`)
- Sage/cream/forest tokens (`lib/tokens.ts` / `SEMANTIC_COLORS`)
- Single unified tap target per card state (FR-018)
- No new progress storage, reward logic, or recommendation engine (strictly out of scope)

**Scale/Scope**: Scalable for 50,000+ users; 1 new UI component module + container integration on Home screen

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|---|---|---|---|
| **I. One Learning Job** | Exercise focuses on 1 skill | PASS | Card is a navigation resume affordance; does not alter exercises. |
| **II. One Active Decision** | 1 control/choice at a time | PASS | Single unified tap target per card state (FR-018); no competing controls. |
| **III. Resumable State** | Restore to exact stage | PASS | State A launches existing `journey-flow` which restores exact saved stage. |
| **IV. Button Advance** | Tap feedback in place | PASS | Card tap initiates navigation; does not prematurely mark nodes complete. |
| **V. Private Data** | Store IDs/state, no text | PASS | PostHog events log only `course_id`, `activity_id`, `state`. No text logged. |
| **VI. Calm Design** | Sage/white/forest, no slop | PASS | No generic gradients, no confetti, no mascots, compact subordinate card. |
| **VII. Ponytail Mode (YAGNI)** | <300 lines/file, minimal code | PASS | Modular component structure with all files <200 lines; `// ponytail:` comments. |

## Project Structure

### Documentation (this feature)

```text
specs/017-continue-journey-card/
├── plan.md              # This file
├── research.md          # Architecture decisions and query strategies
├── data-model.md        # Discriminated union states and domain mapping
├── quickstart.md        # Scenario-based validation guide
├── contracts/           # Component, hook, and analytics contracts
│   └── continue-journey-card.contract.ts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/
├── components/
│   └── ContinueJourneyCard/
│       ├── ContinueJourneyCard.tsx           # Presentational card component (<200 lines)
│       ├── ContinueJourneyCardSkeleton.tsx   # Loading skeleton placeholder (<100 lines)
│       ├── useContinueJourneyViewModel.ts    # State derivation, haptics, navigation, analytics (<200 lines)
│       └── types.ts                          # Component props & state models (<100 lines)
└── screens/
    └── JournalCalendarScreen/
        └── JournalCalendarScreen.tsx         # Integrated below WeeklyStreakWidget (<225 lines)
```

**Structure Decision**:
Follows the repo's established feature-based / component-based architecture and container-presenter pattern:
- Logic, Redux selectors, navigation, and analytics are isolated inside `useContinueJourneyViewModel.ts`.
- Pure UI layout and Tailwind styling live in `ContinueJourneyCard.tsx` and `ContinueJourneyCardSkeleton.tsx`.
- Integration into `JournalCalendarScreen.tsx` requires minimal lines of glue code.

## Complexity Tracking

> *No constitution violations. All gates passed with zero architectural exceptions.*
