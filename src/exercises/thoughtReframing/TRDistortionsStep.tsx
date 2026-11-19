// ponytail: step 6 as the prototype draws it: the first four patterns plus any you picked, "Show N more
// patterns" for the rest. Naming a pattern is optional, so no AI "possible match" help. Saved shape unchanged.
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text } from "react-native";
import { COGNITIVE_DISTORTIONS } from "@/src/screens/ThoughtReframingScreen/data/cognitiveDistortions";
import { DistortionCard } from "@/src/screens/ThoughtReframingScreen/components/DistortionCard";
import type { CognitiveDistortionKey } from "@/src/screens/ThoughtReframingScreen/types";
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import { TRSaidBubble } from "./TRSaidBubble";
import { StepShell, StepTitle } from "./customStepShared";

const MAX_DISTORTIONS = 2;
const COLLAPSED = 4;

export function TRDistortionsStep({ response, onUpdate, onNext, readOnly, setPrimaryOverride }: StepProps<ThoughtReframingResponse>) {
  const [showAll, setShowAll] = useState(false);
  const picked = response.selectedDistortions;
  const atLimit = picked.length >= MAX_DISTORTIONS;

  const list = useMemo(
    () => (showAll ? COGNITIVE_DISTORTIONS : COGNITIVE_DISTORTIONS.filter((d, i) => i < COLLAPSED || picked.includes(d.key as CognitiveDistortionKey))),
    [showAll, picked],
  );
  const hidden = COGNITIVE_DISTORTIONS.length - list.length;

  // naming a pattern helps, but none may fit; forcing a label would be inaccurate
  useEffect(() => {
    setPrimaryOverride?.({ label: picked.length ? "Continue" : "Skip for now", action: onNext, disabled: false });
  }, [picked.length, onNext, setPrimaryOverride]);

  const toggle = (key: CognitiveDistortionKey) => {
    if (picked.includes(key)) onUpdate({ selectedDistortions: picked.filter((k) => k !== key) });
    else if (!atLimit) onUpdate({ selectedDistortions: [...picked, key] });
  };

  return (
    <StepShell>
      <TRSaidBubble text={response.automaticThought} />
      <StepTitle title="Does it sound like any of these?" subtitle={`Thoughts tend to fall into a few patterns. Pick up to ${MAX_DISTORTIONS}.`} />
      {list.map((d) => {
        const on = picked.includes(d.key as CognitiveDistortionKey);
        return (
          <DistortionCard key={d.key} distortion={d} isSelected={on} onToggle={() => !readOnly && toggle(d.key as CognitiveDistortionKey)} disabled={atLimit && !on} locked={readOnly} />
        );
      })}
      {(showAll || hidden > 0) && (
        <Pressable onPress={() => setShowAll((v) => !v)} accessibilityRole="button" className="min-h-11 w-full items-center justify-center">
          <Text className="text-t-sub font-extrabold text-happy-accent">{showAll ? "Show fewer" : `Show ${hidden} more patterns`}</Text>
        </Pressable>
      )}
    </StepShell>
  );
}
