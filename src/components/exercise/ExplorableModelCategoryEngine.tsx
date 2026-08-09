import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  MayaAlarmChart,
  getMayaAlarmVerdict,
} from "@/src/components/exercise/MayaAlarmChart";
import {
  readNumber,
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import { COURSE_EXERCISE_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { explorableModelStyles as styles } from "@/src/components/exercise/explorableModelStyles";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

export function ExplorableModelCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const stage = Math.min(readNumber(saved?.stage) ?? 0, 3);
  const load = readNumber(saved?.load) ?? 70;
  const walk = saved?.walk === true;
  const replay = saved?.replay === true;
  const coffee = saved?.coffee === true;
  const stories = readStringArray(content.stories);
  const goals = readStringArray(content.goals);
  const inputs = { load, walk, replay, coffee };
  const verdict = getMayaAlarmVerdict(stage, inputs);

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse(), true);
    }
  }, [onInteraction, saved]);

  const update = (changes: Record<string, unknown>) => {
    if (locked) return;
    onInteraction(createResponse({ ...saved, ...changes }), true);
  };

  const toggle = (key: "walk" | "replay" | "coffee", value: boolean) => {
    Haptics.selectionAsync();
    update({ [key]: !value });
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Put Maya’s alarm to rest"}
        instruction={
          readString(content.instruction) ?? "Open one lever at a time."
        }
      />
      <View style={styles.storyCard}>
        <Text style={styles.story}>{stories[stage]}</Text>
      </View>
      <View style={styles.modelCard}>
        <MayaAlarmChart {...inputs} showThreshold={stage >= 2} />
        <View style={styles.loadHeading}>
          <Text style={styles.loadTitle}>The day’s load</Text>
          <Text style={styles.loadCaption}>{getLoadLabel(load)}</Text>
        </View>
        <Slider
          accessibilityLabel="How demanding the day is"
          disabled={locked}
          minimumValue={0}
          maximumValue={100}
          step={1}
          value={load}
          minimumTrackTintColor={COURSE_EXERCISE_COLORS.accent}
          maximumTrackTintColor={COURSE_EXERCISE_COLORS.border}
          thumbTintColor={COURSE_EXERCISE_COLORS.accent}
          onValueChange={(value) => update({ load: value })}
          style={styles.slider}
        />
      </View>

      {stage >= 1 ? (
        <View style={styles.levers}>
          <LeverPill
            active={walk}
            label={walk ? "20-min lunch walk: ON" : "20-min lunch walk: off"}
            onPress={() => toggle("walk", walk)}
          />
          {stage >= 2 ? (
            <LeverPill
              active={replay}
              label={replay ? "10pm replay of the day: ON" : "10pm replay: off"}
              onPress={() => toggle("replay", replay)}
            />
          ) : null}
          {stage >= 3 ? (
            <LeverPill
              active={coffee}
              label={
                coffee ? "4pm double espresso: ON" : "4pm double espresso: off"
              }
              onPress={() => toggle("coffee", coffee)}
            />
          ) : null}
        </View>
      ) : null}

      <View
        style={[
          styles.verdict,
          verdict.positive ? styles.positive : styles.warning,
        ]}
      >
        <Text style={styles.verdictTitle}>{verdict.title}</Text>
        <Text style={styles.verdictBody}>{verdict.body}</Text>
      </View>

      {stage >= 3 ? (
        <View style={styles.goals}>
          {goals.map((goal) => (
            <View key={goal} style={styles.goal}>
              <Text style={styles.goalText}>{goal}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function LeverPill({
  active,
  label,
  onPress,
}: {
  active: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.lever,
        active && styles.activeLever,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.leverText, active && styles.activeLeverText]}>
        {label}
      </Text>
    </Pressable>
  );
}

function createResponse(extra: Record<string, unknown> = {}) {
  return {
    format: CourseExerciseCategoryEnum.ExplorableModel,
    phase: "model",
    stage: 0,
    load: 70,
    walk: false,
    replay: false,
    coffee: false,
    isCorrect: true,
    ...extra,
  };
}

function getLoadLabel(load: number): string {
  if (load < 25) return "a quiet one";
  if (load < 55) return "busy but breathing";
  if (load < 80) return "back-to-back";
  return "everything at once";
}
