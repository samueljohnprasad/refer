import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import { guidedRecallChipsStyles as styles } from "@/src/components/exercise/guidedRecallChipsStyles";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function GuidedRecallChipsCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const answer = readStringArray(content.answer);
  const chips = readStringArray(content.chips);
  const selectedChips = readStringArray(saved?.selectedChips);

  useEffect(() => {
    if (!saved) onInteraction(createResponse(), false);
  }, [onInteraction, saved]);

  const updateSelection = (nextChips: string[]) => {
    const complete = nextChips.length === answer.length;
    const correct = complete && arraysMatch(nextChips, answer);
    const correctPositions = nextChips.filter(
      (chip, index) => chip === answer[index],
    ).length;
    onInteraction(
      createResponse({
        ...saved,
        selectedChips: nextChips,
        isCorrect: correct,
        feedbackText:
          complete && !correct
            ? `${correctPositions} of ${answer.length} in the right place. Look at where the chain starts and ends.`
            : null,
      }),
      complete,
    );
  };

  const addChip = (chip: string) => {
    if (locked || selectedChips.includes(chip)) return;
    if (selectedChips.length >= answer.length) return;
    Haptics.selectionAsync();
    updateSelection([...selectedChips, chip]);
  };

  const removeChip = (index: number) => {
    if (locked) return;
    Haptics.selectionAsync();
    updateSelection(
      selectedChips.filter((_, chipIndex) => chipIndex !== index),
    );
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Rebuild the loop"}
        instruction={
          readString(content.instruction) ?? "Tap the chips in order."
        }
        prompt={readString(content.prompt)}
      />

      <View style={styles.tray}>
        {selectedChips.length === 0 ? (
          <Text style={styles.trayHint}>Tap the chips below, in order</Text>
        ) : (
          <View style={styles.chipWrap}>
            {selectedChips.map((chip, index) => (
              <RecallChip
                key={`${chip}-${index}`}
                label={chip}
                number={index + 1}
                selected
                disabled={locked}
                onPress={() => removeChip(index)}
              />
            ))}
          </View>
        )}
      </View>

      <View style={styles.pool}>
        {chips.map((chip) => {
          const used = selectedChips.includes(chip);
          return (
            <RecallChip
              key={chip}
              label={chip}
              disabled={locked || used}
              muted={used}
              onPress={() => addChip(chip)}
            />
          );
        })}
      </View>
    </View>
  );
}

function RecallChip({
  disabled,
  label,
  muted = false,
  number,
  onPress,
  selected = false,
}: {
  disabled: boolean;
  label: string;
  muted?: boolean;
  number?: number;
  onPress: () => void;
  selected?: boolean;
}) {
  return (
    <View style={[styles.chipContainer, muted && styles.mutedChip]}>
      <View style={[styles.chipRim, selected && styles.chipSelectedRim]} />
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        style={({ pressed }) => [
          styles.chip,
          selected && styles.selectedChip,
          pressed && styles.pressedChip,
        ]}
      >
        {number ? (
          <View style={styles.chipNumber}>
            <Text style={styles.chipNumberLabel}>{number}</Text>
          </View>
        ) : null}
        <Text style={[styles.chipLabel, selected && styles.selectedLabel]}>{label}</Text>
      </Pressable>
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    category: CourseExerciseCategoryEnum.guided_recall_chips,
    selectedChips: [],
    ...extra,
  };
}

function arraysMatch(a: string[], b: string[]) {
  return a.length === b.length && a.every((val, index) => val === b[index]);
}
