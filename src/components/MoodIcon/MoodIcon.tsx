import React from "react";
import Svg, { Circle, Path, Line } from "react-native-svg";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

export type MoodKey = "terrible" | "bad" | "okay" | "good" | "great";

export interface MoodIconProps {
  mood: MoodKey;
  isSelected?: boolean;
  size?: number;
}

// ponytail: unified vector mood icon family replaces raster emojis
export const MoodIcon: React.FC<MoodIconProps> = ({
  mood,
  isSelected = false,
  size = 38,
}: MoodIconProps): React.JSX.Element => {
  const strokeColor = isSelected
    ? SEMANTIC_COLORS.brand.primary
    : SEMANTIC_COLORS.text.tertiary;

  const fillColor = isSelected
    ? "#E3EBE3"
    : SEMANTIC_COLORS.surface.canvas;

  return (
    <Svg width={size} height={size} viewBox="0 0 38 38">
      {/* Outer circle */}
      <Circle
        cx="19"
        cy="19"
        r="17.5"
        stroke={strokeColor}
        strokeWidth="2"
        fill={fillColor}
      />
      {/* Expressions */}
      {mood === "terrible" && (
        <>
          {/* Brow angles */}
          <Line x1="12" y1="12" x2="16" y2="14" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
          <Line x1="26" y1="12" x2="22" y2="14" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
          {/* Eyes */}
          <Circle cx="14" cy="17" r="1.8" fill={strokeColor} />
          <Circle cx="24" cy="17" r="1.8" fill={strokeColor} />
          {/* Downward frown */}
          <Path d="M 13 27 Q 19 21 25 27" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}
      {mood === "bad" && (
        <>
          <Circle cx="14" cy="16" r="1.8" fill={strokeColor} />
          <Circle cx="24" cy="16" r="1.8" fill={strokeColor} />
          <Path d="M 14 26 Q 19 22 24 25" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}
      {mood === "okay" && (
        <>
          <Circle cx="14" cy="16" r="1.8" fill={strokeColor} />
          <Circle cx="24" cy="16" r="1.8" fill={strokeColor} />
          <Line x1="14" y1="24" x2="24" y2="24" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {mood === "good" && (
        <>
          <Circle cx="14" cy="16" r="1.8" fill={strokeColor} />
          <Circle cx="24" cy="16" r="1.8" fill={strokeColor} />
          <Path d="M 13 23 Q 19 28 25 23" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" fill="none" />
        </>
      )}
      {mood === "great" && (
        <>
          {/* Happy arch eyes */}
          <Path d="M 12 16 Q 14.5 13 17 16" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <Path d="M 21 16 Q 23.5 13 26 16" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" fill="none" />
          {/* Wide open smile */}
          <Path d="M 13 22 Q 19 30 25 22 Z" stroke={strokeColor} strokeWidth="1.8" fill={isSelected ? strokeColor : "none"} />
        </>
      )}
    </Svg>
  );
};
