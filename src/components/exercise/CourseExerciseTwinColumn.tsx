import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";

export interface TwinCasePair {
  id: string;
  left: string;
  right: string;
}

interface CourseExerciseTwinColumnProps {
  title: string;
  pairs: TwinCasePair[];
  side: "left" | "right";
  matchedPairIds: string[];
  selectedLeftId: string | null;
  disabled: boolean;
  showCorrectness?: boolean;
  correctIds?: string[];
  disabledIds?: string[];
  pairIdentifiers?: Record<string, string>;
  onSelect: (pairId: string) => void;
}

export function CourseExerciseTwinColumn({
  title,
  pairs,
  side,
  matchedPairIds,
  selectedLeftId,
  disabled,
  onSelect,
  showCorrectness,
  correctIds = [],
  disabledIds = [],
  pairIdentifiers = {},
}: CourseExerciseTwinColumnProps) {
  return (
    <View style={styles.column}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>{title}</Text>
      </View>
      {pairs.map((pair) => {
        const isMatched = matchedPairIds.includes(pair.id);
        const isSelected = side === "left" && selectedLeftId === pair.id;
        const isPermanentlyLocked = disabledIds.includes(pair.id);
        const effectiveDisabled = disabled || isPermanentlyLocked;
        const badge = pairIdentifiers[pair.id];
        const isCorrectPair = showCorrectness && isMatched && correctIds.includes(pair.id);
        const isWrongPair = showCorrectness && isMatched && !correctIds.includes(pair.id);
        return (
          <View key={pair.id} style={styles.container}>
            <View
              style={[
                styles.rim,
                isSelected && styles.selectedRim,
                isMatched && styles.matchedRim,
                isCorrectPair && styles.correctRim,
                isWrongPair && styles.wrongRim,
              ]}
            />
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected, disabled: effectiveDisabled }}
              accessibilityLabel={[
                badge === "✓" ? "Verified correct:" : badge === "!" ? "Incorrect match:" : badge ? `Paired as pair ${badge}:` : "Unpaired:",
                side === "left" ? pair.left : pair.right,
              ].join(" ")}
              disabled={effectiveDisabled}
              onPress={() => onSelect(pair.id)}
              style={({ pressed }) => [
                styles.pair,
                isSelected && styles.selected,
                isMatched && styles.matched,
                effectiveDisabled && !isMatched && styles.disabled,
                pressed && !effectiveDisabled && styles.pressed,
                isCorrectPair && styles.correct,
                isWrongPair && styles.wrong,
              ]}
            >
              <Text style={styles.pairLabel}>
                {badge ? `${badge} ` : ""}{side === "left" ? pair.left : pair.right}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { flex: 1, gap: 9 },
  header: {
    minHeight: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    marginBottom: -2,
  },
  headerLabel: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  container: {
    paddingBottom: 2,
    alignSelf: "stretch",
  },
  rim: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 2,
    borderRadius: 22,
    backgroundColor: SEMANTIC_COLORS.border.default,
  },
  selectedRim: { backgroundColor: SEMANTIC_COLORS.brand.primary },
  matchedRim: { backgroundColor: SEMANTIC_COLORS.brand.primary },
  correctRim: { backgroundColor: SEMANTIC_COLORS.success.foreground || "#7E9874" },
  wrongRim: { backgroundColor: SEMANTIC_COLORS.error.foreground || "#C86D55" },
  pair: {
    minHeight: 59,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 22,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  selected: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  matched: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  disabled: {},
  correct: { borderColor: SEMANTIC_COLORS.success.foreground || "#7E9874", backgroundColor: "#F2F8EF" },
  wrong: { borderColor: SEMANTIC_COLORS.error.foreground || "#C86D55", backgroundColor: "#FFF0EA" },
  pressed: { transform: [{ translateY: 2 }] },
  pairLabel: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center",
  },
});
