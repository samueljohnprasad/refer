import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import {
  COURSE_EXERCISE_COLORS,
  COURSE_EXERCISE_FONTS,
} from "@/src/components/exercise/courseExerciseTheme";
import { NodeEngineRouter } from "@/src/components/node/NodeEngineRouter";
import { FIRST_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-first-five";
import { NEXT_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-next-five";
import { THIRD_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-third-five";
import { FOURTH_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-fourth-five";
import { FIFTH_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-fifth-five";
import { SIXTH_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-sixth-five";
import { SEVENTH_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-seventh-five";
import { EIGHTH_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-eighth-five";
import { NINTH_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-ninth-five";
import { TENTH_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-tenth-five";
import { ELEVENTH_FIVE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-eleventh-five";
import { FINAL_THREE_COURSE_EXERCISES } from "@/src/data/mock/course-exercises-final-three";
import type { Exercise } from "@/src/types/journeyV5";

const ALL_COURSE_EXERCISES = [
  ...FIRST_FIVE_COURSE_EXERCISES,
  ...NEXT_FIVE_COURSE_EXERCISES,
  ...THIRD_FIVE_COURSE_EXERCISES,
  ...FOURTH_FIVE_COURSE_EXERCISES,
  ...FIFTH_FIVE_COURSE_EXERCISES,
  ...SIXTH_FIVE_COURSE_EXERCISES,
  ...SEVENTH_FIVE_COURSE_EXERCISES,
  ...EIGHTH_FIVE_COURSE_EXERCISES,
  ...NINTH_FIVE_COURSE_EXERCISES,
  ...TENTH_FIVE_COURSE_EXERCISES,
  ...ELEVENTH_FIVE_COURSE_EXERCISES,
  ...FINAL_THREE_COURSE_EXERCISES,
];

interface ActiveRun {
  exercises: Exercise[];
  nodeId: string;
}

export default function CourseExercisesTestScreen() {
  const [runNumber, setRunNumber] = useState(0);
  const [activeRun, setActiveRun] = useState<ActiveRun | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  const labels = useMemo(
    () =>
      ALL_COURSE_EXERCISES.map((exercise) => ({
        id: exercise.id,
        title: readLabel(exercise.content?.title, exercise.type),
        format: exercise.type.replaceAll("_", " "),
      })),
    [],
  );

  const startRun = (exercises: Exercise[]) => {
    const nextRunNumber = runNumber + 1;
    Haptics.selectionAsync();
    setRunNumber(nextRunNumber);
    setActiveRun({
      exercises,
      nodeId: `course-exercise-test-${Date.now()}-${nextRunNumber}`,
    });
  };

  if (activeRun) {
    return (
      <NodeEngineRouter
        nodeId={activeRun.nodeId}
        exercises={activeRun.exercises}
        onClose={() => setActiveRun(null)}
        onNodeComplete={() => {
          setCompletedIds((currentIds) => [
            ...new Set([
              ...currentIds,
              ...activeRun.exercises.map((exercise) => exercise.id),
            ]),
          ]);
          setActiveRun(null);
        }}
      />
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F5EAD8]"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="px-[22px] pb-12 pt-[22px]"
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          header: undefined,
          headerShown: true,
          headerTransparent: false,
          headerBackButtonDisplayMode: "minimal",
          title: "Course Exercises",
          headerStyle: { backgroundColor: COURSE_EXERCISE_COLORS.background },
          headerShadowVisible: false,
          headerTintColor: COURSE_EXERCISE_COLORS.ink,
          headerTitleStyle: { fontFamily: COURSE_EXERCISE_FONTS.bodyBold },
        }}
      />

      <View className="self-start rounded-full bg-[#E1EECC] px-[11px] py-[7px]">
        <Text className="happy-font-body-bold text-[10px] tracking-[0.8px] text-[#56633F]">
          UNIT 1 · STRESS BASICS
        </Text>
      </View>
      <Text
        className="mt-3.5 text-[30px] leading-[35px] text-[#201E1D]"
        style={{ fontFamily: COURSE_EXERCISE_FONTS.heading }}
      >
        All fifty-eight exercises
      </Text>
      <Text className="happy-font-body mt-[5px] text-[15px] leading-[22px] text-[#82796A]">
        Test the native Journey flow, one exercise or all fifty-eight.
      </Text>

      <CourseExercisePrimaryButton
        label="Run all fifty-eight"
        onPress={() => startRun(ALL_COURSE_EXERCISES)}
      />

      <View className="mt-6 overflow-hidden rounded-[28px] border border-[#DCD3C4] bg-[#F9F4ED]">
        {labels.map((item, index) => {
          const isComplete = completedIds.includes(item.id);
          const exercise = ALL_COURSE_EXERCISES[index];
          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => startRun([exercise])}
              className={
                index < labels.length - 1
                  ? "min-h-[76px] flex-row items-center gap-[13px] border-b border-[#DCD3C4] px-[15px] active:bg-[#FFF2EB]"
                  : "min-h-[76px] flex-row items-center gap-[13px] px-[15px] active:bg-[#FFF2EB]"
              }
            >
              <View
                className={
                  isComplete
                    ? "h-[38px] w-[38px] items-center justify-center rounded-full bg-[#7A8A5E]"
                    : "h-[38px] w-[38px] items-center justify-center rounded-full bg-[#E1EECC]"
                }
              >
                <Text
                  className={
                    isComplete
                      ? "happy-font-body-bold text-sm text-[#F9F4ED]"
                      : "happy-font-body-bold text-sm text-[#56633F]"
                  }
                >
                  {isComplete ? "✓" : index + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="happy-font-body-bold text-sm leading-[19px] text-[#201E1D]">
                  {item.title}
                </Text>
                <Text className="happy-font-body mt-0.5 text-xs capitalize text-[#82796A]">
                  {item.format}
                </Text>
              </View>
              <Text className="happy-font-body-bold text-[13px] text-[#C67139]">
                Test
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

function readLabel(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}
