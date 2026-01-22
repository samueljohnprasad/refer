import SuspensLoader from "@/src/components/SuspensLoader";
import React, { lazy } from "react";
import { Stack } from "expo-router";

const AllPromptsScreen = lazy(
  () => import("@/src/screens/AllPromptsScreen/AllPromptsScreen")
);

export const options = {
  headerTitle: "Journal Prompts",
  headerBackTitle: "Back",
  headerShown: true,
};

export default function AllPromptsScreenRoute() {
  return (
    <SuspensLoader>
      <AllPromptsScreen />
    </SuspensLoader>
  );
}
