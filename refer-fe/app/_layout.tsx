import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";

// Import our custom ThemeProvider
import { ThemeProvider } from "../context/ThemeContext";
import { useTheme } from "../context/ThemeContext";
import { TouchableOpacity, View, StyleSheet , Text} from "react-native";
import store, { persistor } from "@/store";
import { logout } from "@/store/authSlice";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useAuth } from "@/hooks/useAuth";
import AuthScreen from "@/components/AuthScreen";

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: "(tabs)",
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
        // Keep native splash visible, render nothing
        return null;
    }

    // Wrap the app with our ThemeProvider
    return (
        <Provider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}
            >
                <ThemeProvider>
                    <RootLayoutNav />
                </ThemeProvider>
            </PersistGate>
        </Provider>
    );
}

function RootLayoutNav() {
    // Use our custom theme hook instead of useColorScheme
    const { isDarkMode, theme } = useTheme();
    const dispatch = useDispatch();
    const { user } = useAuth();

    // Map our theme to React Navigation theme
    const navigationTheme = isDarkMode
        ? {
              ...DarkTheme,
              colors: {
                  ...DarkTheme.colors,
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  card: theme.colors.card,
                  text: theme.colors.text,
                  border: theme.colors.border,
                  notification: theme.colors.notification,
              },
          }
        : {
              ...DefaultTheme,
              colors: {
                  ...DefaultTheme.colors,
                  primary: theme.colors.primary,
                  background: theme.colors.background,
                  card: theme.colors.card,
                  text: theme.colors.text,
                  border: theme.colors.border,
                  notification: theme.colors.notification,
              },
          };

    if (!user) {
        return <AuthScreen />;
    }

    return (
        <NavigationThemeProvider value={navigationTheme}>
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => dispatch(logout())}
                accessibilityLabel="Logout"
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>{" "}
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="modal"
                    options={{ presentation: "modal" }}
                />
            </Stack>
        </NavigationThemeProvider>
    );
}
const styles = StyleSheet.create({
    logoutButton: {
        position: "absolute",
        top: 40,
        right: 20,
        zIndex: 100,
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutText: {
        color: "#007AFF",
        fontWeight: "bold",
        fontSize: 16,
    },
});
