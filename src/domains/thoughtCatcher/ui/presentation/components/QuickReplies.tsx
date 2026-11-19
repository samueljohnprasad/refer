// ponytail: tap-to-fill chips (`.qrs` / `.qr`). Examples hide once there are words, starters stay.
import React from 'react';
import { View, Text, Pressable } from 'react-native';

export interface QuickRepliesProps {
  items: readonly string[];
  onPick: (text: string) => void;
  selected?: string;
  hidden?: boolean;
}

export function QuickReplies({ items, onPick, selected, hidden }: QuickRepliesProps): React.JSX.Element | null {
  if (hidden) return null;
  return (
    <View className="flex-row flex-wrap gap-2 mt-4">
      {items.map((t) => {
        const on = selected !== undefined && selected.trim() === t;
        return (
          <Pressable
            key={t}
            onPress={() => onPick(t)}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            className="min-h-11 max-w-full justify-center rounded-pill px-4 py-2 active:scale-[0.97]"
            style={{ backgroundColor: on ? '#eef3ea' : '#f7f7f7', borderWidth: 2, borderColor: on ? '#5f7f58' : 'transparent' }}
          >
            <Text className="text-t-sub font-semibold leading-[20px] text-happy-label">{t}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
