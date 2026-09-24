import type { RemindersConfig } from "@/src/components/lib/notification-reminders";

export const REMINDER_CONFIG_BY_TIME = {
  morning: { hour: 8, minute: 0 },
  afternoon: { hour: 13, minute: 0 },
  evening: { hour: 19, minute: 0 },
} as const;

export const buildReminderConfig = (
  time: keyof typeof REMINDER_CONFIG_BY_TIME | undefined,
): RemindersConfig => {
  if (!time) return {};

  const reminderTime = REMINDER_CONFIG_BY_TIME[time];
  return {
    "1": {
      ...reminderTime,
      enabled: true,
      title: "A gentle check-in",
      body: "Take a few minutes to notice what you are carrying.",
    },
  };
};
