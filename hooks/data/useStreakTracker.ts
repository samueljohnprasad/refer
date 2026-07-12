import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import dayjs from "dayjs";

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
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastEntryDate: null,
    weeklyProgress: [false, false, false, false, false, false, false],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStreakData = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // 1. Fetch official streak count and freeze count from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "current_streak, longest_streak, last_journal_date",
        )
        .eq("id", user.id)
        .single();

      // 2. Fetch daily moods for current week
      const weekStart = dayjs().startOf("week").format("YYYY-MM-DD"); // Sunday start
      const weekEnd = dayjs().endOf("week").format("YYYY-MM-DD"); // Saturday end

      const { data: weeklyMoods } = await supabase
        .from("daily_moods")
        .select("day")
        .eq("user_id", user.id)
        .gte("day", weekStart)
        .lte("day", weekEnd);

      // Map found entries to boolean array
      const weeklyProgress: boolean[] = [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ];

      weeklyMoods?.forEach((mood) => {
        if (mood.day) {
          const dayIndex = dayjs(mood.day).day();
          weeklyProgress[dayIndex] = true;
        }
      });

      const lastEntryDate = profile?.last_journal_date || null;

      setStreakData({
        currentStreak: profile?.current_streak || 0,
        longestStreak: profile?.longest_streak || 0,
        lastEntryDate,
        weeklyProgress,
      });
    } catch (err) {
      console.error("Error fetching streak data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);



  const isPerfectWeekPossible = useCallback((): boolean => {
    const todayIndex = dayjs().day();

    for (let i = 0; i < todayIndex; i++) {
      if (!streakData.weeklyProgress[i]) return false;
    }
    return true;
  }, [streakData.weeklyProgress]);

  useEffect(() => {
    fetchStreakData();
  }, [fetchStreakData]);

  return {
    streakData,
    isLoading,
    isPerfectWeekPossible: isPerfectWeekPossible(),
    refetch: fetchStreakData,
  };
};
