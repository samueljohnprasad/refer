import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import dayjs from "dayjs";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastEntryDate: string | null;
  weeklyProgress: boolean[]; // 7 days: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  streakFreezeCount: number;
  isStreakAtRisk: boolean;
}

interface UseStreakTrackerReturn {
  streakData: StreakData;
  isLoading: boolean;
  isPerfectWeekPossible: boolean;
  refetch: () => Promise<void>;
  useStreakFreeze: () => Promise<boolean>;
  checkStreakAtRisk: () => boolean;
}

export const useStreakTracker = (): UseStreakTrackerReturn => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastEntryDate: null,
    weeklyProgress: [false, false, false, false, false, false, false],
    streakFreezeCount: 0,
    isStreakAtRisk: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const checkStreakAtRisk = useCallback((): boolean => {
    if (!streakData.lastEntryDate) return false;

    const lastEntry = dayjs(streakData.lastEntryDate);
    const today = dayjs().startOf("day");
    const hoursSinceLastEntry = today.diff(lastEntry, "hour");

    // Streak is at risk if no entry today and it's past 6 PM
    const currentHour = dayjs().hour();
    const hasEntryToday = streakData.weeklyProgress[today.day()];

    return !hasEntryToday && currentHour >= 18;
  }, [streakData.lastEntryDate, streakData.weeklyProgress]);

  const fetchStreakData = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // 1. Fetch official streak count and freeze count from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "current_streak, longest_streak, last_journal_date, streak_freeze_count",
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

      // Check if streak is at risk
      const lastEntryDate = profile?.last_journal_date || null;
      const hasEntryToday = weeklyProgress[dayjs().day()];
      const currentHour = dayjs().hour();
      const isAtRisk = !hasEntryToday && currentHour >= 18;

      setStreakData({
        currentStreak: profile?.current_streak || 0,
        longestStreak: profile?.longest_streak || 0,
        lastEntryDate,
        weeklyProgress,
        streakFreezeCount: profile?.streak_freeze_count || 0,
        isStreakAtRisk: isAtRisk,
      });
    } catch (err) {
      console.error("Error fetching streak data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  const useStreakFreeze = useCallback(async (): Promise<boolean> => {
    if (!user?.id || streakData.streakFreezeCount <= 0) {
      return false;
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          streak_freeze_count: streakData.streakFreezeCount - 1,
          last_journal_date: dayjs().format("YYYY-MM-DD"),
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error using streak freeze:", error);
        return false;
      }

      // Refresh streak data after using freeze
      await fetchStreakData();
      return true;
    } catch (err) {
      console.error("Error using streak freeze:", err);
      return false;
    }
  }, [user?.id, streakData.streakFreezeCount, fetchStreakData]);

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
    useStreakFreeze,
    checkStreakAtRisk,
  };
};
