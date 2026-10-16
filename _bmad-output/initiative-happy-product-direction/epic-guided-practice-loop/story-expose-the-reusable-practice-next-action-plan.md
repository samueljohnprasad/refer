---
title: 'Expose the reusable practice next action'
type: 'feature'
ticket: 3
created: '2026-10-15'
status: done
baseline_revision: 'ce7bc919'
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'pinned'
lenses_ran: []
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
deferred: []
---

<intent-contract>

## Intent

**Problem:** A completed StarterPath practice is persisted, but the user has no clear continuation or reusable entry point that connects the completed practice back to the existing Exercises surface.

**Approach:** Read the latest acknowledged practice completion for the signed-in user, show one calm “continue practicing” action in the existing Exercises discovery surface, and route that action back through the existing exercise-flow entry point.

## Boundaries & Constraints

**Always:** Reuse the existing exercise registry, navigation, and visual language. Keep the action available only when a valid persisted practice completion exists. Use supportive educational copy and preserve anonymous/authenticated behavior.

**Never:** Add diagnosis, guaranteed relief, clinical efficacy, crisis guidance, a new practice type, or a replacement surface for the existing exercise catalog. Do not change the anxiety StarterPath contract.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| HAPPY_PATH | Authenticated user has a valid latest `practice_completions` row whose exercise id is registered | Exercises discovery shows one reusable practice action; tapping it opens the existing exercise flow | No error expected |
| NO_COMPLETION | User has no acknowledged practice completion | Existing Exercises discovery remains unchanged | Hide the reusable action |
| INVALID_COMPLETION | Stored completion references an unknown exercise or malformed data | Existing Exercises discovery remains usable without the reusable action | Ignore the invalid row and avoid navigation |
| READ_FAILURE | Completion lookup fails | Existing Exercises discovery remains usable | Treat lookup as empty and keep the catalog available |

</intent-contract>

## Code Map

- `src/domains/practice/data/practiceCompletion.repo.ts` -- existing PracticeCompletionV1 write boundary; add the latest valid completion read beside it.
- `src/screens/ExercisesScreen/ExercisesScreen.tsx` -- existing discovery surface and exercise-flow navigation boundary; add the reusable next-action shelf here.
- `src/screens/ExercisesScreen/components/ExerciseDiscoverySection.tsx` -- existing jump-back-in shelf treatment to reuse for the new action.
- `src/screens/ExercisesScreen/components/JumpBackInCard.tsx` -- established exercise card visual and accessibility treatment; do not duplicate its styling.
- `src/data/exerciseRegistry.ts` -- validates stored exercise ids and supplies the exercise config used for navigation.
- `src/context/AuthContext.tsx` -- supplies the current user identity for the completion query.
- `src/locales/en/exercises.json` -- existing Exercises namespace for concise reusable-action copy.

## Tasks & Acceptance

**Execution:**
- [ ] `src/domains/practice/data/practiceCompletion.repo.ts` -- add a user-scoped latest-completion read that returns null for missing or malformed rows -- keep persistence and validation at the Practice boundary.
- [ ] `src/screens/ExercisesScreen/hooks/useRecentPracticeCompletion.ts` -- load and cache the latest acknowledged completion for the current user -- isolate query and invalid-row handling from presentation.
- [ ] `src/screens/ExercisesScreen/components/ReusablePracticeCard.tsx` -- render one reusable action using existing Card and exercise icon treatments -- keep copy supportive and non-clinical.
- [ ] `src/screens/ExercisesScreen/ExercisesScreen.tsx` -- insert the reusable action into discovery only when its exercise config is valid and route the tap through the existing flow -- preserve the rest of the catalog.
- [ ] `src/locales/en/exercises.json` -- add the card label and action copy -- keep the content concise and avoid efficacy claims.

**Acceptance Criteria:**
- Given a valid acknowledged completion, when the user opens Exercises, then one reusable next action identifies the same practice and opens the existing exercise flow on tap.
- Given no valid acknowledged completion, when the user opens Exercises, then the existing discovery catalog renders without an empty or misleading continuation card.
- Given an invalid or failed completion lookup, when the user opens Exercises, then the catalog remains usable and no invalid route is created.
- Given any reusable practice copy, when it is rendered, then it makes no diagnostic, guaranteed-relief, or clinical-efficacy claim.

## Implementation Notes

- Direct implementation was used because the auto workflow's required subagent dispatch was unavailable. Reused the existing Jump Back In shelf as the reusable practice surface; the latest valid completion is placed first and remains subject to the existing exercise registry filter.
- Files touched: `src/domains/practice/data/practiceCompletion.repo.ts`, `src/screens/ExercisesScreen/hooks/useRecentPracticeCompletion.ts`, `src/screens/ExercisesScreen/ExercisesScreen.tsx`, and `src/screens/ExercisesScreen/components/ExerciseDiscoverySection.tsx`.

## Plan Change Log

## Review Triage Log

- Self-review: no verified findings. The latest valid completion is validated before it is inserted into the existing shelf; missing, malformed, failed, and unknown exercise rows leave the existing catalog usable.

## Design Notes

The reusable action belongs in the existing Jump Back In discovery area because that surface already communicates “return to a known exercise” and preserves access to the full catalog. It should be one item, not a new dashboard or duplicate catalog.

## Verification

**Commands:**
- `npx oxlint src/domains/practice/data/practiceCompletion.repo.ts src/screens/ExercisesScreen/ExercisesScreen.tsx src/screens/ExercisesScreen/hooks/useRecentPracticeCompletion.ts src/screens/ExercisesScreen/components/ReusablePracticeCard.tsx` -- expected: no errors; existing warnings may remain.
- `git diff --check` -- expected: no whitespace errors.

**Manual checks (if no CLI):**
- With a valid completion row, open Exercises and confirm the reusable card appears once and reopens the registered exercise.
- With no completion row, confirm the existing catalog and Jump Back In behavior are unchanged.
