# Feature Specification: App Store Rating & Review Booster

**Feature Branch**: `025-rating-review-booster`

**Created**: 2026-10-03

**Status**: Draft

**Input**: User description: "Rating & Review Booster (Solve the 2-Review Chokepoint) / Day-1 activation & review trigger"

## Clarifications

### Session 2026-10-03
- Q: Which user actions on Day 1 should be eligible to trigger the initial rating prompt? → A: Option B (Exercise Flow completions + First Journal Entry saved).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Day-1 First Breakthrough Completion Prompt (Priority: P1)

A first-time user installs Happy in a stressed or curious state. They choose either to complete a guided CBT exercise (such as Thought Reframing or 4-7-8 Breathing) or to log their first journal entry (via speech-to-text voice journaling, typing, or scanning handwritten notebook notes).
- If they complete an exercise, the victory celebration screen appears with confetti and earned XP. Two seconds into the calm celebration, the native 1-tap App Store rating sheet smoothly presents.
- If they save their first journal entry, the save confirmation and emotional offloading toast settles, and two seconds later the native rating sheet presents.
The user taps 5 stars in one touch without leaving the app, providing immediate positive social proof during their emotional relief peak.

**Why this priority**: Solves the primary conversion bottleneck. Over 75% of users in mental health apps churn before Day 3; capturing ratings immediately after their first completed therapeutic breakthrough (exercise or journal) unlocks the initial rating volume required by the App Store algorithm.

**Independent Test**: Can be fully tested on a fresh install by completing one exercise in `ExerciseFlowScreen` or saving one journal entry in `JournalEntryScreen`. Confirms that the victory/save feedback displays, followed 2.0 seconds later by the StoreKit review prompt, without interrupting any input.

**Acceptance Scenarios**:

1. **Given** a user completing their first exercise ever, **When** the celebration modal appears, **Then** the native review prompt presents after exactly 2.0 seconds of celebration time.
2. **Given** a user saving their first journal entry ever (and who has not yet completed an exercise), **When** the save succeeds and the entry screen finishes, **Then** the native review prompt presents after 2.0 seconds.
3. **Given** a user has already triggered a Day-1 review prompt via exercise, **When** they later save their first journal entry, **Then** no review prompt is displayed.
4. **Given** the user is actively typing in a thought step or sliding a mood slider, **When** they interact with the exercise, **Then** no review prompt interrupts their cognitive workflow.

---

### User Story 2 - Habit & Milestone Review Trigger with 90-Day Cooldown (Priority: P2)

An existing or returning user achieves a major milestone—such as reaching a 3-day, 7-day, or 15-day streak, or finishing an entire course unit. If at least 90 days have elapsed since any previous automated review prompt was attempted, the system triggers the native rating sheet at the conclusion of the milestone celebration.

**Why this priority**: Sustains review velocity over the user lifecycle for retained users while respecting Apple's 3-in-365 annual limit and preventing prompt fatigue.

**Independent Test**: Can be tested by simulating milestone achievements (streak 3, 7, 15) and verifying that prompts only fire when the milestone is fresh and the 90-day cooldown check passes.

**Acceptance Scenarios**:

1. **Given** an active user reaching Day 3 streak who was prompted on Day 1 (less than 90 days ago), **When** the streak celebration completes, **Then** the prompt is silently skipped and deferred.
2. **Given** a user reaching Day 15 streak whose last prompt was 95 days ago, **When** the streak celebration completes, **Then** the native review prompt presents after the celebration settles.
3. **Given** a user whose device has already exhausted Apple's 3-in-365 OS quota, **When** the app calls the review API, **Then** the OS silently drops the prompt without errors or interruptions to the user.

---

### User Story 3 - Persistent Voluntary "Rate Happy" in Settings (Priority: P3)

A satisfied user wants to leave a review or update their existing rating at their own convenience. They open Settings, tap a dedicated "Rate Happy on the App Store" option, and are taken directly to the App Store review composer page for Happy.

**Why this priority**: Provides an unrestricted, user-initiated pathway for reviews that never expires and does not count against Apple's automated annual quota.

**Independent Test**: Can be tested by navigating to Settings, tapping "Rate Happy on App Store", and verifying the external deep link opens the App Store review interface for app ID `6755650433`.

**Acceptance Scenarios**:

1. **Given** a user browsing the Settings screen, **When** they tap "Rate Happy on the App Store", **Then** the system opens the App Store product review composer via `https://apps.apple.com/app/id6755650433?action=write-review`.

---

### Edge Cases

- **Offline Execution**: If a user completes an exercise or journal while offline, StoreKit handles connectivity internally. The app's completion flow and XP rewards must proceed normally with zero errors.
- **Silent OS Suppression**: When Apple's 365-day quota is reached or user has disabled in-app ratings in iOS Settings, `StoreReview` silently fails to present. The app must not hang, retry in a loop, or display fallback alerts.
- **Rapid Navigation / Screen Exit**: If a user taps "Continue" or closes the celebration modal before the 2.0-second delay timer fires, the pending prompt timer must cancel cleanly without attempting to display over an unmounted screen.
- **TestFlight Builds**: In TestFlight environments where Apple automatically suppresses native prompts, code execution must complete without unhandled promise rejections.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST trigger an automated in-app rating prompt upon either the user's first completed therapeutic exercise (`first_exercise_completed`) OR first saved journal entry (`first_journal_saved`), whichever occurs first.
- **FR-002**: The rating prompt MUST be delayed by 2.0 seconds after the completion celebration modal enters or after the save toast settles, ensuring celebratory feedback and haptics conclude first.
- **FR-003**: System MUST enforce a minimum cooldown period of 90 days between any automated in-app review requests.
- **FR-004**: System MUST record the completion timestamp and milestone identifier in persistent local storage so a specific milestone never re-triggers repeatedly.
- **FR-005**: System MUST invoke Apple's native StoreKit review interface (`StoreReview.requestReview()`) directly without any intermediary sentiment gating, survey popups, or custom star dialogs.
- **FR-006**: System MUST provide a permanent "Rate Happy on the App Store" action within the Settings screen linking directly to the App Store review composer.
- **FR-007**: Automated rating prompts MUST NEVER interrupt active exercise input, mood selection, or journal text entry.
- **FR-008**: StoreKit OS suppression or unavailability MUST fail silently without crashing, throwing unhandled exceptions, or delaying screen navigation.

### Key Entities

- **ReviewMilestone**: Unique identifier representing an eligible accomplishment (`first_exercise_completed`, `first_journal_saved`, `streak_3`, `streak_7`, `streak_15`, `course_unit_completed`).
- **ReviewHistoryState**: Persisted local records tracking the date/time of the last prompt execution and the set of completed milestones.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of users completing their first exercise or saving their first journal entry receive a timely rating prompt opportunity without UI blocking or navigation delays.
- **SC-002**: Zero automated review prompts fire during active cognitive exercise entry or distress reflection steps.
- **SC-003**: App Store rating count in target regions increases from under 5 ratings ("Not Enough Ratings") to at least 10 ratings within 30 days of release.
- **SC-004**: 100% compliance with Apple App Store Review Guideline 5.6.1 (zero review gating, zero custom star popups, zero incentivization).

## Assumptions

- Users run on supported iOS devices where native StoreKit review overlays are supported.
- The operating system handles all user rating input, star submission, and annual quota enforcement privately.
- Deep linking to the App Store composer using `action=write-review` is supported by iOS.
