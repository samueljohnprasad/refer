# Architecture Spine Rubric Review

## Verdict

**PASS WITH CONDITIONS.** The revised spine clears the initiative-altitude good-spine gate. It now fixes the important ownership divergences, covers CAP-1 through CAP-6, keeps the seed small, and gives Deferred and operations explicit owners, triggers, and release gates.

Adoption still depends on enforcing the named brownfield gates. The live repository has a v5 progress-table/function mismatch and legacy Edge Functions contain hardcoded service-role credentials. These are not reasons to redesign the spine, but they are release-blocking seams that the migration and operations owners must close before the affected paths are treated as canonical.

## Review basis

Reviewed:

- `architecture-happy-product-direction.md` (revised spine)
- `spec-happy-product-direction.md`
- `product-guardrails.md`
- Targeted current code and migrations for identity, journey progress, practice completion, journaling, insights, Supabase/RLS, Edge Functions, and release configuration
- `python3 .agents/skills/bmad-architecture/scripts/lint_spine.py --workspace _bmad-output/initiative-happy-product-direction/architecture-happy-product-direction`

The deterministic spine lint passed with zero findings. No spine, app-code, or migration files were changed for this review.

## Gate summary

| Rubric area | Result | Assessment |
| --- | --- | --- |
| Initiative altitude | Pass | The paradigm, loop, invariants, ownership matrix, seed, and operations stay at substrate altitude rather than becoming a build plan. |
| Real divergence points | Pass with conditions | Journey, journal, next-action, insight, and direct-write seams are named and bounded; the live v5 table mismatch and credential exposure still require gated reconciliation. |
| AD enforceability | Pass with conditions | AD-1 through AD-9 are concrete enough for new work. Practice projection and legacy exceptions need the stated migration gates to prevent drift. |
| CAP-1..CAP-6 | Pass with conditions | All capabilities have a home and governing decisions. CAP-2/CAP-3 retain brownfield and modality gates; CAP-6 depends on safety/release enforcement. |
| Seed minimality | Pass | The seed names major seams without duplicating the schema, route tree, or implementation plan. |
| Deferred discipline | Pass | Deferred entries identify an owner, reopen trigger, and required exit evidence. |
| Operations/environment | Pass with conditions | Environment topology, promotion, secrets, release gates, observability, retention, and rollback are covered; existing hardcoded credentials must be explicitly fenced and removed/rotated. |

## Findings

### R1 — Canonical journey ownership is fixed, but the live v5 schema/function seam remains a release gate

**Severity: High; condition, not a spine-level rejection.**

AD-2 and the entity matrix now make the v5 course hierarchy authoritative and classify `journey_templates` as compatibility input only (`architecture-happy-product-direction.md:43-47,116-124`). The Deferred section gives Journey ownership of reconciliation and an exit condition requiring one canonical read/write path plus a retirement or backfill marker (`architecture-happy-product-direction.md:198-208`). This is the right initiative-altitude decision.

The current brownfield implementation still has a concrete seam: the v5 migration defines `user_course_progress`, `user_node_progress`, `node_attempts`, and `user_node_responses` (`supabase/migrations/20260428000000_journey_map_v5.sql:104-146`), while `complete-node` and `get-course-progress` use `user_course_node_progress` (`supabase/functions/complete-node/completionData.ts:50-85`; `supabase/functions/get-course-progress/index.ts:42-105`). The legacy path still reads `journey_templates` and `user_node_progress` (`supabase/functions/fetch-enrolled-journeys/index.ts:51-54,141-145`; `supabase/functions/complete-journey-node/db.ts:92-133`).

**Required condition:** The Journey migration gate must reconcile the table/function contract before any dependent epic writes or reads a new source, and must record which compatibility path is read-only during rollout. Do not treat the matrix as implemented merely because the names are present in the spine.

### R2 — Practice completion has an owner, but `PracticeCompletionV1` needs one authoritative event/source rule

**Severity: Medium.**

The revised spine correctly assigns Practice one normalized completion adapter over course-node responses and standalone `exercise_entries`, prohibits ad-hoc raw-store joins, and gives the adapter an idempotent boundary (`architecture-happy-product-direction.md:49-53,116-124`). That resolves the previous “two builders, two completion paths” problem at the architecture level.

The remaining ambiguity is implementation authority: current exercise completion writes `exercise_entries` directly from `src/hooks/useExerciseMutation.ts:28-80`, while course completion writes a separate v5 progress path in `supabase/functions/complete-node/completionData.ts:50-85`. The spine does not yet say whether `PracticeCompletionV1` is a persisted read model, a server-generated event, or a query-time adapter, nor which duplicate wins when one user action can produce both records.

**Required condition:** Before CAP-2/CAP-4 implementation, Practice must define the normalized projection's source identifiers, deduplication rule, acknowledged-completion event, and cache owner. Keep that detail out of the seed; make it part of the owner boundary.

### R3 — Operational secret policy is stated, but current hardcoded service-role credentials are not explicitly fenced

**Severity: High; release-blocking.**

The operational envelope now makes server-side secrets, environment separation, migration/function/client promotion order, RLS verification, redacted logs, retention/deletion, rollback, and on-call/privacy ownership explicit (`architecture-happy-product-direction.md:175-185`). This is a substantial correction from the prior spine.

The checked brownfield code contradicts the stated secret boundary: `supabase/functions/complete-journey-node/db.ts:24-28`, `supabase/functions/fetch-enrolled-journeys/index.ts:190-193`, and other functions embed or fall back to a service-role credential. That is especially material because the same path is a legacy journey compatibility path and bypasses ordinary RLS through an admin client.

**Required condition:** Add this existing credential pattern to the migration/release gate as a named legacy exception: rotate/revoke exposed credentials, require environment-provided secrets, and block production promotion until a repository/configuration scan and hosted verification pass. The spine need not prescribe the code diff, but it must not imply the secret rule is already true.

### R4 — CAP-3 modality scope should be explicit at first-slice altitude

**Severity: Medium.**

CAP-3 is mapped to the canonical private journal, identity continuity, saved-state, RLS, and privacy rules (`architecture-happy-product-direction.md:187-196`). Voice/photo processing is deferred with a privacy/data owner and concrete retention, deletion, transcription, and disclosure gates (`architecture-happy-product-direction.md:198-205`). This is consistent with the product spec's conditional support for those formats.

The capability map does not explicitly distinguish the first shippable reflection slice from the deferred modalities. A builder could read CAP-3's “private reflection” mapping as requiring voice/photo now, or could silently ship an unverified modality because the Deferred item is not tied to the first-slice boundary.

**Required condition:** State that the first CAP-3 slice is limited to the verified reflection inputs, with voice/photo unavailable or visibly gated until the Deferred exit evidence passes. Do not expand the architecture seed for this.

### R5 — High-risk handling is responsibly deferred, but CAP-6 release blocking should be carried through to the user-facing boundary

**Severity: Medium.**

AD-6/AD-7 correctly make deterministic insights core, prohibit client-side sensitive-content generation for new work, require redaction/consent/retention gates, and defer high-risk handling to a named safety owner (`architecture-happy-product-direction.md:67-77,198-205`). CAP-6 is mapped to boundaries, auth/data controls, and insight/reflection surfaces (`architecture-happy-product-direction.md:191-196`).

The open product question still includes high-risk medical or self-harm detection and escalation. The spine says the safety owner reopens it before automated interpretation, but it does not explicitly say that CAP-6 messaging and non-automated core behavior may ship only with the current boundary copy verified, or that automated interpretation remains disabled until the safety decision is accepted.

**Required condition:** Keep the current core loop non-diagnostic and non-crisis-oriented, and make safety review plus verified boundary copy a CAP-6 release gate. AI/high-risk interpretation must remain off until the Deferred owner accepts the required evidence.

## Capability coverage

| Capability | Coverage judgement |
| --- | --- |
| CAP-1 — goal-led lesson | **Pass with condition.** StarterPathV1 supplies stable goal/course/lesson identifiers and Journey authority. Exact goal and content bundle remain correctly deferred to Epic 1. |
| CAP-2 — guided practice | **Pass with condition.** Practice has an owner and completion adapter, but the normalized event/source rule must be settled before implementation can diverge. |
| CAP-3 — private reflection | **Pass with condition.** Canonical `journal_records`, identity, RLS, saved-state, and privacy boundaries are clear. Verified first-slice modalities and legacy read-adapter retirement remain gates. |
| CAP-4 — personal insight | **Pass.** The evidence ladder, observation identity, deduplication, local-day windows, insufficient-data state, deterministic first pattern, and read-only ownership are explicit. Existing AI/timeline outputs are correctly fenced as compatibility/deferred surfaces. |
| CAP-5 — resume and switch | **Pass.** `StarterPathProgressV1` gives Journey durable ownership of path version, last completion, status, and `next_action`; switching preserves other path progress. |
| CAP-6 — boundaries and safety | **Pass with condition.** Privacy, non-diagnostic language, sensitive-processing restrictions, and operational release gates are present; high-risk handling and boundary-copy verification must remain release-blocking. |

## Seed and brownfield assessment

The structural seed remains minimal and appropriate. It names app presentation, Journey, timeline/read-model presentation, insights, existing hooks, Supabase migrations/functions, and auth adapters (`architecture-happy-product-direction.md:140-160`). It does not copy the table schema or prescribe an oversized folder rewrite.

The brownfield posture is now clear enough for new work: canonical v5 journey and `journal_records` paths are named; legacy journey/journal inputs are read-only compatibility surfaces; direct persistence is not a pattern for new initiative code; and ownership/retirement gates are stated (`architecture-happy-product-direction.md:43-53,85-89,198-208`). The remaining work is enforcement of those gates against the current callers, not another broad architecture section.

## Deferred ownership assessment

Deferred ownership is materially improved and passes the rubric. Each item names who reopens it and what causes reopening: Epic 1 for the first bundle, Journey/Journal for legacy reconciliation, auth/data for offline conflict, Journal/privacy for voice/photo, Insights/privacy for AI narratives, safety for high-risk handling, product for metrics, architecture for a new backend, and release for native alignment (`architecture-happy-product-direction.md:198-208`). The entries also include exit evidence or a release condition.

The only tightening needed is to make the first-bundle entry explicitly include the verified CAP-3 modality boundary and to keep the journey/practice reconciliation gates ahead of dependent implementation.

## What is working

- AD-1 is a strong identity invariant and matches the existing anonymous-session and provider-linking boundary.
- AD-2 now names canonical stores and compatibility behavior instead of merely saying that domains own data.
- AD-3 and the entity matrix make mutation ownership, idempotency, acknowledged state, and cache refresh visible.
- AD-4 gives CAP-1, CAP-2, and CAP-5 a versioned cross-domain contract while correctly deferring the exact first bundle.
- AD-5/AD-6 provide a usable evidence ladder and deterministic-first insight rule without making AI the product source of truth.
- AD-7/AD-8 are appropriate privacy and saved-state invariants for anonymous, sensitive, and intermittently connected use.
- The operational envelope covers the dimensions this initiative owns and gives the right release dependencies for sensitive capabilities.

## Gate decision

Adopt the spine as the initiative substrate **with the five conditions above recorded as implementation/release gates**. Do not mark the journey migration, practice evidence, first-slice reflection modalities, AI/high-risk behavior, or production operations complete until their named owners provide the stated exit evidence. No further spine expansion is needed; if those gates cannot be enforced, revise the spine rather than allowing a new parallel source of truth.
