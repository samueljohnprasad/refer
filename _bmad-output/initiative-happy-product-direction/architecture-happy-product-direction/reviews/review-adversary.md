# Adversarial Review — Revised Happy Product Direction Architecture

## Verdict

The revision closes most of the prior high-level gaps. It now names the major
contracts, owners, evidence projection, timezone intent, and replay boundary.
It is still not fully convergent: two downstream units can satisfy every AD
while choosing incompatible meanings for readiness, physical stores, lineage,
projection identity, timezone snapshots, or replay ordering.

The remaining risk is concentrated in underspecified fields and transitions,
not in missing architectural direction. The pairs below are constructed as
compliant implementations of the revised text.

## Paired divergence findings

### 1. `identity_ready` as link completion vs. link stability

**Anchor:** AD-1, lines 37–41.

**Unit A — auth boundary:** sets `identity_ready` after Supabase returns the
linked session and `IdentityLinkResultV1.status = "linked"`.

**Unit B — data bootstrap boundary:** sets `identity_ready` only after the
linked session, profile row, and current-user caches have been rehydrated.

Both expose `auth_ready`, `profile_ready`, and `identity_ready` separately and
make reads/replay wait for `identity_ready`. The spine does not define which
transition owns the flag, whether it is monotonic for a session, or whether a
profile/bootstrap failure returns the app to `profile_ready`.

**Consequence:** one client can replay unsynced work while another still treats
the same session as not safe for durable writes.

**Guard needed:** define the readiness state machine, owner, monotonicity, and
event ordering for `auth_ready -> profile_ready -> identity_ready`.

### 2. `IdentityLinkResultV1` status and error semantics

**Anchor:** AD-1, line 41.

**Unit A — provider linker:** uses `status: "linked" | "recovery_required" |
"failed"` and puts provider/session errors in an untyped `error` field.

**Unit B — auth UI/recovery flow:** uses `status: "linked" | "conflict" |
"cancelled" | "retryable_failure"` and maps the same provider conflict to
`conflict`.

Both return every named field (`anonymous_user_id`, `effective_user_id`,
`operation_id`, and `retryable`) and never silently merge or replace data. The
status union, error code, session freshness requirement, and cancellation
semantics remain open.

**Consequence:** recovery UI can treat a retryable link failure as a permanent
conflict, or replay can begin for a result the UI considers cancelled.

**Guard needed:** close the result union and error taxonomy; define which
statuses permit replay and which require explicit user action.

### 3. `effective_user_id` preservation vs. provider-session identity

**Anchor:** AD-1, lines 39–41; Auth and identity convention, line 112.

**Unit A — link adapter:** always returns the anonymous ID as
`effective_user_id`, because linking preserves the Supabase user.

**Unit B — session consumer:** trusts `session.user.id` after link as the
effective owner and treats a changed value as a migration/rebind event.

Both use Supabase identity and the same durable user-id contract. The spine does
not state the equality invariant between `anonymous_user_id` and
`effective_user_id`, or what to do if the provider SDK reports a changed
session identity.

**Consequence:** caches and local operations can be rebound or duplicated even
though both units believe they preserved one identity.

**Guard needed:** require `effective_user_id === anonymous_user_id` for normal
link success, and define a separate explicit recovery path for any mismatch.

### 4. `StarterPathProgressV1` logical record vs. physical progress store

**Anchor:** AD-4, lines 55–59; ownership matrix, lines 116–124.

**Unit A — Journey implementation:** stores one row per `(user_id, path_id)`
with `last_completed_step`, `next_action`, and `status`.

**Unit B — Journey implementation:** derives the same logical record from the
active-path pointer plus v5 `user_node_progress`, then materializes only the
current `next_action` in a profile/progress row.

Both preserve every path, keep Journey as owner, and expose the named logical
record. “Logical record” does not select a canonical physical store, key,
materialization rule, or source of truth for derived fields.

**Consequence:** resume, switching, and cache invalidation can disagree about
whether a path has progress or which `updated_at` is authoritative.

**Guard needed:** specify the canonical persisted key/store and mark all other
representations as derived read models with a refresh rule.

### 5. Active-path switching vs. path-progress mutation ordering

**Anchor:** AD-4, line 59; AD-3, lines 49–53.

**Unit A — switch-path mutation:** updates the active path pointer first, then
reads the selected `StarterPathProgressV1`.

**Unit B — completion mutation:** updates the current path's
`last_completed_step` and `next_action` first, then emits a completion event
that Journey uses to switch the active path.

Both let switching preserve other paths and only Journey mutate shared next
action. The contract does not define serialization, optimistic concurrency, or
which operation wins when a switch and completion overlap.

**Consequence:** a completion can advance the wrong active path or overwrite a
newly selected path's continuation.

**Guard needed:** define a path revision/compare-and-swap rule and the atomic
ordering for switch, completion, and event application.

### 6. v5 progress sources vs. `PracticeCompletionV1` projection

**Anchor:** AD-2, line 47; ownership matrix, lines 120–121.

**Unit A — course practice adapter:** derives one completion from a completed
`user_node_progress` row and uses `node_id` as `source_id`.

**Unit B — response adapter:** derives completion from the latest qualifying
`node_attempts`/`user_node_responses` record and uses `attempt_id` as
`source_id`.

Both use the v5 model, expose a normalized `PracticeCompletionV1`, and provide
idempotent source IDs. The projection's exact fields, qualifying status,
source-ID namespace, and precedence among progress/attempt/response stores are
not fixed.

**Consequence:** one practice can produce two completions or no completion,
changing StarterPath advancement and insight evidence.

**Guard needed:** define the projection schema, one qualifying source event,
source-ID namespace, and precedence/repair rule for the three v5 stores.

### 7. Completion event shape vs. Journey next-action update

**Anchor:** AD-4, line 59; ownership matrix, lines 121–124.

**Unit A — Practice:** emits `{ source_id, practice_ref, completed_at,
idempotency_key }` after its adapter acknowledges completion.

**Unit B — Journey:** expects `{ path_id, path_version, step_id,
completion_kind, occurred_at }` and derives the next action from the path.

Both return completion events and keep next-action mutation in Journey. The
event contract is not named, versioned, or required to carry the path/step
context needed to update `StarterPathProgressV1` safely.

**Consequence:** Journey can accept a valid completion that it cannot associate
with the correct path version, or infer a different next action.

**Guard needed:** define a versioned completion event with path, step, source,
user, occurrence, idempotency, and causation fields.

### 8. Practice/reflection lineage is absent from the canonical journal shape

**Anchor:** AD-2, line 47; AD-4, line 59; ownership matrix, line 123.

**Unit A — Journal repository:** writes `journal_records` plus `journal_ai`
and `moods` keyed by the journal ID, storing StarterPath/practice context in a
separate metadata object.

**Unit B — guided reflection flow:** stores `reflection_prompt_id` and
`practice_ref` in a lineage table or `journal_ai` row, leaving the canonical
`journal_records` row unchanged.

Both keep Journal as owner, relate child tables by canonical journal ID, and do
not make Insights write source records. No required field binds a journal row
to `path_id`, `path_version`, `practice_ref`, or `reflection_prompt_id`.

**Consequence:** a saved guided reflection can be indistinguishable from a
standalone journal entry, so evidence and resume behavior diverge.

**Guard needed:** make a versioned reflection-lineage contract mandatory and
name its canonical store, ownership, nullability, and deletion behavior.

### 9. Journal aggregate atomicity vs. child-record acknowledgement

**Anchor:** AD-2, AD-3, and AD-8, lines 47, 53, and 83.

**Unit A — Journal server boundary:** atomically writes `journal_records`,
`journal_ai`, moods, and lineage, returning one saved result.

**Unit B — Journal repository:** acknowledges `journal_records` first and
upserts moods/AI/lineage as follow-up mutations, each with its own retry key.

Both use one Journal-owned boundary and show saved only after the write they
define as durable is acknowledged. The spine does not define the journal
aggregate, atomicity scope, or whether partial child records are valid.

**Consequence:** Insights may see a canonical reflection before its structured
evidence exists, or replay may duplicate child rows after a parent retry.

**Guard needed:** define the reflection aggregate's atomic boundary and the
allowed intermediate state if child data is intentionally asynchronous.

### 10. `InsightObservationV1` projection identity vs. insight-family identity

**Anchor:** AD-5, lines 61–65; ownership matrix, line 124.

**Unit A — Insights projector:** sets `observation_id` to a stable hash of
`source_id + evidence_key + schema_version`.

**Unit B — Insights projector:** creates a UUID observation row per source
completion and enforces uniqueness on `(source_id, insight_family)`.

Both deduplicate retries by `source_id`, create at most one observation per
family, and use the named top-level fields. The spine does not define whether
`observation_id` is deterministic, whether `insight_family` is a field or part
of `evidence_key`, or where uniqueness is enforced.

**Consequence:** reprocessing or schema-version changes can create duplicate
evidence in one implementation and replace historical evidence in the other.

**Guard needed:** define observation identity, uniqueness key, schema-version
migration behavior, and whether observations are append-only or upserted.

### 11. `metrics` shape vs. deterministic rule compatibility

**Anchor:** AD-5 and AD-6, lines 65 and 71.

**Unit A — observation producer:** puts typed values in `metrics`, for example
`{ emotion_code, trigger_code, coping_code }`.

**Unit B — readiness calculator:** expects `{ emotion, trigger, coping }` or a
family-specific nested object and treats missing keys as ineligible.

Both use deterministic structured fields, a versioned observation, and no
free-text AI evidence. `metrics` is still an unconstrained shape; `schema_version`
does not say which fields are required for each insight family.

**Consequence:** the same observation is counted by one read model and excluded
by another without any source-data change.

**Guard needed:** define family-specific metric schemas, required/null values,
validation, and the meaning of an ineligible observation.

### 12. `evidence_key` derivation vs. insight-family taxonomy

**Anchor:** AD-5, line 65.

**Unit A — evidence producer:** derives `evidence_key` from
`path_id + path_version + practice_ref`.

**Unit B — readiness calculator:** derives relevance from a stable, safe
insight-family key such as `emotion_regulation`, independent of path identity.

Both use an immutable StarterPath/insight-family contract and do not combine
unrelated path evidence. The derivation function and allowed key namespace are
not specified.

**Consequence:** switching paths can either correctly isolate evidence or split
one intended insight family into multiple counters, depending on the unit.

**Guard needed:** publish the evidence-key grammar and a single mapping from
StarterPath/practice to insight family.

### 13. Distinct practice sessions vs. source-row identity

**Anchor:** AD-5, line 65; ownership matrix, line 121.

**Unit A — activity summary:** counts distinct `PracticeCompletionV1.source_id`
values.

**Unit B — practice adapter:** assigns a new `source_id` to each retryable
completion attempt but exposes a stable `practice_session_id` internally.

Both enforce idempotent retries at their chosen boundary and can say they count
distinct completed practice sessions. The contract does not identify the
session key or forbid attempt IDs from becoming projection source IDs.

**Consequence:** retries can consume multiple slots toward the three-session
threshold while the pattern projector deduplicates them differently.

**Guard needed:** make `practice_session_id` a required canonical field and
separate it from attempt/source mutation IDs.

### 14. Current timezone vs. observation-time timezone snapshot

**Anchor:** AD-5, line 65; data convention, line 110.

**Unit A — observation writer:** computes `local_date` using the user's IANA
timezone at completion and stores that date.

**Unit B — readiness calculator:** recomputes each observation's local date
using the user's current IANA timezone before evaluating the window.

Both use IANA timezone conversion, local calendar days, and retain a displayed
timezone at the insight surface. `InsightObservationV1` has `local_date` but no
timezone snapshot or rule for timezone changes.

**Consequence:** travel or a changed device timezone can move historical evidence
between active days and make the same pattern alternate between ready and
insufficient.

**Guard needed:** store the observation-time IANA timezone and define whether
window evaluation uses the observation snapshot or the user's current zone.

### 15. Rolling-window boundaries vs. local calendar-day boundaries

**Anchor:** AD-5, line 65; consistency convention, line 110.

**Unit A — activity summary:** uses an exact 168-hour UTC interval ending at
`now`.

**Unit B — shared readiness calculator:** uses seven user-local calendar dates
and converts their midnight boundaries to UTC.

Both implement a rolling seven-day window and ISO UTC persistence. The rule only
specifies local calendar days for the 30-day pattern threshold, not the seven-day
activity threshold, nor inclusivity at start/end boundaries.

**Consequence:** a completion near midnight can count toward the summary in one
consumer and fall outside it in another.

**Guard needed:** define each threshold's interval type, timezone, clock source,
and inclusive/exclusive boundary semantics.

### 16. DST and invalid-timezone fallback

**Anchor:** AD-5, line 65; operational envelope, lines 175–185.

**Unit A — server:** rejects an invalid or unavailable IANA timezone and returns
an explicit readiness error.

**Unit B — client:** falls back to UTC and still returns insufficient-data or
pattern-ready using a valid payload.

Both use the user's IANA timezone when available and retain a displayed window;
neither violates the stated normal path. The failure/fallback policy, DST
fold/gap handling, and timezone-data version are not defined.

**Consequence:** readiness and displayed active-day counts can differ exactly at
the boundary where trust is most visible.

**Guard needed:** define timezone validation, fallback, DST fold/gap semantics,
and whether server timezone data is authoritative.

### 17. Unsynced `local_user_id` vs. Supabase identity binding

**Anchor:** AD-1, AD-8, and Auth convention, lines 41, 83, and 112.

**Unit A — local queue:** stores the anonymous Supabase UUID in
`local_user_id` and replays only when it equals `effective_user_id`.

**Unit B — local queue:** stores a device-generated guest UUID in
`local_user_id`, then maps it to the current Supabase user during replay.

Both keep unsynced work local, wait for `identity_ready`, and never key durable
records by the local ID. The name `local_user_id` does not state whether it is a
Supabase anonymous ID, a local alias, or a mapping key.

**Consequence:** a queue can be rejected as foreign by one implementation and
attached to the wrong current session by the other.

**Guard needed:** distinguish `source_supabase_user_id` from any device-local
queue identifier and define the only permitted replay mapping.

### 18. Creation-order replay vs. dependency-order replay

**Anchor:** AD-8, line 83; AD-3, line 53.

**Unit A — auth replay worker:** processes all `UnsyncedOperationV1` records in
global `created_at` order.

**Unit B — domain replay worker:** preserves creation order within each entity
but waits for prerequisite operations, such as reflection lineage after
practice completion, before sending later records.

Both replay after `identity_ready`, use idempotency keys, and retry with
backoff/recovery. “In creation order” does not define total-order ties,
cross-domain dependencies, or whether a blocked operation stalls unrelated
operations.

**Consequence:** one worker sends a reflection before its practice/lineage
exists, while another deadlocks the whole queue behind one failed operation.

**Guard needed:** define operation dependency edges, tie-break ordering, and
whether replay is globally FIFO, per entity, or dependency-aware.

### 19. Replay acknowledgement vs. durable aggregate acknowledgement

**Anchor:** AD-3 and AD-8, lines 53 and 83.

**Unit A — replay worker:** marks an operation acknowledged when the parent
`journal_records` or completion row is accepted.

**Unit B — domain boundary:** marks it acknowledged only after all related
lineage, mood, or projection work is committed.

Both return explicit saved/completed results and keep unsynced work out of
Insights. The acknowledgement unit is not defined for multi-record aggregates.

**Consequence:** one queue removes work that another still considers incomplete;
partial replay can create evidence with missing reflection lineage.

**Guard needed:** define the durable acknowledgement boundary per entity and
require the replay result to carry aggregate completeness.

### 20. Completion mutation idempotency vs. cache/read-model freshness

**Anchor:** AD-3, lines 49–53; ownership matrix, lines 120–124.

**Unit A — Practice mutation:** returns completed, invalidates Practice cache,
and emits a completion event for Insights.

**Unit B — Insights read model:** consumes the event asynchronously and exposes
the previous readiness state until projection refresh finishes.

Both use the owner matrix, idempotent completion keys, and Insights-owned
readiness/cache invalidation. The spine does not define event delivery,
projection lag, duplicate-event handling, or whether a saved completion may be
shown with stale insight evidence.

**Consequence:** post-practice feedback, resume, and Insights can show mutually
inconsistent completion/readiness states after an acknowledged write.

**Guard needed:** define the completion-event delivery contract, projection
freshness state, and read-after-write expectation at threshold boundaries.

## Remaining spine contracts to close

1. Readiness transition ownership and exact `IdentityLinkResultV1` status/error
   semantics.
2. Physical stores and concurrency rules for `StarterPathProgressV1`.
3. Canonical v5-to-`PracticeCompletionV1` projection identity and qualifying
   source event.
4. Mandatory practice/reflection lineage fields and Journal aggregate
   atomicity.
5. `InsightObservationV1` identity, metric schemas, evidence-key grammar, and
   append/upsert behavior.
6. Observation-time timezone snapshot, threshold interval semantics, DST, and
   invalid-timezone fallback.
7. The exact distinction between local queue IDs and Supabase user IDs.
8. Replay dependency ordering and aggregate acknowledgement/freshness rules.

The revised ADs now constrain direction well, but these contracts remain the
difference between “architecturally compliant” and actually interoperable.
