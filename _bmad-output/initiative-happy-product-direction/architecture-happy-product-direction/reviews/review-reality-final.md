# Reality / Currentness Review — Happy Product Direction Architecture

## Verdict

**FAIL as a current/reality gate; acceptable only as a future-state target with blocking adoption gates.**

The spine is directionally coherent and its mechanical lint passes, but it is not yet a reliable description of the repository's current architecture. Several committed decisions are target contracts with no corresponding implementation, schema, or hosted verification. Other decisions are contradicted by active brownfield code: the journey schema/function boundary is split, the journal route still reads a legacy table, client-side AI and sensitive logging remain reachable, and local/preview configuration can fall back to the hosted project. The document is marked `draft`, which helps, but its AD language is strong enough that implementers could treat these target rules as already ratified current behavior.

This review did not edit the spine. It is based on the spine, its cited product/spec/guardrail sources, the current repository, local migration/function/config evidence, and current official documentation.

## Gate checks and evidence basis

- `lint_spine.py` passed: `total_findings: 0`.
- The required graph query/path/explain checks were run before raw repository inspection. `graphify update .` was also run before this report and will be rerun after the report edit.
- The repository has unrelated pre-existing dirty changes and untracked BMad artifacts. They were not reverted or treated as architecture evidence.
- No implementation symbols for `StarterPathV1`, `user_starter_path_progress`, `PracticeCompletionV1`, `InsightObservationV1`, `ReflectionContextV1`, `UnsyncedOperationV1`, or `IdentityLinkResultV1` were found in the application, hook, migration, or Edge Function paths searched. The names exist in the architecture artifacts, not as current runtime contracts.

## Named stack and version reality

The spine's stack table appears to list the lower bound from `package.json`, not the resolved repository state. The project contains multiple lockfiles, so an exact-looking version in the spine is not a sufficient currentness claim.

| Spine entry | `package.json` declaration | Lockfile resolution observed | Reality judgement |
| --- | --- | --- | --- |
| Expo `56.0.12` | `~56.0.12` | `56.0.19` | Spine value is not the resolved version. |
| Expo Router `56.2.11` | `~56.2.11` | `56.2.18` | Spine value is not the resolved version; the SDK 56 docs currently recommend the `56.2.x` line. |
| React Native `0.85.3` | `0.85.3` | `0.85.3` | Grounded. |
| React `19.2.3` | `19.2.3` | `19.2.3` | Grounded. |
| Redux Toolkit `2.11.2` | `^2.11.2` | `2.12.0` | Spine value is a declaration floor, not the lockfile version. |
| TanStack Query `5.90.4` | `^5.90.4` | `5.101.0` | Spine value is a declaration floor, not the lockfile version. |
| Supabase JS `2.75.0` | `^2.75.0` | `2.108.0` | Spine value is a declaration floor, not the lockfile version. |
| TypeScript `6.0.3` | `~6.0.3` | `6.0.3` | Grounded. |

Official documentation supports the general technology choices, not the exact project state: [Expo SDK 56](https://docs.expo.dev/versions/v56.0.0/) maps to React Native 0.85 and React 19.2.3; [Expo Router for SDK 56](https://docs.expo.dev/versions/v56.0.0/sdk/router/) documents the 56.2.x line; [TanStack Query](https://tanstack.com/query/latest/docs/framework/react) is currently on the v5 documentation line; and [TypeScript 6.0 release notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) confirm the named major version. The spine should state whether its table means declared minimum, lockfile-resolved, or installed version, and identify the authoritative package manager/lockfile.

## Findings

### R1 — The exact stack table is stale or ambiguous

**Anchor:** spine “Technology Stack,” lines 126–138.

The repository's direct declarations and lockfiles disagree on six of the eight named versions. The stack table therefore cannot be used as a reproducible current baseline. `node_modules` is also not an authority because it can drift independently of the lockfiles.

**Impact:** two units can install different versions while believing they share the architecture baseline; compatibility and release evidence can be assessed against the wrong version.

**Required gate:** change the table to explicit fields such as declared range, authoritative lockfile resolution, and verification date. Select one package manager/lockfile for architecture evidence without changing package-manager state as part of this review.

### R2 — AD-1 is a target auth contract, not the current auth boundary

**Anchor:** AD-1, lines 37–41.

`src/context/AuthContext.tsx` currently exposes `ClaimProfileResult` statuses (`linked`, `existing_account`, `cancelled`, `failed`), not `IdentityLinkResultV1`. Initialization sets user/session state and performs profile upsert in the background; it does not expose the named `auth_ready`, `profile_ready`, and `identity_ready` gates. `hooks/data/useGuestProgress.ts` persists temporary guest state in AsyncStorage and has no identity-gated replay queue or operation journal.

The [Supabase anonymous sign-in documentation](https://supabase.com/docs/guides/auth/auth-anonymous) confirms that anonymous users are real authenticated users, can be linked through identity linking, and are not recoverable after sign-out, clearing storage, or moving devices without an explicit conversion path. The repository does not yet implement the spine's stronger continuity and recovery contract.

**Impact:** a builder can claim anonymous-to-identified continuity while profile readiness, replay ordering, provider conflict recovery, and effective-ID equality are still implementation choices.

**Required gate:** implement and verify the exact readiness/status contract, including session incarnation, single-flight linking, recovery data disposition, replay ordering, and user-ID mismatch blocking. Until then, mark AD-1 as proposed rather than current.

### R3 — AD-2's v5 schema and active functions disagree on the progress table

**Anchor:** AD-2, lines 43–47; Deferred, lines 200–202.

`supabase/migrations/20260428000000_journey_map_v5.sql` creates `user_node_progress`, `node_attempts`, and `user_node_responses`. Current `supabase/functions/complete-node/completionData.ts` and `supabase/functions/get-course-progress/index.ts` read/write `user_course_node_progress`; the table name is not created by that v5 migration. Other active functions use a mixture of legacy journey tables and the v5 names. The migration itself explicitly says v5 tables coexist with legacy `journey_templates` during transition.

**Impact:** Journey is not one canonical durable model in the current repository. Completion, progress reads, and access checks can select different stores or fail against the hosted schema.

**Required gate:** reconcile the migration, deployed schema, and every active function before dependent work adopts v5. Record the canonical table/function path, exact bounded compatibility reads, ID mapping, backfill evidence, and retirement condition.

### R4 — AD-2/AD-3 do not yet have a materialized completion contract

**Anchor:** AD-2 and AD-3, lines 43–53; entity matrix, line 121.

No `PracticeCompletionV1` implementation or migration was found. Current course completion and standalone exercise completion are separate paths: the former uses the inconsistent journey functions; the latter writes `exercise_entries`. The spine does not define whether `PracticeCompletionV1` is a table, event, view, or query-time adapter, nor its source-ID namespace, uniqueness rule, terminal status, acknowledgement boundary, or repair behavior.

**Impact:** Journey, Insights, and downstream path progression can derive different meanings of “completed” while complying with the same prose decision.

**Required gate:** publish one typed projection contract owned by Practice, then add the durable uniqueness/idempotency and acknowledgement evidence before CAP-2 or CAP-4 is considered implemented.

### R5 — AD-3 and AD-9 are not enforced by the current dependency graph

**Anchor:** AD-3, AD-9, lines 49–53 and 85–103; structural seed, lines 140–160.

The spine requires one domain-owned write path and one-way dependencies, but current screens and hooks still call Supabase directly. `app/tabs/screens/(recording)/journal-entry.tsx` reads `journal_entries` directly; `hooks/post/useSaveJournal.ts` writes `journal_records`; journey and practice functions retain direct legacy database paths. The structural seed describes intended locations, not an enforceable boundary or a finite legacy allowlist.

**Impact:** new units can reuse legacy direct calls, introduce a second mutation path, or bypass the named auth/idempotency/cache rules without violating any repository check currently visible in the spine.

**Required gate:** inventory every permitted legacy caller with owner/entity/expiry, add import or review enforcement for new callers, and make the domain boundary the only new write entry point.

### R6 — AD-4's StarterPath persistence and CAS contract is absent from the repository

**Anchor:** AD-4, lines 55–59; Deferred, line 200.

No `StarterPathV1`, `user_starter_path_progress`, or `active_path_id` implementation was found in current source or migrations. The spine specifies a path-versioned row, serialized compare-and-swap, and `PathStepCompletedV1`, but no physical schema, transaction/function, seed registry, missing-version behavior, or retirement rule exists to make those decisions executable.

**Impact:** two builders can persist path progress in different stores, resolve a path version from different authorities, or advance the next action without the promised CAS and idempotency behavior.

**Required gate:** add the path registry/progress contract and a hosted migration/function test before calling CAP-1 or CAP-5 current. Keep the exact starter bundle deferred, but do not leave the persistence contract implicit.

### R7 — AD-5/AD-6 describe a new insight model while current Insights use a different algorithm and boundary

**Anchor:** AD-5 and AD-6, lines 61–71; entity matrix, line 124.

No `InsightObservationV1` implementation was found. Current `src/hooks/insights/useExerciseStats.ts` reads completed `exercise_entries` without the spine's evidence ladder, rolling windows, or pinned IANA timezone. `src/utils/insights/temporalAnalysis.ts` uses local JavaScript date methods and fixed thresholds; `src/hooks/insights/useTemporalPatterns.ts` also schedules notifications. Client AI remains reachable through `src/network/genAi.ts` and `src/network/extractTextFromImage.ts`.

**Impact:** current users can receive pattern behavior and side effects that do not satisfy the deterministic, read-only, timezone-aware model. “AI is optional” is not true as a brownfield boundary if existing client paths remain callable.

**Required gate:** label existing temporal insights as compatibility behavior, implement the versioned observation/metric read model, pin timezone context, and disable or explicitly quarantine client narrative/image-processing paths before claiming AD-5/AD-6 compliance.

### R8 — AD-7 is contradicted by live client AI, raw sensitive logs, and credential fallbacks

**Anchor:** AD-7 and Operational Envelope, lines 73–77 and 175–185.

The spine requires server-only policy-gated processing and metadata-only logs. Current code constructs Gemini with `EXPO_PUBLIC_GEMINI_API_KEY` in `src/network/genAi.ts` and `src/network/extractTextFromImage.ts`; `src/services/ai/localLLMProvider.ts` logs prompts and outputs; the reflection-engine services log reflection-derived context/output; and `supabase/functions/save-journal-ai-insights/translates.ts` logs transcript content. Several Edge Functions contain hardcoded service-role fallbacks. No key values are reproduced here.

The [Supabase Edge Function secrets guidance](https://supabase.com/docs/guides/functions/secrets) says production secrets belong in the project secret environment and notes that service-role clients bypass RLS. The current paths violate the spine's own production block and ordinary logging rule.

**Impact:** private journal/reflection material and privileged credentials can enter client bundles or ordinary logs; RLS and deletion boundaries can be bypassed by legacy admin paths.

**Required gate:** rotate/revoke exposed credentials, remove hardcoded privileged fallbacks, add a client-bundle and source scan, redact/disable raw sensitive logs, and quarantine all client AI/transcription paths until server policy, consent, retention, deletion, and hosted deployment evidence exist.

### R9 — AD-8's saved/unsynced distinction has no current operation queue

**Anchor:** AD-8, lines 79–83.

The current guest-progress implementation is AsyncStorage load/save/remove behavior, not `UnsyncedOperationV1`. It has no durable operation ID, current Supabase UUID binding, ordered replay, backoff state, identity mismatch stop, or visible recovery state. The spine's “saved only after durable write acknowledgement” rule is therefore not represented by the current local draft path.

**Impact:** local work can be described as saved when it is only local, or replayed under the wrong identity after auth changes.

**Required gate:** implement the operation record and identity-gated replay contract, or explicitly scope the current AsyncStorage behavior as non-durable draft-only compatibility behavior that cannot feed completion or insight evidence.

### R10 — Journal canonicalization is not true across active callers

**Anchor:** AD-2, lines 43–47; entity matrix, line 123.

The main save path writes `journal_records` (`hooks/post/useSaveJournal.ts`), while `app/tabs/screens/(recording)/journal-entry.tsx` directly reads `journal_entries`. No adapter implementing the spine's “legacy read-only compatibility input” rule was found. Migrations and generated function types retain both table names.

**Impact:** users can save to one journal model and read from another; lineage, delete behavior, AI children, and insights can diverge by entry point.

**Required gate:** choose the canonical read path, document the legacy adapter and cutover marker, and verify route-level save/read/delete/lineage behavior against one hosted schema before treating Journal as converged.

### R11 — Reflection lineage and atomicity are target claims without current artifacts

**Anchor:** AD-7, lines 73–77; entity matrix, line 123.

No `ReflectionContextV1` implementation or explicit guided-lineage contract was found. Current journal, AI, mood, and reflection-engine paths are separate service/table operations, including asynchronous child writes. The spine specifies atomic canonical journal plus lineage and a rule that children cannot be evidence before acknowledgement, but the repository does not provide the transaction/function or status model that enforces it.

**Impact:** guided reflections and standalone entries can be indistinguishable to downstream consumers, or AI/mood children can be counted before the parent is durably acknowledged.

**Required gate:** define the parent/child schema, transaction boundary, acknowledgement status, deletion cascade, and lineage read API before CAP-3 evidence is accepted.

### R12 — The local/preview isolation statement is false by default

**Anchor:** Operational Envelope, lines 175–185.

The spine says local development uses local Supabase and preview/TestFlight use isolated hosted Supabase. `src/network/auth/supabase.ts` has a hosted URL and anon-key fallback. `eas.json` supplies Supabase environment values only for the production profile; development/preview profiles have no explicit environment selection. A local or preview build can therefore reach the hosted project when environment configuration is absent.

The official [EAS environment-variable guidance](https://docs.expo.dev/eas/environment-variables/usage/) recommends explicitly selecting the environment for each build profile. The [Expo app config documentation](https://docs.expo.dev/versions/v56.0.0/config/app/) also makes the deployment/configuration values part of the build contract.

**Impact:** test data, anonymous users, and journal content can cross local/preview/production boundaries, invalidating the release-gate claim and privacy assumptions.

**Required gate:** remove hosted fallbacks from non-production code, provide explicit per-profile environment selection, fail closed when required values are missing, and prove project IDs/RLS isolation with a two-user hosted check.

### R13 — RLS and migration safety are file-grounded but not hosted-verified

**Anchor:** Operational Envelope, lines 175–185; AD-7, line 77.

Migration files enable RLS and define own-user policies for several tables, but no evidence in the architecture package proves that the relevant migrations are applied to the hosted preview/TestFlight/production projects, that all legacy tables have equivalent policies, or that two users cannot read each other's rows. The spine treats these as release gates, not current facts.

**Impact:** a migration can look safe in source while the deployed schema remains permissive, incomplete, or at a different revision.

**Required gate:** attach hosted migration revision, two-user isolation, privileged-function, deletion, and rollback evidence to the release gate. Do not infer hosted safety from local SQL files.

### R14 — The iOS 26+ platform claim is not current repository reality

**Anchor:** stack/platform note, line 138; Deferred, line 208; Operational Envelope, line 185.

`ios/Podfile` still defaults to iOS 16.4, and the Xcode project contains 16.4 and 18.0 deployment settings. `app.json` has no iOS 26 deployment target and still contains Android configuration/scripts. The spine does acknowledge reconciliation as deferred, so this is visible rather than hidden, but the platform should not be described as an existing iOS 26+ foundation.

The official [Expo app configuration reference](https://docs.expo.dev/versions/v56.0.0/config/app/) documents `ios.deploymentTarget` as the configuration point; current repository settings do not match the stated target.

**Impact:** native APIs, entitlement assumptions, CI builds, and release gates can be evaluated against a platform the current project does not build for.

**Required gate:** either update the native/app configuration in a separately authorized platform change or phrase the spine as “planned iOS 26+ target; current native baseline 16.4/18.0.” Verify Xcode/Pods, CI, and TestFlight before removing the deferral.

### R15 — The spine lacks a traceable evidence status for each committed AD

**Anchor:** AD-1 through AD-9 and the frontmatter source list, lines 1–19.

The source list points to product/spec/guardrail documents, but the ADs do not distinguish “current code fact,” “target contract,” “verified official capability,” and “unverified assumption.” This matters because the same document mixes current paths (`journal_records`, existing query libraries), normative future contracts (`IdentityLinkResultV1`, `InsightObservationV1`), and release requirements (hosted RLS, backups, deletion, rollback).

**Impact:** reviewer and implementer gates can pass based on prose presence rather than executable evidence; the repository can drift while the spine still looks complete.

**Required gate:** add a review companion or evidence register, without changing the spine in this task, mapping every AD to code/migration/source evidence, current status, owner, and blocking exit test. Mark unsupported decisions as proposed/deferred until that evidence exists.

## Decision-by-decision disposition

| Decision | Currentness result | Evidence disposition |
| --- | --- | --- |
| AD-1 identity continuity | **Partial / target-only** | Anonymous auth and provider linking exist, but the named readiness/result/replay boundary does not. |
| AD-2 canonical durable models | **Partial / contradicted** | v5 and `journal_records` migrations exist; active functions/routes still use incompatible paths. |
| AD-3 owned write paths | **Not grounded** | Direct Supabase callers and separate completion writers remain; no normalized completion projection exists. |
| AD-4 StarterPath | **Not grounded** | No path contract symbols, progress table, registry, or CAS function found. |
| AD-5 evidence ladder | **Not grounded** | No observation model; current stats do not implement the specified windows/timezone/threshold contract. |
| AD-6 deterministic insights | **Partial / contradicted** | Deterministic temporal code exists, but it is the old algorithm and client AI paths remain callable. |
| AD-7 private reflections | **Contradicted** | Client AI, raw sensitive logs, transcript logging, and hardcoded privileged fallbacks remain. |
| AD-8 saved vs unsynced | **Not grounded** | AsyncStorage guest state exists; the identity-bound operation queue does not. |
| AD-9 dependency direction | **Partial / unenforced** | Intended structure is documented, but direct screen/hook/function database access remains. |

## Required adoption gates

Before this spine is used as a current architecture baseline, the project should have evidence for:

1. One authoritative dependency/version baseline and package-manager lockfile.
2. Auth readiness, linking/recovery, identity equality, and replay tests against the exact AD-1 contract.
3. One reconciled v5 journey schema/function path and one journal read/write path.
4. A materialized, typed, idempotent `PracticeCompletionV1` boundary.
5. StarterPath persistence/CAS and deterministic insight observation artifacts.
6. Server-only sensitive processing, metadata-only logs, rotated secrets, and no client-bundled privileged/AI credentials.
7. Explicit local/preview/production environment isolation with fail-closed configuration.
8. Hosted RLS, deletion, retention, backup/restore, rollback, and native-target evidence.

Until these gates are met, the spine should be consumed as a proposed target architecture, not as proof that the current brownfield application already satisfies the nine ADs or the operational envelope.

