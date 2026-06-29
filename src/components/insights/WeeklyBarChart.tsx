import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { Text } from "react-native";
import type { DailyPracticeData } from "@/src/hooks/insights/useWeeklyCBTSummary";

interface WeeklyBarChartProps {
  data: DailyPracticeData[];
  averageScore: number;
  height?: number;
}

const Bar = ({ 
  item, 
  maxScore, 
  index, 
  chartHeight 
}: { 
  item: DailyPracticeData; 
  maxScore: number; 
  index: number;
  chartHeight: number;
}) => {
  const animatedHeight = useSharedValue(0);
  
  // Prevent division by zero
  const safeMax = Math.max(maxScore, 10);
  // Ensure the min height is 6 to show the nub even for 0
  const targetHeight = Math.max((item.score / safeMax) * chartHeight, 6);

  useEffect(() => {
    animatedHeight.value = withDelay(
      index * 100, // Staggered entrance
      withTiming(targetHeight, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, [targetHeight, index]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: animatedHeight.value,
    };
  });

  // Use vibrant SAGE for highlighted days, pale SAGE for others
  const barColor = item.isHighlighted ? "#22C55E" : "#E2E8F0";

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      <Animated.View
        style={[
          {
            width: 16,
            backgroundColor: barColor,
            borderRadius: 8,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
};

export function WeeklyBarChart({ data, averageScore, height = 120 }: WeeklyBarChartProps) {
  // Find the absolute maximum to scale the bars correctly
  const maxScore = Math.max(...data.map(d => d.score), averageScore, 5);
  
  // Calculate where the target line should be vertically (percentage from top)
  const targetTopPct = 100 - ((averageScore / maxScore) * 100);

  return (
    <View style={{ height, width: "100%", position: "relative" }}>
      {/* Target/Average Line Overlay */}
      {averageScore > 0 && (
        <View 
          style={{ 
            position: "absolute", 
            top: `${targetTopPct}%`, 
            left: 0, 
            right: 0, 
            height: 2, 
            backgroundColor: "#22C55E", // Vibrant Sage
            zIndex: 10,
            opacity: 0.8
          }} 
        />
      )}

      {/* Bars Container */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between" }}>
        {data.map((item, index) => (
          <Bar 
            key={item.date} 
            item={item} 
            maxScore={maxScore} 
            index={index} 
            chartHeight={height} 
          />
        ))}
      </View>
    </View>
  );
}
