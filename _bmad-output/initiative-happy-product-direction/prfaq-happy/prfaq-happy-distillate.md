---
title: "PRFAQ Distillate: Happy"
type: llm-distillate
source: "prfaq-happy.md"
created: "2026-10-19"
purpose: "Token-efficient context for downstream implementation, architecture, and sprint execution"
---

### 1. Strategic Framing & Decisions
- **Core Wedge**: "Duolingo for CBT + Happi the Panda + Unbreakable Streaks".
- **Rejected Framings**:
  - Rejected: Generic streak repair / streak freeze purchases (triggers shame and mimics toxic gaming monetization).
  - Rejected: Blank-slate journaling as the primary habit (causes paralysis for overwhelmed/anxious users).
  - Rejected: Conversational AI roleplay therapist (distrusted by users, high liability, low real structured efficacy).
- **The Unbreakable Streak Policy**:
  - Strictly cumulative lifetime active-day counter.
  - Zero resets to zero, zero streak breaks, zero freeze complexity.
  - Absence of 7 days leaves streak intact; next active day increments by 1.

### 2. Technical Context & Platform Constraints
- **Platform**: iOS 26+ only (no legacy fallbacks). Expo Router, React Native, NativeWind, Supabase, RevenueCat SDK 10.x.
- **Architectural Seams**:
  - Domain layer: `src/domain/` (pure TypeScript, zero React Native imports).
  - Component Budget: Strict <300 lines per file.
  - Offline-first: SQLite / AsyncStorage is local source of truth; Supabase sync is idempotent.
  - Zero-knowledge reflective privacy: No user journal text, thoughts, or emotions ever sent to PostHog telemetry or third-party AI models.

### 3. Scope Signals & Sizing (MVP vs Future)
- **In Scope for Sprint 1 (P0)**:
  - Low-Battery Mode check-in (<15s mood + somatic breath anchor).
  - Unbreakable Cumulative Streak engine & DB schema update.
  - 1-Tap Pocket Coping Card extraction & offline cache tray.
  - 27-State Situational Happi mascot engine wiring across all milestones/empty states.
- **Out of Scope (Explicit Non-Goals)**:
  - Tele-therapy matching / clinician marketplace.
  - Public social feeds / commenting.
  - DSM-5 / ICD diagnostic scoring.
  - Day-0 hard paywalls before first interactive cognitive win.

### 4. Telemetry & Funnel Lessons (PostHog Real Data)
- **Resolved Leaks**:
  - Soft paywall trap fixed: permanent "✕" close header added on Step 8.
  - Apple Auth bottom sheet detent fixed: increased to 320pt/410pt with prominent "Skip" option.
  - Reviewer pact loop fixed: single-tap 250ms completion animation replaces fragile 1,200ms hold.
- **Key Funnel KPIs**:
  - Onboarding Completion: Target >90%.
  - Onboarding $\rightarrow$ 7-Day Trial Start: Target 45%.
  - D1 Retention: Target 45%.
  - D7 Retention: Target 28%.
  - D30 Retention: Target 20%.

### 5. Immediate Implementation Hand-offs
- **To Architect (Winston)**:
  - Design SQLite offline cache schema for Pocket Coping Cards.
  - Design idempotent `increment_user_streak` DB migration replacing fragile day-diff logic.
- **To Developer (Amelia)**:
  - Implement `LowBatteryCheckinSheet.tsx` (<15s, mood slider + 3s box breath).
  - Wire `panda-coping-card` into `CopingCardsEmptyState.tsx`.
