import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Slot, usePathname } from "expo-router";
import { AuthProvider } from "@/src/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { PressablesConfig } from "pressto";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as Notifications from "expo-notifications";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SuspensLoader from "@/src/components/SuspensLoader";
import RevenueCatProvider from "@/src/context/RevenueCatProvider";
import {
  CormorantGaramond_300Light,
  CormorantGaramond_400Regular,
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
} from "@expo-google-fonts/cormorant-garamond";

const queryClient = new QueryClient();
const globalPressableHandlers = {
  onPress: () => {
    Haptics.selectionAsync();
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

SplashScreen.preventAutoHideAsync();

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
  });

  const [styleLoaded, setStyleLoaded] = useState(false);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const pathname = usePathname();
  const [colorMode, setColorMode] = useState<"light" | "dark">("light");

  return (
    <SuspensLoader>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PressablesConfig
            globalHandlers={globalPressableHandlers}
            animationType="spring"
          >
            <GestureHandlerRootView style={StyleSheet.absoluteFill}>
              <GluestackUIProvider mode={colorMode}>
                <RevenueCatProvider>
                  <ThemeProvider
                    value={colorMode === "dark" ? DarkTheme : DefaultTheme}
                  >
                    <KeyboardProvider>
                      <BottomSheetModalProvider>
                        <Slot />
                      </BottomSheetModalProvider>
                    </KeyboardProvider>
                    {/* {pathname === "/" && (
              <Fab
                onPress={() =>
                  setColorMode(colorMode === "dark" ? "light" : "dark")
                }
                className="m-6"
                size="lg"
              >
                <FabIcon as={colorMode === "dark" ? MoonIcon : SunIcon} />
              </Fab>
            )} */}
                  </ThemeProvider>
                </RevenueCatProvider>
              </GluestackUIProvider>
            </GestureHandlerRootView>
          </PressablesConfig>
        </AuthProvider>
      </QueryClientProvider>
    </SuspensLoader>
  );
}
