// ponytail: the activity tiles (.agents/behavioral-activation.html `.act`): two columns, an icon each, a
// tick on the ones you picked. Dropping an activity drops its size, plan and "try now" with it.
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { useReducedMotion, ZoomIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import type { BehavioralActivationResponse as R, StepProps } from "@/src/types/exerciseFlow";
import { ACTIVITIES, MAX_ACTIVITIES, SIZES } from "./activities";
import { BaAsk } from "./baAsk";
import { BaIcon } from "./baIcons";

const without = <T,>(o: Record<string, T>, key: string): Record<string, T> =>
  Object.fromEntries(Object.entries(o).filter(([k]) => k !== key));

export function BaPickStep({ response, onUpdate, readOnly }: StepProps<R>): React.JSX.Element {
  const [note, setNote] = useState("");
  const [just, setJust] = useState<string | null>(null); // prototype `.just`: only a fresh pick pops its icon
  const still = useReducedMotion();
  const picked = response.activities;
  const full = picked.length >= MAX_ACTIVITIES;

  const toggle = (k: string) => {
    Haptics.selectionAsync().catch(() => {});
    setJust(k);
    if (picked.includes(k)) {
      setNote("");
      onUpdate({
        activities: picked.filter((a) => a !== k),
        sizes: without(response.sizes, k),
        plans: without(response.plans, k),
        tryNow: response.tryNow === k ? "" : response.tryNow,
      });
    } else if (!full) {
      onUpdate({
        activities: [...picked, k],
        sizes: { ...response.sizes, [k]: SIZES[0] },
        plans: { ...response.plans, [k]: { day: null, time: null } },
      });
    } else setNote(`Up to ${MAX_ACTIVITIES}. Tap one to remove it first.`);
  };

  return (
    <View>
      <BaAsk question="What could you do today, even a little?" sub={`Pick up to ${MAX_ACTIVITIES}.`} />
      <View className="flex-row flex-wrap justify-between gap-y-3">
        {ACTIVITIES.map((a) => {
          const on = picked.includes(a.value);
          const dim = full && !on;
          return (
            <Pressable
              key={a.value}
              accessibilityRole="button"
              accessibilityState={{ selected: on, disabled: readOnly }}
              disabled={readOnly}
              onPress={() => toggle(a.value)}
              className={`min-h-[112px] w-[48.5%] items-center justify-center gap-2 rounded-2xl border-2 p-3 active:scale-[0.97] ${on ? "border-happy-ink bg-happy-tint" : "border-transparent bg-happy-surface-2"}`}
            >
              <Animated.View
                key={on && just === a.value ? "pop" : "still"}
                entering={on && just === a.value && !still ? ZoomIn.withInitialValues({ transform: [{ scale: 0.6 }] }).springify().duration(350) : undefined}
                style={{ opacity: dim ? 0.45 : 1 }}
              >
                <BaIcon name={a.value} />
              </Animated.View>
              <Text className={`text-center text-t-body font-semibold leading-[20px] ${dim ? "text-happy-label-2" : "text-happy-label"}`}>{a.label}</Text>
              {on && (
                <Animated.View entering={ZoomIn.springify()} className="absolute right-3 top-3 size-6 items-center justify-center rounded-full bg-[#29452a]">
                  <Feather name="check" size={14} color="#fff" />
                </Animated.View>
              )}
            </Pressable>
          );
        })}
      </View>
      <Text accessibilityLiveRegion="polite" className="mt-2 min-h-[18px] text-t-foot font-semibold text-happy-label-2">{note}</Text>
    </View>
  );
}
