import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Slider from "@react-native-community/slider";
import * as Haptics from "expo-haptics";
import { CourseExerciseHeading } from "@/src/components/exercise/CourseExerciseHeading";
import {
  readNumber,
  readRecord,
  readString,
  readStringArray,
} from "@/src/components/exercise/courseExerciseContent";
import { COURSE_EXERCISE_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { twoDialSandboxStyles as styles } from "@/src/components/exercise/twoDialSandboxStyles";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import { CourseExerciseCategoryEnum } from "@/src/types/courseExercises";

interface DialPreset {
  id: string;
  label: string;
  load: number;
  recovery: number;
}

const OUTCOMES = {
  HL: {
    title: "Running on fumes",
    body: "High demand, thin refill. The alarm stops switching off between rounds. Tension rises by day; the body stays wired by night.",
    warning: true,
  },
  HH: {
    title: "Stretched but steady",
    body: "Big load, real recovery. Demanding weeks are survivable when the refill keeps pace. Stress is not the enemy; the missing refill is.",
    warning: false,
  },
  LL: {
    title: "Flat and stalled",
    body: "Little asked, little refilled. This is the low-mood loop’s favorite weather. Empty days drain more quietly than hard ones.",
    warning: true,
  },
  LH: {
    title: "Recharged",
    body: "Light load, topped-up tank. This is what the system is steering you back toward after every hard stretch.",
    warning: false,
  },
} as const;

type Quadrant = keyof typeof OUTCOMES;

export function TwoDialSandboxCategoryEngine({
  exercise,
  savedResponse,
  locked = false,
  onInteraction,
}: V1CategoryEngineProps) {
  const content = exercise.content ?? {};
  const saved = readRecord(savedResponse);
  const load = readNumber(saved?.load) ?? 80;
  const recovery = readNumber(saved?.recovery) ?? 25;
  const quadrant = getQuadrant(load, recovery);
  const visited = readStringArray(saved?.visitedQuadrants);
  const presets = readPresets(content.presets);
  const outcome = OUTCOMES[quadrant];

  useEffect(() => {
    if (!saved) {
      onInteraction(createResponse(80, 25, ["HL"]), true);
    }
  }, [onInteraction, saved]);

  const updateDials = (nextLoad: number, nextRecovery: number) => {
    if (locked) return;
    const nextQuadrant = getQuadrant(nextLoad, nextRecovery);
    onInteraction(
      createResponse(
        nextLoad,
        nextRecovery,
        Array.from(new Set([...visited, nextQuadrant])),
      ),
      true,
    );
  };

  const applyPreset = (preset: DialPreset) => {
    Haptics.selectionAsync();
    updateDials(preset.load, preset.recovery);
  };

  return (
    <View style={styles.screenContent}>
      <CourseExerciseHeading
        title={readString(content.title) ?? "Two dials decide your week"}
        instruction={readString(content.instruction) ?? "Twist both dials."}
      />
      <View style={styles.modelCard}>
        <DialControl
          title="Load"
          caption="what the week demands"
          low="quiet"
          high="everything at once"
          value={load}
          color={COURSE_EXERCISE_COLORS.accent}
          disabled={locked}
          onChange={(value) => updateDials(value, recovery)}
        />
        <DialControl
          title="Recovery"
          caption="sleep, breaks, people"
          low="running dry"
          high="topped up"
          value={recovery}
          color={COURSE_EXERCISE_COLORS.accent}
          disabled={locked}
          onChange={(value) => updateDials(load, value)}
        />
        <View style={styles.outcomeRow}>
          <View style={styles.tank}>
            <View style={[styles.tankFill, { height: `${recovery}%` }]} />
          </View>
          <View
            style={[
              styles.outcome,
              outcome.warning ? styles.warning : styles.steady,
            ]}
          >
            <Text style={styles.outcomeTitle}>{outcome.title}</Text>
            <Text style={styles.outcomeBody}>{outcome.body}</Text>
          </View>
        </View>
      </View>
      <View style={styles.presets}>
        {presets.map((preset) => (
          <Pressable
            key={preset.id}
            accessibilityRole="button"
            disabled={locked}
            onPress={() => applyPreset(preset)}
            style={({ pressed }) => [styles.preset, pressed && styles.pressed]}
          >
            <Text style={styles.presetLabel}>{preset.label}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.meta}>
        {visited.length >= 4
          ? "All four states found, including the trap."
          : `${visited.length} of 4 states found. Keep twisting.`}
      </Text>
    </View>
  );
}

function DialControl({
  title,
  caption,
  low,
  high,
  value,
  color,
  disabled,
  onChange,
}: {
  title: string;
  caption: string;
  low: string;
  high: string;
  value: number;
  color: string;
  disabled: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <View style={styles.dial}>
      <View style={styles.dialHeading}>
        <Text style={styles.dialTitle}>{title}</Text>
        <Text style={styles.dialCaption}>{caption}</Text>
      </View>
      <Slider
        accessibilityLabel={`${title}, 0 to 100`}
        disabled={disabled}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={value}
        minimumTrackTintColor={color}
        maximumTrackTintColor={COURSE_EXERCISE_COLORS.border}
        thumbTintColor={color}
        onValueChange={onChange}
        style={styles.slider}
      />
      <View style={styles.rangeLabels}>
        <Text style={styles.rangeLabel}>{low}</Text>
        <Text style={styles.rangeLabel}>{high}</Text>
      </View>
    </View>
  );
}

function createResponse(
  load: number,
  recovery: number,
  visitedQuadrants: string[],
) {
  return {
    format: CourseExerciseCategoryEnum.TwoDialSandbox,
    phase: "sandbox",
    load,
    recovery,
    visitedQuadrants,
    isCorrect: true,
  };
}

function getQuadrant(load: number, recovery: number): Quadrant {
  return `${load >= 50 ? "H" : "L"}${recovery >= 50 ? "H" : "L"}` as Quadrant;
}

function readPresets(value: unknown): DialPreset[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const preset = readRecord(item);
    const id = readString(preset?.id);
    const label = readString(preset?.label);
    const load = readNumber(preset?.load);
    const recovery = readNumber(preset?.recovery);
    return id && label && load != null && recovery != null
      ? [{ id, label, load, recovery }]
      : [];
  });
}
