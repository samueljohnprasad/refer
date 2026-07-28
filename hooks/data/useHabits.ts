import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import {
  Habit,
  DbHabit,
  DbHabitInsert,
  CreateHabitFormData,
} from "@/src/types/habits";
import { handleHabitDeleted } from "@/src/utils/habitNotificationHandlers";

const HABITS_QUERY_KEY = "habits";

// ponytail: react-query habit fetcher with 5m cache
async function fetchHabitsApi(userId: string): Promise<Habit[]> {
  const { data, error: fetchError } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (fetchError) throw fetchError;

  return (data || []).map((dbHabit: DbHabit) => ({
    id: dbHabit.id,
    userId: dbHabit.user_id,
    name: dbHabit.name,
    description: dbHabit.description || undefined,
    icon: dbHabit.icon || "check-circle",
    color: dbHabit.color || "#7B61FF",
    createdAt: dbHabit.created_at || new Date().toISOString(),
    isActive: dbHabit.is_active ?? true,
    sortOrder: dbHabit.sort_order || 0,
    timeOption: (dbHabit.time_option as Habit["timeOption"]) || "anytime",
    scheduledTime: dbHabit.scheduled_time || undefined,
    durationMinutes: dbHabit.duration_minutes || undefined,
    startDate: dbHabit.start_date || new Date().toISOString().split("T")[0],
    repeatPattern: (dbHabit.repeat_pattern as Habit["repeatPattern"]) || "daily",
    repeatDays: dbHabit.repeat_days || undefined,
    endRepeatOption: (dbHabit.end_repeat_option as Habit["endRepeatOption"]) || "never",
    endRepeatDate: dbHabit.end_repeat_date || undefined,
    endRepeatCount: dbHabit.end_repeat_count || undefined,
    reminderEnabled: dbHabit.reminder_enabled || false,
    reminderTime: dbHabit.reminder_time || undefined,
    notes: dbHabit.notes || undefined,
  }));
}

export const useHabits = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const queryClient = useQueryClient();

  const {
    data: habits = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<Habit[]>({
    queryKey: [HABITS_QUERY_KEY, userId],
    queryFn: () => fetchHabitsApi(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: async (formData: CreateHabitFormData): Promise<Habit> => {
      if (!userId) throw new Error("User not authenticated");

      const { data: existingHabits } = await supabase
        .from("habits")
        .select("sort_order")
        .eq("user_id", userId)
        .order("sort_order", { ascending: false })
        .limit(1);

      const nextSortOrder =
        existingHabits && existingHabits.length > 0
          ? (existingHabits[0].sort_order || 0) + 1
          : 0;

      const newHabit: DbHabitInsert = {
        user_id: userId,
        name: formData.name,
        description: formData.description || null,
        icon: formData.icon || "check-circle",
        color: formData.color || "#7B61FF",
        sort_order: nextSortOrder,
        is_active: true,
      };

      const { data, error: insertError } = await supabase
        .from("habits")
        .insert(newHabit)
        .select()
        .single();

      if (insertError) throw insertError;

      return {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        description: data.description || undefined,
        icon: data.icon || "check-circle",
        color: data.color || "#7B61FF",
        createdAt: data.created_at || new Date().toISOString(),
        isActive: data.is_active ?? true,
        sortOrder: data.sort_order || 0,
        timeOption: (data.time_option as Habit["timeOption"]) || "anytime",
        scheduledTime: data.scheduled_time || undefined,
        durationMinutes: data.duration_minutes || undefined,
        startDate: data.start_date || new Date().toISOString().split("T")[0],
        repeatPattern: (data.repeat_pattern as Habit["repeatPattern"]) || "daily",
        repeatDays: data.repeat_days || undefined,
        endRepeatOption: (data.end_repeat_option as Habit["endRepeatOption"]) || "never",
        endRepeatDate: data.end_repeat_date || undefined,
        endRepeatCount: data.end_repeat_count || undefined,
        reminderEnabled: data.reminder_enabled || false,
        reminderTime: data.reminder_time || undefined,
        notes: data.notes || undefined,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY, userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (habitId: string): Promise<boolean> => {
      if (!userId) throw new Error("User not authenticated");

      const { error: deleteError } = await supabase
        .from("habits")
        .delete()
        .eq("id", habitId)
        .eq("user_id", userId);

      if (deleteError) throw deleteError;

      await handleHabitDeleted(habitId);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY, userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      habitId,
      updates,
    }: {
      habitId: string;
      updates: Partial<CreateHabitFormData> & Record<string, unknown>;
    }): Promise<boolean> => {
      if (!userId) throw new Error("User not authenticated");

      const { error: updateError } = await supabase
        .from("habits")
        .update({
          name: updates.name,
          description: updates.description || null,
          icon: updates.icon,
          color: updates.color,
          time_option: updates.timeOption,
          scheduled_time: updates.scheduledTime,
          duration_minutes: updates.durationMinutes,
          start_date: updates.startDate,
          repeat_pattern: updates.repeatPattern,
          repeat_days: updates.repeatDays,
          end_repeat_option: updates.endRepeatOption,
          end_repeat_date: updates.endRepeatDate,
          end_repeat_count: updates.endRepeatCount,
          reminder_enabled: updates.reminderEnabled,
          reminder_time: updates.reminderTime,
          notes: updates.notes,
        })
        .eq("id", habitId)
        .eq("user_id", userId);

      if (updateError) throw updateError;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [HABITS_QUERY_KEY, userId] });
    },
  });

  const createHabit = useCallback(
    async (formData: CreateHabitFormData): Promise<Habit | null> => {
      try {
        return await createMutation.mutateAsync(formData);
      } catch (err) {
        console.error("Error creating habit:", err);
        return null;
      }
    },
    [createMutation]
  );

  const deleteHabit = useCallback(
    async (habitId: string): Promise<boolean> => {
      try {
        return await deleteMutation.mutateAsync(habitId);
      } catch (err) {
        console.error("Error deleting habit:", err);
        return false;
      }
    },
    [deleteMutation]
  );

  const updateHabit = useCallback(
    async (
      habitId: string,
      updates: Partial<CreateHabitFormData> & Record<string, unknown>
    ): Promise<boolean> => {
      try {
        return await updateMutation.mutateAsync({ habitId, updates });
      } catch (err) {
        console.error("Error updating habit:", err);
        return false;
      }
    },
    [updateMutation]
  );

  return {
    habits,
    loading,
    error: error ? (error instanceof Error ? error.message : "Failed to fetch habits") : null,
    createHabit,
    deleteHabit,
    updateHabit,
    refetch,
  };
};
