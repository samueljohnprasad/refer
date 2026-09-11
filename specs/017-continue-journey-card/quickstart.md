# Quickstart & Verification Guide: Continue Your Journey Card

**Feature**: `017-continue-journey-card`
**Date**: 2026-09-08

This guide defines the end-to-end verification procedures for the Continue Your Journey Card across all 5 states, accessibility, and navigation.

## Prerequisites

- Node.js & npm/yarn/bun installed
- TypeScript compiler (`npx tsc --noEmit`)
- iOS Simulator or physical iOS device (`npm run ios`)

---

## Scenario 1: State A — Active Journey with Next Activity

### Objective
Verify that an enrolled user with an active course sees their course artwork, title, next activity title, duration, and can resume learning in one tap.

### Steps
1. Ensure the user profile has an active enrolled course with at least one non-completed lesson (e.g., Sleep Reset).
2. Open the app on the Home screen (`JournalCalendarScreen`).
3. Scroll beneath the streak widget.

### Expected Outcome
- Card renders below streak widget with section header "CONTINUE YOUR JOURNEY".
- Displays course thumbnail, course title, and next activity title (e.g., "The 90-Minute Switch").
- Displays estimated duration (e.g., "3 min") if duration metadata exists.
- Tapping anywhere on the card gives pressed feedback and opens `/tabs/screens/journey-flow` with matching `courseId` and `nodeId`.
- Primary journaling card ("Today's reflection") remains fully visible above the fold.

---

## Scenario 2: State B — No Active Course

### Objective
Verify that a user with no active course sees the friendly invitation to explore journeys.

### Steps
1. Set active course state to `null` and no enrollments.
2. Open the Home screen.

### Expected Outcome
- Card displays heading "Find your next step" and copy "Choose a journey to start learning."
- Displays button "Explore journeys".
- Tapping the card switches the active bottom tab to the Journeys tab (`/tabs/(tabs)/journeys`).
- No flash of State B occurs during initial loading.

---

## Scenario 3: State C — Course Completed

### Objective
Verify that a user who has completed all required activities sees completion-aware content.

### Steps
1. Use an account that has finished all progression nodes in their active course.
2. Open the Home screen.

### Expected Outcome
- Card displays "Journey complete" and "You can revisit the skills you’ve learned."
- Action button displays "Review your skills".
- Tapping the card navigates to the Journeys tab (`/tabs/(tabs)/journeys`) to view the completed journey map.

---

## Scenario 4: State D & E — Loading Skeleton & Error Fallback

### Objective
Verify visual stability during loading and quiet fallback upon error.

### Steps
1. Simulate network throttling or delayed query response.
2. Verify skeleton placeholder renders with matching height and border radius (~140px).
3. Simulate network failure.
4. Verify card quietly falls back to "Open journeys" without crashing or exposing raw error traces.

---

## Scenario 5: Progression Sync on Screen Return

### Objective
Verify automatic UI update after lesson completion without manual pull-to-refresh (SC-002).

### Steps
1. On Home, tap "Continue learning" to launch an activity in `/tabs/screens/journey-flow`.
2. Complete the activity.
3. Return to the Home screen.

### Expected Outcome
- The Continue Your Journey card automatically updates within 500ms to show the next lesson or the "Journey complete" state if it was the final lesson.

---

## Automated Type & Lint Verification

```bash
# Verify TypeScript strict type conformance
npx tsc --noEmit
```
