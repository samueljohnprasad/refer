import { Database } from "@/database.types";

// Database types
export type DbHabit = Database["public"]["Tables"]["habits"]["Row"];
export type DbHabitInsert = Database["public"]["Tables"]["habits"]["Insert"];
export type DbHabitUpdate = Database["public"]["Tables"]["habits"]["Update"];

export type DbHabitCompletion =
  Database["public"]["Tables"]["habit_completions"]["Row"];
export type DbHabitCompletionInsert =
  Database["public"]["Tables"]["habit_completions"]["Insert"];
export type DbHabitCompletionUpdate =
  Database["public"]["Tables"]["habit_completions"]["Update"];

// Time options
export type TimeOption = "anytime" | "at_time";

// Repeat patterns
export type RepeatPattern = "never" | "daily" | "weekly" | "monthly";

// End repeat options
export type EndRepeatOption = "never" | "on_date" | "after_count";

// Application types
export interface Habit {
  id: string;
  userId: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  createdAt: string;
  isActive: boolean;
  sortOrder: number;

  // Scheduling fields
  timeOption: TimeOption;
  scheduledTime?: string; // HH:mm format
  durationMinutes?: number;
  startDate: string;

  // Repeat pattern
  repeatPattern: RepeatPattern;
  repeatDays?: number[]; // For weekly: 0=Sunday, 1=Monday, etc.

  // End repeat
  endRepeatOption: EndRepeatOption;
  endRepeatDate?: string;
  endRepeatCount?: number;

  // Reminder
  reminderEnabled: boolean;
  reminderTime?: string; // HH:mm format

  // Notes
  notes?: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  userId: string;
  completedDate: string;
  completedAt: string;
}

// Habit with completion status for a specific date
export interface HabitWithStatus extends Habit {
  isCompleted: boolean;
  completionId?: string;
  currentStreak?: number;
  longestStreak?: number;
}

// Preset habit template
export interface PresetHabit {
  name: string;
  description: string;
  icon: string;
  category: "health" | "productivity" | "selfcare" | "mindfulness";
}

// Habit creation form data
export interface CreateHabitFormData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

// Habit scheduling form data
export interface HabitSchedulingData {
  timeOption: TimeOption;
  scheduledTime?: string;
  durationMinutes?: number;
  startDate: string;
  repeatPattern: RepeatPattern;
  repeatDays?: number[];
  endRepeatOption: EndRepeatOption;
  endRepeatDate?: string;
  endRepeatCount?: number;
  reminderEnabled: boolean;
  reminderTime?: string;
  notes?: string;
}

// Streak information
export interface HabitStreak {
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate?: string;
}
