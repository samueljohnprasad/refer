import type { ReminderItem, ReminderColorScheme } from "./types";
import { GOLD, INK_SOFT, INK_MUTED, SAGE, TERRACOTTA } from "@/lib/tokens";

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
    bg: SAGE.pill,
    border: SAGE[200],
    text: SAGE[700],
    icon: SAGE[600],
  }, // Morning - Amber/Yellow
  "2": {
    bg: SAGE.selected,
    border: SAGE[300],
    text: SAGE[700],
    icon: SAGE[600],
  }, // Midday - Green
  "3": {
    bg: SAGE[50],
    border: SAGE[200],
    text: INK_SOFT,
    icon: TERRACOTTA,
  }, // Evening - Purple
};

/**
 * Default color scheme for unknown reminder IDs
 */
export const DEFAULT_COLOR_SCHEME: ReminderColorScheme = {
  bg: SAGE[50],
  border: SAGE[100],
  text: INK_MUTED,
  icon: GOLD,
};
