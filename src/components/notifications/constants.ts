import type { ReminderItem, ReminderColorScheme } from "./types";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

/**
 * Default reminder slots with motivational messages
 */
export const DEFAULT_REMINDERS: ReminderItem[] = [
  {
    id: "1",
    title: "Morning Reflection",
    icon: "weather-sunset-up",
    hour: 9,
    minute: 0,
    iconLib: "mc",
    notificationBody:
      "Start your day with clarity ☀️ Take a moment to reflect and set your intentions.",
  },
  {
    id: "2",
    title: "Midday Check-in",
    icon: "sun",
    hour: 14,
    minute: 30,
    iconLib: "fe",
    notificationBody:
      "How's your day going? 🌿 Pause and capture your thoughts right now.",
  },
  {
    id: "3",
    title: "Evening Wind-down",
    icon: "weather-night",
    hour: 21,
    minute: 0,
    iconLib: "mc",
    notificationBody:
      "Time to unwind 🌙 Reflect on your day and celebrate your wins.",
  },
];

/**
 * Color schemes for each reminder type
 */
export const REMINDER_COLOR_MAP: Record<string, ReminderColorScheme> = {
  "1": {
    bg: SEMANTIC_COLORS.selection.surface,
    border: SEMANTIC_COLORS.selection.foreground,
    text: SEMANTIC_COLORS.brand.onSoft,
    icon: SEMANTIC_COLORS.brand.pressed,
  }, // Morning - Amber/Yellow
  "2": {
    bg: SEMANTIC_COLORS.selection.surface,
    border: SEMANTIC_COLORS.border.selected,
    text: SEMANTIC_COLORS.brand.onSoft,
    icon: SEMANTIC_COLORS.brand.pressed,
  }, // Midday - Green
  "3": {
    bg: SEMANTIC_COLORS.selection.surface,
    border: SEMANTIC_COLORS.selection.foreground,
    text: SEMANTIC_COLORS.text.secondary,
    icon: SEMANTIC_COLORS.error.foreground,
  }, // Evening - Purple
};

/**
 * Default color scheme for unknown reminder IDs
 */
export const DEFAULT_COLOR_SCHEME: ReminderColorScheme = {
  bg: SEMANTIC_COLORS.selection.surface,
  border: SEMANTIC_COLORS.brand.soft,
  text: SEMANTIC_COLORS.text.tertiary,
  icon: SEMANTIC_COLORS.warning.foreground,
};
