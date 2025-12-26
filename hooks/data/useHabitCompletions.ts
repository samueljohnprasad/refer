import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import {
  HabitCompletion,
  DbHabitCompletion,
  HabitWithStatus,
  Habit,
} from "@/src/types/habits";
import { format } from "date-fns";

export const useHabitCompletions = (selectedDate: Date) => {
  const { session } = useAuth();
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateString = format(selectedDate, "yyyy-MM-dd");

  // Fetch completions for a specific date
  const fetchCompletions = useCallback(async () => {
    if (!session?.user?.id) {
      setCompletions([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("completed_date", dateString);

      if (fetchError) throw fetchError;

      const transformedCompletions: HabitCompletion[] = (data || []).map(
        (dbCompletion: DbHabitCompletion) => ({
          id: dbCompletion.id,
          habitId: dbCompletion.habit_id,
          userId: dbCompletion.user_id,
          completedDate: dbCompletion.completed_date,
          completedAt: dbCompletion.completed_at,
        })
      );

      setCompletions(transformedCompletions);
    } catch (err) {
      console.error("Error fetching completions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch completions"
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, dateString]);

  // Complete a habit
  const completeHabit = useCallback(
    async (habitId: string): Promise<boolean> => {
      if (!session?.user?.id) {
        setError("User not authenticated");
        return false;
      }

      try {
        setError(null);

        const { data, error: insertError } = await supabase
          .from("habit_completions")
          .insert({
            habit_id: habitId,
            user_id: session.user.id,
            completed_date: dateString,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Add to local state
        const newCompletion: HabitCompletion = {
          id: data.id,
          habitId: data.habit_id,
          userId: data.user_id,
          completedDate: data.completed_date,
          completedAt: data.completed_at,
        };

        setCompletions((prev) => [...prev, newCompletion]);

        return true;
      } catch (err) {
        console.error("Error completing habit:", err);
        setError(
          err instanceof Error ? err.message : "Failed to complete habit"
        );
        return false;
      }
    },
    [session?.user?.id, dateString]
  );

  // Uncomplete a habit
  const uncompleteHabit = useCallback(
    async (habitId: string): Promise<boolean> => {
      if (!session?.user?.id) {
        setError("User not authenticated");
        return false;
      }

      try {
        setError(null);

        const { error: deleteError } = await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("user_id", session.user.id)
          .eq("completed_date", dateString);

        if (deleteError) throw deleteError;

        // Remove from local state
        setCompletions((prev) => prev.filter((c) => c.habitId !== habitId));

        return true;
      } catch (err) {
        console.error("Error uncompleting habit:", err);
        setError(
          err instanceof Error ? err.message : "Failed to uncomplete habit"
        );
        return false;
      }
    },
    [session?.user?.id, dateString]
  );

  // Toggle habit completion
  const toggleHabitCompletion = useCallback(
    async (habitId: string, isCompleted: boolean): Promise<boolean> => {
      if (isCompleted) {
        return await uncompleteHabit(habitId);
      } else {
        return await completeHabit(habitId);
      }
    },
    [completeHabit, uncompleteHabit]
  );

  // Combine habits with their completion status
  const getHabitsWithStatus = useCallback(
    (habits: Habit[]): HabitWithStatus[] => {
      return habits.map((habit) => {
        const completion = completions.find((c) => c.habitId === habit.id);
        return {
          ...habit,
          isCompleted: !!completion,
          completionId: completion?.id,
        };
      });
    },
    [completions]
  );

  // Load completions when date or user changes
  useEffect(() => {
    fetchCompletions();
  }, [fetchCompletions]);

  return {
    completions,
    loading,
    error,
    completeHabit,
    uncompleteHabit,
    toggleHabitCompletion,
    getHabitsWithStatus,
    refetch: fetchCompletions,
  };
};
