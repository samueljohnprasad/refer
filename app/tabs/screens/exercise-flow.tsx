import React from "react";
import { useLocalSearchParams, Stack } from "expo-router";
import { ExerciseType } from "@/src/types/exerciseFlow";
import { ExerciseFlowScreen } from "@/src/screens/ExerciseFlowScreen/ExerciseFlowScreen";

export default function ExerciseFlowRoute() {
  const params = useLocalSearchParams<{
    type: string;
    entryId?: string;
    readOnly?: string;
  }>();

  return (
    <ExerciseFlowScreen
        exerciseType={params.type as ExerciseType}
        entryId={params.entryId}
        readOnly={params.readOnly === "true"}
      />
  );
}
