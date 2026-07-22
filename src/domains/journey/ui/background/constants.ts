import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export { SCREEN_WIDTH, SCREEN_HEIGHT };

// ── Light mode ──────────────────────────────────────────────────────────────

export const BACKGROUND_GRADIENTS: Record<
  string,
  { top: string; bottom: string }
> = {
  green: { top: "#EEF7EC", bottom: "#D4EDCF" },
  blue: { top: "#EBF5FC", bottom: "#CCE7F9" },
  purple: { top: "#F3EEFA", bottom: "#E4D4F4" },
  orange: { top: "#FFF6E8", bottom: "#FFE8C2" },
};

export const DEFAULT_GRADIENT = { top: "#F8FAF7", bottom: "#EEF2EC" };

export const PARTICLE_COLORS: Record<string, string[]> = {
  green: ["#A5D6A7", "#81C784", "#C8E6C9"],
  blue: ["#90CAF9", "#64B5F6", "#BBDEFB"],
  purple: ["#CE93D8", "#BA68C8", "#E1BEE7"],
  orange: ["#FFCC80", "#FFB74D", "#FFE0B2"],
};

export const PATH_GLOW_COLORS: Record<string, string> = {
  green: "rgba(88, 204, 2, 0.12)",
  blue: "rgba(28, 176, 246, 0.12)",
  purple: "rgba(206, 130, 255, 0.12)",
  orange: "rgba(255, 150, 0, 0.12)",
};

// ── Dark mode ───────────────────────────────────────────────────────────────

export const BACKGROUND_GRADIENTS_DARK: Record<
  string,
  { top: string; bottom: string }
> = {
  green: { top: "#1A2E1A", bottom: "#0F1F0F" },
  blue: { top: "#141E2B", bottom: "#0C1520" },
  purple: { top: "#1E1528", bottom: "#140E1E" },
  orange: { top: "#2B1E0F", bottom: "#1F1508" },
};

export const DEFAULT_GRADIENT_DARK = { top: "#1A1D1A", bottom: "#121412" };

export const PARTICLE_COLORS_DARK: Record<string, string[]> = {
  green: ["#2E7D32", "#388E3C", "#1B5E20"],
  blue: ["#1565C0", "#1976D2", "#0D47A1"],
  purple: ["#7B1FA2", "#8E24AA", "#6A1B9A"],
  orange: ["#E65100", "#F57C00", "#BF360C"],
};

export const PATH_GLOW_COLORS_DARK: Record<string, string> = {
  green: "rgba(88, 204, 2, 0.20)",
  blue: "rgba(28, 176, 246, 0.20)",
  purple: "rgba(206, 130, 255, 0.20)",
  orange: "rgba(255, 150, 0, 0.20)",
};

// ── Shared constants ────────────────────────────────────────────────────────

export const PARTICLE_COUNT = 18;
export const DECORATION_OPACITY = 0.35;
export const GLOW_RADIUS = 60;
export const TRANSITION_OVERLAP_PX = 120;
