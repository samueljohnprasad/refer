/**
 * XP System Types and Constants
 * Defines all XP-related types, action types, and reward values
 */

export enum XPActionType {
  MOOD_LOG = "mood_log",
  JOURNAL_ENTRY = "journal_entry",
  VOICE_JOURNAL = "voice_journal",
  IMAGE_JOURNAL = "image_journal",
  WELLNESS_PROMPT = "wellness_prompt",
  WEEKLY_REFLECTION = "weekly_reflection",
  HABIT_COMPLETION = "habit_completion",
  CALORIE_LOG = "calorie_log",
  EXERCISE_COMPLETE = "exercise_complete",
}

export const XP_REWARDS: Record<XPActionType, number> = {
  [XPActionType.MOOD_LOG]: 10,
  [XPActionType.JOURNAL_ENTRY]: 25,
  [XPActionType.VOICE_JOURNAL]: 30,
  [XPActionType.IMAGE_JOURNAL]: 20,
  [XPActionType.WELLNESS_PROMPT]: 15,
  [XPActionType.WEEKLY_REFLECTION]: 50,
  [XPActionType.HABIT_COMPLETION]: 10,
  [XPActionType.CALORIE_LOG]: 15,
  [XPActionType.EXERCISE_COMPLETE]: 10,
};

export interface XPHistoryEntry {
  id: string;
  action: XPActionType;
  amount: number;
  timestamp: string;
  description?: string;
}

export interface XPData {
  totalXP: number;
  todayXP: number;
  lastResetDate: string;
  history: XPHistoryEntry[];
}

export const XP_STORAGE_KEY = "@wellness_app_xp_data";

export const XP_ACTION_LABELS: Record<XPActionType, string> = {
  [XPActionType.MOOD_LOG]: "Mood logged",
  [XPActionType.JOURNAL_ENTRY]: "Journal entry",
  [XPActionType.VOICE_JOURNAL]: "Voice journal",
  [XPActionType.IMAGE_JOURNAL]: "Photo journal",
  [XPActionType.WELLNESS_PROMPT]: "Wellness prompt",
  [XPActionType.WEEKLY_REFLECTION]: "Weekly reflection",
  [XPActionType.HABIT_COMPLETION]: "Habit completed",
  [XPActionType.CALORIE_LOG]: "Meal tracked",
  [XPActionType.EXERCISE_COMPLETE]: "Exercise completed",
};
