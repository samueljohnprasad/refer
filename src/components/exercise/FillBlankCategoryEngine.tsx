import React, { useEffect } from "react";
import { Keyboard, Pressable, Text, TextInput, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
} from "@/src/components/exercise/courseExerciseContent";
import { readFillBlankVariants } from "@/src/components/exercise/courseExerciseSixthBatchContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function FillBlankCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const variants = readFillBlankVariants(content.variants);
  const variantIndex = readNumber(saved?.variantIndex) ?? 0;
  const attemptCount = readNumber(saved?.attemptCount) ?? 0;
  const input = readInput(saved?.input);
  const phase = saved?.phase === "feedback" ? "feedback" : "entry";
  const supported = saved?.supported === true;
  const correct = saved?.isCorrect === true;
  const feedbackText = readString(saved?.feedbackText);
  const variant = variants[variantIndex] ?? variants[0];

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  useEffect(() => {
    if (phase === "feedback") Keyboard.dismiss();
  }, [phase]);

  const updateInput = (nextInput: string) => {
    if (locked || phase !== "entry") return;
    onInteraction(
      createResponse({ ...saved, input: nextInput }),
      nextInput.trim().length > 0,
    );
  };

  const chooseExampleWord = (word: string) => {
    Haptics.selectionAsync();
    updateInput(word);
  };

  return (
    <View className="px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Complete the sentence"}
        instruction={
          readString(content.instruction) ?? "Type the missing word."
        }
      />

      <View className="rounded-[24px] bg-[#F9F4ED] px-5 py-5">
        <Text className="happy-font-body text-[17.5px] leading-[28px] text-[#201E1D]">
          {variant?.pre}
        </Text>
        <TextInput
          accessibilityLabel="Missing word"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!locked && phase === "entry"}
          onChangeText={updateInput}
          placeholder="type here"
          placeholderTextColor="#82796A"
          returnKeyType="done"
          value={input}
          className="happy-font-body my-2 min-h-[48px] rounded-2xl border-2 border-[#DCD3C4] bg-white px-4 py-2.5 text-center text-[16px] text-[#201E1D]"
        />
        <Text className="happy-font-body text-[17.5px] leading-[28px] text-[#201E1D]">
          {variant?.post}
        </Text>
      </View>

      {phase === "entry" && attemptCount >= 2 ? (
        <View className="mt-3">
          <Text className="happy-font-body-bold mb-2 text-[11px] tracking-[0.45px] text-[#82796A]">
            WORD BANK
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {variant?.exampleWords.map((word) => (
              <Pressable
                key={word}
                accessibilityRole="button"
                onPress={() => chooseExampleWord(word)}
                className="min-h-11 justify-center rounded-full border-[1.5px] border-[#DCD3C4] bg-[#F9F4ED] px-4 py-2.5 shadow-sm shadow-black/10 active:translate-y-px active:shadow-none"
              >
                <Text className="happy-font-body-bold text-[14px] text-[#201E1D]">
                  {word}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {phase === "feedback" ? (
        <FillBlankFeedback
          correct={correct}
          supported={supported}
          feedbackText={feedbackText}
          capability={readString(content.capability)}
        />
      ) : null}
    </View>
  );
}

function FillBlankFeedback({
  capability,
  correct,
  feedbackText,
  supported,
}: {
  capability: string | null;
  correct: boolean;
  feedbackText: string | null;
  supported: boolean;
}) {
  const positive = correct || supported;
  return (
    <View
      className={
        positive
          ? "mt-4 flex-row items-start gap-2.5 rounded-[24px] border-[1.5px] border-[#5F7F58] bg-[#F2F8EF] px-[17px] py-[15px]"
          : "mt-4 rounded-[24px] border-[1.5px] border-[#5F7F58] bg-[#F2F8EF] px-[17px] py-[15px]"
      }
    >
      {positive ? (
        <View className="h-7 w-7 items-center justify-center rounded-full bg-[#5F7F58]">
          <Text className="happy-font-body-bold text-[14px] text-white">✓</Text>
        </View>
      ) : null}
      <View className="flex-1">
        <Text
          className={
            positive
              ? "happy-font-heading-bold text-[16px] leading-5 text-[#29452A]"
              : "happy-font-heading-bold text-[16px] leading-5 text-[#29452A]"
          }
        >
          {supported
            ? "Here’s the thinking"
            : correct
              ? "Why it fits"
              : "Try another way."}
        </Text>
        <Text className="happy-font-body mt-1.5 text-[13.5px] leading-5 text-[#201E1D]">
          {feedbackText}
        </Text>
        {correct && capability ? (
          <Text className="happy-font-body mt-2 text-[13px] leading-[18px] text-[#29452A]">
            <Text className="happy-font-body-bold">New capability: </Text>
            {capability}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.FillBlank,
    phase: "entry",
    variantIndex: 0,
    attemptCount: 0,
    input: "",
    feedbackText: null,
    isCorrect: false,
    supported: false,
    ...extra,
  };
}

function readInput(value: unknown): string {
  return typeof value === "string" ? value : "";
}
