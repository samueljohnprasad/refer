import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { FeelingsType } from "@/network/genAi";
import { useCallback, useMemo } from "react";
import { InsightsTypeResponse } from "../types";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";

// Custom hook for mental health data management (for potential reuse)
export const useMentalHealthData = (selectedDate: Date) => {
  const { user } = useAuth();
  const formattedDate = formatDate(selectedDate, "yyyy-MM-dd");

  const loadData = useCallback(async () => {
    if (!user?.id) {
      return [];
    }
    try {
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);

      const { data, error: dateColErr } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", start.toISOString())
        .lte("created_at", end.toISOString())
        .order("created_at", { ascending: false })
        .overrideTypes<Array<{ feelings: FeelingsType[] }>>();

      console.log("datadatadata", data, dateColErr);
      if (dateColErr || !data) throw dateColErr;

      const insightsResponse: InsightsTypeResponse[] = data.map((entry) => {
        return {
          moodScore: entry.moodScore || 0,
          aiInsights: entry.aiInsights || "",
          positiveInsights: entry.positiveInsights || [],
          suggestedTags: entry.suggestedTags || [],
          summary: entry.summary || "",
          title: entry.title || "",
          mainEmoji: entry.mainEmoji || "",
          feelings: entry.feelings,
          enrichedTranscript: entry.enrichedTranscript || "",
          created_at: entry.created_at,
          id: entry.id,
        };
      });

      return insightsResponse;
    } catch (err) {
      console.error("Error loading mental health data:", err);
      return [];
    }
  }, [user?.id, formattedDate]);

  const query = useQuery({
    queryKey: [user?.id, formattedDate],
    queryFn: loadData,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    enabled: !!user?.id && !!formattedDate,
  });
  return query;
};
