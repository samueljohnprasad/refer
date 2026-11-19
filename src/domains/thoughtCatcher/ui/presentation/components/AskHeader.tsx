// ponytail: Happi asks one question in a tinted bubble; the instruction sits under it as plain app text
// (thought-catcher.html `.ask` + `.sub`). Happi keeps its box while hidden so the question never jumps.
import React from 'react';
import { View, Text } from 'react-native';

export interface AskHeaderProps {
  question: string;
  sub?: string;
  /** Happi's figure, already sized to 84; omitted after a crisis phrase */
  happi?: React.ReactNode;
  happiHidden?: boolean;
}

export function AskHeader({ question, sub, happi, happiHidden }: AskHeaderProps): React.JSX.Element {
  return (
    <View>
      <View className="flex-row items-end gap-2 mt-4 mb-5">
        {happi ? (
          <View style={{ width: 84, aspectRatio: 220 / 246, marginBottom: -4, opacity: happiHidden ? 0 : 1 }}>{happi}</View>
        ) : null}
        <View className="flex-1 self-center rounded-2xl bg-happy-tint px-4 py-3">
          {happi ? (
            <View
              style={{ position: 'absolute', left: -8, bottom: 18, borderTopWidth: 8, borderBottomWidth: 8, borderRightWidth: 8, borderColor: 'transparent', borderRightColor: '#f2f8ef' }}
            />
          ) : null}
          <Text accessibilityRole="header" className="font-display text-t-h font-semibold leading-[28px] text-happy-label">{question}</Text>
        </View>
      </View>
      {sub ? <Text className="-mt-3 mb-4 text-t-sub font-medium leading-[22px] text-happy-label-2">{sub}</Text> : null}
    </View>
  );
}
