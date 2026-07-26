import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import {
  parseISO,
  differenceInDays,
  isSameDay,
  subDays,
  format,
} from "date-fns";

export interface StreakInfo {
  currentStreak: number;
}

export const useHabitStreaks = () => {
  const { session } = useAuth();
  const [streaks, setStreaks] = useState<Record<string, StreakInfo>>({});
  const [loading, setLoading] = useState(false);

  const fetchStreaks = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      setLoading(true);

      // Fetch all completions for the user, ordered by date
      const { data, error } = await supabase
        .from("habit_completions")
        .select("habit_id, completed_date")
        .eq("user_id", session.user.id)
        .order("completed_date", { ascending: false });

      if (error) throw error;

      if (!data) {
        setStreaks({});
        return;
      }

      // Group completions by habit_id
      const completionsByHabit: Record<string, string[]> = {};
      data.forEach((row) => {
        if (!completionsByHabit[row.habit_id]) {
          completionsByHabit[row.habit_id] = [];
        }
        completionsByHabit[row.habit_id].push(row.completed_date);
      });

      // Calculate streaks for each habit
      const result: Record<string, StreakInfo> = {};
      const today = new Date();
      const yesterday = subDays(today, 1);

      Object.keys(completionsByHabit).forEach((habitId) => {
        const dates = completionsByHabit[habitId].map((d) => parseISO(d));
        // Remove duplicates using local date string to avoid timezone shifts
        const uniqueDateStrings = Array.from(
          new Set(dates.map((d) => format(d, "yyyy-MM-dd")))
        );
        const uniqueDates = uniqueDateStrings.map((d) => parseISO(d));

        // Sort descending
        uniqueDates.sort((a, b) => b.getTime() - a.getTime());

        let currentStreak = 0;

        // Calculate current streak
        // Check if completed today or yesterday to start the streak
        if (uniqueDates.length > 0) {
          const lastCompletion = uniqueDates[0];
          const isToday = isSameDay(lastCompletion, today);
          const isYesterday = isSameDay(lastCompletion, yesterday);

          if (isToday || isYesterday) {
            currentStreak = 1;
            let currentDate = lastCompletion;

            // Iterate backwards
            for (let i = 1; i < uniqueDates.length; i++) {
              const prevDate = uniqueDates[i];
              const diff = differenceInDays(currentDate, prevDate);

              if (diff === 1) {
                currentStreak++;
                currentDate = prevDate;
              } else {
                break;
              }
            }
          }
        }

        result[habitId] = { currentStreak };
      });

      setStreaks(result);
    } catch (err) {
      console.error("Error fetching streaks:", err);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchStreaks();
  }, [fetchStreaks]);

  return { streaks, loading, refetchStreaks: fetchStreaks };
};
