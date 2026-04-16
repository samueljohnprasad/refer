import React, { lazy } from "react";
import { useLocalSearchParams } from "expo-router";
import SuspensLoader from "@/src/components/SuspensLoader";
import { ExerciseType } from "@/src/types/exerciseFlow";

const ExerciseFlowScreen = lazy(() =>
  import("@/src/screens/ExerciseFlowScreen/ExerciseFlowScreen").then((m) => ({
    default: m.ExerciseFlowScreen,
  })),
);

export default function ExerciseFlowRoute() {
  const params = useLocalSearchParams<{
    type: string;
    entryId?: string;
    readOnly?: string;
  }>();

  return (
    <SuspensLoader>
      <ExerciseFlowScreen
        exerciseType={params.type as ExerciseType}
        entryId={params.entryId}
        readOnly={params.readOnly === "true"}
      />
    </SuspensLoader>
  );
}
