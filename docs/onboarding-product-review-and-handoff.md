# Onboarding Product Review, Competitor Benchmark & 10/10 Handoff Specification

> **Document Version**: 1.0.0  
> **Date**: 2026-10-18  
> **Author**: Product & Design Engineering (BMad John Persona / Senior Mobile Architect)  
> **Target Audience**: Autonomous Dev Agents, Frontend Engineers, Product Designers  
> **Status**: Ready for Implementation  

---

## 1. Executive Summary & Context

Over the 20-day observation window leading up to October 2026, PostHog telemetry across 19 physical devices (excluding all simulator traffic) revealed critical friction points in Happy's first-use journey:
* **100% completion** on early quiz steps (Steps 0–5).
* **42.8% drop-off** on the Soft Paywall because users were trapped with no dismiss button.
* **Apple Reviewer rejection loop** on hold-to-commit pact signing.
* **60% drop-off** on Apple Sign-In due to clipped bottom-sheet detent heights.
* **Mainland China lockout** on Supabase cold-launch timeouts via the Great Firewall.

Meanwhile, an architectural split occurred: BMad Epic 1 created a standalone [StarterPathScreen.tsx](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/StarterPathScreen/StarterPathScreen.tsx) that prioritized instant time-to-value (TTV) but stripped out the **Notification Scheduler** and **Paywall**, threatening long-term retention and revenue.

This document unifies the best of both worlds into a **single, cohesive, 10/10-rated onboarding experience**.

---

## 2. Ground-Level Value Audit: "Are Users Getting Actual Relief?"

### 2.1 The Problem with Legacy Onboarding
Legacy onboarding flows in mental health apps ask 8–10 intake questions, run a fake loading spinner ("Building your custom plan..."), and demand payment. 
* **The Reality**: This delivers *perceived marketing promise*, not *realized psychological value*.
* **User State**: When an anxious user opens Happy, their sympathetic nervous system is elevated. Subjecting them to an intake census causes cognitive fatigue.
* **Value Standard**: If the user's emotional tension does not measurably drop within **90 seconds** of opening the app, they perceive zero ground-level value.

### 2.2 The Problem with Isolated StarterPath
While [StarterPathScreen.tsx](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/StarterPathScreen/StarterPathScreen.tsx) solved TTV, it was delivered as passive text. Reading an essay about *"Anxiety has a job"* is academic homework. Users don't want to read *about* CBT—they want to *experience* cognitive reframing.

---

## 3. Competitor Benchmarking Teardown

| Competitor | Time-to-Value (TTV) | Onboarding Philosophy | Retention Anchor | Monetization Strategy | Happy 10/10 Target |
|---|---|---|---|---|---|
| **Duolingo** | **45 seconds** | Value before sign-up. 3 quick goal taps $\rightarrow$ immediate interactive sentence $\rightarrow$ confetti. | Streak stakes established in lesson 1. | Delayed soft paywall; free tier always usable. | **Adopt**: Fast interactive exercise, tactile depth, delayed auth. |
| **Finch** | **30 seconds** | Immediate emotional attachment. Pet hatches $\rightarrow$ "Take 1 deep breath with bird" $\rightarrow$ instant calm. | Care/survival loop with pet (D30: ~35%). | Delayed soft paywall on Day 2/3. | **Adopt**: Reactive mascot (Happi) breathing and feeling with user. |
| **Headspace** | **60 seconds** | Somatic downregulation. Ambient audio immediately reduces heart rate $\rightarrow$ 60s guided breath. | Daily notification at user's chosen calm hour. | 14-day free trial prompt. | **Adopt**: Immediate ambient calming sound and somatic grounding. |
| **Bloom / CBT Apps** | **3–5 minutes** | Clinical survey $\rightarrow$ hard paywall. High CAC, high churn ($>70\%$). | Weak push notifications. | Hard gate before product access. | **Avoid**: Do NOT copy intake census or unearned paywalls. |

---

## 4. Craft & Polish Audit: The 10/10 Design Standard

To achieve a **10/10 rating** from senior Apple Design Award and Emil Kowalski-tier product designers, Happy must eliminate "clean but flat" UI slop:

### 4.1 Surface Luminance Delta (Visual Elevation)
* **Anti-Pattern**: `#FFFFFF` card sitting on `#FFFFFF` background. The UI has zero depth; cards are invisible until borders render.
* **10/10 Standard**:
  * Canvas Background: Warm Sage `#F8FAF7`.
  * Elevated Card: Crisp White `#FFFFFF`.
  * Physical 3D Depth: Bottom border `#E2E8F0` (3.5px) that physically translates down `4px` when pressed (`active:translate-y-[2px]`).

### 4.2 Typography Hierarchy (Nunito)
* **Header / Primary Prompt**: `Nunito-ExtraBold` (800), tight letter-spacing (`-0.02em`), max 2 lines.
* **Body / Explanations**: `Nunito-Regular` (400), relaxed line height (`1.55`), dark ink `#1E293B`.
* **Micro-Labels & Caps**: `Nunito-SemiBold` (600), uppercase tracking (`+0.06em`), `#64748B`.

### 4.3 Tactile Haptics & Sensory Feedback
* Interactive cards trigger `Haptics.selectionAsync()` on touch-down.
* Milestone completions trigger `Haptics.notificationAsync(Success)` paired with bouncy spring dynamics (`damping: 15, stiffness: 350`).
* **Happi the Panda**: Not a static video container. Happi reacts to user choices (nods on goal selection, celebrates with confetti on reframe completion).

---

## 5. The Unified 5-Step Master Blueprint

The unified flow replaces both legacy onboarding and standalone StarterPath, rendering under [premium-onboarding.tsx](file:///Users/samuelprasad/Desktop/happy/journals/app/tabs/screens/%28onboarding%29/premium-onboarding.tsx):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HAPPY UNIFIED ONBOARDING FLOW                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼───────────────────────────────────┐
  │ STEP 1: The Emotional Hook (30s)                                      │
  │ • Happi the Panda greets: "Hi, I'm Happi. What's weighing on you?"    │
  │ • 3 Tactile Choice Cards:                                             │
  │   [ Anxious Thoughts ]   [ Low Motivation ]   [ Overthinking ]       │
  └───────────────────────────────────┬───────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼───────────────────────────────────┐
  │ STEP 2: The 60-Second Instant Relief (Ground-Level Value)            │
  │ • NOT a textbook article. An interactive Thought Sifter:              │
  │   - "Tap the thought that feels most familiar right now:"             │
  │     ("What if I fail?", "I can't handle this", "I'm falling behind")  │
  │   - Happi breathes with the user: "Let's reframe this together."      │
  │   - 1-tap cognitive reframe: Watch the thought shift into clarity.    │
  │ • Result: Measurable emotional relief in < 90 seconds.                │
  └───────────────────────────────────┬───────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼───────────────────────────────────┐
  │ STEP 3: The Aha! Payoff & Milestone                                   │
  │ • Confetti explosion + Mascot joy.                                    │
  │ • "You just completed your first CBT cognitive reframe!"              │
  │ • Streak ignition: "Day 1 Complete • 15 XP earned."                   │
  └───────────────────────────────────┬───────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼───────────────────────────────────┐
  │ STEP 4: Habit Lock-In (Retention Engine)                              │
  │ • "When should Happi check in with you tomorrow?"                     │
  │ • Quick 1-tap time selector (e.g., 8:00 PM Evening).                  │
  │ • Native iOS Notification Permission trigger.                         │
  └───────────────────────────────────┬───────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼───────────────────────────────────┐
  │ STEP 5: Value-Backed Soft Paywall (Monetization Engine)               │
  │ • "You felt the difference in 60 seconds. Unlock the full 14-day path"│
  │ • RevenueCat V2 7-Day Free Trial Paywall.                             │
  │ • Prominent, clear "✕" (Close) button in top corner.                   │
  │ • Declining trial gracefully continues to Home as a free user.        │
  └───────────────────────────────────┬───────────────────────────────────┘
                                      │
  ┌───────────────────────────────────▼───────────────────────────────────┐
  │ STEP 6: Welcome Home                                                  │
  │ • Direct landing on Home tab with active course state synced.         │
  └───────────────────────────────────────────────────────────────────────┘
```

---

## 6. Technical Implementation Contracts

### 6.1 Route & Entry Point
* **Route**: [app/tabs/screens/(onboarding)/premium-onboarding.tsx](file:///Users/samuelprasad/Desktop/happy/journals/app/tabs/screens/%28onboarding%29/premium-onboarding.tsx)
* **Container**: Must render the unified flow, utilizing [OnboardingScreen.tsx](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/OnboardingScreen.tsx).
* Standalone [StarterPathScreen.tsx](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/StarterPathScreen/StarterPathScreen.tsx) is deprecated and retired.

### 6.2 State & Continuity Contracts
1. **Anonymous Supabase Session**: Established on launch via `ensureAnonymousSession()`. Never force Apple/Google sign-in before Step 6.
2. **Offline Fallback**: If mainland China or network drops occur, catch `AuthRetryableFetchError` and proceed into local guest mode without displaying a blocking error screen.
3. **Course Sync**: Active goal automatically maps to Redux journey slice:
   ```ts
   dispatch(setActiveCourse(resolvedCourseId));
   ```
4. **Notification Permission**: On Step 4, trigger `ensureNotificationPermissions()` and schedule daily reminder via `scheduleDailyReminder()`.
5. **Soft Paywall**: Render `RevenueCatUI.Paywall` inside a flex container with explicit close header:
   ```tsx
   <OnboardingHeader 
     stepName="soft_paywall" 
     onClose={() => {
       updateTrialStarted(false);
       goNext();
     }} 
   />
   ```

### 6.3 Telemetry Event Pipeline (PostHog)
The implementing agent must preserve this event sequence:
1. `onboarding_started`
2. `onboarding_goal_selected` (`{ goal: "anxiety" | "mood" | "stress" }`)
3. `onboarding_reframe_completed` (`{ distortion_type: string, ttv_seconds: number }`)
4. `onboarding_streak_ignited` (`{ day: 1, xp: 15 }`)
5. `onboarding_notification_scheduled` (`{ time: string, granted: boolean }`)
6. `onboarding_paywall_viewed`
7. `onboarding_paywall_dismissed` OR `onboarding_trial_started`
8. `onboarding_completed`

---

## 7. Implementation Checklist for Incoming Agent

- [ ] **Step 1**: Verify [app/tabs/screens/(onboarding)/premium-onboarding.tsx](file:///Users/samuelprasad/Desktop/happy/journals/app/tabs/screens/%28onboarding%29/premium-onboarding.tsx) routes to the unified onboarding component.
- [ ] **Step 2**: Integrate the interactive 60-second Thought Sifter practice step into the onboarding sequence.
- [ ] **Step 3**: Verify `OnboardingHeader` close button functions smoothly on `soft_paywall` and never traps users.
- [ ] **Step 4**: Verify notification permissions schedule a real local notification at user's chosen time.
- [ ] **Step 5**: Ensure all modified component, hook, and helper files remain $\le 300$ lines.
- [ ] **Step 6**: Run `npx oxlint` to confirm 0 errors and 0 warnings.
- [ ] **Step 7**: Run `graphify update .` to sync codebase architecture.
- [ ] **STRICT**: Do NOT execute `git commit` or `git push`. Keep all work in working tree for review.
