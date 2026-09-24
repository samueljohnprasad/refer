# Feature Specification: Course Onboarding Integration, Enrollment Limits, and In-Progress Unenrollment

**Feature Branch**: `020-course-onboarding-enrollment`

**Created**: 2026-09-24

**Status**: Draft

**Input**: User description: "lets integrate the courses in the onboarding based on this options, we already have the courses, and max there can be only 3 courses in progress, he cannot enroll in new courses if the 3 of the courses in the progress state, lets say user has 2 completed courses, 2 courses in progress, he can enroll in new course, because max in progress courses we are allowing is 3, make this number, configurable, towmmor i might change this to another number. lets a feature un enroll when the course is in progress state only, no unentroll for completed nd not started courses,"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Auto-Enroll from Onboarding Motivation Selection (Priority: P1)

A new user goes through the onboarding flow and reaches the motivation step ("What brings you here, friend?"). They pick one of the five primary options:
- "Manage anxiety" (Quiet the racing thoughts)
- "Lift my mood" (Find lightness in heavy days)
- "Handle stress better" (Build resilience for hard moments)
- "Understand myself" (Patterns, triggers, and growth)
- "Sleep & rest better" (Wind-down rituals that work)

Upon completing onboarding, the system automatically enrolls the user in the matching course (e.g., "Quieting the Storm" for anxiety, "Sleep Reset" for sleep) and sets it as their initial active journey, seamlessly transitioning them onto their personalized journey map.

**Why this priority**: Direct core user activation. Connects the user's stated onboarding desire to immediate therapeutic CBT microlearning without requiring them to browse and self-select from an unfamiliar catalog.

**Independent Test**: Complete onboarding selecting "Sleep & rest better". Verify that user is automatically enrolled in the Sleep course and lands on the Sleep journey map ready to begin Lesson 1.

**Acceptance Scenarios**:

1. **Given** a user completing onboarding, **When** they select "Sleep & rest better" and finish onboarding, **Then** they are automatically enrolled in the "Sleep Reset" course and taken to its journey map.
2. **Given** a user selecting any of the 5 motivation options, **When** onboarding concludes, **Then** the matching course has an active `in_progress` enrollment record for the user.

---

### User Story 2 - Enforcement of Maximum In-Progress Course Limit (Priority: P2)

A learner explores the course catalog to start new courses. The system allows a maximum of 3 concurrent courses in the `in_progress` state. Completed courses do not count toward this limit.
- If a user has 2 completed courses and 2 in-progress courses, they are allowed to enroll in a 3rd course (since 2 in-progress < 3 limit).
- If a user already has 3 courses in progress, the system prevents enrollment in any additional courses and provides clear, supportive feedback informing the user they have reached their active learning limit and can complete or unenroll from an existing course.

**Why this priority**: Prevents cognitive overwhelm, aligns with CBT pacing principles, and keeps learners focused on completing what they start.

**Independent Test**: Create an account with 2 completed courses and 2 in-progress courses; verify enrollment in a new course succeeds. Then attempt to enroll in another course; verify enrollment is blocked with the limit message.

**Acceptance Scenarios**:

1. **Given** a user with 2 completed courses and 2 in-progress courses, **When** they open a not-started course in the catalog, **Then** the "Start journey" action is enabled and enrolling succeeds.
2. **Given** a user with 3 in-progress courses (regardless of completed course count), **When** they view a not-started course in the catalog, **Then** enrollment is blocked, the primary button indicates the active limit, and tapping it displays an explanatory alert.

---

### User Story 3 - Unenroll from an In-Progress Course (Priority: P3)

A user who is currently taking a course realizes it is not the right fit for their present needs or wants to free up an active course slot to start a different course. When viewing that course's overview, they have an option to "Unenroll from course". Upon confirming, the course is unenrolled, returning to the "not started" state and decrementing the active in-progress count.

**Why this priority**: Empowers learners to manage their learning workload and provides a self-service path to free up active slots when the limit is reached.

**Independent Test**: Open an in-progress course, tap "Unenroll", confirm via the prompt, and verify that the course returns to "Start journey" and the in-progress count decrements by 1.

**Acceptance Scenarios**:

1. **Given** an in-progress course, **When** the user views the course overview, **Then** an "Unenroll" option is accessible.
2. **Given** the user selects "Unenroll", **When** they confirm the confirmation dialog, **Then** the enrollment record is removed/reset, and the course displays as "Start journey".
3. **Given** a user at the 3-course limit, **When** they unenroll from 1 course, **Then** they can immediately enroll in another course.

---

### User Story 4 - Restrict Unenrollment on Completed and Not-Started Courses (Priority: P4)

A learner viewing a completed course or a course they haven't started should not see or be able to invoke an unenroll action. Completed courses are permanent personal milestones that celebrate their accomplishment. Not-started courses cannot be unenrolled because no enrollment exists.

**Why this priority**: Protects milestone integrity, avoids confusing UI affordances, and strictly enforces the business rule that only active in-progress courses can be dropped.

**Independent Test**: Navigate to a completed course in the catalog sheet; verify no unenroll button is present. Navigate to a not-started course; verify no unenroll button is present.

**Acceptance Scenarios**:

1. **Given** a completed course, **When** the user views the course overview, **Then** no unenroll button or menu item is rendered.
2. **Given** a course that has not been started, **When** the user views the course overview, **Then** no unenroll action is available.

---

### User Story 5 - Configurable In-Progress Course Limit (Priority: P5)

The application defines the active in-progress course limit in a centralized, configurable location (e.g. constant/settings object). If product requirements change the limit from 3 to 1, 2, or 5 in the future, the threshold can be updated in a single place without modifying component logic or database schemas.

**Why this priority**: Adheres to the Open/Closed Principle and Clean Architecture, preventing hardcoded magic numbers across the frontend and backend.

**Independent Test**: Change the configured limit value in the config module and verify that UI checks and validation rules immediately reflect the updated threshold.

**Acceptance Scenarios**:

1. **Given** the configuration threshold is set to N, **When** checking enrollment eligibility, **Then** the system evaluates `currentInProgressCount < N`.

---

### Edge Cases

- **User reaches limit during onboarding**: If an existing user goes through onboarding again (e.g., resetting preferences) and already has 3 in-progress courses, auto-enrollment gracefully falls back to setting the existing course as active if already enrolled, or notifies the user without crashing the flow.
- **Unenrolling the currently active journey**: If a user unenrolls from the course currently rendered on the primary Journey map screen, the system automatically falls back to another in-progress course or prompts the user to select one from their catalog.
- **Network interruption during unenroll**: If network drops while confirming unenrollment, the action shows a non-punitive retry toast and keeps local state consistent with server reality.
- **Concurrent enrollment attempts**: Double-tapping the "Start journey" button must be debounced/disabled to prevent double mutation requests.
- **Re-enrolling in an unenrolled course**: If a user previously unenrolled from a course and later re-enrolls, they start fresh from Lesson 1.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST map each of the 5 onboarding motivation options (`anxiety`, `mood`, `stress`, `self_understanding`, `sleep`) to its corresponding published course.
- **FR-002**: System MUST automatically enroll newly onboarded users into the course matching their selected motivation upon completing onboarding.
- **FR-003**: System MUST set the newly enrolled onboarding course as the active journey displayed on the Journey map.
- **FR-004**: System MUST enforce a maximum limit of `MAX_IN_PROGRESS_COURSES` (default value: 3) for concurrently active courses per user.
- **FR-005**: System MUST compute enrollment eligibility based solely on courses with `in_progress` status. Completed courses (`status: "completed"`) MUST NOT count against this limit.
- **FR-006**: System MUST block enrollment in a new course when the user's active in-progress course count is greater than or equal to `MAX_IN_PROGRESS_COURSES`.
- **FR-007**: When enrollment is blocked due to the limit, the system MUST display a clear, supportive message explaining that the user has reached their active course limit and can complete or unenroll from an active course.
- **FR-008**: System MUST provide an unenroll action for a course IF AND ONLY IF that course is in the `in_progress` status.
- **FR-009**: System MUST NOT provide or allow an unenroll action for courses that are `completed` or `not_started`.
- **FR-010**: System MUST require user confirmation (via an accessible confirmation dialog) before executing an unenroll action.
- **FR-011**: When unenrollment is confirmed, the system MUST cancel/remove the course's active progress record, decrementing the in-progress count and resetting the course to not-started.
- **FR-012**: If the user unenrolls from the course currently active on the Journey tab, the system MUST smoothly transition the active course selection to another in-progress course or show the course catalog.
- **FR-013**: The maximum in-progress course limit MUST be maintained in a single configurable constant/module.

### Key Entities

- **Course**: A structured multi-section CBT learning program with metadata (ID, title, description, color, publication status).
- **User Course Progress**: The linkage between a user and a course, tracking lifecycle status (`in_progress` or `completed`), timestamps, and node completion history.
- **Onboarding Motivation**: The user's primary stated goal selected during onboarding (`anxiety`, `mood`, `stress`, `self_understanding`, `sleep`), driving initial course matching.
- **Enrollment Policy**: The system rules governing course capacity, including `MAX_IN_PROGRESS_COURSES` and unenrollment permissions.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of learners completing onboarding land on the journey map of the course corresponding to their selected motivation without manual selection.
- **SC-002**: 100% of enrollment attempts exceeding the configured limit (3 in-progress courses) are intercepted and prevented, displaying actionable feedback.
- **SC-003**: Users with completed courses can enroll in new courses up to the limit without completed courses penalizing their capacity.
- **SC-004**: Learners can complete an unenrollment flow in under 3 taps (open course overview → tap unenroll → confirm).
- **SC-005**: 0% accidental unenrollments on completed courses (unenroll action strictly inaccessible).
- **SC-006**: Updating `MAX_IN_PROGRESS_COURSES` configuration requires changing exactly one value in code.

---

## Assumptions

- Unenrolling from a course completely resets the user's progress for that course so they can begin from the start if re-enrolled later.
- The 5 motivation options correspond directly to the core published course offerings (`Quieting the Storm`, `Finding Light Again`, `Steady Under Pressure`, `Coming Home to Yourself`, `Sleep Reset`).
- Completed courses remain permanently marked as completed with achievements and rewards intact.
- The default limit of 3 in-progress courses applies universally to all users until configured otherwise.
