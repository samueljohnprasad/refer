import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function CommonTrapCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const isRevealed = saved?.revealed === true;

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.CommonTrap,
          phase: "trap",
          revealed: false,
          isCorrect: true,
        },
        true,
      );
    }
  }, [onInteraction, saved]);

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "The trap that makes sense"}
        instruction={readString(content.instruction) ?? "Tap through."}
      />

      <View style={styles.trapCard}>
        <Text style={styles.neutralKicker}>THE TRAP · IT MAKES TOTAL SENSE</Text>
        <Text style={styles.trapTitle}>{readString(content.trapTitle)}</Text>
        <Text style={styles.trapBody}>{readString(content.trapBody)}</Text>
      </View>

      {isRevealed ? (
        <View style={styles.revealStack}>
          <TrapOutcome
            icon="check"
            kicker="THE FIRST HOUR"
            body={readString(content.relief)}
            tone="olive"
          />
          <TrapOutcome
            icon="corner-up-left"
            kicker="THE BOOMERANG"
            body={readString(content.rebound)}
            tone="orange"
          />
          <View style={styles.counterMove}>
            <Text style={styles.neutralKicker}>THE COUNTER-MOVE</Text>
            <Text style={styles.outcomeBody}>
              {readString(content.counterMove)}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function TrapOutcome({
  body,
  icon,
  kicker,
  tone,
}: {
  body: string | null;
  icon: "check" | "corner-up-left";
  kicker: string;
  tone: "olive" | "orange";
}) {
  const isOlive = tone === "olive";
  return (
    <View
      style={[
        styles.outcome,
        isOlive ? styles.oliveOutcome : styles.orangeOutcome,
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          isOlive ? styles.oliveIcon : styles.orangeIcon,
        ]}
      >
        <Feather
          name={icon}
          size={14}
          color={COURSE_EXERCISE_COLORS.surface}
        />
      </View>
      <View style={styles.outcomeCopy}>
        <Text style={isOlive ? styles.oliveKicker : styles.orangeKicker}>
          {kicker}
        </Text>
        <Text style={styles.outcomeBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  trapCard: {
    gap: 9,
    paddingHorizontal: 22,
    paddingVertical: 22,
    borderRadius: 28,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
    shadowColor: COURSE_EXERCISE_COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  neutralKicker: {
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 10.5,
    letterSpacing: 0.5,
  },
  trapTitle: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 21,
    lineHeight: 26,
  },
  trapBody: {
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14.5,
    lineHeight: 22,
  },
  revealStack: { gap: 10, marginTop: 12 },
  outcome: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderRadius: 22,
  },
  oliveOutcome: {
    borderColor: COURSE_EXERCISE_COLORS.accent,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  orangeOutcome: {
    borderColor: COURSE_EXERCISE_COLORS.accentLight,
    backgroundColor: COURSE_EXERCISE_COLORS.accentTint,
  },
  iconCircle: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  oliveIcon: { backgroundColor: COURSE_EXERCISE_COLORS.accent },
  orangeIcon: { backgroundColor: COURSE_EXERCISE_COLORS.accent },
  outcomeCopy: { flex: 1 },
  oliveKicker: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 10.5,
    letterSpacing: 0.5,
  },
  orangeKicker: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 10.5,
    letterSpacing: 0.5,
  },
  outcomeBody: {
    marginTop: 3,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
  counterMove: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 22,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
    shadowColor: COURSE_EXERCISE_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
