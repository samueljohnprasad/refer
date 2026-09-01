import React, { useEffect } from "react";
import { Pressable, Text, View, ViewStyle } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseTeachingPanel } from "@/src/components/exercise/CourseExerciseTeachingPanel";
import {
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import {
  readBooleanResults,
  readCheckpointItems,
  readResponseIndex,
  type CheckpointItem,
} from "@/src/components/exercise/courseCheckpointContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  scenarioCard: {
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: SEMANTIC_COLORS.surface.secondary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scenarioText: {
    fontFamily: "Nunito_400Regular",
    fontSize: 14,
    lineHeight: 21,
    color: SEMANTIC_COLORS.text.primary,
  },
  questionText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 16,
    lineHeight: 22,
    color: SEMANTIC_COLORS.text.primary,
    marginBottom: 10,
  },
  optionText: {
    flex: 1,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 13.5,
    lineHeight: 19,
    color: SEMANTIC_COLORS.text.primary,
  },
  radioCheck: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    color: SEMANTIC_COLORS.brand.onPrimary,
  },
  radioCross: {
    fontFamily: "Nunito_700Bold",
    fontSize: 11,
    color: SEMANTIC_COLORS.error.foreground,
  },
});

export function CourseCheckpointCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const phase = readString(saved?.phase) ?? "intro";
  const items = readCheckpointItems(content.items);
  const itemIndex = readResponseIndex(saved?.itemIndex) ?? 0;
  const item = items[itemIndex];
  const selectedOptionIndex = readResponseIndex(saved?.selectedOptionIndex);
  const selectedOption = item?.options[selectedOptionIndex ?? -1];
  const attempts = readResponseIndex(saved?.attempts) ?? 0;

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  const selectOption = (optionIndex: number) => {
    if (locked || phase !== "question" || !item) return;
    Haptics.selectionAsync();
    const option = item.options[optionIndex];
    
    const newResults = [...readBooleanResults(saved?.results)];
    newResults[itemIndex] = option.isCorrect;

    onInteraction(
      {
        ...saved,
        selectedOptionIndex: optionIndex,
        attempts: option.isCorrect ? attempts : attempts + 1,
        results: newResults,
        isCorrect: option.isCorrect,
        phase: "feedback",
      },
      false,
    );
  };

  if (phase === "intro") {
    return <CheckpointIntro content={content} />;
  }
  if (phase === "summary") {
    return <CheckpointSummary content={content} items={items} saved={saved} />;
  }
  if (!item) return null;

  const isFeedback = phase === "feedback";
  const isSelected = (index: number) => selectedOptionIndex === index;
  const isCorrectOption = (index: number) => item.options[index]?.isCorrect === true;
  const isIncorrectOption = (index: number) => item.options[index]?.isCorrect === false;

  return (
    <View className="px-2 pb-3 pt-0">
      {item.context ? (
        <View style={styles.scenarioCard}>
          <Text style={styles.scenarioText}>{item.context}</Text>
        </View>
      ) : null}

      <Text style={styles.questionText}>{item.prompt}</Text>
      <View className="gap-2.5">
        {item.options.map((option, optionIndex) => {
          const selected = isSelected(optionIndex);
          const correct = isCorrectOption(optionIndex);
          const incorrect = selected && !correct;
          const showFeedback = isFeedback && (correct || incorrect);

          return (
            <Pressable
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ selected: showFeedback ? correct : selected, disabled: locked || isFeedback }}
              disabled={locked || isFeedback}
              onPress={() => selectOption(optionIndex)}
              style={getOptionStyle(selected, correct, incorrect, showFeedback)}
            >
              <View style={getRadioStyle(selected, correct, incorrect, showFeedback)}>
                {showFeedback ? (
                  correct ? (
                    <Text style={styles.radioCheck}>✓</Text>
                  ) : incorrect ? (
                    <Text style={styles.radioCross}>×</Text>
                  ) : selected ? (
                    <Text style={styles.radioCheck}>✓</Text>
                  ) : null
                ) : null}
              </View>
              <View className="flex-1">
                <Text style={styles.optionText}>{option.label}</Text>
                {showFeedback && selected && incorrect && (
                  <Text className="happy-font-body-bold text-[11.5px] text-[#A74141] uppercase tracking-[0.5px] mt-1">
                    Your answer
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      {isFeedback && selectedOption ? (
        <CourseExerciseTeachingPanel
          correct={selectedOption.isCorrect}
          title={getFeedbackTitle(selectedOption.isCorrect, attempts)}
          body={selectedOption.feedback}
          workedExample={
            !selectedOption.isCorrect && attempts >= 3 ? item.worked : null
          }
        />
      ) : attempts > 0 ? (
        <Text className="happy-font-body mt-3 text-center text-[12.5px] leading-[18px] text-[#82796A]">
          {item.clue}
        </Text>
      ) : null}
    </View>
  );
}

function CheckpointIntro({ content }: { content: Record<string, unknown> }) {
  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Sleep science checkpoint"}
      />
      <View className="gap-3">
        <Text className="happy-font-body text-[15px] leading-[22px] text-[#201E1D]">
          {readString(content.intro) ?? "Four quick questions review the key sleep patterns you just learned."}
        </Text>
        <Text className="happy-font-body text-[13px] leading-[19px] text-[#82796A]">
          {readString(content.introSubtitle) ?? "4 questions · Mistakes won't affect your progress"}
        </Text>
      </View>
    </View>
  );
}

function CheckpointSummary({
  content,
  items,
  saved,
}: {
  content: Record<string, unknown>;
  items: CheckpointItem[];
  saved: Record<string, unknown> | null;
}) {
  const results = readBooleanResults(saved?.results);
  const solid = items.filter((_, index) => results[index] === true);
  const revisit = items.filter((_, index) => results[index] !== true);
  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Checkpoint"}
        instruction="What the review showed."
      />
      <SummaryGroup title="FEELS SOLID" items={solid} solid />
      <SummaryGroup title="WORTH A TWO-MINUTE REVISIT" items={revisit} />
      <Text className="happy-font-body mt-4 text-[14px] leading-[22px] text-[#3F3A34]">
        {readString(
          revisit.length > 0 ? content.revisitMessage : content.solidMessage,
        )}
      </Text>
    </View>
  );
}

function SummaryGroup({
  title,
  items,
  solid = false,
}: {
  title: string;
  items: CheckpointItem[];
  solid?: boolean;
}) {
  if (!items.length) return null;
  return (
    <View className="mb-4">
      <Text
        className={
          solid
            ? "happy-font-body-bold mb-2 text-[10.5px] tracking-[0.5px] text-[#29452A]"
            : "happy-font-body-bold mb-2 text-[10.5px] tracking-[0.5px] text-[#82796A]"
        }
      >
        {title}
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {items.map((item) => (
          <View
            key={item.concept}
            className={
              solid
                ? "rounded-full bg-[#D3E0CD] px-3.5 py-2"
                : "rounded-full bg-[#EBDDC5] px-3.5 py-2"
            }
          >
            <Text className="happy-font-body-bold text-[13px] text-[#3F3A34]">
              {item.concept}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
 
function getOptionStyle(
  selected: boolean,
  correct: boolean,
  incorrect: boolean,
  showFeedback: boolean
): ViewStyle {
  if (showFeedback && correct) {
    return {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: SEMANTIC_COLORS.success.border,
      backgroundColor: SEMANTIC_COLORS.success.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
    };
  }
  if (showFeedback && incorrect) {
    return {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: SEMANTIC_COLORS.error.border,
      backgroundColor: SEMANTIC_COLORS.error.surface,
      paddingHorizontal: 16,
      paddingVertical: 12,
    };
  }
  if (selected) {
    return {
      minHeight: 56,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: SEMANTIC_COLORS.border.selected,
      backgroundColor: SEMANTIC_COLORS.brand.soft,
      paddingHorizontal: 16,
      paddingVertical: 12,
    };
  }
  return {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: SEMANTIC_COLORS.border.default,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
  };
}

function getRadioStyle(
  selected: boolean,
  correct: boolean,
  incorrect: boolean,
  showFeedback: boolean
): ViewStyle {
  if (showFeedback && correct) {
    return {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: SEMANTIC_COLORS.success.indicator,
      backgroundColor: SEMANTIC_COLORS.success.indicator,
      alignItems: "center",
      justifyContent: "center",
    };
  }
  if (showFeedback && incorrect) {
    return {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: SEMANTIC_COLORS.error.indicator,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
    };
  }
  if (selected) {
    return {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: SEMANTIC_COLORS.brand.primary,
      backgroundColor: SEMANTIC_COLORS.brand.primary,
      alignItems: "center",
      justifyContent: "center",
    };
  }
  return {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SEMANTIC_COLORS.border.default,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  };
}

function getFeedbackTitle(correct: boolean, attempts: number): string {
  if (correct) return "What happened?";
  if (attempts >= 3) return "Here's the thinking";
  return attempts >= 2
    ? "Let's make it simpler"
    : "Not quite";
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