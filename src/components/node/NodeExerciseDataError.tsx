import React from "react";
import { PracticeDataErrorScreen } from "@/src/components/node/NodeEngineRouterPanels";

export function NodeExerciseDataError({
  invalidContent,
  onClose,
}: {
  invalidContent: boolean;
  onClose?: () => void;
}) {
  return (
    <PracticeDataErrorScreen
      message={
        invalidContent
          ? "This exercise contains invalid course data."
          : "This lesson uses an unsupported exercise category."
      }
      onClose={onClose}
    />
  );
}
