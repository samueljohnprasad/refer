// ponytail: step 2 as the prototype draws it (.agents/thought-reframing.html): Happi asks, a viewfinder
// holds a plain field, one note line, starter situations until you type. No voice, no AI drafts.
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import { StepShell, StepTitle } from "./customStepShared";
import { TRNote, TRQuickReplies, TRViewfinder } from "./TRFields";
import { SCENES, hasWords } from "./trWriting";

export function TRSituationStep({ response, onUpdate, readOnly }: StepProps<ThoughtReframingResponse>) {
  const text = response.situation;
  const ok = hasWords(text);
  return (
    <StepShell>
      <StepTitle
        title="What happened?"
        subtitle="Only what a camera would have caught. Where you were, who was there, what was said."
      />
      <TRViewfinder
        value={text}
        onChangeText={(situation) => onUpdate({ situation })}
        placeholder="This morning, my manager said…"
        label="What happened"
        maxLength={400}
        editable={!readOnly}
      />
      <TRNote text={ok ? "" : "A few words is enough to start."} ok={ok} />
      {!readOnly && !text.trim() && (
        <TRQuickReplies label="Or start from one of these" items={SCENES.map((s) => s.situation)} onPick={(situation) => onUpdate({ situation })} />
      )}
    </StepShell>
  );
}
