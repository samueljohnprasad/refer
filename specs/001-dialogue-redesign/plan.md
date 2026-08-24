# Implementation Plan: Dialogue Exercise Redesign

**Branch**: `001-dialogue-redesign` | **Date**: 2026-08-24 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-dialogue-redesign/spec.md`

## Summary

Replace the current flat-`messages[]` Dialogue engine with a strict beat-indexed
microlearning engine. Passive beats advance with "Next message"; decision beats hide
the primary button (but keep "Skip for now" visible) until an option is selected.
Selecting an option hides all other options and shows inline feedback. Beats older
than the immediately prior one collapse to a single "Earlier · X · Y" summary row.
VoiceOver announces each beat transition.

## Technical Context

**Language/Version**: TypeScript 5 (strict)

**Primary Dependencies**: React Native, Expo Router, Redux Toolkit, expo-haptics,
react-native-reanimated (existing — no new dependencies)

**Storage**: Redux session slice (`v1LearningSessionSlice`) + draft store
(`useV1NodeSessionDraft`)

**Testing**: TypeScript `tsc --noEmit`, iOS simulator, dev fixture screen — no
automated test cases (per repo rule)

**Target Platform**: iOS 26+

**Project Type**: Mobile app exercise engine

**Performance Goals**: UI response < 1 frame delay after tap (60 fps); no per-frame
session writes during slider draft

**Constraints**: Each engine/helper/hook file ≤ 300 lines; no inline styles except
dynamic values; no `StyleSheet.create` in new microlearning engines

**Scale/Scope**: Single exercise type; touches ~5 source files + 1 fixture file

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I — One learning job | ✅ Pass | Dialogue teaches one concept via scripted exchange |
| II — One active decision | ✅ Pass | One beat active; unchosen options vanish |
| III — Resumable state | ✅ Pass | `createDialogueResponse(content, saved)` repairs and restores |
| IV — Internal update only | ✅ Pass | Beat advance is in-place; only final Continue routes |
| V — Private data | ✅ Pass | Response stores IDs + phase only |
| VI — Premium design | ✅ Pass | Bubble layout, Geist font, sage palette |
| VII — Minimal code | ✅ Pass | ≤5 new files; no new dependencies |

No violations. No Complexity Tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/001-dialogue-redesign/
├── plan.md              ← this file
├── research.md          ← Phase 0 output
├── data-model.md        ← Phase 1 output
├── quickstart.md        ← Phase 1 output
├── contracts/
│   └── dialogue-content.md   ← Phase 1 output
└── tasks.md             ← Phase 2 output ($speckit-tasks — not yet created)
```

### Source Code (repository root)

```text
src/components/exercise/
├── DialogueCategoryEngine.tsx      ← REPLACE entirely (return null on invalid content)
├── dialogueContent.ts              ← NEW: strict reader + validator (incl historySummary)
├── dialogueState.ts                ← NEW: createDialogueResponse, state transitions
├── dialogueResponse.ts             ← NEW: hasSameDialogueResponse
└── dialogueStyles.ts               ← NEW: StyleSheet (Geist/sage palette)

src/components/exercise/microlearning/
└── microlearningContentValidation.ts  ← ADD validateDialogueContent branch

src/domains/journey/learning/
└── courseExercisePrimaryTransition.ts ← REPLACE getProgressLabel/getNextProgressState
                                         calls for Dialogue with beat-aware functions

src/screens/CourseExercisesTestScreen/fixtures/
└── review.ts                       ← ADD fixture-dialogue (2+ beats, 1 decision beat)
```

**Structure Decision**: Mobile app — single project layout. Source code under `src/`.
