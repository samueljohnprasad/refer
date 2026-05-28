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
  casual: "bg-sage-50 text-ink-soft",
  recommended: "bg-sage-pill text-sage-600",
  committed: "bg-terracotta-light text-terracotta",
  serious: "bg-terracotta text-white",
} as const;

const GoalCard: React.FC<GoalCardProps> = ({
  config,
  isSelected,
  onSelect,
  index,
}) => {
  return (
    <Animated.View entering={FadeIn.delay(140 + index * 60).duration(220)}>
      <Card
        variant={isSelected ? "answer-selected" : "answer"}
        radius="lg"
        onPress={onSelect}
        className="w-full"
        contentClassName="flex-row items-center justify-between px-[18px] py-4"
        showDepth={true}
      >
        <View>
          <Text
            className={`happy-font-heading text-[22px] ${isSelected ? "text-sage-600" : "text-ink"}`}
          >
            {config.displayLabel ?? `${config.minutes} min`}
          </Text>
          <Text
            className="happy-font-body text-xs text-ink-muted"
          >
            {config.description}
          </Text>
        </View>
        <View
          className={`rounded-full px-2.5 py-1 ${TAG_STYLES[config.tagVariant]}`}
        >
          <Text
            className="happy-font-body-bold text-[11px] font-bold uppercase tracking-wide"
          >
            {config.tag}
          </Text>
        </View>
      </Card>
    </Animated.View>
  );
};

export default React.memo(GoalCard);
