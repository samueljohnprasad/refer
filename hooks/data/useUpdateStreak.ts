import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { calculateStreak, getTodayDate, isStreakBroken } from "./useStreakCalculation";

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
        .select("current_streak, longest_streak, last_journal_date, streak_freeze_count")
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
 * Hook to use a streak freeze (premium feature)
 */
export const useStreakFreeze = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // 1. Get current data
      const { data: profile, error: fetchError } = await supabase
        .from("profiles")
        .select("streak_freeze_count, subscription_plan")
        .eq("id", userId)
        .single();

      if (fetchError) throw fetchError;

      // 2. Check if user has premium
      const isPremium = profile?.subscription_plan === "premium" || 
                        profile?.subscription_plan === "pro";
      
      if (!isPremium) {
        throw new Error("Streak freeze is a premium feature");
      }

      // 3. Check if user has freezes available
      const freezeCount = profile?.streak_freeze_count ?? 0;
      if (freezeCount <= 0) {
        throw new Error("No streak freezes available");
      }

      // 4. Use one freeze
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          streak_freeze_count: freezeCount - 1,
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      return { freezesRemaining: freezeCount - 1 };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
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
