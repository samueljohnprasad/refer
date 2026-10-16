import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { projectCopingPathObservations } from "@/src/domains/insights/data/insightObservation.repo";
import { evaluateDeterministicPattern } from "@/src/domains/insights/model/deterministicPattern";
import type { DeterministicInsightResult } from "@/src/domains/insights/model/insightObservation";

function getDeviceTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}

export function useDeterministicInsight(): {
  data: DeterministicInsightResult | null;
  isLoading: boolean;
  isError: boolean;
} {
  const { user } = useAuth();
  const timezone = getDeviceTimezone();

  const query = useQuery({
    queryKey: ["deterministic_insight", user?.id, timezone],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      const observations = await projectCopingPathObservations(user.id, timezone);
      return evaluateDeterministicPattern(observations, new Date(), timezone);
    },
    enabled: Boolean(user?.id),
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
