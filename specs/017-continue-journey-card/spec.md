# Feature Specification: Continue Your Journey Card

**Feature Branch**: `017-continue-journey-card`

**Created**: 2026-09-08

**Status**: Draft

**Input**: User description: "PRD — Continue Your Journey Card: Add a compact Continue Your Journey card to the Home screen, below the existing streak section. The card helps users resume their current learning journey without navigating through the full course map first. Reuses existing course, lesson, progress, and navigation systems."

## Clarifications

### Session 2026-09-08
- Q: Should the entire card container be tappable as a single unified touch target, or should tapping be restricted solely to the action button? → A: Option A - The entire card container is interactive as a single unified touch target with pressed feedback; tapping anywhere on the card surface or the action button triggers the primary action.
- Q: When the user taps "Explore journeys" in State B or "Review your skills" in State C, how should the app navigate to the destination? → A: Option A - Switch to the main Journeys tab, navigating to the Journeys tab so the user sees the full journey map or course selection.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Active Course Next Activity Resume (State A) (Priority: P1)

As a learner with an ongoing journey, I want to see my active course and next activity immediately on the Home screen so that I can resume learning in a single tap without navigating through the full journey map.

**Why this priority**: This delivers the core value of the feature—reducing friction to continue learning, which is the primary behavioral bottleneck identified in the user problem.

**Independent Test**: Can be tested by having an enrolled user with an active course open the Home screen, verify the course name, next activity title, and estimated duration (if available) are visible, and tap "Continue learning" to immediately enter the designated activity.

**Acceptance Scenarios**:

1. **Given** the user is enrolled in an active course with an eligible next activity, **When** they view the Home screen, **Then** they see a card under the streak section showing the course artwork, course title, next activity title, estimated duration (if present), and a single "Continue learning" action.
2. **Given** the user is viewing the active journey card on Home, **When** they tap anywhere on the card surface or the "Continue learning" action, **Then** the card provides pressed feedback and immediately transitions into that activity's learning flow.
3. **Given** the next eligible activity was previously started and left in progress, **When** the user taps "Continue learning", **Then** the activity restores to their exact saved stage rather than restarting from the beginning.
4. **Given** the next activity does not have estimated duration metadata, **When** the card renders, **Then** the duration element is omitted cleanly without awkward spacing, empty placeholders, or layout shift.

---

### User Story 2 - No Active Course Journey Discovery (State B) (Priority: P2)

As a learner who is not currently enrolled in or actively pursuing a course, I want a gentle invitation to explore available journeys so that I know where to start my learning path.

**Why this priority**: Ensures users without an active course are not left with a blank or confusing screen, and establishes a clear path into the curriculum.

**Independent Test**: Can be tested with an unenrolled account; verify the card displays "Find your next step" and "Choose a journey to start learning." with an "Explore journeys" action, and tapping it navigates to the journey catalog.

**Acceptance Scenarios**:

1. **Given** the user has no active course selected or enrolled, **When** they view the Home screen, **Then** the card displays "Find your next step", "Choose a journey to start learning.", and an "Explore journeys" action.
2. **Given** the card is in the no active course state, **When** the user taps anywhere on the card surface or the "Explore journeys" action, **Then** the app navigates to the main Journeys tab, switching the active bottom navigation tab so the user can browse and select available courses.

---

### User Story 3 - Completed Journey Revisit & Skill Review (State C) (Priority: P3)

As a learner who has completed all required activities in my active course, I want to see my accomplishment recognized and have an easy option to revisit my learned skills so that I feel a sense of completion and continuity.

**Why this priority**: Prevents a dead-end state after finishing a course and directs the user toward skill reinforcement or selecting their next journey.

**Independent Test**: Can be tested with an account that has finished all required activities in their course; verify the card displays "Journey complete" and "You can revisit the skills you’ve learned." with a "Review your skills" action, and tapping it navigates to the course review.

**Acceptance Scenarios**:

1. **Given** the active course has no remaining required activities, **When** the user views the Home screen, **Then** the card displays "Journey complete", "You can revisit the skills you’ve learned.", and a "Review your skills" action.
2. **Given** the card is in the completed state, **When** the user taps anywhere on the card surface or the "Review your skills" action, **Then** the app navigates to the main Journeys tab, switching the active bottom navigation tab so the user can review their completed course map and skills.

---

### User Story 4 - Resilient Loading & Graceful Fallback (States D & E) (Priority: P4)

As a learner on a mobile connection, I want the card to load smoothly without jarring layout shifts or false empty states, and if an error occurs, provide a quiet path to open journeys.

**Why this priority**: Guarantees visual stability, prevents flash of incorrect content (e.g., showing "No active course" while data is loading), and ensures accessibility under poor network conditions.

**Independent Test**: Can be tested by simulating slow network requests to verify the skeleton placeholder renders with matching card dimensions, and simulating fetch errors to verify the quiet "Open journeys" fallback.

**Acceptance Scenarios**:

1. **Given** course enrollment or progress data is loading, **When** the Home screen renders, **Then** the card displays a compact skeleton placeholder matching the final card dimensions without flashing the empty or completed states.
2. **Given** course progress data fails to load or is unavailable, **When** the Home screen renders, **Then** the card displays a quiet fallback with an "Open journeys" action allowing navigation to the journeys screen.

---

### User Story 5 - Automatic Progress Sync on Screen Return (Priority: P5)

As a learner returning to the Home screen after completing an activity, I want the card to automatically reflect my updated next step so that I never see stale progress or need to manually pull to refresh.

**Why this priority**: Maintains trust and accurate progression across multi-step learning sessions.

**Independent Test**: Can be tested by launching an activity from the card, completing it, navigating back to Home, and verifying the next activity title has updated automatically without manual refresh.

**Acceptance Scenarios**:

1. **Given** the user navigated to an activity from the Home card, **When** they complete the activity and return to the Home screen, **Then** the card automatically updates to display the next eligible activity or the completed state if it was the final activity.

---

### Edge Cases

- **Partial / In-Progress Activity**: When an activity has been started but not finished, the card continues to present that activity with the "Continue learning" action, resuming the exact stage saved.
- **Missing Duration Metadata**: When an activity lacks duration data, the duration text is omitted without leaving empty gaps or placeholder hyphens.
- **Very Long Titles**: Course and activity titles that exceed one line must wrap gracefully without clipping, breaking layout hierarchy, or overflowing card boundaries, and must provide an accessible full label.
- **Large Accessibility Text (Dynamic Type)**: Card layout expands vertically to accommodate enlarged accessibility typography without overlapping adjacent sections.
- **Switching Active Course**: If the user switches active courses elsewhere in the app (e.g., from the journey catalog), the Home card immediately reflects the newly selected active course upon return.
- **Course Completion Transition**: When the user completes the final activity of the course, returning to Home transitions the card seamlessly from State A to State C without displaying an invalid or missing next node.
- **Offline / Transient Failure**: If progress cannot be verified while offline, the system falls back quietly to State E ("Open journeys") without presenting broken raw error text or stale, inaccurate next activity assumptions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST place the "Continue your journey" section on the Home screen directly beneath the streak widget and above bottom navigation.
- **FR-002**: System MUST render the card in a compact format that remains visually subordinate to the primary reflection card ("Today's reflection") and does not push primary journaling actions below the fold on standard mobile screens.
- **FR-003**: System MUST display section heading "Continue your journey" above the card.
- **FR-004**: System MUST render State A when the user has an active course and an eligible next activity, displaying:
  - Course artwork or vector icon
  - Course title
  - Next activity title
  - Estimated duration (if available)
  - Exactly one primary action: "Continue learning"
- **FR-005**: In State A, tapping the action or the card surface MUST navigate directly to the existing activity player flow for the specified activity.
- **FR-006**: In State A, if the next activity was previously started and incomplete, the system MUST resume the activity at the exact saved stage without restarting progress.
- **FR-007**: System MUST omit duration display when duration metadata is absent, without introducing placeholder text or visual gaps.
- **FR-008**: System MUST render State B when no active course is selected or enrolled, displaying:
  - Heading: "Find your next step"
  - Descriptive copy: "Choose a journey to start learning."
  - Exactly one primary action: "Explore journeys"
- **FR-009**: In State B, tapping "Explore journeys" (or the card surface) MUST navigate to the main Journeys tab, switching the active bottom navigation tab to Journeys where the user can browse and select available courses.
- **FR-010**: System MUST render State C when all required activities in the active course are completed, displaying:
  - Heading: "Journey complete"
  - Descriptive copy: "You can revisit the skills you’ve learned."
  - Exactly one primary action: "Review your skills"
- **FR-011**: In State C, tapping "Review your skills" (or the card surface) MUST navigate to the main Journeys tab, switching the active bottom navigation tab to Journeys where the user can review completed milestones and exercises.
- **FR-012**: System MUST render State D as a compact skeleton or placeholder matching final card dimensions while course or progress data is loading.
- **FR-013**: System MUST NOT render or flash State B ("No active course") while enrollment or course progress queries are in flight.
- **FR-014**: System MUST render State E as a quiet fallback with an "Open journeys" action if course or progress data cannot be resolved or encounters an error, navigating to the main Journeys tab upon tap.
- **FR-015**: System MUST automatically derive and update the card content when the user returns to the Home screen after completing or progressing an activity, without requiring manual refresh.
- **FR-016**: System MUST reuse the existing authoritative course progress rules, respecting locked nodes, prerequisites, and progression ordering (skipping automatic non-lesson milestone nodes such as trophies).
- **FR-017**: The card MUST NOT display XP, gems, streak counts, achievement badges, celebratory confetti, decorative gradients, or mascot illustrations.
- **FR-018**: The entire card container MUST be interactive as a single unified touch target with standard pressed feedback, such that tapping anywhere on the card surface or the primary action triggers navigation to the current state's destination; competing multiple buttons or distinct tap zones within the card are prohibited.
- **FR-019**: All touch targets on the card MUST meet or exceed the 48x48 point accessible size standard.
- **FR-020**: The card MUST support text scaling (Dynamic Type) without clipping, truncation without an accessible label, or horizontal overflow.
- **FR-021**: System MUST record analytics events:
  - `home_journey_card_viewed` with state and course identifier (when available)
  - `home_journey_card_tapped` with action, course identifier, and activity identifier (when available)

### Key Entities

- **Course**: A structured educational or therapeutic sequence. Key attributes include identifier, title, description, artwork/icon reference, and ordered sections/units.
- **Activity (Node)**: An individual interactive learning lesson or exercise within a unit. Key attributes include identifier, title, activity type, estimated duration, sequence order, prerequisites, and completion status.
- **User Course Progress**: Authoritative progression state tracking enrolled courses, active course pointer, and per-activity status (locked, available, in_progress, completed).
- **Journey Card State**: The derived UI presentation state for the Home screen card, comprising one of five mutually exclusive states:
  - `ActiveWithNextActivity` (State A)
  - `NoActiveCourse` (State B)
  - `CourseCompleted` (State C)
  - `Loading` (State D)
  - `ErrorFallback` (State E)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of taps on "Continue learning" in State A launch the exact next eligible activity without intermediate map navigation.
- **SC-002**: Returning to the Home screen after completing a lesson reflects the updated next activity within 500 milliseconds without requiring manual user pull-to-refresh.
- **SC-003**: 0% false flash occurrences of the "No active course" empty state while enrollment or course progress is loading.
- **SC-004**: The Home screen vertical layout preserves Today's Reflection as the dominant hero action, maintaining full visibility above the fold on standard mobile viewport sizes.
- **SC-005**: All interactive elements on the card meet or exceed the 48x48 point minimum accessible tap target size.
- **SC-006**: Users can identify what journey they are on and what activity is next in under 3 seconds of viewing the Home screen.
- **SC-007**: 100% of in-progress activities resumed via the Home card restore to the user's exact previously saved stage.

## Assumptions

- Target users have the application installed and have access to the Home tab and Journeys tab.
- The existing course progress data model and progression selectors serve as the single authoritative source of truth; no secondary progress model or storage is introduced.
- Activity duration metadata is optional; activities without duration metadata will omit the duration display gracefully.
- Navigation routes to the activity player, journey catalog, and journey map already exist and are maintained by the application navigation layer.
- The feature does not create or modify course content, progression rules, reward chest mechanics, or recommendation algorithms.
- The card follows the existing forest/sage/cream calm visual tokens defined in the design system.
