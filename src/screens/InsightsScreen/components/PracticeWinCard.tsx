// ponytail: the one finding, drawn — matches .agents/exercises.html's `.win`: before and after as two
// bars you can compare at a glance. Pure presentation; the shift comes from useInsightsOverview.
import React from "react";
import { View, Text } from "react-native";
import { moveTone, MoveTone } from "@/src/domains/exercises/domain/timelineEntry";
import type { ReframeWin } from "@/src/hooks/insights/useInsightsOverview";

const AFTER_COLOR: Record<MoveTone, string> = {
  [MoveTone.Helped]: "#5f7f58",
  [MoveTone.Flat]: "#8a918a",
  [MoveTone.Against]: "#c9852f",
};

const round1 = (n: number) => Math.round(n * 10) / 10;

function headline(before: number, after: number): string {
  const diff = round1(before - after);
  if (diff >= 0.5) return `Your feelings eased by ${diff} points on average.`;
  if (diff <= -0.5) return `Your ratings rose by ${Math.abs(diff)} points on average.`;
  return "Your ratings stayed about the same.";
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View className="flex-row items-center gap-2">
      <Text className="w-[52px] text-t-foot font-bold text-happy-label-2">{label}</Text>
      <View className="flex-1 h-3.5 rounded-[7px] bg-white overflow-hidden">
        <View style={{ width: `${Math.min(10, Math.max(0, value)) * 10}%`, backgroundColor: color }} className="h-full rounded-[7px]" />
      </View>
      <Text className="w-7 text-right font-display text-t-lead text-happy-label">{round1(value)}</Text>
    </View>
  );
}

export function PracticeWinCard({ win }: { win: ReframeWin }): React.JSX.Element {
  const tone = moveTone("distress", win.before, win.after);
  return (
    <View className="p-4 rounded-[20px] bg-happy-tint">
      <Text className="text-t-foot font-bold text-happy-accent">
        Thought Reframing · {win.sessions} {win.sessions === 1 ? "session" : "sessions"}
      </Text>
      <Text className="mt-2 font-display text-t-h leading-[28px] tracking-tight text-happy-label">
        {headline(win.before, win.after)}
      </Text>
      <View className="gap-2 mt-4">
        <Bar label="Before" value={win.before} color="#a9bfa0" />
        <Bar label="After" value={win.after} color={AFTER_COLOR[tone]} />
      </View>
      <Text className="mt-3 text-t-cap font-semibold text-happy-label-3">
        From your own ratings, out of 10. {win.sessions < 5 ? "A few sessions is an early read, not a clinical assessment." : "Not a clinical assessment."}
      </Text>
    </View>
  );
}
