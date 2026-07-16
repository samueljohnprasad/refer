import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { LevelProgressBar } from "@/src/components/Level";

interface XPHistorySummaryProps {
  totalXP: number;
  todayXP: number;
}

export const XPHistorySummary: React.FC<XPHistorySummaryProps> = React.memo(
  ({ totalXP, todayXP }) => (
    <View className="pb-6 px-4">
      <View className="mt-1">
        <LevelProgressBar showBadge={true} compact={false} flat={true} />
      </View>
    </View>
  )
);

XPHistorySummary.displayName = "XPHistorySummary";

const styles = StyleSheet.create({});
