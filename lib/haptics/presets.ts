import { HapticPreset, HapticConfig } from "./types";

// Preset library: maps preset names to configurations
export const HAPTIC_PRESETS: Record<HapticPreset, HapticConfig> = {
  // Calming & Grounding
  whisper: {
    intensity: 0.15,
    sharpness: 0.4,
    duration: 60,
    pattern: "sine",
  },
  wisp: {
    intensity: 0.2,
    sharpness: 0.45,
    duration: 80,
    pattern: "sine",
  },
  feather: {
    intensity: 0.2,
    sharpness: 0.35,
    duration: 100,
    pattern: "sine",
  },
  breath: {
    intensity: 0.35,
    sharpness: 0.25,
    duration: 600,
    pattern: "sine",
  },
  exhale: {
    intensity: 0.35,
    sharpness: 0.25,
    duration: 600,
    pattern: "rampDown",
  },
  sway: {
    intensity: 0.3,
    sharpness: 0.2,
    duration: 1000,
    pattern: "sine",
  },
  pendulum: {
    intensity: 0.3,
    sharpness: 0.3,
    duration: 1000,
    pattern: "pulse",
  },

  // Emotional & Connection
  heartbeat: {
    intensity: 0.4,
    sharpness: 0.35,
    duration: 500,
    pattern: "sine",
  },
  pulse: {
    intensity: 0.3,
    sharpness: 0.25,
    duration: 800,
    pattern: "pulse",
  },
  beacon: {
    intensity: 0.45,
    sharpness: 0.5,
    duration: 400,
    pattern: "triangle",
  },
  ripple: {
    intensity: 0.35,
    sharpness: 0.3,
    duration: 700,
    pattern: "sine",
  },
  wave: {
    intensity: 0.3,
    sharpness: 0.25,
    duration: 400,
    pattern: "sine",
  },
  chime: {
    intensity: 0.45,
    sharpness: 0.65,
    duration: 250,
    pattern: "triangle",
  },

  // Insight & Expansion
  bloom: {
    intensity: 0.45,
    sharpness: 0.5,
    duration: 600,
    pattern: "rampUp",
  },
  swell: {
    intensity: 0.5,
    sharpness: 0.55,
    duration: 700,
    pattern: "rampUp",
  },
  lighthouse: {
    intensity: 0.4,
    sharpness: 0.6,
    duration: 500,
    pattern: "triangle",
  },

  // Alert & Notification
  sonar: {
    intensity: 0.45,
    sharpness: 0.6,
    duration: 500,
    pattern: "triangle",
  },
  dewdrop: {
    intensity: 0.4,
    sharpness: 0.65,
    duration: 200,
    pattern: "triangle",
  },
  radar: {
    intensity: 0.45,
    sharpness: 0.55,
    duration: 600,
    pattern: "triangle",
  },

  // Specialized
  tideswell: {
    intensity: 0.35,
    sharpness: 0.2,
    duration: 1200,
    pattern: "sine",
  },
};

// Preset groups by emotional category
export const PRESET_GROUPS = {
  calming: ["whisper", "wisp", "feather", "breath", "exhale", "sway", "pendulum"] as const,
  emotional: [
    "heartbeat",
    "pulse",
    "beacon",
    "ripple",
    "wave",
    "chime",
  ] as const,
  expansion: ["bloom", "swell", "lighthouse"] as const,
  alert: ["sonar", "dewdrop", "beacon"] as const,
  specialized: ["tideswell"] as const,
};
