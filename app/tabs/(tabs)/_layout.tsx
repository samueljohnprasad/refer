import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";
import { Platform } from "react-native";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const theme = useSeasonalTheme();

  // Create mindful color mappings from seasonal theme
  const primaryColor = theme.gradient[0]; // Use first gradient color as primary
  const accentColor = theme.particleSparkle; // Use sparkle color as accent
  const secondaryColor = theme.particleDot; // Use dot color as secondary

  return (
    <Tabs
      screenOptions={{
        // Disable the static render of the header on web
        // to prevent a hydration error in React Navigation v6.
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor:
            Platform.OS === "ios" ? "transparent" : `${primaryColor}15`,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: Platform.OS === "ios" ? 30 : 10,
          paddingTop: 10,
          height: Platform.OS === "ios" ? 90 : 70,
        },

        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: `${secondaryColor}80`,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarIconStyle: {
          marginBottom: -4,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
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
          title: "Profile",
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}
