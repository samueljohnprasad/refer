import type { StressProjectionDatum } from "./types";

export const CHART_DATA: StressProjectionDatum[] = [
    { x: 0, happy: 63, other: 54 },
    { x: 1, happy: 65, other: 20 },
    { x: 2, happy: 61, other: 8 },
    { x: 3, happy: 47, other: 62 },
    { x: 4, happy: 18, other: 80 },
    { x: 5, happy: 10, other: 82 },
];

export const CHART_Y_KEYS: Array<keyof Pick<StressProjectionDatum, "happy" | "other">> = [
    "happy",
    "other",
];

export const OUTER_GRADIENT_COLORS: [string, string, string] = [
    "rgba(212, 242, 201, 0.88)",
    "rgba(248, 252, 246, 0.42)",
    "rgba(210, 241, 199, 0.88)",
];

export const CARD_ROTATION = [{ rotate: "-4deg" }] as const;
export const BADGE_ROTATION = [{ rotate: "-1.5deg" }] as const;
export const BADGE_TAIL_ROTATION = [{ rotate: "45deg" }] as const;

export const COLORS = {
    axis: "rgba(226, 223, 220, 0.95)",
    comparison: "#FF7257",
    comparisonGhost: 0.16,
    happy: "#4DA85A",
    shadow: "#9CCB90",
    text: "#1F2937",
    time: "#9CA3AF",
    white: "#FFFFFF",
} as const;

export const CURVE_TYPE = "catmullRom" as const;
export const DASH_INTERVALS = [12, 12];

export const GRAPH_ANIMATION = {
    startDotDelay: 140,
    startDotDuration: 300,
    comparisonLineDelay: 120,
    comparisonLineDuration: 1480,
    comparisonDashDelay: 1260,
    comparisonDashDuration: 420,
    comparisonDotDelay: 1360,
    comparisonDotDuration: 260,
    happyLineDelay: 420,
    happyLineDuration: 1880,
    endDotDelay: 2080,
    endDotDuration: 300,
    badgeDelay: 2200,
    badgeDuration: 320,
} as const;

export const MARKER_RADII = {
    greenOuter: 10,
    greenInner: 5.3,
    comparison: 6.1,
} as const;
