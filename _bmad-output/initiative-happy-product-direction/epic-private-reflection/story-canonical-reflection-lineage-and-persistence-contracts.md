---
id: 1
type: story
title: "Canonical reflection lineage and persistence contracts"
parent: epic-private-reflection
covers: [CAP-3]
after: [epic-guided-practice-loop, epic-job-led-first-use]
hitl: false
risk: high
---

# Canonical reflection lineage and persistence contracts

## Description

Defines the ReflectionContextV1 schema and establishes atomic persistence and delete-cascade for journal_records and journal_reflection_lineage under auth.uid().

## Acceptance Criteria

Verify: Saving a guided reflection atomically records the canonical journal record and ReflectionContextV1 row; deleting the record deletes its lineage; unlinked journal rows cannot satisfy guided step criteria.

## References

- parent — _bmad-output/initiative-happy-product-direction/epic-private-reflection/epic-private-reflection.md
- _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md#ad-7
- _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction/architecture-happy-product-direction.md#ad-8
- src/domains/practice/data/practiceCompletion.repo.ts

## Notes

- Unknown: The exact schema and migration for journal_reflection_lineage and ensuring RLS and foreign-key cascade with journal_records are verified before building client integration.
