import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import Svg, { Circle } from "react-native-svg";

interface MetricItemProps {
  value: number;
  maxValue: number;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  bgColor: string;
}

interface InsightMetricsCardProps {
  energyLevel: number | null;
  stressLevel: number | null;
  sleepQuality: number | null;
}

/**
 * Circular progress indicator for a single metric
 */
const CircularProgress: React.FC<{
  value: number;
  maxValue: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}> = ({ value, maxValue, color, size = 56, strokeWidth = 5 }) => {
  const radius: number = (size - strokeWidth) / 2;
  const circumference: number = 2 * Math.PI * radius;
  const progress: number = Math.min(value / maxValue, 1);
  const strokeDashoffset: number = circumference * (1 - progress);

  return (
    <View 
      className="items-center justify-center"
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={`Score: ${value} out of ${maxValue}`}
    >
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(0,0,0,0.05)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View className="absolute items-center justify-center">
        <Text className="text-sm font-bold text-theme-text-primary">
          {value}/{maxValue}
        </Text>
      </View>
    </View>
  );
};

/**
 * Single metric item with icon, progress, and label
 */
const MetricItem: React.FC<MetricItemProps> = ({
  value,
  maxValue,
  label,
  icon,
  color,
}) => {
  return (
    <View className="items-center flex-1">
      <View
        className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
        style={{ backgroundColor: "transparent" }}
      >
        <CircularProgress value={value} maxValue={maxValue} color={color} />
      </View>
      <View className="flex-row items-center">
        <Feather name={icon} size={14} color={color} />
        <Text className="text-xs text-theme-text-secondary ml-1 font-medium">
          {label}
        </Text>
      </View>
    </View>
  );
};

/**
 * Card displaying energy, stress, and sleep metrics
 */
export const InsightMetricsCard: React.FC<InsightMetricsCardProps> = React.memo(
  ({ energyLevel, stressLevel, sleepQuality }) => {
    const hasData: boolean =
      energyLevel !== null || stressLevel !== null || sleepQuality !== null;

    if (!hasData) return null;

    return (
      <View className="bg-transparent rounded-xl p-4 mb-4 border border-theme-border/30">
        <View className="flex-row items-center mb-4">
          <Feather name="activity" size={16} className="text-theme-text-secondary" />
          <Text className="text-base font-semibold text-theme-text-primary ml-2">
            Wellness Metrics
          </Text>
        </View>

        <View className="flex-row justify-around">
          {energyLevel !== null && (
            <MetricItem
              value={energyLevel}
              maxValue={5}
              label="Energy"
              icon="zap"
              color="#F59E0B"
              bgColor="transparent"
            />
          )}
          {stressLevel !== null && (
            <MetricItem
              value={stressLevel}
              maxValue={5}
              label="Stress"
              icon="wind"
              color="#EF4444"
              bgColor="transparent"
            />
          )}
          {sleepQuality !== null && (
            <MetricItem
              value={sleepQuality}
              maxValue={5}
              label="Sleep"
              icon="moon"
              color="#8B5CF6"
              bgColor="transparent"
            />
          )}
        </View>
      </View>
    );
  }
);

InsightMetricsCard.displayName = "InsightMetricsCard";
