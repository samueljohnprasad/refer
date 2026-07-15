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
  readonly before?: number;
  /** Rating after the exercise */
  readonly after?: number;
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
    const hasBoth = before !== undefined && after !== undefined;
    const improved: boolean = hasBoth ? isImprovement(before!, after!, invertScale) : false;

    return (
      <View
        style={[
          styles.pill,
          hasBoth && improved ? styles.pillImproved : styles.pillNeutral,
        ]}
      >
        {/* Arrow icon */}
        {hasBoth && Platform.OS === "ios" ? (
          <SymbolView
            name={
              improved
                ? ("arrow.down.right" as any)
                : ("arrow.right" as any)
            }
            size={9}
            tintColor={improved ? "#4A6B43" : "#636366"}
            weight="semibold"
            style={styles.icon}
          />
        ) : hasBoth ? (
          <Feather
            name={improved ? "trending-down" : "minus"}
            size={10}
            color={improved ? "#4A6B43" : "#636366"}
          />
        ) : null}

        {/* Label + values */}
        <Text
          style={[
            styles.text,
            hasBoth && improved ? styles.textImproved : styles.textNeutral,
          ]}
        >
          {hasBoth ? `${label} ${before} → ${after}` : `${label}: ${before ?? after}`}
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
    paddingVertical: 0,
    borderRadius: 0,
    alignSelf: "flex-start",
  },
  pillImproved: {
    backgroundColor: "transparent",
  },
  pillNeutral: {
    backgroundColor: "transparent",
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
    color: "#4A6B43", // Deeper, more sophisticated sage green
  },
  textNeutral: {
    color: "#636366", // Neutral gray instead of warning yellow
  },
});
