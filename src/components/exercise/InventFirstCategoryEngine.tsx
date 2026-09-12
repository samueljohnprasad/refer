import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
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
import { ArrowDown01Icon } from "hugeicons-react-native";

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
      },
      true, // This indicates the exercise is "complete" and ready to continue
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Invent the Outcome"}
        instruction={
          readString(content.instruction) ??
          "Review the case and predict what happens next."
        }
      />

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
            <Text
              style={[styles.caseLabel, item.isCalm && styles.caseLabelCalm]}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      {/* The Question */}
      {question ? (
        <Text style={styles.questionText}>{question.toUpperCase()}</Text>
      ) : null}

      <View style={styles.options}>
        {options.map((option) => {
          const isSelected = selectedOptionId === option.id;
          if (isAnswered && !isSelected) {
            return null; // The prompt said "other option becomes visually quiet", but later "Do not let two large answer cards compete... selected option remains visible". So hide or dim heavily? Let's just dim heavily or hide. I'll dim heavily.
          }
          return (
            <View
              key={option.id}
              style={
                isAnswered && !isSelected
                  ? { opacity: 0.3, display: "none" }
                  : {}
              }
            >
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
            {readChain(selectedFeedback.chain).map((step, idx, arr) => (
              <View key={idx} style={styles.chainStep}>
                {idx > 0 && (
                  <View style={styles.chainArrow}>
                    <Text style={styles.chainArrowText}>↓</Text>
                  </View>
                )}
                <Text style={styles.chainStepText}>{step}</Text>
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

  caseList: { gap: 8, marginBottom: 24 },
  caseListDimmed: { opacity: 0.8 },
  caseCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 20,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    shadowColor: SEMANTIC_COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 4,
  },
  caseCardDimmed: { shadowOpacity: 0.02, paddingVertical: 8 },
  avatar: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 19,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  avatarOlive: { backgroundColor: SEMANTIC_COLORS.brand.primaryLight },
  avatarNeutral: { backgroundColor: SEMANTIC_COLORS.surface.secondary },
  avatarDimmed: { opacity: 0.7 },
  avatarLabel: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 17,
  },
  caseText: {
    flex: 1,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    lineHeight: 19,
  },
  caseName: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
  },
  caseLabel: {
    width: 88,
    color: SEMANTIC_COLORS.brand.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 11.5,
    lineHeight: 16,
    textAlign: "right",
  },
  caseLabelCalm: { color: SEMANTIC_COLORS.brand.pressed },

  questionText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 14,
    letterSpacing: 0.5,
    marginBottom: 16,
    textAlign: "center",
  },
  options: { gap: 10 },

  feedbackContainer: { marginTop: 24, gap: 16 },
  feedbackTitle: {
    color: SEMANTIC_COLORS.success.foreground,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 16,
  },
  feedbackBody: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 22,
  },

  chainContainer: {
    marginTop: 4,
    marginBottom: 8,
    gap: 6,
    alignItems: "center",
  },
  chainStep: { alignItems: "center", gap: 6 },
  chainStepText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
    textAlign: "center",
  },
  chainArrow: { height: 16, justifyContent: "center" },
  chainArrowText: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
  },

  counterContainer: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 24,
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
  },
  counterTitle: {
    color: SEMANTIC_COLORS.success.foreground,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 15,
    marginBottom: 4,
  },
  counterBody: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 22,
  },
});
