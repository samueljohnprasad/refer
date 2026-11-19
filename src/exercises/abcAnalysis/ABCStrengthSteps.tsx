import React from "react";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { AbcStrengthStep } from "./abcStrengthStep";

export function ABCPreStrengthStep(stepProps: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  return <AbcStrengthStep {...stepProps} fieldKey="preEmotionalIntensity" question="How strong is it right now?" />;
}

export function ABCPostStrengthStep(stepProps: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  return <AbcStrengthStep {...stepProps} fieldKey="postEmotionalIntensity" question="How strong is it now?" sub="Any answer is fine." />;
}
