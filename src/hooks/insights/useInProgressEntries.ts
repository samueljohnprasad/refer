import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import type { ExerciseType } from "@/src/types/exerciseFlow";

export interface InProgressEntry {
  exercise_type: ExerciseType;
  created_at: string;
}

// ponytail: useExerciseStats only reads completed rows; paused runs live in the same table.
export function useInProgressEntries() {
  const { user } = useAuth();
  return useQuery<InProgressEntry[]>({
    queryKey: ["exercise_in_progress", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("exercise_entries" as any)
        .select("exercise_type, created_at")
        .eq("user_id", user!.id)
        .eq("status", "in_progress");
      if (error) throw error;
      return ((data as any[]) ?? []) as InProgressEntry[];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}
