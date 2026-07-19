import React from "react";
import { Stack, useRouter } from "expo-router";
import NotificationPreferencesScreen from "@/src/components/notifications/NotificationPreferencesScreen";

const NotificationPreferences = () => {
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerBackTitle: "Settings",
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
