import React, { useCallback } from "react";
import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { useStarterPathProgress } from "../../data/useStarterPathProgress";

export function StarterPathNextActionCard(): React.JSX.Element | null {
  const { t } = useTranslation("home");
  const { progress, isLoading } = useStarterPathProgress();

  const openNextAction = useCallback((): void => {
    if (!progress) return;
    if (progress.nextAction.kind === "practice") {
      router.push({
        pathname: "/tabs/screens/exercise-flow",
        params: {
          type: progress.nextAction.targetId,
          textOnly: "true",
          pathId: progress.pathId,
          pathVersion: String(progress.pathVersion),
          practiceSource: "exercise_catalog",
        },
      });
      return;
    }
    router.push("/tabs/(tabs)/journeys");
  }, [progress]);

  if (isLoading || !progress || progress.status === "completed") return null;

  return (
    <View className="mt-7">
      <Text className="happy-font-body-bold mb-2.5 px-1 text-[12px] font-bold tracking-[1px] text-sage-700 uppercase">
        {t("journey.nextAction")}
      </Text>
      <Pressable
        className="rounded-2xl bg-sage-100 px-5 py-4 active:opacity-80"
        onPress={openNextAction}
        accessibilityRole="button"
        accessibilityLabel={t("journey.nextActionA11y")}
      >
        <Text className="happy-font-heading-bold text-[17px] font-bold text-ink">
          {t("journey.nextActionTitle")}
        </Text>
        <Text className="happy-font-body mt-1 text-[14px] text-ink-soft">
          {t("journey.nextActionDescription")}
        </Text>
      </Pressable>
    </View>
  );
}
