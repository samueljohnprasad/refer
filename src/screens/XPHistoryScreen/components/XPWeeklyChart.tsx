import React, { useState, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import type { ChartDayData } from "../utils/chartUtils";

interface XPWeeklyChartProps {
  weeklyData: ChartDayData[][];
  weekLabels: string[];
}

const BAR_MAX_HEIGHT = 80;
const BAR_WIDTH = 22;

const AnimatedBar: React.FC<{
  targetHeight: number;
  color: string;
}> = React.memo(({ targetHeight, color }) => {
  const animHeight = useSharedValue(0);

  useEffect(() => {
    animHeight.value = withTiming(targetHeight, {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    });
  }, [animHeight, targetHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: animHeight.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width: BAR_WIDTH,
          backgroundColor: color,
          borderRadius: 4,
          borderCurve: "continuous",
        },
        animatedStyle,
      ]}
    />
  );
});

AnimatedBar.displayName = "AnimatedBar";

// ponytail: scannable weekly activity chart per audit items 18-33
export const XPWeeklyChart: React.FC<XPWeeklyChartProps> = React.memo(
  ({ weeklyData, weekLabels }) => {
    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

    if (!weeklyData || weeklyData.length === 0) return null;

    const currentWeekIndex = weeklyData.length - 1;
    const currentWeek = weeklyData[currentWeekIndex] || [];
    const currentWeekLabel = weekLabels[currentWeekIndex] || "This Week";

    const maxXP = Math.max(...currentWeek.map((d) => d.totalXP), 50);
    const selectedDay = selectedDayIndex !== null ? currentWeek[selectedDayIndex] : null;

    const handleBarPress = (index: number) => {
      Haptics.selectionAsync();
      setSelectedDayIndex((prev) => (prev === index ? null : index));
    };

    return (
      <View className="px-5 pt-2 pb-2">
        {/* 1. Section Header (outside plot area to prevent overlap) */}
        <Text
          style={{
            fontFamily: APP_FONT_FAMILIES.semiBold,
            color: "#8E8E93",
            fontSize: 11,
            letterSpacing: 0.5,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          This Week
        </Text>
        <View className="flex-row items-baseline justify-between mb-3">
          <Text
            style={{
              fontFamily: APP_FONT_FAMILIES.semiBold,
              color: "#1C1C1E",
              fontSize: 14,
            }}
          >
            Insights earned
          </Text>
          <Text
            style={{
              fontFamily: APP_FONT_FAMILIES.regular,
              color: selectedDay ? "#5F7F58" : "#8E8E93",
              fontSize: 12,
              fontWeight: selectedDay ? "600" : "400",
            }}
          >
            {selectedDay
              ? `${selectedDay.totalXP} Insights (${selectedDay.day})`
              : currentWeekLabel}
          </Text>
        </View>

        {/* 2. Bars on Shared Baseline */}
        <View
          className="flex-row items-end justify-between px-1"
          style={{ height: BAR_MAX_HEIGHT }}
        >
          {currentWeek.map((day, index) => {
            const hasData = day.totalXP > 0;
            const targetHeight = hasData
              ? Math.max(8, Math.round((day.totalXP / maxXP) * (BAR_MAX_HEIGHT - 6)))
              : 3; // subtle flat tick on baseline for zero days
            const isSelected = selectedDayIndex === index;

            let barColor = hasData ? "#5F7F58" : day.isToday ? "#D1D5DB" : "#E5E7EB";
            if (isSelected) {
              barColor = "#2C4627";
            } else if (hasData && day.isToday) {
              barColor = "#4B6745";
            }

            return (
              <Pressable
                key={day.dayIndex}
                onPress={() => handleBarPress(index)}
                hitSlop={{ top: 12, bottom: 12, left: 6, right: 6 }}
                style={{ alignItems: "center", width: 36 }}
              >
                <AnimatedBar targetHeight={targetHeight} color={barColor} />
              </Pressable>
            );
          })}
        </View>

        {/* 3. Subtle Shared Baseline Axis Line */}
        <View className="w-full h-[1px] bg-[#E5E7EB] mt-1" />

        {/* 4. Aligned Day Labels */}
        <View className="flex-row justify-between px-1 mt-1.5">
          {currentWeek.map((day, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <Pressable
                key={day.dayIndex}
                onPress={() => handleBarPress(index)}
                style={{ alignItems: "center", width: 36 }}
              >
                <Text
                  style={{
                    fontFamily: day.isToday || isSelected
                      ? APP_FONT_FAMILIES.bold
                      : APP_FONT_FAMILIES.semiBold,
                    color: isSelected
                      ? "#5F7F58"
                      : day.isToday
                        ? "#1C1C1E"
                        : "#8E8E93",
                    fontSize: 11,
                    textAlign: "center",
                  }}
                >
                  {day.day}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }
);

XPWeeklyChart.displayName = "XPWeeklyChart";
