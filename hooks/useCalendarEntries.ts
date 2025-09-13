import { useMemo } from 'react';
import { addDays, endOfMonth, format, startOfMonth } from 'date-fns';
import { generateTestMentalHealthData } from '@/data/testMentalHealthData';
import type { MoodEntry, MoodType } from '@/types/mentalHealth';

export interface UseCalendarEntriesReturn {
  markedDays: Record<string, string>; // YYYY-MM-DD -> emoji
  getEntriesForDate: (dateStr: string) => MoodEntry[];
}

const moodToEmojiMap: Record<MoodType | 'unknown', string> = {
  anxious: '😟',
  calm: '😌',
  hopeful: '🌟',
  stressed: '😓',
  peaceful: '🕊️',
  grateful: '🙏',
  sad: '😢',
  excited: '🎉',
  neutral: '😐',
  confused: '🤔',
  confident: '💪',
  overwhelmed: '🤯',
  unknown: '🙂',
};

export const useCalendarEntries = (monthDate: Date): UseCalendarEntriesReturn => {
  const { markedDays, entriesByDate } = useMemo(() => {
    const start = startOfMonth(monthDate);
    const end = endOfMonth(monthDate);

    // Build list of all dates in the month
    const days: Date[] = [];
    for (let d = start; d <= end; d = addDays(d, 1)) {
      days.push(d);
    }

    // Deterministic seed per month so the selection is stable for the same month
    const seed: number = Number(format(monthDate, 'yyyyMM'));
    let state: number = seed >>> 0;
    const rand = (): number => {
      // Simple LCG for reproducible randomness (0..1)
      state = (1664525 * state + 1013904223) % 0x100000000;
      return state / 0x100000000;
    };

    // Fisher-Yates shuffle on indices, then take first 5
    const indices: number[] = Array.from({ length: days.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      const tmp = indices[i];
      indices[i] = indices[j];
      indices[j] = tmp;
    }
    const pickCount: number = Math.min(5, indices.length);
    const selected = new Set<number>(indices.slice(0, pickCount));

    const dayEntries: Record<string, MoodEntry[]> = {};
    const markers: Record<string, string> = {};

    days.forEach((d, idx) => {
      if (!selected.has(idx)) return;
      const key = format(d, 'yyyy-MM-dd');
      const data = generateTestMentalHealthData(d);
      const entries = data.entries;
      if (entries.length > 0) {
        dayEntries[key] = entries;
        const latest = entries[entries.length - 1];
        const emoji = moodToEmojiMap[latest.primaryMood] ?? moodToEmojiMap.unknown;
        markers[key] = emoji;
      }
    });

    return { markedDays: markers, entriesByDate: dayEntries };
  }, [monthDate]);

  const getEntriesForDate = (dateStr: string): MoodEntry[] => {
    return entriesByDate[dateStr] ?? [];
  };

  return { markedDays, getEntriesForDate };
};
