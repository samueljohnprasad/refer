import { useMutation, useQueryClient } from '@tanstack/react-query';
import { timelineKeys } from './timeline.keys';
import { timelineRepo } from './timeline.repo';

export function useGenerateDailyInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date }: { date: string }) => timelineRepo.generateDailyInsight(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.all });
    },
  });
}

export function useGenerateWeeklyInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ week_index, year }: { week_index: number; year: number }) => timelineRepo.generateWeeklyInsight(week_index, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.all });
    },
  });
}

export function useGenerateMonthlyInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ month, year }: { month: number; year: number }) => timelineRepo.generateMonthlyInsight(month, year),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.all });
    },
  });
}
