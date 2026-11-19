// Pure practice rules (AD-13, AD-16, AD-25): no React, no I/O, no clock read.
import type { ExerciseCategory, ExerciseType } from '../../../types/exerciseFlow';
import { EXERCISE_CATEGORY_MAP } from '../../../data/exerciseCategoryMap';

export interface PracticeEntry {
  exercise_type: ExerciseType | string;
  status: string; // wider than ExerciseStatus: legacy rows carry 'summary' / 'checker_completed'
  selected_date?: string | null;
  response?: { balancedThought?: string | null } | null;
}

const PRACTICE_STATUSES = ['completed', 'summary', 'checker_completed'];

export const countsAsPractice = (entry: Pick<PracticeEntry, 'status'>): boolean =>
  PRACTICE_STATUSES.includes(entry.status);

export type Rung = 2 | 3 | 4 | null;

export function entryRung(entry: PracticeEntry): Rung {
  if (!countsAsPractice(entry)) return null;
  if (entry.exercise_type === 'thought_reframing') return 4;
  if (entry.exercise_type !== 'thought_catcher') return null;
  return entry.response?.balancedThought?.trim() ? 3 : 2;
}

const ymd = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Monday to Sunday of the local week containing `now`, as local YYYY-MM-DD. */
export function weekBoundsYmd(now: Date): { start: string; end: string } {
  const sinceMonday = (now.getDay() + 6) % 7;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - sinceMonday);
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  return { start: ymd(start), end: ymd(end) };
}

/** Local YYYY-MM-DD of a stored date: a plain day passes through, a timestamp moves to the device's local day. */
export function localDay(stored: string): string {
  return stored.length <= 10 ? stored : ymd(new Date(stored));
}

/** Local days this week with a completed exercise (by selected_date) or a mood log. In-progress rows never count. */
export function showedUpDays(
  entries: Pick<PracticeEntry, 'status' | 'selected_date'>[],
  moodDates: (string | null)[],
  now: Date,
): Set<string> {
  const { start, end } = weekBoundsYmd(now);
  const days = [
    ...entries.filter(countsAsPractice).map((e) => e.selected_date),
    ...moodDates,
  ]
    .filter((d): d is string => !!d)
    .map(localDay)
    .filter((d) => d >= start && d <= end);
  return new Set(days);
}

/** AD-13: a thought_catcher with no fairer thought has no before-and-after to read. */
export const isCatchOnly = (type: string, response?: PracticeEntry['response'], status = 'completed'): boolean =>
  type === 'thought_catcher' && entryRung({ exercise_type: type, status, response }) === 2;

export type TopicCounts = Record<ExerciseCategory, number>;

export function practiceCounts(
  entries: Pick<PracticeEntry, 'exercise_type' | 'status' | 'selected_date'>[],
  now: Date,
): { lifetime: number; thisWeek: number; byTopic: TopicCounts } {
  const { start, end } = weekBoundsYmd(now);
  const practice = entries.filter(countsAsPractice);
  // ISO date strings compare lexicographically; null selected_date never lands in a week
  const thisWeek = practice.filter((e) => !!e.selected_date && e.selected_date >= start && e.selected_date <= end).length;
  const byTopic: TopicCounts = { cbt_core: 0, mindfulness: 0, anxiety: 0, overthinking: 0 };
  for (const e of practice) {
    const topic = EXERCISE_CATEGORY_MAP[e.exercise_type as ExerciseType];
    if (topic) byTopic[topic]++;
  }
  return { lifetime: practice.length, thisWeek, byTopic };
}
