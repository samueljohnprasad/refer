import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Slot } from "expo-router";
import { AuthProvider } from "@/src/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { PressablesConfig } from "pressto";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SuspensLoader from "@/src/components/SuspensLoader";
import RevenueCatProvider from "@/src/context/RevenueCatProvider";
import AnonymousPurchaseClaimPrompt from "@/src/components/premium/AnonymousPurchaseClaimPrompt";
import { FloatingHappyAssistant } from "@/src/components/happy-assistant/FloatingHappyAssistant";
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";
import {
  Fraunces_400Regular,
  Fraunces_400Regular_Italic,
  Fraunces_500Medium,
  Fraunces_500Medium_Italic,
  Fraunces_600SemiBold,
  Fraunces_600SemiBold_Italic,
  Fraunces_700Bold,
  Fraunces_700Bold_Italic,
} from "@expo-google-fonts/fraunces";
import {
  Geist_300Light,
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from "@expo-google-fonts/geist";
import { PostHogProvider } from "posthog-react-native";
import { XPProvider } from "@/src/context/XPContext";
import { LevelProvider } from "@/src/context/LevelContext";
import { AchievementProvider } from "@/src/context/AchievementContext";
import { RewardsProvider } from "@/src/context/RewardsContext";
import { ChallengesProvider } from "@/src/context/ChallengesContext";
import { router as expoRouter } from "expo-router";
import {
  trackNotificationOpened,
  trackNotificationReceived,
} from "@/src/utils/notificationConversionTracker";
import { usePushNotificationSetup } from "@/src/hooks/data/usePushNotificationSetup";
import { ReduxProvider } from "@/src/store/ReduxProvider";

const APP_COLOR_MODE = "light";
const queryClient = new QueryClient();
const globalPressableHandlers = {
  onPress: (): void => {
    void Haptics.selectionAsync().catch(() => {});
  },
};
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
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
  const [loaded, error] = useFonts({
    // SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    // ...FontAwesome.font,
    CormorantLight: CormorantGaramond_300Light,
    CormorantRegular: CormorantGaramond_400Regular,
    CormorantMedium: CormorantGaramond_500Medium,
    CormorantSemiBold: CormorantGaramond_600SemiBold,
    CormorantBold: CormorantGaramond_700Bold,
    FrauncesRegular: Fraunces_400Regular,
    FrauncesRegularItalic: Fraunces_400Regular_Italic,
    FrauncesMedium: Fraunces_500Medium,
    FrauncesMediumItalic: Fraunces_500Medium_Italic,
    FrauncesSemiBold: Fraunces_600SemiBold,
    FrauncesSemiBoldItalic: Fraunces_600SemiBold_Italic,
    FrauncesBold: Fraunces_700Bold,
    FrauncesBoldItalic: Fraunces_700Bold_Italic,
    GeistLight: Geist_300Light,
    GeistRegular: Geist_400Regular,
    GeistMedium: Geist_500Medium,
    GeistSemiBold: Geist_600SemiBold,
    GeistBold: Geist_700Bold,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync().catch(() => {});
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(
        () => {},
      );
    }
  }, [loaded]);

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
            expoRouter.push("/(tabs)/mood" as any);
            break;
          case "habit_reminder":
            expoRouter.push("/(tabs)/habits" as any);
            break;
          case "weekly_insight":
            expoRouter.push("/(tabs)/insights" as any);
            break;
          default:
            expoRouter.push("/(tabs)/journal" as any);
            break;
        }
      },
    );

    return () => subscription.remove();
  }, []);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <SuspensLoader>
      <ReduxProvider>
        <PostHogProvider
          apiKey="phc_3A3cPPqkAbVXBfiskxZlaOcORt0AxADK0sNMgz0I7oU"
          options={{
            host: "https://us.i.posthog.com",
          }}
        >
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <NotificationIntegration />
              <XPProvider>
                <LevelProvider>
                  <RewardsProvider>
                    <AchievementProvider>
                      <ChallengesProvider>
                        <PressablesConfig
                          globalHandlers={globalPressableHandlers}
                          animationType="spring"
                        >
                          <GestureHandlerRootView
                            style={StyleSheet.absoluteFill}
                          >
                            <GluestackUIProvider mode={APP_COLOR_MODE}>
                              <RevenueCatProvider>
                                <ThemeProvider value={DefaultTheme}>
                                  <KeyboardProvider>
                                    <BottomSheetModalProvider>
                                      <Slot />
                                      <AnonymousPurchaseClaimPrompt />
                                      <FloatingHappyAssistant />
                                    </BottomSheetModalProvider>
                                  </KeyboardProvider>
                                </ThemeProvider>
                              </RevenueCatProvider>
                            </GluestackUIProvider>
                          </GestureHandlerRootView>
                        </PressablesConfig>
                      </ChallengesProvider>
                    </AchievementProvider>
                  </RewardsProvider>
                </LevelProvider>
              </XPProvider>
            </AuthProvider>
          </QueryClientProvider>
        </PostHogProvider>
      </ReduxProvider>
    </SuspensLoader>
  );
}
function NotificationIntegration() {
  usePushNotificationSetup();
  return null;
}
