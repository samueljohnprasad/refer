// ponytail: pure derivation for .agents/exercises.html's `chart()` — which days to plot, where, and
// which one was brightest. No JSX, no hooks. Mood data in this app is a 1-5 daily average (the
// prototype's 0-10 is stretched ×2 for geometry only; labels always show the real 1-5 value).
import { addDays, differenceInCalendarDays, format } from 'date-fns';

export const CHART_W = 308;
export const CHART_H = 160;
const STEP = 44;
const BASE = 112;
const SCALE = 2 * 9.6; // 1-5 → 0-10 → 9.6px per point

export const moodX = (i: number): number => i * STEP + 22;
export const moodY = (v: number): number => BASE - v * SCALE;

export interface MoodDay {
  key: string;
  letter: string;
  short: string;
  isToday: boolean;
  isAhead: boolean;
  /** real 1-5 daily average; null = nothing logged (never invented) */
  value: number | null;
  practiced: boolean;
  x: number;
  y: number;
}

export interface MoodWeek {
  days: MoodDay[];
  peak: MoodDay | null;
  line: string | null;
  area: string | null;
}

export interface MoodWeekInput {
  start: Date;
  today: Date;
  moods: ReadonlyMap<string, number>;
  /** local yyyy-MM-dd days with a completed exercise or a mood log */
  showedUp: ReadonlySet<string>;
  locale?: string;
}

export function buildMoodWeek({ start, today, moods, showedUp, locale }: MoodWeekInput): MoodWeek {
  const todayIdx = differenceInCalendarDays(today, start);
  const days: MoodDay[] = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(start, i);
    const key = format(date, 'yyyy-MM-dd');
    const isAhead = i > todayIdx;
    const value = isAhead ? null : moods.get(key) ?? null;
    return {
      key,
      letter: date.toLocaleDateString(locale, { weekday: 'narrow' }),
      short: date.toLocaleDateString(locale, { weekday: 'short' }),
      isToday: i === todayIdx,
      isAhead,
      value,
      practiced: !isAhead && showedUp.has(key),
      x: moodX(i),
      y: value === null ? BASE : moodY(value),
    };
  });

  const logged = days.filter((d) => d.value !== null);
  // strictly greater, so the earliest of equal days wins (same as the prototype)
  const peak = logged.reduce<MoodDay | null>((best, d) => (best === null || d.value! > best.value! ? d : best), null);

  if (logged.length < 2) return { days, peak, line: null, area: null };
  const line = logged
    .map((d, i) => {
      if (i === 0) return `M${d.x} ${d.y}`;
      const p = logged[i - 1];
      const m = (p.x + d.x) / 2;
      return `C${m} ${p.y} ${m} ${d.y} ${d.x} ${d.y}`;
    })
    .join(' ');
  const area = `${line} L${logged[logged.length - 1].x} ${BASE + 6} L${logged[0].x} ${BASE + 6} Z`;
  return { days, peak, line, area };
}
