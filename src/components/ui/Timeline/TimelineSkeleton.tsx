import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Skeleton, SkeletonCard } from "@/src/components/ui/Skeleton";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function TimelineSkeleton() {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: Math.max(0, headerHeight - insets.top + 16) },
      ]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      {[1, 2, 3, 4, 5].map((_, idx) => (
        <View key={idx} style={styles.row}>
          {/* Date Column */}
          <View style={styles.dateColumn}>
            {idx === 0 || idx === 3 ? (
              <Skeleton height={14} width={28} radius={4} />
            ) : null}
          </View>

          {/* Stem Column */}
          <View style={styles.stemColumn}>
            <View style={styles.absoluteDot}>
              <Skeleton height={12} width={12} radius={6} />
            </View>
            <View style={styles.stemLine} />
          </View>

          {/* Card Column */}
          <View style={styles.cardColumn}>
            <View style={styles.cardSkeleton}>
              <View style={styles.headerRow}>
                <View style={styles.headerTextContainer}>
                  <Skeleton height={14} width="55%" radius={4} className="mb-2" />
                  <Skeleton height={12} width="35%" radius={4} />
                </View>
              </View>
              <View style={styles.cardFooterSkeleton}>
                <Skeleton height={24} width={70} radius={12} />
                <Skeleton height={11} width="25%" radius={4} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  dateColumn: {
    width: 44,
    alignItems: "center",
    paddingTop: 14,
  },
  stemColumn: {
    width: 24,
    alignItems: "center",
    position: "relative",
  },
  absoluteDot: {
    position: "absolute",
    top: 14,
    backgroundColor: "transparent",
    zIndex: 1,
  },
  stemLine: {
    width: 2,
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  cardColumn: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 24,
  },
  cardSkeleton: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  cardFooterSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
