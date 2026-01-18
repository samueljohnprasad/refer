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
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB"
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
        <Text className="text-sm font-bold text-gray-800 dark:text-gray-100">
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
  bgColor,
}) => {
  return (
    <View className="items-center flex-1">
      <View
        className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
        style={{ backgroundColor: bgColor }}
      >
        <CircularProgress value={value} maxValue={maxValue} color={color} />
      </View>
      <View className="flex-row items-center">
        <Feather name={icon} size={14} color={color} />
        <Text className="text-xs text-gray-600 dark:text-gray-400 ml-1 font-medium">
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
      <View className="bg-white dark:bg-gray-800 rounded-2xl p-4 mb-4 border border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center mb-4">
          <Feather name="activity" size={18} color="#6366F1" />
          <Text className="text-base font-semibold text-gray-800 dark:text-gray-100 ml-2">
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
              bgColor="#FEF3C7"
            />
          )}
          {stressLevel !== null && (
            <MetricItem
              value={stressLevel}
              maxValue={5}
              label="Stress"
              icon="wind"
              color="#EF4444"
              bgColor="#FEE2E2"
            />
          )}
          {sleepQuality !== null && (
            <MetricItem
              value={sleepQuality}
              maxValue={5}
              label="Sleep"
              icon="moon"
              color="#8B5CF6"
              bgColor="#EDE9FE"
            />
          )}
        </View>
      </View>
    );
  }
);

InsightMetricsCard.displayName = "InsightMetricsCard";
