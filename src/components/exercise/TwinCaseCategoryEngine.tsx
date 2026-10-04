import React, { useState } from "react";
import { Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  CourseExerciseTwinColumn,
  type TwinCasePair,
} from "@/src/components/exercise/CourseExerciseTwinColumn";
import { CourseExerciseSequentialMatcher } from "@/src/components/exercise/CourseExerciseSequentialMatcher";
import { twinCaseStyles } from "@/src/components/exercise/twinCaseStyles";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { translateStepCopyProps } from "@/src/lib/i18n/exerciseCopy";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

const NUMBER_BADGES = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨", "⑩"];

export function TwinCaseCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const translateCopy = useExerciseCopy();
  const content = translateStepCopyProps(exercise.content ?? {}, translateCopy);
  const saved = readRecord(savedResponse);
  const pairs = readPairs(content.pairs);
  
  const presentation = readString(content.presentation) === "sequential" ? "sequential" : "columns";
  const rightPairs = orderRightPairs(pairs, content.rightOrderIds);

  const formedPairs = (saved?.formedPairs as Record<string, string>) ?? {};
  const selectedLeftId = readString(saved?.selectedLeftId);
  const isCorrect = saved?.isCorrect === true;
  const checkHasRun = locked;
  const lockedPairIds = readStringArray(saved?.lockedPairIds);

  const numMatched = Object.keys(formedPairs).length;
  const allMatched = pairs.length > 0 && numMatched === pairs.length;

  const leftPairIdentifiers: Record<string, string> = {};
  const rightPairIdentifiers: Record<string, string> = {};

  pairs.forEach((pair, index) => {
    const badge = NUMBER_BADGES[index] ?? String(index + 1);
    if (formedPairs[pair.id]) {
      const rightId = formedPairs[pair.id];
      let finalBadge = badge;
      if (checkHasRun) {
        if (pair.id === rightId) {
          finalBadge = "✓";
        } else {
          finalBadge = "!";
        }
      } else if (lockedPairIds.includes(pair.id)) {
        finalBadge = "✓";
      }
      leftPairIdentifiers[pair.id] = finalBadge;
      rightPairIdentifiers[rightId] = finalBadge;
    }
  });

  const selectLeft = (pairId: string) => {
    if (locked || lockedPairIds.includes(pairId)) return;

    if (formedPairs[pairId]) {
      Haptics.selectionAsync();
      const newPairs = { ...formedPairs };
      delete newPairs[pairId];
      onInteraction(buildResponse(newPairs, selectedLeftId, false, lockedPairIds), false);
      return;
    }

    Haptics.selectionAsync();
    onInteraction(buildResponse(formedPairs, pairId, false, lockedPairIds), false);
  };

  const selectRight = (pairId: string) => {
    if (locked) return;
    
    // Determine if right item is permanently locked
    const isPermanentlyLocked = lockedPairIds.includes(pairId);
    if (isPermanentlyLocked) return;

    if (!selectedLeftId) {
      const existingLeft = Object.keys(formedPairs).find(k => formedPairs[k] === pairId);
      if (existingLeft && !lockedPairIds.includes(existingLeft)) {
        Haptics.selectionAsync();
        const newPairs = { ...formedPairs };
        delete newPairs[existingLeft];
        onInteraction(buildResponse(newPairs, null, false, lockedPairIds), false);
      }
      return;
    }

    Haptics.selectionAsync();
    const newPairs = { ...formedPairs, [selectedLeftId]: pairId };
    const nextNumMatched = Object.keys(newPairs).length;
    const isComplete = nextNumMatched === pairs.length;

    let nextIsCorrect = true;
    for (const [l, r] of Object.entries(newPairs)) {
      if (l !== r) nextIsCorrect = false;
    }

    onInteraction(
      buildResponse(newPairs, null, nextIsCorrect, lockedPairIds),
      isComplete
    );
  };

  if (presentation === "sequential") {
    return (
      <CourseExerciseSequentialMatcher
        content={content}
        pairs={pairs}
        rightPairs={rightPairs}
        formedPairs={formedPairs}
        locked={locked}
        lockedPairIds={lockedPairIds}
        isCorrect={isCorrect}
        onInteraction={onInteraction}
        buildResponse={(f, s, isC) => buildResponse(f, s, isC, lockedPairIds)}
      />
    );
  }

  const leftMatchedIds = Object.keys(formedPairs);
  const rightMatchedIds = Object.values(formedPairs);

  const showReveal = checkHasRun && isCorrect;
  const showTryAgain = checkHasRun && !isCorrect;
  console.log('TwinCase Check:', { checkHasRun, isCorrect, formedPairs, lockedPairIds });
  const correctMatchedIds = Object.entries(formedPairs).filter(([l, r]) => l === r).map(([l]) => l);

  // If there are locked pair IDs but we are not locked, the user is retrying
  const isRetrying = !checkHasRun && lockedPairIds.length > 0;
  const retryCount = pairs.length - lockedPairIds.length;

  return (
    <View style={twinCaseStyles.screenContent}>
      <CourseExerciseHeading
        title={
          readString(content.title) ?? translateCopy("Match the two sides")
        }
        instruction={
          readString(content.instruction) ??
          translateCopy("Tap an observation, then its useful reading.")
        }
      />

      <View style={twinCaseStyles.columns}>
        <CourseExerciseTwinColumn
          title={readString(content.leftTitle) ?? translateCopy("Observation")}
          pairs={pairs}
          side="left"
          matchedPairIds={leftMatchedIds}
          selectedLeftId={selectedLeftId}
          disabled={locked}
          showCorrectness={checkHasRun}
          correctIds={correctMatchedIds}
          disabledIds={lockedPairIds}
          pairIdentifiers={leftPairIdentifiers}
          onSelect={selectLeft}
        />
        <CourseExerciseTwinColumn
          title={readString(content.rightTitle) ?? translateCopy("Useful reading")}
          pairs={rightPairs}
          side="right"
          matchedPairIds={rightMatchedIds}
          selectedLeftId={selectedLeftId}
          disabled={locked}
          showCorrectness={checkHasRun}
          correctIds={correctMatchedIds}
          disabledIds={lockedPairIds}
          pairIdentifiers={rightPairIdentifiers}
          onSelect={selectRight}
        />
      </View>

      {showReveal ? (
        <View style={twinCaseStyles.reveal}>
          <Text style={twinCaseStyles.revealTitle}>{readString(content.rule)}</Text>
          <Text style={twinCaseStyles.revealBody}>{readString(content.body)}</Text>
          <Text style={twinCaseStyles.next}>{readString(content.next)}</Text>
        </View>
      ) : null}

      <Text style={[twinCaseStyles.status, showTryAgain && twinCaseStyles.statusError]}>
        {showReveal
          ? translateCopy("All four matched.")
          : showTryAgain
            ? translateCopy(
                retryCount === 1
                  ? "{{count}} pair needs another look."
                  : "{{count}} pairs need another look.",
                { count: retryCount },
              )
            : isRetrying && numMatched < pairs.length
              ? translateCopy(
                  retryCount === 1
                    ? "{{count}} pair left to match"
                    : "{{count}} pairs left to match",
                  { count: retryCount },
                )
              : translateCopy("{{count}} of {{total}} matched", {
                  count: numMatched,
                  total: pairs.length,
                })}
      </Text>
    </View>
  );
}

function buildResponse(
  formedPairs: Record<string, string>,
  selectedLeftId: string | null,
  isCorrect: boolean,
  lockedPairIds: string[] = [],
) {
  return {
    format: CourseExerciseCategoryEnum.TwinCase,
    formedPairs,
    matchedPairIds: Object.keys(formedPairs),
    selectedLeftId,
    hadMismatch: false,
    lockedPairIds,
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
    const shuffled = [...pairs].sort(() => Math.random() - 0.5);
    // ensure not identical to left column
    if (pairs.length > 1) {
      let isIdentical = true;
      for (let i = 0; i < pairs.length; i++) {
        if (pairs[i].id !== shuffled[i].id) {
          isIdentical = false;
          break;
        }
      }
      if (isIdentical) {
        const temp = shuffled[0];
        shuffled[0] = shuffled[1];
        shuffled[1] = temp;
      }
    }
    return shuffled;
  }

  return orderIds
    .map((pairId) => pairs.find((pair) => pair.id === pairId))
    .filter((pair): pair is TwinCasePair => Boolean(pair));
}
