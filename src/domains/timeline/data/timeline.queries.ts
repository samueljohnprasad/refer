import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { timelineKeys } from './timeline.keys';
import { timelineRepo } from './timeline.repo';

export function useDailyTimeline({ pageSize }: { pageSize: number }) {
  return useInfiniteQuery({
    queryKey: timelineKeys.dailyInfinite(pageSize),
    queryFn: ({ pageParam }) => timelineRepo.getDailyTimeline(pageParam as number, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data || lastPage.data.length < pageSize) return undefined;
      return allPages.length + 1;
    },
    staleTime: 60_000,
  });
}

export function useWeeklyTimeline({ pageSize }: { pageSize: number }) {
  return useInfiniteQuery({
    queryKey: timelineKeys.weeklyInfinite(pageSize),
    queryFn: ({ pageParam }) => timelineRepo.getWeeklyTimeline(pageParam as number, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data || lastPage.data.length < pageSize) return undefined;
      return allPages.length + 1;
    },
    staleTime: 60_000,
  });
}

export function useMonthlyTimeline({ pageSize }: { pageSize: number }) {
  return useInfiniteQuery({
    queryKey: timelineKeys.monthlyInfinite(pageSize),
    queryFn: ({ pageParam }) => timelineRepo.getMonthlyTimeline(pageParam as number, pageSize),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data || lastPage.data.length < pageSize) return undefined;
      return allPages.length + 1;
    },
    staleTime: 60_000,
  });
}
