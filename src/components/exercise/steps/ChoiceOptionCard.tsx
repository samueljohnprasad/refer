import React from "react";
import { View, Pressable } from "react-native";
import { Card } from "@/src/components/ui/Card";
import { Text } from "@/src/components/ui/Text";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { FadeInItem } from "@/src/components/ui/FadeInItem";
import { getContentIcon } from "@/src/data/contentIconRegistry";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

export interface ChoiceOption {
  value: string;
  label: string;
  iconKey?: string;
  emoji?: string;
  description?: string;
}

export type ChoiceLayoutVariant = "default" | "cbt_reflection";

export function ChoiceOptionCard({
  option,
  index,
  selected,
  layoutVariant,
  onSelect,
}: {
  option: ChoiceOption;
  index: number;
  selected: boolean;
  layoutVariant: ChoiceLayoutVariant;
  onSelect: (value: string) => void;
}) {
  const resolvedIcon = option.iconKey ? getContentIcon(option.iconKey) : null;

  if (layoutVariant === "cbt_reflection") {
    return (
      <FadeInItem key={option.value} index={index} delayPerItem={40}>
        <Pressable
          onPress={() => onSelect(option.value)}
          className="mb-1 min-h-[84px] flex-row items-center rounded-[24px] border px-5 py-4 active:opacity-80"
          style={{
            backgroundColor: selected
              ? SEMANTIC_COLORS.surface.elevated
              : "#FFFFFF",
            borderColor: SEMANTIC_COLORS.border.default,
          }}
          accessibilityRole="radio"
          accessibilityState={{ selected }}
          accessibilityLabel={option.label}
        >
          {resolvedIcon ? (
            <View className="mr-4 h-11 w-11 items-center justify-center rounded-full bg-sage-50">
              <HugeiconsIcon
                icon={resolvedIcon}
                size={20}
                color={
                  selected
                    ? SEMANTIC_COLORS.brand.pressed
                    : SEMANTIC_COLORS.text.secondary
                }
                strokeWidth={2}
              />
            </View>
          ) : option.emoji ? (
            <Text className="mr-4 text-2xl">{option.emoji}</Text>
          ) : null}

          <Text
            variant="body-bold"
            className="flex-1 text-[17px] leading-[22px]"
            style={{
              color: selected
                ? SEMANTIC_COLORS.text.primary
                : SEMANTIC_COLORS.text.secondary,
            }}
          >
            {option.label}
          </Text>

          <View
            className="ml-4 h-7 w-7 items-center justify-center rounded-full border"
            style={{
              backgroundColor: selected
                ? SEMANTIC_COLORS.brand.primary
                : "#FFFFFF",
              borderColor: selected
                ? SEMANTIC_COLORS.text.secondary
                : SEMANTIC_COLORS.border.default,
            }}
          >
            {selected ? (
              <Text variant="chip" color="surface" className="text-[11px] leading-none">
                ✓
              </Text>
            ) : null}
          </View>
        </Pressable>
      </FadeInItem>
    );
  }

  return (
    <FadeInItem key={option.value} index={index} delayPerItem={40}>
      <Card
        variant={selected ? "answer-selected" : "answer"}
        radius="xl"
        onPress={() => onSelect(option.value)}
        className="mb-1"
        contentClassName="flex-row items-center justify-between p-4.5 min-h-[52px]"
      >
        {resolvedIcon ? (
          <View className="mr-3.5 h-10 w-10 items-center justify-center rounded-xl bg-sage-50">
            <HugeiconsIcon
              icon={resolvedIcon}
              size={22}
              color={SEMANTIC_COLORS.text.secondary}
              strokeWidth={2}
            />
          </View>
        ) : option.emoji ? (
          <Text className="text-2xl mr-3.5">{option.emoji}</Text>
        ) : null}

        <View className="flex-1 mr-2">
          <Text
            variant="body-bold"
            color={selected ? "ink" : "soft"}
            className="text-[16px] leading-tight"
          >
            {option.label}
          </Text>
          {option.description ? (
            <Text variant="caption-muted" className="mt-1">
              {option.description}
            </Text>
          ) : null}
        </View>

        <View className="ml-2">
          {selected ? (
            <View className="w-6 h-6 rounded-full items-center justify-center bg-sage-500 border border-sage-600">
              <Text variant="chip" color="surface" className="font-extrabold text-[11px] leading-none">
                ✓
              </Text>
            </View>
          ) : (
            <View className="w-6 h-6 rounded-full border border-brand-border bg-brand-surface" />
          )}
        </View>
      </Card>
    </FadeInItem>
  );
}
