# react-native-pulsar

SDK by Software Mansion for haptic feedback in React Native.

---

## Installation

```bash
yarn add react-native-pulsar
```

---

## Exports

```ts
import {
  Presets,
  Settings,
  usePatternComposer,
  useRealtimeComposer,
} from "react-native-pulsar";
```

---

## Presets

Pre-built haptic patterns. Call directly — no config needed.

```ts
Presets.hammer();
Presets.heartbeat();
Presets.fanfare();
Presets.explosion();
Presets.dogBark();
```

### System Presets

Cross-platform safe. Mirror the platform's native haptic vocabulary.

```ts
// Impact
Presets.System.impactLight();
Presets.System.impactMedium();
Presets.System.impactHeavy();
Presets.System.impactSoft();
Presets.System.impactRigid();

// Notification
Presets.System.notificationSuccess();
Presets.System.notificationWarning();
Presets.System.notificationError();

// Selection
Presets.System.selection();
```

### Android-only System Presets

**VibrationEffect (API 26+):**

```ts
Presets.System.Android.effectClick();
Presets.System.Android.effectDoubleClick();
Presets.System.Android.effectHeavyClick();
Presets.System.Android.effectTick();
```

**VibrationEffect.Composition primitives (API 31+):**

```ts
Presets.System.Android.primitiveClick();
Presets.System.Android.primitiveLowTick();
Presets.System.Android.primitiveQuickFall();
Presets.System.Android.primitiveQuickRise();
Presets.System.Android.primitiveSlowRise();
Presets.System.Android.primitiveSpin();
Presets.System.Android.primitiveThud();
Presets.System.Android.primitiveTick();
```

### Platform Mapping

| Pulsar                  | iOS                                       | Android (API level)         |
| ----------------------- | ----------------------------------------- | --------------------------- |
| `impactLight()`         | `UIImpactFeedbackGenerator.light`         | `EFFECT_CLICK` (29+)        |
| `impactMedium()`        | `UIImpactFeedbackGenerator.medium`        | `EFFECT_HEAVY_CLICK` (29+)  |
| `impactHeavy()`         | `UIImpactFeedbackGenerator.heavy`         | `EFFECT_HEAVY_CLICK` (29+)  |
| `impactSoft()`          | `UIImpactFeedbackGenerator.soft`          | `EFFECT_TICK` (29+)         |
| `impactRigid()`         | `UIImpactFeedbackGenerator.rigid`         | `EFFECT_CLICK` (29+)        |
| `notificationSuccess()` | `UINotificationFeedbackGenerator.success` | `EFFECT_DOUBLE_CLICK` (29+) |
| `notificationWarning()` | `UINotificationFeedbackGenerator.warning` | `EFFECT_HEAVY_CLICK` (29+)  |
| `notificationError()`   | `UINotificationFeedbackGenerator.error`   | `EFFECT_DOUBLE_CLICK` (29+) |
| `selection()`           | `UISelectionFeedbackGenerator.selection`  | `EFFECT_TICK` (29+)         |

---

## Settings

Global engine configuration.

```ts
import { Settings } from "react-native-pulsar";
```

| Method                                           | Description                                                        |
| ------------------------------------------------ | ------------------------------------------------------------------ |
| `Settings.enableHaptics(state: boolean)`         | Enable / disable all haptic feedback                               |
| `Settings.enableSound(state: boolean)`           | Enable / disable audio simulation                                  |
| `Settings.enableCache(state: boolean)`           | Enable / disable preset caching                                    |
| `Settings.clearCache()`                          | Clear the preset cache                                             |
| `Settings.preloadPresets(names: string[])`       | Warm up presets for faster first-play                              |
| `Settings.stopHaptics()`                         | Stop all currently playing haptics                                 |
| `Settings.shutDownEngine()`                      | Shut down the haptic engine                                        |
| `Settings.getHapticsSupportLevel()`              | Returns device `HapticSupport` level                               |
| `Settings.forceHapticsSupportLevel(level)`       | _(Android only)_ Override detected support — for testing fallbacks |
| `Settings.enableImpulseCompositionMode(state)`   | _(Android only)_ Toggle impulse composition mode                   |
| `Settings.setRealtimeComposerStrategy(strategy)` | _(Android only)_ Set realtime composer strategy                    |

```ts
// Warm up before use
Settings.preloadPresets(["Fanfare", "Heartbeat", "Explosion"]);

// Temporarily silence haptics
Settings.enableHaptics(false);

// Check device capability
const support = Settings.getHapticsSupportLevel();
```

---

## usePatternComposer

Hook for playing declarative haptic patterns. Pattern is parsed on mount or when it changes.

```ts
const { play, stop, parse, isParsed } = usePatternComposer(pattern?);
```

| Return     | Type         | Description              |
| ---------- | ------------ | ------------------------ |
| `play()`   | `() => void` | Play the parsed pattern  |
| `stop()`   | `() => void` | Stop playback            |
| `parse()`  | `() => void` | Manually re-parse        |
| `isParsed` | `boolean`    | Whether pattern is ready |

### Pattern shape

```ts
type DiscreteEvent = {
  time: number; // ms from start
  amplitude: number; // 0–1
  frequency: number; // 0–1
};

type CurvePoint = { time: number; value: number };

type HapticPattern = {
  discretePattern?: DiscreteEvent[];
  continuousPattern?: {
    amplitude: CurvePoint[];
    frequency: CurvePoint[];
  };
};
```

### Example

```tsx
import { usePatternComposer } from "react-native-pulsar";

const pattern = {
  discretePattern: [
    { time: 0, amplitude: 1, frequency: 0.5 },
    { time: 100, amplitude: 0.5, frequency: 0.5 },
  ],
  continuousPattern: {
    amplitude: [
      { time: 0, value: 0 },
      { time: 200, value: 1 },
      { time: 400, value: 0 },
    ],
    frequency: [
      { time: 0, value: 0.3 },
      { time: 400, value: 0.8 },
    ],
  },
};

function MyComponent() {
  const { play } = usePatternComposer(pattern);

  return <Button onPress={play} title="Feel it" />;
}
```

---

## useRealtimeComposer

Hook for live, gesture-driven haptic control. Amplitude and frequency can be updated continuously. Haptics stop automatically on unmount.

```ts
const { set, playDiscrete, stop, isActive } = useRealtimeComposer();
```

| Return         | Signature                                                                 | Description                                                     |
| -------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `start`        | `() => void`                                                              | Start the realtime engine                                       |
| `set`          | `(amplitude: number, frequency: number, startIfNeeded?: boolean) => void` | Update ongoing haptic; pass `true` to auto-start if not running |
| `playDiscrete` | `(amplitude: number, frequency: number) => void`                          | Fire a single discrete event                                    |
| `stop`         | `() => void`                                                              | Stop the active haptic                                          |
| `isActive`     | `() => boolean`                                                           | Whether a haptic is currently playing                           |

### Example — pan gesture

```tsx
import { useRealtimeComposer } from "react-native-pulsar";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

function DraggableCard() {
  const realtime = useRealtimeComposer();

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      const amplitude = Math.min(Math.abs(e.velocityY) / 1000, 1);
      realtime.set(amplitude, 0.5);
    })
    .onEnd(() => {
      realtime.stop();
    });

  return <GestureDetector gesture={pan}>...</GestureDetector>;
}
```

---

## Choosing the right API

| Use case                                        | API                                     |
| ----------------------------------------------- | --------------------------------------- |
| One-shot standard feel (tap, select, notify)    | `Presets.System.*`                      |
| Named expressive preset (heartbeat, fanfare…)   | `Presets.*`                             |
| Declarative timed pattern (rhythm, sequence)    | `usePatternComposer`                    |
| Gesture-driven live haptic (drag, swipe, scrub) | `useRealtimeComposer`                   |
| App-wide enable/disable or preloading           | `Settings`                              |
| Static class / non-React context                | `Presets.System.*` + `setTimeout` loops |

---

## Notes

- `usePatternComposer` and `useRealtimeComposer` are **React hooks** — they cannot be used outside of components. For static utility classes (`HapticManager`), use `Presets.System` directly with `setTimeout`-based step loops.
- `amplitude` and `frequency` are both `0–1` floats. `amplitude` maps to physical intensity; `frequency` maps to sharpness/texture (higher = crisper).
- `Settings.preloadPresets()` should be called during app init to avoid first-play latency on named presets.
- On Android below API 29, haptics fall back silently. Use `Settings.getHapticsSupportLevel()` to branch UI if needed.
