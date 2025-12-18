import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import {
  analyzeCaloriesFromImage,
  CalorieAnalysisResult,
  FoodItem,
  Micronutrients,
} from "@/src/network/calorieAi";
import dayjs from "dayjs";
import { ISO_DATE_FORMAT } from "@/src/utils/date";
import { Database } from "@/database.types";

type DbCalorieEntry = Database["public"]["Tables"]["calorie_entries"]["Row"];

export interface CalorieEntry
  extends Omit<
    DbCalorieEntry,
    | "foods"
    | "health_score"
    | "health_score_reasoning"
    | "suggestions"
    | "total_micronutrients"
  > {
  foods: FoodItem[];
  health_score: number;
  health_score_reasoning: string;
  suggestions: string[];
  total_micronutrients: Micronutrients;
}

interface DailyCalorieSummary {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  meals: CalorieEntry[];
  mealCount: number;
}

/**
 * Fetch calorie entries for a specific date
 */
const fetchCalorieEntries = async (
  userId: string,
  targetDate: string
): Promise<CalorieEntry[]> => {
  const startOfDay = dayjs(targetDate).startOf("day").toISOString();
  const endOfDay = dayjs(targetDate).endOf("day").toISOString();

  const { data, error } = await supabase
    .from("calorie_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("selected_date", startOfDay)
    .lte("selected_date", endOfDay)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching calorie entries:", error);
    return [];
  }

  return (data || []) as unknown as CalorieEntry[];
};

/**
 * Save a calorie entry to the database
 */
const saveCalorieEntry = async (
  userId: string,
  selectedDate: string,
  analysisResult: CalorieAnalysisResult,
  imageUrl: string | null
): Promise<CalorieEntry | null> => {
  const insertData: any = {
    user_id: userId,
    selected_date: selectedDate,
    meal_type: analysisResult.mealType,
    foods:
      analysisResult.foods as unknown as Database["public"]["Tables"]["calorie_entries"]["Insert"]["foods"],
    total_calories: analysisResult.totalCalories,
    total_protein: analysisResult.totalProtein,
    total_carbs: analysisResult.totalCarbs,
    total_fat: analysisResult.totalFat,
    total_fiber: analysisResult.totalFiber,
    health_score: analysisResult.healthScore,
    health_score_reasoning: analysisResult.healthScoreReasoning,
    suggestions: analysisResult.suggestions,
    image_url: imageUrl,
    total_micronutrients:
      analysisResult.totalMicronutrients as unknown as Database["public"]["Tables"]["calorie_entries"]["Insert"]["total_micronutrients"],
  };

  const { data, error } = await supabase
    .from("calorie_entries")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error("Error saving calorie entry:", error);
    return null;
  }

  return data as unknown as CalorieEntry;
};

/**
 * Hook for calorie tracking functionality
 */
export const useCalorieTracker = (targetDate?: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const dateStr = targetDate || dayjs().format(ISO_DATE_FORMAT);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Fetch calorie entries for the target date
  const {
    data: calorieEntries = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["calorie-entries", user?.id, dateStr],
    queryFn: async () => {
      if (!user?.id) return [];
      return fetchCalorieEntries(user.id, dateStr);
    },
    staleTime: 5 * 60 * 1000,
    enabled: Boolean(user?.id),
  });

  // Calculate daily summary
  const dailySummary: DailyCalorieSummary = {
    totalCalories: calorieEntries.reduce((sum, e) => sum + e.total_calories, 0),
    totalProtein: calorieEntries.reduce((sum, e) => sum + e.total_protein, 0),
    totalCarbs: calorieEntries.reduce((sum, e) => sum + e.total_carbs, 0),
    totalFat: calorieEntries.reduce((sum, e) => sum + e.total_fat, 0),
    totalFiber: calorieEntries.reduce((sum, e) => sum + e.total_fiber, 0),
    meals: calorieEntries,
    mealCount: calorieEntries.length,
  };

  // Mutation for saving calorie entries
  const saveEntryMutation = useMutation({
    mutationFn: async ({
      analysisResult,
      imageUrl,
    }: {
      analysisResult: CalorieAnalysisResult;
      imageUrl: string | null;
    }) => {
      if (!user?.id) throw new Error("User not authenticated");
      // Use the selected date from the hook (dateStr)
      return saveCalorieEntry(user.id, dateStr, analysisResult, imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["calorie-entries", user?.id],
      });
    },
  });

  // Analyze food image and save entry
  const analyzeAndSaveFood = useCallback(
    async (imageUri: string): Promise<CalorieAnalysisResult | null> => {
      if (!user?.id) {
        setAnalysisError("User not authenticated");
        return null;
      }

      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        // Analyze the image
        const result = await analyzeCaloriesFromImage(imageUri);

        if (!result.success) {
          setAnalysisError(result.error || "Failed to analyze image");
          return null;
        }

        // Save the entry (image URL can be added if you upload to storage)
        await saveEntryMutation.mutateAsync({
          analysisResult: result,
          imageUrl: null, // Could upload to Supabase storage if needed
        });

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setAnalysisError(errorMessage);
        return null;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [user?.id, saveEntryMutation]
  );

  // Delete a calorie entry
  const deleteEntry = useCallback(
    async (entryId: string): Promise<boolean> => {
      const { error } = await supabase
        .from("calorie_entries")
        .delete()
        .eq("id", entryId);

      if (error) {
        console.error("Error deleting calorie entry:", error);
        return false;
      }

      queryClient.invalidateQueries({
        queryKey: ["calorie-entries", user?.id],
      });
      return true;
    },
    [user?.id, queryClient]
  );

  return {
    calorieEntries,
    dailySummary,
    isLoading,
    error,
    isAnalyzing,
    analysisError,
    analyzeAndSaveFood,
    deleteEntry,
    refetch,
  };
};

export default useCalorieTracker;
