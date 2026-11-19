import React from "react";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { AbcWritingStep } from "./abcWritingStep";
import { ABC_FAIR_STARTERS, abcSentence } from "./abcDomain";

export function ABCAlternativeBeliefStep(stepProps: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  return (
    <AbcWritingStep
      {...stepProps}
      fieldKey="alternativeBelief"
      variant="frame"
      question="What’s a fairer way to say it?"
      sub="Aim for something fair and believable, not forced positive."
      placeholder="It’s possible that…"
      hint="A short sentence is enough."
      need={2}
      chips={ABC_FAIR_STARTERS}
      chipMode="start"
      sentence={(r) => abcSentence({ event: r.activatingEvent, belief: r.belief, feel: "", withFeel: false })}
    />
  );
}
