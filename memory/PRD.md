# PRD — Lesson Complete Celebration

## Original problem statement
"After a lesson is completed, add a celebration screen" — Duolingo-style, researched from Mobbin/best practices. Show XP earned + encouraging message + mascot. Applies to both journey map nodes and the standalone exercise flow.

## Context
Existing native-only Expo (SDK 56) + Supabase app ("Calm meets Duolingo" — CBT / mental-health gamified). Repo root is `/app` (not `/app/frontend`). Package manager primarily bun; yarn also works.

## User personas
People seeking accessible CBT / mindfulness exercises in a polished, gamified app; motivated by streaks, XP and warm feedback.

## Core requirements (static)
- Celebrate lesson completion with a joyful, on-brand screen.
- Surface XP earned, an encouraging line, and the panda mascot.
- Work for (a) standalone exercise flow Finish and (b) journey map lesson-node completion.
- Respect Reduce Motion and existing haptics/theme conventions.

## Implemented (2026-10-01)
- New component `src/components/celebration/LessonCompleteCelebration.tsx`:
  - Mascot pop/bounce (panda-super-excite), confetti burst (reuses `ConfettiExplosion`), staggered reveals via reanimated.
  - Animated XP count-up card (amber/"gold"), encouraging message, 3D tactile `Continue` button, success/impact haptics, Reduce-Motion fallbacks.
  - Exports `pickEncouragement()` helper. testIDs: `lesson-complete-celebration`, `celebration-xp-value`, `celebration-continue-button`.
- Exercise flow (`src/screens/ExerciseFlowScreen/ExerciseFlowScreen.tsx`): on fresh completion, shows the celebration (XP = `XP_REWARDS[EXERCISE_COMPLETE]`) before exiting; re-completions exit directly.
- Journey lesson celebration (`src/domains/journey/ui/JourneyMapView.tsx`): replaced the old panda overlay for `CelebrationLevel.LESSON` with the new screen; unit/course milestones unchanged.
- Journey completion (`app/tabs/screens/(journey)/journey-flow.tsx`): awards EXERCISE_COMPLETE XP when `completion.celebration` is present (fresh completion).
- Dev preview trigger added to `app/dev/celebration-test.tsx`.

## Environment notes
- Repo root is `/app`; platform `expo` supervisor expected `/app/frontend`. Added symlink `/app/frontend -> /app` so the packager runs. Deps installed via yarn/bun.
- Web preview does NOT render (native-only deps: react-native-color-matrix-image-filters, native Lottie, etc.). Verify in Expo Go on a device.

## Implemented (2026-10-01, round 2)
- **Celebration sound**: `assets/sounds/page-turn.wav` (as the screen opens) + `assets/sounds/celebration-chime.wav` (as the panda lands). `useSoundEffects` now actually plays via `expo-audio` (cached players, respects global mute).
- **Streak + time cards**: celebration shows XP · STREAK · TIME cards (staggered spring-in). Streak from `useStreak().currentStreak` (min 1); time measured from screen mount in both journey-flow and ExerciseFlowScreen.
- **Perfect lesson**: `src/domains/journey/rewards/lessonStats.ts` (`isPerfectLesson`, `PERFECT_LESSON_BONUS_XP = 5`). Journey-flow awards base+bonus XP and passes `{ durationMs, isPerfect }` via `handleCompletionResult(result, stats)` → `RewardCelebration.stats`. UI: golden glow, slow 3-beat clap (scale/tilt + light haptics), "PERFECT LESSON +5 XP" badge, "Perfect lesson!" title, perfect-specific encouragements.
- **Share your win**: `ShareWinCard.tsx` rendered off-screen inside the modal, captured with `react-native-view-shot` and shared via `expo-sharing` (text-share fallback). Added deps `expo-sharing`, `react-native-view-shot` (yarn; `bun.lock` is stale — run `bun install` if building with bun).
- Fixed pre-existing TS errors in `useJourneyMapController.tsx` (`courseCompletionMessage` type, `showDock` → `isCompleted`).

## Implemented (2026-10-01, round 3)
- **Daily goal ring**: `DailyGoalRing.tsx` (react-native-svg + reanimated). Goal stored in `src/store/dailyGoalStore.ts` (`useDailyXPGoal`, default 30 XP, AsyncStorage). Celebration shows a "DAILY GOAL" card: ring fills from before→after this lesson using `XPContext.todayXP`; turns green with a tick + success haptic when the goal is crossed; hint "N XP to go" / "Daily goal reached".
- **Streak milestones (3/7/15/30)**: `src/store/streakMilestoneStore.ts` celebrates each milestone once per streak run (AsyncStorage date check). UI: "N-DAY STREAK" pill, `FlameBurst.tsx` embers + halo on the streak card, flame icon pulse, heavy haptics, encouragement line swaps to a milestone message.
- Dev screen triggers updated (`todayXP`, `dailyGoal`, `celebrateStreakMilestone` overrides).

## Implemented (2026-10-01, round 4)
- **Goal picker**: `SettingsScreen/components/DailyGoalPicker.tsx` — inline chip group (10 Easy / 20 Steady / 30 Serious / 50 Intense) at the top of Settings → Preferences, persisted via `useDailyXPGoal`.
- **Weekly streak dots**: `WeeklyStreakDots.tsx` (Sun→Sat dots + letters, today ringed, derived from the displayed streak count) rendered inside the STREAK card with staggered pop-in.
- **Mute toggle**: speaker icon button (top-right, safe-area aware) on the celebration, wired to `useSoundEffects().toggleMute` (global persisted mute).

## Backlog / next
- P2: Review-prompt timing tuning after lesson celebrations.
