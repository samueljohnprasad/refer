import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { SAGE } from "@/lib/tokens";
import { Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface SuggestionItem {
  label: string;
  emoji?: string;
}

export function SuggestionCards({
  title,
  suggestions,
  currentValue,
  onSelect,
  isLoading,
  loadingMessage,
  readOnly,
}: {
  title: string;
  suggestions: SuggestionItem[];
  currentValue: string | string[];
  onSelect: (value: string) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  readOnly?: boolean;
}) {
  if (isLoading) {
    return (
      <View className="mb-6">
        {loadingMessage ? (
          <Text variant="body-bold" color="muted" className="mb-3">
            {loadingMessage}
          </Text>
        ) : null}
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={`skeleton-${index}`} className="flex-row items-center p-4 mb-2 rounded-[16px] bg-white/40 border border-sage-200/20">
            <Skeleton height={24} width={24} radius={12} className="mr-3" />
            <Skeleton height={16} width="70%" />
          </View>
        ))}
      </View>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      {title ? (
        <Text variant="body-bold" color="muted" className="mb-3">
          {title}
        </Text>
      ) : null}
      {suggestions.map((s, index: number) => {
        const isSelected = Array.isArray(currentValue)
          ? currentValue.includes(s.label)
          : currentValue === s.label;
        return (
          <Pressable
            key={`${s.label || ""}-${index}`}
            onPress={readOnly ? undefined : () => onSelect(s.label)}
            className={`flex-row items-start p-4 mb-3 rounded-[16px] border ${isSelected ? 'bg-sage-50 border-sage-300/60' : 'bg-transparent border-sage-200/40 active:bg-sage-50/50'}`}
            accessibilityState={{ selected: isSelected }}
          >
            {s.emoji && (
              <Text className="text-[20px] mr-3 mt-[1px]">{s.emoji}</Text>
            )}
            <Text
              className="text-[15.5px] flex-1 leading-relaxed pr-2"
              style={{ color: isSelected ? SAGE[900] : SAGE[800], fontWeight: isSelected ? "500" : "400" }}
            >
              {s.label}
            </Text>
            {isSelected ? (
              <View className="mt-0.5">
                <Feather name="check" size={18} color={SAGE[600]} />
              </View>
            ) : (
              <View className="mt-0.5 opacity-40">
                <Feather name="plus" size={18} color={SAGE[500]} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
