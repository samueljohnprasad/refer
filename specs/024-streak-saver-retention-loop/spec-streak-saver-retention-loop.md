# BMad Spec: Streak Saver Retention Loop

**Slug**: `streak-saver-retention-loop`
**Feature Directory**: `specs/024-streak-saver-retention-loop`
**Companions**: [`spec.md`](spec.md), [`checklists/requirements.md`](checklists/requirements.md)

---

## 1. Why

Maximize Day-1 and Day-7 user retention and increase Daily Active Users (DAU) through intelligent, timezone-aware evening notifications and milestone App Store review prompts. High retention and positive rating velocity defend App Store search rankings and boost organic acquisition.

---

## 2. Capabilities

### CAP-1: Dynamic Evening Streak Saver Notification
- **Intent**: Schedule a local push notification at 7:00 PM local user time whenever a user has an active streak (>= 1 day) and has not completed an exercise today.
- **Success Signal**: 90%+ of eligible users receive a notification at 7:00 PM local time displaying their active `{N}-day streak` count.

### CAP-2: Automatic Notification Cancellation
- **Intent**: Immediately cancel today's scheduled streak-saver notification as soon as any journaling or CBT exercise node is completed.
- **Success Signal**: 100% of pending notifications for the current calendar date are cancelled upon exercise completion event.

### CAP-3: Direct Deep-Link Re-engagement
- **Intent**: Route notification taps directly to the exercise or journey screen so users can complete a 2-minute check-in immediately.
- **Success Signal**: Notification tap opens the app and navigates directly to the target exercise in under 1 second.

### CAP-4: Streak Milestone App Store Review Prompt
- **Intent**: Trigger native iOS `SKStoreReviewController` dialog when users achieve Day 3, Day 7, and Day 15 streak milestones.
- **Success Signal**: Rating dialog surfaces cleanly after streak celebration modal without interrupting user flow or violating Apple rate limits.

### CAP-5: Multi-Armed Bandit Copy Optimization
- **Intent**: Optimize notification copy templates per user segment using Thompson Sampling via Supabase edge functions.
- **Success Signal**: Push notification open-to-completion conversion rate exceeds 35%.

---

## 3. Constraints

- **Platform**: iOS 26+ only via Expo Notifications and Supabase Edge Functions.
- **Permission Governance**: Passive token sync by default; explicit OS permission prompt shown only on deliberate user CTA (e.g. Onboarding Continue).
- **Timezone Integrity**: Notifications must always trigger in the user's local timezone (never UTC or server time).
- **UI & Styling**: Strict adherence to Tailwind CSS utility classes and `lib/tokens.ts` design system tokens.

---

## 4. Non-Goals

- Android push notification support or fallbacks for legacy iOS versions below 26.
- Sending push notifications to users who explicitly opt out of streak reminders in notification settings.
- Marketing or promotional broadcast pushes outside of habit/streak re-engagement.

---

## 5. Success Signal

- **Day-1 Retention**: Increases by >= 15%.
- **Day-7 Retention**: Increases by >= 10%.
- **Push Conversion Rate**: >= 35% notification open-to-completion rate.
- **Rating Score**: Maintains 4.5+ star average in App Store from targeted milestone prompts.
