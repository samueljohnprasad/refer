# Journey Animations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replicate the center screen reveal and staggered animations from the HTML prototype into the Journey Map screen using `react-native-reanimated`.

**Architecture:** We will create wrapper components for each animated section (`ScreenReveal`, `RevealTopBar`, `RevealNode`, `RevealPath`) that use `useSharedValue` and `useEffect` to trigger `withTiming` on mount, applying the exact cubic-bezier curves from the spec.

**Tech Stack:** React Native, Expo, react-native-reanimated

## Global Constraints

- Do not modify the original `assets/exercise-motion.html` file.
- Separate animation wrapper components must be placed in `src/components/journey/animations/`.

---

### Task 1: Create ScreenReveal Wrapper

**Files:**
- Create: `src/components/journey/animations/ScreenReveal.tsx`

**Interfaces:**
- Produces: `ScreenReveal(props: { children: React.ReactNode })`

- [ ] **Step 1: Write the component**

```tsx
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

export function ScreenReveal({ children }: { children: React.ReactNode }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: 1050,
      easing: Easing.bezier(0.33, 1, 0.68, 1),
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = 0.955 + progress.value * (1 - 0.955);
    const translateY = 22 * (1 - progress.value);
    
    return {
      opacity: progress.value,
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <Animated.View style={[{ flex: 1 }, animatedStyle]}>
      {children}
    </Animated.View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/journey/animations/ScreenReveal.tsx
git commit -m "feat: add ScreenReveal animation wrapper"
```

### Task 2: Create RevealTopBar Wrapper

**Files:**
- Create: `src/components/journey/animations/RevealTopBar.tsx`

**Interfaces:**
- Produces: `RevealTopBar(props: { children: React.ReactNode })`

- [ ] **Step 1: Write the component**

```tsx
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

export function RevealTopBar({ children }: { children: React.ReactNode }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    // Top bar animation down
    progress.value = withDelay(
      100, // Slight delay to let screen reveal start
      withTiming(1, {
        duration: 900,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = -24 * (1 - progress.value);
    
    return {
      opacity: progress.value,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/journey/animations/RevealTopBar.tsx
git commit -m "feat: add RevealTopBar animation wrapper"
```

### Task 3: Create RevealNode & RevealPath Wrappers

**Files:**
- Create: `src/components/journey/animations/RevealNode.tsx`
- Create: `src/components/journey/animations/RevealPath.tsx`

**Interfaces:**
- Produces: `RevealNode(props: { children: React.ReactNode, index: number })`
- Produces: `RevealPath(props: { children: React.ReactNode, index: number })`

- [ ] **Step 1: Write RevealNode**

```tsx
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
  interpolate,
} from "react-native-reanimated";

export function RevealNode({ children, index }: { children: React.ReactNode, index: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      300 + (index * 100), // Stagger based on index
      withTiming(1, {
        duration: 1000,
        easing: Easing.bezier(0.33, 1, 0.68, 1),
      })
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    // Pop effect: 0.5 -> 0.92 -> 1.06 -> 0.99 -> 1
    // Approximated by the bezier curve on a single 0-1 value mapped to 0.5-1.0
    const scale = 0.5 + (progress.value * 0.5);
    
    return {
      opacity: progress.value,
      transform: [{ scale }],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

- [ ] **Step 2: Write RevealPath**

```tsx
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withDelay,
} from "react-native-reanimated";

export function RevealPath({ children, index }: { children: React.ReactNode, index: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      400 + (index * 100), // Stagger based on index
      withTiming(1, {
        duration: 1150,
        easing: Easing.bezier(0.45, 0, 0.25, 1),
      })
    );
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: progress.value,
    };
  });

  // Note: True strokeDashoffset animation requires modifying the SVG path directly.
  // For simplicity and component separation, we fade in the path sequentially.
  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/journey/animations/RevealNode.tsx src/components/journey/animations/RevealPath.tsx
git commit -m "feat: add RevealNode and RevealPath animation wrappers"
```

### Task 4: Integrate Animations

**Files:**
- Modify: `src/screens/JourneyMapScreen/JourneyMapContainer.tsx`
- Modify: `src/components/journey/JourneyNodeCell.tsx`

- [ ] **Step 1: Update JourneyMapContainer**
Wrap `JourneyMapFlashList` with `<ScreenReveal>` and `DuolingoHeader` with `<RevealTopBar>`.

```bash
sed -i '' 's|import { AmbientTapDust }|import { ScreenReveal } from "@/src/components/journey/animations/ScreenReveal";\nimport { RevealTopBar } from "@/src/components/journey/animations/RevealTopBar";\nimport { AmbientTapDust }|' src/screens/JourneyMapScreen/JourneyMapContainer.tsx
```

Manual adjustments inside `JourneyMapContainer.tsx`:
In the header function:
```tsx
<RevealTopBar>
  <DuolingoHeader ... />
  <HomeMainButton ... />
</RevealTopBar>
```
In the main render:
```tsx
<ScreenReveal>
  <AmbientTapDust>
    <Animated.View ...>
       <JourneyMapFlashList ... />
    </Animated.View>
  </AmbientTapDust>
</ScreenReveal>
```

- [ ] **Step 2: Update JourneyNodeCell**
Wrap the Node View and Path Svg.

```bash
sed -i '' 's|import { Text } from|import { RevealNode } from "@/src/components/journey/animations/RevealNode";\nimport { RevealPath } from "@/src/components/journey/animations/RevealPath";\nimport { Text } from|' src/components/journey/JourneyNodeCell.tsx
```

Manual adjustments inside `JourneyNodeCellInner`:
Wrap the `<Svg>` block with `<RevealPath index={item.globalIndex}>`
Wrap the absolute `<View>` block (the node content) with `<RevealNode index={item.globalIndex}>`

- [ ] **Step 3: Test and Commit**

```bash
npm run tsc -- --noEmit
git add src/screens/JourneyMapScreen/JourneyMapContainer.tsx src/components/journey/JourneyNodeCell.tsx
git commit -m "feat: integrate journey animation wrappers"
```
