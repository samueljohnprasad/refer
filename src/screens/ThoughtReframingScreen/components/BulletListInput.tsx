import React, { useState, useCallback } from 'react';
import { View, Pressable, TextInput } from 'react-native';
import { Text } from '@/components/ui/text';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon, Add01Icon } from '@hugeicons/core-free-icons';

interface BulletListInputProps {
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
  maxItems: number;
  placeholder?: string;
}

export const BulletListInput: React.FC<BulletListInputProps> = React.memo(
  ({
    items,
    onAdd,
    onRemove,
    maxItems,
    placeholder = 'Type something and tap add...',
  }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleAdd = useCallback((): void => {
      const trimmed: string = inputValue.trim();
      if (trimmed.length === 0) return;
      onAdd(trimmed);
      setInputValue('');
    }, [inputValue, onAdd]);

    const canAdd: boolean = items.length < maxItems && inputValue.trim().length > 0;

    return (
      <View>
        {/* Existing items */}
        {items.map((item: string, index: number) => (
          <View
            key={`${item}-${index}`}
            className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-2 border border-slate-100"
          >
            <View className="h-2 w-2 rounded-full bg-blue-400 mr-3" />
            <Text className="flex-1 text-sm text-slate-700">{item}</Text>
            <Pressable
              onPress={() => onRemove(index)}
              accessibilityRole="button"
              accessibilityLabel={`Remove: ${item}`}
              className="h-8 w-8 rounded-full bg-slate-50 items-center justify-center active:bg-slate-100"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={14} color="#94A3B8" />
            </Pressable>
          </View>
        ))}

        {/* Input row */}
        {items.length < maxItems && (
          <View className="flex-row items-center bg-white rounded-xl border border-slate-100 overflow-hidden">
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder={placeholder}
              placeholderTextColor="#94A3B8"
              onSubmitEditing={handleAdd}
              returnKeyType="done"
              maxLength={200}
              className="flex-1 px-4 py-3 text-sm text-slate-700"
            />
            <Pressable
              onPress={handleAdd}
              disabled={!canAdd}
              accessibilityRole="button"
              accessibilityLabel="Add item"
              className={`h-10 w-10 mx-1 rounded-xl items-center justify-center ${
                canAdd ? 'bg-blue-500 active:bg-blue-600' : 'bg-slate-100'
              }`}
            >
              <HugeiconsIcon
                icon={Add01Icon}
                size={16}
                color={canAdd ? '#ffffff' : '#CBD5E1'}
              />
            </Pressable>
          </View>
        )}

        {/* Item count */}
        <Text className="text-xs text-slate-400 mt-2 text-right">
          {items.length}/{maxItems} items
        </Text>
      </View>
    );
  }
);

BulletListInput.displayName = 'BulletListInput';
