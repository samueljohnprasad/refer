// Pure mood-band and hard-entry rules (AD-18, AD-19): no React, no I/O, no clock read.
import { localDay } from './practice';
import type { TrapChoice } from './trap';

export type MoodBand = 'good' | 'okay' | 'low' | 'notOkay';

export interface MoodRow {
  mood_score: number | null;
  input_method: string | null;
  selected_date: string;
}

export function moodBand(score: number): MoodBand {
  if (score >= 4) return 'good';
  if (score === 3) return 'okay';
  return score === 2 ? 'low' : 'notOkay';
}

/** Band of the latest check-in on `day` (local YYYY-MM-DD); null when there is none. */
export function bandForDay(moods: readonly MoodRow[], day: string): MoodBand | null {
  const latest = moods
    .filter((m) => m.input_method === 'emotion_logger' && m.mood_score !== null && localDay(m.selected_date) === day)
    .reduce<MoodRow | null>((best, m) => (best === null || new Date(m.selected_date) > new Date(best.selected_date) ? m : best), null);
  return latest ? moodBand(latest.mood_score!) : null;
}

export interface HardEntryInput {
  trap: TrapChoice | null;
  intensity: number;
  /** the raw after-rating; null when it was not set */
  post: number | null;
  bandToday: MoodBand | null;
}

export function isHardEntry({ trap, intensity, post, bandToday }: HardEntryInput): boolean {
  return bandToday === 'low' || bandToday === 'notOkay' || trap === 'none' || (post !== null && post >= intensity);
}
