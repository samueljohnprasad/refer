import React from "react";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import NotificationPreferencesScreen from "@/src/components/notifications/NotificationPreferencesScreen";

const NotificationPreferences = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerBackTitle: t("title"),
          headerLeft: () => null,
        }}
      />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.left" onPress={() => router.back()} />
      </Stack.Toolbar>
      <NotificationPreferencesScreen />
    </>
  );
};

export default NotificationPreferences;
