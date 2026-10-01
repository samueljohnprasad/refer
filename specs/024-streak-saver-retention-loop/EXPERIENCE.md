# Experience Specification: Streak Saver Retention Loop

**Slug**: `streak-saver-retention-loop`
**Status**: Final
**Created**: 2026-10-01
**Visual Reference**: [DESIGN.md](../../DESIGN.md)

---

## 1. Foundation
- **Platform & Form Factor**: Native iOS Mobile (Expo React Native, iOS 26+).
- **Design System Reference**: Governed by root `DESIGN.md` (Nunito typography, physical 3D depth buttons, bouncy spring animations, rounded shapes, sage palette).

---

## 2. Information Architecture & Surface Map

```
Push Notification Banner (7:00 PM Local Time)
       │
       ▼ (Tap)
Direct Deep Link Router
       │
       ├──► Active Exercise / Journey Node Screen (/tabs/(tabs)/record)
       │         │
       │         ▼ (Exercise Complete)
       │    Streak Increment & 3D Celebration Modal
       │         │
       │         ▼ (Milestone = Day 3, 7, 15)
       │    Native Apple Review Prompt (SKStoreReviewController)
       │
       └──► Auto-Cancel Scheduled 7 PM Notification
```

---

## 3. Voice and Tone (Microcopy)

- **Tone**: Warm, encouraging, playful, zero-guilt, gamified like Duolingo.
- **Day 1 Notification**: *"A quick check-in today would start your streak. Even 2 minutes counts 🌿"*
- **Active Streak Notification**: *"You're on a {N}-day streak. A short exercise today keeps the momentum going 🌿"*
- **Streak Celebration Title**: *"Streak Extended!"* / *"7-Day Streak Achieved!"*
- **Milestone Subtitle**: *"You've built a powerful daily habit. Enjoying Happy?"*

---

## 4. Component Patterns (Behavioral)

### A. Dynamic Evening Notification Banner
- **Behavior**: Appears at 7:00 PM local user time if `streak >= 1` and `last_activity_date < today`.
- **Interaction**: Single-tap opens app directly into active exercise without showing intermediate tabs.
- **Dismissal**: Swiping away leaves notification in iOS Notification Center; completing exercise cancels it automatically.

### B. Streak Milestone Celebration Modal
- **Behavior**: Pops up over exercise completion summary when streak hits a milestone (3, 7, 15 days).
- **Animation**: Bouncy spring scale-in + confetti explosion using `react-native-reanimated`.
- **Dismissal**: Tapping "Continue" triggers native `SKStoreReviewController` smoothly.

---

## 5. State Patterns

| State | User Action / Trigger | UI Feedback | Notification Action |
| :--- | :--- | :--- | :--- |
| **Streak Active (Saved)** | Exercise logged today | Green checkmark on streak header | Pending 7 PM notification cancelled immediately |
| **Streak At-Risk** | Past 6:00 PM, no log today | Flame icon pulses in header | Local 7 PM notification queued |
| **Notification Tapped** | Tap banner | Deep links to `/tabs/(tabs)/record` | Payload parsed, screen opens in <1s |
| **Milestone Achieved** | Streak reaches Day 3, 7, 15 | 3D Celebration Modal + Confetti | Triggers native `StoreReview.requestReview()` |

---

## 6. Key Journey: Alex Saves Streak on Day 7

1. **7:00 PM Trigger**: Alex (busy working parent) receives push notification: *"You're on a 6-day streak. A short exercise today keeps the momentum going 🌿"*.
2. **Direct Entry**: Alex taps notification banner. App opens straight to a 2-minute "Thought Reframing" exercise.
3. **Completion**: Alex completes the 2-minute exercise at 7:02 PM.
4. **Celebration**: Flame counter flips to `7 Days!`, confetti explodes, and native 5-star Apple Review prompt appears.
5. **Review Given**: Alex taps 5 stars in 2 seconds and returns to home screen with streak safe!
