import React from "react";
import { Stack, useRouter } from "expo-router";
import AllPromptsScreen from "@/src/screens/AllPromptsScreen/AllPromptsScreen";

export const options = {
  headerTitle: "Journal Prompts",
  headerBackTitle: "Back",
  headerShown: true,
  headerLeft: () => null,
};

export default function AllPromptsScreenRoute() {
  const router = useRouter();
  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.left" onPress={() => router.back()} />
      </Stack.Toolbar>
      <AllPromptsScreen />
    </>
  );
}
