import React from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  CourseExerciseTwinColumn,
  type TwinCasePair,
} from "@/src/components/exercise/CourseExerciseTwinColumn";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function TwinCaseCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const pairs = readPairs(content.pairs);
  const matchedPairIds = readStringArray(saved?.matchedPairIds);
  const selectedLeftId = readString(saved?.selectedLeftId);
  const hadMismatch = saved?.hadMismatch === true;
  const rightPairs = orderRightPairs(pairs, content.rightOrderIds);
  const allMatched = pairs.length > 0 && matchedPairIds.length === pairs.length;

  const selectLeft = (pairId: string) => {
    if (locked || matchedPairIds.includes(pairId)) {
      return;
    }

    Haptics.selectionAsync();
    onInteraction(buildResponse(matchedPairIds, pairId, false, false), false);
  };

  const selectRight = (pairId: string) => {
    if (locked || matchedPairIds.includes(pairId) || !selectedLeftId) {
      return;
    }

    if (selectedLeftId !== pairId) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      onInteraction(buildResponse(matchedPairIds, null, false, true), false);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const nextMatchedIds = [...matchedPairIds, pairId];
    const isComplete = nextMatchedIds.length === pairs.length;
    onInteraction(
      buildResponse(nextMatchedIds, null, isComplete, false),
      isComplete,
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Match the two sides"}
        instruction={
          readString(content.instruction) ??
          "Tap a part on the left, then its partner on the right."
        }
      />

      <View style={styles.columns}>
        <CourseExerciseTwinColumn
          title={readString(content.leftTitle) ?? "First model"}
          pairs={pairs}
          side="left"
          matchedPairIds={matchedPairIds}
          selectedLeftId={selectedLeftId}
          disabled={locked}
          onSelect={selectLeft}
        />
        <CourseExerciseTwinColumn
          title={readString(content.rightTitle) ?? "Second model"}
          pairs={rightPairs}
          side="right"
          matchedPairIds={matchedPairIds}
          selectedLeftId={selectedLeftId}
          disabled={locked || !selectedLeftId}
          onSelect={selectRight}
        />
      </View>

      {allMatched ? (
        <View style={styles.reveal}>
          <Text style={styles.revealTitle}>{readString(content.rule)}</Text>
          <Text style={styles.revealBody}>{readString(content.body)}</Text>
          <Text style={styles.next}>{readString(content.next)}</Text>
        </View>
      ) : null}

      <Text style={styles.status}>
        {allMatched
          ? "All four matched."
          : hadMismatch
            ? "Those two do not match. Try another pair."
            : `${matchedPairIds.length} of ${pairs.length} matched`}
      </Text>
    </View>
  );
}

function buildResponse(
  matchedPairIds: string[],
  selectedLeftId: string | null,
  isCorrect: boolean,
  hadMismatch: boolean,
) {
  return {
    format: CourseExerciseCategoryEnum.TwinCase,
    matchedPairIds,
    selectedLeftId,
    hadMismatch,
    isCorrect,
  };
}

function readPairs(value: unknown): TwinCasePair[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map(readRecord)
    .filter((pair): pair is Record<string, unknown> => Boolean(pair))
    .map((pair, index) => ({
      id: readString(pair.id) ?? `pair-${index}`,
      left: readString(pair.left) ?? "",
      right: readString(pair.right) ?? "",
    }))
    .filter((pair) => pair.left.length > 0 && pair.right.length > 0);
}

function orderRightPairs(
  pairs: TwinCasePair[],
  value: unknown,
): TwinCasePair[] {
  const orderIds = readStringArray(value);
  if (orderIds.length !== pairs.length) {
    return pairs;
  }

  return orderIds
    .map((pairId) => pairs.find((pair) => pair.id === pairId))
    .filter((pair): pair is TwinCasePair => Boolean(pair));
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  columns: { flexDirection: "row", gap: 10 },
  status: {
    marginTop: 12,
    color: COURSE_EXERCISE_COLORS.inkSoft,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    textAlign: "center",
  },
  reveal: {
    marginTop: 14,
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderRadius: 28,
    backgroundColor: COURSE_EXERCISE_COLORS.surface,
    shadowColor: COURSE_EXERCISE_COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  revealTitle: {
    color: COURSE_EXERCISE_COLORS.accentDark,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 19,
    lineHeight: 24,
  },
  revealBody: {
    marginTop: 7,
    color: COURSE_EXERCISE_COLORS.ink,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
  next: {
    marginTop: 10,
    color: COURSE_EXERCISE_COLORS.accent,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
    lineHeight: 18,
  },
});
