import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import {
  generateAIRecommendations,
  generateWeeklySummary,
  generateGrowthInsights,
  AIRecommendation,
  WeeklySummary,
  GrowthInsight,
} from "@/src/network/genAi";
import { getWeek, getYear, startOfWeek, endOfWeek, format, subWeeks } from "date-fns";

type WeeklyAISummaryRecord = {
  id: string;
  user_id: string;
  year: number;
  week_number: number;
  week_start: string;
  week_end: string;
  recommendations: AIRecommendation[] | null;
  weekly_summary: WeeklySummary | null;
  growth_insights: GrowthInsight[] | null;
  generated_at: string;
  updated_at: string;
};

/**
 * Fetch journal entries for a specific week
 * Week starts on Sunday (weekStartsOn: 0)
 */
const fetchWeekEntries = async (userId: string, weekStart: Date) => {
  const weekEnd = endOfWeek(weekStart, { weekStartsOn: 0 });

  const { data, error } = await supabase
    .from("journal_entries")
    .select("enrichedTranscript, moodScore, feelings, created_at")
    .eq("user_id", userId)
    .gte("created_at", weekStart.toISOString())
    .lte("created_at", weekEnd.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Hook to get AI summary for a specific week
 * Returns cached data if available, null if not generated yet
 */
export const useWeeklyAISummary = (weekDate?: Date) => {
  const { user } = useAuth();
  const targetWeek = weekDate || subWeeks(new Date(), 1); // Default to previous week
  const weekNumber = getWeek(targetWeek, { weekStartsOn: 0 });
  const year = getYear(targetWeek);

  return useQuery({
    queryKey: ["weeklyAISummary", user?.id, year, weekNumber],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("ai_weekly_summaries")
        .select("*")
        .eq("user_id", user.id)
        .eq("year", year)
        .eq("week_number", weekNumber)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = not found, which is ok
        throw error;
      }

      return data as WeeklyAISummaryRecord | null;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to check if summary exists for previous week
 */
export const usePreviousWeekSummary = () => {
  const previousWeek = subWeeks(new Date(), 1);
  return useWeeklyAISummary(previousWeek);
};

/**
 * Mutation to generate and store AI summary for a specific week
 */
export const useGenerateWeeklySummary = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weekDate: Date) => {
      if (!user?.id) throw new Error("Not authenticated");

      const weekStart = startOfWeek(weekDate, { weekStartsOn: 0 });
      const weekEnd = endOfWeek(weekDate, { weekStartsOn: 0 });
      const weekNumber = getWeek(weekDate, { weekStartsOn: 0 });
      const year = getYear(weekDate);

      console.log(`Generating AI summary for week ${weekNumber}, year ${year}`);

      // 1. Fetch journal entries for this week
      const entries = await fetchWeekEntries(user.id, weekStart);
      
      if (entries.length === 0) {
        throw new Error("No journal entries found for this week");
      }

      // Filter valid entries
      const validEntries = entries.filter(
        (e) => e.enrichedTranscript && e.moodScore !== null
      ) as Array<{
        enrichedTranscript: string;
        moodScore: number;
        feelings: any;
        created_at: string;
      }>;

      if (validEntries.length === 0) {
        throw new Error("No valid journal entries found for this week");
      }

      console.log(`Found ${validEntries.length} valid entries for AI analysis`);

      // 2. Get user's current streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak")
        .eq("id", user.id)
        .single();

      // 3. Generate all AI insights in parallel
      const [recommendations, weeklySummary, growthInsights] = await Promise.all([
        generateAIRecommendations(validEntries),
        generateWeeklySummary(
          validEntries,
          format(weekStart, "MMM dd, yyyy"),
          format(weekEnd, "MMM dd, yyyy"),
          profile?.current_streak || 0
        ),
        validEntries.length >= 5 ? generateGrowthInsights(validEntries) : Promise.resolve([]),
      ]);

      console.log("AI insights generated successfully");

      // 4. Store in database
      const { data, error } = await supabase
        .from("ai_weekly_summaries")
        .upsert({
          user_id: user.id,
          year,
          week_number: weekNumber,
          week_start: format(weekStart, "yyyy-MM-dd"),
          week_end: format(weekEnd, "yyyy-MM-dd"),
          recommendations,
          weekly_summary: weeklySummary,
          growth_insights: growthInsights,
        })
        .select()
        .single();

      if (error) throw error;

      console.log("AI summary stored in database");

      return data as WeeklyAISummaryRecord;
    },
    onSuccess: (data) => {
      // Invalidate and update cache
      queryClient.invalidateQueries({ 
        queryKey: ["weeklyAISummary", user?.id, data.year, data.week_number] 
      });
      queryClient.setQueryData(
        ["weeklyAISummary", user?.id, data.year, data.week_number],
        data
      );
    },
  });
};

/**
 * Hook to get all weekly summaries for a user
 */
export const useAllWeeklySummaries = (limit: number = 10) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["allWeeklySummaries", user?.id, limit],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("ai_weekly_summaries")
        .select("*")
        .eq("user_id", user.id)
        .order("year", { ascending: false })
        .order("week_number", { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data as WeeklyAISummaryRecord[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
