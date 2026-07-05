# Journey Map Orchestrated Animations Design

## Overview
Replicate the orchestrated "center screen reveal" and staggered entrance animations from `assets/exercise-motion.html` in the React Native Journey Map screen without altering the original HTML prototype. The animations will be separated into reusable wrapper components to maintain clean core files.

## Architecture

We will create a new directory `src/components/journey/animations/` containing:

1. **`ScreenReveal.tsx`**
   - **Target**: Wraps `JourneyMapFlashList` in `JourneyMapContainer`.
   - **Animation**: Animates from `scale(0.955)` and `translateY(22)` to `1` and `0` over 1050ms using `cubic-bezier(0.33, 1, 0.68, 1)`.

2. **`RevealTopBar.tsx`**
   - **Target**: Wraps `DuolingoHeader` inside `JourneyMapContainer`.
   - **Animation**: Translates from `translateY(-24)` to `0` with a mid-waypoint bounce over 900ms.

3. **`RevealNode.tsx`**
   - **Target**: Wraps the contents of `JourneyNodeCell`.
   - **Animation**: Pop effect scaling from `0.5` -> `0.92` -> `1.06` -> `0.99` -> `1`.
   - **Props**: Accepts an `index` prop to calculate a stagger delay (e.g., `index * 100ms`).

4. **`RevealPath.tsx`**
   - **Target**: Wraps the `AnimatedPath` inside `JourneyNodeCell`.
   - **Animation**: Animates `strokeDashoffset` from path length to 0 over 1150ms with `cubic-bezier(0.45, 0, 0.25, 1)`. Delay is tied to cell index.

## Implementation Details
- Uses `react-native-reanimated` for smooth 60fps animations.
- Custom bezier curves will be implemented via `Easing.bezier(x1, y1, x2, y2)`.
- Components are strictly declarative wrappers, isolating animation logic from business logic.
