import { Habit } from "@/src/types/habits";
import {
  scheduleHabitNotification,
  cancelHabitNotification,
  updateHabitNotification,
} from "@/src/utils/habitNotifications";

/**
 * Handle notification scheduling when a habit is created
 */
export async function handleHabitCreated(
  habit: Habit,
  copy: { title: string; body: string },
): Promise<void> {
  if (habit.reminderEnabled && habit.reminderTime) {
    await scheduleHabitNotification(habit, copy);
  }
}

/**
 * Handle notification updates when a habit is modified
 */
export async function handleHabitUpdated(
  habit: Habit,
  copy: { title: string; body: string },
): Promise<void> {
  await updateHabitNotification(habit, copy);
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
export async function syncHabitNotifications(
  habits: Habit[],
  copyForHabit: (habit: Habit) => { title: string; body: string },
): Promise<void> {
  for (const habit of habits) {
    if (habit.reminderEnabled && habit.reminderTime) {
      await scheduleHabitNotification(habit, copyForHabit(habit));
    } else {
      // Cancel if reminder is disabled
      await cancelHabitNotification(habit.id);
    }
  }
}
