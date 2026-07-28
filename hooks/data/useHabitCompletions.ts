import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  isSameDay,
  parseISO,
  isBefore,
} from "date-fns";
import { useXPOptional } from "@/src/context/XPContext";
import { XPActionType } from "@/src/types/xp";
import { useRewardsContext } from "@/src/context/RewardsContext";
import { useChallengesOptional } from "@/src/context/ChallengesContext";

const HABIT_COMPLETIONS_QUERY_KEY = "habit_completions";
const HABIT_STREAKS_QUERY_KEY = "habit_streaks";

// ponytail: react-query completion fetcher per date
async function fetchCompletionsApi(userId: string, dateString: string): Promise<HabitCompletion[]> {
  const { data, error: fetchError } = await supabase
    .from("habit_completions")
    .select("*")
    .eq("user_id", userId)
    .eq("completed_date", dateString);

  if (fetchError) throw fetchError;

  return (data || []).map((dbCompletion: DbHabitCompletion) => ({
    id: dbCompletion.id,
    habitId: dbCompletion.habit_id,
    userId: dbCompletion.user_id,
    completedDate: dbCompletion.completed_date,
    completedAt: dbCompletion.completed_at,
  }));
}

export const useHabitCompletions = (selectedDate: Date) => {
  const { session } = useAuth();
  const userId = session?.user?.id;
  const dateString = format(selectedDate, "yyyy-MM-dd");
  const queryClient = useQueryClient();

  const xp = useXPOptional();
  const { earnCoinsForAction } = useRewardsContext();
  const challenges = useChallengesOptional();

  // ponytail: cached with react-query for fast habit status updates across days
  const {
    data: completions = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery<HabitCompletion[]>({
    queryKey: [HABIT_COMPLETIONS_QUERY_KEY, userId, dateString],
    queryFn: () => fetchCompletionsApi(userId!, dateString),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  const completeMutation = useMutation({
    mutationFn: async ({ habitId }: { habitId: string; habitName: string }): Promise<boolean> => {
      if (!userId) throw new Error("User not authenticated");

      const { error: insertError } = await supabase
        .from("habit_completions")
        .insert({
          habit_id: habitId,
          user_id: userId,
          completed_date: dateString,
        })
        .select()
        .single();

      if (insertError) {
        if ((insertError as any)?.code === "23505") {
          return true;
        }
        throw insertError;
      }
      return true;
    },
    onSuccess: (_, { habitId, habitName }) => {
      xp?.awardXP(XPActionType.HABIT_COMPLETION, {
        customDescription: `Completed: ${habitName}`,
      });
      earnCoinsForAction("HABIT_COMPLETE");
      challenges?.updateProgress("habit_count");

      queryClient.invalidateQueries({ queryKey: [HABIT_COMPLETIONS_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [HABIT_STREAKS_QUERY_KEY, userId] });
    },
  });

  const uncompleteMutation = useMutation({
    mutationFn: async ({ habitId }: { habitId: string; habitName: string }): Promise<boolean> => {
      if (!userId) throw new Error("User not authenticated");

      const { error: deleteError } = await supabase
        .from("habit_completions")
        .delete()
        .eq("habit_id", habitId)
        .eq("user_id", userId)
        .eq("completed_date", dateString);

      if (deleteError) throw deleteError;
      return true;
    },
    onSuccess: (_, { habitName }) => {
      xp?.removeXP(XPActionType.HABIT_COMPLETION, {
        customDescription: `Uncompleted: ${habitName}`,
      });

      queryClient.invalidateQueries({ queryKey: [HABIT_COMPLETIONS_QUERY_KEY, userId] });
      queryClient.invalidateQueries({ queryKey: [HABIT_STREAKS_QUERY_KEY, userId] });
    },
  });

  const completeHabit = useCallback(
    async (habitId: string, habitName: string): Promise<boolean> => {
      try {
        return await completeMutation.mutateAsync({ habitId, habitName });
      } catch (err) {
        console.error("Error completing habit:", err);
        return false;
      }
    },
    [completeMutation]
  );

  const uncompleteHabit = useCallback(
    async (habitId: string, habitName: string): Promise<boolean> => {
      try {
        return await uncompleteMutation.mutateAsync({ habitId, habitName });
      } catch (err) {
        console.error("Error uncompleting habit:", err);
        return false;
      }
    },
    [uncompleteMutation]
  );

  const toggleHabitCompletion = useCallback(
    async (
      habitId: string,
      isCompleted: boolean,
      habitName: string
    ): Promise<boolean> => {
      if (isCompleted) {
        return await uncompleteHabit(habitId, habitName);
      } else {
        return await completeHabit(habitId, habitName);
      }
    },
    [completeHabit, uncompleteHabit]
  );

  const isHabitScheduledForDate = useCallback(
    (habit: Habit): boolean => {
      if (habit.startDate) {
        const startDate = parseISO(habit.startDate);
        if (isBefore(selectedDate, startDate)) {
          return false;
        }
      }

      switch (habit.repeatPattern) {
        case "daily":
          return true;

        case "weekly":
          const dayOfWeek = getDay(selectedDate);
          if (habit.repeatDays && habit.repeatDays.length > 0) {
            return habit.repeatDays.includes(dayOfWeek);
          }
          if (habit.startDate) {
            const startDayOfWeek = getDay(parseISO(habit.startDate));
            return dayOfWeek === startDayOfWeek;
          }
          return true;

        case "monthly":
          if (habit.startDate) {
            const startDayOfMonth = getDate(parseISO(habit.startDate));
            return getDate(selectedDate) === startDayOfMonth;
          }
          return true;

        case "never":
          if (habit.startDate) {
            return isSameDay(selectedDate, parseISO(habit.startDate));
          }
          return true;

        default:
          return true;
      }
    },
    [selectedDate]
  );

  const getHabitsWithStatus = useCallback(
    (habits: Habit[]): HabitWithStatus[] => {
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
    [completions, isHabitScheduledForDate]
  );

  return {
    completions,
    loading,
    error: error ? (error instanceof Error ? error.message : "Failed to fetch completions") : null,
    completeHabit,
    uncompleteHabit,
    toggleHabitCompletion,
    getHabitsWithStatus,
    refetch,
  };
};
