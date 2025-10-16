import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { Suspense, useEffect, useState } from "react";
import { useColorScheme } from "@/components/useColorScheme";
import { Slot, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Fab, FabIcon } from "@/components/ui/fab";
import { MoonIcon, SunIcon } from "@/components/ui/icon";
import { AuthProvider } from "@/src/context/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import { PressablesConfig } from "pressto";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
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
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <PressablesConfig globalHandlers={globalPressableHandlers}>
            <GestureHandlerRootView style={StyleSheet.absoluteFill}>
              <GluestackUIProvider mode={colorMode}>
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
              </GluestackUIProvider>
            </GestureHandlerRootView>
          </PressablesConfig>
        </AuthProvider>
      </QueryClientProvider>
    </Suspense>
  );
}
