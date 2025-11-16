import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { useUserProfile } from "./useUserProfile";
import { formateDate_y_m_d } from "@/src/utils/date";

export interface LogStreakResult {
  updated: boolean;
  newCurrentStreak?: number;
  newLongestStreak?: number;
}

export const useDailyStreak = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: profile } = useUserProfile();

  const logStreakIfNeeded = useCallback(async (): Promise<LogStreakResult> => {
    if (!user?.id) return { updated: false };

    const todayStr: string = formateDate_y_m_d(new Date());

    const lastDateStr = profile?.lastJournalDate
      ? formateDate_y_m_d(profile.lastJournalDate)
      : null;

    if (lastDateStr === todayStr) {
      return { updated: false };
    }

    let newCurrent: number = 1;
    const currentStreak: number = profile?.currentStreak ?? 0;
    const longestStreak: number = profile?.longestStreak ?? 0;

    if (lastDateStr) {
      const diffDays: number = dayjs(todayStr).diff(dayjs(lastDateStr), "day");
      if (diffDays === 1) {
        newCurrent = currentStreak + 1;
      } else if (diffDays > 1) {
        newCurrent = 1;
      } else {
        newCurrent = Math.max(currentStreak, 1);
      }
    } else {
      newCurrent = 1;
    }

    const newLongest: number = Math.max(newCurrent, longestStreak);

    const { error } = await supabase
      .from("profiles")
      .update({
        current_streak: newCurrent,
        longest_streak: newLongest,
        last_journal_date: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      throw error;
    }

    await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

    return {
      updated: true,
      newCurrentStreak: newCurrent,
      newLongestStreak: newLongest,
    };
  }, [
    user?.id,
    profile?.lastJournalDate,
    profile?.currentStreak,
    profile?.longestStreak,
    queryClient,
  ]);

  return { logStreakIfNeeded };
};
