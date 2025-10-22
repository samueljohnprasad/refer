import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { Platform, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  // Design system colors
  const accentColor = "#7B61FF"; // brand purple
  const inactiveColor = "#94A3B8"; // slate-400-ish

  return (
    <BottomSheetModalProvider>
      <Tabs
        screenOptions={{
          tabBarBackground() {
            return (
              <BlurView
                tint="light"
                intensity={60}
                style={StyleSheet.absoluteFill}
              />
            );
          },
          tabBarHideOnKeyboard: true,
          animation: "fade",
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
            paddingBottom: Platform.OS === "ios" ? 30 : 10,
            paddingTop: 8,
            height: Platform.OS === "ios" ? 90 : 70,
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
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />

        <Tabs.Screen
          name="journal"
          options={{
            headerShown: true,
            title: "Journal",
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="record"
          options={{
            title: "Record",
            headerShown: false, // Hide header for voice recorder
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="microphone" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="insights"
          options={{
            headerShown: false,
            title: "Insights",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="bar-chart" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  );
}
