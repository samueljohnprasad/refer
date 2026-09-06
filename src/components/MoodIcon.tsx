import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export type MoodKey = "terrible" | "bad" | "okay" | "fine" | "good" | "great";

interface MoodConfig {
  fill: string;
  stroke: string;
}

const MOOD_CONFIG: Record<MoodKey, MoodConfig> = {
  terrible: {
    fill: "#F09282", // Muted terracotta
    stroke: "#D97262",
  },
  bad: {
    fill: "#F2AC79", // Soft peach/apricot
    stroke: "#DC9059",
  },
  okay: {
    fill: "#ECCB77", // Soft warm amber
    stroke: "#D5B054",
  },
  fine: {
    fill: "#ECCB77", // Alias for okay
    stroke: "#D5B054",
  },
  good: {
    fill: "#97BC91", // Calming sage
    stroke: "#7DA876",
  },
  great: {
    fill: "#7ABBB7", // Soft eucalyptus teal
    stroke: "#5FA5A1",
  },
};

const FEATURE_COLOR = "#243226"; // Deep dark-forest neutral

interface MoodIconProps {
  mood: MoodKey;
  size?: number;
}

// ponytail: normalized vector mood icon family with cohesive stroke and optical geometry
export const MoodIcon: React.FC<MoodIconProps> = ({ mood, size = 38 }) => {
  const { fill, stroke } = MOOD_CONFIG[mood];

  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Base Face Circle */}
      <Circle
        cx="20"
        cy="20"
        r="18"
        fill={fill}
        stroke={stroke}
        strokeWidth="1.25"
      />

      {mood === "terrible" && (
        <>
          {/* Eyebrows slanting down */}
          <Path
            d="M 12 12.5 Q 14.5 13.5 16.5 14"
            stroke={FEATURE_COLOR}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Path
            d="M 28 12.5 Q 25.5 13.5 23.5 14"
            stroke={FEATURE_COLOR}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          {/* Sad downturned mouth */}
          <Path
            d="M 14 27.5 Q 20 21.5 26 27.5"
            stroke={FEATURE_COLOR}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Neutral eyes */}
          <Circle cx="14" cy="16.5" r="1.75" fill={FEATURE_COLOR} />
          <Circle cx="26" cy="16.5" r="1.75" fill={FEATURE_COLOR} />
        </>
      )}

      {mood === "bad" && (
        <>
          {/* Gentle downturned pout */}
          <Path
            d="M 14.5 26.5 Q 20 23 25.5 25.5"
            stroke={FEATURE_COLOR}
            strokeWidth="1.9"
            strokeLinecap="round"
          />
          {/* Neutral eyes */}
          <Circle cx="14" cy="16.5" r="1.75" fill={FEATURE_COLOR} />
          <Circle cx="26" cy="16.5" r="1.75" fill={FEATURE_COLOR} />
        </>
      )}

      {(mood === "okay" || mood === "fine") && (
        <>
          {/* Calm horizontal line */}
          <Path
            d="M 14.5 24.5 L 25.5 24.5"
            stroke={FEATURE_COLOR}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Neutral eyes */}
          <Circle cx="14" cy="16.5" r="1.75" fill={FEATURE_COLOR} />
          <Circle cx="26" cy="16.5" r="1.75" fill={FEATURE_COLOR} />
        </>
      )}

      {mood === "good" && (
        <>
          {/* Warm upward smile */}
          <Path
            d="M 13.5 23.5 Q 20 29 26.5 23.5"
            stroke={FEATURE_COLOR}
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Neutral eyes */}
          <Circle cx="14" cy="16.5" r="1.75" fill={FEATURE_COLOR} />
          <Circle cx="26" cy="16.5" r="1.75" fill={FEATURE_COLOR} />
        </>
      )}

      {mood === "great" && (
        <>
          {/* Joyful arched smiling eyes */}
          <Path
            d="M 12 16.5 Q 14.5 13.5 17 16.5"
            stroke={FEATURE_COLOR}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <Path
            d="M 23 16.5 Q 25.5 13.5 28 16.5"
            stroke={FEATURE_COLOR}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Beaming open smile */}
          <Path
            d="M 13.5 22 Q 20 30.5 26.5 22 Z"
            fill={FEATURE_COLOR}
            opacity={0.88}
          />
        </>
      )}
    </Svg>
  );
};
