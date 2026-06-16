import { HapticConfig } from "./types";

export const HAPTIC_CONFIGS: {
  subtle: Record<string, HapticConfig>;
  emotional: Record<string, HapticConfig>;
  immersive: Record<string, HapticConfig>;
  alert: Record<string, HapticConfig>;
  destructive: Record<string, HapticConfig>;
  compositions: Record<string, HapticConfig[]>;
} = {
  subtle: {
    buttonTap: { intensity: 0.2, sharpness: 0.45, duration: 80 },
    fieldFocus: { intensity: 0.2, sharpness: 0.4, duration: 80 },
    microInteraction: { intensity: 0.15, sharpness: 0.4, duration: 60 },
  },

  emotional: {
    validated: { intensity: 0.4, sharpness: 0.35, duration: 500 },
    celebrated: { intensity: 0.45, sharpness: 0.5, duration: 600 },
    grounded: { intensity: 0.35, sharpness: 0.25, duration: 700 },
  },

  immersive: {
    meditationEntry: { intensity: 0.35, sharpness: 0.25, duration: 800 },
    breathingCycle: { intensity: 0.3, sharpness: 0.2, duration: 4000 },
    ambient: { intensity: 0.2, sharpness: 0.2, duration: 100 },
  },

  alert: {
    gentle: { intensity: 0.4, sharpness: 0.5, duration: 300 },
    medium: { intensity: 0.5, sharpness: 0.6, duration: 350 },
    important: { intensity: 0.6, sharpness: 0.7, duration: 400 },
  },

  destructive: {
    warning: { intensity: 0.35, sharpness: 0.6, duration: 100 },
    confirm: { intensity: 0.4, sharpness: 0.7, duration: 150 },
  },

  compositions: {
    journalSave: [
      { intensity: 0.4, sharpness: 0.5, duration: 50 },
      { intensity: 0.35, sharpness: 0.25, duration: 300 },
    ],
    streakUnlock: [
      { intensity: 0.5, sharpness: 0.5, duration: 100 },
      { intensity: 0.55, sharpness: 0.6, duration: 300 },
    ],
    deleteWarning: [
      { intensity: 0.35, sharpness: 0.6, duration: 100 },
      { intensity: 0.35, sharpness: 0.6, duration: 100 },
    ],
  },
};
