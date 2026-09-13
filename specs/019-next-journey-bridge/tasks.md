# Tasks: Next Journey Bridge

**Feature**: Next Journey Bridge (Post-Course Completion)
**Spec**: [specs/019-next-journey-bridge/spec.md](./spec.md)
**Plan**: [specs/019-next-journey-bridge/plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Contract verification and domain types foundation

- [X] T001 Verify domain contracts and recommendation types in `specs/019-next-journey-bridge/contracts/NextJourneyBridgeContract.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core recommendation selector that MUST be complete before UI components can be wired

**⚠️ CRITICAL**: No user story UI work can begin until the recommendation selector foundation is ready

- [X] T002 Implement `selectNextCourseRecommendation` selector in `src/domains/journey/state/courseRecommendationSelectors.ts`
- [X] T003 Export recommendation selector and types in `src/domains/journey/state/journeySelectors.ts`

**Checkpoint**: Foundation ready - recommendation state can now be consumed by controller and UI components

---

## Phase 3: User Story 1 - Next Course Recommendation & 1-Tap Start (Priority: P1) 🎯 MVP

**Goal**: When viewing a completed course, display a floating dock card recommending the next uncompleted course in sequence with a 1-tap 3D tactile button to enroll and switch to it immediately.

**Independent Test**: Complete a course (or load completed course progress). Verify `NextJourneyBridgeDock` appears floating above the bottom tab bar showing the next course title with a tactile "Start [Next Course Title]" button. Tapping it switches active course and begins the new journey. The roadmap remains scrollable behind the dock.

### Implementation for User Story 1

- [X] T004 [P] [US1] Create presentational `NextJourneyBridgeDock` component using standard 3D tactile `Button` in `src/domains/journey/ui/components/NextJourneyBridgeDock.tsx`
- [X] T005 [US1] Update `useJourneyMapController` to expose recommendation state and handle next course transition in `src/domains/journey/ui/hooks/useJourneyMapController.tsx`
- [X] T006 [US1] Mount `NextJourneyBridgeDock` conditionally on completed course in `src/domains/journey/ui/JourneyMapView.tsx`

**Checkpoint**: At this point, User Story 1 is fully functional and delivers the core MVP post-completion loop.

---

## Phase 4: User Story 2 - Browse Catalog Secondary Action (Priority: P2)

**Goal**: Provide a secondary "Browse all courses" action on the dock so learners can explore other tracks if they do not wish to start the recommended course.

**Independent Test**: On a completed course with the dock visible, tap "Browse all courses" and verify the standard `CourseCatalogSheet` opens smoothly.

### Implementation for User Story 2

- [X] T007 [US2] Wire `onBrowseCatalog` handler in `src/domains/journey/ui/components/NextJourneyBridgeDock.tsx` and connect it to `onAddCoursePress` in `src/domains/journey/ui/JourneyMapView.tsx`

**Checkpoint**: At this point, User Stories 1 and 2 work seamlessly together.

---

## Phase 5: User Story 3 - All Caught Up Completionist State (Priority: P3)

**Goal**: If a user has completed all published courses in the catalog, display a celebratory "All Caught Up! 🌟" dock state with a 1-tap shortcut to browse and replay courses.

**Independent Test**: When all published courses in progress state are marked completed, verify the dock displays "All Caught Up! 🌟" with primary button "Browse Course Catalog" that opens `CourseCatalogSheet`.

### Implementation for User Story 3

- [X] T008 [US3] Implement All Caught Up celebration state and catalog shortcut in `src/domains/journey/ui/components/NextJourneyBridgeDock.tsx`

**Checkpoint**: All user stories are now independently functional and complete.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Verification, strict file line limit enforcement, and type safety

- [X] T009 Verify touched files stay strictly under 300 lines limit per repo clean-code rules in `src/domains/journey/`
- [X] T010 [P] Run TypeScript validation via `npx tsc --noEmit` to ensure type safety across journey domain
- [X] T011 Validate manual verification scenarios against `specs/019-next-journey-bridge/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 contract confirmation - BLOCKS all user stories.
- **User Story 1 (Phase 3)**: Depends on Phase 2. Delivers core MVP.
- **User Story 2 (Phase 4)**: Depends on User Story 1 dock component.
- **User Story 3 (Phase 5)**: Depends on User Story 1 dock component.
- **Polish (Phase 6)**: Depends on completion of all desired user stories.

### User Story Dependencies

```
[Phase 1: Setup]
       │
       ▼
[Phase 2: Foundational Selector]
       │
       ▼
[Phase 3: User Story 1 (P1) MVP]
       │
   ┌───┴───┐
   ▼       ▼
[US2 P2] [US3 P3]
   └───┬───┘
       ▼
[Phase 6: Polish & Verification]
```

### Parallel Opportunities

- Within Phase 3 (US1): `NextJourneyBridgeDock.tsx` component structure (T004) can be authored in parallel with `useJourneyMapController.tsx` (T005) hook updates.
- US2 (T007) and US3 (T008) can proceed in parallel once T004 is created.
- In Polish phase: T010 (`tsc --noEmit`) can run in parallel with file line checks (T009).

---

## Implementation Strategy

### MVP First (User Story 1 Only)
1. Complete Phase 1: Setup contract verification.
2. Complete Phase 2: Foundational recommendation selector (`selectNextCourseRecommendation`).
3. Complete Phase 3: User Story 1 (`NextJourneyBridgeDock` + controller + map view mount).
4. **STOP and VALIDATE**: Verify next course recommendation and 1-tap start on completed course.

### Incremental Delivery
1. Add User Story 2 (Browse Catalog link).
2. Add User Story 3 (All Caught Up state).
3. Complete Phase 6 Polish & verification checks.
