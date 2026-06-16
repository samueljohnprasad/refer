import { JourneyRewardType } from "@/src/types/journey/enums";
import { HapticPreset } from "./types";

export const HAPTIC_INTENSITIES = {
  // Subtle
  WHISPER_SUBTLE: 0.15,
  WHISPER: 0.2,

  // Light
  PULSE_LIGHT: 0.2,
  PULSE_MEDIUM: 0.25,

  // Medium
  RADAR: 0.3,
  HEARTBEAT: 0.3,
  RIPPLE: 0.3,
  RIPPLE_STRONG: 0.4,

  // Strong
  BLOOM: 0.4,
  BLOOM_STRONG: 0.45,
  HEARTBEAT_STRONG: 0.45,
  RADAR_STRONG: 0.35,

  // Major
  SWELL: 0.5,
} as const;

export const HAPTIC_TIMING = {
  BADGE_PEAK: 300,
  BEACON_REVEAL: 300,

  TITLE_REVEAL: 500,
  REWARD_REVEAL: 800,

  STAT_BASE_DELAY: 400,
  STAT_DELAY_STEP: 120,
  REWARD_BASE_DELAY: 300,
  REWARD_DELAY_STEP: 200,

  SEQUENCE_GAP: 150,
  DOUBLE_TAP_GAP: 100,
  PULSE_SEQUENCE_GAP: 150,
} as const;

export const REWARD_HAPTICS: Record<
  JourneyRewardType,
  { preset: HapticPreset; intensity: number }
> = {
  [JourneyRewardType.XP]: {
    preset: "pulse",
    intensity: HAPTIC_INTENSITIES.PULSE_LIGHT,
  },
  [JourneyRewardType.GEMS]: {
    preset: "ripple",
    intensity: HAPTIC_INTENSITIES.RIPPLE,
  },
  [JourneyRewardType.HEARTS]: {
    preset: "bloom",
    intensity: HAPTIC_INTENSITIES.BLOOM,
  },
  [JourneyRewardType.ACHIEVEMENT]: {
    preset: "radar",
    intensity: HAPTIC_INTENSITIES.RADAR_STRONG,
  },
} as const;
