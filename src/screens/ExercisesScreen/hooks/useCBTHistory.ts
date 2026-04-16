import { useQuery } from "@tanstack/react-query";
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
}

export function useCBTHistory() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["cbt_history", user?.id],
    queryFn: async () => {
      if (!user) return [];

      console.log("Fetching CBT history for user:", user.id);

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

      if (catcherRes.error) {
        console.error(
          "Error fetching thought_catcher_entries:",
          catcherRes.error,
        );
      }

      if (reframingRes.error) {
        console.warn(
          "Note: thought_reframing_entries missing or error:",
          reframingRes.error.message,
        );
      }

      if (gratitudeRes.error) {
        console.warn(
          "Note: gratitude_entries missing or error:",
          gratitudeRes.error.message,
        );
      }

      // Also fetch from unified exercise_entries table
      const unifiedRes = await supabase
        .from("exercise_entries" as any)
        .select("id, created_at, exercise_type, status, response")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(100);

      if (unifiedRes.error) {
        console.warn(
          "Note: exercise_entries missing or error:",
          unifiedRes.error.message,
        );
      }

      const combined: HistoryLogItem[] = [
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
        ...((unifiedRes.data as any[]) || []).map((item) => {
          const cfg = getExerciseConfig(item.exercise_type);
          return {
            type: "unified" as const,
            exerciseType: item.exercise_type as ExerciseType,
            id: item.id,
            date: item.created_at,
            title: cfg?.title ?? item.exercise_type,
            status: item.status || "in_progress",
            icon: cfg?.icon,
          };
        }),
      ];

      return combined.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    },
    enabled: !!user?.id,
  });
}
