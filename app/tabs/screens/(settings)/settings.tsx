// ponytail: settings route wrapper with native stack toolbar
import React from "react";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import SettingsScreen from "@/src/screens/SettingsScreen/SettingsScreen";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

const Settings = () => {
  const router = useRouter();
  const { t } = useTranslation("settings");
  const textColor = String(SEMANTIC_COLORS.text.primary ?? "#243323");

  return (
    <>
      <Stack.Screen
        options={{
          title: t("title"),
          headerShown: true,
          headerTransparent: false,
          headerShadowVisible: false,
          headerStyle: {
            backgroundColor: String(SEMANTIC_COLORS.surface.canvas),
          },
          headerTintColor: textColor,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "700",
            color: textColor,
          },
          headerTitleAlign: "center",
          headerLeft: () => null,
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.left" onPress={() => router.back()} />
      </Stack.Toolbar>
      <SettingsScreen />
    </>
  );
};

export default Settings;
