import type { ExerciseType } from "@/src/types/exerciseFlow";
import { PRE_POST_FIELDS } from "@/src/constants/insights";
import { average } from "./aggregation";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TemporalPattern {
  type: "time_of_day" | "day_of_week";
  peakWindow: { start: number; end: number };
  entryCount: number;
  totalEntries: number;
  percentage: number;
  avgPreIntensity: number;
  offPeakAvgIntensity: number;
  confidence: number;
  bestExercise: ExerciseType | null;
  label: string;
}

interface TemporalEntry {
  hour: number;
  dayOfWeek: number;
  preIntensity: number;
  exerciseType: ExerciseType;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const HOUR_WINDOW_SIZE = 3;
const MIN_ENTRIES = 5;
const MIN_PEAK_PERCENTAGE = 0.4;
const MIN_DAY_MULTIPLIER = 1.5;
const MIN_INTENSITY = 6;

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const HOUR_LABELS: Record<number, string> = {
  0: "midnight–3am",
  3: "3–6am",
  6: "6–9am",
  9: "9am–noon",
  12: "noon–3pm",
  15: "3–6pm",
  18: "6–9pm",
  21: "9pm–midnight",
};

// ─── Extract temporal data from entries ──────────────────────────────────────

export function extractTemporalEntries(
  entries: Array<{
    exercise_type: ExerciseType;
    response: Record<string, any>;
    completed_at: string;
  }>,
): TemporalEntry[] {
  const result: TemporalEntry[] = [];

  for (const entry of entries) {
    const field = PRE_POST_FIELDS[entry.exercise_type];
    if (!field) continue;

    const pre = entry.response?.[field.pre];
    if (typeof pre !== "number") continue;

    const date = new Date(entry.completed_at);
    result.push({
      hour: date.getHours(),
      dayOfWeek: date.getDay(),
      preIntensity: pre,
      exerciseType: entry.exercise_type,
    });
  }

  return result;
}

// ─── Time-of-day pattern detection ───────────────────────────────────────────

export function detectTimeOfDayPattern(
  entries: TemporalEntry[],
): TemporalPattern | null {
  if (entries.length < MIN_ENTRIES) return null;

  // Bucket into 3-hour windows
  const windows: Map<number, TemporalEntry[]> = new Map();
  for (let start = 0; start < 24; start += HOUR_WINDOW_SIZE) {
    windows.set(start, []);
  }

  for (const entry of entries) {
    const windowStart =
      Math.floor(entry.hour / HOUR_WINDOW_SIZE) * HOUR_WINDOW_SIZE;
    windows.get(windowStart)!.push(entry);
  }

  // Find peak window
  let peakStart = 0;
  let peakCount = 0;
  for (const [start, windowEntries] of windows) {
    if (windowEntries.length > peakCount) {
      peakCount = windowEntries.length;
      peakStart = start;
    }
  }

  const percentage = peakCount / entries.length;
  if (percentage < MIN_PEAK_PERCENTAGE) return null;
  if (peakCount < MIN_ENTRIES) return null;

  const peakEntries = windows.get(peakStart)!;
  const avgPreIntensity = average(peakEntries.map((e) => e.preIntensity)) ?? 0;
  if (avgPreIntensity < MIN_INTENSITY) return null;

  // Off-peak average
  const offPeakEntries = entries.filter(
    (e) =>
      Math.floor(e.hour / HOUR_WINDOW_SIZE) * HOUR_WINDOW_SIZE !== peakStart,
  );
  const offPeakAvg = average(offPeakEntries.map((e) => e.preIntensity)) ?? 0;

  // Best exercise in this window
  const exerciseCounts: Record<string, { count: number; totalDelta: number }> =
    {};
  for (const entry of peakEntries) {
    const field = PRE_POST_FIELDS[entry.exerciseType];
    if (!field) continue;
    if (!exerciseCounts[entry.exerciseType]) {
      exerciseCounts[entry.exerciseType] = { count: 0, totalDelta: 0 };
    }
    exerciseCounts[entry.exerciseType].count++;
  }
  const bestExercise = Object.entries(exerciseCounts).sort(
    ([, a], [, b]) => b.count - a.count,
  )[0]?.[0] as ExerciseType | undefined;

  const confidence = percentage * (peakCount / entries.length);

  return {
    type: "time_of_day",
    peakWindow: { start: peakStart, end: peakStart + HOUR_WINDOW_SIZE },
    entryCount: peakCount,
    totalEntries: entries.length,
    percentage: Math.round(percentage * 100),
    avgPreIntensity: Math.round(avgPreIntensity * 10) / 10,
    offPeakAvgIntensity: Math.round(offPeakAvg * 10) / 10,
    confidence,
    bestExercise: bestExercise ?? null,
    label: `Peak: ${HOUR_LABELS[peakStart] ?? `${peakStart}:00–${peakStart + 3}:00`} (${Math.round(percentage * 100)}% of exercises)`,
  };
}

// ─── Day-of-week pattern detection ───────────────────────────────────────────

export function detectDayOfWeekPattern(
  entries: TemporalEntry[],
): TemporalPattern | null {
  if (entries.length < MIN_ENTRIES) return null;

  // Bucket by day of week
  const days: Map<number, TemporalEntry[]> = new Map();
  for (let d = 0; d < 7; d++) days.set(d, []);
  for (const entry of entries) {
    days.get(entry.dayOfWeek)!.push(entry);
  }

  const meanCount = entries.length / 7;

  // Find peak day
  let peakDay = 0;
  let peakCount = 0;
  for (const [day, dayEntries] of days) {
    if (dayEntries.length > peakCount) {
      peakCount = dayEntries.length;
      peakDay = day;
    }
  }

  if (peakCount < MIN_DAY_MULTIPLIER * meanCount) return null;
  if (peakCount < 3) return null;

  const peakEntries = days.get(peakDay)!;
  const avgPreIntensity = average(peakEntries.map((e) => e.preIntensity)) ?? 0;
  if (avgPreIntensity < MIN_INTENSITY) return null;

  const offPeakEntries = entries.filter((e) => e.dayOfWeek !== peakDay);
  const offPeakAvg = average(offPeakEntries.map((e) => e.preIntensity)) ?? 0;

  const bestExercise = Object.entries(
    peakEntries.reduce(
      (acc, e) => {
        acc[e.exerciseType] = (acc[e.exerciseType] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    ),
  ).sort(([, a], [, b]) => b - a)[0]?.[0] as ExerciseType | undefined;

  const percentage = peakCount / entries.length;

  return {
    type: "day_of_week",
    peakWindow: { start: peakDay, end: peakDay },
    entryCount: peakCount,
    totalEntries: entries.length,
    percentage: Math.round(percentage * 100),
    avgPreIntensity: Math.round(avgPreIntensity * 10) / 10,
    offPeakAvgIntensity: Math.round(offPeakAvg * 10) / 10,
    confidence: percentage,
    bestExercise: bestExercise ?? null,
    label: `Hardest day: ${DAY_NAMES[peakDay]} (avg ${avgPreIntensity.toFixed(1)})`,
  };
}

/**
 * Returns the notification hour (1 hour before peak start).
 * For time_of_day patterns: hour before window start.
 * For day_of_week patterns: returns 8am on the peak day (morning prep nudge).
 */
export function getNudgeSchedule(pattern: TemporalPattern): {
  hour: number;
  minute: number;
  weekday?: number;
} {
  if (pattern.type === "time_of_day") {
    const nudgeHour =
      pattern.peakWindow.start > 0 ? pattern.peakWindow.start - 1 : 23;
    return { hour: nudgeHour, minute: 45 };
  }
  // Day of week: nudge at 8am on the peak day
  return { hour: 8, minute: 15, weekday: pattern.peakWindow.start + 1 }; // expo uses 1=Sun
}
