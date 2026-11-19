// ponytail: size, week plan and "try now" as the prototype draws them (.plan / .opt / .rowx): the activity's
// icon and name, then pill choices. The caller's response shape is untouched — only how it is asked changes.
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import type { BehavioralActivationResponse as R, StepProps } from "@/src/types/exerciseFlow";
import { DAYS, SIZES, TIMES, activityLabel, sizeOf, whenText } from "./activities";
import { BaAsk } from "./baAsk";
import { BaIcon } from "./baIcons";
import { BaOpt } from "./baParts";

function Plan({ k, first, children }: { k: string; first: boolean; children: React.ReactNode }) {
  return (
    <View className={`py-4 ${first ? "" : "border-t border-happy-sep"}`}>
      <View className="mb-3 flex-row items-center gap-3">
        <BaIcon name={k} size={32} />
        <Text className="flex-1 text-t-body font-bold text-happy-label">{activityLabel(k)}</Text>
      </View>
      {children}
    </View>
  );
}

export function BaSizeStep({ response, onUpdate }: StepProps<R>): React.JSX.Element {
  return (
    <View>
      <BaAsk question="How small can we make each one?" />
      {response.activities.map((k, i) => (
        <Plan key={k} k={k} first={i === 0}>
          <View accessibilityRole="radiogroup" className="flex-row gap-2">
            {SIZES.map((m) => (
              <BaOpt key={m} label={`${m} min`} on={sizeOf(response, k) === m} onPress={() => onUpdate({ sizes: { ...response.sizes, [k]: m } })} />
            ))}
          </View>
        </Plan>
      ))}
    </View>
  );
}

export function BaPlanStep({ response, onUpdate }: StepProps<R>): React.JSX.Element {
  const set = (k: string, patch: Partial<{ day: number | null; time: number | null }>) => {
    const cur = response.plans[k] ?? { day: null, time: null };
    onUpdate({ plans: { ...response.plans, [k]: { ...cur, ...patch } } });
  };
  return (
    <View>
      <BaAsk question="When in the week will you do them?" sub="A day and a time of day for each." />
      {response.activities.map((k, i) => {
        const p = response.plans[k];
        return (
          <Plan key={k} k={k} first={i === 0}>
            <View accessibilityRole="radiogroup" accessibilityLabel={`Day for ${activityLabel(k)}`} className="flex-row gap-1">
              {DAYS.map(([l, full], d) => <BaOpt key={full} label={l} a11y={full} on={p?.day === d} onPress={() => set(k, { day: d })} />)}
            </View>
            <View accessibilityRole="radiogroup" accessibilityLabel={`Time of day for ${activityLabel(k)}`} className="mt-2 flex-row gap-2">
              {TIMES.map((t, ti) => <BaOpt key={t} label={t} on={p?.time === ti} onPress={() => set(k, { time: ti })} />)}
            </View>
          </Plan>
        );
      })}
    </View>
  );
}

export function BaNowStep({ response, onUpdate }: StepProps<R>): React.JSX.Element {
  const { activities, tryNow } = response;
  // the prototype preselects the first activity so there is always an answer to start from
  useEffect(() => {
    if (!activities.includes(tryNow) && activities[0]) onUpdate({ tryNow: activities[0] });
  }, [activities, tryNow, onUpdate]);

  const pick = (k: string) => {
    Haptics.selectionAsync().catch(() => {});
    // a different activity means the earlier guess was about something else
    if (k !== tryNow) onUpdate({ tryNow: k, expectedEnjoyment: 5, expectedAccomplishment: 5, actualEnjoyment: 5, actualAccomplishment: 5 });
  };

  return (
    <View>
      <BaAsk question="Which one could you try right now?" />
      <View accessibilityRole="radiogroup">
        {activities.map((k) => {
          const on = tryNow === k;
          return (
            <Pressable
              key={k}
              accessibilityRole="radio"
              accessibilityState={{ selected: on }}
              onPress={() => pick(k)}
              className={`mb-3 min-h-[68px] flex-row items-center gap-3 rounded-2xl border-2 px-4 py-3 active:scale-[0.99] ${on ? "border-happy-ink bg-happy-tint" : "border-transparent bg-happy-surface-2"}`}
            >
              <BaIcon name={k} size={32} />
              <View className="flex-1">
                <Text className="font-bold leading-[22px] text-happy-label">{activityLabel(k)}</Text>
                <Text className="text-t-foot font-semibold text-happy-label-2">{sizeOf(response, k)} min · {whenText(response, k)}</Text>
              </View>
              {on && <Text className="rounded-full bg-happy-surface px-3 py-0.5 text-t-foot font-bold text-happy-accent">Now</Text>}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
