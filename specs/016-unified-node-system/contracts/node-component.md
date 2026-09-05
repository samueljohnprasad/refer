# UI Contract: `<Node />` Component

**Feature**: 016-unified-node-system | **Date**: 2026-09-04

This document defines the public interface of the unified `Node` component and the `CheckpointActionSheet` component. These are the contracts that the `JourneyNodeCell` presenter and the journey map screen must satisfy.

---

## `<Node />` Component

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `NodeType` | ✅ | Drives shape + icon. `lesson` \| `checkpoint` \| `chest` \| `milestone` |
| `state` | `NodeState` | ✅ | Drives colour + indicator. `locked` \| `available` \| `current` \| `completed` \| `claimed` |
| `id` | `string` | ✅ | Unique node identifier |
| `index` | `number` | ✅ | Zero-based position on path (for a11y) |
| `position` | `NodePosition` | ✅ | `{ x: number; y: number }` absolute on-path coords |
| `size` | `number` | ✅ | Node diameter in dp. Min 48. |
| `label` | `string?` | — | Tooltip label — shown only when `state === 'current'` |
| `onPress` | `(node: PathNodeData) => void` | ✅ | Called on every interactive tap. Caller routes by type. |
| `accessibilityLabel` | `string` | ✅ | VoiceOver label. Format: `"[TypeName], [StateName]"` |

### Behaviour Contracts

1. **Shape by type**: `lesson` → circle ellipse, `checkpoint` → hexagon polygon, `chest` → chest SVG path, `milestone` → rosette SVG path.
2. **Colour by state**: see `NodeColorConfig` in data-model. `faceColor`, `rimColor`, `iconColor` all derived from `state` prop.
3. **Icon by type**: When `state !== 'locked'` → type icon. When `state === 'locked'` → lock icon regardless of type.
4. **Indicator by state**: `completed` → check icon overlay. `current` → progress pulse ring. `claimed` → open-chest icon.
5. **Haptics**: Light impact on every `onPressIn`. Success notification on claim/start (triggered by caller after action).
6. **Press animation**: Same spring config as `DuolingoSvgNodeButton` (inherited via `useNodeViewModel`). Depth: 6dp.
7. **Accessibility**: `accessibilityRole="button"`, `accessibilityState={{ disabled: state === 'locked' }}`.
8. **Reduce Motion**: When `AccessibilityInfo.isReduceMotionEnabled()`, skip spring animation; use instant opacity transition.
9. **Emoji**: Zero emoji in any rendered output. All icons via Feather or FontAwesome5 vector icons.

### Non-goals (explicitly out of scope)

- The `Node` component does NOT manage the chest reveal sheet. `onPress` is called and the parent (`JourneyNodeCell` / `JourneyMapController`) opens the chest sheet.
- The `Node` component does NOT know about navigation. `onPress` passes `PathNodeData` to the parent to route.

---

## `<CheckpointActionSheet />` Component

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `isPresented` | `boolean` | ✅ | Controls SwiftUI sheet visibility |
| `onIsPresentedChange` | `(v: boolean) => void` | ✅ | Called when user dismisses sheet |
| `data` | `CheckpointActionSheetData \| null` | ✅ | Sheet content. Null = empty sheet. |
| `onStart` | `() => void` | ✅ | Called when learner taps Start button |
| `onReview` | `() => void` | ✅ | Called when learner taps Review (completed state) |

### Behaviour Contracts

1. Renders a native `@expo/ui/swift-ui` `BottomSheet` with `fitToContents={true}`.
2. When `data.isCompleted === false`: shows Start button, no Review button.
3. When `data.isCompleted === true`: shows Review button, no Start button.
4. Sheet displays: activity title, `"Checkpoint · N questions · ~M min"` metadata, single primary CTA.
5. Tapping outside the sheet calls `onIsPresentedChange(false)`.
6. No full-screen navigation occurs inside this component.

---

## `NodeState` Enum (new)

```ts
enum NodeState {
  LOCKED    = 'locked',
  AVAILABLE = 'available',
  CURRENT   = 'current',
  COMPLETED = 'completed',
  CLAIMED   = 'claimed',   // chest only
}
```

---

## `NodeType` Enum (updated)

```ts
enum NodeType {
  LESSON      = 'lesson',
  CHECKPOINT  = 'checkpoint',
  CHEST       = 'chest',
  MILESTONE   = 'milestone',  // replaces TROPHY = 'trophy'
}
```

> **Breaking rename**: All `NodeType.TROPHY` → `NodeType.MILESTONE`. All string value references `'trophy'` → `'milestone'`. Update data-layer config and Supabase journey templates accordingly.
