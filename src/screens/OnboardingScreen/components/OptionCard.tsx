import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Card } from "@/src/components/ui/Card";
import { QuizOption } from "../types";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  Yoga01Icon,
  SmileIcon,
  WorryIcon,
  Compass01Icon,
  Moon01Icon,
  Leaf01Icon,
  CloudIcon,
  Alert01Icon,
  SparklesIcon,
  ShuffleIcon,
  Notebook01Icon,
  Timer01Icon,
  MoonCloudIcon,
  BedIcon,
} from "@hugeicons/core-free-icons";
import { SAGE } from "@/lib/tokens";

export function getQuizIcon(id: string) {
  switch (id) {
    // Motivation
    case "anxiety":
      return Yoga01Icon;
    case "mood":
      return SmileIcon;
    case "stress":
      return WorryIcon;
    case "self_understanding":
      return Compass01Icon;
    case "sleep":
      return Moon01Icon;

    // Stress Level
    case "light":
      return Leaf01Icon;
    case "moderate":
      return CloudIcon;
    case "heavy":
      return WorryIcon;
    case "overwhelming":
      return Alert01Icon;

    // Experience
    case "never":
      return SparklesIcon;
    case "tried_quit":
      return ShuffleIcon;
    case "active":
      return Notebook01Icon;

    // Timing
    case "morning":
      return Timer01Icon;
    case "afternoon":
      return SparklesIcon;
    case "evening":
      return MoonCloudIcon;
    case "night":
      return BedIcon;

    default:
      return SparklesIcon;
  }
}

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
        accessibilityRole="radio"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${option.title}, ${option.subtitle}`}
        className="w-full"
        contentClassName="flex-row items-center gap-3.5 px-[18px] py-[18px]"
        showDepth={true}
      >
        <View
          className={`h-11 w-11 items-center justify-center rounded-xl ${
            isSelected ? "bg-sage-500" : "bg-sage-50"
          }`}
        >
          <HugeiconsIcon
            icon={getQuizIcon(option.id)}
            size={22}
            color={isSelected ? "#FFFFFF" : SAGE[600]}
          />
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
            className="happy-font-body text-xs text-ink-soft"
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
