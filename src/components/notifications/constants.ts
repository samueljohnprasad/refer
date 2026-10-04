import type { ReminderTemplateWithIcon, ReminderColorScheme } from "./types";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

/**
 * Default reminder slots with motivational messages
 */
export const DEFAULT_REMINDERS: ReminderTemplateWithIcon[] = [
  {
    id: "1",
    icon: "weather-sunset-up",
    hour: 9,
    minute: 0,
    iconLib: "mc",
  },
  {
    id: "2",
    icon: "sun",
    hour: 14,
    minute: 30,
    iconLib: "fe",
  },
  {
    id: "3",
    icon: "weather-night",
    hour: 21,
    minute: 0,
    iconLib: "mc",
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
