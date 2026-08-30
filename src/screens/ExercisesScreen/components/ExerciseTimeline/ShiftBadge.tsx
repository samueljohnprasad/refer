import { APP_FONT_FAMILIES } from "@/src/theme/typography";
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
import { SAGE, INK_SOFT } from "@/lib/tokens";

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

    const accessibleText = hasBoth
      ? `${label} shifted from ${before} to ${after}`
      : `${label}: ${before ?? after}`;

    return (
      <View
        style={[
          styles.pill,
          hasBoth && improved ? styles.pillImproved : styles.pillNeutral,
        ]}
        accessibilityRole="text"
        accessibilityLabel={accessibleText}
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
            tintColor={improved ? SAGE[700] : INK_SOFT}
            weight="semibold"
            style={styles.icon}
          />
        ) : hasBoth ? (
          <Feather
            name={improved ? "trending-down" : "minus"}
            size={10}
            color={improved ? SAGE[700] : INK_SOFT}
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
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 11,
    lineHeight: 14,
  },
  textImproved: {
    color: SAGE[700],
  },
  textNeutral: {
    color: INK_SOFT,
  },
});
