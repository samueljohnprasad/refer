import React from "react";
import { Text, View, StyleSheet } from "react-native";
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
  <View style={styles.statCard}>
    <View className="happy-brand-soft-chip h-10 w-10 items-center justify-center mb-3">
      {icon}
    </View>
    <Text style={styles.statValue}>
      {value}
    </Text>
    <Text className="happy-font-body-medium text-[13px] text-ink-muted mt-0.5">
      {label}
    </Text>
  </View>
);

export const XPHistorySummary: React.FC<XPHistorySummaryProps> = React.memo(
  ({ totalXP, todayXP }) => (
    <View className="pb-6 pr-8">
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

const styles = StyleSheet.create({
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
    alignItems: "center",
  },
  statValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#1C1C1E",
    letterSpacing: -0.5,
  },
});
