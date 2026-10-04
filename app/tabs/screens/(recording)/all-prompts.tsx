import React from "react";
import { Stack, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import AllPromptsScreen from "@/src/screens/AllPromptsScreen/AllPromptsScreen";

export default function AllPromptsScreenRoute() {
  const router = useRouter();
  const { t } = useTranslation("common");
  return (
    <>
      <Stack.Screen options={{
        headerTitle: t("promptBrowser.title"),
        headerBackTitle: t("actions.back"),
        headerShown: true,
        headerLeft: () => null,
      }} />
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.Button icon="chevron.left" onPress={() => router.back()} />
      </Stack.Toolbar>
      <AllPromptsScreen />
    </>
  );
}
