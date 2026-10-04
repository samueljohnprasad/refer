import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { useABCCopy } from "./customStepShared";

export function ABCNewConsequenceStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  const copy = useABCCopy();
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...copy.sharedProps}
      title={copy.t("flow.ui.abc.newConsequence.title")}
      subtitle={copy.t("flow.ui.abc.newConsequence.subtitle")}
      fieldKey="newConsequence"
      placeholder={copy.t("flow.ui.abc.newConsequence.placeholder")}
      suggestions={copy.newConsequenceSuggestions}
    />
  );
}
