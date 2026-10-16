import type {
  DeterministicInsightResult,
  InsightObservationV1,
} from "./insightObservation";

const ACTIVITY_WINDOW_DAYS = 7;
const PATTERN_WINDOW_DAYS = 30;

function getLocalDate(now: Date, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function subtractDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() - days);
  return value.toISOString().slice(0, 10);
}

function isDateInWindow(date: string, start: string, end: string): boolean {
  return date >= start && date <= end;
}

function isValidTimezone(timezone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format();
    return true;
  } catch {
    return false;
  }
}

function countMostFrequentPath(observations: InsightObservationV1[]): string | null {
  const counts = new Map<string, number>();
  for (const observation of observations) {
    const pathId = observation.metrics.path_id;
    counts.set(pathId, (counts.get(pathId) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}

export function evaluateDeterministicPattern(
  observations: InsightObservationV1[],
  now: Date,
  timezone: string,
): DeterministicInsightResult {
  if (!isValidTimezone(timezone)) {
    return {
      state: "invalid-timezone",
      activityCount: 0,
      observationCount: 0,
      activeDayCount: 0,
      windowDays: PATTERN_WINDOW_DAYS,
      patternPathId: null,
    };
  }

  const today = getLocalDate(now, timezone);
  const activityStart = subtractDays(today, ACTIVITY_WINDOW_DAYS - 1);
  const patternStart = subtractDays(today, PATTERN_WINDOW_DAYS - 1);
  const activityObservations = observations.filter((observation) =>
    isDateInWindow(observation.local_date, activityStart, today),
  );
  const patternObservations = observations.filter((observation) =>
    isDateInWindow(observation.local_date, patternStart, today),
  );
  const activeDays = new Set(patternObservations.map((observation) => observation.local_date));

  return {
    state:
      patternObservations.length >= 5 && activeDays.size >= 3
        ? "ready"
        : "insufficient-data",
    activityCount: new Set(
      activityObservations.map((observation) => observation.practice_session_id),
    ).size,
    observationCount: patternObservations.length,
    activeDayCount: activeDays.size,
    windowDays: PATTERN_WINDOW_DAYS,
    patternPathId: countMostFrequentPath(patternObservations),
  };
}
