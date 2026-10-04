import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { useABCCopy } from "./customStepShared";

export function ABCAlternativeBeliefStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  const copy = useABCCopy();
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...copy.sharedProps}
      title={copy.t("flow.ui.abc.alternativeBelief.title")}
      subtitle={copy.t("flow.ui.abc.alternativeBelief.subtitle")}
      fieldKey="alternativeBelief"
      placeholder={copy.t("flow.ui.abc.alternativeBelief.placeholder")}
      suggestions={copy.balancedThoughtSuggestions}
      referenceQuote={{
        label: copy.t("flow.ui.abc.automaticThought"),
        text: stepProps.response.belief,
      }}
    />
  );
}
