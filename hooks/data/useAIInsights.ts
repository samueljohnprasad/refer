import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import { supabase } from "@/src/network/auth/supabase";
import {
  generateAIRecommendations,
  generateWeeklySummary,
  generateMonthlySummary,
  generateGrowthInsights,
  AIRecommendation,
  WeeklySummary,
  MonthlySummary,
  GrowthInsight,
} from "@/src/network/genAi";
import {
  startOfWeek,
  endOfWeek,
  format,
  startOfMonth,
  endOfMonth,
} from "date-fns";

/**
 * Fetch recent journal entries for AI analysis
 */
const fetchRecentEntries = async (userId: string, days: number = 7) => {
  const { data, error } = await supabase
    .from("journal_entries")
    .select("enrichedTranscript, moodScore, feelings, created_at")
    .eq("user_id", userId)
    .gte(
      "created_at",
      new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Fetch journal entries for a specific week
 */
const fetchWeekEntries = async (userId: string, weekStart: Date) => {
  const weekEnd = endOfWeek(weekStart);

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
 * Fetch journal entries for a specific month
 */
const fetchMonthEntries = async (userId: string, monthStart: Date) => {
  const monthEnd = endOfMonth(monthStart);

  const { data, error } = await supabase
    .from("journal_entries")
    .select("enrichedTranscript, moodScore, feelings, created_at")
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString())
    .lte("created_at", monthEnd.toISOString())
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
};

/**
 * Hook to get AI-powered personalized recommendations
 */
export const useAIRecommendations = (days: number = 7) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["aiRecommendations", user?.id, days],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const entries = await fetchRecentEntries(user.id, days);
      if (entries.length === 0) return [];

      // Filter out entries without enriched transcript
      const validEntries = entries.filter(
        (e) => e.enrichedTranscript && e.moodScore !== null
      ) as Array<{
        enrichedTranscript: string;
        moodScore: number;
        feelings: any;
        created_at: string;
      }>;

      if (validEntries.length === 0) return [];
      console.log("validEntriesvalidEntries", validEntries);
      const recommendations = await generateAIRecommendations(validEntries);
      return recommendations;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};

/**
 * Hook to generate weekly summary
 */
export const useWeeklyAISummary = (weekStart?: Date) => {
  const { user } = useAuth();
  const week = weekStart || startOfWeek(new Date());

  return useQuery({
    queryKey: ["weeklyAISummary", user?.id, format(week, "yyyy-MM-dd")],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const entries = await fetchWeekEntries(user.id, week);
      if (entries.length === 0) return null;

      // Filter valid entries
      const validEntries = entries.filter(
        (e) => e.enrichedTranscript && e.moodScore !== null
      ) as Array<{
        enrichedTranscript: string;
        moodScore: number;
        feelings: any;
        created_at: string;
      }>;

      if (validEntries.length === 0) return null;

      // Get user's current streak
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak")
        .eq("id", user.id)
        .single();

      const weekEnd = endOfWeek(week);
      const summary = await generateWeeklySummary(
        validEntries,
        format(week, "MMM dd, yyyy"),
        format(weekEnd, "MMM dd, yyyy"),
        profile?.current_streak || 0
      );

      return summary;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to generate monthly summary
 */
export const useMonthlyAISummary = (monthStart?: Date) => {
  const { user } = useAuth();
  const month = monthStart || startOfMonth(new Date());

  return useQuery({
    queryKey: ["monthlyAISummary", user?.id, format(month, "yyyy-MM")],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const entries = await fetchMonthEntries(user.id, month);
      if (entries.length === 0) return null;

      // Filter valid entries
      const validEntries = entries.filter(
        (e) => e.enrichedTranscript && e.moodScore !== null
      ) as Array<{
        enrichedTranscript: string;
        moodScore: number;
        feelings: any;
        created_at: string;
      }>;

      if (validEntries.length === 0) return null;

      const summary = await generateMonthlySummary(
        validEntries,
        format(month, "MMMM"),
        month.getFullYear()
      );

      return summary;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
};

/**
 * Hook to get growth insights from pattern analysis
 */
export const useGrowthInsights = (days: number = 30) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["growthInsights", user?.id, days],
    queryFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");

      const entries = await fetchRecentEntries(user.id, days);
      if (entries.length < 5) return [];

      // Filter valid entries
      const validEntries = entries.filter(
        (e) => e.enrichedTranscript && e.moodScore !== null
      ) as Array<{
        enrichedTranscript: string;
        moodScore: number;
        feelings: any;
        created_at: string;
      }>;

      if (validEntries.length < 5) return [];

      const insights = await generateGrowthInsights(validEntries);
      return insights;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Mutation to regenerate recommendations
 */
export const useRegenerateRecommendations = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (days: number = 7) => {
      if (!user?.id) throw new Error("Not authenticated");

      const entries = await fetchRecentEntries(user.id, days);
      const validEntries = entries.filter(
        (e) => e.enrichedTranscript && e.moodScore !== null
      ) as Array<{
        enrichedTranscript: string;
        moodScore: number;
        feelings: any;
        created_at: string;
      }>;
      return await generateAIRecommendations(validEntries);
    },
    onSuccess: (data, days) => {
      queryClient.setQueryData(["aiRecommendations", user?.id, days], data);
    },
  });
};

/**
 * Mutation to regenerate weekly summary
 */
export const useRegenerateWeeklySummary = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (weekStart: Date) => {
      if (!user?.id) throw new Error("Not authenticated");

      const entries = await fetchWeekEntries(user.id, weekStart);
      const validEntries = entries.filter(
        (e) => e.enrichedTranscript && e.moodScore !== null
      ) as Array<{
        enrichedTranscript: string;
        moodScore: number;
        feelings: any;
        created_at: string;
      }>;

      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak")
        .eq("id", user.id)
        .single();

      const weekEnd = endOfWeek(weekStart);
      return await generateWeeklySummary(
        validEntries,
        format(weekStart, "MMM dd, yyyy"),
        format(weekEnd, "MMM dd, yyyy"),
        profile?.current_streak || 0
      );
    },
    onSuccess: (data, weekStart) => {
      queryClient.setQueryData(
        ["weeklyAISummary", user?.id, format(weekStart, "yyyy-MM-dd")],
        data
      );
    },
  });
};
