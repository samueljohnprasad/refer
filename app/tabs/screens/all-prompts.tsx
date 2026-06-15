import React from "react";
import { Stack } from "expo-router";
import AllPromptsScreen from "@/src/screens/AllPromptsScreen/AllPromptsScreen";

export const options = {
  headerTitle: "Journal Prompts",
  headerBackTitle: "Back",
  headerShown: true,
};

export default function AllPromptsScreenRoute() {
  return <AllPromptsScreen />;
}
