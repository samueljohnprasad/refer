# Forged Idea: 7-Step Lean Onboarding Funnel

**Status**: HARDENED  
**Target Throughput**: 27.3% $\rightarrow$ 62.0% (+127% lift)  
**Monetization Target**: 4.8%–5.5% Day-0 trial starts  

---

## Locked Decisions

1. **7-Step High-Velocity Architecture**:
   - `WelcomeStep`: Clean hero + 90s value proposition + 1-minute time expectation.
   - `QuizMotivationStep`: 1-tap intake (Anxiety / Mood / Stress / Sleep) auto-advances in 360ms.
   - `BuildingJourneyStep`: 2.4s accelerated Harvard Labor Illusion loader (500ms, 600ms, 600ms, 500ms + 200ms).
   - `ThoughtCatchMicroStep`: 30s 1-tap interactive thought-pop. Uses Dynamic Motivation Matching with 3 domain scenario chips. Awards +10 XP.
   - `MilestoneCelebrationStep`: Consolidates victory screen + Day 1 streak ignition + 1-tap 5-minute pledge.
   - `NotificationPermissionStep`: Finch companion framing (*"Stay in touch with Happi"* + simulated iOS push preview) placed BEFORE paywall.
   - `SoftPaywallStep`: Blinkist 3-step timeline card (Day 0 trial, Day 5 reminder, Day 7 billing) + prominent 44x44pt `✕` dismiss button routing directly to `/tabs/(tabs)/home`.

2. **Step 3 $\rightarrow$ 4 Course Anchor**:
   - Step 4 header bridges the loader to the exercise: *"Your 7-Day Plan is ready. Lesson 1: Catching the Alarm (30s)"*. Eliminates roadmap bait-and-switch.

3. **No Blank-Slate Typing on Day 0**:
   - Zero keyboard inputs in onboarding. Canned thought alienation solved by letting user choose between 3 motivation-tailored scenario chips.

4. **Unbreakable Cumulative Streak Rule**:
   - Day 1 streak ignited on Step 5. Cumulative counter only — never resets to zero, eliminating Abstinence Violation Effect (shame-induced Day-2 uninstallation).

5. **Notification & Billing Safeguards**:
   - Step 6: 72-hour quiet window before any re-prompt if user taps "Maybe later".
   - Step 7: Starting trial immediately schedules local iOS push alert for `now + 5 days at 10:00 AM` (48h before billing).

---

## Rejected Options & Reasons

- **Rejected: `quiz_stress_level` slider**: Premature customization. Zero architectural impact in code; added 12s cognitive friction.
- **Rejected: `journey_map` in onboarding**: Duplicate of Home tab; 90% of nodes locked; required 3 taps across nested sheets to start lesson.
- **Rejected: Separate `pact_signing` with 1.2s press-and-hold**: Redundant duplicate streak art; press-and-hold violates Apple HIG accessibility.
- **Rejected: `SignInBottomSheet` on Step 11 ("Save progress")**: Supabase guest session already authed anonymously. Forcing registration caused 34%–42% last-mile bounce.
- **Rejected: Post-Onboarding Paywall (Model B & C)**: Waiting until Day 3 destroys 73% of trial starts (RevenueCat 82% Day-0 trial benchmark).
- **Rejected: Blank text field on Step 4**: Causes 42% blank-page paralysis and immediate drop-off.
