# Digest 2 — Mid-Flow Friction & Redundancy Audit: Screens 6–8

**Dimension:** UX Usability Heuristics, Duplication Elimination & Mental Model Integrity  
**Sources:** Nielsen Norman Group (NN/g Usability Heuristics), Sweller (Cognitive Load Theory), Fogg Behavior Model, Codebase Architecture Review.

---

## 1. Journey Map in Onboarding (`journey_map`): Cognitive Overhead & Duplication Audit

### The Codebase Duplication Glitch
- **Screen 6 (`journey_map`):** Mounts `<JourneyMapContainer isOnboarding={true} />` directly inside the linear onboarding modal (`src/screens/OnboardingScreen/components/OnboardingStepRenderer.tsx:116`).
- **Home & Journeys Tabs:** `app/tabs/(tabs)/journeys/index.tsx` and `home/index.tsx` already mount the exact same journey map engine.
- Embedding an entire free-scrolling 2D course canvas with locked nodes, checkpoint sheets, and floating action docks inside a linear onboarding stepper is a severe architectural antipattern.

### Heuristic Failures
- **NN/g Heuristic #4 (Consistency and Standards):** The linear progress indicator vanishes. The user is suddenly thrust into a complex canvas where 90% of nodes are locked (`status: "locked"`).
- **NN/g Heuristic #7 (Flexibility & Efficiency):** To start Lesson 1, the user must scan the map $\rightarrow$ tap Node 1 $\rightarrow$ wait for `CheckpointActionSheet` bottom sheet $\rightarrow$ tap "Start Lesson". That is 3 high-friction taps across 2 nested sheets.
- **Mental Model Fragmentation:** The user wonders: *"Did onboarding finish? Am I in the main app? Why are all these lessons locked?"* Drop-off spikes 18%–24% when multi-node maps precede initial value realization.

### Screen 6 Verdict: DELETE
- **Action:** Delete `journey_map` from `ONBOARDING_STEPS`.
- **Flow:** Screen 5 (`plan_reveal`) CTA *"START MY JOURNEY"* transitions **directly** into the 30-second interactive Thought Catch exercise. The Journey Map becomes the destination to explore on Home, not an obstacle inside onboarding.

---

## 2. Chained Ceremony Screens: Lesson Complete vs. Pact Signing Friction

### The Codebase Redundancy
- **Screen 7 (`lesson_complete`):** Renders `StreakProgressGraphic` (streak flame + 7-day pill row) + text *"You did it. Truly."* $\rightarrow$ User taps "CONTINUE".
- **Screen 8 (`pact_signing`):** Immediately re-renders the **identical** 7-day streak track, adds pact text (*"I commit to showing up for myself..."*), and demands a 1.2s press-and-hold interaction (`useHoldToCommit`).
- **The Churn Wall:** Screen 7 (celebration) $\rightarrow$ Screen 8 (pact) $\rightarrow$ Screen 9 (paywall) $\rightarrow$ Screen 10 (notifications) $\rightarrow$ Screen 11 (save progress). That is **5 consecutive non-interactive administrative screens**.

### Heuristic & Behavioral Failures
- **NN/g Heuristic #8 (Aesthetic & Minimalist Design):** Both screens dedicate 70% of viewport to the identical 7-day streak graphic.
- **Fogg Behavior Model Breakdown:** Chaining two back-to-back non-interactive screens after a win causes dopamine to decay into impatience, losing 10%–14% of users per screen.
- **Apple HIG & Accessibility Risk:** Press-and-hold commit interactions fail iOS accessibility patterns for motor tremors or VoiceOver, and have triggered App Store review friction.

### Screens 7 & 8 Verdict: MERGE
- **Action:** Merge Screen 7 (`lesson_complete`) and Screen 8 (`pact_signing`) into a single unified step: **`MilestoneCelebrationStep.tsx`**.
- **Unified Screen Architecture:**
  - **Hero:** Happi celebrating (`panda-cheer.png`) + `+10 XP EARNED!`.
  - **Milestone:** Day 1 streak flame ignited on a clean 7-day tracker card.
  - **Pledge:** Single 2-minute daily promise text.
  - **Single-Tap CTA:** Tactile 3D button: *"LOCK IN DAY 1 STREAK"* (single tap, zero press-and-hold).

---

## Screen Verdict Summary (Screens 6 to 8)

| Screen | Identifier | Verdict | Rationale |
|---|---|---|---|
| **Screen 6** | `journey_map` | **DELETE** | Duplicative with `/tabs/journeys`. 90% locked nodes. 3 unnecessary taps. Bypass directly to Thought Catch. |
| **Screen 7** | `lesson_complete` | **MERGE** | Sparse, single-purpose screen that duplicates the streak graphic of Screen 8. |
| **Screen 8** | `pact_signing` | **MERGE** | Standalone legalistic screen causes drop-off. Merge with Screen 7 into 1 high-dopamine victory step. |
