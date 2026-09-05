# Tasks: Unified Journey Map Node System

**Branch**: `016-unified-node-system` | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

No test tasks generated (not requested in spec).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend enums and constants that every subsequent task depends on.

- [x] T001 Rename `NodeType.TROPHY` → `NodeType.MILESTONE` (value `'milestone'`) and add `NodeState` enum (`locked | available | current | completed | claimed`) in `src/types/journey/enums.ts`
- [x] T002 Add `NodeState` to barrel export in `src/types/journey/index.ts`
- [x] T003 [P] Update `FONTAWESOME_MAP` in `src/domains/journey/ui/components/JourneyNodeCell.tsx` to include `milestone` key (`award` icon) and remove `trophy` key
- [x] T004 [P] Update `src/data/journey/constants.ts` — rename `NODE_SIZE.chest` entries that reference trophy/chest; add `NODE_SHAPES` module-level constant object with pre-computed SVG path strings for `hexagon`, `shield`, and `rosette` silhouettes (viewBox `0 0 100 100`)

**Checkpoint**: `npx tsc --noEmit` passes. `NodeType.MILESTONE` and `NodeState` are importable across the codebase.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core unified hook and shape module that all node component variants depend on.

- [x] T005 Create `src/domains/journey/ui/hooks/useNodeViewModel.ts` — maps `(type: NodeType, state: NodeState, isDark: boolean)` → `{ faceColor, rimColor, iconColor, iconName, shapeKey, isInteractive, indicator }`. Replaces scattered color logic from `useJourneyNodeCellViewModel`. Must accept `ColorValue` (not just `string`) for all color outputs.
- [x] T006 Create `src/domains/journey/ui/components/NodeShapes.tsx` — exports `<NodeSilhouette type={NodeType} size={number} fill={ColorValue} rim={ColorValue} />`. Uses `react-native-svg` `<Ellipse>` for `lesson`, `<Polygon>` for `checkpoint` hexagon, and inline `<Path>` constants for `chest` and `milestone` rosette. All path strings pulled from `NODE_SHAPES` constants (T004). Wrap in `React.memo`.
- [x] T007 Add `optimisticSetNodeStatus` action to `src/domains/journey/state/journeySlice.ts` (or wherever the journey Redux slice lives) — payload: `{ nodeId: string; status: NodeState }`. Snapshot-based rollback pattern per `research.md`.

**Checkpoint**: `npx tsc --noEmit` passes. `useNodeViewModel` and `NodeShapes` can be imported and rendered in a standalone test screen.

---

## Phase 3: User Story 1 + 5 — Map Legibility & Consistent Footprint (Priority: P1) 🎯 MVP

**Goal**: All four node types render on the journey map with distinct silhouettes, correct state colours, vector icons only (no emoji), and identical press depth/animation.

**Independent Test**: Navigate the Journey Map. Every node type visible. Zero emoji. Press each — identical spring depth. All VoiceOver labels correct. `npx tsc --noEmit` clean.

### Implementation

- [x] T008 [US1] Create `src/domains/journey/ui/components/Node.tsx` — unified presentational component accepting `NodeProps` (see contract). Composes `<NodeSilhouette>` from T006 for shape, `<FontAwesome5>` / `<Feather>` icon from `useNodeViewModel` (T005), lock icon override when `state==='locked'`, check overlay when `state==='completed'`, open-chest icon when `state==='claimed'`. Wraps `DuolingoSvgNodeButton` press mechanics (inherit spring config). `React.memo`. Max 150 lines.
- [x] T009 [US1] Add haptics to `Node.tsx` — `Haptics.impactAsync(ImpactFeedbackStyle.Light)` via `runOnJS` on `onPressIn`; `Haptics.impactAsync(ImpactFeedbackStyle.Rigid)` for locked tap (no navigation).
- [x] T010 [US1] Update `src/domains/journey/ui/hooks/useJourneyNodeCellViewModel.ts` — delegate all colour/icon logic to `useNodeViewModel` (T005). Remove the inline `if (status === COMPLETED)` / `if (status === ACTIVE)` colour blocks. Map existing `NodeStatus` → `NodeState` inside this hook (LOCKED→locked, ACTIVE→current, COMPLETED→completed/claimed).
- [x] T011 [US1] Update `src/domains/journey/ui/components/JourneyNodeCell.tsx` dispatch — replace `ChestNode` / `TrophyNode` / `DuolingoSvgNodeButton` branching (lines ~168-172) with `<Node type={item.type} state={nodeState} ... />` for all types. Keep `ChestNode` internally used by `Node` for chest-specific reveal animation only.
- [x] T012 [P] [US1] Update `TrophyNode.tsx` — remove amber hardcoded colour (`#FEF3C7`) and 🏆 emoji. Refactor to delegate rendering to `<Node type={NodeType.MILESTONE} ... />`. If file becomes a thin wrapper under 20 lines, inline it into `JourneyNodeCell.tsx` and delete the file.
- [x] T013 [P] [US1] Update `ChestNode.tsx` — remove 🔒, ✅, 🎁 emoji (lines ~73-74). Replace with Feather `lock`, `check`, `gift` icon components. Keep shake/shine animation logic unchanged.
- [x] T014 [US1] Update `useChestNodeViewModel.ts` — after successful claim, dispatch `optimisticSetNodeStatus` (T007) with `claimed`. Remove any remaining event-object passthrough to Reanimated worklet (already partially fixed; verify clean).
- [x] T015 [P] [US1] Add `accessibilityLabel` prop wiring throughout — ensure every `<Node>` render in `JourneyNodeCell.tsx` passes `accessibilityLabel` in format `"[TypeName], [StateName]"` using a helper `nodeA11yLabel(type, state): string` in `src/domains/journey/ui/utils/nodeA11yLabel.ts`.
- [x] T016 [US1] Add Reduce Motion support to `Node.tsx` — call `AccessibilityInfo.isReduceMotionEnabled()` (or use `useAccessibilityInfo` hook); when true, skip spring scale animation and substitute a short opacity fade. Shape and icons remain fully visible.

**Checkpoint**: Journey Map renders all four types with correct silhouettes, zero emoji, consistent press animation, correct VoiceOver labels.

---

## Phase 4: User Story 2 — Checkpoint Action Sheet (Priority: P2)

**Goal**: Tapping an available checkpoint node presents a native SwiftUI compact sheet with activity name, question count, duration, and a Start (or Review) button.

**Independent Test**: Tap a checkpoint node → SwiftUI sheet appears without full-screen navigation. Tap Start → checkpoint launches. Tap outside → sheet dismisses. Completed checkpoint → Review button shown.

### Implementation

- [x] T017 [US2] Create `src/domains/journey/ui/components/CheckpointActionSheet.tsx` — `@expo/ui/swift-ui` `BottomSheet` with `isPresented` + `fitToContents={true}`. Renders title, `"Checkpoint · N questions · ~M min"` metadata, and a single primary `Button` (Start or Review based on `data.isCompleted`). Wraps children in `<Host>`. Max 80 lines.
- [x] T018 [US2] Create `src/domains/journey/ui/hooks/useCheckpointSheet.ts` — manages `isOpen: boolean` state and `sheetData: CheckpointActionSheetData | null`. Exposes `openSheet(node: PathNodeData)` and `closeSheet()`. Extracts question count + duration from node's task config.
- [x] T019 [US2] Wire `CheckpointActionSheet` into `src/domains/journey/ui/screens/JourneyMapScreen.tsx` (or equivalent container) — mount sheet at screen level (not inside `FlashList` item). Connect `onStart` → existing checkpoint navigation handler. Add `Haptics.notificationAsync(NotificationFeedbackType.Success)` on Start tap.
- [x] T020 [US2] Update `handleNodePress` in `src/domains/journey/ui/hooks/useJourneyMapController.tsx` — for `NodeType.CHECKPOINT`, call `openSheet(node)` instead of current behaviour. Keep existing lesson navigation path unchanged.

**Checkpoint**: Checkpoint sheet opens natively without any full-screen push. Dismiss works. Start navigates.

---

## Phase 5: User Story 3 — Chest In-Place Reveal + Optimistic Claim (Priority: P2)

**Goal**: Unclaimed chest animates open in place. Claim transitions immediately to claimed state (optimistic). Claimed tap shows compact review panel with no re-claim.

**Independent Test**: Tap unclaimed chest → open animation plays → reward panel appears → claim → chest node shows claimed state. Re-tap → review panel only, no reward. Airplane Mode test → claimed state rolls back.

### Implementation

- [x] T021 [US3] Refactor `useChestNodeViewModel.ts` — integrate `claimChest` thunk that dispatches `optimisticSetNodeStatus({ nodeId, status: 'claimed' })` immediately, then calls `supabase.from('user_node_progress').upsert({ node_id, status: 'claimed' }).select()`. Rollback if `error` or `data.length === 0`. Attach mutation timestamp to guard against stale rollbacks.
- [x] T022 [US3] Update `ChestNode.tsx` / `ChestNodeView` — on successful in-place open animation complete, call `onClaimReward()` which triggers the thunk (T021). Add `Haptics.notificationAsync(NotificationFeedbackType.Success)` on claim success.
- [x] T023 [US3] Debounce chest tap — add `isAnimating` ref in `useChestNodeViewModel.ts`; while `true`, ignore subsequent taps. Set `false` after animation completes. (FR-015)
- [x] T024 [US3] Already-claimed chest — when `state === 'claimed'`, chest tap shows a compact inline panel or brief toast confirming claimed status. No bottom sheet needed; a `Pressable` + `MotiView` fade-in label suffices.

**Checkpoint**: Full chest flow works end-to-end. Optimistic update confirmed. Rollback verified in Airplane Mode.

---

## Phase 6: User Story 4 — Milestone Node Visual Language (Priority: P3)

**Goal**: Milestone node (replaces trophy) uses rosette/medal silhouette matching the Course Complete screen. Completed milestone shows filled rosette in sage.

**Independent Test**: Milestone node on the map visually matches the Feather `award` icon family used on the Course Complete screen. Side-by-side comparison shows same icon language.

### Implementation

- [x] T025 [P] [US4] Verify / update `NodeShapes.tsx` (T006) rosette `<Path>` — confirm the rosette SVG path used for `NodeType.MILESTONE` matches the `Feather` `award` silhouette used in `CourseFinaleScreen.tsx`. Adjust bezier path if needed for visual consistency.
- [x] T026 [US4] Update milestone tap behaviour in `handleNodePress` (`useJourneyMapController.tsx`) — for `NodeType.MILESTONE` with `state=available/current`, open a compact panel (reuse `CheckpointActionSheet` pattern with `data.isCompleted=false`) showing unit summary and a Continue button. For `state=completed`, show a compact review summary.

**Checkpoint**: Milestone node rosette matches Course Complete badge family. Tap opens compact summary panel.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Finalise, clean up deprecated code, run full quickstart validation.

- [x] T027 [P] Delete `TrophyNode.tsx` if fully inlined in T012. Remove import from `JourneyNodeCell.tsx` and any barrel exports.
- [x] T028 [P] Search codebase for remaining `NodeType.TROPHY` / `'trophy'` string literals (`grep -r "TROPHY\|'trophy'" src/`) — update all callsites to `NodeType.MILESTONE` / `'milestone'`. Update any Supabase journey template seed data if `type` field stored as string.
- [x] T029 Remove `NODE_COLORS.active` green `#58CC02` and `NODE_COLORS.completed` yellow `#FFC800` from `src/data/journey/constants.ts` if no longer referenced (orange checkpoint colour elimination — FR-011).
- [x] T030 [P] Run `npx tsc --noEmit` — fix all residual type errors from enum rename and new `NodeState` type.
- [x] T031 Run full `quickstart.md` validation on iOS simulator — glance test, state styling, press parity, checkpoint sheet, chest claim, milestone, VoiceOver, Reduce Motion.

**Checkpoint**: All quickstart scenarios pass. Zero emoji on journey map. `tsc --noEmit` clean.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion. **Blocks all user story phases.**
- **Phase 3 (US1+US5)**: Depends on Phase 2. No other story dependencies.
- **Phase 4 (US2)**: Depends on Phase 2. Can run in parallel with Phase 3 after T005 done.
- **Phase 5 (US3)**: Depends on Phase 2 + T007 (optimistic action). Can run in parallel with Phase 3/4.
- **Phase 6 (US4)**: Depends on Phase 2 + T006 (NodeShapes). Can run in parallel with Phase 3/4/5.
- **Phase 7 (Polish)**: Depends on all prior phases.

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1+US5 (P1) | Phase 2 | US2, US3, US4 |
| US2 (P2) | Phase 2, T005 | US1, US3, US4 |
| US3 (P2) | Phase 2, T007 | US1, US2, US4 |
| US4 (P3) | Phase 2, T006, T025 deps on US1 | After US1 shape confirmed |

### Subagent Dispatches

Once Phase 1 and Phase 2 (Foundational) are complete, the work can be heavily parallelized using subagents. Group the tasks into the following independent dispatches:

**Dispatch 1: US1 Core Component & Shapes (UI Focus)**
- **Tasks**: T006, T008, T009, T016
- **Prompt**: "Implement the unified `Node.tsx` component and `NodeShapes.tsx` SVGs. Ensure it accepts `NodeProps` (type, state) and applies haptics and Reduce Motion. Do not wire it into the map cell yet."

**Dispatch 2: US2 Checkpoint Action Sheet (Feature Focus)**
- **Tasks**: T017, T018, T019, T020
- **Prompt**: "Implement the `CheckpointActionSheet` using `@expo/ui/swift-ui`. Create the view model hook and wire it into the JourneyMapController so tapping a checkpoint opens the native sheet instead of navigating."

**Dispatch 3: US3 Chest Optimistic Claim (State Focus)**
- **Tasks**: T007, T021, T022, T023
- **Prompt**: "Implement the optimistic UI chest claim flow. Add `optimisticSetNodeStatus` to `journeySlice`. Update `useChestNodeViewModel` to dispatch it, sync with Supabase, and rollback on failure. Wire the chest open animation to trigger the claim."

**Dispatch 4: US1 Wiring & US4 Milestone (Integration Focus - runs after Dispatch 1)**
- **Tasks**: T010, T011, T012, T013, T015, T025, T026
- **Prompt**: "Update `useJourneyNodeCellViewModel` to use the new `useNodeViewModel`. Refactor `JourneyNodeCell` to dispatch to the unified `<Node>` component. Remove emoji from `ChestNode`, delete `TrophyNode`, and wire up milestone node routing."

---

## Implementation Strategy

### MVP First (US1 — Map Legibility)

1. Phase 1: Setup (T001–T004)
2. Phase 2: Foundational (T005–T007)
3. Phase 3: US1 (T008–T016)
4. **STOP + VALIDATE**: Run glance test, press parity, VoiceOver in simulator.
5. Ship US1 as standalone increment.

### Incremental Delivery

1. MVP (US1) → visually unified map with correct shapes, no emoji.
2. Add US2 (checkpoint sheet) → native iOS sheet on checkpoint tap.
3. Add US3 (chest optimistic claim) → reward flow with rollback.
4. Add US4 (milestone polish) → rosette language consistency.
5. Phase 7 Polish → cleanup and full validation.

---

## Notes

- `[P]` = task touches different files from siblings; safe to run in parallel.
- `[US#]` maps to user story from spec.md.
- All colour values passed as `ColorValue` (`string | OpaqueColorValue`) — never interpolated into Tailwind class strings.
- `DynamicColorIOS` from `SEMANTIC_COLORS` passed as SVG `fill` prop directly.
- Haptics inside Reanimated gesture handlers → always via `runOnJS`.
- No new third-party dependencies introduced.
