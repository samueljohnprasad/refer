# Journey Map — Rendering Architecture

## High-Level Overview

The journey map is a **Duolingo-style vertical scrolling path** rendered with a **FlashList segment-per-cell architecture**. Each node owns its own SVG bezier path segment — there is no single giant SVG canvas. Data flows from a Supabase RPC through a lazy-loaded caching pipeline into Jotai atoms, which drive a pre-computed flat list consumed by `@shopify/flash-list`.

---

## Data Flow (End to End)

```
Supabase RPC (get_section_map)
  │
  ▼
useSectionData(slug)          ← lazy-loads one section at a time
  │                              multi-tier cache: in-memory Map → AsyncStorage (24h TTL) → server
  ▼
currentSectionMapAtom         ← Jotai atom holding SectionMapResponse
  │
  ▼
sectionMapBridge              ← converts SectionMapResponse → JourneyState (units + nodes + stats)
  │
  ▼
journeyStateAtom              ← single source of truth for the UI
  │
  ▼
useJourneyFlashList()         ← calls buildJourneyNodes() to produce flat array
  │
  ▼
journeyFlashListAtom          ← pre-computed JourneyFlashListItem[] stored in Jotai
  │
  ▼
JourneyMapFlashList           ← FlashList presentation component
  │
  ▼
JourneyNodeCell / DividerCell / MascotCell   ← heterogeneous cell renderers
```

---

## 1. Data Fetching Layer

### `useSectionData` (`src/hooks/useSectionData.ts`)

Orchestrates the lazy-loaded section map pipeline:

| Step | Source                       | Behavior                                              |
| ---- | ---------------------------- | ----------------------------------------------------- |
| 1    | In-memory `Map` atom         | Instant render. Background refresh if stale (>5 min). |
| 2    | `AsyncStorage` (24h TTL)     | Render cached + background refresh if online.         |
| 3    | Server RPC `get_section_map` | Show skeleton → fetch → render.                       |

**Key state signals:**

- `isLoading` — true on first load (no cached data).
- `isSwitchingSection` — true during section-to-section nav (debounced 300ms).
- `isOfflineFallback` — true when serving from cache while offline.
- `wasVersionInvalidated` — true once when backend template version changed (purges all caches).

**Abort handling:** Each new fetch cancels the previous via `AbortController`.

### `useNodeContent` (`src/hooks/useNodeContent.ts`)

Lazily fetches full JSONB content for a single node **on tap** (not pre-loaded):

| Step | Source                        |
| ---- | ----------------------------- |
| 1    | In-memory `ref` cache         |
| 2    | `AsyncStorage` (24h TTL)      |
| 3    | Server RPC `get_node_content` |

While loading, a semi-transparent overlay with `ActivityIndicator` covers the map.

---

## 2. State Management Layer (Jotai)

### Core Atoms (`src/store/journeyStore.ts`)

| Atom                       | Type                              | Purpose                                                            |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------ |
| `journeyStateAtom`         | `JourneyState`                    | Merged UI state: `{ units, currentUnit, lastActiveNodeId, stats }` |
| `currentSectionMapAtom`    | `SectionMapResponse \| null`      | Raw section map from the API                                       |
| `sectionCacheAtom`         | `Map<string, SectionMapResponse>` | In-memory section cache (keyed `mode:unitNumber`)                  |
| `journeyFlashListAtom`     | `JourneyFlashListItem[]`          | Pre-computed flat array for FlashList                              |
| `activeFlashListIndexAtom` | `number`                          | Derived: index of the active node in the flat list                 |
| `journeyTemplateAtom`      | `JourneyTemplate \| null`         | Cached template metadata                                           |
| `journeyProgressAtom`      | `UserJourneyProgress \| null`     | User progress (legacy, kept for backward compat)                   |
| `activeJourneySlugAtom`    | `string \| null`                  | Currently viewed journey slug                                      |
| `journeyEnrollmentsAtom`   | `JourneyEnrollment[]`             | All user enrollments (for journey switcher)                        |

### Derived Atoms (Read-Only)

| Atom                   | Derives From       | Purpose                                           |
| ---------------------- | ------------------ | ------------------------------------------------- |
| `currentUnitAtom`      | `journeyStateAtom` | Current `UnitData` by index                       |
| `activeNodeAtom`       | `currentUnitAtom`  | First node with `ACTIVE` status                   |
| `journeyStatsAtom`     | `journeyStateAtom` | Stats for the header (streak, wallet, hearts, XP) |
| `completedCountAtom`   | `currentUnitAtom`  | Count of completed nodes in current unit          |
| `unitsAtom`            | `journeyStateAtom` | Full `UnitData[]` array with referential equality |
| `currentUnitIndexAtom` | `journeyStateAtom` | Lightweight subscription for unit index only      |

### Per-Unit Granular Selectors (Performance Fix #9)

- `unitNodesAtomFamily(unitId)` — `selectAtom` that derives one unit's nodes. Prevents cross-unit re-renders.
- `unitDataAtomFamily(unitId)` — Same for full `UnitData`.
- `nodeStatusAtomFamily(nodeId)` — Per-node status from the FlashList atom. Each cell subscribes to only its own status.

### State Actions (`src/store/journeyActions.ts`)

Pure reducer functions: `(state, payload) → newState`:

- **`completeNode(state, nodeId)`** — Marks node as COMPLETED, unlocks next node (or next unit's first node), applies rewards.
- **`updateNodeProgress(state, nodeId, progress)`** — Updates the 0–1 progress ring on the active node.
- **`unlockUnit(state)`** — Sets the next unit's first node to ACTIVE.

### Persistence

- `saveJourneyState(state)` — Debounced (1.5s trailing) write to `AsyncStorage`. Flushed on unmount.
- `cacheSectionMap(slug, unitNumber, data)` — Writes section map envelope with version + timestamp.
- `loadCachedSectionMap(slug, unitNumber, viewMode, expectedVersion?)` — Reads with TTL (24h) and version check.
- `cacheNodeContent(nodeId, data)` / `loadCachedNodeContent(nodeId)` — Per-node content cache with 24h TTL.

---

## 3. Bridge Layer

### `sectionMapBridge` (`src/utils/journey/sectionMapBridge.ts`)

Converts `SectionMapResponse` → `JourneyState` so the entire existing UI works unchanged.

**`sectionMapToJourneyState(response, stats)`** does:

1. Calls `sectionMapToUnitData(response)` to produce `UnitData[]`.
2. For each `NodeStub`, builds a `PathNodeData` via `nodeStubToPathNode()`:
   - Resolves `NodeType` from string via `resolveNodeType()`.
   - Merges progress row (`SectionNodeProgress`) to determine `NodeStatus`.
   - Handles `canInteract` flag: non-interactive sections force `LOCKED`.
   - Handles fallback active: if no explicit `ACTIVE` progress exists, the first interactive node in the enrollment's current unit becomes `ACTIVE`.
   - Resolves icon via `resolveIcon(nodeType, status)`.
3. Determines `currentUnit` index (active unit > focus unit > enrollment position).
4. Returns `{ currentUnit, units, lastActiveNodeId, stats }`.

---

## 4. FlashList Data Pipeline

### `buildJourneyNodes` (`src/utils/journey/buildJourneyNodes.ts`)

**Pure function** — runs once outside React. Takes `BuildJourneyNodesInput` and produces `JourneyFlashListItem[]`.

For each unit (filtered by optional `unitFilter`):

1. **Insert unit divider** (except first unit): `JourneyDividerItem` with configurable height.
2. **For each node**: compute position via `getNodePosition()` (sine-wave zig-zag), build SVG segment via `buildSegmentD()`, produce `JourneyNode`.
3. **Insert mascot bubbles** after configured node indices.

**SVG Segment Building** (`buildSegmentD`):

- Uses `d3-path` to create a cubic bezier in LOCAL cell coordinates (0 → `cellHeight`).
- Control points at vertical midpoint for natural S-curves:
  ```
  M prevX 0
  C prevX midY, thisX midY, thisX cellHeight
  ```
- First node in each unit has an empty `segmentD` (no incoming path).

**Output item types:**

| `itemType`  | Interface            | Purpose                                                                     |
| ----------- | -------------------- | --------------------------------------------------------------------------- |
| `"node"`    | `JourneyNode`        | Pre-computed node with x, y, cellHeight, segmentD, status, variantKey, etc. |
| `"divider"` | `JourneyDividerItem` | Unit separator with title, optional "JUMP HERE" badge                       |
| `"mascot"`  | `JourneyMascotItem`  | Speech bubble placed after specific nodes                                   |

### `useJourneyFlashList` (`src/hooks/useJourneyFlashList.ts`)

Hook that bridges Jotai state → FlashList data:

1. Reads `unitsAtom` and calls `buildJourneyNodes()` via `useMemo`.
2. Pushes result to `journeyFlashListAtom` via `useEffect`.
3. Computes `unitHeaders[]` (Y offsets for sticky header).
4. Derives `activeGlobalIndex` (for path coloring) and `activeNodeY` (for scroll-to-active).

---

## 5. Presentation Layer

### `JourneyMapContainer` (`src/screens/JourneyMapScreen/JourneyMapContainer.tsx`)

**Container component** — no markup except composing the presentation child. Handles:

- Route params (`slug`, `mode`, `jumpToSection`).
- Journey slug change detection → brief transition skeleton.
- Calls `useSectionData()`, `useNodeContent()`, `useJourneyFlashList()`.
- Node press handling via `handleNodePressInner()`:
  - **LOCKED** → toast + haptic.
  - **ACTIVE** → lazy-fetch content → navigate to `/tabs/screens/task/[id]`.
  - **COMPLETED** → lazy-fetch → navigate in review/replay mode.
  - **Chest** nodes → `ChestRewardModal`.
  - **Preview mode gate** → toast if `!canInteract`.
  - **Guest gate (P1.6.1)** → `GuestSignUpSheet` if beyond free node limit.
- Node completion (`handleCompleteNode`):
  - Optimistic local update via `completeNode()` action.
  - Server-side atomic completion via `completeNodeApi()`.
  - Trophy node auto-advance: loads next section after 1.2s delay.
- Interaction lock (400ms debounce) via `useInteractionLock`.
- Auto-scroll to active node on mount/focus and on active node index change.
- Section overview sheet, journey switcher sheet, unit complete modal.

**Render state machine:**

```
loading        → JourneyLoadingSkeleton
hard-error     → JourneyErrorState (no cached data)
fallback-error → JourneyErrorState (sectionMap loaded but no unit)
flash-list     → JourneyMapFlashList
```

### `JourneyMapFlashList` (`src/screens/JourneyMapScreen/JourneyMapFlashList.tsx`)

**Presentation component** — pure, all data via props. Wrapped in `React.memo`.

- `AnimatedFlashList` (Reanimated-animated `FlashList`).
- `overrideItemLayout` provides exact `cellHeight` per item (no measurement thrashing).
- `getItemType` enables cell recycling optimization.
- `renderItem` dispatches to `JourneyNodeCell`, `DividerCell`, or `MascotCell`.
- `StickyUnitHeader` at top (tracks visible unit via `onViewableItemsChanged`).
- `OfflineBanner` + `ScrollToActiveButton` overlays.
- Scroll handler via `useAnimatedScrollHandler` (Reanimated worklet).

### `JourneyNodeCell` (`src/components/journey/JourneyNodeCell.tsx`)

**FlashList cell** — one per node. `React.memo` with aggressive custom comparator.

Each cell renders:

1. **SVG path segment** — `<Svg><Path d={segmentD} />` in local coordinates. Color = active (green) if completed or before active index, inactive (gray) otherwise.
2. **`ConfigDrivenNode`** — absolutely positioned circle at `(x, cellHeight * 0.85)`.

Only re-renders when: status changes, progress ticks, active global index changes, or screen width changes.

---

## 6. Node Interaction & Completion Flow

### User Tap → Node Content → Task Screen

```
User taps node
  │
  ▼
handleNodePress (guarded by useInteractionLock — 400ms debounce)
  │
  ├─ LOCKED → toast + haptic
  ├─ CHEST  → ChestRewardModal
  ├─ ACTIVE/COMPLETED:
  │    │
  │    ▼
  │  fetchNodeContent(nodeId)       ← lazy JSONB fetch with loading overlay
  │    │
  │    ▼
  │  router.push('/tabs/screens/task/[id]')
  │    params: { id, nodeId, journeyMode, journeySlug, returnSectionNumber }
  │
  ▼
TaskScreen
  │
  ▼
handleComplete()
  ├─ Optimistic: setJourneyState(completeNode(prev, nodeId))
  ├─ Server: completeNodeApi({ enrollmentId, nodeId })
  ├─ Refresh: refreshCurrentSection() → fetchSectionMap → update atoms + cache
  └─ router.back()
```

### Node Completion Server Sync

1. **Optimistic update** — `completeNode()` instantly marks the node completed and unlocks the next.
2. **Server call** — `completeNodeApi()` or `replayCompletedNodeApi()` for completed journeys.
3. **Post-completion refresh** — `refreshCurrentSection()` re-fetches the section map to sync server-granted rewards and updated progress.
4. **Trophy auto-advance** — If the completed node was a trophy (`isTrophy`), loads the next section after 1.2s.

---

## 7. Type System

### Core Path Types (`src/types/journey/`)

| Type                   | File       | Purpose                                                                                                     |
| ---------------------- | ---------- | ----------------------------------------------------------------------------------------------------------- |
| `PathNodeData`         | `node.ts`  | Runtime node: id, index, type, status, icon, progress, label, taskId, rewards                               |
| `JourneyNode`          | `node.ts`  | FlashList cell data: adds globalIndex, x, y, cellHeight, segmentD, variantKey, colorThemeKey, prevX, unitId |
| `JourneyDividerItem`   | `node.ts`  | Unit separator in the flat list                                                                             |
| `JourneyMascotItem`    | `node.ts`  | Mascot bubble in the flat list                                                                              |
| `JourneyFlashListItem` | `node.ts`  | Union: `JourneyNode \| JourneyDividerItem \| JourneyMascotItem`                                             |
| `UnitData`             | `unit.ts`  | Runtime unit: id, title, colorScheme, nodes[], mascotPlacements[]                                           |
| `JourneyState`         | `state.ts` | Top-level: `{ currentUnit, units, lastActiveNodeId, stats }`                                                |
| `JourneyStats`         | `state.ts` | Header stats: streakDays, wallet, hearts, totalXP                                                           |

### Section Map Types (`src/types/journey/sectionMap.ts`)

| Type                  | Purpose                                                                           |
| --------------------- | --------------------------------------------------------------------------------- |
| `SectionMapResponse`  | Full RPC response: journey meta, section data, progress, enrollment, section list |
| `NodeStub`            | Lightweight node metadata (no content JSONB)                                      |
| `SectionUnitData`     | One unit nested inside a fetched section                                          |
| `SectionData`         | Section metadata + flattened node stubs                                           |
| `SectionNodeProgress` | User's progress on a single node                                                  |
| `SectionEnrollment`   | User's enrollment info                                                            |
| `NodeContentResponse` | Full JSONB content fetched on-demand                                              |
| `SectionViewMode`     | `'active' \| 'completed' \| 'preview'`                                            |

### Enums (`src/types/journey/enums.ts`)

| Enum              | Values                                       |
| ----------------- | -------------------------------------------- |
| `NodeStatus`      | `LOCKED`, `ACTIVE`, `COMPLETED`              |
| `NodeType`        | `LESSON`, `CHECKPOINT`, `CHEST`              |
| `NodeIcon`        | `STAR`, `LOCK`, `CHECKMARK`, `BOOK`, `CHEST` |
| `UnitColorScheme` | `GREEN`, `BLUE`, `PURPLE`, `ORANGE`, `PINK`  |

---

## 8. Performance Architecture

| Technique                               | Where                        | Impact                                                                    |
| --------------------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| **Segment-per-cell SVG**                | `JourneyNodeCell`            | No giant SVG; each cell owns its own small `<Svg>`                        |
| **Pre-computed layout**                 | `buildJourneyNodes()`        | All x, y, cellHeight, segmentD computed once outside React                |
| **`overrideItemLayout`**                | `JourneyMapFlashList`        | FlashList skips measurement — uses exact `cellHeight`                     |
| **`React.memo` with custom comparator** | `JourneyNodeCell`            | Only re-renders on status/progress/activeIndex change                     |
| **`selectAtom` per-node**               | `nodeStatusAtomFamily()`     | Each cell subscribes to only its own status                               |
| **Per-unit granular selectors**         | `unitNodesAtomFamily()`      | Cross-unit isolation — completing node in unit 3 doesn't re-render unit 1 |
| **Debounced persistence**               | `debouncedSave` (1.5s)       | Avoids hammering AsyncStorage on every progress tick                      |
| **`useScrollToActive` worklet**         | `useScrollToActive.ts`       | `updateVisibility()` only triggers React re-render when boolean flips     |
| **Section prefetching**                 | `useSectionPrefetch`         | Pre-fetches next section at 80% progress                                  |
| **Interaction lock**                    | `useInteractionLock` (400ms) | Prevents rapid double-taps                                                |
| **AbortController**                     | `useSectionData`             | Cancels in-flight requests on rapid section switching                     |
| **Cell recycling**                      | `getItemType`                | FlashList recycles cells by item type                                     |

---

## 9. Offline & Caching

| Layer                      | TTL             | Key Format                                   | Purpose                    |
| -------------------------- | --------------- | -------------------------------------------- | -------------------------- |
| In-memory `Map` atom       | 5 min freshness | `mode:unitNumber`                            | Instant render on back-nav |
| AsyncStorage section map   | 24h             | `@section_map_cache_v2_{slug}_{mode}_{unit}` | Offline fallback           |
| AsyncStorage node content  | 24h             | `@node_content_cache_v1_{nodeId}`            | Offline node content       |
| AsyncStorage journey state | ∞               | `@journey_state_v2`                          | Crash recovery             |

**Version invalidation:** When `journey.version` changes, all section caches for that slug are purged and a toast is shown.

---

## 10. Guest Mode (P1.6.1 — Try Before Sign Up)

- `useJourneyAuthGate` — intercepts node presses beyond the free limit (first 2 nodes).
- `useGuestProgress` — stores local completions in AsyncStorage (no Supabase).
- `GuestSignUpSheet` — bottom sheet prompting account creation.

---

## 11. Multi-Journey Support

- `useMultiJourney` — manages multiple enrolled journeys.
- `JourneySwitcherSheet` — bottom sheet to switch between journeys or discover new ones.
- `useEnrollmentProgressSync` — watches `journeyStateAtom` and syncs completion counts back to the enrollment store. Uses a `selectAtom` with custom equality to fire only on actual completion changes.

---

## 12. Key Component Tree

```
JourneyMapContainer
├── JourneyLoadingSkeleton          (render state: loading)
├── JourneyErrorState               (render state: hard-error / fallback-error)
├── JourneyMapFlashList             (render state: flash-list)
│   ├── StickyUnitHeader
│   ├── OfflineBanner
│   ├── AnimatedFlashList
│   │   ├── JourneyNodeCell
│   │   │   ├── <Svg><Path/></Svg>  (bezier segment)
│   │   │   └── ConfigDrivenNode    (circle + icon)
│   │   ├── DividerCell → UnitDivider
│   │   └── MascotCell → MascotBubble   (currently commented out)
│   └── ScrollToActiveButton
├── ChestRewardModal
├── UnitCompleteModal
├── GuestSignUpSheet
├── SectionOverviewSheet
├── JourneySwitcherSheet
└── Loading overlay (node content fetch)
```
