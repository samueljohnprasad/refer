---
tracker_id: ""
key: ""
type: epic
status: in-progress
title: "7-Step Day-0 Onboarding & First 60s Home Landing"
parent: initiative-happy-product-direction
covers: ["CAP-1", "CAP-5", "CAP-6"]
after: []
assignee: ""
risk: medium
estimate: "8"
estimate_basis: "6 implementation stories across UI, state machine, local-first mutations, and verification"
---

# 7-Step Day-0 Onboarding & First 60s Home Landing

## Description

Refactor Happy's Day-0 funnel from the legacy 11-screen bloat into a lean, high-velocity 7-step sequence (Welcome Path Canvas $\rightarrow$ 1-tap Motivation $\rightarrow$ 2.4s Harvard Labor Loader $\rightarrow$ 30s Thought Catch Micro-Win $\rightarrow$ Milestone Celebration with Day 1 Streak Flame $\rightarrow$ Finch Push Primer $\rightarrow$ Blinkist 3-Node Timeline Paywall $\rightarrow$ Direct Anonymous Landing on Home). Preserve the existing production Home screen (`JournalCalendarScreen.tsx`) intact with zero visual surprises.

## Outcome

Lift onboarding conversion from baseline 27.3% to $>55\%$, cut time-to-first-value under 90s, achieve $>65\%$ push notification opt-in via companion framing, deliver trial transparency without accidental-charge churn, and land the user as an anonymous Supabase guest with an unbreakable Day 1 streak.

## Requirements

- CAP-1: Users choose a plain-language motivation, complete a matching 30s Thought Catch micro-win with Reframed Reality, and earn +10 XP.
- CAP-5: Users ignite an unbreakable Day 1 streak in onboarding and land on Home with cached streak and next action spotlighted.
- CAP-6: Transparent 3-node timeline paywall with prominent 44x44pt dismiss button routing to Home free; trial start schedules a 48h reminder alert.

## Done when

1. Onboarding sequence strictly contains 7 steps, completely removing redundant screens (`plan_reveal`, `journey_map`, and `welcome_to_happy` registration wall).
2. Step 4 (`thought_catch_micro`) delivers dynamic motivation-matched thoughts, 3 distortion chips, reframed reality card, and +10 XP award.
3. Step 5 (`milestone_celebration`) reuses the existing, production-proven `StreakProgressGraphic` (Streak flame + 7-day row) with zero diagonal or custom reinvention.
4. Step 6 (`notification_permission`) displays Finch companion preview banner and handles 72-hour quiet period on decline.
5. Step 7 (`soft_paywall`) presents Blinkist 3-node timeline ($0 today $\rightarrow$ Day 5 reminder $\rightarrow$ Day 7 renewal) with 44x44pt `✕` dismiss button routing directly to Home.
6. Home screen (`JournalCalendarScreen.tsx`) remains completely preserved with zero unexpected layout shifts.
7. TypeScript compiles with 0 errors (`npx tsc --noEmit`).

## Boundaries

Governs `src/screens/OnboardingScreen/` (steps, renderer, config, constants), `app/tabs/screens/(onboarding)/premium-onboarding.tsx`, and Day-0 routing to `app/tabs/(tabs)/home/`. Does not modify backend courses, exercises catalog, or other tab destinations.

## References

- PRD — `_bmad-output/initiative-happy-product-direction/prd-onboarding-and-day-0/prd-onboarding-and-day-0.md`
- Forge Spec — `_bmad-output/initiative-happy-product-direction/forge-onboarding-7-step/forge-onboarding-7-step.md`
- Design Spine — `_bmad-output/initiative-happy-product-direction/ux-onboarding-and-day-0/DESIGN.md`
- Experience Spine — `_bmad-output/initiative-happy-product-direction/ux-onboarding-and-day-0/EXPERIENCE.md`
- Architecture Spine — `_bmad-output/initiative-happy-product-direction/architecture-onboarding-and-day-0/architecture-onboarding-and-day-0.md`, AD-7 through AD-11
- Existing Streak Components — `src/components/Streak/StreakCelebration.tsx`, `src/components/Streak/StreakCelebrationParts.tsx`
- Existing Home Screen — `src/screens/JournalCalendarScreen/JournalCalendarScreen.tsx`
