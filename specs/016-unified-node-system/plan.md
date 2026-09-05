# Implementation Plan: Unified Journey Map Node System

**Branch**: `016-unified-node-system` | **Date**: 2026-09-04 | **Spec**: [spec.md](./spec.md)

## Summary

Replace four visually inconsistent journey map node components (`DuolingoSvgNodeButton` for lessons/checkpoints, `ChestNode`, `TrophyNode`) with a single unified `<Node type state />` component family. Type controls silhouette shape (SVG Path) and icon; state controls colour and indicator. Emoji removed. Checkpoint action panel implemented as a native SwiftUI sheet (`@expo/ui/swift-ui`). Chest claim uses optimistic Redux update with Supabase rollback.

---

## Technical Context

**Language/Version**: TypeScript 5.x / React Native 0.79 / Expo SDK 56

**Primary Dependencies**:
- `react-native-svg` 15.15.4 — inline SVG silhouettes (hexagon, shield, rosette). No new library needed.
- `@expo/ui/swift-ui` — `BottomSheet` for checkpoint action panel. Requires `<Host>` wrapper. `fitToContents={true}` auto-sizes.
- `react-native-reanimated` 3.x — press depth spring animation (inherit from `DuolingoSvgNodeButton` config).
- `expo-haptics` — `ImpactFeedbackStyle.Light` on tap, `NotificationFeedbackType.Success` on claim/start. Must call via `runOnJS` inside worklets.
- Redux Toolkit (`journeySlice`) — optimistic state for chest claim with snapshot-rollback.
- `@expo/vector-icons` (Feather / FontAwesome5) — vector icons inside nodes.

**Storage**: Supabase `user_node_progress` table. Chest claim → optimistic local update → `supabase.upsert().select()` — rollback if `error` or `data.length === 0` (handles silent RLS).

**Testing**: Manual iOS simulator walkthrough per `quickstart.md`. `npx tsc --noEmit` for types.

**Target Platform**: iOS 26+ only.

**Project Type**: React Native mobile app (Expo Router).

**Performance Goals**: 60 fps map scroll with 10–20 nodes rendered. SVG path strings memoized outside render.

**Constraints**: No new third-party dependencies. `DynamicColorIOS` (`SEMANTIC_COLORS`) values passed directly as `fill` props on SVG elements — not via Tailwind class strings.

**Scale/Scope**: 4 node types × 5 states = 20 visual variants max. One shared component, one shared hook.

---

## Constitution Check

| Principle | Gate | Status |
|-----------|------|--------|
| I — One Learning Job Per Exercise | Node taps navigate to one exercise or show one panel. | ✅ PASS |
| II — One Active Decision at a Time | Tapping a node reveals exactly one panel/action. | ✅ PASS |
| III — Resumable State | Chest claimed state persists via Supabase; optimistic UI rolls back on failure. | ✅ PASS |
| IV — Internal Buttons Update; Only Final Continue Advances | Node tap opens panel or reveal — does not advance course route. | ✅ PASS |
| V — Private Data | Node state stores only IDs, enums, booleans. No therapeutic text in progress records. | ✅ PASS |
| VI — Premium Design | Emoji removed. Sage/forest palette. SVG silhouettes. Reduce Motion supported. | ✅ PASS |
| VII — Ponytail (YAGNI) | Extending existing hooks, no new abstractions without need. No new dependencies. | ✅ PASS |

**No violations.**

---

## Project Structure

### Documentation (this feature)

```text
specs/016-unified-node-system/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── node-component.md
└── tasks.md             # Phase 2 output (speckit-tasks)
```

### Source Code (repository root)

```text
src/domains/journey/
├── ui/
│   ├── components/
│   │   ├── Node.tsx                      ← NEW: unified node view (replaces 3 components)
│   │   ├── NodeShapes.tsx                ← NEW: SVG silhouette paths (circle/hexagon/shield/rosette)
│   │   ├── CheckpointActionSheet.tsx     ← NEW: @expo/ui SwiftUI BottomSheet for checkpoint
│   │   ├── JourneyNodeCell.tsx           ← MODIFIED: dispatch to <Node> instead of 3 separate
│   │   ├── ChestNode.tsx                 ← MODIFIED: uses Node internally; chest reveal logic stays
│   │   ├── TrophyNode.tsx                ← REPLACED: inline into Node milestone variant
│   │   ├── AnimatedNodeButton.tsx        ← UNCHANGED: reference spring config
│   │   └── DuolingoSvgNodeButton.tsx     ← UNCHANGED: kept for lesson/checkpoint (extended)
│   └── hooks/
│       ├── useNodeViewModel.ts           ← NEW: unified state→visual map (type+state→shape,color,icon)
│       ├── useJourneyNodeCellViewModel.ts ← MODIFIED: delegates to useNodeViewModel
│       └── useChestNodeViewModel.ts      ← MODIFIED: optimistic claim + rollback
├── state/
│   └── journeySlice.ts                   ← MODIFIED: add optimisticSetNodeStatus action
└── types/
    └── journey/
        └── enums.ts                      ← MODIFIED: NodeType.TROPHY → NodeType.MILESTONE; add NodeState enum
```

**Structure Decision**: Single React Native mobile project. Feature spans the existing `src/domains/journey/` domain folder. No new top-level directories. All new files co-located with existing journey components and hooks.

---

## Complexity Tracking

> No constitution violations. Section not required.
