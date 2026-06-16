import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Card } from "@/src/components/ui/Card";
import { SAGE, INK_MUTED } from "@/lib/tokens";

export interface SuggestionItem {
  label: string;
  emoji?: string;
  rationale?: string;
}

interface SuggestionCardsProps {
  title?: string;
  suggestions?: SuggestionItem[];
  currentValue: string;
  onSelect: (value: string) => void;
  readOnly?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

export function SuggestionCards({
  title,
  suggestions,
  currentValue,
  onSelect,
  readOnly,
  isLoading,
  loadingText = "Crafting options…",
}: SuggestionCardsProps) {
  if (readOnly) return null;

  if (isLoading) {
    return (
      <View className="flex-row items-center mt-2 mb-4">
        <ActivityIndicator size="small" color={INK_MUTED} />
        <Text className="text-[11px] text-ink-muted ml-2 uppercase tracking-wider">
          {loadingText}
        </Text>
      </View>
    );
  }

  if (!suggestions || suggestions.length === 0) return null;

  return (
    <View className="mb-6">
      {title && (
        <Text className="text-xs font-extrabold text-ink-muted uppercase tracking-wider mb-3">
          {title}
        </Text>
      )}
      {suggestions.map((s, idx) => {
        const isSelected = currentValue === s.label;
        return (
          <Card
            key={idx}
            variant={isSelected ? "answer-selected" : "answer"}
            onPress={() => onSelect(s.label)}
            className="mb-3"
            contentClassName="flex-row items-center"
          >
            {s.emoji && (
              <View className="h-9 w-9 rounded-xl bg-slate-100 items-center justify-center mr-3">
                <Text className="text-lg">{s.emoji}</Text>
              </View>
            )}
            <View className="flex-1">
              <Text
                className="text-[15px] font-bold"
                style={{ color: isSelected ? SAGE[700] : "#334155" }}
              >
                {s.label}
              </Text>
              {s.rationale ? (
                <Text className="text-xs text-slate-500 mt-1">
                  {s.rationale}
                </Text>
              ) : null}
            </View>
          </Card>
        );
      })}
    </View>
  );
}
