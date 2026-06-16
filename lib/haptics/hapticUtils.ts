import { HapticManager } from "./HapticManager";
import { type HapticPreset } from "./types";

// ---- Core triggers ----

export const triggerIfEnabled = async (
  preset: HapticPreset,
  intensity: number,
): Promise<void> => {
  await HapticManager.trigger(preset, { intensity });
};

export const triggerIfEnabledSync = (
  preset: HapticPreset,
  intensity: number,
): void => {
  void triggerIfEnabled(preset, intensity);
};

// ---- Sequences ----

export interface HapticSequenceItem {
  preset: HapticPreset;
  intensity: number;
  delayAfter?: number;
}

export const triggerSequence = async (
  sequence: HapticSequenceItem[],
): Promise<void> => {
  for (const { preset, intensity, delayAfter = 0 } of sequence) {
    await triggerIfEnabled(preset, intensity);
    if (delayAfter > 0) await new Promise((r) => setTimeout(r, delayAfter));
  }
};

export const triggerStaggeredItems = (
  items: Array<{ preset: HapticPreset; intensity: number }>,
  options: { baseDelay?: number; delayStep?: number } = {},
): void => {
  const { baseDelay = 0, delayStep = 200 } = options;
  items.forEach((item, index) => {
    setTimeout(
      () => {
        triggerIfEnabledSync(item.preset, item.intensity);
      },
      baseDelay + index * delayStep,
    );
  });
};

// ---- Ramp ----

export const triggerRampIfEnabled = async (
  startIntensity: number,
  peakIntensity: number,
  durationMs: number,
): Promise<void> => {
  await HapticManager.triggerRamp(startIntensity, peakIntensity, durationMs);
};

// ---- Accessibility ----

export const areHapticsEnabled = (): boolean =>
  HapticManager.getSettings().enabled;
