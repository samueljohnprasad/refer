---
title: 'Selected StarterPath enrolls its matching course'
type: 'bugfix'
ticket: 10
created: '2026-10-16'
status: 'built'
baseline_revision: '3612b5a6'
route: 'full'
route_source: 'pinned'
review: 'thorough'
review_source: 'pinned'
lenses_ran: ['blind-hunter', 'edge-case-hunter', 'verification-gap', 'intent-alignment']
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md'
  - '/Users/samuelprasad/Desktop/happy/journals/DESIGN.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/spec-happy-product-direction/starter-paths.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** StarterPath completion currently submits a hardcoded anxiety motivation to the shared onboarding completion hook. Selecting the approved stress path can therefore enroll the anxiety course even though the path contract names a different canonical course.

**Approach:** Make each authored StarterPath carry the resolver-compatible motivation that owns its course enrollment. Pass the selected path's motivation through the existing onboarding completion boundary, while preserving the general motivation resolver and the active StarterPath selection.

## Boundaries & Constraints

**Always:** Treat the selected StarterPath as authoritative for its course enrollment. Keep catalog lookup inside the existing motivation-to-course resolver. Preserve anonymous Supabase ownership, existing path progress, the anxiety starter behavior, and unrelated onboarding motivations.

**Never:** Do not add a new course lookup layer, change database schema, change course catalog titles, alter practice or reflection routing, or use the display label as the enrollment identifier.

</frozen-after-approval>

## Code Map

- `src/domains/journey/model/starterPath.ts` -- authored StarterPath contract and the anxiety/stress path definitions; the path metadata is the source for selected-path enrollment intent.
- `src/screens/StarterPathScreen/StarterPathScreen.tsx` -- completes the selected StarterPath and currently supplies the incorrect hardcoded anxiety motivation.
- `hooks/data/useCompleteOnboarding.ts` -- shared persistence and catalog-backed enrollment boundary; reuse its existing resolver and deferred-enrollment behavior.
- `src/screens/OnboardingScreen/utils/courseResolver.ts` -- canonical `MotivationAnswer` to published course catalog lookup; do not duplicate it.
- `src/screens/OnboardingScreen/types.ts` -- defines `MotivationAnswer`, the type to use for path enrollment metadata.
- `src/domains/journey/data/starterPathProgress.repo.ts` -- existing active-path persistence; no changes expected.

## Tasks & Acceptance

**Execution:**
- [x] Add resolver-compatible motivation metadata to each authored StarterPath -- keep course intent with the path contract.
- [x] Pass selected-path motivation from StarterPath completion -- remove the hardcoded anxiety enrollment input without changing the shared resolver.
- [x] Run focused static checks and inspect the diff -- prove scope stayed within the contract and no unrelated path behavior changed.

**Acceptance Criteria:**
- Given an anonymous user completes Understand anxious thoughts, when onboarding completes, then the anxiety course remains enrolled and active.
- Given an anonymous user completes Feel less overwhelmed, when onboarding completes, then the Steady Under Pressure course is enrolled and active.
- Given a published catalog match is absent, when authored-path completion runs, then no unrelated default course is selected.
- Given general onboarding supplies any supported motivation, when enrollment resolves, then its existing catalog mapping remains unchanged.

## Implementation Notes

- Added path-owned `MotivationAnswer` metadata for the anxiety and stress paths.
- Completion now passes the selected path's motivation to the shared onboarding resolver and records that same motivation as the profile reason.
- Repository inspection found separate pre-existing course-catalog inconsistencies: the configured local seed does not include the authored stress course, and the anxiety resolver keyword does not match every existing anxiety seed title. Those are deferred release/content work, not silently treated as fixed by this handoff change.
- `git diff --check` passed and touched files remain within the 300-line rule. ESLint was unavailable because `node_modules/.bin/eslint` is missing and the network-backed `npx` fallback did not return; full TypeScript checking also did not return before interruption.

## Plan Change Log

## Review Triage Log

- blind-hunter finding at `src/domains/journey/model/starterPath.ts:75`: deferred, real pre-existing resolver/catalog-title mismatch; a separate course catalog alignment ticket is needed.
- blind-hunter finding at `src/domains/journey/model/starterPath.ts:123`: deferred, real pre-existing publication-state mismatch; the authored stress course is not in the configured published seed.
- blind-hunter finding at `src/screens/StarterPathScreen/StarterPathScreen.tsx:220`: patched, profile reasons now follow the selected path motivation.
- blind-hunter finding at `src/domains/journey/model/starterPath.ts:1`: low and rejected as negligible for this slice; moving a shared union is a broader refactor with no demonstrated user-facing harm.
- verification-gap finding at the StarterPath motivation handoff: deferred, runtime enrollment evidence is not available in the current local checks and repository rules prohibit adding test cases.
- intent-alignment finding: accepted as a boundary note; this change intentionally implements the contract and handoff layers, while catalog publication and runtime persistence remain separate release evidence.

## Verification

**Commands:**
- `git diff --check` -- expected: no whitespace errors.
- `npx eslint src/domains/journey/model/starterPath.ts src/screens/StarterPathScreen/StarterPathScreen.tsx` -- expected: no new lint errors in touched files.
- `git diff --stat` and line-count check for touched component/helper files -- expected: only the scoped contract and handoff change; each touched component, hook, and helper remains at or below 300 lines.

**Manual checks (if no CLI):**
- Trace both authored paths from `StarterPathScreen.completePath` into `useCompleteOnboarding.markCompleted` and confirm the motivation is selected-path data, not a hardcoded default.
