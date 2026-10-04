export type SurgePhase =
  "beginning" | "rising" | "peak" | "easing" | "complete";

export interface SurgePhaseConfig {
  translationKey: "beginning" | "rising" | "peak" | "easing";
  tagColor: string;
  tagBg: string;
}

export const PHASE_CONFIGS: Record<SurgePhase, SurgePhaseConfig> = {
  beginning: {
    translationKey: "beginning",
    tagColor: "#6B6B6B",
    tagBg: "#EAE8E3",
  },
  rising: { translationKey: "rising", tagColor: "#C76F00", tagBg: "#FEF3C7" },
  peak: { translationKey: "peak", tagColor: "#C2410C", tagBg: "#FFEDD5" },
  easing: { translationKey: "easing", tagColor: "#29452A", tagBg: "#E5EDE1" },
  complete: { translationKey: "easing", tagColor: "#29452A", tagBg: "#E5EDE1" },
};

const CURVE_POINTS: [number, number][] = [
  [0, 108],
  [0.08, 106],
  [0.16, 94],
  [0.26, 68],
  [0.36, 38],
  [0.44, 24],
  [0.5, 20],
  [0.56, 24],
  [0.64, 40],
  [0.72, 62],
  [0.8, 80],
  [0.88, 94],
  [0.94, 101],
  [1, 104],
];

export function getSurgePoint(progress: number): { x: number; y: number } {
  const clamped = Math.max(0, Math.min(1, progress));
  let y = 104;
  if (clamped <= 0) y = CURVE_POINTS[0][1];
  else if (clamped >= 1) y = CURVE_POINTS[CURVE_POINTS.length - 1][1];
  else {
    for (let index = 0; index < CURVE_POINTS.length - 1; index++) {
      const [start, startY] = CURVE_POINTS[index];
      const [end, endY] = CURVE_POINTS[index + 1];
      if (clamped < start || clamped > end) continue;
      const ratio = (clamped - start) / (end - start);
      const easedRatio = ratio * ratio * (3 - 2 * ratio);
      y = startY + (endY - startY) * easedRatio;
      break;
    }
  }
  return { x: 24 + clamped * 252, y };
}

export function buildSurgePath(maxProgress: number): string {
  const steps = Math.max(2, Math.round(maxProgress * 60));
  return Array.from({ length: steps + 1 }, (_, index) => {
    const point = getSurgePoint((index / steps) * maxProgress);
    return `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }).join(" ");
}

export const FULL_GHOST_PATH = buildSurgePath(1);

export function getSurgePhase(progress: number): SurgePhase {
  if (progress < 0.12) return "beginning";
  if (progress < 0.44) return "rising";
  if (progress <= 0.6) return "peak";
  if (progress < 0.95) return "easing";
  return "complete";
}
