// ponytail: step 3 as the prototype draws it: your step-2 answer as a snapshot with two puffs floating up
// into the thought bubble you write in, plus the thoughts people often have for that situation.
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import { StepShell, StepTitle } from "./customStepShared";
import { TRNote, TRQuickReplies, TRInput } from "./TRFields";
import { TRSnapshot, TRThoughtBubble } from "./TRThoughtFrames";
import { hasWords, sceneFor } from "./trWriting";

export function TRAutomaticThoughtStep({ response, onUpdate, readOnly }: StepProps<ThoughtReframingResponse>) {
  const text = response.automaticThought;
  const ok = hasWords(text);
  const { thoughts } = sceneFor(response.situation);
  return (
    <StepShell>
      <StepTitle title="What went through your mind?" subtitle="Write it the way it showed up, even if it sounds harsh." />
      <TRSnapshot text={response.situation} />
      <TRThoughtBubble>
        <TRInput
          value={text}
          onChangeText={(automaticThought) => onUpdate({ automaticThought })}
          placeholder={`“${thoughts[0]}”`}
          label="What went through your mind"
          maxLength={300}
          editable={!readOnly}
        />
      </TRThoughtBubble>
      <TRNote text={ok ? "" : "A few words is enough."} ok={ok} />
      {!readOnly && !text.trim() && (
        <TRQuickReplies label="Thoughts people often have" items={thoughts} onPick={(automaticThought) => onUpdate({ automaticThought })} />
      )}
    </StepShell>
  );
}
