# Implementation Plan: App-Wide Freemium Gating (Model A)

**Branch**: `021-freemium-gating` | **Date**: 2026-09-26 | **Spec**: [specs/021-freemium-gating/spec.md](file:///Users/samuelprasad/Desktop/happy/journals/specs/021-freemium-gating/spec.md)

**Input**: Feature specification from `/specs/021-freemium-gating/spec.md`

## Summary

Implement a unified, cohesive freemium gating system based on Model A (Duolingo / Headspace model). The core habit loop remains completely free (daily check-ins, full Unit 1 of every journey, 5 foundational CBT exercises, 3 active habits, 5 coping cards, 3 voice journals/week). Advanced capabilities (Unit 2+ learning nodes, 8 specialized somatic/therapeutic exercises, unlimited habits/cards, and deep timeline analytics) are gated behind Happy Pro via RevenueCat native paywalls.

## Technical Context

**Language/Version**: TypeScript 5.3+, React Native 0.76+ (Expo SDK 52)

**Primary Dependencies**: `react-native-purchases` (RevenueCat SDK), Expo Router, React Native Reanimated, Expo Glass Effect (`expo-glass-effect`), `@hugeicons/react-native`, TanStack Query

**Storage**: Local RevenueCat entitlement cache (device-persisted) + Supabase database tables (`coping_cards`, `habits`, `mental_health_entries`)

**Testing**: Strict TypeScript type checking (`tsc --noEmit`), manual smoke runs on real device / TestFlight. Unit test writing disabled per repo instructions.

**Target Platform**: iOS 26+ (Apple HIG, GlassView blur, Swift UI native bottom sheets, SF Symbols)

**Project Type**: Universal Mobile Application (React Native / Expo Router)

**Performance Goals**: Paywall presentation trigger response <300ms from user interaction; zero frame drops on journey map and catalog scroll; seamless cached entitlement resolution on app launch.

**Constraints**: Single source of truth for authorization (`useFreemiumGate` -> `RevenueCatProvider`); non-punitive user experience; offline access preservation for verified subscribers; YAGNI / Ponytail minimal code approach.

**Scale/Scope**: Designed for 50,000+ active users; impacts 6 distinct surface areas across journeys, exercise catalog, voice journaling, habit tracker, and coping cards.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evaluation |
| :--- | :--- | :--- |
| **I. One Learning Job Per Exercise** | **PASS** | Gating acts strictly as an entry gate or capacity threshold. Does not alter or mix pedagogical jobs within exercise steps. |
| **II. One Active Decision at a Time** | **PASS** | Locked nodes replace lesson launching with a single distinct upgrade invitation. No competing actions. |
| **III. Resumable, Deterministic State** | **PASS** | Purchasing or restoring Pro unlocks access immediately without resetting or altering saved progression or responses. |
| **IV. Internal Buttons Update; Only Final Continue Advances** | **PASS** | In-exercise workflows remain completely unaffected; gating occurs only on navigation boundaries and saving limits. |

## Project Structure

### Documentation (this feature)

```text
specs/021-freemium-gating/
├── plan.md              # Implementation plan (this file)
├── research.md          # Phase 0 architectural decisions & trade-offs
├── data-model.md        # Phase 1 domain entities & quota schemas
├── quickstart.md        # Phase 1 validation scenarios & verification guide
├── contracts/           # Phase 1 TypeScript interfaces & contracts
│   ├── freemium-gate-contract.ts
│   └── exercise-gating-contract.ts
└── checklists/
    └── requirements.md  # Quality verification checklist
```

### Source Code (repository root)

```text
src/
├── context/
│   └── RevenueCatProvider.tsx              # Native purchase provider & entitlement state
├── hooks/
│   ├── useFreemiumGate.ts                  # Central gating hook with quota evaluation
│   └── useCopingCards.ts                   # 5-card capacity check on saveCard
├── types/
│   ├── exerciseFlow.ts                     # isProOnly optional property on ExerciseConfig
│   └── journey/node.ts                     # unitIndex and isProOnly on nodes and dividers
├── data/
│   └── exerciseRegistry.ts                 # PRO_EXERCISE_TYPES master set definition
├── lib/
│   └── utils/journeyLayout.ts              # Passes 0-indexed unitIndex into layout items
├── domains/
│   └── journey/ui/
│       ├── components/
│       │   ├── JourneyNodeCell.tsx         # Node lock rendering & paywall routing intercept
│       │   ├── UnitDivider.tsx             # PRO badge pill on Unit 2+ divider
│       │   └── DividerCell.tsx             # Propagates isProOnly to UnitDivider
│       └── hooks/
│           └── useJourneyNodeCellViewModel.ts # Evaluates isProGated & paywall action
├── screens/
│   └── ExercisesScreen/
│       └── ExercisesScreen.tsx             # PRO chip rendering & paywall action intercept
└── components/
    ├── CircularRevealWrapper/
    │   └── CircularRevealWrapper.tsx       # Bypasses reveal when disabled={isGated}
    └── habits/
        └── HabitsSection.tsx               # 3-habit active capacity check
```

**Structure Decision**: Universal feature architecture integrating cleanly into existing domain-driven frontend folders (`domains/journey`, `screens/ExercisesScreen`, `hooks/`, `types/`). No speculative abstractions or extra microservices introduced.

## Complexity Tracking

*No violations. Clean architecture and Ponytail minimalism maintained.*
