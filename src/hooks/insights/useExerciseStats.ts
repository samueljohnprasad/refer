import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import type { ExerciseType, ExerciseCategory } from "@/src/types/exerciseFlow";
import {
  EXERCISE_CATEGORY_MAP,
  getExerciseTypesByCategory,
} from "@/src/data/exerciseCategoryMap";

export interface ExerciseStatsEntry {
  id: string;
  exercise_type: ExerciseType;
  response: Record<string, any>;
  completed_at: string;
}

export interface ExerciseStats {
  totalCompleted: number;
  completedThisWeek: number;
  currentStreak: number;
  categoryCount: Record<ExerciseCategory, number>;
  entries: ExerciseStatsEntry[];
}

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;

  const uniqueDays = [...new Set(dates.map((d) => d.slice(0, 10)))].sort(
    (a, b) => b.localeCompare(a),
  );

  const today = new Date().toISOString().slice(0, 10);
  if (uniqueDays[0] !== today) {
    const yesterday = new Date(Date.now() - 86_400_000)
      .toISOString()
      .slice(0, 10);
    if (uniqueDays[0] !== yesterday) return 0;
  }

  let streak = 1;
  for (let i = 1; i < uniqueDays.length; i++) {
    const prev = new Date(uniqueDays[i - 1]);
    const curr = new Date(uniqueDays[i]);
    const diffMs = prev.getTime() - curr.getTime();
    if (diffMs <= 86_400_000 * 1.5) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday.toISOString();
}

export function useExerciseStats() {
  const { user } = useAuth();

  return useQuery<ExerciseStats>({
    queryKey: ["exercise_stats", user?.id],
    queryFn: async (): Promise<ExerciseStats> => {
      if (!user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("exercise_entries" as any)
        .select("id, exercise_type, response, completed_at")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false });

      if (error) throw error;

      const entries = ((data as any[]) ?? []) as ExerciseStatsEntry[];
      const weekStart = getWeekStart();

      const categoryCount: Record<ExerciseCategory, number> = {
        cbt_core: 0,
        mindfulness: 0,
        anxiety: 0,
        overthinking: 0,
      };

      let completedThisWeek = 0;

      for (const entry of entries) {
        const cat = EXERCISE_CATEGORY_MAP[entry.exercise_type];
        if (cat) categoryCount[cat]++;
        if (entry.completed_at >= weekStart) completedThisWeek++;
      }

      const completedDates = entries.map((e) => e.completed_at).filter(Boolean);

      return {
        totalCompleted: entries.length,
        completedThisWeek,
        currentStreak: calculateStreak(completedDates),
        categoryCount,
        entries,
      };
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useExerciseStatsByType(exerciseType: ExerciseType) {
  const { data: stats } = useExerciseStats();

  if (!stats) return null;

  const typeEntries = stats.entries.filter(
    (e) => e.exercise_type === exerciseType,
  );
  const category = EXERCISE_CATEGORY_MAP[exerciseType];
  const categoryEntries = stats.entries.filter(
    (e) => EXERCISE_CATEGORY_MAP[e.exercise_type] === category,
  );

  const weekStart = getWeekStart();
  const thisWeekTypeEntries = typeEntries.filter(
    (e) => e.completed_at >= weekStart,
  );

  return {
    totalForType: typeEntries.length,
    totalForCategory: categoryEntries.length,
    thisWeekForType: thisWeekTypeEntries.length,
    category,
    entries: typeEntries,
  };
}
