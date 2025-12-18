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
    if (!profile?.lastJournalDate) return { updated: false };
    if (!profile?.currentStreak) return { updated: false };

    if (dayjs(profile?.lastJournalDate).isSame(new Date(), "day")) {
      return { updated: false };
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        current_streak: profile?.currentStreak ? profile?.currentStreak + 1 : 1,
        last_journal_date: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      throw error;
    }

    await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

    return {
      updated: true,
      newCurrentStreak: profile?.currentStreak ? profile?.currentStreak + 1 : 1,
      newLongestStreak: profile?.longestStreak ? profile?.longestStreak + 1 : 1,
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
