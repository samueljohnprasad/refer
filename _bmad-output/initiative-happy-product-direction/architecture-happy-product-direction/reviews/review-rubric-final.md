# Architecture Spine Good-Spine Rubric Review

## Verdict

**PASS WITH CONDITIONS.** The spine is a suitable initiative-altitude build substrate. It identifies the meaningful cross-domain invariants, covers CAP-1 through CAP-6, keeps the structural seed small, and gives most deferred decisions and operational concerns an owner and reopening trigger.

The conditions are release and implementation gates, not a reason to redesign the spine. The live repository still contradicts parts of the target boundary: journey functions use incompatible progress-table shapes, the normalized practice projection does not exist, sensitive AI is reachable from the client, hardcoded service-role fallbacks remain in Edge Functions, and the native target is below iOS 26. These paths must remain legacy or blocked until the stated gates have evidence.

## Review basis

- Current `architecture-happy-product-direction.md`, without edits.
- `spec-happy-product-direction.md` and `product-guardrails.md`.
- Focused graph queries for auth, journey completion, journal persistence, and insight ownership.
- Targeted brownfield checks across AuthContext, journey migrations/functions, journal routes, practice mutations, insight hooks, Edge Functions, client AI, and iOS configuration.
- Deterministic spine lint: `total_findings: 0` from `lint_spine.py`.

## Gate summary

| Rubric area | Result | Assessment |
| --- | --- | --- |
| Real divergence points | Pass with conditions | Identity, canonical stores, path progression, completion evidence, journal lineage, insights, and direct-write seams are named. Brownfield reconciliation remains blocking. |
| AD enforceability | Pass with conditions | AD-1 through AD-9 have concrete rules. Practice projection, legacy exceptions, and policy gates still need executable owner-boundary enforcement. |
| CAP-1 through CAP-6 | Pass with conditions | Every capability has a home and governing decisions. CAP-3 modality scope and CAP-6 release behavior need explicit first-slice gates. |
| Named stack and fit | Pass | Versions match the current `package.json` declarations and the spine does not add dependencies. Native deployment alignment is correctly deferred. |
| Minimal seed | Pass | The seed names the current route/domain/network seams without copying the schema, route tree, or implementation plan. |
| Brownfield fit | Pass with conditions | Canonical v5 and `journal_records` paths are named and legacy paths are bounded conceptually, but those boundaries are not yet true in the code. |
| Operational envelope | Pass with conditions | Environments, promotion order, secrets, observability, retention, deletion, and rollback are covered. Existing credential exposure and client AI need explicit enforcement. |
| Deferred discipline | Pass with condition | Owners, triggers, and exit evidence are present. The source spec's subscription boundary remains silent and should be deferred explicitly or marked out of scope. |
| Safety and privacy | Pass with conditions | AD-6/AD-7 are strong, but current client processing and hardcoded credentials violate the intended boundary until quarantined and verified. |

## Findings

### R1 — Sensitive-processing and credential rules are not yet true in the brownfield code

**Severity: High; release-blocking condition.**

AD-7 and the operational envelope correctly require private-by-default reflections, metadata-only telemetry, server-side policy-gated processing, externalized secrets, and a production block for hardcoded Edge Function credentials (`architecture-happy-product-direction.md:73-77,175-185`). The repository still contains hardcoded service-role fallbacks in `supabase/functions/complete-journey-node/db.ts:24-28`, `fetch-enrolled-journeys/index.ts:189-193`, `update-bandit-stats/index.ts:9-15`, and other functions. Client code also constructs `GoogleGenAI` with `EXPO_PUBLIC_GEMINI_API_KEY` in `src/network/genAi.ts:45-47` and `src/hooks/insights/useInsightNarrative.ts:20-22`.

The spine's Edge Function scan gate does not explicitly cover client-bundled sensitive keys or legacy client AI calls. Without that scope, two builders can interpret “server-only” as applying only to new server code while reusing an existing unsafe path.

**Required condition:** Treat all existing credential fallbacks and client AI/reflection-processing paths as quarantined legacy exceptions. Rotate/revoke exposed credentials, require environment-provided secrets, add a repository/build scan for client-bundled sensitive keys, and block CAP-3/CAP-4/CAP-6 sensitive releases until deployed configuration, processing behavior, and redacted logs are verified.

### R2 — Canonical journey ownership is decided, but the live v5 schema/function seam remains open

**Severity: High; brownfield adoption condition.**

AD-2 makes `courses -> sections -> units -> nodes` and the v5 progress tables authoritative, while classifying `journey_templates` as compatibility input (`architecture-happy-product-direction.md:43-47`). The migration creates `user_node_progress`, `node_attempts`, and `user_node_responses` (`supabase/migrations/20260428000000_journey_map_v5.sql:104-146`), but `complete-node` and `get-course-progress` use `user_course_node_progress` (`supabase/functions/complete-node/completionData.ts:50-85`; `supabase/functions/get-course-progress/index.ts:97-120`). Older enrollment functions still use a different `user_node_progress` shape and an admin client (`supabase/functions/complete-journey-node/db.ts:88-143`; `fetch-enrolled-journeys/index.ts:142-150`).

The Deferred entry names reconciliation and a good exit condition (`architecture-happy-product-direction.md:200-202`), so this is not a missing architectural decision. It is a real brownfield contradiction that can let dependent work choose incompatible reads and writes before the gate closes.

**Required condition:** Reconcile the hosted schema and functions before any dependent epic adopts a new source. Record the one canonical read/write path, the exact bounded compatibility reads, and the migration/backfill or retirement evidence before treating Journey as implemented.

### R3 — `PracticeCompletionV1` still leaves projection materialization and source identity open

**Severity: Medium.**

The spine improves the rule substantially: v5 completion evidence must be a qualifying submitted `user_node_responses` row, standalone completion must be a completed `exercise_entries` row, and `practice_session_id` is stable across retries (`architecture-happy-product-direction.md:43-53,116-124`). However, it does not say whether `PracticeCompletionV1` is a persisted projection, a server-owned event, or a query-time adapter; nor does it define the canonical uniqueness/source-key namespace when retries, attempts, and path events meet.

The live code has separate writers: `src/hooks/useExerciseMutation.ts:28-70` upserts `exercise_entries`, while `supabase/functions/complete-node/completionData.ts:60-85` writes the legacy course-progress path. Independent implementations can therefore expose different completion timestamps, source IDs, acknowledgement boundaries, or duplicate behavior while claiming compliance with the same AD-2/AD-3 rule.

**Required condition:** Before CAP-2 or CAP-4 implementation, Practice must publish the normalized projection boundary, canonical source/session identity, uniqueness rule, acknowledgement event, cache owner, and repair behavior. Keep this in the owner boundary rather than expanding the structural seed.

### R4 — CAP-3 does not explicitly define the verified first-slice modalities

**Severity: Medium.**

CAP-3 includes text, voice, photo, and prompt-based reflection in the source spec. The spine correctly defers voice/photo processing until capability, retention, deletion, transcription, and disclosure evidence exists (`architecture-happy-product-direction.md:193,203`). It does not explicitly say that the first shippable CAP-3 slice is limited to the modalities already verified in the released build.

That leaves room for one builder to treat the capability map as a requirement to ship voice/photo now and another to treat the Deferred entry as optional future work.

**Required condition:** Bind the first CAP-3 slice to the verified text/prompt inputs, or name the verified modality set explicitly. Voice/photo must remain unavailable or visibly gated until the Deferred exit evidence passes.

### R5 — CAP-6 user-facing boundary copy and professional-care handling need a release gate

**Severity: Medium.**

The spine maps CAP-6 to shared copy, auth/data boundaries, and reflection/insight surfaces, and it keeps diagnosis, crisis care, treatment advice, and causal claims out of the core insight rules (`architecture-happy-product-direction.md:61-77,187-196`). The operational release gates mention redacted logs and sensitive processing, while the Deferred section reopens high-risk handling before automated interpretation (`architecture-happy-product-direction.md:180,204-205`).

The release contract does not explicitly require verified boundary/privacy copy and professional-care signposting on the user-facing surfaces before CAP-6 is considered shipped. It also does not state that any automated high-risk interpretation remains disabled until the safety owner accepts the evidence.

**Required condition:** Make verified boundary copy, privacy/processing disclosure, and high-risk out-of-automation/professional-care handling a CAP-6 release gate. Keep automated interpretation disabled until that gate is accepted.

## AD enforceability assessment

| Decision | Result | Review judgement |
| --- | --- | --- |
| AD-1 identity continuity | Pass with condition | Strong state/status/equality contract. The current AuthContext still exposes `ClaimProfileResult` and background profile hydration rather than the named readiness/replay boundary; implementation must not claim compliance early. |
| AD-2 canonical durable model | Pass with condition | Canonical stores and legacy read-only behavior are explicit. The v5 and journal reconciliation gates must precede dependent work. |
| AD-3 one domain-owned write path | Pass with condition | Auth context, idempotency, acknowledgement, and cache invalidation are enforceable in new code; current direct Supabase writers require the named migration gates. |
| AD-4 StarterPath contract | Pass | Versioned identifiers, Journey authority, persisted path progress, CAS, and idempotent completion events prevent the major routing divergences. |
| AD-5 evidence ladder | Pass | Readiness thresholds, source identity, family validation, timezone epochs, insufficient-data behavior, and non-diagnostic output are concrete. |
| AD-6 deterministic first insights | Pass | The first pattern has a clear read-only deterministic source and AI cannot become a core dependency. |
| AD-7 private sensitive reflections | Pass with condition | The rule is strong and specific, but current client AI and credential paths must be fenced and verified. |
| AD-8 saved versus unsynced | Pass with condition | The acknowledgement/replay contract is clear enough for new work; the existing repository does not yet implement the identity-gated queue and must not silently substitute local guest state. |
| AD-9 one-way dependency direction | Pass with condition | Direction and legacy exceptions are clear. Import/boundary checks or equivalent review gates are needed because current hooks and screens still reach directly into Supabase. |

## Capability coverage

| Capability | Result | Coverage judgement |
| --- | --- | --- |
| CAP-1 goal-led lesson | Pass with condition | `StarterPathV1` and Journey authority cover the flow; the first concrete bundle remains correctly deferred to Epic 1. |
| CAP-2 guided practice | Pass with condition | Practice ownership and qualifying evidence are present; the normalized completion projection still needs one enforceable source/acknowledgement rule. |
| CAP-3 private reflection | Pass with condition | Canonical journal storage, lineage, RLS, saved-state, and privacy are covered; first-slice modalities and legacy journal reads remain gates. |
| CAP-4 personal insight | Pass with condition | The evidence ladder and deterministic first pattern are complete at the architecture level; current insight hooks remain compatibility behavior until the new read model exists. |
| CAP-5 resume and switch | Pass | Durable path/version progress, active-path ownership, CAS, and identity continuity give this capability a convergent contract. |
| CAP-6 boundaries and safety | Pass with condition | The non-diagnostic/privacy direction is correct; boundary copy, high-risk handling, and sensitive-processing release gates must be explicit and enforced. |

## Seed, brownfield, operations, and deferred review

### Minimal seed

**Pass.** The seed names `app/`, domain areas, existing hooks, Supabase migrations/functions, and auth/network adapters without prescribing a full schema rewrite or route-by-route implementation. The diagram label `Redux Query` should be read as the existing Redux Toolkit Query boundary; the prose uses the correct library name.

### Brownfield fit

**Pass with conditions.** The spine ratifies the current broad paradigm and does not introduce a second workflow backend. It correctly identifies v5 journey data, `journal_records`, direct-write exceptions, and deterministic insights as target ownership boundaries. The current graph and code show that AuthContext, journal routes, practice mutations, insight hooks, and Edge Functions still cross those boundaries directly. New initiative code can follow the spine only if the legacy callers are explicitly quarantined and migrated under the listed gates.

### Operational envelope

**Pass with conditions.** Environment separation, promotion order, additive migrations, function/client compatibility, secrets, RLS isolation, replay, projection, lineage, readiness, deletion, redacted logs, monitoring, and rollback are all addressed (`architecture-happy-product-direction.md:175-185`). The operational conditions are material: current hardcoded service-role fallbacks must be removed and rotated, public client AI use must be fenced, hosted migration/RLS behavior must be verified, and the iOS deployment target must be reconciled before claiming iOS 26+ support. The current Podfile and app target remain 16.4 (`ios/Podfile:25`; `ios/Happy.xcodeproj/project.pbxproj:680,719,792,857`).

### Deferred items

**Pass with one completeness condition.** Existing entries generally name the owner, reopening trigger, and exit evidence: first bundle, legacy reconciliation, offline conflict, voice/photo, AI narratives, high-risk handling, metrics, backend, and native alignment (`architecture-happy-product-direction.md:198-208`). The source spec also leaves subscription boundaries open while requiring that freemium not block the first meaningful loop. Add that as a deferred product/entitlement boundary, or explicitly declare it outside this spine's scope, so two epics cannot place the paywall inconsistently.

### Safety and privacy

**Pass with conditions.** The privacy posture is appropriate for health-adjacent reflections: user-scoped RLS, metadata-only telemetry, deterministic/source-transparent first insight, no diagnosis or treatment claims, and explicit deferral of AI/voice/photo/high-risk behavior. The posture is not yet operationally true because current client AI and hardcoded service-role paths remain. The release owner and privacy/safety owner need evidence, not only the target-state rule.

## Final gate decision

Adopt the spine as the initiative substrate **with R1–R5 recorded as blocking implementation/release conditions** and the subscription boundary recorded as a deferred product constraint or explicit scope exclusion. Do not mark the architecture implemented merely because the contracts are written. The next dependent work may proceed only through the canonical Journey/Journal boundaries, the normalized Practice completion boundary, the verified reflection modality set, and the CAP-6 safety/privacy release gates.
