# Data Model: Unified Journey Map Node System

**Feature**: 016-unified-node-system | **Date**: 2026-09-04

---

## Entities

### `NodeType` (enum — extended)

Controls silhouette shape and icon. Does **not** affect colour or emphasis.

| Value | Shape | Icon (Feather/FA5) | Notes |
|-------|-------|--------------------|-------|
| `lesson` | Circle (Ellipse) | Per `item.icon` from config | Existing behaviour |
| `checkpoint` | Hexagon (Polygon) | `shield-alt` (FA5) | Replaces orange rounded square + emoji |
| `chest` | Chest profile (SVG Path) | `gift` (Feather) / custom | Existing ChestNode shape |
| `milestone` | Rosette (SVG Path) | `award` (Feather) | Renames `trophy`; matches Course Complete badge |

> **Rename**: `NodeType.TROPHY` → `NodeType.MILESTONE`. One-step migration in `enums.ts` and all callsites. No backward-compat alias.

---

### `NodeState` (enum — NEW)

Controls fill colour, depth emphasis, and indicator. Does **not** affect shape or icon.

| Value | Fill | Indicator | Interactive |
|-------|------|-----------|-------------|
| `locked` | Muted sage/grey (`SAGE[100]`) | Lock icon | No |
| `available` | Sage mid (`SAGE[300]`) | None | Yes |
| `current` | Sage strong (`SAGE[500]`) | Pulse ring | Yes |
| `completed` | Sage dark (`SAGE[700]`) | Check icon | Yes (review) |
| `claimed` | Sage dark (`SAGE[700]`) | Open-chest icon | Yes (review) |

> **`claimed` is chest-only.** Non-chest nodes cannot enter `claimed` state.

> `NodeStatus` (existing) maps to `NodeState` as: `LOCKED→locked`, `ACTIVE→current`, `COMPLETED→completed/claimed`. Existing `NodeStatus` enum retained for data layer; `NodeState` is the UI-layer concept.

---

### `Node` (component props interface)

```ts
interface NodeProps {
  type: NodeType;            // shape + icon
  state: NodeState;          // colour + indicator
  id: string;                // from JourneyNode.id
  index: number;             // from JourneyNode.globalIndex
  position: NodePosition;    // { x, y } — absolute position on path
  size: number;              // from JourneySettings.defaultNodeSize (default 64dp)
  label?: string;            // tooltip label for current node
  onPress: (node: PathNodeData) => void;
  accessibilityLabel: string; // required — "[Type], [State]"
}
```

---

### `CheckpointActionSheetData` (new — passed to SwiftUI sheet)

```ts
interface CheckpointActionSheetData {
  nodeId: string;
  title: string;         // activity name
  questionCount: number;
  estimatedMinutes: number;
  isCompleted: boolean;  // drives review vs start CTA
}
```

---

### `NodeShapeConfig` (module-level constants, not runtime entities)

Pre-computed at module scope (never inside render):

```ts
const NODE_SHAPES: Record<NodeType, {
  viewBox: string;
  pathD: string;         // SVG path string
  iconName: string;      // Feather or FA5 icon name
}>;
```

---

### `NodeColorConfig` (derived from NodeState)

```ts
const NODE_COLORS_BY_STATE: Record<NodeState, {
  faceColor: ColorValue;   // SEMANTIC_COLORS or SAGE palette
  rimColor: ColorValue;
  iconColor: ColorValue;
}>;
```

---

## State Transitions

```
Chest node:
  locked → (progress unlocks) → available → (tap) → [ChestReveal] → claimed
  claimed → (tap) → [compact review panel] (no state change)

Lesson / Checkpoint / Milestone:
  locked → (progress unlocks) → available → current → (complete) → completed
  completed → (tap) → [compact review panel] (no state change)
```

---

## Validation Rules

- `type=chest` is the only type that may reach `state=claimed`. All others: `completed` is terminal.
- `state=current` is only valid for ONE node per journey map render (the active node).
- `accessibilityLabel` MUST be non-empty for every rendered `Node`.
- `size` must be ≥ 48 (minimum tap target).
- `CheckpointActionSheetData.questionCount` must be ≥ 1.
