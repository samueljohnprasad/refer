import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Habit, RepeatPattern } from "@/src/types/habits";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.warn("Notification permission not granted");
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("habits", {
      name: "Habit Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#7B61FF",
    });
  }

  return true;
}

/**
 * Get trigger configuration based on repeat pattern
 */
function getTriggerForRepeatPattern(
  repeatPattern: RepeatPattern,
  reminderTime: string, // HH:mm format
  repeatDays?: number[]
): Notifications.NotificationTriggerInput {
  const [hours, minutes] = reminderTime.split(":").map(Number);

  switch (repeatPattern) {
    case "daily":
      return {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      };

    case "weekly":
      // If specific days are set, schedule for those days
      if (repeatDays && repeatDays.length > 0) {
        // Note: Expo uses 1=Sunday, 2=Monday, etc.
        const weekday = repeatDays[0] + 1; // Convert from 0-based to 1-based
        return {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: weekday,
          hour: hours,
          minute: minutes,
        };
      }
      // Default to daily if no specific day
      return {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: hours,
        minute: minutes,
      };

    case "monthly":
      return {
        type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
        day: new Date().getDate(), // Day of the month
        hour: hours,
        minute: minutes,
      };

    case "never":
    default:
      // One-time notification
      const triggerDate = new Date();
      triggerDate.setHours(hours, minutes, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (triggerDate < new Date()) {
        triggerDate.setDate(triggerDate.getDate() + 1);
      }

      return {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      };
  }
}

/**
 * Schedule a notification for a habit
 */
export async function scheduleHabitNotification(
  habit: Habit
): Promise<string | null> {
  try {
    // Check if reminders are enabled and we have permission
    if (!habit.reminderEnabled || !habit.reminderTime) {
      return null;
    }

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      return null;
    }

    // Cancel existing notification for this habit
    await cancelHabitNotification(habit.id);

    // Schedule new notification
    const trigger = getTriggerForRepeatPattern(
      habit.repeatPattern,
      habit.reminderTime,
      habit.repeatDays
    );

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `${habit.icon || "🎯"} Habit Reminder`,
        body: `Time to complete: ${habit.name}`,
        data: {
          habitId: habit.id,
          habitName: habit.name,
        },
        sound: true,
        ...(Platform.OS === "android" && {
          channelId: "habits",
        }),
      },
      trigger,
    });

    console.log(
      `Scheduled notification for habit ${habit.name}:`,
      notificationId
    );
    return notificationId;
  } catch (error) {
    console.error("Error scheduling habit notification:", error);
    return null;
  }
}

/**
 * Cancel notification for a specific habit
 */
export async function cancelHabitNotification(habitId: string): Promise<void> {
  try {
    // Get all scheduled notifications
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    // Find and cancel notifications for this habit
    const habitNotifications = scheduledNotifications.filter(
      (notification) => notification.content.data?.habitId === habitId
    );

    for (const notification of habitNotifications) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
      console.log(`Cancelled notification for habit ${habitId}`);
    }
  } catch (error) {
    console.error("Error canceling habit notification:", error);
  }
}

/**
 * Update notification for a habit (cancel old and schedule new)
 */
export async function updateHabitNotification(
  habit: Habit
): Promise<string | null> {
  await cancelHabitNotification(habit.id);

  if (habit.reminderEnabled && habit.reminderTime) {
    return await scheduleHabitNotification(habit);
  }

  return null;
}

/**
 * Cancel all habit notifications
 */
export async function cancelAllHabitNotifications(): Promise<void> {
  try {
    const scheduledNotifications =
      await Notifications.getAllScheduledNotificationsAsync();

    const habitNotifications = scheduledNotifications.filter(
      (notification) => notification.content.data?.habitId
    );

    for (const notification of habitNotifications) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }

    console.log(`Cancelled ${habitNotifications.length} habit notifications`);
  } catch (error) {
    console.error("Error canceling all habit notifications:", error);
  }
}
