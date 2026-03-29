import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { getLocales } from "expo-localization";
import { supabase } from "@/src/network/auth/supabase";

const PROJECT_ID = "b87a1855-bf48-4992-9004-1ec817a4a5de";

/**
 * Register for push notifications and store the Expo push token in Supabase.
 * Should be called after user signs in.
 */
export async function registerPushToken(userId: string): Promise<string | null> {
    try {
        if (!Device.isDevice) {
            console.log("Push notifications require a physical device");
            return null;
        }

        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== "granted") {
            console.log("Push notification permission not granted");
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
            console.error("Error storing push token:", error);
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

        console.log("Push token registered:", expoPushToken);
        return expoPushToken;
    } catch (error) {
        console.error("Error registering push token:", error);
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
        console.error("Error unregistering push token:", error);
    }
}
