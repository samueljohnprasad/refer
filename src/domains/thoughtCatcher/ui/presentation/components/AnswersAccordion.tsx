// ponytail: "See your answers" (`.ans`) — the record, folded away until asked for.
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

export interface AnswersAccordionProps {
  open: boolean;
  onToggle: () => void;
  rows: ReadonlyArray<readonly [string, string]>;
}

export function AnswersAccordion({ open, onToggle, rows }: AnswersAccordionProps): React.JSX.Element {
  return (
    <View className="mt-6 rounded-2xl bg-happy-surface-2">
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        className="min-h-[52px] flex-row items-center justify-between px-4"
      >
        <Text className="text-t-body font-bold text-happy-label">See your answers</Text>
        <Feather name={open ? 'chevron-up' : 'chevron-down'} size={20} color="#142414" />
      </Pressable>
      {open && (
        <View className="px-4 pb-2">
          {rows.filter(([, v]) => v).map(([dt, dd]) => (
            <View key={dt} className="border-t border-happy-sep pt-3 pb-3">
              <Text className="text-t-foot font-bold text-happy-label-2">{dt}</Text>
              <Text className="mt-1 text-t-sub font-medium leading-[21px] text-happy-label">{dd}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
