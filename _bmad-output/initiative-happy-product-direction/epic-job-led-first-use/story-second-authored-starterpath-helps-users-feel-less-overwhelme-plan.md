---
title: 'Second authored StarterPath helps users feel less overwhelmed'
type: 'feature'
ticket: 9
created: '2026-10-14'
status: 'built'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md'
  - '/Users/samuelprasad/Desktop/happy/journals/DESIGN.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/spec-happy-product-direction/starter-paths.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/spec-happy-product-direction/product-guardrails.md'
warnings: []
deferred: []
---

<intent-contract>

## Intent

**Problem:** The durable StarterPath contract currently has only the anxious-thoughts authored bundle, so path switching cannot be demonstrated with a second real path and users cannot choose the approved stress-oriented goal.

**Approach:** Add the authored `feel_less_overwhelmed` path beside the unchanged anxious-thoughts path. Let the goal step select either bundle, render the selected lesson and practice copy, persist the selected path through the existing Journey repository, and return Home with the selected path's next action.

## Boundaries & Constraints

**Always:** Use stable path identifiers and version 1; use existing `grounding_54321`; preserve inactive-path rows; keep the first loop free; emit metadata-only analytics; keep the reflection prompt private; reuse current StarterPath, exercise-flow, Home, and localization primitives.

**Never:** Do not rewrite the anxiety bundle; do not promise calm, relief, or symptom reduction; do not diagnose, assess crisis risk, or send reflection text to analytics; do not add a new exercise implementation or a second guest identity.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| SELECT_STRESS_PATH | User chooses Feel less overwhelmed | Stress path copy appears and its durable record becomes active | Keep anxiety path unchanged if selection fails |
| RESUME_STRESS_PATH | Active stress path has saved lesson or practice progress | Same stress path step and next action restore after relaunch | Reload saved progress without clearing it |
| SWITCH_BACK | User switches from stress path to anxiety path | Anxiety progress remains readable and its next action returns | Reject invalid path without changing active pointer |
| OPEN_GROUNDING | Stress lesson is complete | Exercise flow opens `grounding_54321` with text-only handoff | Show existing completion error and keep progress retryable |
</intent-contract>

## Code Map

- `src/domains/journey/model/starterPath.ts` -- owns the typed StarterPathV1 contract and existing anxiety bundle; add the stress bundle and a small catalog/lookup without changing the anxiety constant.
- `src/screens/StarterPathScreen/StarterPathScreen.tsx` -- owns selection, resume, durable writes, practice routing, and analytics; make selected path the source for these operations.
- `src/screens/StarterPathScreen/StarterPathParts.tsx` -- renders goal, lesson, and practice stages; accept selected-path copy rather than reading only the anxiety constant.
- `src/locales/en/onboarding.json` -- existing StarterPath copy namespace; add the stress path copy and reflection prompt keys without altering anxiety strings.
- `src/domains/journey/data/starterPathProgress.repo.ts` -- existing read/switch/complete boundary; reuse it for the second path and preserve path-specific rows.
- `src/data/exerciseRegistry.ts` and `src/exercises/grounding54321/config.ts` -- existing registered `grounding_54321`; do not add another exercise.

## Tasks & Acceptance

**Execution:**

- [x] `src/domains/journey/model/starterPath.ts` -- add the versioned `feel_less_overwhelmed` bundle and catalog lookup -- make both authored paths addressable by stable id.
- [x] `src/screens/StarterPathScreen/StarterPathScreen.tsx` and `StarterPathParts.tsx` -- add reversible goal selection and selected-path resume, writes, practice routing, and Home continuation -- keep the existing anxiety flow behavior intact.
- [x] `src/locales/en/onboarding.json` -- add localized stress-path copy and the private reflection prompt -- keep copy educational and non-diagnostic.
- [x] `src/domains/journey/data/starterPathProgress.repo.ts` -- use the existing switch/read operations for both path ids -- preserve inactive rows and conflict behavior.
- [x] `src/domains/journey/model/starterPath.ts` -- point the stress bundle at the released `grounding_54321` exercise -- avoid new exercise code.

**Acceptance Criteria:**

- Given the goal step is shown, when the user selects Feel less overwhelmed, then Stress is a signal and its linked Grounding Reset practice are shown.
- Given stress-path lesson progress is saved, when the user relaunches, then the stress path and its next action are restored.
- Given progress exists on both paths, when the user switches paths, then each path retains its own progress and Home shows the active path's next action.
- Given the stress lesson is complete, when the user opens the practice, then the existing `grounding_54321` flow opens and no raw reflection text is captured by analytics.
- Given the user selects Understand anxious thoughts, when the existing path is completed, then its identifiers, copy, Thought Catcher routing, and behavior remain unchanged.

## Implementation Notes

- Added the stress authored bundle with stable `feel_less_overwhelmed` identifiers and the existing `grounding_54321` exercise.
- Made StarterPath goal selection and resume path-aware while preserving the anxiety bundle and its copy keys.
- Added English stress-path copy; reflection remains a private prompt contract and no raw reflection data is added to analytics.
- Targeted Oxlint completed with existing complexity warnings only. `git diff --check` passed. TypeScript verification was attempted but the local command stalled before producing diagnostics; Graphify extraction hit an existing path-collision failure during the repository-wide update.
- Quick review caught and fixed missing `path` destructuring and goal-selection callback wiring in the StarterPath UI; the targeted lint pass now reports warnings only.

## Plan Change Log

## Review Triage Log

- `false` / `patch`: the first review pass exposed missing `path` destructuring and an unwired path-selection callback; fixed in `StarterPathParts.tsx` and `StarterPathScreen.tsx`, then targeted Oxlint and `git diff --check` passed.

## Design Notes

The goal selector should remain one calm decision. Show the two authored goals as peer choices, preserve the current card treatment, and avoid exposing database or concurrency language. The stress path's reflection is a prompt contract for the existing private journal surface; it does not require new reflection storage.

## Verification

**Commands:**

- `npx oxlint src/domains/journey/model/starterPath.ts src/screens/StarterPathScreen/StarterPathScreen.tsx src/screens/StarterPathScreen/StarterPathParts.tsx` -- expected: no errors in changed TypeScript files.
- `git diff --check` -- expected: no whitespace errors.

**Manual checks:**

- Select Feel less overwhelmed on the dev client, complete the lesson, open Grounding Reset, return Home, relaunch, and confirm the stress next action resumes.
- Switch back to Understand anxious thoughts and confirm its existing path id, lesson id, Thought Catcher route, and copy are unchanged.
