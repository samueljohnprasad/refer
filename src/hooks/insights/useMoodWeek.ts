// ponytail: container for the Practice mood chart — existing mood + showed-up hooks in,
// pure moodWeek model out. No new queries.
import { useMemo } from 'react';
import dayjs from 'dayjs';
import useFetchMoods, { type MoodsMap } from '@/hooks/data/useFetchMoods';
import { useWeekShowedUp } from '@/src/domains/exercises/ui/containers/useWeekShowedUp';
import { ISO_DATE_FORMAT } from '@/src/utils/date';
import { buildMoodWeek, type MoodWeek } from '@/src/screens/InsightsScreen/domain/moodWeek';

export function useMoodWeek(start: Date, end: Date, locale?: string): { week: MoodWeek; isLoading: boolean } {
  const { data: moods, isLoading } = useFetchMoods({
    visibleStartDate: dayjs(start).format(ISO_DATE_FORMAT),
    visibleEndDate: dayjs(end).format(ISO_DATE_FORMAT),
  });
  const { data: showedUp } = useWeekShowedUp();

  const week = useMemo(
    () =>
      buildMoodWeek({
        start,
        today: new Date(),
        moods: (moods as MoodsMap | undefined) ?? new Map<string, number>(),
        showedUp: showedUp ?? new Set<string>(),
        locale,
      }),
    [start, moods, showedUp, locale],
  );
  return { week, isLoading };
}
