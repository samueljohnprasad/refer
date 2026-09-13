# Implementation Plan: Next Journey Bridge

**Branch**: `019-next-journey-bridge` | **Date**: 2026-09-13 | **Spec**: [specs/019-next-journey-bridge/spec.md](./spec.md)

**Input**: Feature specification from `/specs/019-next-journey-bridge/spec.md`

## Summary

When a user completes a course, render a persistent, floating dock card (`NextJourneyBridgeDock`) above the tab bar on the completed journey map. The dock recommends the next uncompleted published course in curriculum order with a 3D tactile button (`Start [Next Course Title]`), providing seamless 1-tap transition to the next track or an optional link to browse all courses. When all courses are finished, it celebrates that the user is all caught up.

## Technical Context

**Language/Version**: TypeScript 5.3+, React 18, React Native 0.76+
**Primary Dependencies**: Expo Router v4, Redux Toolkit, RTK Query, `react-native-reanimated`, NativeWind/Tailwind CSS
**Storage**: Supabase PostgreSQL (`courses`, `user_course_progress`)
**Testing**: Jest, TypeScript typechecking (`tsc --noEmit`)
**Target Platform**: iOS (26+)
**Project Type**: Mobile App
**Performance Goals**: Instant client-side recommendation computation (0ms perceived lag), 60fps spring transitions
**Constraints**: No component/hook/helper file > 300 lines; Tailwind styling only; standard 3D tactile button; strict single responsibility.
**Scale/Scope**: 50,000 active users, client-side memoized selector, zero additional backend endpoints.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **YAGNI / Ponytail Principle**: Minimal code. Pure selector + 1 presentational component. No unneeded abstractions or backend endpoints.
- [x] **Clean Code (<300 lines)**: All new and touched files stay strictly below 300 lines.
- [x] **Cross-Platform / HIG**: Large touch targets (56px height, full-width button), Nunito typography, WCAG AA contrast.
- [x] **No Test Duplication**: Single high-level test seam at selector and controller boundary.
- [x] **Preserve Existing User Work**: Preserves `docs/prd-completed-journey-revisit.md` completed journey replayability.

## Project Structure

### Documentation (this feature)

```text
specs/019-next-journey-bridge/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Phase 0 decisions & trade-offs
├── data-model.md        # Phase 1 domain types & lifecycle
├── quickstart.md        # Phase 1 verification scenarios
└── contracts/
    └── NextJourneyBridgeContract.ts # Component & selector types
```

### Source Code (repository root)

```text
src/domains/journey/
├── state/
│   ├── journeySelectors.ts             # Add selectNextCourseRecommendation
│   └── __tests__/
│       └── journeySelectors.test.ts    # Unit test for recommendation selector
├── ui/
│   ├── components/
│   │   └── NextJourneyBridgeDock.tsx   # New floating dock UI component
│   ├── hooks/
│   │   └── useJourneyMapController.tsx # Expose recommendation state & handleStartNextCourse
│   └── JourneyMapView.tsx              # Mount NextJourneyBridgeDock above tab bar
```

## Phases

### Phase 0: Outline & Research
- Resolved recommendation resolution strategy: pure Redux selector over catalog and user progress.
- Resolved placement: floating bottom dock over scrollable map.
- Resolved edge case: "All Caught Up" state for completionists.
- Output: [specs/019-next-journey-bridge/research.md](./research.md)

### Phase 1: Design & Contracts
- Defined domain contracts: `NextCourseRecommendation` and `NextJourneyBridgeDockProps`.
- Defined lifecycle transitions and selector dependencies.
- Created end-to-end manual verification script.
- Output: [data-model.md](./data-model.md), [contracts/NextJourneyBridgeContract.ts](./contracts/NextJourneyBridgeContract.ts), [quickstart.md](./quickstart.md)
