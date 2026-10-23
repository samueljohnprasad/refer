// ponytail: Duolingo-style speech bubble with seamless SVG pointer tail & reframe flip
import React from "react";
import { View, Text } from "react-native";
import Svg, { Path } from "react-native-svg";
import { SymbolView } from "expo-symbols";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SAGE } from "@/src/theme/palette";

interface SpeechBubbleCardProps {
  hasSelected: boolean;
  thought: string;
  reframe: string;
}

export const SpeechBubbleCard: React.FC<SpeechBubbleCardProps> = ({
  hasSelected,
  thought,
  reframe,
}) => {
  return (
    <View
      style={{ borderCurve: "continuous" }}
      className={`flex-1 relative rounded-2xl border-2 ${
        hasSelected
          ? "border-sage-500 bg-sage-50/95"
          : "border-stone-200 bg-white"
      } p-4`}
    >
      {/* SVG Tail seamlessly pointing to Happi's face */}
      <Svg
        width={13}
        height={18}
        viewBox="0 0 13 18"
        style={{
          position: "absolute",
          left: -12,
          top: "50%",
          marginTop: -9,
        }}
      >
        <Path
          d="M13 0 L0 9 L13 18 Z"
          fill={hasSelected ? "#f8fbf6" : "#ffffff"}
        />
        <Path
          d="M13 0 L0 9 L13 18"
          fill="none"
          stroke={hasSelected ? SAGE[500] : "#e2e8f0"}
          strokeWidth={2}
        />
        <Path
          d="M13 1 L13 17"
          stroke={hasSelected ? "#f8fbf6" : "#ffffff"}
          strokeWidth={3}
        />
      </Svg>

      <Text
        style={{
          fontFamily: APP_FONT_FAMILIES.bold,
          color: hasSelected ? SAGE[800] : SAGE[600],
        }}
        className="text-[11px] uppercase tracking-wider mb-1"
      >
        {hasSelected ? "Grounded perspective" : "Racing thought"}
      </Text>

      <Text
        style={{ fontFamily: APP_FONT_FAMILIES.bold }}
        className={`text-[15px] leading-snug ${
          hasSelected ? "text-sage-950" : "text-ink"
        }`}
      >
        "{hasSelected ? reframe : thought}"
      </Text>

      {hasSelected && (
        <View className="flex-row items-center gap-1.5 self-start mt-2 px-2.5 py-0.5 rounded-full bg-bee-yellow-tint border border-amber-300">
          <SymbolView name="sparkles" size={11} tintColor="#5d4037" weight="bold" />
          <Text
            style={{ fontFamily: APP_FONT_FAMILIES.bold }}
            className="text-[11px] font-bold text-bee-dark"
          >
            +10 XP · First thought caught
          </Text>
        </View>
      )}
    </View>
  );
};
