import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  readCourseExerciseOptions,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface InventCase {
  id: string;
  name: string;
  text: string;
  label: string;
  isCalm: boolean;
}

export function InventFirstCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const cases = readCases(content.cases);
  const options = readCourseExerciseOptions(content.options);
  const question = readString(content.question);
  const feedbackMap = readRecord(content.feedbackMap);

  const saved = readRecord(savedResponse);
  const selectedOptionId = readString(saved?.selectedOptionId);
  const phase = readString(saved?.phase) ?? "case";

  // If locked, we are in feedback/complete phase
  const isAnswered = locked || phase === "feedback" || phase === "complete";
  const selectedFeedback =
    isAnswered && selectedOptionId
      ? readRecord(feedbackMap?.[selectedOptionId])
      : null;

  const selectOption = (optionId: string) => {
    if (locked) return;
    Haptics.selectionAsync();

    // Completing interaction immediately so "Skip" disappears and "Continue" appears
    onInteraction(
      {
        format: CourseExerciseCategoryEnum.InventFirst,
        selectedOptionId: optionId,
        phase: "feedback",
        isCorrect: true, // Forces immediate "Continue"
      },
      true, // This indicates the exercise is "complete" and ready to continue
    );
  };

  return (
    <View style={styles.screenContent}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {readString(content.title) ?? "Invent the Outcome"}
        </Text>
        <Text style={styles.instruction}>
          {readString(content.instruction) ??
            "Review the case and predict what happens next."}
        </Text>
      </View>

      <View style={[styles.caseList, isAnswered && styles.caseListDimmed]}>
        {cases.map((item, index) => (
          <View
            key={item.id}
            style={[styles.caseCard, isAnswered && styles.caseCardDimmed]}
          >
            <View
              style={[
                styles.avatar,
                index === 1 && styles.avatarOlive,
                index === 2 && styles.avatarNeutral,
                isAnswered && styles.avatarDimmed,
              ]}
            >
              <Text style={styles.avatarLabel}>{item.name.charAt(0)}</Text>
            </View>
            <Text style={styles.caseText}>
              <Text style={styles.caseName}>{item.name} </Text>
              {item.text}
            </Text>
            <Text style={styles.caseLabel}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* The Question */}
      {question ? <Text style={styles.questionText}>{question}</Text> : null}

      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;

          if (isAnswered && !isSelected) {
            return null; // hide entirely to stop competition with feedback
          }

          return (
            <View key={option.id}>
              <CourseExerciseOptionButton
                label={option.label}
                selected={isSelected}
                showConfirmationIcon={false}
                disabled={locked}
                onPress={() => selectOption(option.id)}
              />
            </View>
          );
        })}
      </View>

      {/* Conditional Feedback */}
      {selectedFeedback ? (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>
            {readString(selectedFeedback.title)}
          </Text>
          <Text style={styles.feedbackBody}>
            {readString(selectedFeedback.body)}
          </Text>

          <View style={styles.chainContainer}>
            {readChain(selectedFeedback.chain).map((step, idx) => (
              <View key={idx} style={styles.chainStep}>
                {idx > 0 && (
                  <View style={styles.chainArrow}>
                    <Text style={styles.chainArrowText}>↓</Text>
                  </View>
                )}
                <Text
                  style={[
                    styles.chainStepText,
                    idx === 0 && styles.chainStepFirst,
                  ]}
                >
                  {step}
                </Text>
              </View>
            ))}
          </View>

          {selectedFeedback.counterTitle ? (
            <View style={styles.counterContainer}>
              <Text style={styles.counterTitle}>
                {readString(selectedFeedback.counterTitle)}
              </Text>
              <Text style={styles.counterBody}>
                {readString(selectedFeedback.counterBody)}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function readCases(value: unknown): InventCase[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((caseValue, index) => {
    const item = readRecord(caseValue);
    const name = readString(item?.name);
    const text = readString(item?.text) ?? readString(item?.reading);
    const label = readString(item?.label) ?? readString(item?.outcome);
    return name && text && label
      ? [
          {
            id: readString(item?.id) ?? `case-${index}`,
            name,
            text,
            label,
            isCalm: item?.isCalm === true,
          },
        ]
      : [];
  });
}

function readChain(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((v) => readString(v)).filter((v): v is string => Boolean(v));
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },

  header: { marginBottom: 20 },
  title: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  instruction: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 21,
  },

  caseList: { gap: 8, marginBottom: 20 },
  caseListDimmed: { opacity: 0.6 },
  caseCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    shadowColor: SEMANTIC_COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  caseCardDimmed: { shadowOpacity: 0.02, paddingVertical: 6 },
  avatar: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  avatarOlive: { backgroundColor: SEMANTIC_COLORS.brand.soft }, // Removed primaryLight as per color fix
  avatarNeutral: { backgroundColor: SEMANTIC_COLORS.surface.secondary },
  avatarDimmed: { opacity: 0.7 },
  avatarLabel: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 16,
  },
  caseText: {
    flex: 1,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    lineHeight: 18,
  },
  caseName: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
  }, // Primary ink, semibold
  caseLabel: {
    width: 88,
    color: SEMANTIC_COLORS.text.tertiary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: "right",
  }, // Muted sage/tertiary

  questionText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  }, // Primary dark neutral
  options: { gap: 8 },

  feedbackContainer: { marginTop: 24, gap: 16 },
  feedbackTitle: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  feedbackBody: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },

  chainContainer: {
    marginTop: 8,
    marginBottom: 8,
    gap: 6,
    alignItems: "center",
  },
  chainStep: { alignItems: "center", gap: 6 },
  chainStepText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 15,
    textAlign: "center",
  }, // Default primary ink
  chainStepFirst: { color: SEMANTIC_COLORS.brand.pressed }, // First step muted forest
  chainArrow: { height: 18, justifyContent: "center" },
  chainArrowText: {
    color: SEMANTIC_COLORS.text.tertiary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
  },

  counterContainer: {
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
  },
  counterTitle: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyMedium,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  counterBody: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
});
