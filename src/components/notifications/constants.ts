import type { ReminderItem, ReminderColorScheme } from "./types";

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
    bg: "#FEF3C7",
    border: "#FCD34D",
    text: "#92400E",
    icon: "#F59E0B",
  }, // Morning - Amber/Yellow
  "2": {
    bg: "#D1FAE5",
    border: "#6EE7B7",
    text: "#064E3B",
    icon: "#10B981",
  }, // Midday - Green
  "3": {
    bg: "#E9D5FF",
    border: "#C084FC",
    text: "#6B21A8",
    icon: "#A855F7",
  }, // Evening - Purple
};

/**
 * Default color scheme for unknown reminder IDs
 */
export const DEFAULT_COLOR_SCHEME: ReminderColorScheme = {
  bg: "#F3F4F6",
  border: "#E5E7EB",
  text: "#4B5563",
  icon: "#6B7280",
};
