// ponytail: step 5 as the prototype draws it: said bubble, Happi's question, one count line, a 2-column
// grid of drawn faces. Saved shape unchanged (EmotionRating[]).
import { useMemo } from "react";
import { Text, View } from "react-native";
import { EmotionChip } from "@/src/screens/ThoughtReframingScreen/components/EmotionChip";
import { EMOTION_OPTIONS } from "@/src/screens/ThoughtReframingScreen/data/emotions";
import type { ThoughtReframingResponse, StepProps } from "@/src/types/exerciseFlow";
import type { EmotionName, EmotionRating } from "@/src/screens/ThoughtReframingScreen/types";
import { TRSaidBubble } from "./TRSaidBubble";
import { StepShell, StepTitle } from "./customStepShared";

const MAX_EMOTIONS = 3;

export function TREmotionsStep({ response, onUpdate, readOnly }: StepProps<ThoughtReframingResponse>) {
  // config stores EmotionRating[], but old entries may hold plain names
  const selected: EmotionRating[] = useMemo(
    () => (response.selectedEmotions ?? []).map((e) => (typeof e === "string" ? ({ name: e, initial_intensity: 5, final_intensity: 5 } as EmotionRating) : e)),
    [response.selectedEmotions],
  );
  const names = useMemo(() => new Set(selected.map((e) => e.name)), [selected]);
  const atLimit = selected.length >= MAX_EMOTIONS;

  const toggle = (name: EmotionName) => {
    if (names.has(name)) onUpdate({ selectedEmotions: selected.filter((e) => e.name !== name) });
    else if (!atLimit) onUpdate({ selectedEmotions: [...selected, { name, initial_intensity: 5, final_intensity: 5 }] });
  };

  const labels = selected.map((e) => EMOTION_OPTIONS.find((o) => o.name === e.name)?.label ?? e.name).join(", ");

  return (
    <StepShell>
      <TRSaidBubble text={response.automaticThought} />
      <StepTitle title="How did it make you feel?" subtitle={`Pick up to ${MAX_EMOTIONS}.`} />
      <Text accessibilityLiveRegion="polite" className="mb-3 min-h-[22px] text-t-sub font-bold text-happy-label-2">
        {selected.length ? `${labels} · ${selected.length} of ${MAX_EMOTIONS}` : ""}
      </Text>
      <View className="-mx-1.5 flex-row flex-wrap">
        {EMOTION_OPTIONS.map((emotion) => {
          const on = names.has(emotion.name);
          return (
            <View key={emotion.name} className="w-1/2 px-1.5 pb-3">
              <EmotionChip emotion={emotion} isSelected={on} onToggle={() => !readOnly && toggle(emotion.name)} disabled={atLimit && !on} locked={readOnly} />
            </View>
          );
        })}
      </View>
    </StepShell>
  );
}
