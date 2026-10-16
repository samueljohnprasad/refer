---
id: 3
type: story
title: "Private journal retrieval and lineage display"
parent: epic-private-reflection
covers: [CAP-3]
after: [2]
hitl: true
risk: medium
---

# Private journal retrieval and lineage display

## Description

Surfaces saved reflections in the private journal feed with guided lineage metadata, verifies RLS privacy scoping, and supports user-initiated deletion with cascading lineage removal.

## Acceptance Criteria

Verify: User can view saved guided reflections in their private journal with accurate path/exercise context; reflections are never visible publicly; user can delete a reflection and its lineage is cleanly purged.

## References

- parent — _bmad-output/initiative-happy-product-direction/epic-private-reflection/epic-private-reflection.md
- _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md#ad-7
- src/screens/JournalEntryScreen
- hooks/journals/useJournalOperations.ts

## Notes

- Unknown: How existing timeline/daily-notes journal views format custom guided reflection records and badges.
