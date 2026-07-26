import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import type { UserStats } from "./useAchievements";

interface UseUserStatsReturn {
  stats: UserStats;
  isLoading: boolean;
  refetch: () => Promise<any>;
}

const defaultStats: UserStats = {
  journalCount: 0,
  streakDays: 0,
  moodVariety: 0,
  promptCount: 0,
  calorieStreakDays: 0,
  habitPerfectDays: 0,
  voiceJournalCount: 0,
};

/**
 * Hook to fetch all user statistics needed for achievement tracking
 */
export const useUserStats = (): UseUserStatsReturn => {
  const { user } = useAuth();

  const { data: stats = defaultStats, isLoading, refetch } = useQuery({
    queryKey: ["user_stats", user?.id],
    queryFn: async (): Promise<UserStats> => {
      if (!user?.id) {
        return defaultStats;
      }
      
      // Fetch journal count from journal_records
      const { count: journalCount } = await supabase
        .from("journal_records")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Fetch voice journal count from journal_records
      const { count: voiceJournalCount } = await supabase
        .from("journal_records")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("input_method", "voice");

      // Fetch current streak from profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak")
        .eq("id", user.id)
        .single();

      // Fetch mood variety (distinct mood averages logged)
      const { data: moods } = await supabase
        .from("daily_moods")
        .select("mood_avg")
        .eq("user_id", user.id);

      const uniqueMoods = new Set(
        (moods as { mood_avg: number }[] | null)?.map((m) => m.mood_avg) || [],
      );

      // Fetch prompt count (journals with prompts)
      const { count: promptCount } = await supabase
        .from("journal_records")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .not("prompt", "is", null);

      // Fetch calorie tracking days
      const { data: calorieEntries } = await supabase
        .from("calorie_entries")
        .select("selected_date")
        .eq("user_id", user.id);

      const uniqueCalorieDays = new Set(
        (calorieEntries as { selected_date: string }[] | null)?.map(
          (e) => e.selected_date,
        ) || [],
      );

      // Fetch habit completions (unique dates with completed habits)
      const { data: habitCompletions } = await supabase
        .from("habit_completions")
        .select("completed_date")
        .eq("user_id", user.id);

      // Count unique dates with completed habits
      const completedHabitDays = new Set(
        (habitCompletions as { completed_date: string }[] | null)?.map(
          (h) => h.completed_date,
        ) || [],
      );

      return {
        journalCount: journalCount || 0,
        streakDays: profile?.current_streak || 0,
        moodVariety: uniqueMoods.size,
        promptCount: promptCount || 0,
        calorieStreakDays: uniqueCalorieDays.size,
        habitPerfectDays: completedHabitDays.size,
        voiceJournalCount: voiceJournalCount || 0,
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });

  return {
    stats,
    isLoading,
    refetch,
  };
};
