---
tracker_id: ""
key: ""
type: epic
title: "Guided course-to-practice loop"
parent: initiative-happy-product-direction
covers: ["CAP-2"]
after: []
assignee: ""
risk: medium
estimate: ""
estimate_basis: ""
---

# Guided course-to-practice loop

## Description

Connect the starter lesson to one relevant CBT or coping practice so learning leads to action. The practice must start, complete, persist its completion signal, make the next step understandable, and remain reusable from the Exercises library without turning progress into evidence of clinical benefit.

## Outcome

Users who finish a starter lesson can complete one relevant guided practice, understand what to do next, and return to the same tool later; CAP-2 is observable through the lesson-to-practice handoff, completion state, and reusable library entry.

## Requirements

- CAP-2: Users can choose and complete a guided CBT or coping practice relevant to the lesson or current need.

## Done when

1. A starter lesson resolves to one relevant guided CBT or coping practice.
2. The practice can be started and completed through the existing exercise runtime.
3. Completion is visible, persisted as one acknowledged `PracticeCompletionV1`, and available as the continuation input for the reflection epic.
4. Retrying a practice does not create duplicate completion evidence, and the completed tool remains directly reusable from Exercises or coping cards.
5. The user sees one clear next action after completion, with current-session feedback separated from later insight readiness.
6. Copy and rewards encourage practice without implying diagnosis, guaranteed relief, or clinical efficacy.

## Boundaries

Owns the lesson-to-practice handoff, exercise selection for the starter path, reusable exercise/coping-tool access, practice completion, continuation signal, and localized practice copy. It does not own onboarding goal selection, journal storage, or insight interpretation.

## References

- spec — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md, CAP-2 and Constraints
- guardrails — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/product-guardrails.md, Experience rules and Health and claim boundaries
- flow — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/experience-flow.md, Returning user and Existing surface map
- architecture — _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md, AD-2, AD-3, AD-4, and AD-8
- design — DESIGN.md, Overview, Typography, and Components
- code — src/domains/journey, src/data/exerciseRegistry.ts, and app/tabs/screens/(exercises)

## Notes

- Waits on Epic 1's StarterPath and lesson-to-practice handoff contracts.
- Unknown: the exact first practice and its content mapping.
- Decision: Practice progress is owned here; Epic 1 only owns course-level path selection and resume semantics.
- Decision: A stable `practice_session_id` and acknowledged normalized completion are the handoff to reflection and insight work; retry attempts do not count as new sessions.
