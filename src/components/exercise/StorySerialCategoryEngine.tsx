import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import { CourseExerciseOptionButton } from "@/src/components/exercise/CourseExerciseOptionButton";
import {
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import { storySerialStyles as styles } from "@/src/components/exercise/storySerialStyles";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface StoryBranch {
  choice: string;
  label: string;
  beats: string[];
}

interface ReflectionOption {
  id: string;
  label: string;
  feedback: string;
}

export function StorySerialCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const branches = readBranches(content.branches);
  const reflectionOptions = readReflectionOptions(content.reflectionOptions);
  const selectedBranchIndex = readIndex(saved?.selectedBranchIndex);
  const mainBeatCount = readIndex(saved?.mainBeatCount) ?? 0;
  const alternateBeatCount = readIndex(saved?.alternateBeatCount) ?? 0;
  const rewinding = saved?.rewinding === true;
  const selectedReflectionId = readString(saved?.selectedReflectionId);
  const selectedBranch =
    selectedBranchIndex == null ? null : branches[selectedBranchIndex];
  const alternateBranch =
    selectedBranchIndex == null ? null : branches[1 - selectedBranchIndex];

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse(), false);
    }
  }, [onInteraction, saved]);

  useEffect(() => {
    if (!selectedBranch || mainBeatCount >= selectedBranch.beats.length) return;
    const timer = setTimeout(() => {
      onInteraction(
        createResponse({
          ...saved,
          mainBeatCount: mainBeatCount + 1,
        }),
        false,
      );
    }, 550);
    return () => clearTimeout(timer);
  }, [mainBeatCount, onInteraction, saved, selectedBranch]);

  useEffect(() => {
    if (!rewinding || !alternateBranch) return;
    if (alternateBeatCount >= alternateBranch.beats.length) return;
    const timer = setTimeout(() => {
      onInteraction(
        createResponse({
          ...saved,
          alternateBeatCount: alternateBeatCount + 1,
        }),
        false,
      );
    }, 550);
    return () => clearTimeout(timer);
  }, [alternateBeatCount, alternateBranch, onInteraction, rewinding, saved]);

  const chooseBranch = (branchIndex: number) => {
    if (locked || selectedBranch) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({
        selectedBranchIndex: branchIndex,
        mainBeatCount: 0,
      }),
      false,
    );
  };

  const rewind = () => {
    if (locked || rewinding) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({ ...saved, rewinding: true, alternateBeatCount: 0 }),
      false,
    );
  };

  const chooseReflection = (option: ReflectionOption) => {
    if (locked) return;
    Haptics.selectionAsync();
    onInteraction(
      createResponse({
        ...saved,
        selectedReflectionId: option.id,
        reflectionFeedback: option.feedback,
      }),
      true,
    );
  };

  const mainComplete = Boolean(
    selectedBranch && mainBeatCount >= selectedBranch.beats.length,
  );
  const alternateComplete = Boolean(
    alternateBranch && alternateBeatCount >= alternateBranch.beats.length,
  );

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Sam’s week"}
        instruction={readString(content.instruction) ?? "Choose what happens."}
      />
      <View style={styles.openingCard}>
        <Text style={styles.episodeLabel}>
          {readString(content.episodeLabel) ?? "EPISODE 1 · SAM’S WEEK"}
        </Text>
        <Text style={styles.opening}>{readString(content.opening)}</Text>
      </View>

      {!selectedBranch ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>YOU CHOOSE FOR SAM</Text>
          {branches.map((branch, index) => (
            <CourseExerciseOptionButton
              key={branch.label}
              label={branch.choice}
              selected={false}
              disabled={locked}
              onPress={() => chooseBranch(index)}
            />
          ))}
        </View>
      ) : null}

      {selectedBranch ? (
        <BeatList
          branch={selectedBranch}
          count={mainBeatCount}
          alternate={false}
        />
      ) : null}
      {alternateBranch && rewinding ? (
        <BeatList
          branch={alternateBranch}
          count={alternateBeatCount}
          alternate
        />
      ) : null}

      {mainComplete && !rewinding ? (
        <Pressable
          accessibilityRole="button"
          onPress={rewind}
          style={({ pressed }) => [
            styles.rewindButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.rewindLabel}>Rewind and walk the other path</Text>
        </Pressable>
      ) : null}

      {alternateComplete ? (
        <View style={styles.section}>
          <Text style={styles.reflectionPrompt}>
            {readString(content.reflectionPrompt)}
          </Text>
          {reflectionOptions.map((option) => (
            <CourseExerciseOptionButton
              key={option.id}
              label={option.label}
              selected={selectedReflectionId === option.id}
              showConfirmationIcon={false}
              disabled={locked}
              onPress={() => chooseReflection(option)}
            />
          ))}
        </View>
      ) : null}

      {selectedReflectionId ? (
        <View style={styles.ending}>
          <Text style={styles.coach}>
            {readString(saved?.reflectionFeedback)}
          </Text>
          <View style={styles.stamp}>
            <Text style={styles.stampText}>{readString(content.stamp)}</Text>
          </View>
          <View style={styles.hook}>
            <Text style={styles.hookText}>{readString(content.hook)}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

function BeatList({
  branch,
  count,
  alternate,
}: {
  branch: StoryBranch;
  count: number;
  alternate: boolean;
}) {
  return (
    <View style={styles.beatList}>
      {branch.beats.slice(0, count).map((beat, index) => (
        <View
          key={`${branch.label}-${index}`}
          style={[styles.beat, alternate && styles.alternateBeat]}
        >
          <Text style={[styles.beatLabel, alternate && styles.alternateLabel]}>
            {alternate ? `THE OTHER PATH · ${branch.label}` : branch.label}
          </Text>
          <Text style={styles.beatText}>{beat}</Text>
        </View>
      ))}
    </View>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.StorySerial,
    phase: "story",
    isCorrect: true,
    ...extra,
  };
}

function readBranches(value: unknown): StoryBranch[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const branch = readRecord(item);
    const choice = readString(branch?.choice);
    const label = readString(branch?.label);
    const beats = readStringArray(branch?.beats);
    return choice && label && beats.length ? [{ choice, label, beats }] : [];
  });
}

function readReflectionOptions(value: unknown): ReflectionOption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const option = readRecord(item);
    const id = readString(option?.id);
    const label = readString(option?.label);
    const feedback = readString(option?.feedback);
    return id && label && feedback ? [{ id, label, feedback }] : [];
  });
}

function readIndex(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) && value >= 0
    ? value
    : null;
}
