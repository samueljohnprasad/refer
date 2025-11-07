import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import {
  calculateStreak,
  getTodayDate,
  isStreakBroken,
} from "./useStreakCalculation";

interface UpdateStreakParams {
  userId: string;
  forceReset?: boolean; // For app launch checks
}

interface StreakData {
  current_streak: number;
  longest_streak: number;
  last_journal_date: string;
  streak_freeze_count: number;
}

/**
 * Hook to update user's streak after journaling
 */
export const useUpdateStreak = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, forceReset = false }: UpdateStreakParams) => {
      // 1. Get current streak data from profile
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select(
          "current_streak, longest_streak, last_journal_date, streak_freeze_count"
        )
        .eq("id", userId)
        .single();

      if (fetchError) {
        console.error("Error fetching profile for streak:", fetchError);
        throw fetchError;
      }

      const currentStreak = profile?.current_streak ?? 0;
      const longestStreak = profile?.longest_streak ?? 0;
      const lastJournalDate = profile?.last_journal_date;
      const streakFreezeCount = profile?.streak_freeze_count ?? 0;

      // 2. Check if this is a force reset (app launch check)
      if (forceReset && isStreakBroken(lastJournalDate, currentStreak)) {
        // Reset streak to 0
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            current_streak: 0,
            last_journal_date: lastJournalDate, // Keep last date
          })
          .eq("id", userId);

        if (updateError) {
          console.error("Error resetting streak:", updateError);
          throw updateError;
        }

        return {
          current_streak: 0,
          longest_streak: longestStreak,
          last_journal_date: lastJournalDate,
          streak_freeze_count: streakFreezeCount,
        };
      }

      // 3. Calculate new streak
      const todayDate = getTodayDate();
      const streakResult = calculateStreak(
        lastJournalDate,
        currentStreak,
        longestStreak,
        todayDate
      );

      // 4. Only update if needed
      if (!streakResult.shouldUpdate) {
        return {
          current_streak: currentStreak,
          longest_streak: longestStreak,
          last_journal_date: lastJournalDate,
          streak_freeze_count: streakFreezeCount,
        };
      }

      // 5. Update database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          current_streak: streakResult.newStreak,
          longest_streak: streakResult.longestStreak,
          last_journal_date: todayDate,
        })
        .eq("id", userId);

      if (updateError) {
        console.error("Error updating streak:", updateError);
        throw updateError;
      }

      return {
        current_streak: streakResult.newStreak,
        longest_streak: streakResult.longestStreak,
        last_journal_date: todayDate,
        streak_freeze_count: streakFreezeCount,
      };
    },
    onSuccess: () => {
      // Invalidate user profile query to refresh UI
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.error("Failed to update streak:", error);
    },
  });
};

/**
 * Hook to check and reset broken streaks on app launch
 */
export const useCheckStreakOnLaunch = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, last_journal_date")
        .eq("id", userId)
        .single();

      if (!profile) return null;

      const currentStreak = profile.current_streak ?? 0;
      const lastJournalDate = profile.last_journal_date;

      // Check if streak is broken
      if (isStreakBroken(lastJournalDate, currentStreak)) {
        // Reset streak
        await supabase
          .from("profiles")
          .update({ current_streak: 0 })
          .eq("id", userId);

        return { streakBroken: true, previousStreak: currentStreak };
      }

      return { streakBroken: false, currentStreak };
    },
  });
};
