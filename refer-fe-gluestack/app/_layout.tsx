import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/components/useColorScheme";
import { Slot } from "expo-router";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import SideNav from "@/components/custom/SideNav";
import SideNews from "@/components/custom/SideNews";

import "../global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <GluestackUIProvider>
        <Box className="w-full h-full">
          <Box className="lg:w-[1200px] w-full min-h-screen mx-auto flex font-body flex-row">
            <Box className="w-[212px] flex-col flex-shrink-0 fixed pb-2 lg:flex justify-between hidden z-50">
              <SideNav />
            </Box>
            <Box className="w-full lg:pl-[212px] border-primaryBorder flex flex-row border-r border-primaryBorder pointer-events-none">
              <Box className="lg:w-[640px] w-full h-full pt-14 pb-20 lg:border-r lg:border-l box-border pointer-events-auto">
                <Box className="h-14 z-60 lg:max-w-[638px] lg:w-[638px] fixed top-0 bg-gray-00 lg:left-auto lg:right-auto items-center hidden lg:flex justify-center left-12 right-12 ">
                  <Box className="w-full h-full">
                    <Box className="w-full h-full border-b border-primaryBorder px-2 py-4 sm:px-6 "></Box>
                  </Box>
                </Box>

                <Slot />
              </Box>
              <Box className="relative pointer-events-auto">
                <Box className="h-14 lg:w-[349px] w-full z-50 lg:border-b border-primaryBorder fixed top-0 bg-gray-00 lg:px-6 flex-shrink-0">
                  <Box className="flex items-center justify-between w-full lg:px-0 px-4 py-3">
                    search bar
                  </Box>
                </Box>
                <Box className="lg:w-[349px] float-right flex-shrink-0 bg-gray-00">
                  <Box className="lg:w-[349px] max-w-348 bg-gray-00 duration-200 h-full min-h-screen fixed top-14 px-6 py-6 translate-x-full lg:block lg:translate-x-0 right-0 lg:right-auto overflow-y-auto hide-scrollbar pb-24">
                    <SideNews />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </GluestackUIProvider>
    </ThemeProvider>
  );
}
