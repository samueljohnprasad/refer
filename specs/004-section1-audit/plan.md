# Implementation Plan: Section 1 Content Audit and Refactor

**Branch**: `004-section1-audit` | **Date**: 2026-08-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/004-section1-audit/spec.md`

## Summary

Streamline the content in `supabase/seed/sleep_reset_section_1.sql` by reducing the over-segmented 5-7 screen lessons in Unit 1 and Unit 2 down to 2-3 high-value screens. We will remove redundant `fill_blank` quizzes and premature `if_then_plan` commitments, adjusting the `order_index` fields and ensuring orphaned exercise rows are fully deleted from the database.

## Technical Context

**Language/Version**: SQL / JSONB (and Python 3 script for automation)

**Primary Dependencies**: Supabase (PostgreSQL 15)

**Storage**: PostgreSQL (`supabase/seed/sleep_reset_section_1.sql`)

**Testing**: Local verification of SQL syntax and logic via direct execution or local db reset.

**Target Platform**: Supabase Postgres DB

**Project Type**: Database Seed Migration

**Performance Goals**: N/A

**Constraints**: Must execute cleanly without foreign key constraints failing or unique index violations.

**Scale/Scope**: ~10 lessons across Unit 1 and Unit 2 of the Sleep Reset course.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **I. One Learning Job Per Exercise**: Enforced. Removing over-segmentation aligns perfectly with minimizing cognitive load.
- [x] **II. One Active Decision or Control at a Time**: Enforced. Removing redundant interactions.
- [x] **VII. Minimal, Ponytail-Mode Code (YAGNI)**: Enforced. The fix is a one-time data transformation script or manual SQL edit, introducing no new abstractions.

All gates passed.

## Project Structure

### Documentation (this feature)

```text
specs/004-section1-audit/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (to be generated)
```

### Source Code (repository root)

```text
supabase/
└── seed/
    └── sleep_reset_section_1.sql  # The target file containing the JSON payload
```

**Structure Decision**: The project only requires modifying a single seed file. A Python script can be used in the scratch pad to safely parse, modify, and rewrite the JSON block in place.

## Complexity Tracking

N/A
