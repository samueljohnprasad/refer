import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { useAuth } from "@/src/context/AuthContext";
import { registerPushToken } from "@/src/utils/pushTokenRegistration";
import { trackNotificationReceived } from "@/src/utils/notificationConversionTracker";


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

        // Re-register token on app mount (tokens can change)
        registerPushToken(user.id).catch(console.error);

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
            notificationListener.current?.remove();
        };
    }, [user?.id]);
}



