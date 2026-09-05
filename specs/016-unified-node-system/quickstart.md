# Quickstart Validation Guide: Unified Journey Map Node System

**Feature**: 016-unified-node-system | **Date**: 2026-09-04

Use this guide to verify the feature works end-to-end on the iOS simulator.

---

## Prerequisites

- Expo dev client built and running: `npm run ios`
- Supabase seeded with at least one unit containing all four node types (lesson, checkpoint, chest, milestone).
- iOS simulator: iPhone 16 Pro (iOS 26).

---

## Validation Scenarios

### 1. Glance test — all four node types visible on path

**Steps**:
1. Navigate to the Journey Map screen.
2. Scroll the path to find a lesson node, a checkpoint node, a chest node, and a milestone node.

**Expected**:
- Lesson: circular ellipse shape, Feather/FA5 icon (book or per config).
- Checkpoint: hexagonal polygon silhouette, shield icon.
- Chest: chest profile SVG silhouette, gift icon (unclaimed) or open-chest icon (claimed).
- Milestone: rosette silhouette, award icon.
- Zero emoji characters in any node.
- All four shapes belong visually to the same family (same depth/shadow language, same size footprint).

---

### 2. State styling — all five states correct

**Steps**: Arrange the journey so each state is visible for the same node type (lesson works well).

| State | Expected fill | Indicator |
|-------|--------------|-----------|
| `locked` | Muted sage/grey | Lock icon in place of type icon |
| `available` | Sage mid | None |
| `current` | Sage strong | Pulsing progress ring |
| `completed` | Sage dark | Check icon overlay |
| `claimed` (chest) | Sage dark | Open-chest icon |

---

### 3. Press animation parity

**Steps**: Tap-and-hold each of the four node types.

**Expected**: Every type depresses by the same depth (~6dp) and springs back with the same timing. No type feels noticeably lighter or heavier.

---

### 4. Checkpoint action sheet

**Steps**:
1. Tap an available checkpoint node.

**Expected**:
- A native iOS bottom sheet appears from the bottom (NOT a full-screen push).
- Sheet shows: activity title, "Checkpoint · N questions · ~M min", and a single **Start** button.
- Tapping outside the sheet dismisses it; map remains visible.
- Tapping Start navigates to the checkpoint activity.
- Tapping a completed checkpoint shows a **Review** button instead of Start.

---

### 5. Chest claim — optimistic update

**Steps**:
1. Tap an unclaimed chest node.
2. Observe the chest open animation.
3. Claim the reward.

**Expected**:
- Chest transitions to opened/claimed visual state immediately on claim tap (optimistic).
- After network sync (allow 2–3 seconds), state remains claimed.
- Re-tap the claimed chest: compact panel confirms claimed state; no second reward.

**Failure rollback test** (dev only — disable network):
1. Enable Airplane Mode.
2. Tap and claim the chest.
3. Re-enable network.

**Expected**: Chest reverts to unclaimed state after rollback (next render cycle).

---

### 6. Locked node tap feedback

**Steps**: Tap a locked node of any type.

**Expected**: Node does not navigate. A brief Rigid haptic fires. No sheet or reveal appears.

---

### 7. VoiceOver labels

**Steps**:
1. Enable VoiceOver (Settings → Accessibility → VoiceOver).
2. Tap each node type in each accessible state.

**Expected**: VoiceOver reads: `"[TypeName], [StateName]"` — e.g. `"Checkpoint, available"`, `"Lesson, completed"`, `"Chest, locked"`, `"Milestone, current"`.

---

### 8. Reduce Motion

**Steps**:
1. Enable Reduce Motion (Settings → Accessibility → Motion).
2. Navigate to the Journey Map and tap nodes.

**Expected**: No scale/spring animation on press. Shapes, icons, and state indicators all visible. Short opacity transition on tap.

---

### 9. TypeScript

```bash
npx tsc --noEmit
```

**Expected**: Zero type errors.

---

## Reference

- Component contract: [contracts/node-component.md](./contracts/node-component.md)
- Data model: [data-model.md](./data-model.md)
- Implementation requirements: [spec.md](./spec.md) FR-001–FR-016
