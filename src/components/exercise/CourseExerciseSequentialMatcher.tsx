import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { type TwinCasePair } from "@/src/components/exercise/CourseExerciseTwinColumn";
import {
  COURSE_EXERCISE_FONTS,
  SEMANTIC_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { readString } from "@/src/components/exercise/courseExerciseContent";
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
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Signal or verdict?"}
        instruction={
          readString(content.instruction) ??
          "Match the observation with the most useful reading."
        }
      />

      <View style={styles.navHeader}>
        <Pressable
          hitSlop={16}
          onPress={() => {
            Haptics.selectionAsync();
            setActiveIndex(Math.max(0, activeIndex - 1));
          }}
          disabled={activeIndex === 0}
          style={({ pressed }) => [
            styles.navButton,
            activeIndex === 0 && styles.navDisabled,
            pressed && styles.navPressed,
          ]}
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={20} color={activeIndex === 0 ? SEMANTIC_COLORS.text.disabled : SEMANTIC_COLORS.brand.primary} />
        </Pressable>

        <Text style={styles.progressText}>
          {activeIndex + 1} of {pairs.length}
        </Text>

        <Pressable
          hitSlop={16}
          onPress={() => {
            Haptics.selectionAsync();
            setActiveIndex(Math.min(pairs.length - 1, activeIndex + 1));
          }}
          disabled={activeIndex === pairs.length - 1}
          style={({ pressed }) => [
            styles.navButton,
            activeIndex === pairs.length - 1 && styles.navDisabled,
            pressed && styles.navPressed,
          ]}
        >
          <HugeiconsIcon icon={ArrowRight01Icon} size={20} color={activeIndex === pairs.length - 1 ? SEMANTIC_COLORS.text.disabled : SEMANTIC_COLORS.brand.primary} />
        </Pressable>
      </View>

      <Text style={styles.sectionLabel}>OBSERVATION</Text>
      <View style={styles.observationCard}>
        <Text style={styles.observationText}>{currentPair.left}</Text>
      </View>

      <Text style={styles.sectionLabel}>Which reading fits?</Text>
      <View style={styles.optionsContainer}>
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
                styles.optionCard,
                isSelectedForCurrent && styles.selectedOption,
                isAssignedToOther && !isSelectedForCurrent && styles.disabledOption,
                pressed && !locked && styles.pressedOption,
                locked && isSelectedForCurrent && isCorrect && styles.correctOption,
lockedPairIds.includes(currentPair.id) && isSelectedForCurrent && styles.correctOption,
                locked && isSelectedForCurrent && !isCorrect && styles.incorrectOption,
              ]}
            >
              <View style={[
                styles.radio,
                isSelectedForCurrent && styles.radioSelected,
                isAssignedToOther && !isSelectedForCurrent && styles.radioDisabled,
              ]} />
              <Text style={[
                styles.optionText,
                isAssignedToOther && !isSelectedForCurrent && styles.optionTextDisabled,
              ]}>
                {rp.right}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {showReveal ? (
        <View style={styles.reveal}>
          <Text style={styles.revealTitle}>{readString(content.rule)}</Text>
          <Text style={styles.revealBody}>{readString(content.body)}</Text>
          <Text style={styles.next}>{readString(content.next)}</Text>
        </View>
      ) : null}
      
      {showTryAgain ? (
         <Text style={styles.statusError}>Not quite right. Try adjusting your matches.</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screenContent: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 12,
  },
  navHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  navButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  navDisabled: {
    backgroundColor: "transparent",
  },
  navPressed: {
    opacity: 0.7,
  },
  progressText: {
    color: SEMANTIC_COLORS.brand.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
  },
  sectionLabel: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 8,
    textAlign: "center",
  },
  observationCard: {
    minHeight: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderBottomWidth: 4,
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 22,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  observationText: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  optionsContainer: {
    gap: 12,
    marginTop: 4,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 64,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 20,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  selectedOption: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  disabledOption: {
    opacity: 0.5,
  },
  pressedOption: {
    opacity: 0.7,
  },
  correctOption: {
    borderColor: SEMANTIC_COLORS.success.foreground,
    backgroundColor: "#F2F8EF",
  },
  incorrectOption: {
    borderColor: SEMANTIC_COLORS.error.foreground,
    backgroundColor: "#FFF0EA",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: SEMANTIC_COLORS.border.default,
    marginRight: 12,
  },
  radioSelected: {
    borderColor: SEMANTIC_COLORS.brand.primary,
    backgroundColor: SEMANTIC_COLORS.brand.primary,
  },
  radioDisabled: {
    borderColor: SEMANTIC_COLORS.text.disabled,
  },
  optionText: {
    flex: 1,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 20,
  },
  optionTextDisabled: {
    color: SEMANTIC_COLORS.text.disabled,
  },
  reveal: {
    marginTop: 24,
    paddingHorizontal: 22,
    paddingVertical: 20,
    borderRadius: 28,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
    shadowColor: SEMANTIC_COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
  },
  revealTitle: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 19,
    lineHeight: 24,
  },
  revealBody: {
    marginTop: 7,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13.5,
    lineHeight: 20,
  },
  next: {
    marginTop: 10,
    color: SEMANTIC_COLORS.brand.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
    lineHeight: 18,
  },
  statusError: {
    marginTop: 16,
    color: SEMANTIC_COLORS.error.foreground,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 13,
    textAlign: "center",
  },
});
