---
title: 'Resolve StarterPath practice contracts'
type: 'feature'
ticket: '1'
created: '2026-10-15'
status: done
route: 'full'
route_source: 'auto'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md'
  - '/Users/samuelprasad/Desktop/happy/journals/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** StarterPath metadata names the practice handoff, but the contract is not yet guarded where a path opens an exercise. A mismatch could send a user to a missing or unrelated tool.

**Approach:** Reuse the existing exercise registry as the source of truth and add a small contract resolver/check at the StarterPath boundary. Preserve both authored paths and the existing anxiety-path identifiers; do not add new exercise content.

## Boundaries & Constraints

**Always:** Keep `ANXIOUS_THOUGHTS_STARTER_PATH` unchanged; validate every authored `practiceRef`; preserve localized copy keys, path lineage, and the existing exercise-flow route.

**Never:** Do not redesign onboarding, change exercise content, add a new persistence model, or imply clinical efficacy.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| HAPPY_PATH | Anxiety or overwhelmed StarterPath | Resolver returns the registered exercise and preserves path metadata | No error expected |
| UNKNOWN_PRACTICE | Path references an unregistered exercise | Contract is rejected before navigation | Surface existing completion error; do not navigate |
| PATH_SWITCH | User switches between authored paths | Selected path resolves to its own registered practice | Previous path identifiers remain unchanged |

</frozen-after-approval>

## Code Map

- `src/domains/journey/model/starterPath.ts` -- authored path contracts, practice references, and path lineage; reuse `STARTER_PATHS` and preserve anxiety identifiers.
- `src/data/exerciseRegistry.ts` -- registered exercise IDs and `getExerciseConfig`; use it as the practice-reference source of truth.
- `src/screens/StarterPathScreen/StarterPathScreen.tsx` -- selects the active path and navigates to exercise flow; add only boundary validation before navigation.
- `src/screens/StarterPathScreen/StarterPathParts.tsx` -- renders path and practice copy; do not change visual treatment for this story.
- `src/domains/journey/data/starterPathProgress.repo.ts` -- persists path next-action lineage; do not change persistence schema for this story.

## Tasks & Acceptance

**Execution:**
- [ ] `src/domains/journey/model/starterPath.ts` -- expose a typed resolver or validation helper for registered practice references -- keep path metadata separate from registry lookup.
- [ ] `src/screens/StarterPathScreen/StarterPathScreen.tsx` -- use the contract resolver before opening exercise flow -- prevent invalid navigation while preserving current error handling.
- [ ] `src/data/exerciseRegistry.ts` -- reuse the existing registry lookup without changing exercise registration or content.

**Acceptance Criteria:**
- Given an authored StarterPath, when its practice handoff is opened, then the resolved exercise ID exists in the exercise registry and the path ID and source lineage are preserved.
- Given the anxiety StarterPath, when its contract is resolved, then it still targets `thought_catcher` with the existing course and lesson identifiers.
- Given the overwhelmed StarterPath, when its contract is resolved, then it targets `grounding_54321` and opens the existing exercise flow.
- Given an invalid practice reference, when the user attempts the handoff, then navigation is prevented and the existing localized completion error is shown.

## Implementation Notes

- Added a typed StarterPath practice resolver that delegates registration checks to the exercise registry.
- Guarded StarterPath exercise navigation so an invalid practice reference shows the existing completion error instead of navigating.

## Plan Change Log

## Review Triage Log

## Verification

**Commands:**
- `npx oxlint src/domains/journey/model/starterPath.ts src/data/exerciseRegistry.ts src/screens/StarterPathScreen/StarterPathScreen.tsx` -- expected: no errors.
- `git diff --check` -- expected: success.

**Manual checks (if no CLI):**
- Inspect the two StarterPath handoffs and confirm each opens its registered exercise without changing the anxiety-path contract.
