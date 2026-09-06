import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import React, { useMemo } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Animated, {
  useAnimatedRef,
  useDerivedValue,
  useScrollViewOffset,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from "react-native-reanimated";
import type { ChartDayData } from "../utils/chartUtils";

type WeekData = ChartDayData[];

interface BarProps {
  maxHeight: number;
  minHeight: number;
  width: number;
  progress: SharedValue<number>;
  isToday?: boolean;
}

const Bar: React.FC<BarProps> = React.memo(
  ({ maxHeight, minHeight, width, progress, isToday }) => {
    const animatedProgress = useDerivedValue(
      () => withTiming(progress.value, { duration: 500 }),
      [progress],
    );

    const rAnimatedStyle = useAnimatedStyle(() => {
      const height = interpolate(
        animatedProgress.value,
        [0, 1],
        [minHeight, maxHeight],
      );

      // Brand palette: soft gray placeholders when empty, forest green when active
      const startColor = isToday ? "#D1D5DB" : "#E5E7EB";
      const endColor = isToday ? "#4B6745" : "#5F7F58";

      const backgroundColor = interpolateColor(
        animatedProgress.value,
        [0, 1],
        [startColor, endColor],
      );

      return { height, backgroundColor };
    }, [isToday, maxHeight, minHeight]);

    return (
      <View style={styles.barWrapper}>
        <Animated.View
          style={[
            {
              width,
              borderRadius: 10,
              borderCurve: "continuous",
            },
            rAnimatedStyle,
          ]}
        />
      </View>
    );
  },
);

Bar.displayName = "Bar";

const AnimatedWeeklyBar: React.FC<{
  data: SharedValue<WeekData>;
  width: number;
  height: number;
  index: number;
  internalPaddingHorizontal: number;
  gap: number;
}> = React.memo(
  ({ data, width, height, index, internalPaddingHorizontal, gap }) => {
    const barWidth =
      (width - internalPaddingHorizontal * 2 - gap * 6) / 7;
    const progress = useDerivedValue(
      () => data.value[index]?.value || 0,
      [data, index],
    );
    const isToday = useMemo(
      () => data.value[index]?.isToday || false,
      [data, index],
    );

    return (
      <Bar
        key={index}
        maxHeight={height}
        minHeight={24}
        width={barWidth}
        progress={progress}
        isToday={isToday}
      />
    );
  },
);

AnimatedWeeklyBar.displayName = "AnimatedWeeklyBar";

const WeeklyChart: React.FC<{
  width: number;
  height: number;
  data: SharedValue<WeekData>;
}> = ({ width, height, data }) => {
  const internalPaddingHorizontal = 32;
  const gap = 12;
  const initialData = useMemo(() => data.value || [], [data]);
  const barWidth =
    (width - internalPaddingHorizontal * 2 - gap * 6) / 7;

  return (
    <View style={{ width, alignItems: "center" }}>
      {/* Bars Plot Area */}
      <View
        style={{
          width,
          height,
          paddingHorizontal: internalPaddingHorizontal,
          gap,
          flexDirection: "row",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {initialData.map((_, index) => (
          <AnimatedWeeklyBar
            key={index}
            data={data}
            width={width}
            height={height}
            index={index}
            internalPaddingHorizontal={internalPaddingHorizontal}
            gap={gap}
          />
        ))}
      </View>

      {/* Day Labels Row */}
      <View
        style={{
          width,
          paddingHorizontal: internalPaddingHorizontal,
          gap,
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 8,
        }}
      >
        {initialData.map((_, index) => {
          const letter = initialData[index]?.day || "";
          const isToday = initialData[index]?.isToday || false;
          return (
            <View
              key={index}
              style={{ width: barWidth, alignItems: "center" }}
            >
              <Text style={[styles.label, isToday && styles.todayLabel]}>
                {letter}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export const XPWeeklyChart: React.FC<{
  weeklyData: ChartDayData[][];
  weekLabels: string[];
}> = ({ weeklyData, weekLabels }) => {
  const { width: windowWidth } = useWindowDimensions();
  const animatedRef = useAnimatedRef<any>();
  const scrollOffset = useScrollViewOffset(animatedRef);

  const activeIndex = useDerivedValue(() => {
    return Math.max(
      0,
      Math.min(
        weeklyData.length - 1,
        Math.floor((scrollOffset.value + windowWidth / 2) / windowWidth),
      ),
    );
  }, [scrollOffset, weeklyData.length]);

  const animatedData = useDerivedValue(() => {
    return weeklyData[activeIndex.value] || [];
  }, [activeIndex, weeklyData]);

  if (!weeklyData || weeklyData.length === 0) return null;

  return (
    <View style={styles.container}>
      {/* Paging Header: Metric & Week Label */}
      <View style={{ height: 42, width: windowWidth, zIndex: 1 }}>
        <Animated.FlatList
          ref={animatedRef}
          horizontal
          pagingEnabled
          snapToInterval={windowWidth}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          decelerationRate="fast"
          data={weeklyData}
          keyExtractor={(_, index) => index.toString()}
          initialScrollIndex={
            weeklyData.length > 0 ? weeklyData.length - 1 : 0
          }
          getItemLayout={(_, index) => ({
            length: windowWidth,
            offset: windowWidth * index,
            index,
          })}
          renderItem={({ index }) => (
            <View style={[{ width: windowWidth }, styles.labelContainer]}>
              <View>
                <Text style={styles.sectionTitle}>This Week</Text>
                <Text style={styles.metricTitle}>Insights earned</Text>
              </View>
              <Text style={styles.weekLabel}>{weekLabels[index]}</Text>
            </View>
          )}
        />
      </View>

      {/* Chunky Squircle Bar Chart */}
      <View style={{ marginTop: 16 }}>
        <WeeklyChart width={windowWidth} height={100} data={animatedData} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    alignItems: "center",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 32,
  },
  sectionTitle: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    color: "#8E8E93",
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
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
  barWrapper: {
    alignItems: "center",
  },
  label: {
    color: "#8E8E93",
    textAlign: "center",
    marginTop: 8,
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 12,
  },
  todayLabel: {
    color: "#1C1C1E",
    fontFamily: APP_FONT_FAMILIES.bold,
  },
});

