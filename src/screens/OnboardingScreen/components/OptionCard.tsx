import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Card } from "@/src/components/ui/Card";
import { QuizOption } from "../types";

interface OptionCardProps<T extends string> {
  option: QuizOption<T>;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

function OptionCardInner<T extends string>({
  option,
  isSelected,
  onSelect,
  index,
}: OptionCardProps<T>) {
  return (
    <Animated.View entering={FadeIn.delay(140 + index * 60).duration(220)}>
      <Card
        variant={isSelected ? "answer-selected" : "answer"}
        radius="lg"
        onPress={onSelect}
        className="w-full"
        contentClassName="flex-row items-center gap-3.5 px-[18px] py-[18px]"
        showDepth={true}
      >
        <View
          className={`h-11 w-11 items-center justify-center rounded-xl ${
            isSelected ? "bg-sage-500" : "bg-sage-50"
          }`}
        >
          <Text className="text-[22px]">{option.emoji}</Text>
        </View>
        <View className="flex-1">
          <Text
            className={`happy-font-body-semibold text-[15px] font-semibold ${
              isSelected ? "text-sage-700" : "text-ink"
            }`}
          >
            {option.title}
          </Text>
          <Text
            className="happy-font-body text-xs text-ink-muted"
          >
            {option.subtitle}
          </Text>
        </View>
        {isSelected && (
          <View
            className="h-6 w-6 items-center justify-center rounded-full bg-sage-500"
          >
            <Text className="text-xs font-extrabold text-white">✓</Text>
          </View>
        )}
      </Card>
    </Animated.View>
  );
}

const OptionCard = React.memo(OptionCardInner) as typeof OptionCardInner;
export default OptionCard;
