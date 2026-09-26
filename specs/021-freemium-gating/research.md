# Technical Research & Architecture Decisions: Freemium Gating (Model A)

## Decision 1: Unified Freemium Gating Hook (`useFreemiumGate`)

### Decision
Create a lightweight, centralized React hook (`useFreemiumGate`) located at `src/hooks/useFreemiumGate.ts` that acts as the single application-wide authority for entitlement verification, quota checks, and paywall presentation.

### Rationale
- **Single Source of Truth**: Encapsulates `useRevenueCat` entitlement state (`hasPro`, `presentPaywall`) alongside numeric feature quota constants (`FREEMIUM_LIMITS`).
- **DRY & Maintainable**: Eliminates scattered, hard-coded condition checks and magic numbers across different screens and components.
- **Consistent UX**: Centralizes tactile warning haptic triggers (`Haptics.notificationAsync`) and asynchronous paywall invocation in a single `requirePro(feature, currentCount)` method.

### Alternatives Considered
- **Inline RevenueCat checks in every screen/component**: Rejected. Leads to duplicate quota definitions, divergent paywall triggers, and fragile refactoring.
- **Redux slice for subscription entitlements**: Rejected. Redundant state caching on top of RevenueCat's native SDK cache and React Context. Violates Ponytail simplicity.

---

## Decision 2: Model A (Duolingo / Headspace Progressive Unit Gating)

### Decision
Grant free users 100% unrestricted access to Unit 1 across all courses and learning paths. Restrict Unit 2 and all subsequent units behind the Pro subscription with locked node rendering and "PRO" unit divider badging.

### Rationale
- **Proof of Efficacy**: Completing a full unit (multiple lessons, quizzes, and checkpoints) delivers genuine cognitive-behavioral value, creating deep emotional investment before asking for payment.
- **Habit Foundation**: Allows users to establish a daily check-in habit without cognitive barrier.
- **Proven Industry Precedent**: Mirrors Duolingo's open beginner content and Headspace's Basics pack, maximizing day-1 to day-14 retention.

### Alternatives Considered
- **Strict 7-day trial before full lockout**: Rejected. High drop-off rate for users with fluctuating schedules; high churn before habit forms.
- **Virtual currency / heart system for locks**: Rejected. Punishing mistakes or charging tokens creates unnecessary anxiety, directly contradicting the therapeutic ethos of Happy.

---

## Decision 3: Exercise Catalog Badging & Press Interception

### Decision
Expose the complete exercise catalog to all users. Mark specialized and somatic exercises with a gold "PRO" badge chip. When a non-subscriber taps a Pro exercise, bypass the circular reveal navigation transition and invoke `requirePro('exercise')` directly from the catalog.

### Rationale
- **Perceived Product Depth**: Displaying the full breadth of exercises showcases the app's advanced clinical clinical utility.
- **Frictionless Upsell**: Non-subscribers receive immediate, contextual feedback right from the catalog rather than enduring jarring transition animations only to hit an unexpected roadblock.
- **Clean Component Interface**: Adding an optional `disabled` flag to `CircularRevealWrapper` allows cards to handle their own gating logic cleanly without invasive architectural rewrites.

### Alternatives Considered
- **Hiding Pro exercises entirely from free users**: Rejected. Makes the app appear sparse and under-featured, depressing upgrade motivation.
- **Navigating into the exercise screen before presenting the paywall**: Rejected. Causes jarring visual flicker, loads unnecessary exercise assets, and requires complex route cleanup on dismiss.

---

## Decision 4: Quota Interception at the Creation / Save Seam

### Decision
Enforce numeric limits (up to 3 active habits, up to 5 active coping cards, up to 3 voice journals/week) at the point of action initiation or final saving:
- Habits: Intercept "+ Add Habit" press in `HabitsSection.tsx`.
- Coping Cards: Intercept `saveCard` in `useCopingCards.ts`.
- Voice Journal: Intercept recorder launch in `useDiscoveryScreenViewModel.ts` and guard `voice-recorder.tsx`.

### Rationale
- **Data Safety**: If a user hits a capacity limit (e.g. 5 coping cards), their current exercise insights and progress are preserved; dismissing the paywall does not destroy their session.
- **Archiving Relief Valve**: Users can archive older cards or habits to stay within free capacity without forcing permanent data deletion.
- **Universal Guard**: Gating `saveCard` inside `useCopingCards.ts` automatically protects all 7 summary screens across the entire codebase without writing separate checks for each exercise type.

### Alternatives Considered
- **Disabling the entire Coping Cards or Habits tab when at capacity**: Rejected. Punishes users by taking away access to their existing saved insights and habits.
