import React from "react";
import { Pressable, useWindowDimensions, View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { SAGE } from "@/lib/tokens";
import { Feather } from "@expo/vector-icons";
import { triggerSelectionHaptic } from "@/src/components/exercise/selectionHaptics";

export interface SuggestionItem {
  label: string;
  emoji?: string;
}

export function SuggestionCards({
  title,
  helperText,
  actionLabel = "Use",
  suggestions,
  currentValue,
  onSelect,
  isLoading,
  loadingMessage,
  readOnly,
}: {
  title: string;
  helperText?: string;
  actionLabel?: string;
  suggestions: SuggestionItem[];
  currentValue: string | string[];
  onSelect: (value: string) => void;
  isLoading?: boolean;
  loadingMessage?: string;
  readOnly?: boolean;
}) {
  const { width } = useWindowDimensions();
  const isCompact = width < 390;
  const visibleActionLabel = isCompact
    ? actionLabel.split(" ")[0]
    : actionLabel;

  if (isLoading) {
    return (
      <View className="mb-2">
        {loadingMessage ? (
          <Text variant="caption" className="mb-3 text-ink-soft">
            {loadingMessage}
          </Text>
        ) : null}
        {Array.from({ length: 2 }).map((_, index) => (
          <View
            key={`skeleton-${index}`}
            className="flex-row items-center py-3 border-t border-sage-100/70"
          >
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
    <View className="mb-2">
      {title ? (
        <Text variant="caption" className="mb-2 text-ink-soft">
          {title}
        </Text>
      ) : null}
      {helperText ? (
        <Text variant="caption" className="mb-3 text-ink-soft leading-relaxed">
          {helperText}
        </Text>
      ) : null}
      {suggestions.map((s, index: number) => {
        const isSelected = Array.isArray(currentValue)
          ? currentValue.includes(s.label)
          : currentValue === s.label;
        return (
          <Pressable
            key={`${s.label || ""}-${index}`}
            onPress={
              readOnly
                ? undefined
                : () => {
                    triggerSelectionHaptic();
                    onSelect(s.label);
                  }
            }
            accessibilityRole="button"
            accessibilityLabel={`${actionLabel}: ${s.label}`}
            accessibilityState={{ selected: isSelected }}
            className={`flex-row items-start py-3.5 border-t ${
              isSelected ? "border-sage-300" : "border-sage-100/70"
            } active:opacity-70`}
            style={{ minHeight: 48 }}
          >
            {s.emoji && (
              <Text className="text-[17px] mr-3 mt-[1px]">{s.emoji}</Text>
            )}
            <Text
              className="text-[14.5px] flex-1 leading-relaxed pr-3"
              style={{
                color: isSelected ? SAGE[800] : SAGE[700],
                fontWeight: isSelected ? "500" : "400",
              }}
            >
              {s.label}
            </Text>
            {isSelected ? (
              <View className="mt-0.5">
                <Feather name="check" size={18} color={SAGE[600]} />
              </View>
            ) : (
              <View
                className="mt-0.5 items-end"
                style={{ minWidth: isCompact ? 38 : 72 }}
              >
                <Text
                  variant="chip"
                  className="text-sage-700"
                  numberOfLines={1}
                >
                  {visibleActionLabel}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
