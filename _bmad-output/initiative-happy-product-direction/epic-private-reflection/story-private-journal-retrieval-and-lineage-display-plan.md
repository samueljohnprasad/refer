---
title: "Private journal retrieval and lineage display"
type: "feature"
ticket: "3"
created: "2026-10-15"
status: done
route: "full"
route_source: "auto"
review: "quick"
review_source: "pinned"
lenses_ran: ["quick"]
review_loop_iteration: 0
context:
  - "/Users/samuelprasad/Desktop/happy/journals/PRODUCT.md"
  - "/Users/samuelprasad/Desktop/happy/journals/DESIGN.md"
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Saved guided reflections were stored in `journal_records` and `journal_reflection_lineage`, but the journal feed and entry details did not display reflection lineage or distinguish guided entries from unguided ones. Furthermore, `journal-entry` route still selected from legacy `journal_entries` instead of canonical `journal_records`.

**Approach:** Resolve the canonical retrieval path to `journal_records` with joined `journal_reflection_lineage`. Surface a distinctive `GuidedReflectionBadge` in both `EntryCard` (compact badge) and `JournalEntryScreen` (lineage context card). Verify database-level `ON DELETE CASCADE` so deleting a journal record automatically purges its lineage.

## Boundaries & Constraints

**Always:** Ensure private journal entries are scoped strictly to `auth.uid()`; show clear guided practice lineage (e.g. Anxious Thoughts or Grounding Reset); preserve existing bookmarking, editing, and deletion operations; delete cascade must purge lineage rows without orphan data.

**Never:** Do not expose reflections publicly or across user boundaries; do not create duplicate lineage rows on edit; do not use legacy `journal_entries` for new canonical reflection retrieval.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|---------------|----------------------------|----------------|
| GUIDED_ENTRY_LIST | Entry with non-null journal_reflection_lineage | Shows Guided · Anxious Thoughts / Grounding Reset badge on EntryCard | Falls back to normal card if lineage is null |
| GUIDED_ENTRY_DETAIL | User opens journal entry route | Shows full Guided CBT Reflection lineage card with practice context | Falls back to standard entry view if no lineage |
| DELETE_RECORD | User deletes guided journal entry | Record deleted from journal_records; FK ON DELETE CASCADE purges lineage | Rollback / alert if delete fails |
| RLS_SECURITY | User queries feed | Only records matching auth.uid() are returned; no public exposure | Enforced by Supabase RLS |

</frozen-after-approval>

## Code Map

- `hooks/data/types.ts` -- added `journal_reflection_lineage` to `JournalEntry` type.
- `hooks/data/useMentalHealthData.ts` -- joins `journal_reflection_lineage(*)` on `journal_records` select.
- `app/tabs/screens/(recording)/journal-entry.tsx` -- resolved fallback query to canonical `journal_records` with lineage.
- `src/domains/journal/ui/GuidedReflectionBadge.tsx` -- badge component for feed cards and entry details.
- `src/screens/DailyNotesScreen/notes/EntryCard.tsx` -- renders `GuidedReflectionBadge` above entry title.
- `src/screens/JournalEntryScreen/JournalEntryScreen.tsx` -- renders `GuidedReflectionBadge` context card above transcript.

## Tasks & Acceptance

**Execution:**
- [x] Update `JournalEntry` type and `useMentalHealthData` select query to include `journal_reflection_lineage(*)`.
- [x] Switch `journal-entry.tsx` to canonical `journal_records` with joined lineage.
- [x] Implement `GuidedReflectionBadge.tsx` with size variants ("sm" and "md").
- [x] Render compact badge on `EntryCard.tsx` in `DailyNotesScreen`.
- [x] Render lineage context card in `JournalEntryScreen.tsx`.
- [x] Verify delete cascade purge via database foreign key.

**Acceptance Criteria:**
- Given a saved guided reflection, it is retrieved in the daily notes journal feed with a `Guided · [Path]` badge.
- Given a saved guided reflection, opening its detail screen displays the `Guided CBT Reflection` context card.
- Given a user deletes a reflection, the journal record and its associated lineage are purged together.
- All journal queries remain strictly scoped by `auth.uid()`.
