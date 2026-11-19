// ponytail: the small pieces the BA prototype repeats — the plan as one sentence with dashed gaps (`.me`,
// `.gap`), the ten-cell scale (`.segs` + range, shared tall-thumb slider), and a pill option (`.opt`). Pure presentation.
import React from "react";
import { Pressable, Text, View } from "react-native";
import { PrototypeSlider } from "@/src/components/exercise/PrototypeSlider";
import * as Haptics from "expo-haptics";
import type { BehavioralActivationResponse as R } from "@/src/types/exerciseFlow";
import { activityLabel, sizeOf, whenText } from "./activities";

const DASHED = { textDecorationLine: "underline", textDecorationStyle: "dashed" } as const;

function Gap({ text, name, tone }: { text: string; name: string; tone: string }) {
  return text
    ? <Text className="font-bold">{text}</Text>
    : <Text className={`text-t-foot font-medium ${tone}`} style={DASHED}>{name}</Text>;
}

/** Intro: "I’ll [activity] for [time], [when]." — every part still a gap. */
export function BaOpenLine(): React.JSX.Element {
  const tone = "text-happy-label-3";
  return (
    <Text className="mt-3 text-t-lead font-medium leading-7 text-happy-label-2" accessibilityLabel="I’ll do an activity for some minutes, on a day">
      I’ll <Gap text="" name="activity" tone={tone} /> for <Gap text="" name="time" tone={tone} />, <Gap text="" name="when" tone={tone} />.
    </Text>
  );
}

/** The chosen activity as the user’s own bubble: "I’ll walk outside for 10 min, Tuesday morning." */
export function BaLine({ response, now = false }: { response: R; now?: boolean }): React.JSX.Element | null {
  const k = response.tryNow;
  if (!k) return null;
  const spoken = `I’ll ${activityLabel(k).toLowerCase()} for ${sizeOf(response, k)} min, ${now ? "right now" : whenText(response, k)}.`;
  return (
    <View className="mb-4 items-end" accessible accessibilityLabel={spoken}>
      <View className="max-w-[85%] rounded-2xl rounded-br-[4px] bg-happy-ink px-4 py-3">
        <Text className="font-medium leading-[22px] text-white" numberOfLines={4}>
          I’ll <Gap text={activityLabel(k).toLowerCase()} name="" tone="" /> for <Gap text={`${sizeOf(response, k)} min`} name="" tone="" />, <Gap text={now ? "right now" : whenText(response, k)} name="" tone="" />.
        </Text>
      </View>
    </View>
  );
}

interface BaScaleProps {
  value: number;
  onChange: (v: number) => void;
  label: string;
  valueText: string;
  /** earlier answer, marked with a small pointer above its cell */
  was?: number;
  disabled?: boolean;
}

export function BaScale({ value, onChange, label, valueText, was, disabled }: BaScaleProps): React.JSX.Element {
  return (
    <PrototypeSlider
      value={value}
      label={label}
      valueText={valueText}
      disabled={disabled}
      onChange={(v) => { Haptics.selectionAsync().catch(() => {}); onChange(v); }}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <View key={i} className={`flex-1 rounded-lg border-2 ${i < value ? "border-b-[4px] border-happy-ink border-b-[#29452a] bg-happy-ink" : "border-happy-rim bg-happy-surface-2"}`}>
          {was != null && was > 0 && i === was - 1 && (
            <View className="absolute -top-2.5 self-center" style={{ borderWidth: 6, borderColor: "transparent", borderTopColor: "#29452a" }} />
          )}
        </View>
      ))}
    </PrototypeSlider>
  );
}

interface BaOptProps {
  label: string;
  on: boolean;
  onPress: () => void;
  a11y?: string;
}

/** A pill choice: pale fill + sage ring when picked. Radio semantics, one tap = one answer. */
export function BaOpt({ label, on, onPress, a11y }: BaOptProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={a11y ?? label}
      accessibilityState={{ selected: on }}
      onPress={() => { Haptics.selectionAsync().catch(() => {}); onPress(); }}
      className={`min-h-11 flex-1 items-center justify-center rounded-full border-2 active:scale-[0.97] ${on ? "border-happy-ink bg-happy-tint" : "border-transparent bg-happy-surface-2"}`}
    >
      <Text className="text-t-sub font-semibold text-happy-label">{label}</Text>
    </Pressable>
  );
}
