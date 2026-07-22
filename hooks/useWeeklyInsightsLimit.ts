import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import { ONE_DAY, TWO_HOUR } from "@/constants/Colors";

const FREE_WEEKLY_INSIGHTS_LIMIT = 2;

interface UseWeeklyInsightsLimitReturn {
  weeklyInsightsCount: number;
  canGenerateInsight: boolean;
  shouldShowPaywall: boolean;
  isLoading: boolean;
}

/**
 * Hook to track weekly AI insights generation limits for free users
 * Free users can generate up to 2 weekly insights
 * Pro users have unlimited insights
 */
export const useWeeklyInsightsLimit = (): UseWeeklyInsightsLimitReturn => {
  const { hasPro, isLoadingRevenueCat } = useRevenueCat();
  const { user } = useAuth();

  const { data: weeklyInsightsCount, isLoading: isLoadingInsights } = useQuery({
    queryKey: ["weeklyInsightsCount", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { count, error } = await supabase
        .from("weekly_ai")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!user?.id,
    staleTime: ONE_DAY
  });

  const canGenerateInsight = useMemo(() => {
    if (hasPro) return true;
    return (weeklyInsightsCount ?? 0) <= FREE_WEEKLY_INSIGHTS_LIMIT;
  }, [hasPro, weeklyInsightsCount]);

  const shouldShowPaywall = useMemo(() => {
    if (hasPro) return false;
    return (weeklyInsightsCount ?? 0) > FREE_WEEKLY_INSIGHTS_LIMIT;
  }, [hasPro, weeklyInsightsCount]);

  return {
    weeklyInsightsCount: weeklyInsightsCount ?? 0,
    canGenerateInsight,
    shouldShowPaywall,
    isLoading: isLoadingRevenueCat || isLoadingInsights,
  };
};
