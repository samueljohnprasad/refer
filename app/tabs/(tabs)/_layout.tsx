import React from "react";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  ArtificialIntelligence04Icon,
  Home03Icon,
  Mic01Icon,
  Notebook02Icon,
} from "@hugeicons/core-free-icons";

export default function TabLayout() {
  // Design system colors
  const accentColor = "#7B61FF"; // brand purple
  const inactiveColor = "#94A3B8"; // slate-400-ish
  // get system insets
  const insets = useSafeAreaInsets();

  // choose extra visual padding you want in addition to the safe area
  const extraBottomPadding = Platform.OS === "ios" ? 12 : 6 + insets.bottom;
  const tabHeightBase = Platform.OS === "ios" ? 90 : 70 + insets.bottom; // your original bases
  
  // Memoize the BlurView to prevent re-creation on every tab switch
  const tabBarBackground = React.useMemo(
    () => () => (
      <BlurView
        tint="light"
        intensity={60}
        style={StyleSheet.absoluteFill}
      />
    ),
    []
  );

  return (
    <Tabs
      screenOptions={{
        tabBarBackground,
        tabBarHideOnKeyboard: true,
        lazy: true,
        animation: "none",
        freezeOnBlur: true,

        // Disable the static rendrer of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.OS === "ios" ? "transparent" : "#FFFFFF",

          // backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#EEF2FF",
          elevation: 0,
          shadowOpacity: 0,
          paddingTop: 8,

          paddingBottom: extraBottomPadding,
          height: tabHeightBase,
        },
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Home03Icon} color={color} size={24} />
          ),
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          headerShown: true,
          title: "Journal",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Notebook02Icon} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="record"
        options={{
          title: "Record",
          headerShown: false, // Hide header for voice recorder
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon icon={Mic01Icon} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          headerShown: true,
          title: "Insights",
          tabBarIcon: ({ color }) => (
            <HugeiconsIcon
              icon={ArtificialIntelligence04Icon}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
