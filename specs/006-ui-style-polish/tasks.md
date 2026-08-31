# Tasks: UI Style Polish

## Phase 1: Setup

**Purpose**: Project initialization and basic structure

- [X] T001 Verify Expo development environment and dependencies are ready

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: N/A for this scope. Changes are direct UI tweaks.

---

## Phase 3: User Story 1 - Apply Final 10% Visual Polish (Priority: P1) 🎯 MVP

**Goal**: Execute styling tweaks to match the Apple/Duolingo-inspired restraint.

**Independent Test**: Visually verify components in the iOS Simulator.

### Implementation for User Story 1

- [X] T002 [P] [US1] Reduce Title and Prompt font sizes in `src/components/exercise/CourseExerciseHeading.tsx`
- [X] T003 [P] [US1] Reduce selected border width to 1pt in `src/components/exercise/CourseExerciseOptionButton.tsx`
- [X] T004 [P] [US1] Reduce feedback checkmark icon size and label size in `src/components/exercise/CourseExerciseFeedbackPanel.tsx`
- [X] T005 [P] [US1] Reduce reveal checkmark icon size, label size, and top margin in `src/components/exercise/IntuitionCheckCategoryEngine.tsx`
- [X] T006 [P] [US1] Reduce primary CTA depth and soften Skip button typography in `src/components/exercise/CourseExerciseShell.tsx`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T007 Run quickstart.md validation locally on the iOS simulator

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: Can start immediately
- **User Story 1**: Tasks T002-T006 can be run in parallel as they touch different files.

## Parallel Example: User Story 1

```bash
# Launch all style updates together
Task: "Reduce Title and Prompt font sizes in src/components/exercise/CourseExerciseHeading.tsx"
Task: "Reduce selected border width to 1pt in src/components/exercise/CourseExerciseOptionButton.tsx"
Task: "Reduce primary CTA depth and soften Skip button typography in src/components/exercise/CourseExerciseShell.tsx"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 3: User Story 1
2. **STOP and VALIDATE**: Test User Story 1 visually on the iOS simulator
