import "@/global.css";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";

// Disable Reanimated strict mode to prevent warnings from libraries like @gorhom/bottom-sheet
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

// ponytail: prevent uncaught JS exceptions from triggering native process abort in production
const globalRef = global as unknown as {
  ErrorUtils?: {
    getGlobalHandler?: () => ((error: unknown, isFatal?: boolean) => void) | undefined;
    setGlobalHandler: (handler: (error: unknown, isFatal?: boolean) => void) => void;
  };
};

if (!__DEV__ && typeof globalRef.ErrorUtils !== "undefined") {
  const defaultHandler = globalRef.ErrorUtils.getGlobalHandler?.();
  globalRef.ErrorUtils.setGlobalHandler((error: unknown, isFatal?: boolean) => {
    console.warn("[GlobalHandler] Caught unhandled exception:", error);
    if (defaultHandler) {
      try {
        defaultHandler(error, false);
      } catch {}
    }
  });
}

import { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { requireOptionalNativeModule } from "expo-modules-core";
import { router as expoRouter } from "expo-router";
import { Alert, AppState, type AppStateStatus, StyleSheet, View, useColorScheme } from "react-native";
import { initI18n, i18n, refreshDeviceLanguage } from "@/src/lib/i18n";
import { StatusBar } from "expo-status-bar";
import { Presets } from "react-native-pulsar";
import * as Notifications from "expo-notifications";
import { HapticManager } from "@/lib/haptics/HapticManager";
import { APP_FONT_SOURCES } from "@/src/theme/typography";
import { posthogLog } from "@/src/lib/posthogLogger";
import {
  trackNotificationOpened,
  trackNotificationReceived,
} from "@/src/utils/notificationConversionTracker";
import { SplashOverlay } from "@/src/components/splash";
import { RootLayoutNav } from "@/src/components/layout/RootLayoutNav";
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.setOptions({
  duration: 0,
  fade: false,
});

void SplashScreen.preventAutoHideAsync().catch(() => {});

// Configure how notifications behave while the app is in the foreground.
// Without this, local notifications may be silent or not visible if the app
// is open. Returning these flags makes foreground notifications noticeable.
// Note: exact properties can be platform/version-specific.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [loaded, error] = useFonts(APP_FONT_SOURCES);
  const fontsReady = loaded || Boolean(error);
  const dark = useColorScheme() === "dark";
  const [splashDone, setSplashDone] = useState(false);
  const [overlayReady, setOverlayReady] = useState(false);
  const [i18nReady, setI18nReady] = useState(() => i18n.isInitialized);

  useEffect(() => {
    if (!i18n.isInitialized) {
      void initI18n().then(() => setI18nReady(true));
    }
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state: AppStateStatus) => {
      if (state === "active") {
        void refreshDeviceLanguage()
          .then((needsRestart) => {
            if (needsRestart) {
              Alert.alert(
                i18n.t("language.restartPromptTitle", { ns: "settings" }),
                i18n.t("language.restartPromptMessage", { ns: "settings" }),
              );
            }
          })
          .catch((error) => {
            console.warn("[i18n] Failed refreshing device language", error);
          });
      }
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (fontsReady) {
      posthogLog.info("application_ready", {
        font_load_state: error ? "fallback" : "loaded",
      });

      // Initialize premium haptic system
      void HapticManager.initialize().catch(() => {});
      try {
        Presets.System.impactHeavy();
      } catch {}

      // Disable Expo Dev Menu floating action button so it does not obstruct onboarding or CTAs
      try {
        const DevMenuPreferences = requireOptionalNativeModule("DevMenuPreferences");
        void DevMenuPreferences?.setPreferencesAsync?.({ showFloatingActionButton: false });
      } catch {}
    }
  }, [fontsReady]);

  useEffect(() => {
    if (!fontsReady || !overlayReady || !i18nReady) return;
    void SplashScreen.hideAsync().catch(() => {});
  }, [fontsReady, overlayReady, i18nReady]);

  // Handle push notification taps — deep link to appropriate screen
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (!data) return;

        // Track remote notification if log ID exists
        if (data.notification_log_id) {
          trackNotificationOpened({
            notification_log_id: data.notification_log_id as string,
          });
          trackNotificationReceived({
            notification_log_id: data.notification_log_id as string,
            category: (data.category as string) || "",
            template_id: (data.template_id as string) || "",
          });
        }

        // Deep link based on notification type or category (AD-5)
        const targetType = (data.type as string) || (data.category as string);
        switch (targetType) {
          case "streak_saver":
            expoRouter.push("/tabs/screens/journey-map" as any);
            break;
          case "mood_check_in":
          case "habit_reminder":
            expoRouter.push("/tabs/(tabs)/home" as any);
            break;
          case "weekly_insight":
            expoRouter.push("/tabs/screens/insights" as any);
            break;
          default:
            expoRouter.push("/tabs/(tabs)/record" as any);
            break;
        }
      },
    );

    return () => subscription.remove();
  }, []);

  if (!i18nReady) return null;

  return (
    <>
      <View style={styles.root}>
        <RootLayoutNav />
        {!splashDone && fontsReady ? (
          <SplashOverlay
            canFinish={fontsReady && overlayReady && i18nReady}
            onReady={() => setOverlayReady(true)}
            onDone={() => setSplashDone(true)}
          />
        ) : null}
      </View>
      <StatusBar style={splashDone ? "auto" : dark ? "dark" : "light"} />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
