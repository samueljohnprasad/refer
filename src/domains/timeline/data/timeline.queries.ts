import { useQuery } from '@tanstack/react-query';
import { timelineKeys } from './timeline.keys';
import { timelineRepo } from './timeline.repo';

export function useDailyTimeline({ page, pageSize }: { page: number; pageSize: number }) {
  return useQuery({
    queryKey: timelineKeys.daily(page, pageSize),
    queryFn: () => timelineRepo.getDailyTimeline(page, pageSize),
    staleTime: 60_000,
  });
}

export function useWeeklyTimeline({ page, pageSize }: { page: number; pageSize: number }) {
  return useQuery({
    queryKey: timelineKeys.weekly(page, pageSize),
    queryFn: () => timelineRepo.getWeeklyTimeline(page, pageSize),
    staleTime: 60_000,
  });
}

export function useMonthlyTimeline({ page, pageSize }: { page: number; pageSize: number }) {
  return useQuery({
    queryKey: timelineKeys.monthly(page, pageSize),
    queryFn: () => timelineRepo.getMonthlyTimeline(page, pageSize),
    staleTime: 60_000,
  });
}
