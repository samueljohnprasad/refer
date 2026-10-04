import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { BEHAVIOR_SUGGESTIONS, SHARED_TEXT_STEP_PROPS } from "./customStepShared";

export function ABCConsequenceBehaviorStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="What did you do next?"
      subtitle="Name the reaction that followed."
      tipText="What did you do, avoid, say, or repeat?"
      fieldKey="consequenceBehavior"
      placeholder="I responded by..."
      suggestions={BEHAVIOR_SUGGESTIONS}
    />
  );
}

