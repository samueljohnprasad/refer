import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { readRecord } from "@/src/components/exercise/courseExerciseContent";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { readOneLineRevealData } from "@/src/exercises/OneLineReveal/data";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";

export function OneLineRevealCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const data = readOneLineRevealData(exercise);
  const saved = readRecord(savedResponse);
  const revealed = saved?.revealed === true;
  const selectedOptionId = typeof saved?.selectedOptionId === "string" ? saved.selectedOptionId : undefined;

  useEffect(() => {
    if (!saved) {
      onInteraction(
        {
          format: CourseExerciseCategoryEnum.OneLineReveal,
          phase: "reveal",
          revealed: false,
          isCorrect: true, // Optimistically correct unless prediction fails
        },
        true,
      );
    }
  }, [onInteraction, saved]);

  // Determine what to show for the second line and why block
  let secondLine: string | null = null;
  let whyBody: string | null = null;
  
  if (data.options.length > 0 && selectedOptionId) {
    const selectedOpt = data.options.find((opt) => opt.id === selectedOptionId);
    if (selectedOpt) {
      secondLine = selectedOpt.label;
      if (selectedOpt.feedback) {
        whyBody = selectedOpt.feedback;
      }
    }
  }

  const handleOptionPress = (optId: string) => {
    onInteraction({
      ...saved,
      selectedOptionId: optId,
      revealed: true, // Automatically reveal when they pick an option
    });
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={data.title}
        instruction={data.instruction}
      />
      <View style={styles.ideaCard}>
        <Text style={styles.firstLine}>{data.firstLine}</Text>
        {revealed && secondLine ? (
          <Text style={styles.secondLine}>{secondLine}</Text>
        ) : null}
      </View>
      
      {!revealed && data.options.length > 0 ? (
        <View style={styles.optionsContainer}>
          {data.options.map((opt) => (
            <CourseExerciseOptionButton
              key={opt.id}
              label={opt.label}
              selected={selectedOptionId === opt.id}
              onPress={() => handleOptionPress(opt.id)}
            />
          ))}
        </View>
      ) : null}

      {revealed && whyBody ? (
        <View style={styles.whyCard}>
          <View style={styles.checkCircle}>
            <Text style={styles.check}>✓</Text>
          </View>
          <View style={styles.whyCopy}>
            <Text style={styles.whyTitle}>
              {data.whyTitle ?? "Why it matters"}
            </Text>
            <Text style={styles.whyBody}>{whyBody}</Text>
          </View>
        </View>
      ) : null}
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
  ideaCard: {
    minHeight: 240,
    justifyContent: "center",
    gap: 14,
    paddingHorizontal: 26,
    paddingVertical: 30,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: SEMANTIC_COLORS.border.strong,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  firstLine: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 31,
  },
  secondLine: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 31,
  },
  optionsContainer: {
    marginTop: 16,
    gap: 8,
  },
  whyCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
    marginTop: 16,
    paddingHorizontal: 17,
    paddingVertical: 15,
    borderWidth: 1.5,
    borderColor: SEMANTIC_COLORS.brand.primary,
    borderRadius: 24,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  checkCircle: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  check: {
    color: SEMANTIC_COLORS.surface.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
  },
  whyCopy: { flex: 1 },
  whyTitle: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 16,
    lineHeight: 20,
  },
  whyBody: {
    marginTop: 7,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
});
