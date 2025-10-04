// Centralized mood color mapping for consistent usage across the app
// 1=red, 2=orange, 3=yellow, 4=green, 5=blue

export type MoodScore = 1 | 2 | 3 | 4 | 5;

export const MOOD_COLORS: Record<MoodScore, string> = {
  1: "#EF4444", // red-500
  2: "#F97316", // orange-500
  3: "#EAB308", // yellow/amber-500
  4: "#10B981", // emerald-500
  5: "#0EA5E9", // sky-500
};

export const MOOD_PALE_COLORS: Record<MoodScore, string> = {
  1: "#FEE2E2", // red-100
  2: "#FFEDD5", // orange-100
  3: "#FEF3C7", // amber-100
  4: "#DCFCE7", // green-100
  5: "#E0F2FE", // blue-100
};

export const MOOD_COLORS_ARR = Object.values(MOOD_COLORS);
export const MOOD_PALE_COLORS_ARR = [
  "#fecaca",
  "#fdba74",
  "#fde047",
  "#86efac",
  "#93c5fd",
];

export const MOOD_PALE_COLORS_ARR_200 = [
  "#fecaca",
  "#fed7aa",
  "#fef08a",
  "#bbf7d0",
  "#bfdbfe",
];

export const MOOD_PALE_COLORS_ARR_100 = [
  "#fee2e2",
  "#ffedd5",
  "#fef9c3",
  "#dcfce7",
  "#dbeafe",
];
export function clampToMoodScore(value: number): MoodScore {
  const v = Math.round(value);
  return Math.min(5, Math.max(1, v)) as unknown as MoodScore;
}

export function moodScoreToColor(value: number): string {
  return MOOD_COLORS[clampToMoodScore(value)];
}

export function moodScoreToPale(value: number): string {
  return MOOD_PALE_COLORS[clampToMoodScore(value)];
}
