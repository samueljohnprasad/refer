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

## Backlog / next
- P1: Perfect-lesson variant (bonus XP, slow-clap mascot) like Duolingo.
- P1: Streak + time-spent stat cards alongside XP.
- P2: Celebration sound effects (wire real assets into `useSoundEffects`).
- P2: Review-prompt timing tuning after lesson celebrations.
