import React from "react";
import { Stack, useRouter } from "expo-router";
import SettingsScreen from "@/src/screens/SettingsScreen/SettingsScreen";

const Settings = () => {
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
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
