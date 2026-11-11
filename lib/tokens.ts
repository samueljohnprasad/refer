// ponytail: single source of truth for Happy core design system tokens
// derived directly from .agents/happy-ui.css and mobile-app-ui-design guidelines

export const HAPPY_COLORS = {
  // Base & surfaces
  bg: "#ffffff",
  surface: "#ffffff",
  surface2: "#f7f7f7",
  tint: "#f2f8ef",
  sep: "#e5e5e5",
  rim: "#cfcfcf",

  // Text & labels
  label: "#142414",
  label2: "#4b4b4b",
  label3: "#767676",

  // Brand Sage
  accent: "#44633f", // SAGE[600]
  ink: "#5f7f58",    // SAGE[500]

  // Exercise illustration hues (washes only)
  hues: {
    catch: "#e6f0e2",
    reframe: "#fdf0d2",
    abc: "#e2eef8",
    act: "#fde5dc",
    ladder: "#ece6f7",
  },

  // Weather & gamification
  sun: "#f5b942",
  cloudLo: "#e4eee0",
  cloudHi: "#a9bfa0",
} as const;

export const HAPPY_TYPOGRAPHY = {
  family: {
    display: "Fredoka",
    body: "Nunito",
  },
  sizes: {
    cap: 12,    // tags, tiny meta
    foot: 13,   // captions, labels, help text
    sub: 15,    // secondary lines under a title
    body: 17,   // chat lines, rows, fields
    lead: 20,   // section headers, Happi's key statement
    h: 24,      // completion and sheet headlines
    title: 28,  // screen title, display face
    num: 34,    // hero numerals (count, stat), display face
  },
  weights: {
    body: "500" as const,
    display: "600" as const,
    strong: "700" as const,
  },
  lineHeights: {
    tight: 1.2,
    body: 1.45,
  },
} as const;

export const HAPPY_SPACING = {
  sp1: 4,
  sp2: 8,
  sp3: 12,
  sp4: 16,
  sp5: 24,
  sp6: 32,
  sp7: 48,

  // Semantic layout
  gutter: 16,
  gapSection: 32,
  gapCard: 12,
  padCard: 16,
} as const;

export const HAPPY_RADIUS = {
  none: 0,
  s: 12,
  m: 16,
  l: 24,
  pill: 9999,
} as const;

export const HAPPY_TACTILE = {
  borderWidth: 1,
  tactileBorderWidth: 2,
  tactileRimOffset: 3,
  tactileRimOffsetActive: 1,
} as const;

// Convenience aliases for backward compatibility and concise access
export const COLORS = HAPPY_COLORS;
export const TYPOGRAPHY = HAPPY_TYPOGRAPHY;
export const SPACING = HAPPY_SPACING;
export const RADIUS = HAPPY_RADIUS;
export const TACTILE = HAPPY_TACTILE;
