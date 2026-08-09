import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface LeverPair {
  id: string;
  left: string;
  right: string;
}

interface WrongPair {
  leftId: string;
  rightId: string;
}

export function LeverMatchCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const pairs = readPairs(content.pairs);
  const rightOrder = readStringArray(content.rightOrder);
  const matchedIds = readStringArray(saved?.matchedIds);
  const selectedLeftId = readString(saved?.selectedLeftId);
  const selectedRightId = readString(saved?.selectedRightId);
  const mismatchCount = readCount(saved?.mismatchCount);
  const [wrongPair, setWrongPair] = useState<WrongPair | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allMatched = pairs.length > 0 && matchedIds.length >= pairs.length;
  const orderedRightPairs = orderRightPairs(pairs, rightOrder);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  useEffect(
    () => () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    },
    [],
  );

  const chooseLeft = (id: string) => {
    if (locked || matchedIds.includes(id) || wrongPair) return;
    Haptics.selectionAsync();
    if (selectedRightId) {
      resolvePair(id, selectedRightId);
      return;
    }
    onInteraction(
      createResponse({ ...saved, selectedLeftId: id, selectedRightId: null }),
      false,
    );
  };

  const chooseRight = (id: string) => {
    if (locked || matchedIds.includes(id) || wrongPair) return;
    Haptics.selectionAsync();
    if (selectedLeftId) {
      resolvePair(selectedLeftId, id);
      return;
    }
    onInteraction(
      createResponse({ ...saved, selectedLeftId: null, selectedRightId: id }),
      false,
    );
  };

  const resolvePair = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const nextMatched = [...new Set([...matchedIds, leftId])];
      onInteraction(
        createResponse({
          ...saved,
          matchedIds: nextMatched,
          selectedLeftId: null,
          selectedRightId: null,
        }),
        nextMatched.length >= pairs.length,
      );
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setWrongPair({ leftId, rightId });
    const nextMismatchCount = mismatchCount + 1;
    const supportId = pairs[2]?.id;
    const nextMatched =
      nextMismatchCount >= 2 && supportId && !matchedIds.includes(supportId)
        ? [...matchedIds, supportId]
        : matchedIds;
    onInteraction(
      createResponse({
        ...saved,
        matchedIds: nextMatched,
        mismatchCount: nextMismatchCount,
        selectedLeftId: null,
        selectedRightId: null,
      }),
      nextMatched.length >= pairs.length,
    );
    clearTimer.current = setTimeout(() => setWrongPair(null), 420);
  };

  return (
    <View className="flex-1 px-2 pb-3 pt-1.5">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Match the levers"}
        instruction={
          readString(content.instruction) ?? "Tap one item from each side."
        }
      />

      <View className="flex-row gap-2.5">
        <View className="flex-1 gap-2.5">
          {pairs.map((pair) => (
            <MatchCard
              key={pair.id}
              label={pair.left}
              selected={selectedLeftId === pair.id}
              matched={matchedIds.includes(pair.id)}
              wrong={wrongPair?.leftId === pair.id}
              onPress={() => chooseLeft(pair.id)}
            />
          ))}
        </View>
        <View className="flex-1 gap-2.5">
          {orderedRightPairs.map((pair) => (
            <MatchCard
              key={pair.id}
              label={pair.right}
              selected={selectedRightId === pair.id}
              matched={matchedIds.includes(pair.id)}
              wrong={wrongPair?.rightId === pair.id}
              onPress={() => chooseRight(pair.id)}
            />
          ))}
        </View>
      </View>

      <Text className="happy-font-body mt-3 text-center text-xs text-[#82796A]">
        {allMatched
          ? "All matched"
          : `${matchedIds.length} of ${pairs.length} matched · tap one from each side`}
      </Text>

      {!allMatched ? (
        <View className="mt-3 rounded-[20px] border border-[#E4DACB] bg-[#F9F4ED] px-4 py-3">
          <Text className="happy-font-body text-[12.5px] leading-[18px] text-[#82796A]">
            {readString(content.clue)}
          </Text>
        </View>
      ) : (
        <View className="mt-3 rounded-[21px] border-[1.5px] border-[#C9D9AF] bg-[#F0FAE1] px-4 py-[14px]">
          <Text className="happy-font-heading-bold text-lg leading-[22px] text-[#3F4A31]">
            {readString(content.feedbackTitle) ?? "Why it fits"}
          </Text>
          <Text className="happy-font-body mt-1.5 text-[13px] leading-[19px] text-[#3F4A31]">
            {readString(content.feedback)}
          </Text>
          <Text className="happy-font-body-bold mt-2 text-[12.5px] leading-[18px] text-[#56633F]">
            New capability: {readString(content.capability)}
          </Text>
        </View>
      )}
    </View>
  );
}

function MatchCard({
  label,
  selected,
  matched,
  wrong,
  onPress,
}: {
  label: string;
  selected: boolean;
  matched: boolean;
  wrong: boolean;
  onPress: () => void;
}) {
  const className = matched
    ? "min-h-[64px] items-center justify-center rounded-[19px] border-[1.5px] border-[#93A876] bg-[#F0FAE1] px-2.5 py-2"
    : wrong
      ? "min-h-[64px] items-center justify-center rounded-[19px] border-[1.5px] border-[#C86D55] bg-[#FFF0EA] px-2.5 py-2"
      : selected
        ? "min-h-[64px] items-center justify-center rounded-[19px] border-[1.5px] border-[#C77A3E] bg-[#FFF2EB] px-2.5 py-2"
        : "min-h-[64px] items-center justify-center rounded-[19px] border-[1.5px] border-[#DCD3C4] border-b-[3px] bg-[#F9F4ED] px-2.5 py-2 active:translate-y-0.5 active:border-b-[1.5px]";
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: matched }}
      disabled={matched}
      onPress={onPress}
      className={className}
    >
      <Text
        className={
          matched
            ? "happy-font-body-bold text-center text-[12.5px] leading-[17px] text-[#56633F]"
            : "happy-font-body-bold text-center text-[12.5px] leading-[17px] text-[#201E1D]"
        }
      >
        {matched ? `✓  ${label}` : label}
      </Text>
    </Pressable>
  );
}

function readPairs(value: unknown): LeverPair[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const pair = readRecord(item);
    const id = readString(pair?.id);
    const left = readString(pair?.left);
    const right = readString(pair?.right);
    return id && left && right ? [{ id, left, right }] : [];
  });
}

function orderRightPairs(pairs: LeverPair[], order: string[]): LeverPair[] {
  if (!order.length) return [...pairs].reverse();
  return order.flatMap((id) => pairs.find((pair) => pair.id === id) ?? []);
}

function readCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.LeverMatch,
    phase: "matching",
    matchedIds: [],
    selectedLeftId: null,
    selectedRightId: null,
    mismatchCount: 0,
    isCorrect: true,
    ...extra,
  };
}
