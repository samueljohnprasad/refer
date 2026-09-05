# Feature Specification: Unified Journey Map Node System

**Feature Branch**: `016-unified-node-system`

**Created**: 2026-09-04

**Status**: Draft

## Overview

The journey map currently renders four visually unrelated node types — lesson circles, orange/yellow rounded squares with emoji for checkpoints and trophies, and a chest node — that feel like separate UI widgets pasted onto the path rather than one coherent family. This feature replaces all four with a single unified node component whose **type** controls shape and icon, and whose **state** controls colour and emphasis. The winding dotted path, press animation, depth language, and palette remain unchanged. Emoji are removed entirely in favour of a consistent vector icon language.

---

## Clarifications

### Session 2026-09-04
- Q: How should the chest reward claim handle network latency? (FR-007) → A: Optimistic update: transition to claimed state immediately and sync in background.
- Q: How should the compact attached action panel for checkpoints be rendered? (FR-006) → A: swift ui modal
- Q: Should interacting with map nodes trigger haptic feedback? → A: Haptics on all node taps (light) AND success haptics for claims/starts.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Learner reads the path at a glance (Priority: P1)

A learner opens the Journey Map and immediately understands which nodes are lessons, which are checkpoints, which are reward chests, and which is the unit milestone — without reading any labels.

**Why this priority**: Legibility at a glance is the foundation of the gamified map. If node types are visually ambiguous the learner cannot orient themselves.

**Independent Test**: Build only the node visual variants (no press behaviour changes). Navigate to the Journey Map and verify each node type is visually distinct yet clearly belongs to the same family.

**Acceptance Scenarios**:

1. **Given** a journey with a lesson, checkpoint, chest, and milestone node, **When** the learner views the map, **Then** each node has a distinct silhouette (circle / hexagon / chest profile / rosette) and a matching vector icon with no emoji visible.
2. **Given** a locked node of any type, **When** the learner views the map, **Then** that node shows its type silhouette with muted sage/grey fill and a lock icon.
3. **Given** a completed node of any type, **When** the learner views the map, **Then** the node shows its type silhouette with a sage completed fill and a small check indicator, consistent across lesson, checkpoint, and milestone.

---

### User Story 2 — Learner taps a checkpoint node and sees a compact action (Priority: P2)

A learner taps an available checkpoint node. A compact panel appears attached to the node showing the activity name, question count, duration estimate, and a Start button. No full-screen modal opens.

**Why this priority**: Checkpoints are a path action, not a modal event. Apple HIG: one prominent action per state. The compact attachment keeps the learner oriented on the map.

**Independent Test**: Tap a checkpoint node in isolation. Verify the attached action panel appears with a Start button and dismisses correctly without navigating away.

**Acceptance Scenarios**:

1. **Given** an available checkpoint node, **When** the learner taps it, **Then** a compact panel attached to the node appears showing "Checkpoint · N questions · ~M min" and a single Start button.
2. **Given** the compact panel is visible, **When** the learner taps Start, **Then** the checkpoint activity launches.
3. **Given** the compact panel is visible, **When** the learner taps outside or dismisses, **Then** the panel closes and the map returns to idle.
4. **Given** a completed checkpoint node, **When** the learner taps it, **Then** a compact panel shows completion state with a review/replay option.

---

### User Story 3 — Learner taps a chest node and sees an in-place reward reveal (Priority: P2)

A learner taps a closed chest node (available, unclaimed). The chest animates open in place. The reward content appears. After claiming, the chest node remains on the path in a permanently opened/claimed state.

**Why this priority**: The chest is the most interactive special node. Its reveal moment is a deliberate reward beat, distinct from lesson nodes.

**Independent Test**: Tap a chest node end-to-end: tap → open animation → reward panel → claim → claimed state persists after panel closes.

**Acceptance Scenarios**:

1. **Given** an unclaimed available chest node, **When** the learner taps it, **Then** the chest plays an open animation in place and a reward panel appears.
2. **Given** the reward panel is open, **When** the learner claims the reward, **Then** the chest node transitions to an opened/claimed visual on the path.
3. **Given** an already-claimed chest node, **When** the learner taps it, **Then** a compact panel confirms the claimed state — no second reward is granted.
4. **Given** a locked chest node, **When** the learner taps it, **Then** a brief message explains it unlocks with progress.

---

### User Story 4 — Milestone node connects to Course Complete medal language (Priority: P3)

The unit milestone node uses a rosette/medal silhouette and icon that visually connects to the medal badge used on the Course Complete screen, creating one coherent milestone language throughout the app.

**Why this priority**: Visual consistency between the map node and the completion screen reinforces that finishing a unit is a meaningful milestone.

**Independent Test**: Place the Journey Map (milestone node visible) and Course Complete screen side-by-side. Verify medal/rosette visual language is consistent in shape family, icon treatment, and colour.

**Acceptance Scenarios**:

1. **Given** a completed unit milestone, **When** the learner views the node, **Then** it shows a filled rosette/medal shape in sage that visually matches the Course Complete screen icon family.
2. **Given** an available (current) milestone node, **When** the learner taps it, **Then** a compact panel shows unit summary and a Continue button.

---

### User Story 5 — Consistent footprint, tap target, and press animation (Priority: P1)

Every node type uses the same bounding box, tap target, depth/shadow treatment, and spring press animation. Only shape and icon differ by type; only fill and indicator differ by state.

**Why this priority**: This is the foundational rule. Violating it makes the path feel assembled from mismatched parts.

**Independent Test**: Tap rapidly across all four node types. Verify identical press depth, spring rebound, and tap target size. Verify no node type causes noticeably more cell height than others.

**Acceptance Scenarios**:

1. **Given** any node type in any state, **When** the learner taps and holds, **Then** the node depresses by the same depth and springs back with the same animation as all other types.
2. **Given** a chest node with slightly wider silhouette, **When** rendered on the path, **Then** cell height and path spacing are unchanged.
3. **Given** a milestone node, **When** rendered on the path, **Then** it is at most 10–15% larger in diameter than a lesson node and does not disrupt the scroll rhythm.

---

### Edge Cases

- What happens if a node type has no icon in the icon library? → Renders a simple geometric fallback (●, ◆) rather than an emoji; emits a console warning.
- What happens when an unknown node `type` value is passed? → Renders as lesson (default) and emits a console warning.
- What happens if a chest node is tapped while its open animation is playing? → Input is debounced; second tap is ignored until animation completes.
- How does a locked node communicate its state to screen readers? → Accessibility label format: "[Type], locked", e.g. "Checkpoint, locked".
- What happens with Reduce Motion enabled? → Scale/spring animations replaced with instant opacity transitions; shapes and icons remain visible.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The journey map MUST render all node types — lesson, checkpoint, chest, milestone — using a single shared node component that accepts `type` and `state` props.
- **FR-002**: The `type` prop MUST control silhouette shape and icon only. Accepted values: `lesson`, `checkpoint`, `chest`, `milestone`.
- **FR-003**: The `state` prop MUST control fill colour, emphasis, and indicator treatment only. Accepted values: `locked`, `available`, `current`, `completed`, `claimed` (chest only).
- **FR-004**: Emoji MUST NOT appear anywhere in node rendering. All iconography MUST use vector icons from the app's existing icon library at consistent size and stroke weight.
- **FR-005**: Every node type MUST share identical overall footprint (bounding box), tap target (minimum 48 × 48 pt), depth/shadow treatment, and spring press animation parameters.
- **FR-006**: Checkpoint nodes MUST show a compact action panel on tap containing: activity name, question count, estimated duration, and a single Start action. This MUST be implemented as a native SwiftUI modal (via `@expo/ui/swift-ui`) rather than a JS-based bottom sheet or full-screen modal.
- **FR-007**: Chest nodes MUST animate open in-place when tapped while unclaimed and available. Claiming the reward MUST use optimistic UI (transitioning to the permanently opened/claimed visual state immediately while syncing in the background).
- **FR-008**: Milestone nodes MUST use a rosette or medal silhouette and icon that shares the visual language of the medal/badge on the Course Complete screen.
- **FR-009**: Locked nodes of every type MUST show the type silhouette with muted sage/grey fill and a lock icon substituted for the type icon.
- **FR-010**: Completed nodes (except chest, which uses `claimed`) MUST show the type silhouette with sage completed fill and a small check indicator.
- **FR-011**: Node colour MUST come exclusively from the existing palette: forest/sage (active/current), sage-muted (completed/supportive), cream/neutral (reward/milestone neutral), muted-sage/grey (locked). Orange MUST NOT be used for any node type.
- **FR-012**: The winding dotted path, path spacing, cell heights, and map scroll behaviour MUST remain unchanged.
- **FR-013**: When Reduce Motion is enabled, scale and spring animations MUST be replaced with short opacity transitions. All shapes, icons, and state indicators MUST remain visible.
- **FR-014**: All nodes MUST provide accurate VoiceOver accessibility labels: "[Type], [State]", e.g. "Checkpoint, available".
- **FR-015**: Chest nodes MUST debounce rapid taps during the open animation to prevent double-claim.
- **FR-016**: Node interactions MUST trigger a light haptic feedback on press down, and a success haptic when claiming a chest or starting a checkpoint.

### Key Entities

- **Node**: A single interactive element on the journey path. Props: `type` (lesson | checkpoint | chest | milestone), `state` (locked | available | current | completed | claimed), `id`, `index`.
- **NodeType**: Enum controlling silhouette shape and icon only.
- **NodeState**: Enum controlling fill colour, depth emphasis, and indicator only.
- **AttachedActionPanel**: A compact contextual overlay anchored to a node, showing activity metadata and a primary action. Used by checkpoint, milestone, and claimed chest nodes.
- **ChestRevealAnimation**: The in-place animation triggered when an unclaimed chest node is tapped.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time user can correctly identify all four node types by silhouette and icon alone (without labels) at ≥ 80% accuracy in informal usability observation.
- **SC-002**: All node types produce the same press depth and spring rebound within ±5%, verifiable by visual inspection in iOS simulator slow-motion.
- **SC-003**: Zero emoji characters appear on the journey map node layer after the change ships.
- **SC-004**: The journey map scrolls at 60 fps with all node types rendered on a supported device.
- **SC-005**: Checkpoint compact action panels appear and dismiss without triggering any full-screen navigation event.
- **SC-006**: Chest reward claim completes correctly (reward granted, node transitions to claimed) in ≥ 99% of interactions with no double-claim.
- **SC-007**: VoiceOver reads correct type and state for every node type, verified by manual VoiceOver walkthrough.

---

## Assumptions

- The existing `DuolingoSvgNodeButton` / `AnimatedNodeButton` spring config and depth values are the correct reference for all node types.
- The existing icon library (Feather, FontAwesome5) already contains suitable icons for lesson (book), checkpoint (shield or target), chest (gift/box), and milestone (award/medal). Custom SVG silhouette outlines for rosette/hexagon shapes may be needed, but icons remain from the existing family.
- Node cell height and path geometry are not changing; the chest silhouette width stays within the existing cell footprint without forcing a path layout recalculation.
- The compact attached action panel for checkpoints replaces whatever current tap behaviour exists for checkpoint nodes; no new bottom-sheet library is introduced.
- "Slightly larger" for milestone nodes means at most 10–15% larger diameter than a lesson node.
- The Course Complete screen medal/badge visual (established in spec 014) is the reference for milestone node iconography.
- No new third-party dependencies. All shapes and icons use existing libraries plus possible custom SVG paths inlined in the component.
- iOS 26+ only per the constitution. No Android-specific handling.
- Existing node view-model hooks (`useJourneyNodeCellViewModel`, `useChestNodeViewModel`) are the correct foundation to extend — not replace.
