import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import dayjs from "dayjs";

interface StreakData {
  currentStreak: number;
  lastEntryDate: string | null;
  weeklyProgress: boolean[]; // 7 days: [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
}

export const useStreakTracker = () => {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    lastEntryDate: null,
    weeklyProgress: [false, false, false, false, false, false, false],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStreakData = useCallback(async (): Promise<void> => {
    if (!user?.id) return;

    try {
      setIsLoading(true);

      // 1. Fetch official streak count from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak")
        .eq("id", user.id)
        .single();

      // 2. Fetch daily moods for current week
      const weekStart = dayjs().startOf("week").toISOString(); // Sunday start
      const weekEnd = dayjs().endOf("week").toISOString(); // Saturday end

      const { data: weeklyMoods } = await supabase
        .from("daily_moods")
        .select("day")
        .eq("user_id", user.id)
        .gte("day", weekStart)
        .lte("day", weekEnd);

      // Map found entries to boolean array
      const weeklyProgress = [false, false, false, false, false, false, false];

      weeklyMoods?.forEach((mood) => {
        if (mood.day) {
          const dayIndex = dayjs(mood.day).day();
          weeklyProgress[dayIndex] = true;
        }
      });

      setStreakData({
        currentStreak: profile?.current_streak || 0,
        lastEntryDate: null,
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
