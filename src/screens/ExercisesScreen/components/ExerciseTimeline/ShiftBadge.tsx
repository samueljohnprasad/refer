/**
 * ShiftBadge
 *
 * A compact inline pill that shows the before → after rating shift.
 * Example: "Distress  8 → 3"
 *
 * Color semantics:
 *  - Green tint → improvement (distress down, calm up)
 *  - Amber tint → no meaningful change or regression
 *
 * Only renders when both `before` and `after` are provided.
 */

import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import { SAGE } from "@/lib/tokens";

interface ShiftBadgeProps {
  /** Human label like "Distress", "Calm", "Anxiety" */
  readonly label: string;
  /** Rating before the exercise */
  readonly before: number;
  /** Rating after the exercise */
  readonly after: number;
  /** When true, higher after = improvement (e.g. Calm) */
  readonly invertScale?: boolean;
}

function isImprovement(
  before: number,
  after: number,
  invert: boolean,
): boolean {
  return invert ? after > before : after < before;
}

const ShiftBadge: React.FC<ShiftBadgeProps> = React.memo(
  ({ label, before, after, invertScale = false }) => {
    const improved: boolean = isImprovement(before, after, invertScale);

    return (
      <View
        style={[
          styles.pill,
          improved ? styles.pillImproved : styles.pillNeutral,
        ]}
      >
        {/* Arrow icon */}
        {Platform.OS === "ios" ? (
          <SymbolView
            name={
              improved
                ? ("arrow.down.right" as any)
                : ("arrow.right" as any)
            }
            size={9}
            tintColor={improved ? SAGE[600] : "#A67C00"}
            weight="semibold"
            style={styles.icon}
          />
        ) : (
          <Feather
            name={improved ? "trending-down" : "arrow-right"}
            size={9}
            color={improved ? SAGE[600] : "#A67C00"}
          />
        )}

        {/* Label + values */}
        <Text
          style={[
            styles.text,
            improved ? styles.textImproved : styles.textNeutral,
          ]}
        >
          {label} {before} → {after}
        </Text>
      </View>
    );
  },
);

ShiftBadge.displayName = "ShiftBadge";
export { ShiftBadge };

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  pillImproved: {
    backgroundColor: "rgba(95, 127, 88, 0.10)",
  },
  pillNeutral: {
    backgroundColor: "rgba(198, 148, 0, 0.08)",
  },
  icon: {
    width: 10,
    height: 10,
  },
  text: {
    fontFamily: "Nunito-Bold",
    fontSize: 11,
    lineHeight: 14,
  },
  textImproved: {
    color: SAGE[600],
  },
  textNeutral: {
    color: "#A67C00",
  },
});
