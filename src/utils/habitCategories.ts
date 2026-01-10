import { HabitWithStatus } from "@/src/types/habits";

export type TimeCategory = "morning" | "afternoon" | "evening" | "anytime";

export interface CategorizedHabits {
  morning: HabitWithStatus[];
  afternoon: HabitWithStatus[];
  evening: HabitWithStatus[];
  anytime: HabitWithStatus[];
}

export const TIME_CATEGORY_CONFIG: Record<
  TimeCategory,
  { label: string; emoji: string; range: string }
> = {
  morning: { label: "Morning", emoji: "🌅", range: "Before 12 PM" },
  afternoon: { label: "Afternoon", emoji: "☀️", range: "12 PM - 5 PM" },
  evening: { label: "Evening", emoji: "🌙", range: "After 5 PM" },
  anytime: { label: "Anytime", emoji: "⏰", range: "Flexible" },
};

/**
 * Get the time category for a habit based on its scheduled time
 */
export const getHabitTimeCategory = (scheduledTime?: string): TimeCategory => {
  if (!scheduledTime) return "anytime";

  const [hours] = scheduledTime.split(":").map(Number);

  if (hours < 12) return "morning";
  if (hours < 17) return "afternoon";
  return "evening";
};

/**
 * Categorize habits by time of day
 */
export const categorizeHabits = (
  habits: HabitWithStatus[]
): CategorizedHabits => {
  const categorized: CategorizedHabits = {
    morning: [],
    afternoon: [],
    evening: [],
    anytime: [],
  };

  habits.forEach((habit) => {
    const category = getHabitTimeCategory(habit.scheduledTime);
    categorized[category].push(habit);
  });

  return categorized;
};

/**
 * Get ordered categories that have habits
 */
export const getActiveCategories = (
  categorized: CategorizedHabits
): TimeCategory[] => {
  const order: TimeCategory[] = ["morning", "afternoon", "evening", "anytime"];
  return order.filter((cat) => categorized[cat].length > 0);
};
