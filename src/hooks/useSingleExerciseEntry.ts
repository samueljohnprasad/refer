import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import type {
  ExerciseEntry,
  ExerciseType,
  ExerciseStatus,
} from "@/src/types/exerciseFlow";

// ─── Single entry by ID ─────────────────────────────────────────────────────

export const useSingleExerciseEntry = (id: string | null) => {
  const { user } = useAuth();

  const query = useQuery({
    queryKey: ["exercise_entry", id, user?.id],
    queryFn: async (): Promise<ExerciseEntry | null> => {
      if (!user?.id || !id) throw new Error("Missing user or id");

      const { data, error } = await supabase
        .from("exercise_entries" as any)
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data as any as ExerciseEntry;
    },
    enabled: !!user?.id && !!id,
  });

  return {
    entry: query.data ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};

// ─── History list with filters ──────────────────────────────────────────────

export interface ExerciseHistoryFilters {
  exercise_type?: ExerciseType;
  status?: ExerciseStatus;
  limit?: number;
}

export const useExerciseHistory = (filters?: ExerciseHistoryFilters) => {
  const { user } = useAuth();

  const filterKey = filters
    ? `${filters.exercise_type ?? ""}_${filters.status ?? ""}_${filters.limit ?? ""}`
    : "all";

  const query = useQuery({
    queryKey: ["exercises", user?.id, filterKey],
    queryFn: async (): Promise<ExerciseEntry[]> => {
      if (!user?.id) throw new Error("User not authenticated");

      let q = supabase
        .from("exercise_entries" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (filters?.exercise_type) {
        q = q.eq("exercise_type", filters.exercise_type);
      }
      if (filters?.status) {
        q = q.eq("status", filters.status);
      }
      if (filters?.limit) {
        q = q.limit(filters.limit);
      }

      const { data, error } = await q;

      if (error) throw error;
      return (data ?? []) as any as ExerciseEntry[];
    },
    enabled: !!user?.id,
  });

  return {
    entries: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
};
