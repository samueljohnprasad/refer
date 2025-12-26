import { Habit } from "@/src/types/habits";
import {
  scheduleHabitNotification,
  cancelHabitNotification,
  updateHabitNotification,
} from "@/src/utils/habitNotifications";

/**
 * Handle notification scheduling when a habit is created
 */
export async function handleHabitCreated(habit: Habit): Promise<void> {
  if (habit.reminderEnabled && habit.reminderTime) {
    await scheduleHabitNotification(habit);
  }
}

/**
 * Handle notification updates when a habit is modified
 */
export async function handleHabitUpdated(habit: Habit): Promise<void> {
  await updateHabitNotification(habit);
}

/**
 * Handle notification cancellation when a habit is deleted
 */
export async function handleHabitDeleted(habitId: string): Promise<void> {
  await cancelHabitNotification(habitId);
}

/**
 * Sync notifications for all habits (useful on app start or after permission changes)
 */
export async function syncHabitNotifications(habits: Habit[]): Promise<void> {
  for (const habit of habits) {
    if (habit.reminderEnabled && habit.reminderTime) {
      await scheduleHabitNotification(habit);
    } else {
      // Cancel if reminder is disabled
      await cancelHabitNotification(habit.id);
    }
  }
}
