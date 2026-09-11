# Research & Decisions: Lesson Completion Celebration

## 1. Animation Sequencing & Architecture

**Decision**: Use `react-native-reanimated` (v3+) for the UI choreography and timeline coordination, paired with `lottie-react-native` for the Panda character animations.
**Rationale**: The specification requires precise ms-level choreography (100ms haptic, 350ms Panda interact, 850ms Ripple). Reanimated's `withSequence`, `withDelay`, and `withTiming` hooks allow declarative, performant orchestration on the UI thread without dropping frames. Lottie provides the rich, custom character behavior required for the Panda.
**Alternatives considered**: 
- `Animated` API (React Native built-in) - Rejected due to JS thread bridge overhead and lack of robust timeline controls compared to Reanimated.
- CSS Animations (via NativeWind) - Rejected as they cannot coordinate complex sequences with haptic feedback easily.

## 2. Integration with Exercise Runner

**Decision**: Implement the celebration as a high-level overlay component (`<CelebrationOverlay />`) that sits above the active exercise. The exercise runner will yield a `status: "celebration"` state before unmounting.
**Rationale**: The spec requires the exercise card to "dissolve" while the celebration begins, meaning the exercise must still be mounted but enter an exit animation state. A unified overlay allows us to reuse the celebration logic across *all* exercise types without rewriting it inside each engine.
**Alternatives considered**: 
- Unmounting the exercise immediately and pushing a new Route (e.g., `/celebration`) - Rejected because it breaks the visual continuity (the active card must dissolve smoothly).

## 3. The "Happy Ripple" Implementation

**Decision**: Implement the Happy Ripple as a Reanimated shared value that drives a scaling/opacity transform on SVG rings positioned absolutely behind the Panda and extending outward.
**Rationale**: A code-driven ripple is much lighter than a full-screen Lottie animation and can be dynamically tinted based on the emotion-linked background context.

## 4. Haptic Feedback Synchronization

**Decision**: Use `expo-haptics` synchronized via JS timeouts that mirror the Reanimated timeline.
**Rationale**: `expo-haptics` requires JS thread calls. Since the timeline is strictly defined (e.g., 100ms), we can safely trigger `Haptics.impactAsync()` via `setTimeout` triggered on the same event that starts the Reanimated animation.
