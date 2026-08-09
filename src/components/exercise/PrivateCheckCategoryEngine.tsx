import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { LockIcon, Tick01Icon } from "@hugeicons/core-free-icons";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function PrivateCheckCategoryEngine({
  exercise,
  savedResponse,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const items = readStringArray(content.items);
  const selectedIndexes = readNumberArray(saved?.selectedItemIndexes);
  const showingFeedback = saved?.phase === "feedback";

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), true);
  }, [onInteraction, saved]);

  const toggleItem = (index: number) => {
    if (showingFeedback) return;
    const nextIndexes = selectedIndexes.includes(index)
      ? selectedIndexes.filter((itemIndex) => itemIndex !== index)
      : [...selectedIndexes, index];
    onInteraction(
      createResponse({ ...saved, selectedItemIndexes: nextIndexes }),
      true,
    );
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Sounds familiar?"}
        instruction={readString(content.instruction) ?? "Tick any — or none."}
      />

      <View accessibilityRole="list" className="gap-2.5">
        {items.map((item, index) => {
          const selected = selectedIndexes.includes(index);
          return (
            <Pressable
              key={item}
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: selected,
                disabled: showingFeedback,
              }}
              disabled={showingFeedback}
              onPress={() => toggleItem(index)}
              className={
                selected
                  ? "min-h-14 flex-row items-center gap-3 rounded-[24px] border-[1.5px] border-[#93A876] bg-[#F0FAE1] px-4 py-[13px] shadow-sm shadow-[#C9D9AF] active:translate-y-0.5"
                  : "min-h-14 flex-row items-center gap-3 rounded-[24px] border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-[13px] shadow-sm shadow-black/10 active:translate-y-0.5"
              }
            >
              <View
                className={
                  selected
                    ? "h-6 w-6 items-center justify-center rounded-full border-2 border-[#7A8A5E] bg-[#7A8A5E]"
                    : "h-6 w-6 items-center justify-center rounded-full border-2 border-[#A99E8D]"
                }
              >
                {selected ? (
                  <HugeiconsIcon icon={Tick01Icon} size={13} color="#F9F4ED" />
                ) : null}
              </View>
              <Text className="happy-font-body flex-1 text-[15px] leading-[21px] text-[#201E1D]">
                {item}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View className="mt-3 flex-row items-center justify-center gap-1.5">
        <HugeiconsIcon icon={LockIcon} size={13} color="#82796A" />
        <Text className="happy-font-body text-[12.5px] text-[#82796A]">
          Private — never scored or shared.
        </Text>
      </View>

      {showingFeedback ? (
        <View className="mt-3.5 flex-row gap-2.5 rounded-[20px] border-[1.5px] border-[#C9D9AF] bg-[#F0FAE1] px-4 py-[14px]">
          <View className="mt-0.5 h-7 w-7 items-center justify-center rounded-full bg-[#7A8A5E]">
            <HugeiconsIcon icon={Tick01Icon} size={15} color="#F9F4ED" />
          </View>
          <View className="flex-1">
            <Text className="happy-font-heading-bold text-base leading-5 text-[#201E1D]">
              {readString(content.feedbackTitle) ?? "Loops, not flaws"}
            </Text>
            <Text className="happy-font-body mt-1 text-[13.5px] leading-5 text-[#3F4A31]">
              {readString(content.feedback)}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function readNumberArray(value: unknown): number[] {
  return Array.isArray(value)
    ? value.filter((item): item is number => typeof item === "number")
    : [];
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.PrivateCheck,
    phase: "selection",
    selectedItemIndexes: [],
    isCorrect: true,
    ...extra,
  };
}
