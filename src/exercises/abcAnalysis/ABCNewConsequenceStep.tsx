import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { NEW_CONSEQUENCE_SUGGESTIONS, SHARED_TEXT_STEP_PROPS } from "./customStepShared";

export function ABCNewConsequenceStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="What might change now?"
      subtitle="If you held that thought, what might feel or go differently?"
      fieldKey="newConsequence"
      placeholder="With that thought, I might..."
      suggestions={NEW_CONSEQUENCE_SUGGESTIONS}
    />
  );
}

