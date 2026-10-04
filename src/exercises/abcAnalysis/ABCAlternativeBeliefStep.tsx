import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { BALANCED_THOUGHT_SUGGESTIONS, SHARED_TEXT_STEP_PROPS } from "./customStepShared";

export function ABCAlternativeBeliefStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="More balanced thought"
      subtitle="Write a fairer version that still feels believable."
      fieldKey="alternativeBelief"
      placeholder="A fairer thought could be..."
      suggestions={BALANCED_THOUGHT_SUGGESTIONS}
      referenceQuote={{
        label: "Automatic thought",
        text: stepProps.response.belief,
      }}
    />
  );
}

