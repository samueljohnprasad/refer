// notification-reminders.ts
// Beginner-friendly helper for local daily reminders using Expo Notifications.
// Responsibilities:
// - store/load reminder settings (time, enabled, notifId) in AsyncStorage
// - request OS permissions (iOS/Android)
// - ensure the Android notification channel exists
// - parse a 'hh:mm A' string from the UI into 24-hour hour/minute
// - schedule and cancel daily notifications at a given time

import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export type RemindersConfigItem = {
  hour: number;
  minute: number;
  enabled: boolean;
  // Identifier returned by scheduleNotificationAsync, used to cancel/reschedule
  notifId?: string;
  title?: string;
};
export type RemindersConfig = Record<
  // The reminder slot id (e.g., "1", "2", "3")
  string,
  RemindersConfigItem
>;

// Where we store the entire reminders map in AsyncStorage
const STORAGE_KEY = "@reminders_config_v1";

// Load the persisted reminders map from AsyncStorage.
export async function loadRemindersConfig(): Promise<RemindersConfig> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed ?? {};
  } catch {
    return {};
  }
}

// Save the entire reminders map to AsyncStorage.
export async function saveRemindersConfig(cfg: RemindersConfig): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

// Android 8+ requires a notification channel. We'll ensure a "default" channel
// exists so our scheduled notifications have somewhere to go.
async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync("default", {
    name: "Default",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

// Ask the OS for permission to show notifications if needed.
// Returns true if granted (or provisionally allowed on iOS), false otherwise.
export async function ensureNotificationPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const perms = await Notifications.getPermissionsAsync();
  if (
    perms.granted ||
    (perms.ios &&
      "status" in perms.ios &&
      perms.ios.status === Notifications.IosAuthorizationStatus.PROVISIONAL)
  ) {
    return true;
  }
  const req = await Notifications.requestPermissionsAsync();
  return !!(
    req.granted ||
    (typeof (req as any).ios === "object" &&
      (req as any).ios?.status ===
        Notifications.IosAuthorizationStatus.PROVISIONAL)
  );
}

// Convert a 'hh:mm AM/PM' string into 24-hour { hour, minute } numbers.
// Examples:
//  - '12:00 AM' -> { hour: 0, minute: 0 }
//  - '12:00 PM' -> { hour: 12, minute: 0 }
//  - '01:30 PM' -> { hour: 13, minute: 30 }
export function parseHourMinute(time: string): {
  hour: number;
  minute: number;
} {
  const d = dayjs(time.trim(), "hh:mm A", true); // strict format
  if (!d.isValid()) return { hour: 9, minute: 0 };
  return { hour: d.hour(), minute: d.minute() };
}

// Schedule a local notification to fire once per day at the given time.
// Returns an identifier you must keep if you want to cancel/reschedule later.
export async function scheduleDailyReminder(
  id: string,
  title: string,
  time: { hour: number; minute: number }
): Promise<string> {
  await ensureAndroidChannel();
  const { hour, minute } = time;
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body: "Time to journal.",
      sound: Platform.OS === "android" ? undefined : "default",
    },
    trigger: {
      // DAILY trigger: fires once a day at this hour/minute (local time)
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
  return identifier;
}

// Cancel a previously scheduled notification by its identifier.
export async function cancelReminder(notifId?: string): Promise<void> {
  if (!notifId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notifId);
  } catch {}
}
