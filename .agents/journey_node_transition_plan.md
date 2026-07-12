# Implementation Plan: Journey Node Zoom Transition

This plan details the implementation of a native shared element transition (using Expo Router's `Link.AppleZoom`) from the nodes on the Journey Map to the Journey Flow screen.

## 1. Goal
To create a seamless, native zoom transition where tapping a node in the Journey Map visually scales up into the lesson screen (`JourneyFlowRoute`), replacing the current manual circular-reveal `startTransition` approach.

## 2. Source Component: `JourneyNodeCell` & `DuolingoSvgNodeButton`

Currently, tapping a node triggers an imperative callback chain: `onNodePress` -> `useJourneyMapController.handleNodePress` -> `startTransition` -> `router.push()`. We will move this to a declarative `<Link>` structure so the OS can capture the transition.

### Key Changes
1. **Declarative Routing in `JourneyNodeCell.tsx`**: 
   - Wrap the `DuolingoSvgNodeButton` component in a `<Link>` component that navigates to `/tabs/screens/journey-flow?courseId=...&nodeId=...`
   - Wrap the button in `<Link.Trigger>` and `<Link.AppleZoom>`.
2. **Controller Refactor**: 
   - Remove or bypass the `startTransition` manual animation inside `useJourneyMapController.tsx` for standard node taps since `AppleZoom` will take over the navigation animation. (We will keep the backend logic for locked nodes).

**Implementation Details (`JourneyNodeCell.tsx`):**
```tsx
import { Link } from "expo-router";

// Inside JourneyNodeCellInner:
<Link 
  href={{ 
    pathname: "/tabs/screens/journey-flow", 
    params: { courseId: item.courseId, nodeId: item.id } 
  }} 
  asChild
>
  <Link.Trigger>
    {/* We wrap the node in AppleZoom so the OS scales it to the next screen */}
    <Link.AppleZoom>
      <View>
        <DuolingoSvgNodeButton
          onPress={() => {
            // Keep haptics or tracking, but navigation is handled by Link
            Haptics.impactAsync();
          }}
          // ...other props
        />
      </View>
    </Link.AppleZoom>
  </Link.Trigger>
</Link>
```

## 3. Destination Component: `LessonScreen` (via `JourneyFlowRoute`)

The destination screen is `app/tabs/screens/journey-flow.tsx`, which renders a `<NodeEngine>`, which in turn renders a `<LessonScreen>`. The `LessonScreen` contains the root background that we want to zoom *into*.

### Key Changes
1. **The Target Wrapper**: 
   - In `src/components/ui/LessonScreen.tsx`, wrap the outermost `<ScreenLayout>` or `<View>` with `<Link.AppleZoomTarget>`.
2. **Screen Options**:
   - Ensure `journey-flow.tsx` has `<Stack.Screen options={{ presentation: "fullScreenModal" }} />` so the zoom transition hijacks the default presentation animation correctly.

**Implementation Details (`LessonScreen.tsx`):**
```tsx
import { Link } from "expo-router";

// Inside LessonScreen return block:
<Link.AppleZoomTarget>
  <ScreenLayout className={className} style={[styles.container, style]}>
    {/* Screen Content */}
  </ScreenLayout>
</Link.AppleZoomTarget>
```

## 4. Implementation Tasks

- [ ] **Task 1: Update `JourneyNodeCell.tsx`**
  - Import `Link` from `expo-router`.
  - Wrap the `DuolingoSvgNodeButton` with `<Link>`, `<Link.Trigger>`, and `<Link.AppleZoom>`.
- [ ] **Task 2: Refactor `useJourneyMapController.tsx`**
  - Keep the locked node warnings.
  - Remove the `startTransition` manual circle animation and `router.push` for active/completed nodes, as the `<Link>` component will now handle navigation.
- [ ] **Task 3: Apply `<Link.AppleZoomTarget>` to `LessonScreen.tsx`**
  - Import `Link`.
  - Wrap the root component of the `LessonScreen` with `<Link.AppleZoomTarget>`.
- [ ] **Task 4: Add Screen Options to `journey-flow.tsx`**
  - Ensure the destination screen has the correct `fullScreenModal` presentation style to support the native OS transition.
