// ponytail: composed root providers and global navigation shell
import React, { type ReactNode, useCallback, useEffect } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { Slot, usePathname } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Presets } from "react-native-pulsar";
import { PressablesConfig } from "pressto";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeroUINativeProvider } from "heroui-native";
import { PostHogProvider, usePostHog } from "posthog-react-native";
import { useTranslation } from "react-i18next";

import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { AuthProvider } from "@/src/context/AuthContext";
import { ReduxProvider } from "@/src/store/ReduxProvider";
import RevenueCatProvider from "@/src/context/RevenueCatProvider";
import { XPProvider } from "@/src/context/XPContext";
import { LevelProvider } from "@/src/context/LevelContext";
import { RewardsProvider } from "@/src/context/RewardsContext";
import { ChallengesProvider } from "@/src/context/ChallengesContext";
import { StreakModalProvider } from "@/src/context/StreakModalContext";

import AnonymousPurchaseClaimPrompt from "@/src/components/premium/AnonymousPurchaseClaimPrompt";
import { FloatingHappyAssistant } from "@/src/components/happy-assistant/FloatingHappyAssistant";
import { TransitionOverlay } from "@/src/components/TransitionOverlay";
import UpdateAvailableBanner from "@/src/components/UpdateAvailableBanner";
import { posthog } from "@/src/config/posthog";
import { posthogLog } from "@/src/lib/posthogLogger";
import { usePushNotificationSetup } from "@/src/hooks/data/usePushNotificationSetup";
import { useStreak } from "@/src/hooks/useStreak";
import { useStreakSaverNotification } from "@/src/hooks/useStreakSaverNotification";
import { useSystemBackgroundColor } from "@/src/utils/useSystemBackgroundColor";
import { APP_NAVIGATION_FONTS } from "@/src/theme/typography";
import { useUserIdLogger } from "@/src/hooks/useUserIdLogger";

const queryClient = new QueryClient();
const globalPressableHandlers = {
  onPress: (): void => {
    Presets.System.selection();
  },
};

function ScreenTracker() {
  const pathname = usePathname();
  const client = usePostHog();

  useEffect(() => {
    client?.screen(pathname);
    posthogLog.info("screen_displayed", { route: pathname });
  }, [pathname, client]);

  return null;
}

function AnalyticsProvider({ children }: { children: ReactNode }) {
  if (!posthog) {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <ScreenTracker />
      {children}
    </PostHogProvider>
  );
}

function NotificationIntegration() {
  usePushNotificationSetup();
  const { t } = useTranslation("home");
  // ponytail: schedule 7:00 PM evening streak saver notification if streak is active (AD-3)
  const { currentStreak, isActiveToday } = useStreak();
  const getNotificationCopy = useCallback(
    (streakDays: number) => ({
      title: t("notifications.streakSaver.title"),
      body: streakDays === 1
        ? t("notifications.streakSaver.firstDayBody")
        : t("notifications.streakSaver.ongoingBody", { count: streakDays }),
    }),
    [t],
  );
  useStreakSaverNotification({
    currentStreak,
    isActiveToday,
    notificationsDisabled: false,
    journeySlug: "mindfulness-foundations",
    getNotificationCopy,
  });
  return null;
}

function SystemBackgroundIntegration() {
  useSystemBackgroundColor();
  return null;
}

function AuthStateLogger() {
  useUserIdLogger();
  return null;
}

export function RootLayoutNav() {
  const isDark = useColorScheme() === "dark";
  const navigationTheme = isDark
    ? { ...DarkTheme, fonts: APP_NAVIGATION_FONTS }
    : { ...DefaultTheme, fonts: APP_NAVIGATION_FONTS };

  return (
    <ReduxProvider>
      <AnalyticsProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={StyleSheet.absoluteFill}>
            <HeroUINativeProvider>
              <AuthProvider>
                <AuthStateLogger />
                <NotificationIntegration />
                <XPProvider>
                  <LevelProvider>
                    <RewardsProvider>
                      <ChallengesProvider>
                        <PressablesConfig
                          globalHandlers={globalPressableHandlers}
                          animationType="spring"
                        >
                          <GluestackUIProvider mode={isDark ? "dark" : "light"}>
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
      </AnalyticsProvider>
    </ReduxProvider>
  );
}
