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
  CloudBigRainIcon,
  SparklesIcon,
  ShuffleIcon,
  Notebook01Icon,
  Timer01Icon,
  MoonCloudIcon,
  BedIcon,
  Tick01Icon,
} from "@hugeicons/core-free-icons";
import { ZoomIn } from "react-native-reanimated";

interface OptionTheme {
  lightBg: string;
  iconColor: string;
  activeBg: string;
}

// ponytail: Ahead-style category palette for emotional recognition
export function getOptionTheme(id: string): OptionTheme {
  switch (id) {
    case "anxiety":
      return { lightBg: "bg-sky-50", iconColor: "#0284C7", activeBg: "bg-sky-500" };
    case "mood":
      return { lightBg: "bg-amber-50", iconColor: "#D97706", activeBg: "bg-amber-500" };
    case "stress":
      return { lightBg: "bg-emerald-50", iconColor: "#059669", activeBg: "bg-emerald-500" };
    case "self_understanding":
      return { lightBg: "bg-purple-50", iconColor: "#7C3AED", activeBg: "bg-purple-500" };
    case "sleep":
      return { lightBg: "bg-indigo-50", iconColor: "#4F46E5", activeBg: "bg-indigo-500" };
    case "light":
      return { lightBg: "bg-emerald-50", iconColor: "#059669", activeBg: "bg-emerald-500" };
    case "moderate":
      return { lightBg: "bg-sky-50", iconColor: "#0284C7", activeBg: "bg-sky-500" };
    case "heavy":
      return { lightBg: "bg-amber-50", iconColor: "#D97706", activeBg: "bg-amber-500" };
    case "overwhelming":
      return { lightBg: "bg-rose-50", iconColor: "#E11D48", activeBg: "bg-rose-500" };
    default:
      return { lightBg: "bg-sage-50", iconColor: "#587C51", activeBg: "bg-sage-500" };
  }
}

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
      return CloudBigRainIcon;

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
  const theme = getOptionTheme(option.id);

  return (
    <Animated.View entering={FadeIn.delay(120 + index * 50).duration(200)}>
      {/* ponytail: showDepth=true delivers Duolingo/Ahead tactile 3D physical rim */}
      <Card
        variant={isSelected ? "answer-selected" : "answer"}
        radius="lg"
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityState={{ selected: isSelected }}
        accessibilityLabel={`${option.title}, ${option.subtitle}`}
        className="w-full"
        contentClassName="flex-row items-center gap-4 px-4 py-3.5"
        showDepth={true}
        haptic="medium"
      >
        <View
          className={`h-12 w-12 items-center justify-center rounded-2xl ${
            isSelected ? theme.activeBg : theme.lightBg
          }`}
        >
          <HugeiconsIcon
            icon={getQuizIcon(option.id)}
            size={24}
            color={isSelected ? "#FFFFFF" : theme.iconColor}
          />
        </View>

        <View className="flex-1 pr-1">
          <Text
            className={`happy-font-body-bold text-[16px] leading-tight ${
              isSelected ? "text-sage-800" : "text-ink"
            }`}
          >
            {option.title}
          </Text>
          <Text
            className={`happy-font-body mt-1 text-[13px] leading-snug ${
              isSelected ? "text-sage-600" : "text-ink-soft"
            }`}
          >
            {option.subtitle}
          </Text>
        </View>

        {/* ponytail: Ahead pattern - no dead unselected radios; bouncy confirmation badge on select */}
        {isSelected && (
          <Animated.View
            entering={ZoomIn.duration(160)}
            className="h-7 w-7 items-center justify-center rounded-full bg-sage-500"
          >
            <HugeiconsIcon icon={Tick01Icon} size={16} color="#FFFFFF" />
          </Animated.View>
        )}
      </Card>
    </Animated.View>
  );
}

const OptionCard = React.memo(OptionCardInner) as typeof OptionCardInner;
export default OptionCard;
