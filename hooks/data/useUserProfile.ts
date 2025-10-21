import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";

export const useUserProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!user) {
        return { 
          displayName: "",
          currentStreak: 0,
          longestStreak: 0,
          lastJournalDate: null,
          streakFreezeCount: 0,
        };
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, current_streak, longest_streak, last_journal_date, streak_freeze_count")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return {
        displayName: data?.display_name || "",
        currentStreak: data?.current_streak ?? 0,
        longestStreak: data?.longest_streak ?? 0,
        lastJournalDate: data?.last_journal_date || null,
        streakFreezeCount: data?.streak_freeze_count ?? 0,
        userId: user.id,
      };
    },
    retry: (failureCount, error: any) => {
      if (error?.code === "PGRST116") {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 1000 * 60, // 1 minute - refresh more frequently for streak updates
    gcTime: 10 * 60 * 1000,
  });
};
