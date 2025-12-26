import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import {
  Habit,
  DbHabit,
  DbHabitInsert,
  CreateHabitFormData,
} from "@/src/types/habits";
import { handleHabitDeleted } from "@/src/utils/habitNotificationHandlers";

export const useHabits = () => {
  const { session } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all active habits for the current user
  const fetchHabits = useCallback(async () => {
    if (!session?.user?.id) {
      setHabits([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (fetchError) throw fetchError;

      // Transform database format to application format
      const transformedHabits: Habit[] = (data || []).map(
        (dbHabit: DbHabit) => ({
          id: dbHabit.id,
          userId: dbHabit.user_id,
          name: dbHabit.name,
          description: dbHabit.description || undefined,
          icon: dbHabit.icon || "check-circle",
          color: dbHabit.color || "#7B61FF",
          createdAt: dbHabit.created_at || new Date().toISOString(),
          isActive: dbHabit.is_active ?? true,
          sortOrder: dbHabit.sort_order || 0,

          // Scheduling fields
          timeOption: (dbHabit.time_option as any) || "anytime",
          scheduledTime: dbHabit.scheduled_time || undefined,
          durationMinutes: dbHabit.duration_minutes || undefined,
          startDate:
            dbHabit.start_date || new Date().toISOString().split("T")[0],

          // Repeat pattern
          repeatPattern: (dbHabit.repeat_pattern as any) || "daily",
          repeatDays: dbHabit.repeat_days || undefined,

          // End repeat
          endRepeatOption: (dbHabit.end_repeat_option as any) || "never",
          endRepeatDate: dbHabit.end_repeat_date || undefined,
          endRepeatCount: dbHabit.end_repeat_count || undefined,

          // Reminder
          reminderEnabled: dbHabit.reminder_enabled || false,
          reminderTime: dbHabit.reminder_time || undefined,

          // Notes
          notes: dbHabit.notes || undefined,
        })
      );

      setHabits(transformedHabits);
    } catch (err) {
      console.error("Error fetching habits:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch habits");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  // Create a new habit
  const createHabit = useCallback(
    async (formData: CreateHabitFormData): Promise<Habit | null> => {
      if (!session?.user?.id) {
        setError("User not authenticated");
        return null;
      }

      try {
        setError(null);

        // Get max sort_order for proper ordering
        const { data: existingHabits } = await supabase
          .from("habits")
          .select("sort_order")
          .eq("user_id", session.user.id)
          .order("sort_order", { ascending: false })
          .limit(1);

        const nextSortOrder =
          existingHabits && existingHabits.length > 0
            ? (existingHabits[0].sort_order || 0) + 1
            : 0;

        const newHabit: DbHabitInsert = {
          user_id: session.user.id,
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

        const createdHabit: Habit = {
          id: data.id,
          userId: data.user_id,
          name: data.name,
          description: data.description || undefined,
          icon: data.icon || "check-circle",
          color: data.color || "#7B61FF",
          createdAt: data.created_at || new Date().toISOString(),
          isActive: data.is_active ?? true,
          sortOrder: data.sort_order || 0,

          // Scheduling fields with defaults
          timeOption: (data.time_option as any) || "anytime",
          scheduledTime: data.scheduled_time || undefined,
          durationMinutes: data.duration_minutes || undefined,
          startDate: data.start_date || new Date().toISOString().split("T")[0],

          // Repeat pattern
          repeatPattern: (data.repeat_pattern as any) || "daily",
          repeatDays: data.repeat_days || undefined,

          // End repeat
          endRepeatOption: (data.end_repeat_option as any) || "never",
          endRepeatDate: data.end_repeat_date || undefined,
          endRepeatCount: data.end_repeat_count || undefined,

          // Reminder
          reminderEnabled: data.reminder_enabled || false,
          reminderTime: data.reminder_time || undefined,

          // Notes
          notes: data.notes || undefined,
        };

        // Update local state
        setHabits((prev) => [...prev, createdHabit]);

        return createdHabit;
      } catch (err) {
        console.error("Error creating habit:", err);
        setError(err instanceof Error ? err.message : "Failed to create habit");
        return null;
      }
    },
    [session?.user?.id]
  );

  // Delete a habit
  const deleteHabit = useCallback(
    async (habitId: string): Promise<boolean> => {
      if (!session?.user?.id) {
        setError("User not authenticated");
        return false;
      }

      try {
        setError(null);

        const { error: deleteError } = await supabase
          .from("habits")
          .delete()
          .eq("id", habitId)
          .eq("user_id", session.user.id);

        if (deleteError) throw deleteError;

        // Cancel any scheduled notifications for this habit
        await handleHabitDeleted(habitId);

        // Update local state
        setHabits((prev) => prev.filter((habit) => habit.id !== habitId));

        return true;
      } catch (err) {
        console.error("Error deleting habit:", err);
        setError(err instanceof Error ? err.message : "Failed to delete habit");
        return false;
      }
    },
    [session?.user?.id]
  );

  // Update habit
  const updateHabit = useCallback(
    async (
      habitId: string,
      updates: Partial<CreateHabitFormData> | any
    ): Promise<boolean> => {
      if (!session?.user?.id) {
        setError("User not authenticated");
        return false;
      }

      try {
        setError(null);

        const { error: updateError } = await supabase
          .from("habits")
          .update({
            name: updates.name,
            description: updates.description || null,
            icon: updates.icon,
            color: updates.color,
            // Scheduling fields
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
          .eq("user_id", session.user.id);

        if (updateError) throw updateError;

        // Refresh habits
        await fetchHabits();

        return true;
      } catch (err) {
        console.error("Error updating habit:", err);
        setError(err instanceof Error ? err.message : "Failed to update habit");
        return false;
      }
    },
    [session?.user?.id, fetchHabits]
  );

  // Load habits on mount and when user changes
  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  return {
    habits,
    loading,
    error,
    createHabit,
    deleteHabit,
    updateHabit,
    refetch: fetchHabits,
  };
};
