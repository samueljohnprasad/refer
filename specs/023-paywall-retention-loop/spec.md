# Feature Specification: 3-Tier Paywall & D1/D7 Retention Loop

**Feature Directory**: `specs/023-paywall-retention-loop`

**Created**: 2026-10-01

**Status**: Draft

**Input**: User description: "3-Tier Paywall Pricing Ladder, RevenueCat integration, Day-1/Day-7 Retention & Streak Saver Push Notifications Loop, and App Store Review Prompts at streak milestones."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 3-Tier Paywall Conversion (Priority: P1)

As a free user attempting to access premium CBT courses, AI insights, or voice reflections, I want to see a clear 3-tier pricing option (Weekly, Monthly, Annual) with distinct value propositions so that I can choose the commitment level that fits my budget while recognizing the Annual plan as the best value.

**Why this priority**: Directly drives revenue conversion and monetizes user engagement with transparent, flexible options ($2.99/wk, $4.99/mo, $29.99/yr).

**Independent Test**: Can be tested independently by navigating to any locked feature or `/paywall` route, verifying the remote RevenueCat template displays Weekly, Monthly, and Annual options with the 81% OFF badge on Annual, and completing a transaction to unlock premium entitlements.

**Acceptance Scenarios**:

1. **Given** a free user taps a locked CBT insight card or navigates to `/paywall`, **When** the paywall screen loads, **Then** the remote 3-tier paywall displays Weekly ($2.99/wk), Monthly ($4.99/mo), and Annual ($29.99/yr) plans with an "81% OFF" badge on Annual.
2. **Given** a user selects any subscription tier and completes a purchase, **When** RevenueCat validates the transaction, **Then** the `hasPro` state becomes true, premium features unlock immediately, and the user is redirected smoothly without losing context.
3. **Given** a user who previously purchased on another device, **When** they tap "Restore Purchases", **Then** RevenueCat validates active entitlements and grants premium access.

---

### User Story 2 - Day-1 & Day-7 Streak Saver Re-engagement (Priority: P2)

As an active user who completed an exercise on Day 0, I want to receive a smart, non-intrusive evening reminder on days when I haven't checked in yet, so that I can maintain my streak and build a daily mental health habit.

**Why this priority**: Protects Day-1 and Day-7 retention, driving active daily sessions (DAU) which directly defends App Store search ranking algorithms.

**Independent Test**: Can be tested by completing an exercise to start a streak, simulating past-6 PM time without logging a new entry, and verifying a local/remote Push Notification ("You're on a 1-day streak...") is scheduled, and auto-cancelled as soon as an exercise is completed.

**Acceptance Scenarios**:

1. **Given** a user has an active streak (>= 1 day) and has NOT completed an exercise by 7:00 PM local time, **When** the streak-saver check runs, **Then** a notification is scheduled reminding the user to check in for 2 minutes to save their streak.
2. **Given** a scheduled streak-saver notification, **When** the user completes a journaling node before 7:00 PM, **Then** the notification is automatically cancelled and rescheduled for the next day.
3. **Given** a user opens the app via a push notification tap, **When** the deep link handles the payload, **Then** the user lands directly on the exercise or journey screen.

---

### User Story 3 - Streak Milestone App Store Review Triggers (Priority: P3)

As a user celebrating a streak milestone (Day 3, Day 7, Day 15), I want to be prompted to rate the app when I feel high satisfaction and accomplishment, so that positive feedback is captured seamlessly without interrupting negative or low-engagement moments.

**Why this priority**: High rating velocity and positive 5-star reviews strongly influence App Store search algorithm rankings and store conversion rate.

**Independent Test**: Can be tested by completing exercises to reach Day 3 or Day 7 contiguous streak, verifying the celebratory modal appears, followed by the native iOS Store Review prompt (`SKStoreReviewController`).

**Acceptance Scenarios**:

1. **Given** a user completes a node that increases their streak count to 3, 7, or 15 days, **When** the streak celebration completes, **Then** the system triggers the native App Store review prompt.
2. **Given** a user who has already been prompted within the Apple-enforced rate limit window, **When** a streak milestone is reached, **Then** the prompt fails gracefully without error or visual glitch.

---

### Edge Cases

- What happens when a user purchases anonymously and later creates an account? The system prompts to claim the anonymous purchase and link `app_user_id` in RevenueCat.
- How does system handle offline purchase attempts? RevenueCat surfaces user-friendly offline errors and allows retry when connectivity returns.
- What happens if the user disables push notifications in OS settings? The app skips push registration gracefully without crashing or repeatedly nagging.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST present a 3-tier subscription paywall containing Weekly ($2.99), Monthly ($4.99), and Annual ($29.99) options mapped to RevenueCat packages (`$rc_weekly`, `$rc_monthly`, `$rc_annual`).
- **FR-002**: System MUST grant immediate premium access (`hasPro = true`) upon successful purchase or entitlement restoration via RevenueCat.
- **FR-003**: System MUST schedule a daily streak-saver push notification at 7:00 PM local time whenever a user has an active streak (>= 1) and has not yet logged activity today.
- **FR-004**: System MUST cancel pending streak-saver notifications immediately upon completion of any journaling or CBT exercise on that day.
- **FR-005**: System MUST trigger the native App Store review dialog at Day 3, Day 7, and Day 15 streak milestones.
- **FR-006**: System MUST route push notification taps to the relevant in-app screen (Journeys, Exercises, or Insights) based on payload category.

### Key Entities

- **UserStreak**: Represents a user's current contiguous streak count, last activity timestamp, and freeze token count.
- **SubscriptionEntitlement**: Represents RevenueCat's active entitlement state (`Premium journals`), granting access to locked CBT features.
- **PushNotificationToken**: Stores user Expo push token, platform, timezone, and notification preferences in Supabase.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 95%+ of paywall impressions correctly display all 3 pricing tiers with localized price formatting from RevenueCat within 1.5 seconds of presentation.
- **SC-002**: Day-1 retention improves by at least 15% following the introduction of evening streak-saver notifications.
- **SC-003**: 80%+ of subscription purchases select the Annual plan when presented with the 3-tier ladder layout.
- **SC-004**: In-App Review prompts generate at least 4.5+ star average rating by triggering strictly at positive streak milestones (Day 3, 7, 15).

## Assumptions

- Users have standard iOS device capabilities supporting local push notifications and Expo Notification services.
- RevenueCat remote paywalls and offerings (`journals_2_99`) remain the single source of truth for in-app product catalog management.
- App Store Connect product IDs (`rc_weekly_2_99`, `journal_monthly`, `rc_yearly_29_99`) are approved and active in Apple's subscription group.
