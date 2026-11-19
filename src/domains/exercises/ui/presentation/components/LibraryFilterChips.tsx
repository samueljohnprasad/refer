// ponytail: .chips row from .agents/exercises.html — pure presentation, selection owned by the container.
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Text } from '@/src/components/ui/Text';
import { LIBRARY_FILTERS, type LibraryFilter } from '../../../domain/libraryFilter';

export interface LibraryFilterChipsProps {
  value: LibraryFilter;
  onChange: (filter: LibraryFilter) => void;
}

export function LibraryFilterChips({ value, onChange }: LibraryFilterChipsProps): React.JSX.Element {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityLabel="Filter by length"
      contentContainerClassName="gap-2 pb-4"
    >
      {LIBRARY_FILTERS.map(({ key, label }) => {
        const selected = key === value;
        return (
          <Pressable
            key={key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(key)}
            className={`flex-row items-center gap-1.5 min-h-9 px-3 rounded-pill ${selected ? 'bg-happy-tint' : 'bg-happy-surface-2'}`}
          >
            {selected && <Feather name="check" size={14} color="#29452a" />}
            <Text className={`text-t-foot happy-font-body-bold ${selected ? 'text-[#29452a]' : 'text-happy-label-2'}`}>{label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
