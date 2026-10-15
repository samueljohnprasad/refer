---
id: 2
type: story
title: "Persist acknowledged practice completion"
parent: epic-guided-practice-loop
covers: [CAP-2]
after: [1]
hitl: false
risk: high
---

# Persist acknowledged practice completion

## Description

Connects the starter practice runtime to one stable practice session and persists one normalized PracticeCompletionV1 without duplicate evidence on retry.

## Acceptance Criteria

Verify: A user can start and complete the mapped practice, reload the app, and see the acknowledged completion restored; repeating the practice does not create duplicate completion evidence.

## References

- parent — _bmad-output/initiative-happy-product-direction/epic-guided-practice-loop/epic-guided-practice-loop.md
- _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md#ad-3
- _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md#ad-8
- src/domains/journey

## Notes

- Unknown: The existing exercise completion boundary and durable storage path must be confirmed before implementation so anonymous progress and later reflection lineage remain intact.
