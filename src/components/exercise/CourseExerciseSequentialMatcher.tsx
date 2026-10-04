import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { type TwinCasePair } from "@/src/components/exercise/CourseExerciseTwinColumn";
import { SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { sequentialMatcherStyles } from "@/src/components/exercise/courseExerciseSequentialMatcherStyles";
import { readString } from "@/src/components/exercise/courseExerciseContent";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function CourseExerciseSequentialMatcher({
  content,
  pairs,
  rightPairs,
  formedPairs,
  locked,
  lockedPairIds,
  isCorrect,
  onInteraction,
  buildResponse,
}: {
  content: Record<string, unknown>;
  pairs: TwinCasePair[];
  rightPairs: TwinCasePair[];
  formedPairs: Record<string, string>;
  locked: boolean;
  lockedPairIds: string[];
  isCorrect: boolean;
  onInteraction: (res: any, isComplete: boolean) => void;
  buildResponse: (f: Record<string, string>, s: string | null, isC: boolean) => any;
}) {
  const translateCopy = useExerciseCopy();
  const checkHasRun = locked;
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-advance when all previous are filled, unless locked
  useEffect(() => {
    if (locked) return;
    const firstUnmatched = pairs.findIndex(p => !Object.keys(formedPairs).includes(p.id));
    if (firstUnmatched !== -1 && firstUnmatched > activeIndex) {
      setActiveIndex(firstUnmatched);
    }
  }, [formedPairs, pairs, activeIndex, locked]);

  const currentPair = pairs[activeIndex];

  const handleMatch = (rightId: string) => {
    if (locked) return;
    Haptics.selectionAsync();

    const newPairs = { ...formedPairs, [currentPair.id]: rightId };
    
    // Clear any previous left that had this right
    const duplicateLeft = Object.keys(newPairs).find(k => k !== currentPair.id && newPairs[k] === rightId);
    if (duplicateLeft) {
      delete newPairs[duplicateLeft];
    }

    const nextNumMatched = Object.keys(newPairs).length;
    const isComplete = nextNumMatched === pairs.length;

    let nextIsCorrect = true;
    for (const [l, r] of Object.entries(newPairs)) {
      if (l !== r) nextIsCorrect = false;
    }

    onInteraction(buildResponse(newPairs, null, nextIsCorrect), isComplete);
    
    // Auto-advance if not on last
    if (activeIndex < pairs.length - 1) {
      setTimeout(() => setActiveIndex(activeIndex + 1), 200);
    }
  };

  const showReveal = checkHasRun && isCorrect;
  const showTryAgain = checkHasRun && !isCorrect;

  return (
    <View style={sequentialMatcherStyles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? translateCopy("Signal or verdict?")}
        instruction={
          readString(content.instruction) ??
          translateCopy("Match the observation with the most useful reading.")
        }
      />

      <View style={sequentialMatcherStyles.navHeader}>
        <Pressable
          hitSlop={16}
          onPress={() => {
            Haptics.selectionAsync();
            setActiveIndex(Math.max(0, activeIndex - 1));
          }}
          disabled={activeIndex === 0}
          style={({ pressed }) => [
            sequentialMatcherStyles.navButton,
            activeIndex === 0 && sequentialMatcherStyles.navDisabled,
            pressed && sequentialMatcherStyles.navPressed,
          ]}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={activeIndex === 0 ? SEMANTIC_COLORS.text.disabled : SEMANTIC_COLORS.brand.primary} />
        </Pressable>

        <Text style={sequentialMatcherStyles.progressText}>
          {translateCopy("{{current}} of {{total}}", {
            current: activeIndex + 1,
            total: pairs.length,
          })}
        </Text>

        <Pressable
          hitSlop={16}
          onPress={() => {
            Haptics.selectionAsync();
            setActiveIndex(Math.min(pairs.length - 1, activeIndex + 1));
          }}
          disabled={activeIndex === pairs.length - 1}
          style={({ pressed }) => [
            sequentialMatcherStyles.navButton,
            activeIndex === pairs.length - 1 && sequentialMatcherStyles.navDisabled,
            pressed && sequentialMatcherStyles.navPressed,
          ]}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={activeIndex === pairs.length - 1 ? SEMANTIC_COLORS.text.disabled : SEMANTIC_COLORS.brand.primary} />
        </Pressable>
      </View>

      <Text style={sequentialMatcherStyles.sectionLabel}>
        {translateCopy("OBSERVATION")}
      </Text>
      <View style={sequentialMatcherStyles.observationCard}>
        <Text style={sequentialMatcherStyles.observationText}>{currentPair.left}</Text>
      </View>

      <Text style={sequentialMatcherStyles.sectionLabel}>
        {translateCopy("Which reading fits?")}
      </Text>
      <View style={sequentialMatcherStyles.optionsContainer}>
        {rightPairs.map((rp) => {
          const isAssignedToOther = Object.entries(formedPairs).some(([l, r]) => r === rp.id && l !== currentPair.id);
          const isSelectedForCurrent = formedPairs[currentPair.id] === rp.id;

          return (
            <Pressable
              key={rp.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelectedForCurrent, disabled: locked }}
              disabled={locked || lockedPairIds.includes(currentPair.id)}
              onPress={() => handleMatch(rp.id)}
              style={({ pressed }) => [
                sequentialMatcherStyles.optionCard,
                isSelectedForCurrent && sequentialMatcherStyles.selectedOption,
                isAssignedToOther && !isSelectedForCurrent && sequentialMatcherStyles.disabledOption,
                pressed && !locked && sequentialMatcherStyles.pressedOption,
                locked && isSelectedForCurrent && isCorrect && sequentialMatcherStyles.correctOption,
lockedPairIds.includes(currentPair.id) && isSelectedForCurrent && sequentialMatcherStyles.correctOption,
                locked && isSelectedForCurrent && !isCorrect && sequentialMatcherStyles.incorrectOption,
              ]}
            >
              <View style={[
                sequentialMatcherStyles.radio,
                isSelectedForCurrent && sequentialMatcherStyles.radioSelected,
                isAssignedToOther && !isSelectedForCurrent && sequentialMatcherStyles.radioDisabled,
              ]} />
              <Text style={[
                sequentialMatcherStyles.optionText,
                isAssignedToOther && !isSelectedForCurrent && sequentialMatcherStyles.optionTextDisabled,
              ]}>
                {rp.right}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {showReveal ? (
        <View style={sequentialMatcherStyles.reveal}>
          <Text style={sequentialMatcherStyles.revealTitle}>{readString(content.rule)}</Text>
          <Text style={sequentialMatcherStyles.revealBody}>{readString(content.body)}</Text>
          <Text style={sequentialMatcherStyles.next}>{readString(content.next)}</Text>
        </View>
      ) : null}
      
      {showTryAgain ? (
        <Text style={sequentialMatcherStyles.statusError}>
          {translateCopy("Not quite right. Try adjusting your matches.")}
        </Text>
      ) : null}
    </View>
  );
}
