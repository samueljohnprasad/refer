# Codebase context — cbt-learning-mechanics

## Decision

Pick one coherent interaction, feedback, spacing, adaptation, progression, and telemetry system for Happy courses that proves CBT/psychoeducation skill learning instead of rewarding content completion.

## Product constraints

- Audience: general adults seeking accessible CBT and mental-health exercises. Often stressed or anxious.
- Goal: recall concepts, correct misconceptions, explain mechanisms, and use skills in changed real-life situations.
- Platform: Expo Router React Native mobile app. Touch, text entry, haptics, animation, notifications, PostHog, Supabase.
- Language: simple, literal, secondary-English-friendly.
- Scaffolding: adaptive examples are core. Keep at least two useful examples visible when open generation would otherwise stall learner.
- Tone: calm, private, non-diagnostic, non-shaming. Do not medicalize ordinary stress.
- Gamification tolerance: low. Prefer competence, autonomy, useful progress, and finite stopping points. Avoid leaderboards, streak loss, variable rewards, FOMO, and points for taps.
- Scope: deep exercise mechanics, feedback/retry, spacing, adaptation, safety, mastery model, telemetry. No video. No social learning.

## Existing stack

- Expo `~56.0.12`, React Native `0.85.3`, React `19.2.3`, TypeScript `~6.0.3`.
- Supabase `^2.75.0`; normalized course tree and progress tables already exist.
- TanStack Query, Redux Toolkit, PostHog React Native, Reanimated, Moti, Expo Haptics.
- Jest + `jest-expo`.
- Existing raw design tokens: `lib/tokens.ts`.
- Do not add dependencies unless current stack cannot support chosen model.
- Repo has multiple lockfiles. Do not change package-manager state.

## Existing course runtime

- Course hierarchy: `courses -> sections -> units -> nodes`.
- Node types: lesson, story, quiz, exercise, practice, challenge, boss.
- Content types already include multiple choice, matching, ordering, fill-in-blank, scenario, guided response, free text, rating, and cards.
- Runtime path:
  `course data -> journey API/selectors -> NodeEngine -> ExerciseRenderer -> ExerciseRegistry -> exercise component`.
- `src/components/ui/LessonScreen.tsx` exposes progress header and footer states: default, success, error.
- `src/types/exerciseFlow.ts` defines typed step configs, response state, validation, branching, AI suggestions, step timings, schema versioning, and save payloads for standalone CBT exercises.
- `src/hooks/useExerciseFlow.ts` records aggregate time per step, completed step IDs, response, and current step. It does not record answer attempts, hint use, correctness history, confidence, or delayed retention.
- `src/components/exercise/MatchingExercise.tsx` retries wrong matches in place, but only persists final matches.
- `app/_layout.tsx` installs PostHog provider. Course learning flow has no identified capture calls.

## Existing persistence

- `user_course_progress`: enrollment/completion only.
- Migration defines `user_node_progress`; current edge functions query `user_course_node_progress`. Resolve this naming drift before extending progress writes.
- `node_attempts`: attempt number, start/submit time, score.
- `user_node_responses`: one JSON response payload per node attempt. No per-item correctness, hint, confidence, or response-time fields.
- Schema has useful attempt primitives, but runtime `supabase/functions/complete-node/index.ts` explicitly uses simple Done-button completion:
  - increments attempt count;
  - writes null `last_score` and `best_score`;
  - does not persist responses or correctness;
  - unlocks next node on completion.
- Existing XP awards exercise completion. Current XP measures activity, not mastery.
- `src/hooks/insights/useSkillProgression.ts` estimates “skill progression” from symptom/intensity deltas across completed CBT entries. It does not measure concept knowledge or transfer.

## Current learning audit

`docs/sleep-reset-production-learning-audit.md` found:

- 66 interactions across 8 lessons + checkpoint.
- 38 scored interactions, all recognition or guided reconstruction.
- Zero scored independent recall.
- Wrong answers can advance after next tap.
- Authored answer explanations are not shown by runtime.
- Pass thresholds exist but are not calculated or enforced.
- Responses are collected locally then discarded.
- No concept mastery state, misconception tracking, delayed review, or adaptive difficulty.
- Existing interaction variety creates surface variety, not cognitive variety.
- Current release gate: reject until feedback, scoring, persistence, mastery, and safety improve.

## UI direction

- Inputs lead exercise screens. Suggestions and AI remain secondary scaffolds.
- Use Geist for labels, controls, body, and operational feedback. Cormorant only for reflective titles or completion.
- Use sage/white/dark green. Prefer tonal layering over shadow/card stacks.
- Keep 44px+ tap targets, readable contrast, stable keyboard/safe-area layouts, reduced-motion paths.
- Feedback should teach. Avoid generic “Awesome!” / harsh “Incorrect.”
- One interaction focus per screen. Progressive hints inline. Avoid modal-first teaching.

## Implementation seams

- Typed learning contracts: extend `src/types/journey/mentalHealth.ts` and/or extract focused contracts under `src/types/learning/`.
- Runtime answer lifecycle: `src/components/node/NodeEngine.tsx`.
- Exercise rendering/contracts: `src/components/exercise/ExerciseRegistry.tsx` and registered exercise components.
- Shared feedback surface: `src/components/ui/LessonScreen.tsx`.
- Course completion API: `src/domains/journey/data/journeyApi.ts`, `supabase/functions/complete-node/index.ts`.
- Persistence migration: add new migration; do not rewrite `20260428000000_journey_map_v5.sql`.
- Analytics wrapper: create focused course-learning events around PostHog. Never send journal/free-text content.
- Existing untracked Sleep Reset audit/spec/plan files belong to developer. Read-only unless later implementation brief explicitly includes them.

## Research output required

Rank exercise formats by learning value, CBT fit, build priority, and safety. For each:

- UI/UX pattern;
- feedback and retry loop;
- concrete CBT mapping;
- telemetry proving learning;
- support-up/support-down rules.

Also define:

- spacing schedule;
- safe failure rules;
- meaningful progression system;
- mastery data model separating completion from demonstrated knowledge, transfer, and delayed retention.
