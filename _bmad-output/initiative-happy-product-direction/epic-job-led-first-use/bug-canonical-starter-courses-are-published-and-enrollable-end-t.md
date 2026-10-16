---
id: 11
type: bug
title: "Canonical starter courses are published and enrollable end to end"
parent: epic-job-led-first-use
covers: [CAP-1, CAP-5]
after: [10]
refined: false
hitl: true
risk: high
---

# Canonical starter courses are published and enrollable end to end

## Description

Closes the remaining enrollment gap after ticket 1.10: the authored StarterPaths must resolve to stable canonical course identities, those courses must be present and published in reproducible local and hosted data, and completion must persist the selected enrollment so Journeys opens the matching first lesson.

## Frozen Intent

**Problem:** Ticket 1.10 now passes the selected path's motivation, but the shared resolver still searches mutable display-title text. The local seed configuration omits the authored anxiety and stress courses, and the authored stress course is unpublished in its seed files. A path can therefore complete onboarding while course enrollment is deferred or points at no matching course.

**Approach:** Make each authored StarterPath point to the deterministic UUID generated from its canonical seed source id. Resolve a StarterPath's motivation through that stable course id, include the authored course seeds in reproducible local setup, publish the two approved starter courses, and verify the same data contract in the release environment. Keep the existing shared onboarding resolver boundary and do not add a parallel course system.

## Boundaries & Constraints

**Always:** Keep the selected StarterPath authoritative; use the canonical Anxiety: From Alarm to Action course for `understand_anxious_thoughts` and Steady Under Pressure for `feel_less_overwhelmed`; preserve anonymous Supabase ownership, active-course state, existing path progress, and unrelated motivation mappings; keep the first loop free and non-diagnostic.

**Never:** Do not match by display title, silently fall back to another course, add a duplicate StarterPath lesson state, change reflection or practice routing, expose private reflection content to analytics, or claim hosted/release success without environment evidence.

## Acceptance Criteria

**Given** a clean database reset with the configured authored-course seeds, **when** an anonymous user completes Understand anxious thoughts, **then** the user has an enrollment for Anxiety: From Alarm to Action and its authored first lesson opens.

**Given** a clean database reset with the configured authored-course seeds, **when** an anonymous user completes Feel less overwhelmed, **then** the user has an enrollment for Steady Under Pressure and its authored first lesson opens.

**Given** a canonical target is absent or unpublished, **when** course resolution runs, **then** it returns no course id and does not enroll an unrelated default course.

**Given** any supported non-StarterPath motivation, **when** onboarding completion resolves its course, **then** its existing mapping remains unchanged.

**Given** the release candidate uses the isolated preview or hosted Supabase project, **when** the same two clean-session flows are repeated, **then** the course rows, publication state, enrollment rows, active course, and first lesson all match the local contract.

## References

- parent — _bmad-output/initiative-happy-product-direction/epic-job-led-first-use/epic-job-led-first-use.md
- _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md#Constraints
- _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/starter-paths.md#contract
- _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md#Operational-Envelope
- _bmad-output/initiative-happy-product-direction/epic-job-led-first-use/story-selected-starterpath-enrolls-its-matching-course.md
- src/domains/journey/model/starterPath.ts
- src/screens/OnboardingScreen/utils/courseResolver.ts
- hooks/data/useCompleteOnboarding.ts
- src/domains/journey/data/courseServerQueries.ts
- supabase/config.toml
- supabase/seed/anxiety_section_1_unit_1.sql
- supabase/seed/stress_steady_under_presssure_section_1.sql

## Notes

- Unknown: The hosted course rows, publication state, seed promotion path, and current release environment must be verified before claiming this works outside the local fixture.
- No new product capability is introduced. This bug closes an implementation and data-promotion gap already covered by CAP-1, CAP-5, the StarterPath contract, and AD-4.
