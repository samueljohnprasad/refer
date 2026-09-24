# Quickstart & Verification Guide: Course Onboarding Integration, Enrollment Limits, and In-Progress Unenrollment

## Prerequisites
- Clean repository state on branch `020-course-onboarding-enrollment`
- Supabase local instance or development environment with seeded courses
- Node v22+

---

## Validation Scenario 1: Onboarding Motivation Selection Auto-Enrolls

**Goal**: Verify that picking a motivation option during onboarding immediately creates an active enrollment in the matching course and sets it as the active journey.

1. Launch onboarding flow at `/tabs/screens/(onboarding)/premium-onboarding`.
2. On step "What brings you here, friend?", select **"Sleep & rest better"** (`sleep`).
3. Complete the remaining steps through "Save my progress".
4. **Verification**:
   - Check database or network: `user_course_progress` has a row with `course_id = <sleep-reset-id>` and `status = 'in_progress'`.
   - App transitions to `/tabs/(tabs)/home`. The active journey header and nodes display "Sleep Reset".

---

## Validation Scenario 2: Capacity Limit Enforcement (3 In-Progress Max)

**Goal**: Verify that learners can have at most 3 courses in progress, and that completed courses do not count toward this limit.

1. Ensure the user has **2 completed courses** and **2 in-progress courses**:
   - Total active in-progress = 2.
2. Open the Course Catalog Sheet via the journey header.
3. Select an unenrolled course (Course 5) and view Course Overview:
   - Primary button displays "Start journey" and is **enabled**.
4. Tap "Start journey".
   - Enrollment succeeds. In-progress count is now 3.
5. In the catalog, select another unenrolled course (Course 6):
   - Primary button is **disabled** with label "Limit Reached (3/3)" or tapping it alerts: "You have reached your limit of 3 active courses. Complete or unenroll from an active course to start a new one."
   - Edge function `start-course` rejects direct invocation with `400 Bad Request`.

---

## Validation Scenario 3: Unenrolling from an In-Progress Course

**Goal**: Verify that learners can drop an in-progress course with confirmation, decrementing their active count and resetting progress.

1. Open Course Catalog and select an in-progress course.
2. Verify the screen displays:
   - Primary button: "Continue journey"
   - Secondary quiet action: "Unenroll from journey"
3. Tap "Unenroll from journey".
   - Native confirmation prompt appears: *"Unenroll from [Course Title]? Your progress in this course will be reset."*
4. Tap "Unenroll" to confirm.
5. **Verification**:
   - Course overview updates immediately to display "Start journey".
   - `user_course_progress` row is removed.
   - Active in-progress count drops from 3 to 2.
   - New course enrollment is immediately unlocked.

---

## Validation Scenario 4: Unenroll Forbidden on Completed & Not-Started Courses

**Goal**: Verify that unenrollment is strictly restricted to in-progress courses.

1. In Course Catalog, open a **completed** course (`status = 'completed'`):
   - Verify primary button is "Open Journey".
   - Verify "Unenroll" option is **absent** from the UI.
2. Open a **not-started** course:
   - Verify primary button is "Start journey".
   - Verify "Unenroll" option is **absent** from the UI.

---

## Validation Scenario 5: Configurable Threshold Test

**Goal**: Verify that changing the configuration threshold updates the policy application-wide.

1. In `src/domains/journey/config/enrollmentConfig.ts`, temporarily change `MAX_IN_PROGRESS_COURSES` from `3` to `2`.
2. Open Course Catalog when 2 courses are in progress.
3. Verify that the UI immediately marks capacity reached (2/2) without code changes across screens or DB migrations.
