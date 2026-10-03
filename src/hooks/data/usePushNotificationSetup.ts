import { useEffect, useRef } from "react";
import { AppState, type AppStateStatus } from "react-native";
import * as Notifications from "expo-notifications";
import { useAuth } from "@/src/context/AuthContext";
import { registerPushToken } from "@/src/utils/pushTokenRegistration";
import { trackNotificationReceived } from "@/src/utils/notificationConversionTracker";
import { createLogger } from "@/src/lib/logger";

const log = createLogger("usePushNotificationSetup");

/**
 * Hook to set up push notification listeners.
 * Call this once at the root of the app (in _layout.tsx or similar).
 * Handles:
 * - Re-registering push token when app is foregrounded
 * - Tracking notification opens and received events
 */
export function usePushNotificationSetup() {
    const { user } = useAuth();
    const notificationListener = useRef<Notifications.EventSubscription>(null);

    useEffect(() => {
        if (!user?.id) return;

        const syncToken = () => {
            // ponytail: request permission on device so token is registered to Supabase
            registerPushToken(user.id, true)
                .then((token) => {
                    if (token) {
                        log.info("Push token verified:", token);
                    }
                })
                .catch((err) => {
                    log.error("Failed to register push token:", err);
                });
        };

        syncToken();

        // ponytail: re-check token when user returns from iOS Settings
        const appStateSub = AppState.addEventListener("change", (state: AppStateStatus) => {
            if (state === "active") {
                syncToken();
            }
        });

        // Listen for notifications received while app is in foreground
        notificationListener.current =
            Notifications.addNotificationReceivedListener((notification) => {
                const data = notification.request.content.data;
                if (data?.notification_log_id) {
                    trackNotificationReceived({
                        notification_log_id: data.notification_log_id as string,
                        category: (data.category as string) || "",
                        template_id: (data.template_id as string) || "",
                    });
                }
            });

        return () => {
            appStateSub.remove();
            notificationListener.current?.remove();
        };
    }, [user?.id]);
}



