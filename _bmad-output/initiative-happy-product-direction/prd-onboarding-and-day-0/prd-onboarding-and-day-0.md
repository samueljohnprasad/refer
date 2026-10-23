---
title: "Product Requirements Document: Onboarding & Day-0 Activation"
status: final
created: "2026-10-20"
updated: "2026-10-20"
initiative: "initiative-happy-product-direction"
target_release: "v1.6.0"
platforms: ["iOS 26+"]
---

# PRD: Onboarding & Day-0 Activation (7-Step Lean Funnel)

## 1. Executive Summary & Problem Statement

### 1.1 Context & Problem
Happy is an Expo Router React Native CBT journaling and mental health microlearning app on iOS. Telemetry analysis of 30-day PostHog event data revealed a critical bottleneck in the top-of-funnel conversion:
- **Baseline Funnel Conversion**: Only **27.3%** of real users who opened the app reached the Home tab.
- **The Friction Multipliers**: The previous 11-screen onboarding flow suffered from cognitive fatigue, premature diagnostic profiling (stress sliders with zero architectural payoff), redundant nested journey maps, duplicated non-interactive celebration ceremonies, and a forced registration sheet (`SignInBottomSheet`) that caused **34%–42% last-mile bounce**.
- **The Monetization Dilemma**: RevenueCat benchmarks show that **82% of all free trial starts** occur on Day 0. Delaying paywall presentation past Day 0 drops trial conversion by **-73%** ($1.25 ARPU $\rightarrow$ $0.33 ARPU). Conversely, hard aggressive paywalls cause immediate uninstalls.

### 1.2 Objective & Solution
Deploy the **7-Step High-Velocity Value Loop**:
1. Streamline the 11-screen flow to **7 essential, high-momentum steps**.
2. Deliver a **30-second cognitive micro-win** (interactive thought-pop) before asking for push permissions or subscription trials.
3. Move Push Notification Priming **before** the paywall using Finch-style parasocial companion framing.
4. Implement the **Blinkist 3-Node Timeline Paywall** with an unmissable 44x44pt `✕` dismiss button that routes directly to Home as an authenticated anonymous guest.
5. Lift onboarding throughput from **27.3% to >55%** (projected 62.0%) while capturing **4.8%–5.5% Day-0 trial starts**.

---

## 2. Target Personas & User Journeys

### 2.1 Personas
* **Maya (28, Product Designer)**:
  * *Context*: 11:15 PM in bed. Doom-scrolling, chest tight, overwhelmed by catastrophic racing thoughts about a morning client review.
  * *Pain Point*: Low cognitive bandwidth; easily alienated by generic forms, homework-like journaling prompts, or aggressive paywalls.
  * *Goal*: Immediate feeling of decompression and mental quiet in under 90 seconds.
* **Leo (34, Software Engineer)**:
  * *Context*: Midday workday burnout, brain fog, feeling stuck in an apathy spiral.
  * *Pain Point*: Skeptical of "fluffy" self-help; wants structured, gamified CBT mechanics without friction.
  * *Goal*: A fast, structured daily pause to disrupt rumination.

### 2.2 Core User Journey (UJ-1: Maya's 90-Second Path to Home)
1. **0:00 - Open**: Maya opens Happy. Sees `WelcomeHeroCanvas` with animated pastel journey path, Happi the Panda waving at the "Today" checkpoint, and headline *"Start your journey within • one thought at a time"*.
2. **0:05 - Intake**: Taps *"Manage anxiety"*. Screen auto-advances in 360ms with zero keyboard entry.
3. **0:07 - Plan Assembly**: 2.4s accelerated labor illusion loader runs (*Analyzing anxiety profile $\rightarrow$ Building calm journey $\rightarrow$ Selecting CBT tools $\rightarrow$ Setting pace*). Transitions cleanly with course anchor header: *"Your 7-Day Anxiety Plan is ready • Lesson 1: Catching the Alarm"*.
4. **0:15 - First Micro-Win**: Maya sees her racing thought: *"I have too much to do today, I'm definitely going to fail."* She selects the distortion chip `[Worst-Case Spiral]`. The screen triggers haptic feedback, pops the thought, reveals the reframed truth (*"I have a lot on my plate, but I can tackle just one small step right now"*), and awards `+10 XP`.
5. **0:45 - Milestone Victory**: Happi celebrates with confetti. The 7-day tracker displays Day 1 streak flame ignited. Maya taps 3D tactile button: *"LOCK IN DAY 1 STREAK"*.
6. **0:55 - Companion Push Primer**: Sees companion banner preview (*"Happi: Ready for a 2-minute thought check?"*). Taps *"Turn on reminders"*.
7. **1:10 - Transparent Paywall**: Sees the 3-node timeline (*Today: Free trial starts $\rightarrow$ Day 5: Push reminder $\rightarrow$ Day 7: Billing begins*). She taps `✕` in top-right corner (*"No thanks, continue free"*).
8. **1:20 - Home Landing**: Maya lands cleanly on `/tabs/home` as an authenticated anonymous guest. Day 1 streak is active. Zero account sign-in block. Total time: 80 seconds.

---

## 3. Functional Requirements (FRs)

### Feature Group 1: Guided Intake & Plan Assembly
* **FR-1**: App SHALL render an animated vector journey canvas (`WelcomeHeroCanvas`) on initial launch, displaying progressive nodes and a primary tactile CTA (`"LET'S BEGIN"`).
* **FR-2**: App SHALL display 5 single-select motivation options (`anxiety`, `mood`, `stress`, `self_understanding`, `sleep`) and auto-advance to Step 3 in 360ms upon selection without secondary confirmation.
* **FR-3**: App SHALL execute an accelerated 2.4s labor illusion loader (`BuildingJourneyStep`) displaying 4 dynamic progress stages (500ms, 600ms, 600ms, 500ms + 200ms completion delay) and trigger haptic success feedback upon completion.

### Feature Group 2: First Cognitive Micro-Win
* **FR-4**: App SHALL display a course anchor header connecting the loader to the exercise (`✦ Lesson 1 · Catching the Alarm (30s)`) and render a simulated automatic thought tailored to the user's selected motivation.
* **FR-5**: App SHALL present 3 cognitive distortion chips (`Worst-case spiral`, `All-or-nothing`, `Predicting failure`). Upon tapping any chip, the app SHALL trigger medium haptic feedback, render the reframed reality card, and award `+10 XP`.

### Feature Group 3: Momentum & Identity
* **FR-6**: App SHALL display a unified milestone celebration combining Happi celebratory mascot animation, a 7-day streak visual with Day 1 ignited, a 5-minute daily commitment pledge, and a 1-tap tactile button (`"LOCK IN DAY 1 STREAK"`).
* **FR-7**: App SHALL enforce Happy's **Unbreakable Streak Rule**: streaks are cumulative counters that increment on completion and NEVER reset to zero upon missed days.

### Feature Group 4: Retention & Commercial Gates
* **FR-8**: App SHALL present a companion-framed push notification primer (`NotificationPermissionStep`) **prior** to any paywall presentation, featuring an iOS notification banner preview (`"Happi: Ready for a 2-minute thought check?"`).
* **FR-9**: App SHALL enforce a strict **72-hour quiet window** before re-prompting push notification permissions if the user selects *"Maybe later"*.
* **FR-10**: App SHALL display a transparent 3-node timeline paywall (`SoftPaywallStep` / `RevenueCatUI.Paywall`) communicating trial start ($0.00), Day 5 reminder notification, and Day 7 annual renewal ($49.99/yr), equipped with an accessible 44x44pt `✕` dismiss button.
* **FR-11**: App SHALL immediately route completing or dismissing users to `/tabs/(tabs)/home` as authenticated anonymous guests via Supabase, with zero blocking registration sheets.

---

## 4. Cross-Cutting Non-Functional Requirements (NFRs)

* **NFR-1 (Performance & Motion)**:
  * Step-to-step transitions SHALL complete in $\le 200$ms.
  * Reanimated animations SHALL execute at 60–120 fps on iOS ProMotion displays with zero dropped frames.
  * Total automated loader duration SHALL NOT exceed 2,400ms.
* **NFR-2 (Accessibility & Human Interface Guidelines)**:
  * All interactive touch targets (option cards, dismiss `✕` buttons, CTAs) SHALL be $\ge 44 \times 44$pt.
  * All mascot states and cards SHALL include accessible VoiceOver labels and accessibility roles.
* **NFR-3 (Data Continuity & Resilience)**:
  * Anonymous Supabase sessions SHALL be initialized on app launch (`useAuth()`), ensuring XP, streak, and preferences persist locally and sync to the cloud.
  * Onboarding completion SHALL atomically update streak (`updateUserStreak()`), award XP (`XPActionType.EXERCISE_COMPLETE`), and mark the user profile completed (`useCompleteOnboarding()`).
* **NFR-4 (Platform Standards)**:
  * Exclusively targets iOS 26+; built with Expo Router, NativeWind/Tailwind, and React Native Reanimated. Zero legacy Android or iOS fallbacks.

---

## 5. Success Metrics & Counter-Metrics

| Metric Category | Metric Name | Baseline | Target Goal | Tracking Method |
|---|---|---|---|---|
| **Primary KPI** | Onboarding Funnel Throughput | 27.3% | **>55.0%** (Projected 62%) | PostHog Funnel: `onboarding_started` $\rightarrow$ `home_mounted` |
| **Monetization** | Day-0 Trial Start Rate | 1.8% | **4.8% – 5.5%** | RevenueCat webhook + PostHog `trial_started` |
| **Retention** | Push Permission Opt-in | ~25.0% | **>68.0%** | PostHog `notification_permission_granted` |
| **Velocity** | Median Time to Value (TTV) | 240s | **$\le$ 90s** | Telemetry timestamp delta (Screen 1 $\rightarrow$ Home) |
| **Counter-Metric** | Day-7 Uninstallation Rate | 28.0% | **$\le$ 18.0%** | App Store Connect Analytics |
| **Counter-Metric** | Trial Refund / Dispute Rate | N/A | **$<$ 2.0%** | RevenueCat / App Store Financial Reports |

---

## 6. Technical Architecture & File Map

* **Step Registry**: [`src/screens/OnboardingScreen/constants.ts`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/constants.ts) (`ONBOARDING_STEPS` pruned to 7 steps).
* **Step Renderer**: [`src/screens/OnboardingScreen/components/OnboardingStepRenderer.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/components/OnboardingStepRenderer.tsx) (Dynamic step rendering & paywall routing).
* **Flow Controller**: [`src/screens/OnboardingScreen/OnboardingScreen.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/OnboardingScreen.tsx) (Atomic persistence on last step completion).
* **Interactive Micro-Step**: [`src/screens/OnboardingScreen/steps/ThoughtCatchMicroStep.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/steps/ThoughtCatchMicroStep.tsx) (30s thought-pop & reframe).
* **Milestone Victory**: [`src/screens/OnboardingScreen/steps/MilestoneCelebrationStep.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/steps/MilestoneCelebrationStep.tsx) (Streak flame & 1-tap pledge).
* **Push Primer**: [`src/screens/OnboardingScreen/steps/NotificationPermissionStep.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/src/screens/OnboardingScreen/steps/NotificationPermissionStep.tsx) (Finch companion preview).
* **Route Entry**: [`app/tabs/screens/(onboarding)/premium-onboarding.tsx`](file:///Users/samuelprasad/Desktop/happy/journals/app/tabs/screens/(onboarding)/premium-onboarding.tsx) (Direct bypass to `/tabs/home`).
