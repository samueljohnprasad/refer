import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
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
import {
  getWeek,
  getYear,
  startOfWeek,
  endOfWeek,
  format,
  subWeeks,
} from "date-fns";

type WeeklyAISummaryRecord = {
  id: string;
  user_id: string;
  year: number;
  week_number: number;
  week_index?: number | null;
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
    .from("journal_records")
    .select(
      `
    id,
    transcripts,
    duration_seconds,
    selected_date,
    journal_ai (
      summary
    ),
    moods(main_mood)
  `
    )
    .eq("user_id", userId)
    .gte("selected_date", weekStart.toISOString())
    .lte("selected_date", weekEnd.toISOString())
    .order("selected_date", { ascending: false });

  if (error) throw error;

  return data || [];
};

export type FetchWeekEntriesType = Awaited<ReturnType<typeof fetchWeekEntries>>;

/**
 * Hook to get AI summary for a specific week
 * Returns cached data if available, null if not generated yet
 */
export const useWeeklyAISummary = (
  weekDate?: Date,
  options?: Partial<UseQueryOptions<WeeklyAISummaryRecord | null>>
) => {
  const { user } = useAuth();
  const targetWeek = weekDate || subWeeks(new Date(), 1); // Default to previous week
  const weekNumber = getWeek(targetWeek, { weekStartsOn: 0 });
  const year = getYear(targetWeek);

  return useQuery({
    queryKey: ["weeklyAISummary", user?.id, year, weekNumber],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("weekly_ai")
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
    enabled:
      options?.enabled !== undefined
        ? options.enabled && !!user?.id
        : !!user?.id,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    ...options,
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

      // 1. Fetch journal entries for this week
      const entries: FetchWeekEntriesType = await fetchWeekEntries(
        user.id,
        weekStart
      );

      if (entries.length === 0) {
        throw new Error("No journal entries found for this week");
      }

      // 3. Generate all AI insights in parallel
      const [recommendations, weeklySummary, growthInsights] =
        await Promise.all([
          generateAIRecommendations(entries),
          generateWeeklySummary(
            entries,
            format(weekStart, "MMM dd, yyyy"),
            format(weekEnd, "MMM dd, yyyy")
          ),
          entries.length >= 5
            ? generateGrowthInsights(entries)
            : Promise.resolve([]),
        ]);

      const { data, error } = await supabase
        .from("weekly_ai")
        .upsert({
          user_id: user.id,
          year,
          week_number: weekNumber,
          summary: typeof weeklySummary === 'string' ? weeklySummary : (weeklySummary as any)?.summary || JSON.stringify(weeklySummary),
          personalized_reflection: recommendations,
          structured_memory: growthInsights,
        })
        .select()
        .single();

      // if (error) throw error;

      return data as WeeklyAISummaryRecord;
    },
    onSuccess: (data) => {
      // Invalidate and update cache
      queryClient.invalidateQueries({
        queryKey: ["weeklyAISummary", user?.id, data.year, data.week_number],
      });
      queryClient.setQueryData(
        ["weeklyAISummary", user?.id, data.year, data.week_number],
        data
      );
    },
  });
};
