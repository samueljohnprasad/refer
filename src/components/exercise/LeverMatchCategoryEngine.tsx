import React, { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View, AccessibilityInfo, LayoutAnimation, UIManager, Platform } from "react-native";
import { useReducedMotion } from "react-native-reanimated";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
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
  const matchedIds = readStringArray(saved?.matchedIds);
  const selectedLeftId = readString(saved?.selectedLeftId);
  const selectedRightId = readString(saved?.selectedRightId);
  const mismatchCount = readCount(saved?.mismatchCount);
  const [wrongPair, setWrongPair] = useState<WrongPair | null>(null);
  const clearTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const allMatched = pairs.length > 0 && matchedIds.length >= pairs.length;
  const [orderedRightPairs, setOrderedRightPairs] = useState(() => {
    return allMatched ? pairs : [...pairs].sort(() => Math.random() - 0.5);
  });
  const [hasReordered, setHasReordered] = useState(allMatched);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  useEffect(
    () => () => {
      if (clearTimer.current) clearTimeout(clearTimer.current);
    },
    [],
  );

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (allMatched && !hasReordered) {
      if (!reducedMotion) {
        LayoutAnimation.configureNext(
          LayoutAnimation.create(250, 'easeInEaseOut', 'opacity')
        );
      }
      setOrderedRightPairs(pairs);
      setHasReordered(true);
    }
  }, [allMatched, hasReordered, pairs, reducedMotion]);

  const chooseLeft = (id: string) => {
    if (locked || matchedIds.includes(id) || wrongPair) return;
    Haptics.selectionAsync();
    if (selectedRightId) {
      resolvePair(id, selectedRightId);
      return;
    }
    const label = pairs.find(p => p.id === id)?.left;
    if (label) AccessibilityInfo.announceForAccessibility(`${label} selected. Choose a consequence.`);
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
    const label = pairs.find(p => p.id === id)?.right;
    if (label) AccessibilityInfo.announceForAccessibility(`${label} selected. Choose an action.`);
    onInteraction(
      createResponse({ ...saved, selectedLeftId: null, selectedRightId: id }),
      false,
    );
  };

  const resolvePair = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const nextMatched = [...new Set([...matchedIds, leftId])];
      const leftLabel = pairs.find(p => p.id === leftId)?.left;
      const rightLabel = pairs.find(p => p.id === leftId)?.right; // same id
      
      if (nextMatched.length >= pairs.length) {
        AccessibilityInfo.announceForAccessibility("All 3 pairs matched.");
      } else {
        AccessibilityInfo.announceForAccessibility(`${leftLabel} matched with ${rightLabel}. ${nextMatched.length} of ${pairs.length} matched.`);
      }
      
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
    AccessibilityInfo.announceForAccessibility("Not a match. Try again.");
    setWrongPair({ leftId, rightId });
    const nextMismatchCount = mismatchCount + 1;
    onInteraction(
      createResponse({
        ...saved,
        matchedIds,
        mismatchCount: nextMismatchCount,
        selectedLeftId: null,
        selectedRightId: null,
      }),
      matchedIds.length >= pairs.length,
    );
    clearTimer.current = setTimeout(() => setWrongPair(null), 420);
  };

  return (
    <View className="px-2 pb-3 pt-0">
      <CourseExerciseHeading
        title={readString(content.title) ?? "Match the levers"}
        instruction={
          readString(content.instruction) ?? "Tap one item from each side."
        }
      />

      <View className="gap-2">
        {pairs.map((leftPair, index) => {
          const rightPair = orderedRightPairs[index];
          return (
            <View className="flex-row gap-2" key={leftPair.id}>
              <View className="flex-1">
                <MatchCard
                  label={leftPair.left}
                  selected={selectedLeftId === leftPair.id}
                  matched={matchedIds.includes(leftPair.id)}
                  wrong={wrongPair?.leftId === leftPair.id}
                  showCheck={true}
                  onPress={() => chooseLeft(leftPair.id)}
                />
              </View>
              <View className="flex-1">
                <MatchCard
                  key={rightPair.id}
                  label={rightPair.right}
                  selected={selectedRightId === rightPair.id}
                  matched={matchedIds.includes(rightPair.id)}
                  wrong={wrongPair?.rightId === rightPair.id}
                  showCheck={false}
                  onPress={() => chooseRight(rightPair.id)}
                />
              </View>
            </View>
          );
        })}
      </View>

      {!allMatched && (
        <Text className="happy-font-body mt-3 text-center text-xs text-[#82796A]">
          {matchedIds.length} of {pairs.length} matched
        </Text>
      )}

      {!allMatched ? (
        mismatchCount >= 2 ? (
          <View className="mt-3 rounded-[16px] border border-[#E8DCCB] bg-[#FDF8F3] px-4 py-3">
            <Text className="happy-font-body text-[13px] leading-[18px] text-[#82796A]">
              {readString(content.clue)}
            </Text>
          </View>
        ) : null
      ) : (
        <View className="mt-4 rounded-[16px] border border-[#E8DCCB] bg-[#FDF8F3] px-4 py-4">
          <Text className="happy-font-heading-bold text-[14px] tracking-wider text-[#55694A] mb-2 uppercase">
            {readString(content.feedbackTitle) ?? "THE PATTERN"}
          </Text>
          <Text className="happy-font-body text-[14px] leading-[20px] text-[#201E1D]">
            {readString(content.feedback)}
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
  showCheck,
  onPress,
}: {
  label: string;
  selected: boolean;
  matched: boolean;
  wrong: boolean;
  showCheck?: boolean;
  onPress: () => void;
}) {
  const className = matched
    ? "min-h-[56px] justify-center rounded-[16px] border border-[#ABC0A2] bg-[#F2F8EF] px-3 py-1.5"
    : wrong
      ? "min-h-[64px] justify-center rounded-[16px] border-[1.5px] border-[#D1A796] bg-[#FFF5F0] px-3 py-2"
      : selected
        ? "min-h-[64px] justify-center rounded-[16px] border-[1.5px] border-[#7E9874] bg-[#F2F8EF] px-3 py-2"
        : "min-h-[64px] justify-center rounded-[16px] border border-[#E8DCCB] bg-[#FDF8F3] px-3 py-2 active:bg-[#F2ECE4]";
  
  const textClassName = matched
    ? "happy-font-body-bold text-center text-[13px] leading-[18px] text-[#3F4A31]"
    : "happy-font-body-bold text-center text-[13px] leading-[18px] text-[#201E1D]";

  // Accessibility announcement strings
  const stateLabel = matched ? "matched" : selected ? "selected" : "unmatched";

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: matched }}
      accessibilityLabel={`${label}, ${stateLabel}`}
      disabled={matched}
      onPress={onPress}
      className={className}
    >
      <Text className={textClassName}>
        {matched && showCheck ? `✓ ${label}` : label}
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
