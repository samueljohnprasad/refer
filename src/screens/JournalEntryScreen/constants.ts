import { Easing } from "react-native-reanimated";

// ponytail: vector MoodIcon replaced raster EMOTION_IMAGES


export const EMOTIONS_CONFIG = [
  { key: "terrible" as const, label: "Terrible", color: "#FF6B6B", emoji: "😢" },
  { key: "bad" as const, label: "Bad", color: "#FFA94D", emoji: "😕" },
  { key: "fine" as const, label: "Fine", color: "#FFD43B", emoji: "🙂" },
  { key: "good" as const, label: "Good", color: "#8CE99A", emoji: "😄" },
  { key: "great" as const, label: "Great", color: "#74C0FC", emoji: "🤩" },
] as const;

export const MAIN_EMOTIONS = ["😢", "😕", "🙂", "😄", "🤩"] as const;

export const ANIMATION_CONFIG = {
  duration: 620,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

export const SPRING_CONFIG = {
  damping: 18,
  stiffness: 140,
  mass: 0.9,
} as const;

export const INSIGHTS_ANIMATION_CONFIG = {
  duration: 220,
  easing: Easing.bezier(0.22, 1, 0.36, 1),
} as const;

export const LIGHT_GRADIENT = ["#EEE", "#DDD"] as const;
export const DARK_GRADIENT = ["#2E2E2E", "#3A3A3A"] as const;

export const DEFAULT_EMOJI = "fine";
export const DEFAULT_NEW_TAG = {
  name: "New Tag",
  emoji: "🆕",
} as const;
