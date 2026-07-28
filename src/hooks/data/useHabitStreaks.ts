import { useQuery } from "@tanstack/react-query";
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

const HABIT_STREAKS_QUERY_KEY = "habit_streaks";

// ponytail: react-query habit streak calculator with 5m cache
async function fetchHabitStreaksApi(userId: string): Promise<Record<string, StreakInfo>> {
  const { data, error } = await supabase
    .from("habit_completions")
    .select("habit_id, completed_date")
    .eq("user_id", userId)
    .order("completed_date", { ascending: false });

  if (error) throw error;

  if (!data) return {};

  const completionsByHabit: Record<string, string[]> = {};
  data.forEach((row) => {
    if (!completionsByHabit[row.habit_id]) {
      completionsByHabit[row.habit_id] = [];
    }
    completionsByHabit[row.habit_id].push(row.completed_date);
  });

  const result: Record<string, StreakInfo> = {};
  const today = new Date();
  const yesterday = subDays(today, 1);

  Object.keys(completionsByHabit).forEach((habitId) => {
    const dates = completionsByHabit[habitId].map((d) => parseISO(d));
    const uniqueDateStrings = Array.from(
      new Set(dates.map((d) => format(d, "yyyy-MM-dd")))
    );
    const uniqueDates = uniqueDateStrings.map((d) => parseISO(d));

    uniqueDates.sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;

    if (uniqueDates.length > 0) {
      const lastCompletion = uniqueDates[0];
      const isToday = isSameDay(lastCompletion, today);
      const isYesterday = isSameDay(lastCompletion, yesterday);

      if (isToday || isYesterday) {
        currentStreak = 1;
        let currentDate = lastCompletion;

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

  return result;
}

export const useHabitStreaks = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;

  const {
    data: streaks = {},
    isLoading: loading,
    refetch: refetchStreaks,
  } = useQuery<Record<string, StreakInfo>>({
    queryKey: [HABIT_STREAKS_QUERY_KEY, userId],
    queryFn: () => fetchHabitStreaksApi(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  return { streaks, loading, refetchStreaks };
};
