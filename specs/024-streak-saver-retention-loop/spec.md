# Feature Specification: Day-1/Day-7 Streak Saver Push Notification Re-engagement Loop

**Feature Directory**: `specs/024-streak-saver-retention-loop`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "Day-1/Day-7 Streak Saver Push Notification re-engagement loop to defend App Store search rank and boost retention."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dynamic Evening Streak Saver Notification (Priority: P1)

As an active user who logged an exercise yesterday, I want to receive a timely, personalized evening reminder (7:00 PM) on days when I haven't checked in yet, so that I can maintain my momentum and protect my streak before midnight.

**Why this priority**: Directly drives Day-1 and Day-7 retention, generating active daily sessions (DAU) that influence App Store search algorithm rankings.

**Independent Test**: Can be tested independently by logging an exercise on Day 0, advancing local device time past 6:00 PM on Day 1 without logging an activity, and verifying that a localized notification ("You're on a 1-day streak. A short exercise today keeps momentum going 🌿") is delivered.

**Acceptance Scenarios**:

1. **Given** a user has a contiguous streak (>= 1 day) and no exercise completed today, **When** the local time reaches 7:00 PM, **Then** the app schedules and delivers a local push notification displaying their exact current streak count.
2. **Given** a scheduled streak-saver notification, **When** the user completes any CBT journaling exercise or microlearning node prior to 7:00 PM, **Then** the pending notification for today is immediately cancelled.
3. **Given** a user who has no active streak (streak = 0), **When** 7:00 PM arrives, **Then** the notification displays an encouraging prompt to start a new streak ("A quick check-in today would start your streak 🌿").

---

### User Story 2 - Deep Link Direct Action Handling (Priority: P2)

As a user tapping a streak-saver notification, I want to land directly on a quick 2-minute exercise screen so that I can complete my check-in immediately without navigating through multiple menus.

**Why this priority**: Reduces friction between notification tap and task completion, maximizing conversion from notification open to streak save.

**Independent Test**: Can be tested by tapping the push notification payload, verifying the app opens directly to the recommended exercise or journey node, and confirming completion immediately updates the streak state.

**Acceptance Scenarios**:

1. **Given** a user receives a push notification, **When** they tap the notification banner, **Then** the app opens and deep links directly to the active exercise or journey route.
2. **Given** a user completes the exercise accessed via deep link, **When** the completion event fires, **Then** the streak count increments, the completion celebration triggers, and today's notification is marked resolved.

---

### User Story 3 - Adaptive AI Bandit Dispatching & Timezone Sync (Priority: P3)

As a global app user across different timezones, I want notifications delivered in my local timezone with high-converting message templates optimized for my usage patterns.

**Why this priority**: Prevents notifications from arriving at inappropriate hours (e.g. middle of the night) and optimizes conversion through automated template testing.

**Independent Test**: Can be tested by registering push tokens with varying timezone offsets in Supabase, running the notification dispatcher edge function, and verifying notifications schedule in local user time.

**Acceptance Scenarios**:

1. **Given** a user opens the app in any timezone, **When** push permissions are granted, **Then** the app updates the user's push token, platform, and local timezone in the database.
2. **Given** the remote notification dispatcher runs, **When** selecting messages for a segment, **Then** it uses Thompson Sampling to select the highest-converting title and body templates.

---

### Edge Cases

- What happens if the user turns off notification permissions in OS settings? The system catches permission denied passively without throwing errors or interrupting core journaling functionality.
- How does the system handle streak freezes? If a user missed a day but has an active streak freeze, the notification acknowledges the freeze status ("Streak freeze activated! Keep momentum going tomorrow").
- What happens during timezone changes or traveling? The app updates the local timezone payload on the next app open and adjusts notification triggers accordingly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST calculate daily streak status using atomic server time and local activity dates.
- **FR-002**: System MUST schedule a local push notification at 7:00 PM local time daily when an active user has not yet completed an exercise.
- **FR-003**: System MUST dynamically populate notification copy with the user's current streak number (`{N}-day streak`).
- **FR-004**: System MUST cancel pending notifications immediately when an exercise completion event is recorded for the current calendar date.
- **FR-005**: System MUST register push tokens, device platform, and user timezone in Supabase upon explicit user permission grant.
- **FR-006**: System MUST attach deep-link category payloads (`streak_saver`, `mood_check_in`, `weekly_insight`) to push notifications and navigate users directly upon tap.

### Key Entities

- **UserStreak**: Tracks `current_streak`, `longest_streak`, `last_activity_date`, and `streak_freeze_count`.
- **NotificationPreference**: Stores user opt-in preferences for streak reminders, weekly summaries, and quiet hours.
- **PushLog**: Records notification dispatch events, open rates, and conversion completion timestamps for analytics.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90%+ of scheduled streak-saver notifications are delivered within 5 minutes of 7:00 PM local user time.
- **SC-002**: Day-1 retention increases by at least 15% and Day-7 retention increases by at least 10% after enabling streak-saver notifications.
- **SC-003**: Push notification open-to-completion conversion rate exceeds 35% for streak-saver notifications.
- **SC-004**: Notification cancellation succeeds 100% of the time when a user completes an exercise before the 7:00 PM trigger time.

## Assumptions

- Users have enabled local OS push notification permissions for the app.
- Device clock settings accurately reflect the user's local timezone.
- Supabase edge functions (`notification-dispatcher`, `send-push-notification`, `check-push-receipts`) have valid Expo push credentials configured.
