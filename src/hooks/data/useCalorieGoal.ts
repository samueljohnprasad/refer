import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CALORIE_GOAL_KEY = "daily_calorie_goal";
const DEFAULT_CALORIE_GOAL = 2000;

interface UseCalorieGoalReturn {
  calorieGoal: number;
  isLoading: boolean;
  setCalorieGoal: (goal: number) => Promise<void>;
}

/**
 * Custom hook to manage the user's daily calorie goal.
 * Stores the goal in AsyncStorage for persistence.
 */
export function useCalorieGoal(): UseCalorieGoalReturn {
  const [calorieGoal, setCalorieGoalState] =
    useState<number>(DEFAULT_CALORIE_GOAL);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load calorie goal from storage on mount
  useEffect(() => {
    const loadCalorieGoal = async (): Promise<void> => {
      try {
        const savedGoal = await AsyncStorage.getItem(CALORIE_GOAL_KEY);
        if (savedGoal !== null) {
          const parsedGoal = parseInt(savedGoal, 10);
          if (!isNaN(parsedGoal) && parsedGoal > 0) {
            setCalorieGoalState(parsedGoal);
          }
        }
      } catch (error) {
        console.error("Failed to load calorie goal:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadCalorieGoal();
  }, []);

  // Save calorie goal to storage
  const setCalorieGoal = useCallback(async (goal: number): Promise<void> => {
    try {
      if (goal > 0) {
        await AsyncStorage.setItem(CALORIE_GOAL_KEY, goal.toString());
        setCalorieGoalState(goal);
      }
    } catch (error) {
      console.error("Failed to save calorie goal:", error);
      throw error;
    }
  }, []);

  return {
    calorieGoal,
    isLoading,
    setCalorieGoal,
  };
}

export default useCalorieGoal;
