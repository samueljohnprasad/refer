import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/src/network/auth/supabase";

const LAST_NOTIFICATION_KEY = "@last_push_notification";

interface LastNotification {
    notificationLogId: string;
    category: string;
    templateId: string;
    receivedAt: string;
}

/**
 * Store the last received push notification details for conversion tracking.
 * Called when a remote push notification is received or tapped.
 */
export async function trackNotificationReceived(data: {
    notification_log_id: string;
    category: string;
    template_id: string;
}): Promise<void> {
    const entry: LastNotification = {
        notificationLogId: data.notification_log_id,
        category: data.category,
        templateId: data.template_id,
        receivedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(LAST_NOTIFICATION_KEY, JSON.stringify(entry));
}

/**
 * Mark the notification as opened in the database.
 */
export async function trackNotificationOpened(data: {
    notification_log_id: string;
}): Promise<void> {
    await supabase
        .from("notification_log")
        .update({ opened_at: new Date().toISOString() })
        .eq("id", data.notification_log_id);
}

/**
 * Check if the user recently received a push notification and mark it as converted.
 * Call this after the user creates a journal entry, logs mood, or completes a habit.
 * Conversion window: 2 hours.
 */
export async function checkAndTrackConversion(): Promise<void> {
    try {
        const stored = await AsyncStorage.getItem(LAST_NOTIFICATION_KEY);
        if (!stored) return;

        const last: LastNotification = JSON.parse(stored);
        const receivedAt = new Date(last.receivedAt);
        const now = new Date();
        const hoursSince = (now.getTime() - receivedAt.getTime()) / (1000 * 60 * 60);

        // Only count as conversion if within 2 hours
        if (hoursSince > 2) return;

        await supabase
            .from("notification_log")
            .update({ converted_at: now.toISOString() })
            .eq("id", last.notificationLogId);

        // Clear after tracking to avoid double-counting
        await AsyncStorage.removeItem(LAST_NOTIFICATION_KEY);
    } catch (error) {
        console.error("Error tracking notification conversion:", error);
    }
}
