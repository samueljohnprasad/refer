---
id: 1
type: story
title: "Resolve StarterPath practice contracts"
parent: epic-guided-practice-loop
covers: [CAP-2]
after: [epic-job-led-first-use]
hitl: false
risk: medium
---

# Resolve StarterPath practice contracts

## Description

Maps each authored StarterPath lesson to one existing guided exercise, preserving the anxiety path and exposing stable practice metadata to the handoff.

## Acceptance Criteria

Verify: Each authored path opens its mapped exercise with the expected localized title, practice reference, and source lineage; the existing anxiety path remains unchanged.

## References

- parent — _bmad-output/initiative-happy-product-direction/epic-guided-practice-loop/epic-guided-practice-loop.md
- _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md#ad-2
- src/domains/journey/model/starterPath.ts
- src/data/exerciseRegistry.ts

## Notes

- Unknown: The current authored mappings are anxiety to thought reframing and overwhelmed to 5-4-3-2-1 grounding; any additional path mapping must use an existing exercise unless product content is explicitly added.
