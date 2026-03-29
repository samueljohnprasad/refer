import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";
import { Stack } from "expo-router";

const NotificationPreferencesScreen = lazy(
  () => import("@/src/components/notifications/NotificationPreferencesScreen")
);

const NotificationPreferences = () => {
  return (
    <SuspensLoader>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "",
          headerTransparent: true,
          headerBackTitle: "Settings",
        }}
      />
      <NotificationPreferencesScreen />
    </SuspensLoader>
  );
};

export default NotificationPreferences;
