import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { useABCCopy } from "./customStepShared";

export function ABCActivatingEventStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  const copy = useABCCopy();
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...copy.sharedProps}
      title={copy.t("flow.ui.abc.event.title")}
      subtitle={copy.t("flow.ui.abc.event.subtitle")}
      tipText={copy.t("flow.ui.abc.event.tip")}
      tipIcon="camera"
      fieldKey="activatingEvent"
      placeholder={copy.t("flow.ui.abc.event.placeholder")}
      suggestions={copy.eventSuggestions}
    />
  );
}
