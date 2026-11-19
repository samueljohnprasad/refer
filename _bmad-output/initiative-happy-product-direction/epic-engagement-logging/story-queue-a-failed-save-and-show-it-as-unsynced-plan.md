---
title: 'Queue a failed save and show it as unsynced'
type: 'feature'
ticket: '6'
created: '2026-11-16'
status: 'built'
baseline_revision: '4edcd5ebce422cef296a278aef82c6441de63cef'
route: 'full'
route_source: 'auto'
risk: 'medium'
review: 'quick'
review_source: 'pinned'
lenses_ran: ['quick']
review_loop_iteration: 0
context: ['_bmad-output/initiative-happy-product-direction/architecture-engagement-logging/architecture-engagement-logging.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** A failed Thought Catcher write is swallowed, so the saved card says "Saved" for work that never reached the server, and the entry is lost once the sitting ends.

**Approach:** A failed or user-less write goes to a device outbox keyed by entry id and is replayed when the app next comes to the foreground with a signed-in user. The saved card gets `sync: 'synced' | 'queued'`; queued shows the unsynced line and no count or ring.

## Boundaries & Constraints

**Always:** AD-26: outbox in AsyncStorage under `@happy/thought_catcher_outbox_v1`, in `src/domains/thoughtCatcher/data`, holding `{ id, payload }` items; a later payload for the same id replaces the earlier; never cleared by time. Replay goes through `useExerciseMutation().save`, on app start with a user and on every foreground (`AppState` becomes `active`) with a user, one item at a time, in order. An item is removed only after its save succeeds, and only if the stored payload is still the one replayed. A failed replay leaves the item and stops the run. A successful direct save removes any queued item for that id. With no user id the write is queued, not dropped. The practice-completion ack runs only after a successful save and does not queue. `counts` (ring, lifetime) are hidden while `sync` is `queued`; they move only after `usePracticeCounts` refetches, which `useExerciseMutation`'s existing invalidation does on replay. The queued entry stays in the local reflection cache (`saveThoughtCatcherReflection` keeps running), so Home treats it as saved today. The unsynced line is the existing `thoughtCatcher.saved.unsynced` key through `t()`, shown on every variant. The paused draft is cleared after the rung-3 write is saved or queued, since the outbox now holds the text.

**Never:** No outbox for other exercises. No new keys, dependency, test or commit. No change to the draft restore, rung derivation, hard-entry rule, variants, or Home. No retry timer, backoff or banner; foreground is the only trigger.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Online save | Trap answered or fair thought saved | Row written, card `synced`, counts shown | None |
| Offline save | Write throws | Payload queued, card `queued` with unsynced line, no counts | Swallowed |
| Guest save | No user id | Payload queued, card `queued` | None |
| Rung 2 then 3 offline | Two writes, same id | One outbox item, the rung-3 payload | None |
| Replay | App foregrounds, user present, items queued | Rows upserted by id, items removed, counts refetch once | Failure keeps the item, run stops |
| Replay overlaps a new write | Same id re-queued during replay | New payload kept | None |
| Storage fails | AsyncStorage throws | Nothing queued; card still `queued` | Swallowed |

</frozen-after-approval>

## Code Map

- `src/domains/thoughtCatcher/data/outbox.ts` (new) -- `queueSave(id, payload)`, `readOutbox()`, `dropQueued(id, payload?)`; try/catch like `introSeen.ts`; `ExerciseSavePayload` from `@/src/types/exerciseFlow`.
- `src/domains/thoughtCatcher/ui/containers/useOutboxReplay.ts` (new) -- `useAuth` user, `useExerciseMutation().save`, effect on user id plus `AppState` `active`; in-flight guard ref.
- `src/components/layout/RootLayoutNav.tsx:~99` -- add an `OutboxReplayIntegration` component beside `AuthStateLogger`, render inside `AuthProvider` (needs QueryClient and auth).
- `ThoughtCatcherContainer.tsx:161-187` -- `onTrap` and `saveFair` share a `persist(payload)`: save then `dropQueued`, else `queueSave`; `sync` state; `saveFair` clears the draft after persist either way; ack only when saved. Pass `sync` to the view.
- `ThoughtCatcherView.tsx:200` -- pass `sync`; `counts` only when synced.
- `SavedEntryCard.tsx` -- `sync?: 'synced' | 'queued'`; when queued render `t('thoughtCatcher.saved.unsynced')` in place of the practices row.
- Reuse: `useExerciseMutation` (invalidates `practice_counts`, `week_showed_up`), `saveReflection.ts` unchanged. Do not touch: `buildEntryPayload.ts`, `pausedEntry.ts`, `reflectionsStorage.ts`.

## Tasks & Acceptance

**Execution:**
- [ ] `outbox.ts` -- queue, read, drop
- [ ] `useOutboxReplay.ts`, `RootLayoutNav.tsx` -- replay on start and foreground
- [ ] `ThoughtCatcherContainer.tsx` -- `persist`, `sync`, ack after success, draft clear
- [ ] `ThoughtCatcherView.tsx`, `SavedEntryCard.tsx` -- unsynced line, counts hidden when queued

**Acceptance Criteria:**
- Given the network is off, when a catch is saved, then the card shows the unsynced line, no count, and the entry is in the outbox and the local reflection cache.
- Given a queued entry and the network restored, when the app foregrounds with a user, then one row exists, the outbox is empty, and the count rises once.
- Given a queued rung-2 entry and a later rung-3 write for the same id, when checked, then the outbox holds one item, the rung-3 payload.
- Given the app builds, when `npx tsc --noEmit` runs, then no new error appears in touched files.

## Implementation Notes

## Plan Change Log

## Review Triage Log

Pass 1 (quick lens): 0 high, 3 medium patched, 1 deferred, 4 rejected. No loopback.

| Finding | Verdict | Route | Evidence |
|---|---|---|---|
| Draft cleared on reopen while the rung-2 write sits in the outbox | medium | patch | Mount effect now keeps the draft when the id is still queued. |
| Summary shows synced counts before the write is acknowledged | medium | patch | `sync` starts `pending` and `persist` sets it; counts show only when `synced`. |
| Outbox read-modify-write could erase a payload queued during a replay drop | medium | patch | `queueSave` and `dropQueued` run through one promise chain. |
| Outbox not scoped to a user | medium | defer | Guest-to-account replay is the intended flow; scoping needs a product call. |
| Replay can land a stale rung-2 upsert after a direct rung-3 save | low | rejected | Narrow window and the fix needs cross-hook coordination. |
| Permanent failure stalls the queue | low | rejected | The ticket mandates stop-on-failure. |
| Failed storage write still clears the draft | low | rejected | Matches the "Storage fails" matrix row. |
| No completion ack for queued starter-path entries | low | rejected | The plan says the ack does not queue. |

## Verification

**Commands:**
- `npx tsc --noEmit -p . 2>&1 | grep -E 'thoughtCatcher|ThoughtCatcher|RootLayoutNav|SavedEntry'` -- expected: no output for touched files

**Manual checks (no device available):** save with the network off, then restore it and foreground the app.
