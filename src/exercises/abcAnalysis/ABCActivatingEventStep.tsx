import React from "react";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { AbcWritingStep } from "./abcWritingStep";
import { ABC_SCENES } from "./abcDomain";

export function ABCActivatingEventStep(stepProps: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  return (
    <AbcWritingStep
      {...stepProps}
      fieldKey="activatingEvent"
      variant="viewfinder"
      question="What happened?"
      sub="Write what a camera could have seen or heard."
      placeholder="This morning, my manager…"
      hint="A few words is enough to start."
      need={2}
      chips={ABC_SCENES.map((s) => s.event)}
      sentence={() => null}
    />
  );
}
