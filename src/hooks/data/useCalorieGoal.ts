import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";

const DEFAULT_CALORIE_GOAL = 2000;

interface UseCalorieGoalReturn {
  calorieGoal: number;
  isLoading: boolean;
  setCalorieGoal: (goal: number) => Promise<void>;
}

/**
 * Custom hook to manage the user's daily calorie goal.
 * Stores the goal in the user's profile in Supabase.
 */
export function useCalorieGoal(): UseCalorieGoalReturn {
  const { user } = useAuth();
  const [calorieGoal, setCalorieGoalState] =
    useState<number>(DEFAULT_CALORIE_GOAL);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load calorie goal from profile
  useEffect(() => {
    const loadCalorieGoal = async (): Promise<void> => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("daily_calorie_goal")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Failed to load calorie goal:", error);
        } else if (data?.daily_calorie_goal) {
          setCalorieGoalState(data.daily_calorie_goal);
        }
      } catch (error) {
        console.error("Failed to load calorie goal:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalorieGoal();
  }, [user]);

  // Save calorie goal to profile
  const setCalorieGoal = useCallback(
    async (goal: number): Promise<void> => {
      if (!user) {
        console.error("Cannot set calorie goal: user not authenticated");
        return;
      }

      try {
        if (goal > 0) {
          const { error } = await supabase
            .from("profiles")
            .update({ daily_calorie_goal: goal })
            .eq("id", user.id);

          if (error) {
            console.error("Failed to save calorie goal:", error);
            throw error;
          }

          setCalorieGoalState(goal);
        }
      } catch (error) {
        console.error("Failed to save calorie goal:", error);
        throw error;
      }
    },
    [user]
  );

  return {
    calorieGoal,
    isLoading,
    setCalorieGoal,
  };
}

export default useCalorieGoal;
