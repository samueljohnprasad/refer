import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ReloadIcon } from "@hugeicons/core-free-icons";
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
    onInteraction(
      createResponse({
        ...saved,
        selectedOptionIndex: optionIndex,
        isCorrect: option.isCorrect,
      }),
      true,
    );
  };

  if (phase === "intro") {
    return <CheckpointIntro content={content} />;
  }
  if (phase === "summary") {
    return <CheckpointSummary content={content} items={items} saved={saved} />;
  }
  if (!item) return null;

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Checkpoint"}
        instruction={`Question ${itemIndex + 1} of ${items.length}`}
      />

      {item.context ? (
        <View className="mb-3 rounded-[20px] bg-[#F9F4ED] px-4 py-[14px] shadow-sm shadow-black/10">
          <Text className="happy-font-body text-[14px] leading-[21px] text-[#201E1D]">
            {item.context}
          </Text>
        </View>
      ) : null}

      <Text className="happy-font-body-bold mb-2.5 text-[16px] leading-[22px] text-[#201E1D]">
        {item.prompt}
      </Text>
      <View className="gap-2.5">
        {item.options.map((option, optionIndex) => {
          const selected = selectedOptionIndex === optionIndex;
          return (
            <Pressable
              key={option.label}
              accessibilityRole="radio"
              accessibilityState={{ selected, disabled: phase === "feedback" }}
              disabled={locked || phase === "feedback"}
              onPress={() => selectOption(optionIndex)}
              className={getOptionClassName(selected, phase === "feedback")}
            >
              <View
                className={
                  selected
                    ? "h-5 w-5 items-center justify-center rounded-full bg-[#5F7F58]"
                    : "h-5 w-5 rounded-full border-2 border-[#B6AB9B]"
                }
              >
                {selected ? (
                  <Text className="happy-font-body-bold text-[11px] text-white">
                    ✓
                  </Text>
                ) : null}
              </View>
              <Text className="happy-font-body-bold flex-1 text-[13.5px] leading-[19px] text-[#201E1D]">
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {phase === "feedback" && selectedOption ? (
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
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Checkpoint"}
        instruction={readString(content.instruction) ?? "A calm mixed review."}
      />
      <View className="rounded-[24px] bg-[#F9F4ED] px-6 py-6 shadow-sm shadow-black/10">
        <View className="h-16 w-16 items-center justify-center rounded-full bg-[#D3E0CD]">
          <HugeiconsIcon icon={ReloadIcon} size={30} color="#29452A" />
        </View>
        <Text className="happy-font-heading-bold mt-3 text-[21px] leading-[26px] text-[#201E1D]">
          {readString(content.introTitle)}
        </Text>
        <Text className="happy-font-body mt-2 text-[14.5px] leading-[22px] text-[#201E1D]">
          {readString(content.intro)}
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
    <View className="flex-1 px-2 pb-3 pt-1.5">
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

function getOptionClassName(selected: boolean, feedback: boolean): string {
  if (selected) {
    return "min-h-[56px] flex-row items-center gap-3 rounded-[22px] border-[1.5px] border-[#7E9874] border-b-[3px] bg-[#F2F8EF] px-4 py-3";
  }
  if (feedback) {
    return "min-h-[56px] flex-row items-center gap-3 rounded-[22px] border border-[#DCD3C4] bg-[#F9F4ED] px-4 py-3 opacity-50";
  }
  return "min-h-[56px] flex-row items-center gap-3 rounded-[22px] border-[1.5px] border-[#DCD3C4] border-b-[3px] bg-[#F9F4ED] px-4 py-3 active:translate-y-0.5 active:border-b-[1.5px]";
}

function getFeedbackTitle(correct: boolean, attempts: number): string {
  if (correct) return "Why it fits";
  if (attempts >= 3) return "Here’s the thinking";
  return attempts >= 2
    ? "Let’s make it simpler"
    : "A tempting model. Not this one.";
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
