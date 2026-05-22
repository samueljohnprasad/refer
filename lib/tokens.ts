/**
 * TypeScript Design Token Constants
 *
 * Mirrors values defined in global.css @theme inline.
 * Use for icon color props, LinearGradient arrays, SVG fills —
 * anywhere a raw hex/number is required outside className.
 */

// ─── Sage Palette ───────────────────────────────────────────────────────
export const SAGE = {
  50: "#f4f1ea",
  100: "#e8e2d2",
  200: "#d4ccb5",
  300: "#a8b89a",
  400: "#7a9272",
  500: "#5a7a56",
  600: "#3f5a3d",
  700: "#2a3f2a",
  800: "#1a2a1a",
  selected: "#eef2e8",
  pill: "#eaf0e2",
} as const;

// ─── Brand Surfaces ─────────────────────────────────────────────────────
export const CREAM = "#faf6ed" as const;
export const CREAM_RAISED = "#f5f1e7" as const;
export const WARM_WHITE = "#fffcf5" as const;
export const TERRACOTTA = "#c8694b" as const;
export const TERRACOTTA_LIGHT = "#e8a88e" as const;
export const GOLD = "#d4a943" as const;
export const INK = "#1a2a1a" as const;
export const INK_SOFT = "#4a5a4a" as const;
export const INK_MUTED = "#7a8a7a" as const;
export const OFFWHITE = "#faf9f6" as const;

// ─── App Semantic Theme ─────────────────────────────────────────────────
export const THEME = {
  backgroundPrimary: "#ffffff",
  backgroundSecondary: "#f2efe8",
  backgroundCard: "#ffffff",
  textPrimary: "#1f2937",
  textSecondary: "#64748b",
  border: "#ded6c8",
  purpleLight: "#eee9ff",
  purplePrimary: "#7b61ff",
  purpleDeep: "#5f46e8",
} as const;

// ─── Light/Dark Resolved Tokens ─────────────────────────────────────────
export const LIGHT_TOKENS = {
  primary: "#171717",
  primaryForeground: "#fafafa",
  card: "#ffffff",
  secondary: "#f5f5f5",
  secondaryForeground: "#171717",
  background: "#ffffff",
  foreground: "#0a0a0a",
  muted: "#f5f5f5",
  mutedForeground: "#737373",
  destructive: "#e7000b",
  border: "#e5e5e5",
  input: "#e5e5e5",
  ring: "#d4d4d4",
  accent: "#f7f7f7",
  accentForeground: "#343434",
} as const;

export const DARK_TOKENS = {
  primary: "#fff5f5",
  primaryForeground: "#171717",
  card: "#171717",
  secondary: "#262626",
  secondaryForeground: "#fafafa",
  background: "#0a0a0a",
  foreground: "#fafafa",
  muted: "#262626",
  mutedForeground: "#a1a1a1",
  destructive: "#ff6467",
  border: "#2e2e2e",
  input: "#2e2e2e",
  ring: "#737373",
  accent: "#262626",
  accentForeground: "#fafafa",
} as const;

export type ThemeTokens = {
  readonly [K in keyof typeof LIGHT_TOKENS]: string;
};

// ─── Border Radius (numeric px values) ──────────────────────────────────
export const RADIUS = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  "2xl": 20,
  "3xl": 24,
  full: 9999,
} as const;
