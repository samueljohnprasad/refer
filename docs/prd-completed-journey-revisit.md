# PRD: Completed Journey Revisit

## Summary
Create a first-class completed journey revisit flow so users can reopen finished journeys from the catalog, land on the final section/unit/node, browse all sections, and replay activities without restarting the journey.

## Problem
Today completed journeys are not represented as a stable, explicit state. The app mixes active, preview, and completed behavior, which causes:

- flicker between map and catalog
- accidental reopening at section 1
- completed journeys behaving like preview mode
- no clean way to revisit finished content

## Goal
Allow users to intentionally reopen completed journeys and interact with them like a finished, replayable course.

## Success Criteria
- Completed journeys remain visible in catalog.
- Completed journeys use CTA label `Open Journey`.
- Opening a completed journey lands on the final section, final unit, final node.
- Users can manually visit any section of the completed journey.
- Users can tap and redo activities again.
- Replay grants rewards again.
- Canonical journey status remains `completed`.
- No restart flow is shown.
- No flicker or branch bouncing occurs on Journeys tab.

## Non-Goals
- No restart journey flow.
- No reward caps or cooldown logic for replay in this version.
- No replay history UI in this version.
- No separate completion summary screen first flow.

## Functional Behavior

### Catalog / Detail Sheet
- Completed journeys remain listed in the catalog.
- Detail sheet shows completed badge.
- CTA text for completed journeys is `Open Journey`.
- Tapping CTA opens the completed journey in explicit `completed` mode.

### Journeys Tab
- If the user has an active journey, Journeys tab opens that active journey.
- If the user has no active journey, Journeys tab opens catalog.
- A completed journey must only open when the user explicitly selects it from catalog or another future entrypoint.
- Stored `activeSlug` alone must not reopen a completed journey.

### Completed Journey Map
- Open at final section, final unit, final node.
- Show completed journey map, not preview mode.
- Do not synthesize fake active nodes.
- All nodes that were completed canonically remain completed/unlocked.
- All sections remain manually browsable.
- Manual section switching must stay on the chosen section.
- No section auto-advance while browsing completed journey.
- Replaying a node returns to the same completed-journey context afterward.

### Replay Behavior
- User can tap nodes and do activities again.
- Replay grants rewards again.
- Replay must not:
  - change journey status back to `active`
  - reset current progression
  - unlock anything new
  - move canonical section/unit position

## Implementation Changes

### Access Mode
Add an explicit journey access mode across navigation and screen state:

- `active`
- `completed`
- `preview`

This mode must be passed into journey-opening entrypoints and consumed by journey map loading logic.

Recommended navigation params:

- `slug`
- `mode`
- optional `targetSectionNumber`
- optional `focusNodeId`

### Backend
Extend backend journey reads so completed enrollments are first-class.

Required behavior:

- `get_section_map` must support loading completed journeys.
- For completed mode, resolve latest completed enrollment for the slug.
- Default section for completed mode should be final section unless a specific section is requested.
- Response should include:
  - `viewMode`
  - `focusNodeId`
  - enrollment status including `completed`
- Manual section fetches in completed mode must return the requested section without snapping back.

Add a dedicated replay write path for completed journeys.

Recommended RPC:

- `replay_completed_journey_node`

Responsibilities:

- validate node belongs to completed enrollment
- record replay completion and reward grant
- keep canonical journey enrollment unchanged
- return updated reward payload and any replay metadata needed by client

### Data Model
Keep canonical completion in `user_journey_enrollments`.

Add replay support as separate write and audit data rather than mutating canonical progress.

Recommended long-term table:

- `user_node_replays`
  - `id`
  - `user_id`
  - `enrollment_id`
  - `node_id`
  - `completed_at`
  - `reward_payload`
  - `source` or `attempt_type`

This makes future extensions straightforward:

- replay history
- analytics
- daily practice bonuses
- reward throttling
- streak integrations

### Frontend
Update journey detail and catalog flow:

- remove restart behavior
- use `Open Journey` for completed journeys
- open completed journeys with explicit `mode=completed`

Update journey tab branching:

- only active journeys auto-open
- completed journeys do not auto-open from persisted slug
- preview mode remains only for non-enrolled preview access

Update journey map bridge and container:

- completed mode uses `focusNodeId` rather than active-node fallback
- no fake START nodes in completed mode
- no auto-follow to canonical section during manual browsing
- after replay completion, reload same completed context

Update task and replay flow:

- if mode is `completed`, use replay RPC instead of active progression RPC
- on return, preserve completed journey context and current viewed section

## Acceptance Tests
1. Catalog shows a completed journey with `Open Journey`.
2. Opening a completed journey lands on last section, last unit, last node.
3. Completed journey map shows no fake active START state.
4. User can open section 1 from a completed journey and remain on section 1.
5. User can open final section and remain there.
6. User can tap a completed node and replay the activity.
7. Replay grants rewards again.
8. Replay does not reactivate the journey.
9. Replay does not reopen progression from section 1.
10. Journeys tab with no active journey opens catalog stably.
11. Active journey behavior remains unchanged.
12. Preview mode for non-enrolled users remains unchanged.

## Assumptions
- Completed journey CTA label: `Open Journey`
- Replays grant rewards again with no cap in v1
- Completed journeys are explicitly user-opened, not auto-opened by default
- Canonical completion remains immutable after completion
