// ponytail: exact .grat list matching .agents/exercises.html — a plain 6px dot bullet, not an
// icon. Pure presentation.
import React from 'react';
import { View, Text } from 'react-native';

export interface GratitudeListProps {
  entries: readonly string[];
}

export function GratitudeList({ entries }: GratitudeListProps): React.JSX.Element {
  return (
    <View className="flex-col gap-1.5">
      {entries.map((entry, i) => (
        <View key={i} className="relative pl-[22px]">
          <View className="absolute left-[2.5px] top-[9px] w-1.5 h-1.5 rounded-full bg-happy-ink" />
          <Text className="text-t-sub text-happy-label">{entry}</Text>
        </View>
      ))}
    </View>
  );
}
