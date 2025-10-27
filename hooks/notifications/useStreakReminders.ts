import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useUserProfile } from "@/hooks/data/useUserProfile";
import {
  shouldRemindAboutStreak,
  getTodayDate,
} from "@/hooks/data/useStreakCalculation";

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface ReminderSchedule {
  hour: number;
  minute: number;
  enabled: boolean;
}

/**
 * Hook to manage streak reminder notifications
 */
export const useStreakReminders = () => {
  const { data: userProfile } = useUserProfile();

  useEffect(() => {
    // Request permissions on mount
    requestNotificationPermissions();
  }, []);

  /**
   * Request notification permissions
   */
  const requestNotificationPermissions = async () => {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("streak-reminders", {
        name: "Streak Reminders",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF6A3D",
      });
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Notification permissions not granted");
      return false;
    }

    return true;
  };

  /**
   * Schedule daily reminder notification
   */
  const scheduleStreakReminder = async (schedule: ReminderSchedule) => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    // Cancel existing reminders
    await cancelAllStreakReminders();

    if (!schedule.enabled) return;

    const currentStreak = userProfile?.currentStreak ?? 0;
    const lastJournalDate = userProfile?.lastJournalDate;

    // Only schedule if user has an active streak
    if (currentStreak === 0) return;

    // Schedule daily notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Don't break your streak! 🔥",
        body: `You're on a ${currentStreak} day streak. Journal today to keep it going!`,
        data: { type: "streak-reminder", streak: currentStreak },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        repeats: true,
        hour: schedule.hour,
        minute: schedule.minute,
      },
    });

    console.log(
      `Streak reminder scheduled for ${schedule.hour}:${schedule.minute}`
    );
  };

  /**
   * Send immediate reminder if user hasn't journaled today
   */
  const sendImmediateReminder = async () => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const currentStreak = userProfile?.currentStreak ?? 0;
    const lastJournalDate = userProfile?.lastJournalDate ?? null;

    if (!shouldRemindAboutStreak(lastJournalDate, currentStreak)) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Your streak is waiting! 🔥",
        body: `Keep your ${currentStreak} day streak alive. Take a moment to journal.`,
        data: { type: "streak-reminder", streak: currentStreak },
        sound: true,
      },
      trigger: null, // Send immediately
    });
  };

  /**
   * Send notification when streak is about to break (evening reminder)
   */
  const sendStreakWarning = async () => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const currentStreak = userProfile?.currentStreak ?? 0;
    const lastJournalDate = userProfile?.lastJournalDate ?? null;
    const todayDate = getTodayDate();

    // Only send if user hasn't journaled today and has active streak
    if (lastJournalDate === todayDate || currentStreak === 0) {
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "⚠️ Your streak is about to break!",
        body: `Don't lose your ${currentStreak} day streak! Journal before midnight.`,
        data: { type: "streak-warning", streak: currentStreak },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  };

  /**
   * Send celebration notification for milestone achievements
   */
  const sendMilestoneNotification = async (milestone: number) => {
    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) return;

    const messages: Record<number, string> = {
      3: "You're on fire! 3 days strong! 🔥",
      7: "One week streak! You're building a habit! 🎉",
      14: "Two weeks! You're unstoppable! 💪",
      30: "30 days! This is a real habit now! 🌟",
      45: "45 days! You're a journaling champion! 👑",
      60: "60 days! Two months of consistency! 🚀",
      90: "90 days! Three months of growth! 🎊",
      180: "Half a year! You're incredible! 🏆",
      365: "ONE YEAR! You're a legend! 🎖️",
    };

    const body = messages[milestone] || `${milestone} day streak! Amazing! 🎉`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `🎉 ${milestone} Day Milestone!`,
        body,
        data: { type: "milestone", milestone },
        sound: true,
        priority: Notifications.AndroidNotificationPriority.MAX,
      },
      trigger: null,
    });
  };

  /**
   * Cancel all streak reminder notifications
   */
  const cancelAllStreakReminders = async () => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of notifications) {
      if (
        notification.content.data?.type === "streak-reminder" ||
        notification.content.data?.type === "streak-warning"
      ) {
        await Notifications.cancelScheduledNotificationAsync(
          notification.identifier
        );
      }
    }
  };

  /**
   * Get all scheduled reminders
   */
  const getScheduledReminders = async () => {
    const notifications =
      await Notifications.getAllScheduledNotificationsAsync();
    return notifications.filter(
      (n) =>
        n.content.data?.type === "streak-reminder" ||
        n.content.data?.type === "streak-warning"
    );
  };

  return {
    scheduleStreakReminder,
    sendImmediateReminder,
    sendStreakWarning,
    sendMilestoneNotification,
    cancelAllStreakReminders,
    getScheduledReminders,
    requestNotificationPermissions,
  };
};

/**
 * Hook to listen for notification responses (when user taps notification)
 */
export const useNotificationListener = (
  onNotificationTap: (data: any) => void
) => {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        onNotificationTap(data);
      }
    );

    return () => subscription.remove();
  }, [onNotificationTap]);
};
