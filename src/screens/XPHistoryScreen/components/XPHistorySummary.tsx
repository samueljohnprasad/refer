import React from "react";
import { Text, View } from "react-native";
import { Calendar03Icon, StarsIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react-native";

import { GOLD, TERRACOTTA } from "@/lib/tokens";
import { LevelProgressBar } from "@/src/components/Level";

interface XPHistorySummaryProps {
  totalXP: number;
  todayXP: number;
}

interface XPMetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const XPMetricCard: React.FC<XPMetricCardProps> = ({ icon, label, value }) => (
  <View className="happy-brand-card flex-1 rounded-[24px] p-4">
    <View className="happy-brand-soft-chip h-10 w-10 items-center justify-center">
      {icon}
    </View>
    <View className="mt-3">
      <Text className="happy-font-heading-bold text-[32px] leading-tight text-ink">
        {value}
      </Text>
      <Text className="happy-font-body-medium text-sm text-ink-muted">
        {label}
      </Text>
    </View>
  </View>
);

export const XPHistorySummary: React.FC<XPHistorySummaryProps> = React.memo(
  ({ totalXP, todayXP }) => (
    <View className="px-4 pb-6">
      <View className="mt-1">
        <LevelProgressBar showBadge={true} compact={false} />
      </View>

      <View className="mt-4 flex-row gap-3">
        <XPMetricCard
          icon={<HugeiconsIcon icon={StarsIcon} size={24} color={GOLD} />}
          label="Total XP"
          value={totalXP.toLocaleString()}
        />
        <XPMetricCard
          icon={
            <HugeiconsIcon
              icon={Calendar03Icon}
              size={22}
              color={TERRACOTTA}
            />
          }
          label="Today"
          value={`+${todayXP}`}
        />
      </View>

      <Text className="happy-brand-eyebrow mt-8">Recent XP</Text>
    </View>
  )
);

XPHistorySummary.displayName = "XPHistorySummary";
