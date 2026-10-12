---
tracker_id: ""
key: ""
type: epic
title: "Private reflection"
parent: initiative-happy-product-direction
covers: ["CAP-3"]
after: []
assignee: ""
risk: high
estimate: ""
estimate_basis: ""
---

# Private reflection

## Description

Turn the completed practice into a small, guided private reflection. The first tracer uses text so the team can verify persistence, retrieval, ownership, and privacy clearly before expanding to voice or photo inputs.

## Outcome

Users can complete and later retrieve one guided text reflection privately after practice; CAP-3 is observable without relying on unverified voice, photo, or AI-processing claims.

## Requirements

- CAP-3: Users can create a guided reflection through a supported input and retrieve it later in their private journal.

## Done when

1. A completed practice opens one relevant guided text reflection.
2. The reflection and required path/practice lineage are saved to the canonical journal boundary under the authenticated user.
3. The user can retrieve the saved reflection later without exposing it publicly.
4. A saved journal record is not counted as guided evidence until its required lineage is acknowledged.
5. Ownership, deletion, retention behavior, and boundary copy are accurate at the user-facing surface.
6. Voice and photo are either verified and included explicitly or clearly deferred without misleading copy.

## Boundaries

Owns the post-practice reflection prompt, text capture, canonical persistence, private retrieval, and reflection-specific localized copy. It does not own practice completion, insight aggregation, or broad AI-generated interpretation.

## References

- spec — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/spec-happy-product-direction.md, CAP-3, Constraints, Assumptions, and Open Questions
- guardrails — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/product-guardrails.md, Privacy and sensitive content
- flow — _bmad-output/initiative-happy-product-direction/spec-happy-product-direction/experience-flow.md, First-time user, Existing surface map, and Product boundaries
- architecture — _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md, AD-2, AD-3, AD-7, and AD-8
- design — DESIGN.md, Overview, Typography, and Components
- code — hooks/data/useMentalHealthData.ts, hooks/post/useSaveJournal.ts, hooks/journals, and app/tabs/(tabs)/journal

## Notes

- Waits on Epic 2's practice completion output and continuation signal.
- Decision: Start with text reflection in the tracer.
- Source conflict: current code uses both `journal_records` and `journal_entries`; canonical table, retrieval path, ownership/RLS behavior, and retention must be resolved before implementation.
- Decision: Guided text reflection carries mandatory `ReflectionContextV1` lineage; voice and photo remain visibly gated until their privacy and processing evidence is verified.
- Unknown: which privacy, AI-processing, deletion, and retention claims are verified for the released build.
