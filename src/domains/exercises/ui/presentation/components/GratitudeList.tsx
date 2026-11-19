// ponytail: exact .grat list matching .agents/exercises.html — a plain 6px dot bullet, not an
// icon. Pure presentation.
import React from 'react';
import { View } from 'react-native';
import { Text } from '@/src/components/ui/Text';

export interface GratitudeListProps {
  entries: readonly string[];
}

export function GratitudeList({ entries }: GratitudeListProps): React.JSX.Element {
  return (
    <View className="flex-col gap-1.5">
      {entries.map((entry, i) => (
        <View key={i} className="relative pl-[22px]">
          <View className="absolute left-[2.5px] top-[7px] w-1.5 h-1.5 rounded-full bg-happy-ink" />
          <Text className="text-[15px] happy-font-body-medium text-happy-label leading-[21px]">{entry}</Text>
        </View>
      ))}
    </View>
  );
}
