# Adversarial Convergence Review — Happy Product Direction Architecture

## Verdict

**NOT YET CONVERGENT.** The spine has a strong direction and closes several
obvious ownership failures, but it still permits independently built units to
produce incompatible durable states while claiming compliance with every AD.
The remaining holes are not cosmetic: they can strand anonymous work, advance
the wrong path, count different evidence, expose sensitive material, or make a
rollback/deletion claim that is not true.

This review uses the current spine only. Each finding constructs two units one
level down that can both follow the written rules. The pair is therefore a
convergence test, not a claim that both implementations already exist.

## Identity, session, and recovery

### 1. Identity readiness has no session incarnation

**Anchor:** AD-1, line 41; AD-8, line 83.

**Unit A — auth listener:** emits `identity_ready` after the observed session's
user and profile are hydrated. **Unit B — replay gate:** caches readiness and
releases queued work after it sees a hydrated user, while a later auth event
replaces the current session.

Both expose the named readiness states, wait for `identity_ready`, and obey the
monotonic state machine within a session. The spine does not require a session
incarnation, auth-event sequence, or invalidation rule for a readiness signal
that races with sign-out, token refresh, provider linking, or a new anonymous
session.

**Consequence:** work created for user A can be replayed after the UI has
transitioned to user B, or an old `identity_ready` event can unblock reads for
the wrong Supabase user.

**Guard:** bind every readiness result, cache, and replay batch to an immutable
session incarnation and auth-event sequence; invalidate it on sign-out,
provider mismatch, and user-id change.

### 2. Anonymous-auth unavailability has two legal product modes

**Anchor:** AD-1, line 41; Operational Envelope, line 177.

**Unit A — session bootstrap:** if anonymous auth is unavailable, blocks the
loop and asks the user to sign in before any durable work. **Unit B — draft
bootstrap:** permits a local-only draft session and converts it later when a
Supabase user becomes available.

Both satisfy “when anonymous auth is available,” keep durable rows keyed by a
Supabase UUID, and can keep local-only content unsynced. No contract selects a
fail-closed behavior or defines conversion of a local-only draft.

**Consequence:** the same outage or misconfigured environment produces either
a blocked product or work that cannot be safely attached to an identity.

**Guard:** choose and name the unsupported-auth behavior. If local-only drafts
remain allowed, define their temporary identity, encryption, conversion,
expiry, and explicit user-confirmed attachment path.

### 3. Account linking is not single-flight or replayable by operation id

**Anchor:** AD-1, line 41; AD-3, line 53.

**Unit A — provider linker:** reuses one `operation_id` for a repeated link
attempt and returns the stored terminal result. **Unit B — auth screen:** starts
a fresh provider operation after cancellation or timeout and treats each
result independently.

Both return the exact status union and required IDs, preserve the anonymous
identity on normal success, and expose `retryable` only for
`retryable_failure`. The operation ID is not defined as an idempotency key, nor
is there a concurrency rule for two link attempts for one anonymous user.

**Consequence:** two valid attempts can race into different terminal states;
replay may resume after the first success while the UI is showing the second
attempt's recovery or cancellation result.

**Guard:** make linking single-flight per anonymous user/provider identity,
define operation-id reuse and terminal-state replay, and require a serialized
server transition for link, cancel, retry, and recovery.

### 4. Existing-account recovery has no data disposition contract

**Anchor:** AD-1, line 41; AD-8, line 83.

**Unit A — recovery flow:** lets the user sign into the existing account and
continues there, leaving anonymous rows attached to the anonymous user. **Unit
B — recovery flow:** offers an explicit, user-confirmed copy of selected
anonymous work into the existing account.

Both stop on provider conflict and avoid silent merge, replacement, or delete.
The spine requires an explicit recovery path but does not define whether
anonymous content is retained, exported, copied, abandoned, or later linked.

**Consequence:** two clients can make different privacy and data-loss promises
after the same conflict, and replay can either remain permanently paused or
create a second copy.

**Guard:** define the allowed recovery outcomes, user confirmation point,
source/target ownership, copy idempotency, retention of the anonymous source,
and cancellation behavior.

## Canonical models and mutation boundaries

### 5. `PracticeCompletionV1` has no canonical shape or lifecycle

**Anchor:** AD-2, line 47; AD-3, line 53; ownership matrix, line 121.

**Unit A — course adapter:** exposes `{ practice_session_id, source_id,
completed_at, path_id, path_version, step_id }` and treats completion as a
terminal projection row. **Unit B — exercise adapter:** exposes
`{ practice_session_id, source_id, status, completed_at, attempt_count }` and
derives path fields only at read time.

Both use Practice ownership, a normalized projection, stable session identity,
idempotent completion, and no ad-hoc raw-store joins. The named type does not
fix required fields, nullable fields, status transitions, timestamps, or
whether the projection is a durable table, event, view, or adapter.

**Consequence:** Journey, Journal, and Insights can consume different meanings
of “completed,” especially when one source lacks path context or is retried.

**Guard:** publish the required `PracticeCompletionV1` fields, status machine,
source namespace, terminal timestamp, persistence location, and one read/write
boundary.

### 6. v5 required-response resolution is not executable enough

**Anchor:** AD-2, line 47.

**Unit A — completion evaluator:** considers a submitted response complete when
the current required text field is non-empty. **Unit B — completion evaluator:**
requires every required response in the node schema and rejects responses from
an older attempt.

Both use `user_node_responses`, require a submitted record, and invoke a
“required-response resolution.” The rule does not define required-field
selection, empty/null semantics, attempt selection, response revision, or
schema version used for resolution.

**Consequence:** the same node can qualify for the path handoff and insight
evidence in one implementation but remain incomplete in the other.

**Guard:** make required-response resolution a versioned Journey contract with
explicit field, attempt, revision, and invalidation semantics.

### 7. Source IDs and idempotency keys have no shared namespace

**Anchor:** AD-2, line 47; AD-3, line 53; AD-5, line 65.

**Unit A — projection:** uses the raw `node_response.id` or `exercise_entries.id`
as `source_id` and the client mutation key as the idempotency key. **Unit B —
projection:** uses a typed composite such as `course_node:<node_id>:<session_id>`
and scopes the idempotency key to the owner boundary.

Both use stable source records, a stable `practice_session_id`, and deduplicate
retries. The spine does not define source-ID namespaces, key scope, payload
conflict behavior, or whether the same client key may be reused across domains.

**Consequence:** a course response and standalone entry can collide or fail to
deduplicate, producing duplicate completion and observation rows.

**Guard:** define typed source identity, idempotency-key scope, uniqueness
constraints, and the result returned when a key is reused with a different
payload.

### 8. Legacy cutover is not an immutable cohort boundary

**Anchor:** AD-2, line 47; AD-9, line 89; Deferred, line 201.

**Unit A — Journey adapter:** treats rows created before a timestamp as legacy
and reads them through the compatibility adapter. **Unit B — migration adapter:**
uses a per-row backfill marker and reads any unmarked row as legacy.

Both keep legacy models read-only, forbid new initiative writes, and can report
a verified backfill. The spine does not define the cutover marker, conflict
precedence when both models contain a logical record, or the mapping from old
IDs to canonical IDs.

**Consequence:** resume and completion can select different versions of one
journey or journal record during rollout; a later adapter removal can strand
rows that were technically “verified.”

**Guard:** define one immutable cutover/cohort marker, canonical ID mapping,
duplicate precedence, backfill manifest, and reader behavior for unmapped rows.

### 9. Legacy direct-call exceptions are not an enforceable allowlist

**Anchor:** AD-3, line 53; AD-9, line 89.

**Unit A — feature team:** treats an existing direct Supabase hook as a named
legacy exception because it predates the initiative. **Unit B — feature team:**
wraps the same call in a new hook and treats it as a new owner boundary.

Both can claim an owning epic and a future retirement gate. The spine does not
name the exception inventory, owner, expiration/cutover state, or check that
prevents a new caller from reusing the old path.

**Consequence:** two durable write paths remain active for the same entity while
each team believes AD-3/AD-9 are satisfied.

**Guard:** maintain a finite, versioned legacy allowlist with owner, entity,
read/write status, expiry gate, and CI/review enforcement for new callers.

## StarterPath state and event convergence

### 10. Path-version resolution and retirement are underspecified

**Anchor:** AD-4, line 59; Deferred, line 200.

**Unit A — Journey reader:** resolves `path_id/path_version` from a bundled
immutable catalog. **Unit B — Journey reader:** resolves the same pair from a
server registry and returns a current replacement when the old version is
retired.

Both treat Journey as path/version authority and preserve progress by the
versioned key. The spine does not define the registry shape, missing-version
state, retirement behavior, or whether a replacement is allowed to alter an
existing progress row.

**Consequence:** one client resumes an old lesson while another silently moves
the user to a new path, invalidating `next_action` and lineage.

**Guard:** define immutable path-version records, availability states, missing
version behavior, and an explicit migration command for any replacement.

### 11. `PathStepCompletedV1` has no ordering or transition proof

**Anchor:** AD-4, line 59.

**Unit A — Journey consumer:** applies serialized events in arrival order.
**Unit B — Journey consumer:** applies them by `occurred_at`, rejecting an
event that appears older than the stored progress timestamp.

Both deduplicate event IDs and idempotency keys, preserve unselected path
versions, and let only Journey update `next_action`. The event has
`causation_id` but no per-path sequence, expected revision, legal transition
table, or stale-event rule.

**Consequence:** an out-of-order retry can regress `last_completed_step`, skip
a step, or make `next_action` disagree with the durable completion history.

**Guard:** add a per-path sequence or expected revision and define legal state
transitions, stale-event rejection, and recovery for gaps.

### 12. Event emission can be lost after completion acknowledgement

**Anchor:** AD-3, line 53; AD-4, line 59; Operational Envelope, lines 178–183.

**Unit A — Practice boundary:** commits completion and a transactional outbox
record before returning `completed`. **Unit B — Practice boundary:** commits
completion, returns `completed`, and publishes `PathStepCompletedV1` through an
asynchronous queue.

Both have one Practice write path, return an explicit completion result, and
emit the named event. The spine does not require an outbox, delivery guarantee,
acknowledgement, retry policy, dead-letter state, or event replay source.

**Consequence:** the user sees a saved completed practice but Journey never
advances, or a retry advances it twice through differently keyed deliveries.

**Guard:** define transactional event publication, at-least-once delivery,
consumer acknowledgement, dead-letter/replay behavior, and the user-visible
state while next-action projection is pending.

### 13. Active-path pointer and progress row are not declared one transaction

**Anchor:** AD-4, line 59; ownership matrix, line 122.

**Unit A — path mutation:** updates `user_preferences.active_path_id` and the
path-progress row in one Postgres transaction. **Unit B — path mutation:** uses
the Journey serializer but performs the pointer update and progress update as
two acknowledged repository calls.

Both keep Journey as the only owner and use compare-and-swap on `revision`.
CAS on the progress row does not make the pointer and row atomic.

**Consequence:** a crash or retry can leave an active path with no matching
progress, or progress pointing at a path that is no longer active.

**Guard:** define the atomic unit, transaction boundary, and recovery invariant
for the pointer plus every affected `StarterPathProgressV1` row.

### 14. Completion of an in-flight practice after a path switch is ambiguous

**Anchor:** AD-4, line 59; AD-8, line 83.

**Unit A — practice runtime:** binds the session to the path version captured at
start; after a switch, completion updates the old path's preserved progress.
**Unit B — practice runtime:** allows completion only for the currently active
path and moves the user to the new path after a switch.

Both include path/version/session data in the event, preserve unselected path
progress, and do not overwrite the active pointer from Practice. The spine does
not define whether an in-flight session is cancelled, remains attributable to
the old path, or must be re-started.

**Consequence:** the same user action can produce different reflection prompts,
next actions, and evidence keys after switching.

**Guard:** define practice-session path binding, switch behavior for in-flight
work, and the terminal result for a completion against a no-longer-active path.

### 15. Step and target identifiers have no typed namespace

**Anchor:** AD-4, line 59; Consistency Conventions, line 109.

**Unit A — event producer:** puts a course `node_id` in `step_id` for lesson
and practice steps. **Unit B — event producer:** puts `practice_ref.id` in
`step_id` for practice steps and the prompt ID for reflection steps.

Both use the declared `step_kind`, stable IDs, and the closed `next_action`
union. The contract does not define the legal identifier namespace for each
kind or whether `target_id` must equal the step ID.

**Consequence:** Journey can accept a validly shaped event and advance to the
wrong node, or two targets with the same string ID can be rendered as one.

**Guard:** define typed identifiers and a canonical kind-to-target mapping for
every `step_kind`, `next_action.kind`, and `practice_ref.source`.

## Insight evidence and time semantics

### 16. Observation creation trigger is not singular

**Anchor:** AD-2, line 47; AD-5, line 65; ownership matrix, line 124.

**Unit A — Insights projector:** creates the observation when Practice emits a
qualifying completion. **Unit B — Journal projector:** creates it when the
guided `journal_records` plus lineage transaction is acknowledged.

Both use canonical sources, the same `practice_session_id`, the deterministic
observation identity, and at most one observation per family. The spine does
not say which domain event is the authoritative trigger or whether a practice
without a reflection can produce evidence.

**Consequence:** metrics, `observed_at`, and readiness can differ even though
the user completed the same loop; one implementation may count abandoned
reflection flows while the other does not.

**Guard:** name the sole observation producer and trigger, define required
source prerequisites, and make all other domains consume its result.

### 17. The insight-family registry is named but not owned as a contract

**Anchor:** AD-5, line 65; AD-6, line 71.

**Unit A — client implementation:** ships the family registry and deterministic
rules in the app bundle. **Unit B — read-model implementation:** stores the
registry and rule version in Supabase and evaluates it server-side.

Both use a versioned registry, deterministic rules, and schema validation. The
spine does not identify the registry authority, required metric fields,
eligibility semantics, algorithm/output version, or deployment compatibility.

**Consequence:** two clients can label the same observation eligible or produce
different explanations while both claim source transparency.

**Guard:** make one versioned registry authoritative and include each family's
metric schema, eligibility rule, algorithm version, output fields, and rollout
compatibility policy.

### 18. Observation identity canonicalization is not defined

**Anchor:** AD-5, line 65.

**Unit A — projector:** hashes the serialized pair `source_id + insight_family`
with lower-cased strings. **Unit B — projector:** hashes a typed pair preserving
case and uses a database uniqueness constraint on the resulting ID.

Both make `observation_id` deterministic from the named pair and do not create
a second observation for schema version changes. The serialization, separator,
case, encoding, and source namespace are not fixed.

**Consequence:** retries or reprocessing can produce different observation IDs
across units, defeating deduplication and threshold counts.

**Guard:** define a canonical typed serialization and enforce uniqueness on the
logical tuple `(user_id, source_namespace, source_id, insight_family)`.

### 19. Schema-version changes have no rewrite policy

**Anchor:** AD-5, line 65; Consistency Conventions, line 110.

**Unit A — projector:** updates the existing observation in place when the
family schema changes. **Unit B — projector:** preserves the original metrics,
marks it ineligible under the new schema, and only applies the new schema to
future observations.

Both keep one observation ID per source/family and version response meaning.
The spine says `schema_version` does not create a second observation but does
not say whether old observations are transformed, frozen, invalidated, or
recomputed.

**Consequence:** historical readiness changes silently in one implementation
but not the other, and the displayed explanation may no longer match evidence.

**Guard:** define append-only versus in-place projection behavior, migration
functions for each schema version, rebuild scope, and user-visible readiness
change semantics.

### 20. Evidence aggregation scope is not explicit

**Anchor:** AD-5, line 65; evidence-key grammar in AD-5.

**Unit A — readiness calculator:** evaluates thresholds separately for the full
`evidence_key` including `path_version`. **Unit B — readiness calculator:**
aggregates all observations in an `insight_family` and uses `evidence_key` only
to explain the result.

Both retain the path-derived key and do not join raw unrelated records. The
spine does not state whether thresholds are per path, per path version, per
goal, or user-wide within a family.

**Consequence:** switching paths can either correctly isolate evidence or make
an insight appear ready from mixed curricula.

**Guard:** define the exact grouping key used by every readiness threshold and
the allowed relationship between path versions, goals, and family evidence.

### 21. Source edits and deletion have no observation lifecycle

**Anchor:** AD-5, line 65; AD-7, line 77; Operational Envelope, lines 180–183.

**Unit A — observation store:** snapshots structured metrics and keeps the
observation after a journal edit, while deleting it only when the source is
deleted. **Unit B — observation store:** recomputes or retracts the observation
when the journal's mood, lineage, or source status changes.

Both keep Insights read-only and can preserve source transparency. The spine
does not define whether observations are immutable evidence, derived current
state, retractable, or tombstoned.

**Consequence:** users can see a pattern based on content they edited/deleted,
or counts can change without a clear explanation; deletion verification can
pass for the journal but fail for derived evidence.

**Guard:** define source-to-observation lifecycle events, edit/retraction rules,
deletion cascades, tombstone retention, and rebuild behavior.

### 22. Timezone epoch storage does not fix timezone authority or history

**Anchor:** AD-5, line 65; Consistency Conventions, line 110.

**Unit A — time context:** stores an append-only `(timezone_epoch, IANA zone)`
history and uses the observation's epoch. **Unit B — time context:** stores the
current zone plus an incrementing epoch and reconstructs older epochs from
deployment metadata.

Both pin a valid IANA timezone on first observation, increment on explicit
reset, do not rewrite old observations, and calculate half-open UTC windows.
The spine does not define the authoritative timezone source, epoch history
store, or behavior when the historical zone/data version is unavailable.

**Consequence:** the same observation can move between local days after travel
or restore, changing active-day counts and readiness.

**Guard:** persist an immutable timezone record for every epoch, name the
authority and reset command, and define missing-history/data-version behavior.

### 23. The seven-day activity window has two legal meanings

**Anchor:** AD-5, line 65.

**Unit A — activity calculator:** uses the exact 168-hour interval ending at the
current UTC instant. **Unit B — activity calculator:** uses seven user-local
calendar dates and converts their midnights to UTC.

Both implement a rolling seven-day window and can use the half-open convention
specified for insight windows. Only the 30-day pattern rule explicitly names
user-local calendar days.

**Consequence:** a completion around midnight can unlock the activity summary
in one implementation and leave it insufficient in the other.

**Guard:** define the interval type, clock instant, timezone, and inclusive or
exclusive boundary for each threshold separately.

### 24. Observation time and ingestion time are interchangeable in practice

**Anchor:** AD-5, line 65; Operational Envelope, line 178.

**Unit A — projector:** sets `observed_at` from the user action's trusted
`occurred_at`. **Unit B — projector:** sets it from server insertion time when
the event is retried or backfilled.

Both store ISO UTC timestamps, deduplicate retries, and can calculate valid
windows. The contract does not define the clock source, allowable skew, or
whether delayed/backfilled evidence uses original activity time.

**Consequence:** offline completion and migration can qualify in different
rolling windows and produce different dated insights.

**Guard:** define event-time provenance, server validation/skew handling, and
the timestamp used for backfill, deletion, and threshold evaluation.

### 25. `metrics` has no privacy classification or allowlist

**Anchor:** AD-5, line 65; AD-6, line 71; AD-7, line 77.

**Unit A — observation producer:** stores only allowlisted categorical codes
and numeric aggregates in `metrics`. **Unit B — observation producer:** stores
normalized phrases, token lists, or content fingerprints derived from the
private reflection because the family schema validates them.

Both use deterministic processing, keep raw text out of analytics, and expose
only the observation to Insights. The spine validates shape but does not define
which metric values are sensitive or forbid private-content derivatives in the
read model.

**Consequence:** a “read-only” insight table becomes a durable sensitive-content
copy accessible to more consumers than the journal.

**Guard:** make each family schema an explicit privacy allowlist; forbid raw
text, audio, photos, prompts, embeddings, reversible fingerprints, and
health-adjacent free text in observations and insight caches.

### 26. Read-model freshness and post-write consistency are undefined

**Anchor:** AD-3, line 53; AD-5, line 65; ownership matrix, line 124.

**Unit A — completion boundary:** writes the completion and observation/readiness
projection before returning success. **Unit B — completion boundary:** returns
success after the canonical completion only; an asynchronous Insights worker
updates readiness later.

Both acknowledge durable completion, keep Insights read-only, and can invalidate
the named caches. The spine does not define projection lag, freshness state,
read-after-write behavior, or what post-practice feedback may claim before
projection completion.

**Consequence:** the user can see a completed practice with insufficient data,
or a stale pattern, immediately after crossing a threshold.

**Guard:** define projection freshness/version fields, cache invalidation and
reconciliation, and the UI contract for “completion saved, insight pending.”

## Reflection lineage and privacy boundaries

### 27. `ReflectionContextV1` physical representation and uniqueness are open

**Anchor:** AD-7, line 77; ownership matrix, line 123.

**Unit A — Journal repository:** stores the context columns directly on
`journal_records` with one guided row per journal record. **Unit B — Journal
repository:** stores a separate one-to-one lineage table keyed by
`journal_record_id`.

Both carry every named `ReflectionContextV1` field, make Journal the owner,
acknowledge parent and lineage atomically, and distinguish standalone source.
The spine does not fix the canonical physical shape, uniqueness constraint,
immutability, prompt/schema version relationship, or conflict behavior for two
contexts referencing one journal row.

**Consequence:** a guided reflection can be retrieved as standalone by one
consumer, or two practices can claim one reflection in another.

**Guard:** define the canonical lineage store, one-to-one constraint,
immutable-field rules, prompt/version mapping, and duplicate-resolution policy.

### 28. Aggregate acknowledgement levels are not named

**Anchor:** AD-3, line 53; AD-7, line 77; AD-8, line 83.

**Unit A — Journal boundary:** reports `saved` after `journal_records` and
lineage commit; `journal_ai` and `moods` are later children. **Unit B — Journal
boundary:** reports `saved` only after structured mood data and AI child rows
are acknowledged because its Insight projector depends on them.

Both obey the required atomic parent/lineage write and keep asynchronous
children out of evidence until acknowledged. “Saved” is not defined as parent
saved, aggregate saved, or evidence eligible.

**Consequence:** replay, UI state, and Insights disagree about whether the same
reflection is complete, and retries can duplicate children.

**Guard:** define separate acknowledgement states and idempotency scopes for
canonical reflection saved, child processing complete, and evidence eligible.

### 29. Server-side ownership enforcement allows a confused-deputy split

**Anchor:** AD-1, line 41; AD-3, line 53; AD-7, line 77; Consistency
Conventions, line 112.

**Unit A — Edge Function:** derives `user_id` only from the verified JWT and
uses an RLS-scoped client. **Unit B — Edge Function:** accepts `user_id` in the
request body, uses a service-role client, and checks ownership in application
logic.

Both include authenticated context, can preserve `auth.uid()` ownership, and
may be described as privileged server work. The spine does not explicitly
forbid caller-supplied owner IDs, require JWT-derived scoping, or define the
least-privilege exception for service-role access.

**Consequence:** a valid authenticated user can read or mutate another user's
reflection, lineage, evidence, or deletion job if one boundary misses a check.

**Guard:** require owner identity to be derived from the verified session,
prohibit client-selected owner IDs for ordinary mutations, and require an
explicit audited exception for service-role access.

### 30. Local sensitive drafts have no storage or deletion policy

**Anchor:** AD-7, line 77; AD-8, line 83; Operational Envelope, lines 177–182.

**Unit A — replay queue:** stores `UnsyncedOperationV1.payload` in plaintext
local storage and removes it after server acknowledgement. **Unit B — replay
queue:** encrypts the payload, retains acknowledged rows for diagnostics, and
deletes them only during account deletion.

Both keep drafts out of ordinary telemetry, bind them to the current Supabase
UUID, and support acknowledgement/retry/recovery states. The spine does not
define local encryption, device backup exclusion, retention, lock-screen
exposure, or deletion on sign-out/account deletion.

**Consequence:** sensitive reflections can persist in backups or diagnostics
after the server record is deleted, contradicting the privacy promise.

**Guard:** define local sensitive-data storage, retention, backup exclusion,
secure deletion, and the relationship between server deletion and queued
operations.

## Replay, migration, and version behavior

### 31. Replay order is named but dependencies are not representable

**Anchor:** AD-3, line 53; AD-8, line 83.

**Unit A — auth replay worker:** globally FIFO by `(created_at, operation_id)`
and stops the entire batch at the first unresolved operation. **Unit B — domain
replay worker:** preserves creation order per entity and lets unrelated entity
operations continue while waiting for a prerequisite.

Both replay after `identity_ready`, use idempotency keys, stop on an unresolved
dependency in their chosen scope, and expose recovery. `UnsyncedOperationV1`
has no dependency or causation field, and `created_at` has no total-order or
clock rule.

**Consequence:** one queue deadlocks behind a failed draft while another sends a
reflection before its practice/path prerequisite, or equal timestamps replay in
different orders.

**Guard:** add explicit dependency references and a deterministic sequence;
define global versus per-entity scheduling, independent-operation progress, and
the first unresolved dependency behavior.

### 32. Queue acknowledgement does not have an aggregate boundary

**Anchor:** AD-3, line 53; AD-7, line 77; AD-8, line 83.

**Unit A — replay worker:** marks a journal operation acknowledged when the
canonical parent and lineage are accepted. **Unit B — replay worker:** keeps it
pending until the associated path event, child rows, and evidence refresh are
complete.

Both return explicit saved/completed results and keep unsynced content out of
Insights. The spine does not say whether queue acknowledgement means source
durable, cross-domain event published, or all read models current.

**Consequence:** a retry can duplicate a child or event, or a queue can discard
work that another unit still considers necessary.

**Guard:** define per-entity acknowledgement contracts, durable outbox linkage,
replay result states, and which downstream work is deliberately asynchronous.

### 33. Historical backfill eligibility is not a shared decision

**Anchor:** AD-2, line 47; AD-5, line 65; Deferred, lines 201–204.

**Unit A — migration projector:** backfills prior qualifying exercise and
journal rows into `PracticeCompletionV1` and `InsightObservationV1` using their
original timestamps. **Unit B — migration projector:** starts evidence only at
the cutover and treats historical rows as compatibility data.

Both preserve canonical new writes, use deterministic observations, and can
report a verified migration. The spine does not define the historical cutoff,
source eligibility, user notification, timezone epoch for backfilled rows, or
whether old data may unlock a new insight.

**Consequence:** users in two environments see different readiness and the same
release can unlock patterns from data that another release ignores.

**Guard:** define a versioned backfill manifest, eligibility/cutover timestamp,
original-event-time policy, timezone handling, idempotent rerun behavior, and
whether historical evidence is user-visible.

### 34. Contract-version compatibility has no unknown-version rule

**Anchor:** AD-3, line 53; AD-4, line 59; AD-5, line 65; AD-7, line 77; AD-8,
line 83.

**Unit A — boundary:** rejects any unknown `schema_version`, `payload_version`,
or path version into visible recovery. **Unit B — boundary:** transforms older
versions to the latest contract and ignores unknown optional fields.

Both version payloads, use explicit recovery for failures, and can remain
backward-compatible with the released client. No supported-version registry,
forward/backward compatibility policy, or version retirement rule exists.

**Consequence:** a rollout can silently drop lineage or evidence fields, or a
new client can make all old queued work unreplayable.

**Guard:** publish supported-version ranges and transformations per boundary;
define unknown-version behavior, retirement timing, and lossless migration
requirements.

## Operations, release, and deletion

### 35. Build-to-environment identity is not cryptographically bound

**Anchor:** Operational Envelope, lines 177–179; Structural Seed, lines 162–173.

**Unit A — app configuration:** selects the Supabase project from the EAS
profile at build time. **Unit B — app configuration:** selects the project at
runtime from environment variables or remote configuration.

Both can provide local, isolated preview/TestFlight, and protected production
projects and keep provider keys server-side. The spine does not require the
build flavor, Supabase project, analytics destination, and migration ledger to
agree at runtime.

**Consequence:** a preview build can write real user content to production or
send production analytics to a preview project, defeating isolation and
deletion expectations.

**Guard:** bind a signed environment identity to the build and server project;
fail closed on mismatch and expose the environment in non-sensitive health
metadata and release evidence.

### 36. Promotion order lacks a compatibility and cutover protocol

**Anchor:** Operational Envelope, lines 178 and 183; AD-2, line 47.

**Unit A — release pipeline:** applies expand migration, deploys a compatible
function, backfills, flips a feature gate, then contracts after client uptake.
**Unit B — release pipeline:** applies an additive migration and immediately
deploys the new function/client because the migration is technically
backward-compatible.

Both apply migrations before functions and client, use additive changes, and
keep function changes compatible with the currently released client in their
interpretation. The spine does not define readiness markers, minimum client
version, backfill completion, dual-read/dual-write rules, or the contract
between an old client and a new function during partial rollout.

**Consequence:** rollback leaves old clients reading an incomplete projection,
or a function begins relying on a column/backfill that is not ready everywhere.

**Guard:** require an expand/backfill/verify/switch/contract protocol with
machine-checkable markers, client compatibility matrix, and a safe partial-
rollout state.

### 37. Release gates have no authoritative blocking artifact

**Anchor:** Operational Envelope, lines 179–182; Deferred, lines 203–205.

**Unit A — release owner:** records a manual checklist as complete and enables
the feature. **Unit B — domain owner:** treats an environment feature flag as
the gate and enables the same path after local tests pass.

Both can claim to verify migrations, RLS, linking, deletion, thresholds, and
redacted logs because the spine names those release gates. It does not specify
the authority, evidence artifact, approval owner, default-off behavior, or
kill-switch for privacy/safety-dependent capability.

**Consequence:** AI, voice/photo, pattern processing, or a non-redacted legacy
path can ship in one environment despite the stated release block.

**Guard:** define a signed/versioned gate record with named owners, hosted
evidence, feature-flag defaults, and fail-closed behavior for missing or stale
approval.

### 38. Observability event shape and privacy review are not convergent

**Anchor:** AD-3, line 53; AD-7, line 77; Operational Envelope, line 181.

**Unit A — client telemetry:** emits `practice_completed`, `journal_saved`, and
`insight_ready` metadata from UI transitions. **Unit B — server telemetry:**
emits the same semantic events from durable commits and includes source IDs,
error details, and retry state.

Both emit metadata-only events and can redact the named sensitive fields. The
spine does not define the authoritative event producer, schema/version, event
deduplication, allowed identifiers, error redaction, or retention/sampling
policy.

**Consequence:** product metrics count attempted UI actions in one environment
and durable outcomes in another; failure logs can still disclose sensitive
context through unbounded error text.

**Guard:** define versioned metadata event contracts, authoritative emission
points, deduplication IDs, an allowlist for identifiers/error fields, and
retention plus privacy review for telemetry.

### 39. Retention, deletion, backups, and derived evidence have no owner-level
   cascade contract

**Anchor:** AD-7, line 77; Operational Envelope, lines 180–183.

**Unit A — deletion service:** cascades `journal_records`, children, guided
lineage, observations, local queue records, caches, and backup tombstones.
**Unit B — deletion service:** deletes the canonical journal and children but
retains aggregate observations and backup snapshots for operational recovery.

Both can say journal deletion is verified and can keep RLS correct for live
rows. The spine says a data/privacy owner must define behavior but does not
state whether derived evidence, telemetry, backups, and restored copies follow
the same deletion obligation.

**Consequence:** a user can delete a reflection yet retain a reconstructable
pattern or private content in a derived store; restore can resurrect deleted
data.

**Guard:** define one data-lifecycle owner and a deletion graph covering live
rows, derived evidence, caches, queues, telemetry, backups, restore filtering,
and legal/operational retention exceptions.

### 40. Restore consistency is not part of the canonical model

**Anchor:** Operational Envelope, lines 180–183; AD-5, line 65.

**Unit A — restore procedure:** restores canonical source tables first and
rebuilds observations/readiness from source. **Unit B — restore procedure:**
restores source and read-model snapshots together at their backup timestamps.

Both can satisfy “backup and restore behavior is verified” and preserve the
read-only Insights boundary. The spine does not require a common snapshot
boundary, rebuild marker, deletion tombstone replay, or post-restore evidence
recalculation.

**Consequence:** restored users see patterns for deleted reflections, or a
read-model snapshot refers to canonical rows that were not restored.

**Guard:** define restore ordering, snapshot consistency, tombstone handling,
rebuild/version markers, and the user-visible degraded state until projections
are coherent.

## Convergence closure set

Before dependent epics treat this spine as executable, the following contracts
must be made authoritative at the next level down:

1. Session incarnation, anonymous-auth fallback, link single-flight, and
   explicit recovery data disposition.
2. `PracticeCompletionV1` shape, source namespace, required-response resolver,
   status machine, and qualifying event.
3. Legacy cutover markers, canonical ID mappings, direct-call allowlist, and
   historical backfill policy.
4. StarterPath registry, typed step IDs, atomic pointer/progress mutation,
   in-flight switch semantics, event sequencing, and durable event delivery.
5. Insight-family registry, observation identity/version lifecycle, aggregation
   scope, privacy allowlist, source trigger, and projection freshness.
6. Reflection lineage physical contract, acknowledgement levels, server-side
   owner derivation, local sensitive-storage policy, and deletion graph.
7. Replay dependency/order/acknowledgement semantics and supported-version
   compatibility rules.
8. Environment binding, migration promotion protocol, release-gate authority,
   telemetry contracts, and backup/restore/deletion consistency.

The spine should remain unchanged for this review. These are the minimum
convergence guards that downstream units need before independent implementation
can be expected to interoperate.
