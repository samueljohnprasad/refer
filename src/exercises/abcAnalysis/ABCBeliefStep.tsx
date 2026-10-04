import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { BELIEF_SUGGESTIONS, SHARED_TEXT_STEP_PROPS } from "./customStepShared";

export function ABCBeliefStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="Automatic thought"
      subtitle="Write the sentence your mind added."
      tipText="Do not make it fair yet. Just catch it."
      fieldKey="belief"
      placeholder="The thought was..."
      suggestions={BELIEF_SUGGESTIONS}
    />
  );
}

