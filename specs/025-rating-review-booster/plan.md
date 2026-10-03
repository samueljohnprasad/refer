# Implementation Plan: App Store Rating & Review Booster

**Branch**: `025-rating-review-booster` | **Date**: 2026-10-03 | **Spec**: [specs/025-rating-review-booster/spec.md](specs/025-rating-review-booster/spec.md)

**Input**: Feature specification from `specs/025-rating-review-booster/spec.md`

## Summary

Happy currently suffers from a severe App Store conversion bottleneck with only 4 lifetime ratings globally (all in India), showing "Not Enough Ratings" in US, UK, CA, and AU storefronts. This plan activates native Day-1 StoreKit review prompts triggered 2.0 seconds after a user completes their first therapeutic exercise (`ExerciseFlowScreen.tsx`) or saves their first journal entry (`useJournalOperationsHandler.ts`), enforces a global 90-day cooldown across streak milestones, and provides a voluntary "Rate Happy on the App Store" deep link in Settings, fully compliant with Apple Guideline 5.6.1.

## Technical Context

**Language/Version**: TypeScript 5.3+ (Strict mode, no `any`)  
**Primary Dependencies**: `expo-store-review`, `@react-native-async-storage/async-storage`, `react-native`, `expo-router`  
**Storage**: Local persistent storage (`AsyncStorage`) for milestone keys and last prompt timestamp  
**Testing**: Static TypeScript checks (`npx tsc --noEmit`), manual UI verification via Dev Client, StoreKit simulator triggers  
**Target Platform**: iOS 26+ only (App Store App ID: `6755650433`)  
**Project Type**: Mobile Application (React Native / Expo Router)  
**Performance Goals**: 0ms UI thread blocking; 2000ms calm post-celebration delay; 0 lag during completion transitions  
**Constraints**: 100% compliant with Apple App Store Review Guideline 5.6.1 (strict ban on gating/sentiment filtering); Apple StoreKit 3-in-365 annual quota; files under 300 lines (Principle VII)  
**Scale/Scope**: 4 touched source files, 0 new external dependencies, lightweight YAGNI helpers  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

| Principle | Status | Evaluation |
|---|:---:|---|
| **I. One Learning Job Per Exercise** | **PASS** | Review prompt never enters active exercise learning flow; triggers only post-completion on celebration surface. |
| **II. One Active Decision or Control at a Time** | **PASS** | Prompts 2.0s after celebration modal/toast renders; user handles system sheet in isolation. |
| **III. Resumable, Deterministic State** | **PASS** | Timestamp and completed milestone set safely stored in `AsyncStorage`. Resilient to offline and interrupted sessions. |
| **IV. Internal Buttons Update; Only Final Continue Advances** | **PASS** | Review sheet presentation does not alter or hijack navigation state. |
| **V. Private Data** | **PASS** | No therapeutic text, responses, or star selections logged. StoreKit handles ratings privately in iOS subsystem. |
| **VI. Premium, Editorial, Calm Design** | **PASS** | Uses Apple's native HIG StoreKit modal and clean Settings action row; no loud third-party popups or emoji dialogs. |
| **VII. Minimal, Ponytail-Mode Code (YAGNI)** | **PASS** | Reuses existing `useReviewPrompt.ts` with minimal extension; zero new package dependencies; all modified files stay under 300 lines. |

## Project Structure

### Documentation (this feature)

```text
specs/025-rating-review-booster/
├── spec.md              # Feature specification
├── plan.md              # This implementation plan
├── research.md          # Phase 0 technical decisions & tradeoffs
├── data-model.md        # Phase 1 entities, storage keys & state machine
├── contracts/           # Phase 1 TypeScript interfaces & contracts
│   └── review-prompt.contract.ts
├── quickstart.md        # Phase 1 validation scenarios
└── checklists/
    └── requirements.md  # Specification quality checklist
```

### Source Code (repository root)

```text
src/
├── hooks/
│   └── useReviewPrompt.ts                                      # Milestone management & 90-day cooldown logic
├── utils/
│   └── appStoreReview.ts                                       # Voluntary deep link & StoreKit helpers
├── screens/
│   ├── ExerciseFlowScreen/
│   │   └── ExerciseFlowScreen.tsx                              # Day-1 trigger: 2.0s after celebration modal renders
│   ├── JournalEntryScreen/hooks/
│   │   └── useJournalOperationsHandler.ts                      # Day-1 trigger: 2.0s after first journal entry save
│   └── SettingsScreen/
│       └── SettingsScreen.tsx                                  # Voluntary "Rate Happy on the App Store" row
```

**Structure Decision**: Minimal architectural touchpoints. Enhances existing `src/hooks/useReviewPrompt.ts` to support Day-1 milestones and timestamp cooldowns, wires non-blocking triggers into `ExerciseFlowScreen.tsx` and `useJournalOperationsHandler.ts`, and adds the voluntary deep link in `SettingsScreen.tsx`.

## Complexity Tracking

*No constitution violations or unjustified abstractions. All components adhere to YAGNI and remain well below the 300-line limit.*
