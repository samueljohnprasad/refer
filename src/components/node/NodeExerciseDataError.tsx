import React from "react";
import { useTranslation } from "react-i18next";
import { PracticeDataErrorScreen } from "@/src/components/node/NodeEngineRouterPanels";

export function NodeExerciseDataError({
  invalidContent,
  onClose,
  onSkip,
}: {
  invalidContent: boolean;
  onClose?: () => void;
  onSkip?: () => void;
}) {
  const { t } = useTranslation("journeys");
  return (
    <PracticeDataErrorScreen
      message={
        invalidContent
          ? t("invalidExerciseCourseData")
          : t("unsupportedExerciseCategory")
      }
      onClose={onClose}
      onSkip={onSkip}
    />
  );
}
