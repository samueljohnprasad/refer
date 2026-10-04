import React from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

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

function getEnergyDescriptor(value: number, translate: (key: string) => string): { descriptor: string; color: string } {
  if (value >= 4) return { descriptor: translate("insights.energy.vibrant"), color: "#D97706" };
  if (value === 3) return { descriptor: translate("insights.energy.balanced"), color: "#B45309" };
  return { descriptor: translate("insights.energy.resting"), color: "#78350F" };
}

function getStressDescriptor(value: number, translate: (key: string) => string): { descriptor: string; color: string } {
  if (value >= 4) return { descriptor: translate("insights.stress.highLoad"), color: "#B45309" };
  if (value === 3) return { descriptor: translate("insights.stress.moderate"), color: "#92400E" };
  return { descriptor: translate("insights.stress.calm"), color: "#15803D" };
}

function getSleepDescriptor(value: number, translate: (key: string) => string): { descriptor: string; color: string } {
  if (value >= 4) return { descriptor: translate("insights.sleep.restful"), color: "#6D28D9" };
  if (value === 3) return { descriptor: translate("insights.sleep.steady"), color: "#5B21B6" };
  return { descriptor: translate("insights.sleep.light"), color: "#4C1D95" };
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
    const { t } = useTranslation("journal");
    const hasData: boolean =
      energyLevel !== null || stressLevel !== null || sleepQuality !== null;

    if (!hasData) return null;

    const energyInfo = energyLevel !== null ? getEnergyDescriptor(energyLevel, t) : null;
    const stressInfo = stressLevel !== null ? getStressDescriptor(stressLevel, t) : null;
    const sleepInfo = sleepQuality !== null ? getSleepDescriptor(sleepQuality, t) : null;

    return (
      <View className="mb-3">
        <View className="flex-row items-center justify-between mb-3.5">
          <View className="flex-row items-center">
            <Feather name="activity" size={15} color="#5C6B5E" />
            <Text variant="body-bold" className="ml-2 text-[15px] text-ink">
              {t("insights.vitalityBalance")}
            </Text>
          </View>
        </View>

        <View className="flex-row -mx-1">
          {energyLevel !== null && energyInfo && (
            <VitalityItem
              value={energyLevel}
              label={t("insights.energy.label")}
              icon="zap"
              descriptor={energyInfo.descriptor}
              accentColor={energyInfo.color}
            />
          )}
          {stressLevel !== null && stressInfo && (
            <VitalityItem
              value={stressLevel}
              label={t("insights.stress.label")}
              icon="wind"
              descriptor={stressInfo.descriptor}
              accentColor={stressInfo.color}
            />
          )}
          {sleepQuality !== null && sleepInfo && (
            <VitalityItem
              value={sleepQuality}
              label={t("insights.sleep.label")}
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
