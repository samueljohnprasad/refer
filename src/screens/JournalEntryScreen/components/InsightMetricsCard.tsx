import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Feather } from "@expo/vector-icons";

interface MetricItemProps {
  value: number;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  descriptor: string;
  accentColor: string;
}

interface InsightMetricsCardProps {
  energyLevel: number | null;
  stressLevel: number | null;
  sleepQuality: number | null;
}

function getEnergyDescriptor(value: number): { descriptor: string; color: string } {
  if (value >= 4) return { descriptor: "Vibrant", color: "#D97706" };
  if (value === 3) return { descriptor: "Balanced", color: "#B45309" };
  return { descriptor: "Resting", color: "#78350F" };
}

function getStressDescriptor(value: number): { descriptor: string; color: string } {
  if (value >= 4) return { descriptor: "High Load", color: "#B45309" };
  if (value === 3) return { descriptor: "Moderate", color: "#92400E" };
  return { descriptor: "Calm", color: "#15803D" };
}

function getSleepDescriptor(value: number): { descriptor: string; color: string } {
  if (value >= 4) return { descriptor: "Restful", color: "#6D28D9" };
  if (value === 3) return { descriptor: "Steady", color: "#5B21B6" };
  return { descriptor: "Light", color: "#4C1D95" };
}

const VitalityItem: React.FC<MetricItemProps> = ({
  value,
  label,
  icon,
  descriptor,
  accentColor,
}) => {
  return (
    <View
      className="flex-1 py-1.5 px-2"
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${descriptor}`}
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Feather name={icon} size={14} color={accentColor} />
          <Text variant="caption" className="ml-1.5 font-medium text-ink-soft">
            {label}
          </Text>
        </View>
      </View>

      <Text variant="body-bold" className="text-[14px] text-ink mb-2">
        {descriptor}
      </Text>

      {/* Subtle 5-pip qualitative spectrum bar */}
      <View className="flex-row gap-1 items-center">
        {[1, 2, 3, 4, 5].map((step) => {
          const isActive = step <= value;
          return (
            <View
              key={step}
              className="flex-1 h-1.5 rounded-full"
              style={{
                backgroundColor: isActive ? accentColor : "rgba(0, 0, 0, 0.08)",
                opacity: isActive ? 0.85 : 1,
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

/**
 * Card displaying qualitative vitality reflections (Energy, Stress, Sleep)
 */
export const InsightMetricsCard: React.FC<InsightMetricsCardProps> = React.memo(
  ({ energyLevel, stressLevel, sleepQuality }) => {
    const hasData: boolean =
      energyLevel !== null || stressLevel !== null || sleepQuality !== null;

    if (!hasData) return null;

    const energyInfo = energyLevel !== null ? getEnergyDescriptor(energyLevel) : null;
    const stressInfo = stressLevel !== null ? getStressDescriptor(stressLevel) : null;
    const sleepInfo = sleepQuality !== null ? getSleepDescriptor(sleepQuality) : null;

    return (
      <View className="mb-3">
        <View className="flex-row items-center justify-between mb-3.5">
          <View className="flex-row items-center">
            <Feather name="activity" size={15} color="#5C6B5E" />
            <Text variant="body-bold" className="ml-2 text-[15px] text-ink">
              Vitality & Balance
            </Text>
          </View>
        </View>

        <View className="flex-row -mx-1">
          {energyLevel !== null && energyInfo && (
            <VitalityItem
              value={energyLevel}
              label="Energy"
              icon="zap"
              descriptor={energyInfo.descriptor}
              accentColor={energyInfo.color}
            />
          )}
          {stressLevel !== null && stressInfo && (
            <VitalityItem
              value={stressLevel}
              label="Stress"
              icon="wind"
              descriptor={stressInfo.descriptor}
              accentColor={stressInfo.color}
            />
          )}
          {sleepQuality !== null && sleepInfo && (
            <VitalityItem
              value={sleepQuality}
              label="Sleep"
              icon="moon"
              descriptor={sleepInfo.descriptor}
              accentColor={sleepInfo.color}
            />
          )}
        </View>
      </View>
    );
  }
);

InsightMetricsCard.displayName = "InsightMetricsCard";
