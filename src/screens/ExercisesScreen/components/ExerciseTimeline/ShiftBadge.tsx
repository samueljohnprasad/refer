/**
 * ShiftBadge
 *
 * ponytail: before/after on one 0-10 track, matching .agents/exercises.html's `.mv` move-track.
 * Track geometry lives once in MoveTrack (shared with TimelineEntryCard's collapsed-row use) —
 * this component just adds the footer-row label text.
 *
 * Only renders when both `before` and `after` are provided.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MoveTrack } from "@/src/domains/exercises/ui/presentation/components/MoveTrack";
import { moveTone } from "@/src/domains/exercises/domain/timelineEntry";
import { APP_FONT_FAMILIES } from "@/src/theme/typography";
import { SEMANTIC_COLORS } from "@/src/theme/colors";

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

const ShiftBadge: React.FC<ShiftBadgeProps> = React.memo(
  ({ label, before, after }) => {
    const hasBoth = before !== undefined && after !== undefined;
    if (!hasBoth) {
      return (
        <Text style={styles.text}>{`${label}: ${before ?? after}`}</Text>
      );
    }

    const direction = after! < before! ? "down" : after! > before! ? "up" : "nowhere";
    const accessibleText = `${label} went ${direction}, ${before} to ${after}`;

    return (
      <View style={styles.row} accessibilityRole="text" accessibilityLabel={accessibleText}>
        <MoveTrack before={before!} after={after!} tone={moveTone(label, before!, after!)} />
        <Text style={styles.text}>{`${label} ${before} → ${after}`}</Text>
      </View>
    );
  },
);

ShiftBadge.displayName = "ShiftBadge";
export { ShiftBadge };

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  text: {
    fontFamily: APP_FONT_FAMILIES.semiBold,
    fontSize: 11,
    lineHeight: 14,
    color: SEMANTIC_COLORS.text.secondary,
  },
});
