/**
 * useStreakSaverNotification (P1.5.5)
 *
 * Schedules a local notification at 8 PM daily to remind users
 * to maintain their streak.
 *
 * Rules:
 * - Only schedule if: streak >= 1 AND no node completed today
 * - Dynamic copy: "Your {N}-day streak ends at midnight!..."
 * - Cancel if user completes a node before 8 PM
 * - Respect user notification preferences (opt-out)
 * - Tap notification → deep link to journey map
 *
 * Uses expo-notifications for scheduling.
 */

import { useCallback, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { router } from "expo-router";

// ============================================================================
// Types
// ============================================================================

export interface UseStreakSaverNotificationParams {
  /** Current streak day count */
  currentStreak: number;
  /** Whether the user has completed any node today */
  isActiveToday: boolean;
  /** Whether the user has opted out of streak notifications */
  notificationsDisabled: boolean;
  /** Journey slug for deep linking */
  journeySlug: string;
  getNotificationCopy: (streakDays: number) => {
    title: string;
    body: string;
  };
}

export interface UseStreakSaverNotificationReturn {
  /** Manually cancel the scheduled notification */
  cancelNotification: () => Promise<void>;
  /** Manually reschedule (e.g., after settings change) */
  reschedule: () => Promise<void>;
}

// ============================================================================
// Constants
// ============================================================================

const NOTIFICATION_IDENTIFIER = "streak-saver-daily";
const NOTIFICATION_HOUR = 19; // 7 PM
const NOTIFICATION_MINUTE = 0;


// ============================================================================
// Helpers
// ============================================================================

// ponytail: passive check only; never pop permission prompt from background hook (AD-2)
async function checkPermissions(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

/** Cancel any scheduled streak saver notification */
export async function cancelStreakSaverNotification(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(
      NOTIFICATION_IDENTIFIER,
    );
  } catch (err) {
    console.warn("[StreakSaver] Failed to cancel notification:", err);
  }
}

/** Build the notification content */
function buildNotificationContent(
  streakDays: number,
  getNotificationCopy: UseStreakSaverNotificationParams["getNotificationCopy"],
): Notifications.NotificationContentInput {
  return {
    ...getNotificationCopy(streakDays),
    sound: "default",
    data: {
      type: "streak_saver",
      action: "open_journey",
    },
  };
}

/** Get the next 7 PM Date object */
function getNext7PM(): Date {
  const now: Date = new Date();
  const target: Date = new Date(now);
  target.setHours(NOTIFICATION_HOUR, NOTIFICATION_MINUTE, 0, 0);

  // If 7 PM has already passed today, schedule for tomorrow
  if (now >= target) {
    target.setDate(target.getDate() + 1);
  }

  return target;
}

// ============================================================================
// Notification response handler (deep link)
// ============================================================================

/** Set up the notification handler globally (called once at app init) */
export function setupStreakNotificationHandler(): void {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/** Handle notification tap → deep link to journey map */
export function handleStreakNotificationResponse(
  response: Notifications.NotificationResponse,
): void {
  const data = response.notification.request.content.data;
  if (data?.type === "streak_saver") {
    router.push("/tabs/screens/journey-map" as never);
  }
}

// ============================================================================
// Hook
// ============================================================================

export function useStreakSaverNotification({
  currentStreak,
  isActiveToday,
  notificationsDisabled,
  journeySlug,
  getNotificationCopy,
}: UseStreakSaverNotificationParams): UseStreakSaverNotificationReturn {
  const scheduledRef = useRef<boolean>(false);

  /** Cancel the scheduled notification */
  const cancelNotification = useCallback(async (): Promise<void> => {
    try {
      await Notifications.cancelScheduledNotificationAsync(
        NOTIFICATION_IDENTIFIER,
      );
      scheduledRef.current = false;
    } catch (err) {
      console.warn("[StreakSaver] Failed to cancel notification:", err);
    }
  }, []);

  /** Schedule the daily streak saver notification */
  const scheduleNotification = useCallback(async (): Promise<void> => {
    // Don't schedule if:
    // - User opted out
    // - No streak to save
    // - Already active today (streak is safe)
    if (notificationsDisabled || currentStreak < 1 || isActiveToday) {
      await cancelNotification();
      return;
    }

    // Check permissions passively (AD-2)
    const hasPermission: boolean = await checkPermissions();
    if (!hasPermission) return;

    // Cancel any existing scheduled notification first
    await cancelNotification();

    try {
      const trigger: Date = getNext7PM();
      const secondsUntilTrigger: number = Math.max(
        1,
        Math.floor((trigger.getTime() - Date.now()) / 1000),
      );

      await Notifications.scheduleNotificationAsync({
        identifier: NOTIFICATION_IDENTIFIER,
        content: buildNotificationContent(currentStreak, getNotificationCopy),
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilTrigger,
          repeats: false,
        },
      });

      scheduledRef.current = true;
    } catch (err) {
      console.warn("[StreakSaver] Failed to schedule notification:", err);
    }
  }, [currentStreak, isActiveToday, notificationsDisabled, cancelNotification, getNotificationCopy]);

  // Auto-schedule/cancel when deps change
  useEffect(() => {
    scheduleNotification();

    return () => {
      // Cleanup: don't cancel on unmount — let the notification fire
    };
  }, [scheduleNotification]);

  // Cancel notification when user becomes active today (streak is saved)
  useEffect(() => {
    if (isActiveToday && scheduledRef.current) {
      cancelNotification();
    }
  }, [isActiveToday, cancelNotification]);

  return {
    cancelNotification,
    reschedule: scheduleNotification,
  };
}

export default useStreakSaverNotification;
