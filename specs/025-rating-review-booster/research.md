# Phase 0 Research: App Store Rating & Review Booster

**Feature**: App Store Rating & Review Booster  
**Branch**: `025-rating-review-booster`  
**Date**: 2026-10-03  

## 1. Technical Decisions & Tradeoffs

### Decision 1: Native In-App Sheet (`expo-store-review`) vs Custom Star Modal
- **Chosen**: Native `expo-store-review` (`StoreReview.requestReview()`).
- **Rationale**:
  - Apple App Store Review Guideline 5.6.1 strictly prohibits custom star dialogs, sentiment pre-filtering ("Enjoying the app? Yes/No"), or review gating. Any intercept pattern risks app rejection.
  - Native StoreKit prompt allows 1-tap star submission directly within the app without switching contexts to the App Store.
  - Submission conversion is 15%–30% when prompted at emotional peaks vs < 1% for external links.
- **Alternatives Considered**:
  - *Custom modal asking for rating*: Rejected (violates Guideline 5.6.1; prohibited by Apple).
  - *Redirect to App Store on every milestone*: Rejected (disruptive; causes high bounce rate).

### Decision 2: State Persistence & Cooldown Enforcement
- **Chosen**: Timestamp-based 90-day global cooldown (`@happy/review_last_prompted_at`) + Set of completed milestones (`@happy/review_milestones_completed`) in `@react-native-async-storage/async-storage`.
- **Rationale**:
  - Apple's OS enforces an annual cap of 3 prompts per 365 days per Apple ID.
  - App-side 90-day cooldown ensures Happy never exhausts the user's quota prematurely and prevents prompt fatigue.
  - Tracking completed milestones ensures each milestone (e.g. `first_exercise_completed`, `first_journal_saved`, `streak_3`) only attempts once.
- **Alternatives Considered**:
  - *Stateless calls relying purely on iOS StoreKit*: Rejected (iOS silently drops calls if called too often, but best practice is to avoid invoking native bridge unnecessarily).
  - *Backend database tracking*: Rejected (YAGNI / Ponytail principle; local storage is synchronous, offline-safe, and private).

### Decision 3: 2000ms Post-Celebration Delay
- **Chosen**: `setTimeout(..., 2000)` after celebration modal mounts in `ExerciseFlowScreen` and after save toast in `useJournalOperationsHandler`.
- **Rationale**:
  - Calling `requestReview()` immediately upon tapping "Finish" startles the user, clips the victory confetti animation, and mutes dopamine reinforcement.
  - 2.0 seconds allows the user to absorb the reward ("Exercise complete! +50 XP"), feel relief, and be in a calm state when the 1-tap sheet appears.
  - Clean unmount cleanup: `timerRef` or `useEffect` cleanup ensures timer cancels if user exits before 2 seconds.
- **Alternatives Considered**:
  - *Immediate trigger (0ms)*: Rejected (jarring UX; interrupts victory feedback).
  - *Trigger on next app open*: Rejected (user is no longer in an emotional peak state; opening app with a review prompt feels intrusive).

### Decision 4: Voluntary Deep Link in Settings
- **Chosen**: Standard URL deep link: `https://apps.apple.com/app/id6755650433?action=write-review` opened via `Linking.openURL()`.
- **Rationale**:
  - Apple HIG explicitly states developers should provide a persistent voluntary rating link in Settings.
  - `action=write-review` query parameter directs iOS directly into the App Store review composer interface.
  - Does not count against the 3-per-year automated quota.
