import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { ONE_DAY } from "@/constants/Colors";

interface TotalJournalStats {
  totalCount: number;
  averageMood: number | null;
}

/**
 * Hook to get the total count and average mood of all journal entries for the current user
 */
export const useTotalJournalCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["totalJournalStats", user?.id],
    queryFn: async (): Promise<TotalJournalStats> => {
      if (!user?.id) return { totalCount: 0, averageMood: null };

      // Get total count
      const { count, error: countError } = await supabase
        .from("journal_records")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (countError) throw countError;

      // Get average mood score from moods table
      const { data: moodData, error: moodError } = await supabase
        .from("moods")
        .select("mood_score")
        .eq("user_id", user.id)
        .not("mood_score", "is", null);

      if (moodError) throw moodError;

      // Calculate average mood
      let averageMood: number | null = null;
      if (moodData && moodData.length > 0) {
        const sum = moodData.reduce(
          (acc, curr) => acc + (curr.mood_score || 0),
          0
        );
        averageMood = sum / moodData.length;
      }

      return {
        totalCount: count ?? 0,
        averageMood,
      };
    },
    enabled: !!user?.id,
    staleTime: ONE_DAY,
    gcTime: ONE_DAY,
  });
};
