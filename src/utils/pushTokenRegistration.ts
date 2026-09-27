import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { getLocales } from "expo-localization";
import { supabase } from "@/src/network/auth/supabase";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("PushToken");

const PROJECT_ID = "b87a1855-bf48-4992-9004-1ec817a4a5de";

/**
 * Register for push notifications and store the Expo push token in Supabase.
 * Passive by default: will only register if permissions are ALREADY granted.
 * Pass requestPermission: true only on explicit user actions (e.g. Onboarding Continue).
 */
export async function registerPushToken(
    userId: string,
    requestPermission: boolean = false
): Promise<string | null> {
    try {
        if (!Device.isDevice) {
            log.info("Push notifications require a physical device");
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        // ponytail: never prompt for permission on app start or passive sync
        if (existingStatus !== "granted") {
            if (!requestPermission) {
                log.debug("Push notification permission not granted yet (passive check skipped)");
                return null;
            }
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            log.info("Push notification permission not granted by user");
            return null;
        }

        // Set up Android notification channel for remote notifications
        if (Platform.OS === "android") {
            await Notifications.setNotificationChannelAsync("push", {
                name: "Push Notifications",
                importance: Notifications.AndroidImportance.HIGH,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: "#7B61FF",
            });
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
            projectId: PROJECT_ID,
        });

        const expoPushToken = tokenData.data;
        const platform = Platform.OS as "ios" | "android";
        const timezone = getLocales()[0]?.regionCode
            ? Intl.DateTimeFormat().resolvedOptions().timeZone
            : "UTC";

        // Upsert token to Supabase
        const { error } = await supabase.from("push_tokens").upsert(
            {
                user_id: userId,
                expo_push_token: expoPushToken,
                platform,
                is_valid: true,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id,expo_push_token" }
        );

        if (error) {
            log.error("Error storing push token in Supabase:", error);
            return null;
        }

        // Also update timezone in user_preferences
        await supabase.from("user_preferences").upsert(
            {
                user_id: userId,
                timezone,
            },
            { onConflict: "user_id" }
        );

        log.info("Push token registered successfully:", expoPushToken);
        return expoPushToken;
    } catch (error) {
        log.error("Error registering push token:", error);
        return null;
    }
}

/**
 * Remove the push token from Supabase (call on sign out).
 */
export async function unregisterPushToken(userId: string): Promise<void> {
    try {
        await supabase
            .from("push_tokens")
            .update({ is_valid: false })
            .eq("user_id", userId);
    } catch (error) {
        log.error("Error unregistering push token:", error);
    }
}
