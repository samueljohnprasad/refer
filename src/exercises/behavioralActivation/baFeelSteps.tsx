// ponytail: mood, the two enjoyment/accomplishment ratings and the "go do it" beat as the prototype draws
// them (`moodStep`, `rateStep`): the feeling as weather, a ten-cell scale, one word. An untouched later
// rating follows the earlier one (mood → mood after, guess → felt), so "same" is never a made-up change.
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import type { BehavioralActivationResponse as R, StepProps } from "@/src/types/exerciseFlow";
import { FEEL_WORD, MOOD_WORD, activityLabel, sizeOf } from "./activities";
import { RATES, heat, moodComparison } from "./baDomain";
import { BaAsk } from "./baAsk";
import { BaHelpLink } from "./baHelp";
import { BaLine, BaScale } from "./baParts";
import { BaSky } from "./baSky";

const LOW_HELP = "If it feels like too much, you can get help now.";

function BaMoodStep({ after, response, onUpdate, readOnly }: { after: boolean } & StepProps<R>): React.JSX.Element {
  const value = after ? response.moodAfter : response.mood;
  const question = after ? "And your mood now?" : "How is your mood right now?";
  return (
    <View>
      <BaAsk question={question} />
      <View className="min-h-[140px] items-center justify-center"><BaSky heat={heat(value)} width={220} /></View>
      <Text className="mb-2 mt-4 text-t-title font-bold leading-[31px] text-happy-label" accessibilityElementsHidden>{MOOD_WORD(value)}</Text>
      <BaScale
        value={value}
        label={question}
        valueText={MOOD_WORD(value)}
        was={after ? response.mood : undefined}
        disabled={readOnly}
        onChange={(v) => onUpdate(after ? { moodAfter: v } : { mood: v, moodAfter: v })}
      />
      <View className="mt-2 flex-row justify-between" accessibilityElementsHidden>
        <Text className="text-t-foot font-semibold text-happy-label-2">Low</Text>
        <Text className="text-t-foot font-semibold text-happy-label-2">Great</Text>
      </View>
      <Text accessibilityLiveRegion="polite" className="mt-2 min-h-[18px] text-t-foot font-semibold text-happy-label-2">
        {after ? moodComparison(response.mood, value) : ""}
      </Text>
      {value <= 1 && <BaHelpLink text={LOW_HELP} />}
    </View>
  );
}

function BaRateStep({ felt, response, onUpdate, readOnly }: { felt: boolean } & StepProps<R>): React.JSX.Element {
  return (
    <View>
      <BaLine response={response} now={felt} />
      <BaAsk
        question={felt ? "And how did it actually feel?" : "How do you think it will feel?"}
        sub={felt ? "Rate what happened, not what you expected." : "Guess before you do it."}
      />
      {RATES.map((r, i) => {
        const value = response[felt ? r.got : r.exp];
        return (
          <View key={r.id} className={`pb-2 pt-4 ${i ? "border-t border-happy-sep" : ""}`}>
            <View className="flex-row items-baseline justify-between gap-3">
              <Text className="text-t-body font-bold text-happy-label">{r.label}</Text>
              <Text className="font-semibold text-happy-accent" accessibilityElementsHidden>{FEEL_WORD(value)}</Text>
            </View>
            <Text className="mb-1 mt-0.5 min-h-[18px] text-t-foot font-semibold text-happy-label-2">
              {felt ? `You guessed: ${FEEL_WORD(response[r.exp]).toLowerCase()}` : ""}
            </Text>
            <BaScale
              value={value}
              label={r.label}
              valueText={FEEL_WORD(value)}
              disabled={readOnly}
              onChange={(v) => onUpdate(felt ? { [r.got]: v } : { [r.exp]: v, [r.got]: v })}
            />
          </View>
        );
      })}
    </View>
  );
}

/** "Go on then." — the footer's "I did it" is what records that it happened. */
export function BaDoStep({ response, onUpdate, onNext, readOnly, setPrimaryOverride }: StepProps<R>): React.JSX.Element {
  useEffect(() => {
    if (!setPrimaryOverride || readOnly) return;
    setPrimaryOverride({ label: "I did it", disabled: false, action: () => { onUpdate({ didIt: true }); onNext(); } });
    return () => setPrimaryOverride(null);
  }, [setPrimaryOverride, readOnly, onUpdate, onNext]);

  return (
    <View>
      <BaLine response={response} now />
      <BaAsk
        question="Go on then. I’ll wait here."
        sub={`Just ${sizeOf(response, response.tryNow)} minutes. You can stop after that, or keep going.`}
      />
      <View className="min-h-[140px] items-center justify-center" accessibilityLabel={activityLabel(response.tryNow)}>
        <BaSky heat={0.35} width={220} />
      </View>
    </View>
  );
}

export const BaMoodBeforeStep = (p: StepProps<R>) => <BaMoodStep after={false} {...p} />;
export const BaMoodAfterStep = (p: StepProps<R>) => <BaMoodStep after {...p} />;
export const BaGuessStep = (p: StepProps<R>) => <BaRateStep felt={false} {...p} />;
export const BaFeltStep = (p: StepProps<R>) => <BaRateStep felt {...p} />;
