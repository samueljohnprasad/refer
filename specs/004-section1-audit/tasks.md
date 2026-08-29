# Tasks: Section 1 Content Audit and Refactor

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create Python script file `scripts/audit_section1.py`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T002 Implement file reading and regex/string-search logic in `scripts/audit_section1.py` to correctly isolate the 5th `jsonb_to_recordset` array in `supabase/seed/sleep_reset_section_1.sql`.

**Checkpoint**: Foundation ready - the script can read the specific JSON block to be modified.

---

## Phase 3: User Story 1 - Streamlined Unit 2 Lesson Progression (Priority: P1) 🎯 MVP

**Goal**: Prune the over-segmented lessons in Section 1 to a maximum of 3 interactions, removing forced recall quizzes and redundant plans.

**Independent Test**: The script successfully updates the SQL file and a `git diff` shows the correct nodes removed and `order_index` fields updated.

### Implementation for User Story 1

- [x] T003 [US1] Implement logic in `scripts/audit_section1.py` to filter out specific redundant exercises for Unit 1 (`u1_1_sleep_mechanics-n2`, `n3`).
- [x] T004 [US1] Implement logic in `scripts/audit_section1.py` to filter out specific redundant exercises for Unit 2 (`u1_2_sleep_disruptors-n1`, `n2`, `n3`, `n4`, `n6_experiment`) based on `research.md`.
- [x] T005 [US1] Implement logic in `scripts/audit_section1.py` to safely re-index the `order_index` sequentially (0, 1, 2, ...) for all remaining exercises grouped by `node_source_id`.
- [x] T006 [US1] Implement logic in `scripts/audit_section1.py` to inject the updated JSON payload back into `supabase/seed/sleep_reset_section_1.sql` while preserving SQL escaping rules.
- [x] T007 [US1] Implement logic in `scripts/audit_section1.py` to append a `DELETE FROM exercises WHERE id IN (...)` statement to `supabase/seed/sleep_reset_section_1.sql` using the IDs of the deleted items.

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T008 Execute `python3 scripts/audit_section1.py` to apply the changes to the seed file.
- [x] T009 Run `git diff supabase/seed/sleep_reset_section_1.sql` to verify the JSON structure and SQL syntax remained valid.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories.

### Parallel Opportunities

- Due to the nature of a single linear script modifying a single JSON block, there are minimal parallelization opportunities for implementation. Tasks should be written sequentially to avoid race conditions in the script construction.

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Run the script and check the SQL diff.

## Notes

- [Story] label maps task to specific user story for traceability
- The script must use `json.dumps()` securely without breaking unicode or generating invalid SQL string literals.
