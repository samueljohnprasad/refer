import React from "react";
import { Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import Svg, { Circle, Line, Path } from "react-native-svg";
import {
  buildSurgePath,
  FULL_GHOST_PATH,
  getSurgePoint,
} from "./surgeDiagramModel";

interface SurgeDiagramChartProps {
  progress: number;
  phaseTag: string;
  phaseCaption: string;
  tagColor: string;
  tagBackground: string;
  axisLabel: string;
  chartLabel: string;
  sliderLabel: string;
  incrementLabel: string;
  decrementLabel: string;
  onValueChange: (value: number) => void;
}

export function SurgeDiagramChart({
  progress,
  phaseTag,
  phaseCaption,
  tagColor,
  tagBackground,
  axisLabel,
  chartLabel,
  sliderLabel,
  incrementLabel,
  decrementLabel,
  onValueChange,
}: SurgeDiagramChartProps) {
  const marker = getSurgePoint(progress);
  const activePath = buildSurgePath(Math.max(0.01, progress));

  return (
    <View className="mt-3 rounded-[24px] bg-[#FAFAF8] px-5 py-4 border border-[#E2E8DF]">
      <View className="flex-row items-start mb-2 min-h-[42px]">
        <View
          style={{ backgroundColor: tagBackground }}
          className="rounded-full px-2.5 py-0.5 mr-2 mt-0.5"
        >
          <Text
            style={{ color: tagColor }}
            className="text-[11px] font-bold tracking-wider"
          >
            {phaseTag}
          </Text>
        </View>
        <Text className="happy-font-body-medium text-[13.5px] leading-[19px] text-ink flex-1">
          {phaseCaption}
        </Text>
      </View>

      <View className="relative my-1">
        <Svg
          width="100%"
          height={130}
          viewBox="0 0 300 126"
          accessibilityLabel={chartLabel}
        >
          <Line
            x1="18"
            y1="112"
            x2="282"
            y2="112"
            stroke="#E2DDD5"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <Path
            d={FULL_GHOST_PATH}
            fill="none"
            stroke="#E2DDD5"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Path
            d={activePath}
            fill="none"
            stroke="#5F7F58"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <Circle
            cx={marker.x}
            cy={marker.y}
            r={7}
            fill="#5F7F58"
            stroke="#FFFFFF"
            strokeWidth={2.5}
          />
        </Svg>
        <Text className="happy-font-body absolute bottom-0 right-2 text-[11px] text-[#8A8A85]">
          {axisLabel}
        </Text>
      </View>

      <View className="mt-2">
        <Slider
          minimumValue={0}
          maximumValue={1}
          step={0.01}
          value={progress}
          onValueChange={onValueChange}
          tapToSeek
          minimumTrackTintColor="#5F7F58"
          maximumTrackTintColor="#E2DDD5"
          thumbTintColor="#5F7F58"
          hitSlop={{ top: 12, bottom: 12, left: 8, right: 8 }}
          style={{ height: 48, width: "100%" }}
          accessibilityRole="adjustable"
          accessibilityLabel={sliderLabel}
          accessibilityValue={{ text: phaseTag }}
          accessibilityActions={[
            { name: "increment", label: incrementLabel },
            { name: "decrement", label: decrementLabel },
          ]}
          onAccessibilityAction={(event) => {
            if (event.nativeEvent.actionName === "increment")
              onValueChange(Math.min(1, progress + 0.2));
            if (event.nativeEvent.actionName === "decrement")
              onValueChange(Math.max(0, progress - 0.2));
          }}
        />
      </View>
    </View>
  );
}
