import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, useWindowDimensions, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import type { ChartDayData } from "../utils/chartUtils";

interface XPWeeklyChartProps {
  weeklyData: ChartDayData[][];
  weekLabels: string[];
}

// ponytail: max bar height around 64-72pt per audit item 8
const BAR_MAX_HEIGHT = 68;
const BAR_WIDTH = 20;

interface BarProps {
  targetHeight: number;
  color: string;
  borderRadius: number;
}

// ponytail: smooth entrance transition on chart mount per audit item 11
const AnimatedBar: React.FC<BarProps> = React.memo(
  ({ targetHeight, color, borderRadius }) => {
    const animHeight = useSharedValue(0);

    useEffect(() => {
      animHeight.value = withTiming(targetHeight, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      });
    }, [animHeight, targetHeight]);

    const rAnimatedStyle = useAnimatedStyle(() => ({
      height: animHeight.value,
    }));

    return (
      <Animated.View
        style={[
          {
            width: BAR_WIDTH,
            backgroundColor: color,
            borderRadius,
            borderCurve: "continuous",
          },
          rAnimatedStyle,
        ]}
      />
    );
  },
);

AnimatedBar.displayName = "AnimatedBar";

// ponytail: proportional data visualization with true zero states per audit items 13-25
export const XPWeeklyChart: React.FC<XPWeeklyChartProps> = React.memo(
  ({ weeklyData, weekLabels }) => {
    const { width: windowWidth } = useWindowDimensions();
    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

    if (!weeklyData || weeklyData.length === 0) return null;

    const currentWeekIndex = weeklyData.length - 1;
    const currentWeek = weeklyData[currentWeekIndex] || [];
    const currentWeekLabel = weekLabels[currentWeekIndex] || "This Week";

    const maxXP = Math.max(...currentWeek.map((d) => d.totalXP), 50);
    const selectedDay =
      selectedDayIndex !== null ? currentWeek[selectedDayIndex] : null;

    const handleBarPress = (index: number) => {
      Haptics.selectionAsync();
      setSelectedDayIndex((prev) => (prev === index ? null : index));
    };

    const internalPaddingHorizontal = 32;
    const gap = 12;
    const columnWidth =
      (windowWidth - internalPaddingHorizontal * 2 - gap * 6) / 7;

    return (
      <View style={styles.container}>
        {/* 1. Header: Eyebrow + Baseline-aligned Title & Date */}
        <View style={[styles.headerContainer, { width: windowWidth }]}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.headerRow}>
            <Text style={styles.metricTitle}>Insights earned</Text>
            <Text
              style={[
                styles.weekLabel,
                selectedDay !== null && styles.weekLabelActive,
              ]}
            >
              {selectedDay
                ? `${selectedDay.totalXP} Insights (${selectedDay.day})`
                : currentWeekLabel}
            </Text>
          </View>
        </View>

        {/* 2. Proportional Bars on Shared Baseline */}
        <View style={{ width: windowWidth, alignItems: "center", marginTop: 12 }}>
          <View
            style={{
              width: windowWidth,
              height: BAR_MAX_HEIGHT,
              paddingHorizontal: internalPaddingHorizontal,
              gap,
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            {currentWeek.map((day, index) => {
              const hasData = day.totalXP > 0;
              const isSelected = selectedDayIndex === index;

              // Proportional height for earned, 3px nub for past zero, 2px for future
              let targetHeight = 3;
              let borderRadius = 2;
              let barColor = day.isToday ? "#D1D5DB" : "#E5E7EB";

              if (hasData) {
                targetHeight = Math.max(
                  8,
                  Math.round((day.totalXP / maxXP) * (BAR_MAX_HEIGHT - 4)),
                );
                borderRadius = 6;
                barColor = isSelected
                  ? "#2C4627"
                  : day.isToday
                    ? "#4B6745"
                    : "#5F7F58";
              } else if (day.isFuture) {
                targetHeight = 2;
                borderRadius = 1;
                barColor = "#F0F0F2";
              } else if (isSelected) {
                barColor = "#5F7F58";
              }

              return (
                <Pressable
                  key={day.dayIndex}
                  onPress={() => handleBarPress(index)}
                  accessibilityRole="button"
                  accessibilityLabel={`${day.fullDayName}, ${day.totalXP} Insights earned`}
                  hitSlop={{ top: 12, bottom: 12, left: 6, right: 6 }}
                  style={{
                    width: columnWidth,
                    alignItems: "center",
                  }}
                >
                  <AnimatedBar
                    targetHeight={targetHeight}
                    color={barColor}
                    borderRadius={borderRadius}
                  />
                </Pressable>
              );
            })}
          </View>

          {/* 3. Shared Baseline Axis Line */}
          <View
            style={{
              width: windowWidth - internalPaddingHorizontal * 2,
              height: 1,
              backgroundColor: "#E5E7EB",
              marginTop: 2,
            }}
          />

          {/* 4. High-Contrast Day Labels */}
          <View
            style={{
              width: windowWidth,
              paddingHorizontal: internalPaddingHorizontal,
              gap,
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 6,
            }}
          >
            {currentWeek.map((day, index) => {
              const isSelected = selectedDayIndex === index;
              return (
                <Pressable
                  key={day.dayIndex}
                  onPress={() => handleBarPress(index)}
                  style={{ width: columnWidth, alignItems: "center" }}
                >
                  <Text
                    style={[
                      styles.label,
                      day.isToday && styles.todayLabel,
                      isSelected && styles.selectedLabel,
                    ]}
                  >
                    {day.day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    );
  },
);

XPWeeklyChart.displayName = "XPWeeklyChart";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 8,
    paddingTop: 4,
    paddingBottom: 4,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  headerContainer: {
    paddingHorizontal: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    color: "#8E8E93",
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  metricTitle: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    color: "#1C1C1E",
    fontSize: 14,
  },
  weekLabel: {
    color: "#8E8E93",
    fontFamily: APP_FONT_FAMILIES.regular,
    fontSize: 12,
  },
  weekLabelActive: {
    color: "#5F7F58",
    fontFamily: APP_FONT_FAMILIES.semiBold,
  },
  label: {
    color: "#636366", // High-contrast Apple Secondary Label
    textAlign: "center",
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 12,
  },
  todayLabel: {
    color: "#1C1C1E",
    fontFamily: APP_FONT_FAMILIES.bold,
  },
  selectedLabel: {
    color: "#5F7F58",
    fontFamily: APP_FONT_FAMILIES.bold,
  },
});


