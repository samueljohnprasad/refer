// ponytail: the intro, the three written answers (fear, prediction, what happened) and the two 0-10 gauges
// (worst version, how anxious it really was), as .agents/fear-ladder.html draws them. No legacy composer,
// no voice, no AI drafts. Writes the same FearLadderResponse fields as before.
import React, { useEffect } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import type { FearLadderResponse, StepProps } from "@/src/types/exerciseFlow";
import { FLLadder, FLSky } from "./flArt";
import { FLAsk, FLNote, FLPaper, FLQuick, FLSaid, FLScale } from "./flParts";

type Props = StepProps<FearLadderResponse>;

const MIN_CHARS = 5;
export const longEnough = (s: string): boolean => s.trim().length >= MIN_CHARS;

// gauges the user has already been shown/moved this run, so coming back never re-seeds a deliberate 5.
// Not saved: a new run starts at the intro, which clears it.
const seen = new Set<string>();

export function FLIntroStep(): React.JSX.Element {
  useEffect(() => { seen.clear(); }, []);
  return (
    <View>
      <Text className="mb-5 text-t-foot text-happy-label-3">Fear Ladder · 15 to 20 min</Text>
      <View className="mb-3 mt-1 self-start"><FLLadder n={3} width={208} /></View>
      <View className="mb-5 rounded-2xl rounded-tl-[4px] bg-happy-tint p-4">
        <Text variant="h1" accessibilityRole="header" className="text-t-title leading-[31px]">Something you keep avoiding?</Text>
        <Text className="mt-2 text-t-body font-medium leading-[23px] text-happy-label-2">
          Tell me what it is. We will break it into small steps and try the first one together, so it feels a little less scary each time.
        </Text>
      </View>
    </View>
  );
}

type TextKey = "fear" | "prediction" | "learned";
interface TextSpec {
  key: TextKey;
  title: string;
  subtitle: string;
  placeholder: string;
  max: number;
  hint: string;
  ok: string;
  examples: readonly string[];
  recall?: (r: FearLadderResponse) => { label: string; text: string };
}

function textStep(spec: TextSpec): React.FC<Props> {
  const Step: React.FC<Props> = ({ response, onUpdate, readOnly, autoFocus }) => {
    const text = response[spec.key];
    const ok = longEnough(text);
    const recall = spec.recall?.(response);
    return (
      <View>
        {recall ? <FLSaid label={recall.label} text={recall.text} /> : null}
        <FLAsk title={spec.title} subtitle={spec.subtitle} />
        <FLPaper
          value={text}
          onChangeText={(t) => onUpdate({ [spec.key]: t })}
          placeholder={spec.placeholder}
          label={spec.title}
          maxLength={spec.max}
          editable={!readOnly}
          autoFocus={autoFocus && !readOnly}
        />
        <FLNote text={ok ? spec.ok : spec.hint} ok={ok} />
        {readOnly ? null : <FLQuick items={spec.examples} onPick={(t) => onUpdate({ [spec.key]: t })} />}
      </View>
    );
  };
  Step.displayName = `FLText(${spec.key})`;
  return Step;
}

export const FLFearStep = textStep({
  key: "fear",
  title: "What are you avoiding?",
  subtitle: "One situation that makes you tense up. The more specific, the better.",
  placeholder: "Speaking up in team meetings",
  max: 200,
  hint: "A few words is enough to start.",
  ok: "Good. Keep it specific.",
  examples: ["Speaking up in team meetings", "Making a phone call to someone I do not know", "Going to a crowded place on my own"],
});

export const FLPredictStep = textStep({
  key: "prediction",
  title: "What do you think will happen?",
  subtitle: "Be specific. We will check it against what really happens.",
  placeholder: "I will freeze, and everyone will notice.",
  max: 300,
  hint: "A few words is enough.",
  ok: "Hold on to that. You will test it next.",
  examples: ["I’ll freeze and everyone will notice.", "They’ll think my idea is stupid.", "I’ll panic and have to leave."],
  recall: (r) => ({ label: "Your first rung", text: r.pickedRung }),
});

export const FLLearnedStep = textStep({
  key: "learned",
  title: "So what actually happened?",
  subtitle: "Compare it with what you expected.",
  placeholder: "It was shaky for a minute, then it eased.",
  max: 300,
  hint: "A few words is enough.",
  ok: "That is the part worth remembering.",
  examples: ["I felt shaky for a minute, then it eased. Nobody reacted badly.", "It was harder than I thought, but I stayed and nothing bad happened."],
  recall: (r) => ({ label: "You expected", text: r.prediction }),
});

const LABELS = ["Calm", "Uneasy", "Terrified"] as const;

interface GaugeSpec {
  key: "peakFear" | "postAnxiety";
  title: string;
  said: (r: FearLadderResponse) => { label: string; text: string };
  /** an unanswered gauge starts at this value, so no answer is pre-picked */
  seed?: (r: FearLadderResponse) => number | undefined;
}

function gaugeStep(spec: GaugeSpec): React.FC<Props> {
  const Step: React.FC<Props> = ({ response, onUpdate, readOnly }) => {
    const value = response[spec.key];
    const said = spec.said(response);
    const seed = spec.seed?.(response);
    useEffect(() => {
      if (!readOnly && seed !== undefined && !seen.has(spec.key)) onUpdate({ [spec.key]: seed });
      seen.add(spec.key);
      // seed once on arrival; later moves are the user's
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
      <View>
        <FLSaid label={said.label} text={said.text} />
        <FLAsk title={spec.title} happi={false} />
        <View className="items-center justify-center" style={{ minHeight: 150 }}>
          <FLSky f={value / 10} width={220} />
        </View>
        <View className="mb-4 flex-row items-end">
          <Text className="font-display text-[96px] leading-[82px] text-happy-label" accessibilityLabel={`${value} out of 10`}>{value}</Text>
          <Text className="mb-1 ml-2 text-t-lead font-bold text-happy-label-2">/10</Text>
        </View>
        <FLScale value={value} onChange={(v) => { seen.add(spec.key); onUpdate({ [spec.key]: v }); }} label={spec.title} disabled={readOnly} />
        <View className="mt-2 flex-row justify-between">
          {LABELS.map((l) => <Text key={l} className="text-t-foot font-semibold text-happy-label-2">{l}</Text>)}
        </View>
      </View>
    );
  };
  Step.displayName = `FLGauge(${spec.key})`;
  return Step;
}

export const FLPeakStep = gaugeStep({
  key: "peakFear",
  title: "How scary is the worst version of it?",
  said: (r) => ({ label: "The fear", text: r.fear }),
});

export const FLPostStep = gaugeStep({
  key: "postAnxiety",
  title: "How anxious was it, really?",
  said: (r) => ({ label: "Your first rung", text: r.pickedRung }),
  // the "after" starts at the "before" the first time it is shown; `seen` keeps a deliberate 5 on return
  seed: (r) => (r.postAnxiety === 5 && !r.learned.trim() && r.startAnxiety !== 5 ? r.startAnxiety : undefined),
});
