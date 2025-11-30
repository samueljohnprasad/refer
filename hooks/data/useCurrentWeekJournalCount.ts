import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { startOfWeek, endOfWeek } from "date-fns";
import { TWO_HOUR } from "@/constants/Colors";

/**
 * Hook to get the count of journal entries for the current week
 * Week starts on Sunday (weekStartsOn: 0)
 */
export const useCurrentWeekJournalCount = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["currentWeekJournalCount", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const now = new Date();
      const weekStart = startOfWeek(now, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(now, { weekStartsOn: 0 });

      const { count, error } = await supabase
        .from("journal_records")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .gte("selected_date", weekStart.toISOString())
        .lte("selected_date", weekEnd.toISOString());

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user?.id,
    staleTime: TWO_HOUR,
    gcTime: TWO_HOUR,
  });
};
