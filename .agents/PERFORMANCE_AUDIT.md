
# Journey Map — Performance Audit & Optimization Plan

> Generated: 2026-04-04
> Scope: `src/screens/JourneyMapScreen/`, `src/components/journey/`, `src/hooks/`, `src/utils/journey/`

---

## Table of Contents

1. [Critical — Scroll Jank & Rendering](#1-critical--scroll-jank--rendering)
2. [High — Expensive Calculations on Every Render](#2-high--expensive-calculations-on-every-render)
3. [High — SVG String Manipulation Per Frame](#3-high--svg-string-manipulation-per-frame)
4. [High — Scroll Handler Cascade](#4-high--scroll-handler-cascade)
5. [Medium — PathConnector Rebuilds Full SVG Path](#5-medium--pathconnector-rebuilds-full-svg-path)
6. [Medium — MascotBubble Animation Waste](#6-medium--mascotbubble-animation-waste)
7. [Medium — Jotai State Persistence on Every Change](#7-medium--jotai-state-persistence-on-every-change)
8. [Medium — useMultiUnitLayout O(n) find() Calls](#8-medium--usemultiunitlayout-on-find-calls)
9. [Medium — UnitRenderData Rebuild Chain](#9-medium--unitrenderdata-rebuild-chain)
10. [Low — Lazy Loading Gaps](#10-low--lazy-loading-gaps)
11. [Low — Code Quality & Dead Code](#11-low--code-quality--dead-code)
12. [Low — Bundle Size](#12-low--bundle-size)
13. [Summary Matrix](#13-summary-matrix)

---

## 1. Critical — Scroll Jank & Rendering

### Problem

`MultiUnitPresentation.tsx` uses a plain `<ScrollView>` with `scrollEventThrottle={16}` (60fps). Every scroll frame fires **three JS-side handlers** chained together:

```
handleScroll → onScroll (useScrollToActive) + onCullingScroll (useViewportCulling) + scrollY.value = y
```

Inside `handleScroll`, a **linear scan** of `unitRenderData` runs to find the visible unit index (lines 192-198). This is O(n) per frame at 60fps.

Additionally, `useViewportCulling` calls `setScrollY()` (a React state setter) every 200ms, which triggers a **full React re-render** of the entire `MultiUnitPresentation` tree. When the culling state changes, every `UnitSection` re-evaluates `isInViewport(y)` for every node, causing the map callback to execute N times.

### Files

- `src/screens/JourneyMapScreen/MultiUnitPresentation.tsx` — lines 184-204
- `src/hooks/useViewportCulling.ts` — lines 53-66
- `src/hooks/useScrollToActive.ts` — lines 50-73

### Fix

1. **Move scroll tracking entirely to Reanimated `useSharedValue`** — avoid `useState` in `useViewportCulling`. Instead, read `scrollY.value` inside `useAnimatedReaction` or `useDerivedValue` to cull nodes on the UI thread without JS re-renders.
2. **Replace the linear scan for visible unit** with a **binary search** on the sorted `yOffset` array, or pre-compute breakpoints in a `useMemo` and use `useDerivedValue` to resolve the index on the UI thread.
3. **Batch `setVisibleIndex` and `setIsOffScreen`** into a single state object to avoid two separate re-renders per scroll boundary crossing.
4. **Consider `Animated.ScrollView`** from Reanimated instead of RN `ScrollView` for native scroll event interception without JS bridge overhead.

### Impact

- **Before**: 3 JS calls per frame + React re-render every 200ms + O(n) scan per frame
- **After**: 0 JS calls during scroll, UI-thread-only culling, O(log n) unit detection

---

## 2. High — Expensive Calculations on Every Render

### Problem

`JourneyMapContainer.tsx` has **multiple O(n²) lookups** inside `useMemo` blocks that depend on `unitSegments` and `allUnits`:

```typescript
// Line 172-173: .find() inside .map() — O(units × segments)
const unit = allUnits.find((u) => u.id === segment.unitId);
const unitConfig = config.units.find((uc) => uc.id === segment.unitId);
```

```typescript
// Line 190: another .find() inside the same .map()
const sectionConfig = config.sections.find((s) => s.id === unitConfig.sectionId);
```

For 5 units × 3 sections this is negligible, but for 20+ units (realistic at scale) this becomes 20 × 20 × 3 = 1200 iterations per `useMemo` recompute.

### Files

- `src/screens/JourneyMapScreen/JourneyMapContainer.tsx` — lines 169-203
- `src/hooks/useMultiUnitLayout.ts` — line 81

### Fix

1. **Pre-build lookup Maps** at the top of the container:
   ```typescript
   const unitConfigMap = useMemo(() => new Map(config.units.map(u => [u.id, u])), [config]);
   const sectionConfigMap = useMemo(() => new Map(config.sections.map(s => [s.id, s])), [config]);
   ```
2. Replace all `.find()` calls with `Map.get()` — O(1) instead of O(n).
3. Same fix needed in `useMultiUnitLayout.ts` line 81 where `globalConfig?.units.find(uc => uc.id === unit.id)` runs inside a `.forEach()`.

### Impact

- Eliminates O(n²) → O(n) for render data computation
- Noticeable when scaling to 15-20+ units

---

## 3. High — SVG String Manipulation Per Frame

### Problem

`ConfigDrivenNode.tsx` (lines 173-185) runs **regex replacements on SVG XML strings** every render:

```typescript
xml = xml.replace(/#FFC800|#ffc800|#58CC02|#58cc02/g, theme.pathActiveColor);
xml = xml.replace(/values="0 0 0 0 0\.8 .../g, newMatrix);
xml = xml.replace(/values="0 0 0 0 0\.267 .../g, newMatrix);
```

Each completed/active node does **3 regex scans** of the full SVG string on every render. With 15 completed nodes visible, that's 45 regex operations per render cycle.

The `matrixCache` (line 56-62) only caches the hex → matrix conversion, **not the final recolored SVG string**.

### Files

- `src/components/journey/ConfigDrivenNode.tsx` — lines 173-185

### Fix

1. **Cache the fully recolored SVG string** keyed by `(svgKey, themeKey, status)`:
   ```typescript
   const recolorCache = new Map<string, string>();
   function getRecoloredSvg(svgKey: string, theme: ColorThemeConfig, status: NodeStatus): string {
       const cacheKey = `${svgKey}_${theme.key}_${status}`;
       if (!recolorCache.has(cacheKey)) {
           let xml = getSvg(svgKey)!;
           // ... regex replacements ...
           recolorCache.set(cacheKey, xml);
       }
       return recolorCache.get(cacheKey)!;
   }
   ```
2. The cache only needs to be invalidated when config hot-swaps (extremely rare).
3. Alternative: **Pre-generate theme-colored SVGs at config load time** in the registry, eliminating runtime regex entirely.

### Impact

- **Before**: 45 regex scans per render (15 visible nodes × 3 regex)
- **After**: 0 regex scans after initial cache warm-up

---

## 4. High — Scroll Handler Cascade

### Problem

The scroll event flows through **4 separate handlers**, each doing independent work:

1. `handleScroll` in `MultiUnitPresentation` — sets `scrollY.value`, linear scans for visible unit
2. `onScroll` from `useScrollToActive` — computes `isOffScreen` state, calls `setIsOffScreen` + `setDirection`
3. `onCullingScroll` from `useViewportCulling` — throttled `setScrollY` every 200ms
4. The Reanimated `scrollY.value = y` assignment

Each `setState` call (`setVisibleIndex`, `setIsOffScreen`, `setDirection`, `setScrollY`) potentially triggers a separate React re-render cycle. In the worst case, a single scroll frame causes **4 re-renders**.

### Files

- `src/screens/JourneyMapScreen/MultiUnitPresentation.tsx` — lines 184-204
- `src/hooks/useScrollToActive.ts` — lines 50-73
- `src/hooks/useViewportCulling.ts` — lines 53-66

### Fix

1. **Consolidate all scroll-derived state into a single `useReducer`** or a single state object:
   ```typescript
   const [scrollState, setScrollState] = useState({
       scrollY: 0, isOffScreen: false, direction: 'down', visibleIndex: 0
   });
   ```
2. **Better: Move all scroll reactions to Reanimated `useDerivedValue` / `useAnimatedReaction`** so they run on the UI thread and only bridge to JS when a discrete threshold is crossed (unit boundary, off-screen toggle).
3. Use `runOnJS` sparingly — only when a React state change is truly needed (e.g., unit title text update in the header).

### Impact

- **Before**: Up to 4 React re-renders per scroll event
- **After**: 0-1 re-renders per scroll event (only on unit boundary crossing)

---

## 5. Medium — PathConnector Rebuilds Full SVG Path

### Problem

`PathConnector.tsx` calls `buildPathD(nodePositions)` and `buildPartialPathD(nodePositions, completedCount)` on every render. These iterate through all node positions and build d3-path strings with Bézier curves.

`fullPathD` depends on `nodePositions` (which only changes when layout changes), but `progressPathD` changes whenever `completedCount` changes. Both are computed synchronously during render.

Additionally, `approximatePathLength` (lines 47-60 in PathConnector, duplicated from pathBuilder.ts) runs a full O(n) loop on every render.

### Files

- `src/components/journey/PathConnector.tsx` — lines 73-86
- `src/utils/journey/pathBuilder.ts` — full file

### Fix

1. **Memoize `fullPathD`** — it only changes when node positions change (screen rotation or unit swap):
   ```typescript
   const fullPathD = useMemo(() => buildPathD(nodePositions), [nodePositions]);
   ```
2. **Memoize `progressPathD`** separately with `completedCount` dependency.
3. **Pre-compute cumulative path lengths** in `useMultiUnitLayout` so `approximatePathLength` doesn't need to re-scan on every render. Store `cumulativeLengths[i]` per node.
4. Remove the **duplicate** `approximatePathLength` function in `PathConnector.tsx` (lines 47-60) — use the one from `pathBuilder.ts`.

### Impact

- Eliminates redundant O(n) path building on re-renders when only completedCount changed

---

## 6. Medium — MascotBubble Animation Waste

### Problem

Every `MascotBubble` creates **3 Reanimated shared values** and starts **3 independent animations** (breathing, entrance X, entrance opacity) even when the mascot is off-screen and immediately culled by viewport culling.

When scrolling, mascots pop in and out of the viewport. Each mount triggers `useEffect` animations that:
1. Allocate native animation drivers
2. Start spring/timing animations
3. Get immediately unmounted when scrolled away

This causes unnecessary native thread work and GC pressure from rapid mount/unmount cycles.

### Files

- `src/components/journey/MascotBubble.tsx` — lines 154-190

### Fix

1. **Don't unmount mascots — hide them with `opacity: 0` and `pointerEvents: 'none'`**. This avoids the mount/unmount animation churn. The shared values stay alive on the native side.
2. Alternative: **Add a `visible` prop** and use `cancelAnimation` when not visible, keeping the component mounted but inert.
3. **Increase viewport culling overscan for mascots specifically** (e.g., 800px vs 600px for nodes) so they are less likely to rapidly toggle.
4. Move the entrance animation to only fire once using a `hasEntered` ref — don't replay it on re-mount.

### Impact

- Eliminates animation churn during fast scrolling
- Reduces native thread allocation overhead

---

## 7. Medium — Jotai State Persistence on Every Change

### Problem

`JourneyMapContainer.tsx` line 120-125:

```typescript
useEffect(() => {
    saveJourneyState(journeyState);
    if (!isOnline) { enqueue(journeyState); }
}, [journeyState, isOnline, enqueue]);
```

`saveJourneyState` writes to AsyncStorage on **every journeyState change**. During progress updates (dragging a slider, rapid taps), this could fire dozens of times per second, serializing the entire state tree to JSON each time.

### Files

- `src/screens/JourneyMapScreen/JourneyMapContainer.tsx` — lines 120-125
- `src/store/journeyStore.ts`

### Fix

1. **Debounce `saveJourneyState`** with a 1-2 second trailing delay:
   ```typescript
   const debouncedSave = useMemo(() => debounce(saveJourneyState, 1500), []);
   useEffect(() => { debouncedSave(journeyState); }, [journeyState]);
   ```
2. **Use `requestIdleCallback` (or `InteractionManager.runAfterInteractions`)** for the write so it never blocks scroll or animation frames.
3. Only persist on **meaningful state transitions** (node completion, unit unlock) — not progress ticks.

### Impact

- Eliminates AsyncStorage serialization overhead during rapid interactions
- Prevents JSON.stringify of full state tree from blocking JS thread

---

## 8. Medium — useMultiUnitLayout O(n) find() Calls

### Problem

`useMultiUnitLayout.ts` line 81:

```typescript
const unitConfig = globalConfig?.units.find(uc => uc.id === unit.id);
```

This runs inside `units.forEach()`, making it O(units²). The `useMemo` dependency on `globalConfig` means this recomputes when any config property changes, not just unit-related config.

### Files

- `src/hooks/useMultiUnitLayout.ts` — line 81

### Fix

1. Accept a **pre-built `unitConfigMap: Map<string, UnitConfig>`** instead of the full `JourneyConfig`. This narrows the dependency — the map only changes when unit configs actually change.
2. Replace `.find()` with `Map.get()`.
3. Consider extracting `verticalGap` as a direct parameter instead of reading from `globalConfig?.settings.verticalGap` — avoids dependency on the entire config object.

### Impact

- O(n) → O(1) per unit lookup
- Reduced `useMemo` invalidation frequency

---

## 9. Medium — UnitRenderData Rebuild Chain

### Problem

The data flow creates a **cascade of `useMemo` invalidations**:

```
journeyState changes
  → allUnits recomputes (filter by section)
    → useMultiUnitLayout recomputes (new unit array ref)
      → unitRenderData recomputes (new segments ref)
        → activeNodeY recomputes
          → MultiUnitPresentation re-renders (new unitRenderData ref)
            → Every UnitSection re-evaluates
```

Even if a change only affects one node's progress (0.5 → 0.6), the **entire chain** recomputes because `journeyState` is a single Jotai atom.

### Files

- `src/screens/JourneyMapScreen/JourneyMapContainer.tsx` — lines 159-216
- `src/store/journeyStore.ts`

### Fix

1. **Split the Jotai atom** into granular atoms:
   - `unitNodesAtom(unitId)` — per-unit node states
   - `journeyStatsAtom` — already separate (good)
   - `currentUnitIndexAtom` — just the index
2. Use **Jotai `selectAtom`** to derive only what each component needs:
   ```typescript
   const unitNodes = useAtomValue(selectAtom(journeyStateAtom, (s) => s.units[0].nodes));
   ```
3. **Structural sharing** — when updating a single node's progress, spread only the changed unit's nodes array. This preserves reference equality for unchanged units, preventing their `useMemo` branches from invalidating.

### Impact

- Progress tick updates only re-render the single affected node instead of the entire tree
- Most dramatic improvement for perceived smoothness during active lessons

---

## 10. Low — Lazy Loading Gaps

### Problem

Modals (`NodeCompletionModal`, `ChestRewardModal`, `UnitCompleteModal`) are properly lazy-loaded, but the following heavy components are **eagerly imported**:

- `PathConnector` — SVG rendering with d3-path
- `MascotBubble` — complex animation setup
- `SideProgressRail`
- `StickyUnitHeader` — Reanimated `interpolateColor` setup

These are all needed immediately, so lazy loading won't help for initial render. However, the **Section Overview screen** (`SectionOverviewPresentation`) imports `SvgXml` from `react-native-svg` and `getMascotSvg` from the registry — these could be lazy since the screen is only opened via guide-book tap.

### Files

- `app/tabs/screens/section-overview.tsx`
- `src/screens/SectionOverviewScreen/SectionOverviewPresentation.tsx`

### Fix

1. **Lazy-load the entire Section Overview screen** in the route file:
   ```typescript
   const SectionOverviewScreen = lazy(() => import('@/src/screens/SectionOverviewScreen/SectionOverviewContainer'));
   ```
2. Consider **code-splitting** the SVG registry (`mascotRegistry.ts`, `svgRegistry.ts`) so they're only loaded when first needed.

### Impact

- Reduces initial JS bundle parse time by ~50-100KB (SVG strings)

---

## 11. Low — Code Quality & Dead Code

### Issues Found

| File | Issue | Line |
|------|-------|------|
| `MascotBubble.tsx` | Empty `OwlAvatarProps` interface, unused `breathProgress` shared value still created | 67-70, 155 |
| `MascotBubble.tsx` | Unused `SharedValue` import | 17 |
| `MascotBubble.tsx` | Entrance animation shared values (`entranceX`, `entranceOpacity`) created but `entranceStyle` was removed | 173-190 |
| `SectionOverviewContainer.tsx` | Leading blank lines at top of file | 1-2 |
| `section-overview.tsx` | Leading blank lines at top of file | 1-2 |
| `data/journey/index.ts` | Leading blank lines + trailing blank lines | 1-2, 32-35 |
| `PathConnector.tsx` | Duplicate `approximatePathLength` function (also exists in `pathBuilder.ts`) | 47-60 |
| `useScrollToActive.ts` | Unused import of `NodePosition` | 13 |
| `JourneyMapContainer.tsx` | Missing dependency `activeSectionId` in `useEffect` (line 141-143) — ESLint warning | 141 |
| `JourneyMapContainer.tsx` | Two blank lines after `useFocusEffect` block | 240-241 |

### Fix

- Remove dead code and unused imports
- Remove duplicate functions
- Fix ESLint dependency warnings
- Clean up blank lines

---

## 12. Low — Bundle Size

### Observations

- **`d3-path`** is imported just for `buildPathD`. The full d3-path module is small (~3KB), but if only `path()` is used, consider a manual Bézier string builder (saves the dependency entirely).
- **`react-native-circular-progress`** is imported for the progress ring on active nodes. Only 1 node at a time is active, but the package is imported at the top level of `ConfigDrivenNode`. Consider dynamic import or a lighter SVG arc alternative.
- **SVG registry strings** (`svgRegistry.ts`, `mascotRegistry.ts`) are baked into the JS bundle. For 20+ node variants, this could be 200KB+ of SVG strings. Consider loading them from asset files or a CDN.

---

## 13. Summary Matrix

| # | Issue | Severity | Effort | Impact on 60fps | File(s) |
|---|-------|----------|--------|-----------------|---------|
| 1 | Scroll handlers trigger React re-renders | **Critical** | High | Direct frame drops | MultiUnitPresentation, useViewportCulling, useScrollToActive |
| 2 | O(n²) `.find()` lookups in useMemo | **High** | Low | Stutter on unit count growth | JourneyMapContainer, useMultiUnitLayout |
| 3 | SVG regex per render (45 ops) | **High** | Low | JS thread stall | ConfigDrivenNode |
| 4 | 4 setState calls per scroll event | **High** | Medium | Multiple re-render batches | MultiUnitPresentation, hooks |
| 5 | PathConnector rebuilds full SVG d-string | **Medium** | Low | Unnecessary work | PathConnector, pathBuilder |
| 6 | MascotBubble mount/unmount animation churn | **Medium** | Medium | Native thread GC pressure | MascotBubble |
| 7 | AsyncStorage write on every state change | **Medium** | Low | JS thread blocking | JourneyMapContainer |
| 8 | useMultiUnitLayout full-config dependency | **Medium** | Low | Excess useMemo invalidation | useMultiUnitLayout |
| 9 | Single atom cascades full re-render tree | **Medium** | High | Progress ticks re-render everything | journeyStore, JourneyMapContainer |
| 10 | Section Overview not lazy-loaded | **Low** | Low | Slower initial load | section-overview route |
| 11 | Dead code / unused imports | **Low** | Low | Minor bundle/clarity | Multiple |
| 12 | SVG strings in JS bundle | **Low** | Medium | Larger parse time | svgRegistry, mascotRegistry |

---

## Recommended Priority Order

1. **#1 + #4**: Move scroll reactions to Reanimated UI thread (eliminates all scroll jank)
2. **#3**: Cache recolored SVGs (quick win, big impact)
3. **#2 + #8**: Pre-build ID → Config lookup Maps (quick win)
4. **#7**: Debounce AsyncStorage persistence
5. **#9**: Split Jotai atoms for granular reactivity
6. **#5**: Memoize path D-strings
7. **#6**: Keep MascotBubbles mounted, toggle visibility
8. **#10-12**: Lazy loading, dead code cleanup, bundle optimization




