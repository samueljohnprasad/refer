# Research: Unified Journey Map Node System

**Date**: 2026-09-04 | **Feature**: 016-unified-node-system

---

## 1. `@expo/ui` SwiftUI Sheet for Checkpoint Action Panel

**Decision**: Use `BottomSheet` from `@expo/ui/swift-ui` with `isPresented` boolean state. Controlled by JS node tap → `setIsOpen(true)`. `fitToContents={true}` auto-sizes.

**Rationale**: Already a project dependency (SDK 56). Renders a native iOS sheet with safe area, gesture dismiss, and detent support — zero extra library cost. `fitToContents` eliminates manual height math.

**Alternatives considered**:
- `@gorhom/bottom-sheet` — would work but is JS-rendered; native sheet has better iOS-native feel.
- Inline accordion expanding on path — rejected; complex layout math and breaks path scroll geometry.
- Custom absolutely-positioned tooltip — rejected; fragile on different screen sizes.

**Gotchas**:
- All SwiftUI components must be wrapped in `<Host>`. React Native children go inside `<RNHostView matchContents>`.
- Sheet content unmounts on dismiss; keep animation state outside the sheet.
- Minimum device: iOS 16+ (well within iOS 26+ target).

---

## 2. SVG Silhouettes for Node Shapes

**Decision**: Use existing `react-native-svg` 15.15.4. Render each silhouette as a static `<Path>` or `<Polygon>` string, memoized at module level. No new library needed.

| Shape | Element | Notes |
|-------|---------|-------|
| Circle (lesson) | `<Ellipse>` | Matches existing `DuolingoSvgNodeButton` exactly |
| Hexagon (checkpoint) | `<Polygon points="50,0 93,25 93,75 50,100 7,75 7,25">` | Flat-top orientation in 100×100 viewBox |
| Shield (checkpoint alt) | `<Path d="M10,10 H90 V55 C90,75 50,95 50,95 C50,95 10,75 10,55 Z">` | Classic heraldic shield |
| Rosette/Medal (milestone) | Custom bezier `<Path>` with 8 scalloped arcs | Pre-computed string constant |

**Rationale**: iOS Metal renders static SVG paths at negligible cost. 10–20 nodes in a `FlashList` will not cause frame drops.

**Alternatives considered**:
- Custom `Skia` drawing (`@shopify/react-native-skia`) — overkill; `react-native-svg` already installed and sufficient.
- `Image` with PNG assets per shape — rejected; not scale-adaptive, harder to tint with `DynamicColorIOS`.

**Gotchas**:
- Pre-compute all path `d` strings as `const` at module scope — never recalculate inside render.
- Wrap each `Node` in `React.memo` to prevent full-list re-renders on scroll.
- No SVG blur filters (`feGaussianBlur`). Use layered views for 3D depth effect per `DESIGN.md`.

---

## 3. Optimistic UI for Chest Claim (Supabase + Redux Toolkit)

**Decision**: Snapshot-before-update → optimistic dispatch → `supabase.upsert().select()` → rollback on `error` OR `data.length === 0`.

**Pattern**:
```ts
// ponytail: snapshot-rollback optimistic claim
const claimChest = (nodeId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  const prev = getState().journey.nodeProgress[nodeId];
  dispatch(optimisticSetNodeStatus({ nodeId, status: 'claimed' }));
  const { data, error } = await supabase
    .from('user_node_progress')
    .upsert({ node_id: nodeId, status: 'claimed' })
    .select();
  if (error || !data || data.length === 0) {
    dispatch(optimisticSetNodeStatus({ nodeId, status: prev?.status ?? 'locked' }));
  }
};
```

**Rationale**: Supabase JS never throws — always `{ data, error }`. RLS block returns HTTP 200 with `data: []`, so checking `data.length > 0` is mandatory for correctness.

**Alternatives considered**:
- Wait for network before transitioning — rejected; adds latency, feels unresponsive; premium apps (Duolingo) never do this.
- TanStack Query `useMutation` optimistic update — valid but adds another state layer; RTK already in project.

**Gotchas**:
- Must check both `error` AND `data.length`. `error === null` with empty `data` = silent RLS rejection.
- Rapid double-taps → attach mutation timestamp; ignore rollback from stale mutations.
- Chest `state` must be stored in Redux journey slice alongside Supabase as source of truth.

---

## 4. Haptics

**Decision**: `Haptics.impactAsync(ImpactFeedbackStyle.Light)` on every node tap (via `runOnJS`). `Haptics.notificationAsync(NotificationFeedbackType.Success)` on chest claim and checkpoint start.

**Style mapping**:
| Interaction | Haptic |
|-------------|--------|
| Any node tap | `ImpactFeedbackStyle.Light` |
| Chest claim confirmed | `NotificationFeedbackType.Success` |
| Checkpoint Start tapped | `NotificationFeedbackType.Success` |
| Locked node tap | `ImpactFeedbackStyle.Rigid` (blocked feedback) |

**Rationale**: `Light` tap on every node is now clarified as correct. `runOnJS` mandatory when called from Reanimated gesture handlers.

**Gotchas**:
- **Never call haptics synchronously inside a Reanimated worklet** — it is a TurboModule on JS thread and will crash the UI thread.
- In continuous gestures, debounce `runOnJS(triggerHaptic)()` to avoid flooding the JS bridge.

---

## 5. `DynamicColorIOS` with SVG Elements

**Decision**: Pass `SEMANTIC_COLORS.*` values directly as `fill` or `stroke` props on `react-native-svg` elements. Never via Tailwind class string.

```tsx
// ✅ correct
<Path d={HEXAGON_PATH} fill={SEMANTIC_COLORS.brand.primary} />

// ❌ wrong — OpaqueColorValue becomes "[object Object]"
<Path d={HEXAGON_PATH} className="fill-[${SEMANTIC_COLORS.brand.primary}]" />
```

**Rationale**: `DynamicColorIOS` returns an `OpaqueColorValue` — a native object reference. NativeWind arbitrary values are CSS strings; interpolating the object produces `"[object Object]"`. `react-native-svg`'s `extractBrush.ts` natively handles `OpaqueColorValue` directly and resolves the dynamic trait collection at iOS draw time.

**Gotchas**:
- All props that accept `SEMANTIC_COLORS` values must be typed as `ColorValue` (`string | OpaqueColorValue`), not just `string`.
- This constraint applies to node `faceColor`, `rimColor`, `iconColor` props throughout.
