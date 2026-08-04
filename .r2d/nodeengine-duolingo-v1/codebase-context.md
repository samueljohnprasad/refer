# Codebase Context: NodeEngine Duolingo V1

Decision: upgrade v1-only NodeEngine exercises to Duolingo-grade interaction standards for release, without course-specific mechanics and without Supabase changes.

Repo:
- Expo Router React Native app.
- User wants mock data only now: use `src/data/mock/sleep-reset-flat.ts`; do not edit Supabase.
- Redux Toolkit exists at `src/store/store.ts`.
- V1 session state uses `src/domains/journey/learning/v1LearningSessionSlice.ts`.
- Journey route is `app/tabs/screens/(journey)/journey-flow.tsx`.
- V1 engine shell is `src/components/node/NodeEngineRouter.tsx`.
- Legacy engine is `src/components/node/NodeEngine.tsx`; keep legacy compatible.
- V1 engines:
  - `src/components/exercise/RecallCategoryEngine.tsx`
  - `src/components/exercise/ScenarioCategoryEngine.tsx`
  - `src/components/exercise/DiscriminationCategoryEngine.tsx`
- V1 category config:
  - `src/domains/journey/learning/v1LearningConfig.ts`
  - `src/components/exercise/v1ExerciseCategoryEngineRegistry.ts`
  - pure resolver at `src/domains/journey/learning/v1LearningCategoryResolver.ts`
- V1 types at `src/types/journeyLearning.ts`; use enums, not loose strings.

Current behavior:
- `journeyApi.startLearningSession` is mock-only and returns `v1_session | legacy_node | unavailable`.
- `NodeEngineRouter` renders v1 session, checks client-side `isCorrect`, blocks unresolved wrong answer advancement, shows feedback, supports clue/easier/skip, saves bounded AsyncStorage draft.
- Engines emit bounded response IDs only.
- Support row is visible and low-pressure.

Known gaps versus Duolingo-grade v1:
- No visible per-item goal/cue above exercise beyond prompt.
- No micro-progress label like “1 of 3”.
- Retry repeats same item after miss; no changed variant support yet.
- Attempt count/support metadata not visible or persisted cleanly.
- “Make easier” support text exists but options are not reduced.
- Worked-answer third miss path not wired.
- No small positive transition cue beyond footer status.

Constraints:
- V1 only. Do not redesign legacy engine except safety bug fixes already made.
- No Supabase, migrations, edge functions, or RLS.
- No test files per user request.
- Keep mental-health UX low friction: no lives, timers, streak loss, leaderboards, failure labels, shame copy, diagnostic claims.
- Use config-driven category engines and Redux Toolkit session state.
- Keep raw learner prose out of telemetry/session persistence.
- Follow repo design: calm sage/white/dark green, large tap targets, simple copy.
