import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { SAGE } from "@/lib/tokens";

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
}: {
  title: string;
  suggestions: SuggestionItem[];
  currentValue: string | string[];
  onSelect: (value: string) => void;
  isLoading?: boolean;
  loadingMessage?: string;
}) {
  if (isLoading) {
    return (
      <View className="mb-6">
        <Text className="text-xs font-extrabold text-ink-muted uppercase tracking-wider mb-3">
          {loadingMessage || "Generating suggestions..."}
        </Text>
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={`skeleton-${index}`} variant="answer" className="mb-3" contentClassName="flex-row items-center p-4">
            <Skeleton height={36} width={36} radius={12} className="mr-3" />
            <Skeleton height={16} width="70%" />
          </Card>
        ))}
      </View>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <View className="mb-6">
      <Text className="text-xs font-extrabold text-ink-muted uppercase tracking-wider mb-3">
        {title}
      </Text>
      {suggestions.map((s, index: number) => {
        const isSelected = Array.isArray(currentValue)
          ? currentValue.includes(s.label)
          : currentValue === s.label;
        return (
          <Card
            key={`${s.label || ""}-${index}`}
            variant={isSelected ? "answer-selected" : "answer"}
            onPress={() => onSelect(s.label)}
            className="mb-3"
            contentClassName="flex-row items-center p-4"
            accessibilityState={{ selected: isSelected }}
          >
            {s.emoji && (
              <View className="h-9 w-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                <Text className="text-lg">{s.emoji}</Text>
              </View>
            )}
            <Text
              className="text-[15px] font-bold flex-1"
              style={{ color: isSelected ? SAGE[700] : "#334155" }}
            >
              {s.label}
            </Text>
            {isSelected && (
              <View
                className="h-6 w-6 rounded-full items-center justify-center ml-2"
                style={{ backgroundColor: SAGE[500] }}
              >
                <Text className="text-white text-xs font-extrabold">✓</Text>
              </View>
            )}
          </Card>
        );
      })}
    </View>
  );
}
