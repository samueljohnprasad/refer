export { HapticManager } from "./HapticManager";
export { hapticService } from "./hapticService";
export { HAPTIC_PRESETS, PRESET_GROUPS } from "./presets";
export { HAPTIC_CONFIGS } from "./hapticPresets";
export {
  HAPTIC_INTENSITIES,
  HAPTIC_TIMING,
  REWARD_HAPTICS,
} from "./hapticConfig";
export {
  triggerIfEnabled,
  triggerIfEnabledSync,
  triggerSequence,
  triggerStaggeredItems,
  triggerRampIfEnabled,
  areHapticsEnabled,
} from "./hapticUtils";
export {
  useHapticEffect,
  useHapticOnce,
  useHapticHandler,
  useHapticHandlerSync,
  useHapticCallback,
  useHapticSequence,
  useHapticPattern,
  useBreathingHaptic,
} from "./useHaptic";
export type {
  HapticPreset,
  WaveformPattern,
  HapticConfig,
  HapticSettings,
} from "./types";
export type { HapticSequenceItem } from "./hapticUtils";
