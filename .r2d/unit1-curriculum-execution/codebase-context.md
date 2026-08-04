# Codebase Context — unit1-curriculum-execution

## Decision

Pick one V1 curriculum and execution model for Sleep Reset Unit 1 so it teaches useful sleep science, reduces anxiety/self-blame, and runs through shared bite-size exercise formats.

## Existing stack

- Expo Router React Native app.
- TypeScript strict.
- Redux Toolkit / RTK Query already used for journey data in `src/domains/journey/data/journeyApi.ts`.
- Current V1 learning runtime uses config-driven exercise categories, not legacy `NodeEngine`.
- User instruction: mock data first. Do not change Supabase for this phase.
- Repo rule: React component, hook, helper files must stay under 300 lines.
- Repo rule: use `clean-code`; keep names readable, functions small, files single-purpose.

## Current course data shape

- Mock course tree lives under `src/data/mock/sleep-reset-flat.ts`.
- Unit 1 V1 learning content lives in `src/data/mock/sleep-reset-unit1-v1.ts`.
- Journey API reads mock course tree and filters V1 exercises for a node.
- Current Unit 1 uses 4 lessons and 20 V1 exercises.
- Current exercise formats:
  - `close_discrimination`
  - `guided_recall`
  - `scenario_why`
  - unscored `close_discrimination` for low-pressure personalization/action choice

## Current runtime behavior

- `src/components/node/NodeEngineRouter.tsx` routes V1 exercises.
- `src/components/node/NodeEngineRouter.helpers.ts` builds resolved response telemetry.
- `src/domains/journey/learning/v1LearningSessionSlice.ts` tracks attempt count, support level, response state, and timing.
- `src/domains/journey/learning/mockLearningEvidenceStore.ts` stores mock responses.
- Supabase persistence is intentionally deferred.

## Product constraints

- Users may be anxious, depressed, stressed, overthinking, sleep-deprived, or low-energy.
- Curriculum must avoid friction, shame, diagnostic claims, treatment promises, and medicalizing normal stress.
- App tone: premium, editorial, calm, trustworthy.
- Exercises must be common across many courses, not course-specific engines.
- V1 should ship only what can be released with mock data and current runtime.

## Prior internal decisions to preserve

- Use shared exercise mechanics for all courses.
- Teach one idea, ask active recall, correct misconception, retry with changed example, then choose optional tiny action.
- Keep reflections optional and unscored.
- Avoid timers, lives, pressure, generic "incorrect", and punitive failure states.
- Capture learning telemetry as evidence of mastery, not just completion.

## Scope fence

- Do not add Supabase tables or edge-function changes.
- Do not add new dependencies.
- Do not add course-specific React components.
- Do not reintroduce legacy `NodeEngine`.
- Do not create test files unless user explicitly asks.
- Do not redesign later Sleep Reset units in this decision.
