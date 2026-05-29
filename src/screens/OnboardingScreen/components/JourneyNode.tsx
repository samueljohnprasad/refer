import React from "react";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { JourneyMapNode } from "../types";
import { HugeiconsIcon } from "@hugeicons/react-native";
import {
  SmileIcon,
  Brain01Icon,
  WellnessIcon,
  Notebook01Icon,
  Yoga01Icon,
  AiBrain01Icon,
  Compass01Icon,
} from "@hugeicons/core-free-icons";

export function getJourneyNodeIcon(id: string) {
  switch (id) {
    case "1":
      return SmileIcon;
    case "2":
      return Brain01Icon;
    case "3":
      return WellnessIcon;
    case "4":
      return Notebook01Icon;
    case "5":
      return Yoga01Icon;
    case "6":
      return AiBrain01Icon;
    case "7":
      return Compass01Icon;
    default:
      return Brain01Icon;
  }
}

interface JourneyNodeProps {
  node: JourneyMapNode;
  isLast: boolean;
  index: number;
}

const JourneyNode: React.FC<JourneyNodeProps> = ({ node, isLast, index }) => {
  const circleStyle =
    node.status === "completed"
      ? "bg-sage-500 border-4 border-cream"
      : node.status === "current"
        ? "bg-gold border-4 border-cream"
        : "bg-sage-100 border-4 border-cream";

  return (
    <Animated.View
      entering={FadeIn.delay(120 + index * 60).duration(180)}
      className="relative mb-4 flex-row items-center gap-3.5"
    >
      <View className="items-center justify-center">
        {node.status === "current" && (
          <View
            style={{
              position: "absolute",
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: "#D4A943",
              opacity: 0.18,
            }}
          />
        )}
        <View
          className={`h-16 w-16 items-center justify-center rounded-full ${circleStyle}`}
        >
          <HugeiconsIcon
            icon={getJourneyNodeIcon(node.id)}
            size={26}
            color={
              node.status === "completed"
                ? "#FFFFFF"
                : node.status === "current"
                  ? "#FFFFFF"
                  : "#5F7F58"
            }
          />
        </View>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-ink">{node.label}</Text>
        <Text className="text-xs text-ink-muted">{node.subtitle}</Text>
      </View>
      {!isLast && (
        <View
          className="absolute bottom-0 left-[30px] top-[60px] z-[-1] w-1 rounded bg-sage-200"
        />
      )}
    </Animated.View>
  );
};

export default React.memo(JourneyNode);
