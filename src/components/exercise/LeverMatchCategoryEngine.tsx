import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  AccessibilityInfo,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { useReducedMotion } from "react-native-reanimated";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import { LeverMatchCard } from "@/src/components/exercise/LeverMatchCard";
import {
  createResponse,
  readCount,
  readPairs,
} from "@/src/components/exercise/leverMatchState";
import type { LeverPair } from "@/src/components/exercise/leverMatchState";
import { useTranslation } from "react-i18next";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";

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
  const { t } = useTranslation("exercises");
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
          LayoutAnimation.create(250, "easeInEaseOut", "opacity"),
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
    const label = pairs.find((p) => p.id === id)?.left;
    if (label)
      AccessibilityInfo.announceForAccessibility(
        t("flow.ui.categoryEngine.leverMatch.leftSelected", { label }),
      );
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
    const label = pairs.find((p) => p.id === id)?.right;
    if (label)
      AccessibilityInfo.announceForAccessibility(
        t("flow.ui.categoryEngine.leverMatch.rightSelected", { label }),
      );
    onInteraction(
      createResponse({ ...saved, selectedLeftId: null, selectedRightId: id }),
      false,
    );
  };

  const resolvePair = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const nextMatched = [...new Set([...matchedIds, leftId])];
      const leftLabel = pairs.find((p) => p.id === leftId)?.left;
      const rightLabel = pairs.find((p) => p.id === leftId)?.right; // same id

      if (nextMatched.length >= pairs.length) {
        AccessibilityInfo.announceForAccessibility(
          t("flow.ui.categoryEngine.leverMatch.allPairsMatched"),
        );
      } else {
        AccessibilityInfo.announceForAccessibility(
          t("flow.ui.categoryEngine.leverMatch.pairMatched", {
            left: leftLabel,
            right: rightLabel,
            matched: nextMatched.length,
            total: pairs.length,
          }),
        );
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
    AccessibilityInfo.announceForAccessibility(
      t("flow.ui.categoryEngine.leverMatch.mismatch"),
    );
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
                <LeverMatchCard
                  label={leftPair.left}
                  selected={selectedLeftId === leftPair.id}
                  matched={matchedIds.includes(leftPair.id)}
                  wrong={wrongPair?.leftId === leftPair.id}
                  showCheck={true}
                  onPress={() => chooseLeft(leftPair.id)}
                />
              </View>
              <View className="flex-1">
                <LeverMatchCard
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
