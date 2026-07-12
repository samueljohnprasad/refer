import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Card } from "@/src/components/ui/Card";
import { GoalCardConfig } from "../types";

interface GoalCardProps {
  config: GoalCardConfig;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

const TAG_STYLES = {
  casual: "bg-brand-surface-soft border border-brand-border text-ink-muted",
  recommended: "bg-sage-pill border border-sage-200 text-sage-600",
  committed: "bg-sage-50 border border-sage-200 text-sage-700",
  serious: "bg-sage-100 border border-sage-300 text-sage-800",
} as const;

const GoalCard: React.FC<GoalCardProps> = ({
  config,
  isSelected,
  onSelect,
  index,
}) => {
  const displayTitle = config.displayLabel ?? `${config.minutes} min`;
  const accessibleLabel = `${displayTitle}, ${config.description}, ${config.tag}${
    isSelected ? ", selected" : ""
  }`;

  return (
    <Animated.View entering={FadeIn.delay(140 + index * 60).duration(220)}>
      <Card
        variant={isSelected ? "answer-selected" : "answer"}
        radius="lg"
        onPress={onSelect}
        accessibilityLabel={accessibleLabel}
        accessibilityState={{ selected: isSelected }}
        className="w-full"
        contentClassName="flex-row items-center justify-between px-4 py-4"
        showDepth={true}
      >
        <View>
          <Text
            className={`happy-font-heading text-2xl ${
              isSelected ? "text-sage-600" : "text-ink"
            }`}
          >
            {displayTitle}
          </Text>
          <Text className="happy-font-body text-xs text-ink-muted">
            {config.description}
          </Text>
        </View>
        <View
          className={`rounded-full px-2.5 py-1 ${TAG_STYLES[config.tagVariant]}`}
        >
          <Text className="happy-font-body-bold text-xs font-bold uppercase tracking-wide">
            {config.tag}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
};

export default React.memo(GoalCard);

