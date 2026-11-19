// ponytail: the finish screen (.agents/behavioral-activation.html `summary`): the verdict, the mood before
// and now as weather, what comes next, and the week's plan — then the answers, folded away. The runner's
// footer owns "Save and finish" / "Edit answers".
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import type { BehavioralActivationResponse as R, StepProps } from "@/src/types/exerciseFlow";
import { HappiStage } from "@/src/domains/onboarding/ui/presentation/components/HappiStage";
import { useHappiGuideMotion } from "@/src/domains/onboarding/ui/containers/useHappiGuideMotion";
import { ActingPose } from "@/src/domains/onboarding/ui/containers/happiPoses";
import { DAYS, FEEL_WORD, MOOD_WORD, activityLabel, isPlanned, sizeOf, whenText } from "./activities";
import { RATES, feelComparison, heat, mondayFirstToday, moodVerdict, nextUp } from "./baDomain";
import { BaHelpLink, useBaCrisis } from "./baHelp";
import { BaIcon } from "./baIcons";
import { BaSky } from "./baSky";

function Figure({ label, value }: { label: string; value: number }) {
  return (
    <View className="flex-1 items-center" accessible accessibilityLabel={`${label}: ${MOOD_WORD(value)}`}>
      <BaSky heat={heat(value)} width={130} />
      <Text className="mt-1 text-t-foot font-semibold text-happy-label-2">{label} <Text className="text-t-body font-semibold text-happy-label">{MOOD_WORD(value)}</Text></Text>
    </View>
  );
}

function Week({ response }: { response: R }) {
  const planned = response.activities.filter((k) => isPlanned(response, k));
  const spoken = `Your week: ${planned.map((k) => `${whenText(response, k)}, ${activityLabel(k).toLowerCase()}${k === response.tryNow ? ", done now" : ""}`).join(". ")}`;
  return (
    <View className="mt-4 flex-row gap-1" accessible accessibilityLabel={spoken}>
      {DAYS.map(([letter], d) => {
        const here = planned.filter((k) => response.plans[k]!.day === d);
        return (
          <View key={d} className={`min-h-[84px] flex-1 items-center gap-2 rounded-full pb-3 pt-2 ${here.length ? "bg-happy-tint" : ""}`}>
            <Text className="text-t-foot font-semibold text-happy-label-2">{letter}</Text>
            {here.length ? here.map((k) => {
              const done = k === response.tryNow;
              return (
                <View key={k} className={`size-7 items-center justify-center rounded-full ${done ? "bg-happy-ink" : "bg-happy-surface"}`}>
                  <BaIcon name={k} size={16} color={done ? "#ffffff" : "#44633f"} />
                </View>
              );
            }) : <View className="size-2 rounded-full bg-happy-label-3" />}
          </View>
        );
      })}
    </View>
  );
}

function Answers({ response }: { response: R }) {
  const [open, setOpen] = useState(false);
  const rows: [string, string][] = [
    ["Mood", `${MOOD_WORD(response.mood)}, then ${MOOD_WORD(response.moodAfter).toLowerCase()}.`],
    ["You did", `${activityLabel(response.tryNow)}, ${sizeOf(response, response.tryNow)} min`],
    ...RATES.map((r): [string, string] => [r.label, `You guessed ${FEEL_WORD(response[r.exp]).toLowerCase()}. It was ${FEEL_WORD(response[r.got]).toLowerCase()}.`]),
    ["Your plan", response.activities.filter((k) => isPlanned(response, k)).map((k) => `${activityLabel(k)}, ${whenText(response, k)}`).join("\n")],
  ];
  return (
    <View className="mt-5 rounded-2xl bg-happy-surface-2">
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: open }} onPress={() => setOpen((v) => !v)} className="min-h-[52px] flex-row items-center justify-between px-4">
        <Text className="text-t-body font-bold text-happy-label">See your answers</Text>
        <Feather name={open ? "chevron-up" : "chevron-down"} size={20} color="#142414" />
      </Pressable>
      {open && (
        <View className="px-4 pb-2">
          {rows.map(([dt, dd]) => (
            <View key={dt} className="border-t border-happy-sep pt-3">
              <Text className="text-t-foot font-bold text-happy-label-2">{dt}</Text>
              <Text className="mb-3 mt-1 text-t-sub font-medium leading-[21px] text-happy-label">{dd}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

export function BASummaryStep({ response }: StepProps<R>): React.JSX.Element {
  const solo = useBaCrisis();
  const motion = useHappiGuideMotion();
  const verdict = moodVerdict(response.mood, response.moodAfter);
  const lift = response.moodAfter - response.mood;
  const veryLow = response.moodAfter <= 1;
  const wantsHelp = veryLow || (lift < 0 && response.moodAfter <= 2);
  const up = nextUp(response, mondayFirstToday());
  const { setPose } = motion;
  React.useEffect(() => setPose(lift >= 0 && !veryLow ? ActingPose.Proud : ActingPose.Act), [setPose, lift, veryLow]);

  return (
    <View>
      <View className="mb-4 mt-2 flex-row items-center gap-3">
        {!solo && <View style={{ width: 72, aspectRatio: 220 / 246 }}><HappiStage motion={motion} size="scene" width={72} /></View>}
        <View className="flex-1">
          <Text accessibilityRole="header" className="text-t-h font-bold leading-[28px] text-happy-label">{verdict.title}</Text>
          <Text className="mt-1 text-t-sub font-medium leading-[22px] text-happy-label-2">{verdict.sub}</Text>
          {wantsHelp && <BaHelpLink text="If it feels like too much, you can get help now." />}
        </View>
      </View>
      <View className="rounded-3xl bg-[#fde5dc] px-3 pb-6 pt-3" accessibilityLabel="Your next step">
        <View className="flex-row items-center gap-1">
          <Figure label="Before" value={response.mood} />
          <Feather name="arrow-right" size={20} color="#4b4b4b" />
          <Figure label="Now" value={response.moodAfter} />
        </View>
        <Text className="mx-2 mt-6 text-t-sub font-medium text-happy-label-2">{up ? "Next up" : "Next"}</Text>
        <Text className="mx-2 mt-1 font-display text-t-title font-semibold leading-[32px] tracking-tight text-happy-label">
          {up ? `${activityLabel(up)}, ${whenText(response, up)}` : "Plan your next small activity."}
        </Text>
        <Text className="mx-2 mt-3 text-t-sub font-medium text-happy-label-2">{feelComparison(response)}</Text>
        <Week response={response} />
      </View>
      <Answers response={response} />
      <Text className="mt-5 text-center text-t-foot font-semibold text-happy-label-2">Saving keeps this in your exercise history.</Text>
    </View>
  );
}
