// ponytail: tap-to-use chips (.agents/abc-analysis.html's `.qrs`). Pure presentation.
import React from 'react';
import { View, Text, Pressable } from 'react-native';

export function AbcQuickReplies({ items, selected, onPick }: { items: readonly string[]; selected?: string; onPick: (item: string) => void }): React.JSX.Element | null {
  if (items.length === 0) return null;
  return (
    <View className="flex-row flex-wrap gap-2 mt-4">
      {items.map((item) => {
        const on = item === selected;
        return (
          <Pressable
            key={item}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onPick(item)}
            className={`min-h-11 max-w-full justify-center px-4 py-2 rounded-full active:scale-[0.97] ${on ? 'bg-happy-tint border-2 border-happy-ink' : 'bg-happy-surface-2'}`}
          >
            <Text className="text-t-sub font-semibold leading-[19px] text-happy-label">{item}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
