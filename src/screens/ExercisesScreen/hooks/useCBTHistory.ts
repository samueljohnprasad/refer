import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import type { ExerciseType } from "@/src/types/exerciseFlow";
import { getExerciseConfig } from "@/src/data/exerciseRegistry";

export interface HistoryLogItem {
  type: "catcher" | "reframing" | "gratitude" | "unified";
  exerciseType?: ExerciseType;
  id: string;
  date: string;
  title: string;
  status: string;
  icon?: string;
  response?: Record<string, any>;
}

export function useCBTHistory() {
  const { user } = useAuth();
  const PAGE_SIZE = 20;

  return useInfiniteQuery({
    queryKey: ["cbt_history", user?.id],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      if (!user) return { data: [], nextPage: undefined };

      const from = pageParam * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let legacyItems: HistoryLogItem[] = [];

      if (pageParam === 0) {
        const [catcherRes, reframingRes, gratitudeRes] = await Promise.all([
          supabase
            .from("thought_catcher_entries" as any)
            .select("id, created_at, situation, status")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("thought_reframing_entries" as any)
            .select("id, created_at, situation, completed, status")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("gratitude_entries" as any)
            .select("id, created_at, selected_prompt, completed, status")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

        legacyItems = [
          ...((catcherRes.data as any[]) || []).map((item) => ({
            type: "catcher" as const,
            id: item.id,
            date: item.created_at,
            title: item.situation || "Unknown situation",
            status: item.status || "started",
          })),
          ...((reframingRes.data as any[]) || []).map((item) => ({
            type: "reframing" as const,
            id: item.id,
            date: item.created_at,
            title: item.situation || "Unknown situation",
            status: item.completed ? "completed" : item.status || "started",
          })),
          ...((gratitudeRes.data as any[]) || []).map((item) => ({
            type: "gratitude" as const,
            id: item.id,
            date: item.created_at,
            title: item.selected_prompt || "Gratitude Reframe",
            status: item.completed ? "completed" : item.status || "started",
          })),
        ];
      }

      // Fetch from unified exercise_entries table
      const unifiedRes = await supabase
        .from("exercise_entries" as any)
        .select("id, created_at, exercise_type, status, response")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .range(from, to);

      const unifiedItems: HistoryLogItem[] = ((unifiedRes.data as any[]) || []).map((item) => {
        const cfg = getExerciseConfig(item.exercise_type);
        return {
          type: "unified" as const,
          exerciseType: item.exercise_type as ExerciseType,
          id: item.id,
          date: item.created_at,
          title: cfg?.title ?? item.exercise_type,
          status: item.status || "in_progress",
          icon: cfg?.icon,
          response: item.response as Record<string, any> | undefined,
        };
      });

      const combined = [...legacyItems, ...unifiedItems];

      return {
        data: combined,
        nextPage: unifiedRes.data?.length === PAGE_SIZE ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled: !!user?.id,
  });
}

export function useCompletedExercisesCount() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["completed_exercises_count", user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const [catcherRes, reframingRes, gratitudeRes, unifiedRes] = await Promise.all([
        supabase
          .from("thought_catcher_entries" as any)
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .in("status", ["completed", "summary", "checker_completed"]),
        supabase
          .from("thought_reframing_entries" as any)
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .or("completed.eq.true,status.in.(completed,summary,checker_completed)"),
        supabase
          .from("gratitude_entries" as any)
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .or("completed.eq.true,status.in.(completed,summary,checker_completed)"),
        supabase
          .from("exercise_entries" as any)
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id)
          .in("status", ["completed", "summary", "checker_completed"]),
      ]);

      return (
        (catcherRes.count || 0) +
        (reframingRes.count || 0) +
        (gratitudeRes.count || 0) +
        (unifiedRes.count || 0)
      );
    },
    enabled: !!user?.id,
  });
}

