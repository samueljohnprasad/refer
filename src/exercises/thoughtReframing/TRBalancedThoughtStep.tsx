// ponytail: step 9 as the prototype draws it: both stacks to stand on, the stuck version crooked, the fairer
// one in a straight frame, starters that go in front of your own words (never wipe them).
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import { StepShell, StepTitle } from "./customStepShared";
import { TREvidenceStacks } from "./TREvidenceStacks";
import { TRInput, TRNote, TRQuickReplies } from "./TRFields";
import { TRNewFrame, TROldThought } from "./TRThoughtFrames";
import { STARTERS, hasWords, prependStarter } from "./trWriting";

export function TRBalancedThoughtStep({ response, onUpdate, readOnly }: StepProps<ThoughtReframingResponse>) {
  const text = response.balancedThought;
  const ok = hasWords(text, true);
  return (
    <StepShell>
      <StepTitle title="What’s a fairer way to say it?" subtitle="Not forced positive. Something you could actually believe." />
      <TREvidenceStacks evidenceFor={response.evidenceFor} evidenceAgainst={response.evidenceAgainst} />
      <TROldThought text={response.automaticThought} />
      <TRNewFrame label="A fairer version">
        <TRInput
          value={text}
          onChangeText={(balancedThought) => onUpdate({ balancedThought })}
          placeholder="It’s possible that…"
          label="A fairer way to say it"
          maxLength={300}
          editable={!readOnly}
        />
      </TRNewFrame>
      <TRNote text={ok ? "" : "A short sentence is enough."} ok={ok} />
      {!readOnly && (
        <TRQuickReplies label="Start with" items={STARTERS} onPick={(starter) => onUpdate({ balancedThought: prependStarter(text, starter) })} />
      )}
    </StepShell>
  );
}
