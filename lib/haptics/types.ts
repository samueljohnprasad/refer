// Haptic preset names
export type HapticPreset =
  | "whisper"
  | "wisp"
  | "feather"
  | "breath"
  | "pulse"
  | "heartbeat"
  | "bloom"
  | "swell"
  | "exhale"
  | "sway"
  | "chime"
  | "beacon"
  | "wave"
  | "ripple"
  | "dewdrop"
  | "sonar"
  | "radar"
  | "lighthouse"
  | "pendulum"
  | "tideswell";

// Waveform patterns
export type WaveformPattern =
  | "sine"
  | "triangle"
  | "square"
  | "rampUp"
  | "rampDown"
  | "pulse";

// Haptic configuration
export interface HapticConfig {
  intensity: number; // 0–1
  sharpness: number; // 0–1
  duration: number; // milliseconds
  pattern?: WaveformPattern;
}

// User haptic settings
export interface HapticSettings {
  enabled: boolean;
  intensity: number; // 0–1 multiplier
  profile: "full" | "reduced" | "minimal" | "none";
  reduceMotionEnabled: boolean;
}

// Haptic preset with metadata
export interface HapticPresetDefinition extends HapticConfig {
  name: HapticPreset;
  emotion: string;
  description: string;
}
