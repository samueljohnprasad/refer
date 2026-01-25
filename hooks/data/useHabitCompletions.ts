import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import {
  HabitCompletion,
  DbHabitCompletion,
  HabitWithStatus,
  Habit,
} from "@/src/types/habits";
import {
  format,
  getDay,
  getDate,
  getMonth,
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
} from "date-fns";
import { useXPOptional } from "@/src/context/XPContext";
import { XPActionType } from "@/src/types/xp";
import { useRewardsContext } from "@/src/context/RewardsContext";
import { useChallengesOptional } from "@/src/context/ChallengesContext";

export const useHabitCompletions = (selectedDate: Date) => {
  const { session } = useAuth();
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateString = format(selectedDate, "yyyy-MM-dd");
  const xp = useXPOptional();
  const { earnCoinsForAction } = useRewardsContext();
  const challenges = useChallengesOptional();

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
        }),
      );

      setCompletions(transformedCompletions);
    } catch (err) {
      console.error("Error fetching completions:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch completions",
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, dateString]);

  // Complete a habit
  const completeHabit = useCallback(
    async (habitId: string, habitName: string): Promise<boolean> => {
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

        // Award XP for habit completion with custom description
        xp?.awardXP(XPActionType.HABIT_COMPLETION, {
          customDescription: `Completed: ${habitName}`,
        });
        // Earn coins for habit completion
        earnCoinsForAction("HABIT_COMPLETE");
        // Update habit challenge
        challenges?.updateProgress("habit_count");

        return true;
      } catch (err: any) {
        // Handle duplicate key error (already completed) gracefully
        if (err?.code === "23505") {
          console.log("Habit already completed, ignoring duplicate check.");

          // Ensure it's in local state if not already (optimistic update backup)
          // We can't rely on `data` here since insert failed,
          // but we know it's completed for the current user/date/habitId.
          // Since we don't have the `id` of the existing row, we can just skip adding to state
          // assuming it's already there or will be fetched.
          // Or simpler: just return true.
          return true;
        }

        console.error("Error completing habit:", err);
        setError(
          err instanceof Error ? err.message : "Failed to complete habit",
        );
        return false;
      }
    },
    [session?.user?.id, dateString],
  );

  // Uncomplete a habit
  const uncompleteHabit = useCallback(
    async (habitId: string, habitName: string): Promise<boolean> => {
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

        // Remove XP for habit completion
        xp?.removeXP(XPActionType.HABIT_COMPLETION, {
          customDescription: `Uncompleted: ${habitName}`,
        });

        return true;
      } catch (err) {
        console.error("Error uncompleting habit:", err);
        setError(
          err instanceof Error ? err.message : "Failed to uncomplete habit",
        );
        return false;
      }
    },
    [session?.user?.id, dateString],
  );

  // Toggle habit completion
  const toggleHabitCompletion = useCallback(
    async (
      habitId: string,
      isCompleted: boolean,
      habitName: string,
    ): Promise<boolean> => {
      if (isCompleted) {
        return await uncompleteHabit(habitId, habitName);
      } else {
        return await completeHabit(habitId, habitName);
      }
    },
    [completeHabit, uncompleteHabit],
  );

  // Check if a habit should be shown on the selected date based on repeat pattern
  const isHabitScheduledForDate = useCallback(
    (habit: Habit): boolean => {
      // Check if habit has started
      if (habit.startDate) {
        const startDate = parseISO(habit.startDate);
        if (isBefore(selectedDate, startDate)) {
          return false; // Habit hasn't started yet
        }
      }

      // Check repeat pattern
      switch (habit.repeatPattern) {
        case "daily":
          return true; // Show every day

        case "weekly":
          // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
          const dayOfWeek = getDay(selectedDate);
          // If repeatDays is set, check if today is in the list
          if (habit.repeatDays && habit.repeatDays.length > 0) {
            return habit.repeatDays.includes(dayOfWeek);
          }
          // If no specific days set, show on the same day as start date
          if (habit.startDate) {
            const startDayOfWeek = getDay(parseISO(habit.startDate));
            return dayOfWeek === startDayOfWeek;
          }
          return true;

        case "monthly":
          // Show on the same day of the month as the start date
          if (habit.startDate) {
            const startDayOfMonth = getDate(parseISO(habit.startDate));
            return getDate(selectedDate) === startDayOfMonth;
          }
          return true;

        case "never":
          // One-time habit - only show on the start date
          if (habit.startDate) {
            return isSameDay(selectedDate, parseISO(habit.startDate));
          }
          return true;

        default:
          return true;
      }
    },
    [selectedDate],
  );

  // Combine habits with their completion status (filtered by schedule)
  const getHabitsWithStatus = useCallback(
    (habits: Habit[]): HabitWithStatus[] => {
      // Filter habits that are scheduled for the selected date
      const scheduledHabits = habits.filter(isHabitScheduledForDate);

      return scheduledHabits.map((habit) => {
        const completion = completions.find((c) => c.habitId === habit.id);
        return {
          ...habit,
          isCompleted: !!completion,
          completionId: completion?.id,
        };
      });
    },
    [completions, isHabitScheduledForDate],
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
