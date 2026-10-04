import React from "react";
import { Pressable, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Text } from "@/src/components/ui/Text";
import { getExerciseConfig } from "@/src/data/exerciseRegistry";
import { useSingleExerciseEntry } from "@/src/hooks/useSingleExerciseEntry";
import type { ExerciseType } from "@/src/types/exerciseFlow";
import { ExerciseFlowRunner } from "./ExerciseFlowRunner";

interface ExerciseFlowScreenProps {
  exerciseType: ExerciseType;
  entryId?: string;
  readOnly?: boolean;
}

export const ExerciseFlowScreen: React.FC<ExerciseFlowScreenProps> = ({
  exerciseType,
  entryId,
  readOnly = false,
}) => {
  const { t } = useTranslation("exercises");
  const router = useRouter();
  const config = getExerciseConfig(exerciseType);

  if (!config) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-slate-500">
          {t("flow.ui.exerciseNotFound")}
        </Text>
        <Pressable onPress={() => router.back()} className="mt-4">
          <Text className="text-base font-bold text-blue-500">
            {t("flow.ui.goBack")}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const { entry, isLoading } = useSingleExerciseEntry(entryId ?? null);

  if (isLoading && entryId) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-base text-slate-400">
          {t("flow.ui.loading")}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <ExerciseFlowRunner
      config={config}
      existingEntry={entry}
      readOnly={readOnly}
    />
  );
};

ExerciseFlowScreen.displayName = "ExerciseFlowScreen";
