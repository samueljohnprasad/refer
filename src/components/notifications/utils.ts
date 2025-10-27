import type { ReminderColorScheme } from "./types";
import { REMINDER_COLOR_MAP, DEFAULT_COLOR_SCHEME } from "./constants";

/**
 * Get color scheme for a specific reminder by ID
 */
export const getColorForReminder = (id: string): ReminderColorScheme => {
  return REMINDER_COLOR_MAP[id] ?? DEFAULT_COLOR_SCHEME;
};
