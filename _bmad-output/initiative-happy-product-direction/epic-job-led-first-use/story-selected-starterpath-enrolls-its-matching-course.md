---
id: 10
type: story
title: "Selected StarterPath enrolls its matching course"
parent: epic-job-led-first-use
covers: ["CAP-1", "CAP-5"]
after: [9]
refined: true
hitl: false
risk: medium
---

# Selected StarterPath enrolls its matching course

## Description

Binds each selected StarterPath to its matching onboarding motivation so completing the first loop enrolls the chosen canonical course without silently falling back to the anxious-thoughts course.

## Acceptance Criteria

1. **Each authored path enrolls its matching course**
   **Given** an anonymous user selects an authored StarterPath
   **When** the user completes the starter path and returns to Home
   **Then** the active course is the canonical course assigned to that selected path
   **And** the selected StarterPath remains the active path
2. **A missing course does not silently switch the user to another path**
   **Given** the selected path's course cannot be resolved from the available catalog
   **When** starter completion runs
   **Then** no unrelated default course is enrolled
   **And** the selected path and its progress remain associated with the user
3. **The existing anxious-thoughts path remains stable**
   **Given** an anonymous user selects Understand anxious thoughts
   **When** the user completes the starter path
   **Then** the anxiety course, Thought Catcher handoff, and existing completion behavior remain unchanged
4. **Unrelated onboarding motivations remain stable**
   **Given** a user completes the general onboarding flow with a supported motivation outside the authored StarterPaths
   **When** course enrollment resolves
   **Then** the existing motivation-based course resolver still chooses the matching catalog course

## Boundaries

- Must not change: StarterPath progress persistence, practice routing, reflection capture, Home surface behavior, or the general onboarding course resolver's mappings.

## References

- parent — _bmad-output/initiative-happy-product-direction/epic-job-led-first-use/epic-job-led-first-use.md, Requirements and Done when
- spec — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md, Constraints
- starter paths — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/starter-paths.md, Contract
- architecture — _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md, AD-4

## Notes

- Decision: The StarterPath contract is authoritative for the selected path's course enrollment; a hardcoded default is not a valid fallback.
- Assumption: The existing onboarding motivation-to-course resolver remains the single course-catalog lookup boundary.
