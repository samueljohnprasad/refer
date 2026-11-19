// ponytail: matches .agents/exercises.html's `.stats` — two quiet numbers, no streaks.
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

type Stat = { icon: React.ComponentProps<typeof Feather>["name"]; value: string; label: string };

export function PracticeStatsPair({ stats }: { stats: readonly [Stat, Stat] }): React.JSX.Element {
  return (
    <View className="flex-row gap-2">
      {stats.map((s) => (
        <View key={s.label} className="flex-1 p-4 rounded-2xl bg-happy-surface-2">
          <Feather name={s.icon} size={22} color="#44633f" />
          <Text className="mt-2 font-display text-t-title leading-none text-happy-label">{s.value}</Text>
          <Text className="mt-1 text-t-foot font-semibold text-happy-label-2">{s.label}</Text>
        </View>
      ))}
    </View>
  );
}
