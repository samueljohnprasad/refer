import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { format, parseISO, getHours, getDay, startOfWeek, endOfWeek } from "date-fns";

export interface JournalingPattern {
  best_time: string; // "morning", "afternoon", "evening", "night"
  best_day: string; // "Monday", "Tuesday", etc.
  average_entries_per_week: number;
  most_productive_hour: number;
  consistency_score: number; // 0-100
}

export interface StreakInsight {
  type: "success" | "warning" | "info" | "tip";
  title: string;
  message: string;
  icon: string;
  action?: {
    label: string;
    route: string;
  };
}

export interface MoodTrend {
  date: string;
  average_mood: number;
  entry_count: number;
}

export interface StreakAnalytics {
  current_streak: number;
  longest_streak: number;
  total_entries: number;
  entries_this_week: number;
  entries_this_month: number;
  average_mood_this_week: number;
  journaling_pattern: JournalingPattern;
  mood_trends: MoodTrend[];
  insights: StreakInsight[];
}

/**
 * Hook to get comprehensive streak insights and analytics
 */
export const useStreakInsights = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["streakInsights", user?.id],
    queryFn: async (): Promise<StreakAnalytics | null> => {
      if (!user?.id) return null;

      // Get user profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, longest_streak, last_journal_date")
        .eq("id", user.id)
        .single();

      // Get all journal entries
      const { data: entries } = await supabase
        .from("journal_entries")
        .select("created_at, moodScore, selected_date")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!entries || entries.length === 0) {
        return {
          current_streak: profile?.current_streak ?? 0,
          longest_streak: profile?.longest_streak ?? 0,
          total_entries: 0,
          entries_this_week: 0,
          entries_this_month: 0,
          average_mood_this_week: 0,
          journaling_pattern: {
            best_time: "morning",
            best_day: "Sunday",
            average_entries_per_week: 0,
            most_productive_hour: 9,
            consistency_score: 0,
          },
          mood_trends: [],
          insights: [],
        };
      }

      // Calculate time-based metrics
      const now = new Date();
      const weekStart = startOfWeek(now);
      const weekEnd = endOfWeek(now);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const entriesThisWeek = entries.filter((e) => {
        const date = parseISO(e.created_at);
        return date >= weekStart && date <= weekEnd;
      });

      const entriesThisMonth = entries.filter((e) => {
        const date = parseISO(e.created_at);
        return date >= monthStart;
      });

      // Calculate journaling patterns
      const hourCounts: Record<number, number> = {};
      const dayCounts: Record<number, number> = {};
      const timeOfDayCounts = {
        morning: 0, // 5-11
        afternoon: 0, // 12-17
        evening: 0, // 18-21
        night: 0, // 22-4
      };

      entries.forEach((entry) => {
        const date = parseISO(entry.created_at);
        const hour = getHours(date);
        const day = getDay(date);

        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        dayCounts[day] = (dayCounts[day] || 0) + 1;

        if (hour >= 5 && hour < 12) timeOfDayCounts.morning++;
        else if (hour >= 12 && hour < 18) timeOfDayCounts.afternoon++;
        else if (hour >= 18 && hour < 22) timeOfDayCounts.evening++;
        else timeOfDayCounts.night++;
      });

      const mostProductiveHour =
        parseInt(
          Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "9"
        ) || 9;

      const bestTimeOfDay = Object.entries(timeOfDayCounts).sort(
        (a, b) => b[1] - a[1]
      )[0]?.[0] as "morning" | "afternoon" | "evening" | "night";

      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const bestDayIndex =
        parseInt(
          Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "0"
        ) || 0;
      const bestDay = dayNames[bestDayIndex];

      // Calculate consistency score (0-100)
      const totalWeeks = Math.ceil(entries.length / 7);
      const averageEntriesPerWeek = entries.length / Math.max(totalWeeks, 1);
      const consistencyScore = Math.min(
        Math.round((averageEntriesPerWeek / 7) * 100),
        100
      );

      // Calculate mood trends (last 7 days)
      const moodTrends: MoodTrend[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = format(date, "yyyy-MM-dd");

        const dayEntries = entries.filter(
          (e) => format(parseISO(e.created_at), "yyyy-MM-dd") === dateStr
        );

        const avgMood =
          dayEntries.length > 0
            ? dayEntries.reduce((sum, e) => sum + (e.moodScore ?? 0), 0) /
              dayEntries.length
            : 0;

        moodTrends.push({
          date: dateStr,
          average_mood: avgMood,
          entry_count: dayEntries.length,
        });
      }

      const averageMoodThisWeek =
        entriesThisWeek.length > 0
          ? entriesThisWeek.reduce((sum, e) => sum + (e.moodScore ?? 0), 0) /
            entriesThisWeek.length
          : 0;

      // Generate insights
      const insights = generateInsights({
        currentStreak: profile?.current_streak ?? 0,
        longestStreak: profile?.longest_streak ?? 0,
        totalEntries: entries.length,
        entriesThisWeek: entriesThisWeek.length,
        averageMoodThisWeek,
        bestTimeOfDay,
        bestDay,
        consistencyScore,
        lastJournalDate: profile?.last_journal_date,
      });

      return {
        current_streak: profile?.current_streak ?? 0,
        longest_streak: profile?.longest_streak ?? 0,
        total_entries: entries.length,
        entries_this_week: entriesThisWeek.length,
        entries_this_month: entriesThisMonth.length,
        average_mood_this_week: averageMoodThisWeek,
        journaling_pattern: {
          best_time: bestTimeOfDay,
          best_day: bestDay,
          average_entries_per_week: averageEntriesPerWeek,
          most_productive_hour: mostProductiveHour,
          consistency_score: consistencyScore,
        },
        mood_trends: moodTrends,
        insights,
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Generate personalized insights based on user data
 */
function generateInsights(data: {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  entriesThisWeek: number;
  averageMoodThisWeek: number;
  bestTimeOfDay: string;
  bestDay: string;
  consistencyScore: number;
  lastJournalDate: string | null;
}): StreakInsight[] {
  const insights: StreakInsight[] = [];

  // Streak insights
  if (data.currentStreak > 0) {
    insights.push({
      type: "success",
      title: "You're on fire! 🔥",
      message: `${data.currentStreak} day streak! Keep it going!`,
      icon: "🔥",
    });
  }

  if (data.currentStreak > data.longestStreak * 0.8) {
    insights.push({
      type: "info",
      title: "Close to your record!",
      message: `You're ${
        data.longestStreak - data.currentStreak
      } days away from your longest streak!`,
      icon: "🎯",
    });
  }

  // Consistency insights
  if (data.consistencyScore >= 80) {
    insights.push({
      type: "success",
      title: "Excellent consistency!",
      message: `You're journaling ${data.consistencyScore}% of the time. Amazing!`,
      icon: "⭐",
    });
  } else if (data.consistencyScore < 50) {
    insights.push({
      type: "tip",
      title: "Build your habit",
      message: `Try journaling at the same time each day. Your best time is ${data.bestTimeOfDay}.`,
      icon: "💡",
      action: {
        label: "Set Reminder",
        route: "/settings",
      },
    });
  }

  // Time-based insights
  insights.push({
    type: "info",
    title: "Your best journaling time",
    message: `You're most productive in the ${data.bestTimeOfDay}. Consider scheduling your journaling then!`,
    icon: "⏰",
  });

  // Day-based insights
  insights.push({
    type: "info",
    title: "Your favorite day",
    message: `You journal most often on ${data.bestDay}s!`,
    icon: "📅",
  });

  // Mood insights
  if (data.averageMoodThisWeek >= 4) {
    insights.push({
      type: "success",
      title: "Great week!",
      message: `Your average mood this week is ${data.averageMoodThisWeek.toFixed(
        1
      )}/5. You're doing amazing!`,
      icon: "😊",
    });
  } else if (data.averageMoodThisWeek < 3) {
    insights.push({
      type: "warning",
      title: "Tough week?",
      message: `Your mood has been lower this week. Remember, it's okay to have difficult days. Keep journaling!`,
      icon: "💙",
    });
  }

  // Milestone insights
  if (data.totalEntries === 10) {
    insights.push({
      type: "success",
      title: "10 entries milestone!",
      message: "You've written 10 journal entries. You're building a great habit!",
      icon: "🎉",
    });
  }

  return insights;
}

/**
 * Hook to get weekly summary
 */
export const useWeeklySummary = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["weeklySummary", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const now = new Date();
      const weekStart = startOfWeek(now);

      const { data: entries } = await supabase
        .from("journal_entries")
        .select("created_at, moodScore, mainEmoji, feelings")
        .eq("user_id", user.id)
        .gte("created_at", weekStart.toISOString())
        .order("created_at", { ascending: false });

      if (!entries || entries.length === 0) return null;

      const totalMood = entries.reduce(
        (sum, e) => sum + (e.moodScore ?? 0),
        0
      );
      const averageMood = totalMood / entries.length;

      // Get most common emotions
      const emotionCounts: Record<string, number> = {};
      entries.forEach((entry) => {
        if (entry.feelings && Array.isArray(entry.feelings)) {
          entry.feelings.forEach((feeling: any) => {
            emotionCounts[feeling.name] =
              (emotionCounts[feeling.name] || 0) + 1;
          });
        }
      });

      const topEmotions = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name);

      return {
        entries_count: entries.length,
        average_mood: averageMood,
        top_emotions: topEmotions,
        week_start: format(weekStart, "MMM d"),
        week_end: format(now, "MMM d"),
      };
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
