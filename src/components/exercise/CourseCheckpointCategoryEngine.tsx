import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View, type ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, { FadeInUp, LinearTransition } from "react-native-reanimated";
import { CourseCheckpointIntro } from "@/src/components/exercise/CourseCheckpointIntro";
import { CourseCheckpointSummary } from "@/src/components/exercise/CourseCheckpointSummary";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import {
  readBooleanResults,
  readCheckpointItems,
  readResponseIndex,
} from "@/src/components/exercise/courseCheckpointContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function CourseCheckpointCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const { t } = useTranslation("exercises");
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const phase = readString(saved?.phase) ?? "intro";
  const items = readCheckpointItems(content.items);
  const itemIndex = readResponseIndex(saved?.itemIndex) ?? 0;
  const item = items[itemIndex];
  const selectedOptionIndex = readResponseIndex(saved?.selectedOptionIndex);
  const selectedOption = item?.options[selectedOptionIndex ?? -1];

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse(), true);
    } else if (saved && phase === "feedback") {
      // // ponytail: self-heal stale hydrated session draft where ready was saved as false
      onInteraction(saved, true);
    }
  }, []);

  const selectOption = (optionIndex: number) => {
    if (locked || phase !== "question" || !item) return;
    Haptics.selectionAsync();
    const option = item.options[optionIndex];

    const newResults = [...readBooleanResults(saved?.results)];
    newResults[itemIndex] = option.isCorrect;

    onInteraction(
      {
        ...saved,
        itemIndex,
        selectedOptionIndex: optionIndex,
        results: newResults,
        isCorrect: option.isCorrect,
        phase: "feedback",
      },
      true,
    );
  };

  if (phase === "intro") {
    return <CourseCheckpointIntro content={content} />;
  }
  if (phase === "summary") {
    return <CourseCheckpointSummary content={content} items={items} saved={saved} />;
  }
  if (!item) return null;

  const isFeedback = phase === "feedback";
  const isSelected = (index: number) => selectedOptionIndex === index;
  const isCorrectOption = (index: number) => item.options[index]?.isCorrect === true;
  const showCorrectHighlight = isFeedback;

  // Format causal chain lines from feedback
  const feedbackLines = selectedOption?.feedback?.split("\n").filter((l) => l.trim().length > 0) ?? [];

  return (
    <View className="px-3 pb-6 pt-0">
      {/* Scenario Card (Compact, no SCENARIO label) */}
      {item.context ? (
        <View className="mb-4 rounded-[16px] border border-[#EBDDC5] bg-[#FDF9F5] px-4 py-2.5">
          <Text className="happy-font-body text-[14px] leading-[20px] text-[#3F3A34]">
            {item.context}
          </Text>
        </View>
      ) : null}

      {/* Question Prompt */}
      <Text className="happy-font-heading-bold mb-3.5 text-[17.5px] leading-[24px] text-[#29452A]">
        {item.prompt}
      </Text>

      {/* Options */}
      <View className="gap-2.5">
        {item.options.map((option, optionIndex) => {
          const selected = isSelected(optionIndex);
          const correct = isCorrectOption(optionIndex);
          const incorrect = selected && !correct;

          return (
            <Pressable
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ selected: showCorrectHighlight ? correct : selected, disabled: locked || isFeedback }}
              disabled={locked || isFeedback}
              onPress={() => selectOption(optionIndex)}
              style={getOptionStyle(selected, correct, incorrect, isFeedback, showCorrectHighlight)}
            >
              <View style={getRadioStyle(selected, correct, incorrect, isFeedback, showCorrectHighlight)}>
                {isFeedback ? (
                  correct && showCorrectHighlight ? (
                    <Text className="happy-font-body-bold text-[9px] text-white">✓</Text>
                  ) : incorrect ? (
                    <Text className="happy-font-body-bold text-[9px] text-[#A74141]">×</Text>
                  ) : null
                ) : null}
              </View>
              <View className="flex-1">
                <Text className="happy-font-body-bold text-[13.5px] leading-[19px] text-[#3F3A34]">
                  {option.label}
                </Text>
                {isFeedback && incorrect && (
                  <Text className="mt-1 happy-font-body-bold text-[10px] tracking-[0.5px] text-[#A74141] uppercase">
                    {t("flow.ui.categoryEngine.checkpoint.yourAnswer")}
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Causal Explanation Panel (Visual Hero of Feedback) */}
      {isFeedback && selectedOption ? (
        <Animated.View entering={FadeInUp.duration(200)} layout={LinearTransition} className="mt-6 mb-2">
          <View className="rounded-[16px] border border-[#EBDDC5] bg-[#FDF9F5] p-5">
            <Text className="happy-font-heading-bold mb-3.5 text-[12px] tracking-[0.8px] text-[#29452A] uppercase">
              {t("flow.ui.categoryEngine.checkpoint.whatHappened")}
            </Text>
            <View className="gap-2">
              {feedbackLines.map((line, idx) => {
                const isArrow = line.trim() === "↓" || line.trim() === "->";
                const delay = idx * 150;
                if (isArrow) {
                  return (
                    <Animated.Text key={idx} entering={FadeInUp.duration(200).delay(delay)} className="happy-font-body-bold text-left text-[14px] text-[#82796A] ml-4">
                      ↓
                    </Animated.Text>
                  );
                }
                return (
                  <Animated.Text key={idx} entering={FadeInUp.duration(200).delay(delay)} className="happy-font-body-bold text-[15px] leading-[21px] text-[#3F3A34]">
                    {line}
                  </Animated.Text>
                );
              })}
            </View>
          </View>
        </Animated.View>
      ) : null}
    </View>
  );
}

function getOptionStyle(
  selected: boolean,
  correct: boolean,
  incorrect: boolean,
  isFeedback: boolean,
  showCorrectHighlight: boolean
): ViewStyle {
  if (isFeedback && correct && showCorrectHighlight) {
    return {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#29452A",
      backgroundColor: "#E1EAD9",
      paddingHorizontal: 16,
      paddingVertical: 12,
    };
  }
  if (isFeedback && incorrect) {
    return {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#A74141",
      backgroundColor: "#FDF9F5",
      paddingHorizontal: 16,
      paddingVertical: 12,
    };
  }
  if (selected) {
    return {
      minHeight: 52,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: "#29452A",
      backgroundColor: "#F8F1E7",
      paddingHorizontal: 16,
      paddingVertical: 12,
    };
  }
  return {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#EBDDC5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
  };
}

function getRadioStyle(
  selected: boolean,
  correct: boolean,
  incorrect: boolean,
  isFeedback: boolean,
  showCorrectHighlight: boolean
): ViewStyle {
  if (isFeedback && correct && showCorrectHighlight) {
    return {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 1.2,
      borderColor: "#29452A",
      backgroundColor: "#29452A",
      alignItems: "center",
      justifyContent: "center",
    };
  }
  if (isFeedback && incorrect) {
    return {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 1.2,
      borderColor: "#A74141",
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    };
  }
  if (selected) {
    return {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 1.2,
      borderColor: "#29452A",
      backgroundColor: "#29452A",
      alignItems: "center",
      justifyContent: "center",
    };
  }
  return {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#C5BBAA",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  };
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.CourseCheckpoint,
    phase: "intro",
    itemIndex: 0,
    selectedOptionIndex: null,
    attempts: 0,
    results: [],
    isCorrect: false,
    ...extra,
  };
}
