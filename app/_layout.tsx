import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Slot, router as expoRouter } from "expo-router";
import { AuthProvider } from "@/src/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet, View, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Presets } from "react-native-pulsar";
import { PressablesConfig } from "pressto";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HapticManager } from "@/lib/haptics/HapticManager";
import { useSystemBackgroundColor } from "@/src/utils/useSystemBackgroundColor";
import { HeroUINativeProvider } from "heroui-native";

import RevenueCatProvider from "@/src/context/RevenueCatProvider";
import AnonymousPurchaseClaimPrompt from "@/src/components/premium/AnonymousPurchaseClaimPrompt";
import { FloatingHappyAssistant } from "@/src/components/happy-assistant/FloatingHappyAssistant";
import { TransitionOverlay } from "@/src/components/TransitionOverlay";
import UpdateAvailableBanner from "@/src/components/UpdateAvailableBanner";
import {
  APP_FONT_SOURCES,
  APP_NAVIGATION_FONTS,
} from "@/src/theme/typography";
import { PostHogProvider } from "posthog-react-native";
import { XPProvider } from "@/src/context/XPContext";
import { LevelProvider } from "@/src/context/LevelContext";
import { RewardsProvider } from "@/src/context/RewardsContext";
import { ChallengesProvider } from "@/src/context/ChallengesContext";
import { StreakModalProvider } from "@/src/context/StreakModalContext";
import {
  trackNotificationOpened,
  trackNotificationReceived,
} from "@/src/utils/notificationConversionTracker";
import { usePushNotificationSetup } from "@/src/hooks/data/usePushNotificationSetup";
import { ReduxProvider } from "@/src/store/ReduxProvider";
import { SplashOverlay } from "@/src/components/splash";

const queryClient = new QueryClient();
const globalPressableHandlers = {
  onPress: (): void => {
    Presets.System.selection();
  },
};
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

  useEffect(() => {
    if (fontsReady) {
      // Initialize premium haptic system
      void HapticManager.initialize().catch(() => {});
      Presets.System.impactHeavy();
    }
  }, [fontsReady]);

  useEffect(() => {
    if (!fontsReady || !overlayReady) return;
    void SplashScreen.hideAsync().catch(() => {});
  }, [fontsReady, overlayReady]);

  // Handle push notification taps — deep link to appropriate screen
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (!data?.notification_log_id) return;

        // Track the open
        trackNotificationOpened({
          notification_log_id: data.notification_log_id as string,
        });
        trackNotificationReceived({
          notification_log_id: data.notification_log_id as string,
          category: (data.category as string) || "",
          template_id: (data.template_id as string) || "",
        });

        // Deep link based on notification category
        const category = data.category as string;
        switch (category) {
          case "mood_check_in":
            expoRouter.push("/tabs/(tabs)/home" as any);
            break;
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

  return (
    <>
      <View style={styles.root}>
        <RootLayoutNav />
        {!splashDone && fontsReady ? (
          <SplashOverlay
            canFinish={fontsReady && overlayReady}
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

function RootLayoutNav() {
  const isDark = useColorScheme() === "dark";
  const navigationTheme = isDark
    ? { ...DarkTheme, fonts: APP_NAVIGATION_FONTS }
    : { ...DefaultTheme, fonts: APP_NAVIGATION_FONTS };

  return (
      <ReduxProvider>
        <PostHogProvider
          apiKey="phc_3A3cPPqkAbVXBfiskxZlaOcORt0AxADK0sNMgz0I7oU"
          options={{
            host: "https://us.i.posthog.com",
          }}
        >
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={StyleSheet.absoluteFill}>
              <HeroUINativeProvider>
                <AuthProvider>
                  <NotificationIntegration />
                  <XPProvider>
                    <LevelProvider>
                      <RewardsProvider>
                        <ChallengesProvider>
                          <PressablesConfig
                            globalHandlers={globalPressableHandlers}
                            animationType="spring"
                          >
                            <GluestackUIProvider
                              mode={isDark ? "dark" : "light"}
                            >
                              <SystemBackgroundIntegration />
                              <RevenueCatProvider>
                                <ThemeProvider value={navigationTheme}>
                                  <KeyboardProvider>
                                    <BottomSheetModalProvider>
                                      <StreakModalProvider>
                                        <UpdateAvailableBanner />
                                        <Slot />
                                        <AnonymousPurchaseClaimPrompt />
                                        <FloatingHappyAssistant />
                                        <TransitionOverlay />
                                      </StreakModalProvider>
                                    </BottomSheetModalProvider>
                                  </KeyboardProvider>
                                </ThemeProvider>
                              </RevenueCatProvider>
                            </GluestackUIProvider>
                          </PressablesConfig>
                        </ChallengesProvider>
                      </RewardsProvider>
                    </LevelProvider>
                  </XPProvider>
                </AuthProvider>
              </HeroUINativeProvider>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </PostHogProvider>
      </ReduxProvider>
  );
}
function NotificationIntegration() {
  usePushNotificationSetup();
  return null;
}
function SystemBackgroundIntegration() {
  useSystemBackgroundColor();
  return null;
}
