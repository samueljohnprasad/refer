import React from "react";
import {
  DimensionValue,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Host, ProgressView } from "@expo/ui/swift-ui";
import { progressViewStyle, tint } from "@expo/ui/swift-ui/modifiers";

import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";

interface RewardsOwnedProgressProps {
  ownedCount: number;
  totalCount: number;
}

const getProgressValue = (ownedCount: number, totalCount: number): number => {
  if (totalCount <= 0) return 0;
  return Math.min(Math.max(ownedCount / totalCount, 0), 1);
};

export const RewardsOwnedProgress: React.FC<RewardsOwnedProgressProps> =
  React.memo(({ ownedCount, totalCount }) => {
    const progress = getProgressValue(ownedCount, totalCount);

    if (Platform.OS === "ios") {
      return (
        <Host colorScheme="light" style={styles.nativeHost}>
          <ProgressView
            value={progress}
            modifiers={[progressViewStyle("linear"), tint(SEMANTIC_COLORS.brand.primary)]}
          />
        </Host>
      );
    }

    const fillWidth = `${Math.round(progress * 100)}%` as DimensionValue;

    return (
      <View style={styles.fallbackTrack}>
        <View style={[styles.fallbackFill, { width: fillWidth }]} />
      </View>
    );
  });

RewardsOwnedProgress.displayName = "RewardsOwnedProgress";

const styles = StyleSheet.create({
  fallbackFill: {
    backgroundColor: SEMANTIC_COLORS.brand.primary,
    borderRadius: 999,
    height: "100%",
  },
  fallbackTrack: {
    backgroundColor: SEMANTIC_COLORS.brand.soft,
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
    width: "100%",
  },
  nativeHost: {
    height: 10,
    width: "100%",
  },
});
