import { useCallback } from "react";
import { useStreak } from "@/src/hooks/useStreak";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
  weeklyProgress: boolean[]; // 7 days: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
}

interface UseStreakTrackerReturn {
  streakData: StreakData;
  isLoading: boolean;
  isPerfectWeekPossible: boolean;
  refetch: () => Promise<void>;
}

export const useStreakTracker = (): UseStreakTrackerReturn => {
  const {
    streak,
    currentStreak,
    longestStreak,
    weeklyProgress,
    isLoading,
    refetch,
  } = useStreak();

  return {
    streakData: {
      currentStreak,
      longestStreak,
      lastEntryDate: streak?.lastActivityDate || null,
      weeklyProgress: weeklyProgress.days,
    },
    isLoading,
    isPerfectWeekPossible: weeklyProgress.perfectWeekPossible,
    refetch,
  };
};
