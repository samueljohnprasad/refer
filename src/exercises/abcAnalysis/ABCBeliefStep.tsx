import React from "react";
import type { ABCAnalysisResponse, StepProps } from "@/src/types/exerciseFlow";
import { AbcWritingStep } from "./abcWritingStep";
import { ABC_SCENES, ABC_THOUGHT_STARTERS, abcSentence } from "./abcDomain";
import { abcFeelPhrase } from "./customStepShared";

export function ABCBeliefStep(stepProps: StepProps<ABCAnalysisResponse>): React.JSX.Element {
  const scene = ABC_SCENES.find((s) => s.event === stepProps.response.activatingEvent.trim());
  return (
    <AbcWritingStep
      {...stepProps}
      fieldKey="belief"
      variant="bubble"
      question="What went through your mind just then?"
      sub="Do not make it fair yet. Just catch it."
      placeholder={scene?.placeholder ?? "“They think I…”"}
      hint="A few words is enough."
      need={2}
      chips={scene ? scene.thoughts : ABC_THOUGHT_STARTERS}
      chipMode={scene ? "use" : "start"}
      sentence={(r) => abcSentence({ event: r.activatingEvent, belief: r.belief, feel: abcFeelPhrase(r.consequenceEmotion) })}
    />
  );
}
