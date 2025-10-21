import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { getTodayDate } from "./useStreakCalculation";

export interface StreakRecoveryOption {
  id: string;
  name: string;
  description: string;
  cost_type: "premium" | "coins" | "free";
  cost_amount: number;
  recovery_days: number; // How many days back can be recovered
  available: boolean;
}

export interface StreakHistory {
  id: number;
  user_id: string;
  streak_value: number;
  broken_at: string;
  recovered: boolean;
  recovered_at: string | null;
  created_at: string;
}

/**
 * Hook to get streak recovery options
 */
export const useStreakRecoveryOptions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["streakRecoveryOptions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Get user's subscription status
      const { data: profile } = await supabase
        .from("profiles")
        .select("subscription_plan, streak_freeze_count")
        .eq("id", user.id)
        .single();

      const isPremium =
        profile?.subscription_plan === "premium" ||
        profile?.subscription_plan === "pro";

      const options: StreakRecoveryOption[] = [
        {
          id: "premium-recovery",
          name: "Premium Recovery",
          description: "Restore your streak up to 3 days back",
          cost_type: "premium",
          cost_amount: 0,
          recovery_days: 3,
          available: isPremium,
        },
        {
          id: "freeze-recovery",
          name: "Use Streak Freeze",
          description: "Use one of your streak freezes to protect your streak",
          cost_type: "free",
          cost_amount: 0,
          recovery_days: 1,
          available: (profile?.streak_freeze_count ?? 0) > 0,
        },
      ];

      return options;
    },
    enabled: !!user?.id,
  });
};

/**
 * Hook to get streak history (for recovery purposes)
 */
export const useStreakHistory = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["streakHistory", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      // Query streak history from a hypothetical table
      // For now, we'll calculate from profile changes
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, longest_streak, last_journal_date")
        .eq("id", user.id)
        .single();

      // Check if streak was recently broken
      const lastJournalDate = profile?.last_journal_date;
      const currentStreak = profile?.current_streak ?? 0;

      if (!lastJournalDate) return [];

      const daysSinceLastJournal = Math.floor(
        (new Date().getTime() - new Date(lastJournalDate).getTime()) /
          (1000 * 60 * 60 * 24)
      );

      // If streak is broken (more than 1 day since last journal)
      if (daysSinceLastJournal > 1 && currentStreak === 0) {
        return [
          {
            id: 1,
            user_id: user.id,
            streak_value: profile?.longest_streak ?? 0,
            broken_at: lastJournalDate,
            recovered: false,
            recovered_at: null,
            created_at: lastJournalDate,
            days_ago: daysSinceLastJournal,
          },
        ];
      }

      return [];
    },
    enabled: !!user?.id,
  });
};

/**
 * Hook to recover a broken streak (premium feature)
 */
export const useRecoverStreak = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      recoveryOptionId,
      targetStreak,
    }: {
      recoveryOptionId: string;
      targetStreak: number;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("subscription_plan, streak_freeze_count, current_streak, longest_streak")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      const isPremium =
        profile?.subscription_plan === "premium" ||
        profile?.subscription_plan === "pro";

      // Validate recovery option
      if (recoveryOptionId === "premium-recovery") {
        if (!isPremium) {
          throw new Error("Premium subscription required for streak recovery");
        }

        // Restore streak
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            current_streak: targetStreak,
            last_journal_date: getTodayDate(),
          })
          .eq("id", user.id);

        if (updateError) throw updateError;

        return {
          success: true,
          message: `Streak recovered! You're back to ${targetStreak} days.`,
          new_streak: targetStreak,
        };
      } else if (recoveryOptionId === "freeze-recovery") {
        const freezeCount = profile?.streak_freeze_count ?? 0;

        if (freezeCount <= 0) {
          throw new Error("No streak freezes available");
        }

        // Use a freeze and restore streak
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            current_streak: targetStreak,
            streak_freeze_count: freezeCount - 1,
            last_journal_date: getTodayDate(),
          })
          .eq("id", user.id);

        if (updateError) throw updateError;

        return {
          success: true,
          message: `Streak freeze used! You're back to ${targetStreak} days.`,
          new_streak: targetStreak,
          freezes_remaining: freezeCount - 1,
        };
      }

      throw new Error("Invalid recovery option");
    },
    onSuccess: () => {
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["streakHistory"] });
      queryClient.invalidateQueries({ queryKey: ["streakRecoveryOptions"] });
    },
  });
};

/**
 * Hook to check if streak can be recovered
 */
export const useCanRecoverStreak = () => {
  const { data: streakHistory } = useStreakHistory();
  const { data: recoveryOptions } = useStreakRecoveryOptions();

  const brokenStreak = streakHistory?.[0];
  const canRecover =
    brokenStreak &&
    !brokenStreak.recovered &&
    brokenStreak.days_ago <= 3 &&
    recoveryOptions?.some((opt) => opt.available);

  return {
    canRecover: !!canRecover,
    brokenStreak,
    availableOptions: recoveryOptions?.filter((opt) => opt.available) ?? [],
  };
};

/**
 * Hook to get streak recovery statistics
 */
export const useStreakRecoveryStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["streakRecoveryStats", user?.id],
    queryFn: async () => {
      if (!user?.id) return { total_recoveries: 0, last_recovery: null };

      // This would query a streak_recovery_history table if it exists
      // For now, return placeholder data
      return {
        total_recoveries: 0,
        last_recovery: null,
      };
    },
    enabled: !!user?.id,
  });
};
