import React from "react";
import { Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import SettingsScreen from "@/src/screens/SettingsScreen/SettingsScreen";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

function SettingsHeaderLeft() {
  const router = useRouter();
  return (
    // ponytail: 40pt soft circular back button with zero shadow for quiet header hierarchy
    <Pressable
      onPress={() => router.back()}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      className="w-10 h-10 rounded-full items-center justify-center bg-black/[0.04] dark:bg-white/[0.08] active:bg-black/[0.08]"
    >
      <Feather name="chevron-left" size={22} color={String(SEMANTIC_COLORS.text.primary ?? "#243323")} />
    </Pressable>
  );
}

const Settings = () => {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Settings",
          headerShown: true,
          headerTransparent: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: String(SEMANTIC_COLORS.surface.canvas),
          },
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "700",
            color: String(SEMANTIC_COLORS.text.primary ?? "#243323"),
          },
          headerTitleAlign: "center",
          headerLeft: () => <SettingsHeaderLeft />,
        }}
      />
      <SettingsScreen />
    </>
  );
};

export default Settings;
