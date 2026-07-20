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
    mutationFn: ({ date }: { date: string }) => timelineRepo.generateWeeklyInsight(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.all });
    },
  });
}

export function useGenerateMonthlyInsight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date }: { date: string }) => timelineRepo.generateMonthlyInsight(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: timelineKeys.all });
    },
  });
}
