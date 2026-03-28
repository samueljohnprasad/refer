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

    const today = dayjs().startOf("day");
    let lastJournalDay = null;
    
    if (profile?.lastJournalDate) {
      lastJournalDay = dayjs(profile.lastJournalDate).startOf("day");
    }

    if (lastJournalDay && lastJournalDay.isSame(today, "day")) {
      return { updated: false };
    }

    let newStreak = 1;

    if (lastJournalDay && lastJournalDay.isSame(today.subtract(1, "day"), "day")) {
      // Logged yesterday, increment the streak cleanly
      newStreak = (profile?.currentStreak || 0) + 1;
    } else {
      // First log ever, or missed a day (streak resets)
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, profile?.longestStreak || 0);

    const { error } = await supabase
      .from("profiles")
      .update({
        current_streak: newStreak,
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
      newCurrentStreak: newStreak,
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
