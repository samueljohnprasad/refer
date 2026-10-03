import type { PresetHabit } from "@/src/types/habits";

export const HABIT_PRESET_KEYS = [
  "water",
  "exercise",
  "meditate",
  "read",
  "gratitude",
  "journal",
  "sleep",
  "walk",
] as const;

export const HABIT_PRESET_ICONS = ["💧", "💪", "🧘", "📚", "❤️", "✍️", "😴", "🚶"];

export function getHabitPreset(
  index: number,
  name: string,
  description: string,
): PresetHabit {
  const categories = ["health", "health", "health", "productivity", "productivity", "mindfulness", "health", "selfcare"] as const;
  return {
    name,
    description,
    icon: HABIT_PRESET_ICONS[index],
    category: categories[index],
  };
}
