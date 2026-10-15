import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ExerciseType } from "@/src/types/exerciseFlow";
import { ExerciseFlowScreen } from "@/src/screens/ExerciseFlowScreen/ExerciseFlowScreen";

export default function ExerciseFlowRoute() {
  const params = useLocalSearchParams<{
    type: string;
    entryId?: string;
    readOnly?: string;
    textOnly?: string;
    practiceSessionId?: string;
    pathId?: string;
    pathVersion?: string;
    practiceSource?: string;
    practiceId?: string;
  }>();

  return (
    <ExerciseFlowScreen
        exerciseType={params.type as ExerciseType}
        entryId={params.entryId}
        readOnly={params.readOnly === "true"}
        textOnly={params.textOnly === "true"}
        practiceSessionId={params.practiceSessionId}
        pathId={params.pathId}
        pathVersion={params.pathVersion ? Number(params.pathVersion) : undefined}
        practiceSource={params.practiceSource}
        practiceId={params.practiceId ?? params.type}
      />
  );
}
