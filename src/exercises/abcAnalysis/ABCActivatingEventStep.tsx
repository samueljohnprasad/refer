import React from "react";
import { MultiTextInputStep } from "@/src/components/exercise/steps/MultiTextInputStep";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { EVENT_SUGGESTIONS, SHARED_TEXT_STEP_PROPS } from "./customStepShared";

export function ABCActivatingEventStep(
  stepProps: StepProps<ABCAnalysisResponse>,
): React.JSX.Element {
  return (
    <MultiTextInputStep maxItems={1} 
      {...stepProps}
      {...SHARED_TEXT_STEP_PROPS}
      title="What happened?"
      subtitle="Start with the moment, not what it meant."
      tipText="Write what a camera could have seen or heard."
      tipIcon="camera"
      fieldKey="activatingEvent"
      placeholder="Describe what happened..."
      suggestions={EVENT_SUGGESTIONS}
    />
  );
}

