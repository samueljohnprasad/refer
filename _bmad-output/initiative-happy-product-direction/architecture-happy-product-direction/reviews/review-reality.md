# Brownfield Reality Review

## Verdict

The revised spine is materially better grounded: it explicitly labels the iOS target reconciliation, legacy journey/journal paths, layered-state exceptions, and AI narrative work as deferred or gated. Its declared stack versions match `package.json`. However, the new contracts and operational envelope are still target architecture, not current repository reality. The main implementation risk is that the first-use tracer path would cross several unimplemented contracts while legacy and hosted paths remain active.

## Findings

### 1. Auth and identity contracts are not implemented

The spine names `auth_ready`, `profile_ready`, `identity_ready`, and `IdentityLinkResultV1` as explicit readiness/linking contracts. No matching symbols or persisted readiness state exist in the repository. `src/context/AuthContext.tsx` currently performs anonymous sign-in, session observation, profile upsert, and Apple/Google linking, returning its own `ClaimProfileResult` statuses. Anonymous sign-in can fail and leave the provider without a session, and there is no identity-gated replay mechanism.

This is a material gap for the tracer path and for AD-8: the proposed `UnsyncedOperationV1` queue, idempotency, and replay after `identity_ready` are not present. Existing guest progress in `hooks/data/useGuestProgress.ts` is local persistence/fire-and-forget behavior, not the stated operation contract.

### 2. Journey v5 is present but the brownfield schema boundary is still live

`supabase/migrations/20260428000000_journey_map_v5.sql` creates the v5 `courses -> sections -> units -> nodes` model and progress tables. The v5 course functions use it. But `supabase/functions/fetch-enrolled-journeys/index.ts` and `supabase/functions/complete-journey-node/db.ts` still read legacy `journey_templates` tables. The migration itself says both systems coexist during transition, and the functions note that generated types trail the deployed curriculum schema and use `any` casts.

The spine correctly makes reconciliation a prerequisite and describes legacy access as compatibility-only, but that condition is not yet true in the code. `src/screens/OnboardingScreen/constants.ts` and `hooks/journey/usePersonalizedCourse.ts` also retain a local `MOTIVATION_COURSE_MAP`/local-mode starter mapping rather than `StarterPathV1`.

`PracticeCompletionV1` is likewise absent. Current completion is split across exercise entries and course/node progress rather than a normalized cross-feature completion projection.

### 3. Journal canonicalization is incomplete

The main save/retrieval paths use `journal_records` (`hooks/post/useSaveJournal.ts`, `hooks/data/useMentalHealthData.ts`, and bookmark retrieval). The migration and RLS work for `journal_records`/`journal_ai` exist. However, `app/tabs/screens/(recording)/journal-entry.tsx` still queries `journal_entries` directly.

The revised spine's “legacy input through a bounded adapter” rule is directionally correct, but no adapter or `JournalRecordV1` boundary was found at that route. This remains an active source conflict for the private-reflection epic and must be resolved or explicitly quarantined before claiming one canonical journal path.

### 4. Insight implementation does not enforce the revised threshold contract

The spine now specifies `InsightObservationV1`, rolling windows, user-local calendar days, and thresholds of three distinct completed practice sessions in seven days plus five relevant observations across at least three distinct days in 30 days. No `InsightObservationV1` implementation, read model, or storage contract exists.

Current code remains a compatibility/legacy path:

- `src/hooks/insights/useExerciseStats.ts` reads all completed `exercise_entries` through TanStack Query without the stated rolling cutoff.
- `src/utils/insights/temporalAnalysis.ts` uses `MIN_ENTRIES = 5`, peak/day multipliers, and intensity thresholds; it does not enforce the revised distinct-day/window rules.
- `src/hooks/insights/useTemporalPatterns.ts` gates on total count but derives patterns from the existing stats shape.
- `src/network/genAi.ts` still sends journal text to Gemini after a five-entry minimum.

Therefore AD-5/AD-6 are valid target rules but not brownfield behavior. The pattern-insights epic needs an explicit observation adapter/read model and a deterministic path before any AI narrative compatibility work.

### 5. AI and logging reality needs a privacy gate

The spine appropriately prohibits new client AI in the core loop and requires policy-gated server-side reflection processing. Existing code is not yet demonstrably compliant with the stated logging boundary:

- `src/services/ai/localLLMProvider.ts` logs raw output, extracted JSON, and full system/prompt/output on success, plus error details.
- `supabase/functions/_shared/reflection-engine/weekly.service.ts` logs serialized context and model output while building reflection prompts.
- `src/network/genAi.ts` is an existing client-side journal-insight path.
- `hooks/useTranscribeAudio.ts` and `hooks/useEmotionsAnalysis.tsx` retain client audio/transcription and journal-processing paths.

These can remain legacy exceptions only if they are explicitly blocked from the new core loop, redacted/controlled in deployed environments, and covered by a retention/deletion audit. The revised spine identifies the right direction but does not make those controls current facts.

### 6. Operational envelope is mostly a requirement, not an existing pipeline

`supabase/config.toml` provides local Supabase configuration and enables local anonymous sign-ins. But `src/network/auth/supabase.ts` falls back to the hosted project when environment variables are absent, so “local development uses local Supabase” is not guaranteed by the app defaults.

`eas.json` has development, preview, and production profiles, but only production explicitly maps the hosted Supabase URL/key; no evidence establishes an isolated preview/TestFlight Supabase project. The repository contains migrations and manual function-deploy commands, but no verified promotion/rollback pipeline enforcing migration -> function -> client order. `supabase/seed.sql` describes direct SQL-editor use, which is not equivalent to reproducible environment promotion.

No repository evidence establishes an on-call owner, alerting/runbook, backup/restore procedure, retention enforcement, or complete deletion verification across all derived data. `delete-user-auth` exists, but its presence does not prove end-to-end deletion or backup handling. The spine should continue to treat these as release gates/open operational work, not current capabilities.

### 7. iOS target is acknowledged but remains a release blocker

The spine now accurately calls out native-target reconciliation. The repository still declares iOS 16.4 in `ios/Podfile`, with project settings containing both 16.4 and 18.0 deployment targets. `app.json` and package scripts also retain Android configuration/commands. Thus iOS 26+ is an initiative target, not the current native baseline; this is no longer an unacknowledged spine conflict, but it must be resolved before a release claim based on the new target.

### 8. Stack and state-management claims are substantially grounded

The declared versions in the spine match direct `package.json` declarations: Expo `~56.0.12`, React Native `0.85.3`, Expo Router `~56.2.11`, React `19.2.3`, Redux Toolkit `^2.11.2`, TanStack Query `^5.90.4`, Supabase JS `^2.75.0`, and TypeScript `~6.0.3`. The range operators mean the exact installed lockfile versions were not independently asserted by this review.

Redux Toolkit/RTK Query is used for journey-domain state in `src/store/store.ts` and `src/domains/journey/data/journeyApi.ts`; TanStack Query is used broadly for direct Supabase data hooks. Both providers are mounted by the root layout. The spine's layered direction is therefore grounded as a target for new code, while direct Supabase calls remain real legacy exceptions rather than a fully migrated architecture.

RLS policies are present in the v5 journey and journal migrations and use `auth.uid()`-scoped access for user data. The repository does not prove that every required migration is applied to the hosted environments or that the two-identity/RLS release gates have passed.

## Required gates before dependent implementation

1. Define and implement the auth/readiness/linking and unsynced-operation contracts, including conflict recovery and replay at the boundary.
2. Reconcile v5 and legacy journey functions, then introduce one `StarterPathV1` mapping/progress contract and one `PracticeCompletionV1` projection.
3. Quarantine or adapt the remaining `journal_entries` route to the canonical journal boundary.
4. Build `InsightObservationV1` from bounded, timezone-aware source data and enforce the revised thresholds deterministically.
5. Audit AI/transcription logs and legacy paths for raw sensitive content, with explicit block/redaction/retention behavior.
6. Prove environment isolation, hosted migration/RLS promotion order, deletion/retention behavior, observability ownership, and rollback before treating the operational envelope as satisfied.
7. Reconcile native deployment targets before claiming iOS 26+ release readiness.

## Review scope and evidence

Read-only review of the revised architecture spine, `package.json`, Expo/iOS configuration, `AuthContext`, Redux/RTK Query setup, root providers, Supabase migrations/RLS policies, journey functions, journal hooks/routes, insight hooks/utilities, AI/transcription/logging paths, EAS/environment configuration, and operational/deployment files. No spine or app code was edited.
