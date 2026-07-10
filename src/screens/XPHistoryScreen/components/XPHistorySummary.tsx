import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Calendar03Icon, StarsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

import { GOLD, SAGE } from "@/lib/tokens";
import { LevelProgressBar } from "@/src/components/Level";

interface XPHistorySummaryProps {
  totalXP: number;
  todayXP: number;
}

interface XPMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  isZeroState?: boolean;
}

const XPMetricCard: React.FC<XPMetricCardProps> = ({ icon, label, value, isZeroState }) => (
  <View className="flex-1 py-2">
    <View className="mb-2 flex-row items-center gap-2">
      <View className="bg-sage-50 h-8 w-8 rounded-full items-center justify-center">
        {icon}
      </View>
      <Text className="happy-font-body-medium text-[14px] text-gray-800">
        {label}
      </Text>
    </View>
    <Text className={`happy-font-body-bold text-[32px] ${isZeroState ? 'text-ink-muted' : 'text-ink'}`}>
      {isZeroState ? "-" : value}
    </Text>
    {isZeroState && (
      <Text className="happy-font-body-medium text-[11px] text-ink-muted mt-1 leading-tight">
        Ready for a reflection?
      </Text>
    )}
  </View>
);

export const XPHistorySummary: React.FC<XPHistorySummaryProps> = React.memo(
  ({ totalXP, todayXP }) => (
    <View className="pb-6 px-4">
      <View className="mt-1">
        <LevelProgressBar showBadge={true} compact={false} />
      </View>

      <View className="mt-6 flex-row gap-4 px-2 border-b border-sage-100 pb-6">
        <XPMetricCard
          icon={<HugeiconsIcon icon={StarsIcon} size={16} color={GOLD} />}
          label="Total Insights"
          value={totalXP.toLocaleString()}
        />
        <XPMetricCard
          icon={
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={16}
              color={SAGE[500]}
            />
          }
          label="Today"
          value={`+${todayXP}`}
          isZeroState={todayXP === 0}
        />
      </View>

      <Text className="happy-font-heading-bold text-[22px] text-ink mt-8 ml-2">Recent Insights</Text>
    </View>
  )
);

XPHistorySummary.displayName = "XPHistorySummary";

const styles = StyleSheet.create({});
