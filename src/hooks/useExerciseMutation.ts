import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import type {
  ExerciseEntry,
  ExerciseSavePayload,
} from "@/src/types/exerciseFlow";

interface SaveParams {
  payload: ExerciseSavePayload;
  id?: string;
}

export interface UseExerciseMutationReturn {
  save: (
    payload: ExerciseSavePayload,
    id?: string,
  ) => Promise<ExerciseEntry | null>;
  isSaving: boolean;
  saveError: Error | null;
}

export const useExerciseMutation = (): UseExerciseMutationReturn => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const mutation = useMutation<ExerciseEntry | null, Error, SaveParams>({
    mutationFn: async ({
      payload,
      id,
    }: SaveParams): Promise<ExerciseEntry | null> => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const row: Record<string, any> = {
        user_id: user.id,
        exercise_type: payload.exercise_type,
        schema_version: payload.schema_version,
        status: payload.status,
        current_step: payload.current_step,
        completed_steps: payload.completed_steps,
        step_index: payload.step_index,
        response: payload.response,
        step_timings: payload.step_timings,
        selected_date: payload.selected_date,
      };

      // Include id for updates (upsert)
      if (id) {
        row.id = id;
      }

      // Set completed_at when marking as completed
      if (payload.status === "completed") {
        row.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("exercise_entries" as any)
        .upsert(row as any)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data as any as ExerciseEntry;
    },
    onSuccess: (_data, { id }): void => {
      queryClient.invalidateQueries({ queryKey: ["exercises"] });
      queryClient.invalidateQueries({ queryKey: ["cbt_history"] });
      if (id) {
        queryClient.invalidateQueries({ queryKey: ["exercise_entry", id] });
      }
    },
  });

  const save = useCallback(
    async (
      payload: ExerciseSavePayload,
      id?: string,
    ): Promise<ExerciseEntry | null> => {
      return mutation.mutateAsync({ payload, id });
    },
    [mutation],
  );

  return {
    save,
    isSaving: mutation.isPending,
    saveError: mutation.error,
  };
};
