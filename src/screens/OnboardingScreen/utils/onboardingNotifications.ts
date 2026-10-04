import {
  ensureNotificationPermissions,
  scheduleDailyReminder,
  saveRemindersConfig,
  type RemindersConfig,
} from "@/src/components/lib/notification-reminders";
import { registerPushToken } from "@/src/utils/pushTokenRegistration";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("OnboardingNotifications");

/**
 * Executes when user taps "Continue" on the notification_permission onboarding step.
 * Requests OS notification permissions, registers push token, and schedules enabled daily reminders.
 */
export async function handleNotificationPermissionOnContinue(
  userId: string | undefined,
  remindersCfg: RemindersConfig
): Promise<void> {
  try {
    log.info("Requesting notification permissions on continue click...");
    const granted = await ensureNotificationPermissions();
    if (granted) {
      log.info("Notification permissions granted, setting up reminders and push token...");
      if (userId) {
        registerPushToken(userId, true).catch((err) =>
          log.error("Failed to register push token in onboarding:", err)
        );
      }
      for (const [id, item] of Object.entries(remindersCfg)) {
        if (item.enabled) {
          await scheduleDailyReminder(
            id,
            item.title ?? "",
            { hour: item.hour, minute: item.minute },
            item.body ?? "",
          );
        }
      }
      await saveRemindersConfig(remindersCfg);
    } else {
      log.info("Notification permissions not granted by user in onboarding");
    }
  } catch (err) {
    log.error("Error during notification permission flow in onboarding:", err);
  }
}
