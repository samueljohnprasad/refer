import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { useABCCopy } from "./customStepShared";

export function ABCConsequenceBehaviorStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  const copy = useABCCopy();
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...copy.sharedProps}
      title={copy.t("flow.ui.abc.behavior.title")}
      subtitle={copy.t("flow.ui.abc.behavior.subtitle")}
      tipText={copy.t("flow.ui.abc.behavior.tip")}
      fieldKey="consequenceBehavior"
      placeholder={copy.t("flow.ui.abc.behavior.placeholder")}
      suggestions={copy.behaviorSuggestions}
    />
  );
}
