---
title: 'Canonical starter courses are published and enrollable end to end'
type: 'bugfix'
ticket: 11
created: '2026-10-16'
status: draft
baseline_revision: 'a9bd6823'
route: 'full'
route_source: 'manual'
review: 'thorough'
review_source: 'manual'
lenses_ran: []
review_loop_iteration: 0
context:
  - '/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/spec-happy-product-direction/starter-paths.md'
  - '/Users/samuelprasad/Desktop/happy/journals/_bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md'
---

## Intent

Make the two approved StarterPaths real from selection through Supabase enrollment and first-lesson launch. The path, resolver, seed data, local reset, and release environment must agree on the same canonical course identity.

## Current evidence

- `starterPath.ts` carries source-like values (`anxiety` and `stress-steady-under-pressure`) in a field named `courseId`, but the resolver ignores those values and matches catalog display titles.
- `courseResolver.ts` searches for `quieting the storm`, while the published authored anxiety seed is `Anxiety: From Alarm to Action`.
- `courseServerQueries.ts` only returns `is_published = true` courses.
- `supabase/config.toml` loads the legacy Anxiety Toolkit and Sleep Reset seeds but not the authored anxiety or stress seed files.
- The three authored stress seed files currently upsert `Steady Under Pressure` with `is_published = false`.
- `useCompleteOnboarding.ts` already owns the enrollment boundary and dispatches the active course after `startCourse`; reuse it.

## End-to-end plan

### 1. Establish one stable identity contract

- Treat the existing deterministic UUID derived from each seed source id as the canonical runtime course id.
- Align the authored StarterPath metadata with those UUIDs:
  - `anxiety` → `d3af37c0-435a-2336-62c1-e99dbff0664d`
  - `stress-steady-under-pressure` → `05ccaf20-0d29-dae7-fa3e-3719ac8c7ca0`
- Update the motivation resolver to compare `catalog.id` to the canonical target id, not to a display title.
- Keep the existing motivation API for ordinary onboarding and preserve the selected path's motivation from ticket 1.10.

### 2. Make local data reproduce the contract

- Add `anxiety_section_1_unit_1.sql` and `stress_steady_under_presssure_section_{1,2,3}.sql` to the ordered `supabase/config.toml` seed list.
- Mark the authored stress course published in every canonical stress seed file so later section upserts cannot revert it to unpublished.
- Confirm the anxiety seed remains published and contains `anxiety-s1-u1-n1-anxiety-has-a-job`.
- Keep the legacy Anxiety Toolkit seed available for existing surfaces unless a separate product decision retires it; it must not be selected by either authored StarterPath.

### 3. Preserve the existing completion boundary

- Keep `useCompleteOnboarding.ts` as the only enrollment write path.
- Do not add a second StarterPath enrollment mutation or local-only course state.
- Confirm that a missing canonical id returns `null` and never selects a different course.
- Keep active-course Redux state synchronized only after the server `startCourse` mutation succeeds.

### 4. Promote and verify hosted data

- Apply the authored-course seed content to the isolated preview or release Supabase project using the repository's approved promotion path.
- Verify both canonical rows have the expected UUID, title, and `is_published = true`.
- Verify the authored first lesson node belongs to the matching course and can open through the released client.
- Record the environment and evidence; local seed success must not be reported as hosted or App Store release success.

### 5. Run the proof flow

- Start a fresh anonymous session and complete `Understand anxious thoughts`; verify the enrolled course id/title, active course id, Journeys course, and first authored lesson.
- Start another fresh anonymous session and complete `Feel less overwhelmed`; verify the matching stress enrollment and first authored lesson.
- Confirm the selected path's progress, practice handoff, reflection, and Home continuation remain unchanged.
- Confirm a non-StarterPath motivation still resolves through its existing mapping.
- Run `git diff --check` and the narrowest available static checks. Do not add test cases under the project rules.

## Files expected to change during build

- `src/domains/journey/model/starterPath.ts`
- `src/screens/OnboardingScreen/utils/courseResolver.ts`
- `supabase/config.toml`
- `supabase/seed/stress_steady_under_presssure_section_1.sql`
- `supabase/seed/stress_steady_under_presssure_section_2.sql`
- `supabase/seed/stress_steady_under_presssure_section_3.sql`
- Possibly a release-data migration or promotion record, only if the hosted environment requires one.

## Acceptance evidence

- Static: no authored StarterPath resolver branch compares a display title; both canonical target ids are explicit and consistent with the seed UUIDs.
- Local data: a clean reset exposes both authored courses in the published catalog and leaves the legacy course untouched.
- Runtime: each clean anonymous flow creates exactly the selected course enrollment, sets that course active, and opens the matching first lesson.
- Safety: a missing target produces no unrelated enrollment; no sensitive reflection content is added to logs or analytics.
- Release: preview/hosted verification is recorded separately from local verification.

## Deferred or blocked evidence

- The current worktree has an unrelated user edit in `src/screens/DailyNotesScreen/notes/EntryCard.tsx`; preserve it and do not include it in this ticket.
- The hosted Supabase project and release build are not verified by repository inspection alone.
- No code should be committed or pushed until the user explicitly authorizes that action.
