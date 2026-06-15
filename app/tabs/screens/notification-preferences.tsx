import React from "react";
import { Stack } from "expo-router";
import NotificationPreferencesScreen from "@/src/components/notifications/NotificationPreferencesScreen";

const NotificationPreferences = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerBackTitle: "Settings",
        }}
      />
      <NotificationPreferencesScreen />
    </>
  );
};

export default NotificationPreferences;
