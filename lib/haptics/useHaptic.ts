import { useEffect, useRef, useCallback, useMemo } from "react";
import { usePatternComposer, useRealtimeComposer } from "react-native-pulsar";
import type { Pattern } from "react-native-pulsar";
import {
  triggerIfEnabled,
  triggerIfEnabledSync,
  type HapticSequenceItem,
  triggerSequence,
} from "./hapticUtils";
import { HapticManager } from "./HapticManager";
import { type HapticPreset, type HapticConfig } from "./types";

// ---- Effect hooks ----

export const useHapticEffect = (
  shouldTrigger: boolean,
  preset: HapticPreset,
  intensity: number,
  dependencies: any[] = [],
): void => {
  useEffect(() => {
    if (!shouldTrigger) return;
    void triggerIfEnabled(preset, intensity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldTrigger, preset, intensity, ...dependencies]);
};

export const useHapticOnce = (
  shouldTrigger: boolean,
  preset: HapticPreset,
  intensity: number,
  dependencies: any[] = [],
): void => {
  const triggered = useRef(false);

  useEffect(() => {
    if (!shouldTrigger || triggered.current) return;
    void triggerIfEnabled(preset, intensity);
    triggered.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldTrigger, preset, intensity, ...dependencies]);
};

// ---- Handler hooks ----

export const useHapticHandler = (
  preset: HapticPreset,
  intensity: number,
): (() => Promise<void>) =>
  useCallback(() => triggerIfEnabled(preset, intensity), [preset, intensity]);

export const useHapticHandlerSync = (
  preset: HapticPreset,
  intensity: number,
): (() => void) =>
  useCallback(
    () => triggerIfEnabledSync(preset, intensity),
    [preset, intensity],
  );

// ---- Composition hooks ----

export const useHapticCallback = <T extends unknown[], R>(
  preset: HapticPreset,
  intensity: number,
  callback: (...args: T) => R,
): ((...args: T) => Promise<R>) =>
  useCallback(
    async (...args: T) => {
      await triggerIfEnabled(preset, intensity);
      return callback(...args);
    },
    [preset, intensity, callback],
  );

export const useHapticSequence = (
  sequence: HapticSequenceItem[],
): (() => Promise<void>) =>
  useCallback(() => triggerSequence(sequence), [sequence]);

// ---- Realtime hook (Pulsar useRealtimeComposer) ----

// Drives live haptic amplitude from a breathing animation.
//
// Returns start(), stop(), and setProgress(0–1).
// Call start() when the exercise begins, stop() when it ends.
// Call setProgress() from an Animated.addListener or Reanimated worklet
// on every frame — amplitude tracks it imperatively, no React state needed.
export const useBreathingHaptic = (
  peakAmplitude = 0.35,
  frequency = 0.25,
): {
  start: () => void;
  stop: () => void;
  setProgress: (p: number) => void;
} => {
  const { start, set, stop } = useRealtimeComposer();
  const active = useRef(false);

  const guardedStart = useCallback(() => {
    if (!HapticManager.getSettings().enabled) return;
    active.current = true;
    start();
  }, [start]);

  const guardedStop = useCallback(() => {
    active.current = false;
    stop();
  }, [stop]);

  const setProgress = useCallback(
    (p: number) => {
      if (!active.current) return;
      if (!HapticManager.getSettings().enabled) return;
      set(p * peakAmplitude, frequency, true);
    },
    [set, peakAmplitude, frequency],
  );

  return { start: guardedStart, stop: guardedStop, setProgress };
};

// ---- Pattern hook (Pulsar usePatternComposer) ----

// Converts a HapticConfig into Pulsar's pattern shape and returns play/stop.
// Use this in components for smooth declarative rampUp / rampDown / pulse patterns
// instead of the setTimeout-step fallback in HapticManager.playCustomPattern.
export const useHapticPattern = (
  config: HapticConfig,
): { play: () => void; stop: () => void } => {
  const pattern = useMemo(
    () => buildPulsarPattern(config),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config.intensity, config.sharpness, config.duration, config.pattern],
  );
  const { play, stop } = usePatternComposer(pattern);

  const guardedPlay = useCallback(() => {
    if (!HapticManager.getSettings().enabled) return;
    play();
  }, [play]);

  return { play: guardedPlay, stop };
};

// ---- Internal: HapticConfig → Pulsar pattern ----

type CurvePoint = { time: number; value: number };

function buildPulsarPattern(config: HapticConfig): Pattern {
  const { intensity, sharpness = 0.5, duration, pattern } = config;

  switch (pattern) {
    case "rampUp":
      return {
        discretePattern: [],
        continuousPattern: {
          amplitude: rampCurve(0, intensity, duration),
          frequency: flatCurve(sharpness, duration),
        },
      };

    case "rampDown":
      return {
        discretePattern: [],
        continuousPattern: {
          amplitude: rampCurve(intensity, 0, duration),
          frequency: flatCurve(sharpness, duration),
        },
      };

    case "pulse": {
      const pulseCount = Math.max(1, Math.floor(duration / 200));
      const gap = duration / pulseCount;
      return {
        discretePattern: Array.from({ length: pulseCount }, (_, i) => ({
          time: i * gap,
          amplitude: intensity,
          frequency: sharpness,
        })),
        continuousPattern: { amplitude: [], frequency: [] },
      };
    }

    default:
      return {
        discretePattern: [],
        continuousPattern: {
          amplitude: sineCurve(intensity, duration),
          frequency: flatCurve(sharpness, duration),
        },
      };
  }
}

function rampCurve(from: number, to: number, duration: number): CurvePoint[] {
  return [
    { time: 0, value: from },
    { time: duration, value: to },
  ];
}

function flatCurve(value: number, duration: number): CurvePoint[] {
  return [
    { time: 0, value },
    { time: duration, value },
  ];
}

function sineCurve(peak: number, duration: number): CurvePoint[] {
  return [
    { time: 0, value: 0 },
    { time: duration / 2, value: peak },
    { time: duration, value: 0 },
  ];
}
