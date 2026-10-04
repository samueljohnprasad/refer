import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { useABCCopy } from "./customStepShared";

export function ABCBeliefStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  const copy = useABCCopy();
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...copy.sharedProps}
      title={copy.t("flow.ui.abc.belief.title")}
      subtitle={copy.t("flow.ui.abc.belief.subtitle")}
      tipText={copy.t("flow.ui.abc.belief.tip")}
      fieldKey="belief"
      placeholder={copy.t("flow.ui.abc.belief.placeholder")}
      suggestions={copy.beliefSuggestions}
    />
  );
}
