import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";

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
}: CourseExerciseTwinColumnProps) {
  return (
    <View style={styles.column}>
      <View
        style={[
          styles.header,
          side === "left" ? styles.leftHeader : styles.rightHeader,
        ]}
      >
        <Text style={styles.headerLabel}>{title}</Text>
      </View>
      {pairs.map((pair) => {
        const isMatched = matchedPairIds.includes(pair.id);
        const isSelected = side === "left" && selectedLeftId === pair.id;
        return (
          <Pressable
            key={pair.id}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected, disabled: isMatched }}
            disabled={disabled || isMatched}
            onPress={() => onSelect(pair.id)}
            style={({ pressed }) => [
              styles.pair,
              isSelected && styles.selected,
              isMatched && styles.matched,
              disabled && !isMatched && styles.disabled,
              pressed && !disabled && styles.pressed,
            ]}
          >
            <Text style={styles.pairLabel}>
              {side === "left" ? pair.left : pair.right}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  column: { flex: 1, gap: 9 },
  header: {
    minHeight: 43,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 15,
  },
  leftHeader: {
    borderColor: "#F6A06B",
    backgroundColor: COURSE_EXERCISE_COLORS.orangeTint,
  },
  rightHeader: {
    borderColor: "#AEBF92",
    backgroundColor: COURSE_EXERCISE_COLORS.oliveTint,
  },
  headerLabel: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 14,
    textAlign: "center",
  },
  pair: {
    minHeight: 61,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: COURSE_EXERCISE_COLORS.border,
    borderRadius: 22,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
  },
  selected: {
    borderColor: COURSE_EXERCISE_COLORS.orange,
    backgroundColor: COURSE_EXERCISE_COLORS.orangeTint,
  },
  matched: {
    borderColor: COURSE_EXERCISE_COLORS.border,
    borderBottomWidth: 1,
    backgroundColor: COURSE_EXERCISE_COLORS.oliveTint,
    opacity: 0.72,
  },
  disabled: { opacity: 0.6 },
  pressed: { transform: [{ translateY: 2 }], borderBottomWidth: 2 },
  pairLabel: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center",
  },
});
