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
import { Skeleton, SkeletonCard } from "@/src/components/ui/Skeleton";
import {
  useGetCourseCatalogQuery,
  useGetCourseExercisesQuery,
} from "@/src/domains/journey/data/journeyApi";
import { useActiveCourse } from "@/hooks/journey/useActiveCourse";
import type { Exercise } from "@/src/types/journeyV5";

interface ActiveRun {
  exercises: Exercise[];
  nodeId: string;
}

export default function CourseExercisesTestScreen() {
  const [runNumber, setRunNumber] = useState(0);
  const [activeRun, setActiveRun] = useState<ActiveRun | null>(null);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const activeCourse = useActiveCourse();
  const catalogQuery = useGetCourseCatalogQuery();
  const exercisesQuery = useGetCourseExercisesQuery(
    activeCourse.courseId ?? "",
    {
      skip: !activeCourse.courseId,
    },
  );
  const exercises = exercisesQuery.data ?? [];
  const courseTitle =
    catalogQuery.data?.find((course) => course.id === activeCourse.courseId)
      ?.title ?? "Course";
  const error = activeCourse.error ?? readQueryError(exercisesQuery.error);
  const isLoading = activeCourse.isLoading || exercisesQuery.isLoading;

  const labels = useMemo(
    () =>
      exercises.map((exercise) => ({
        id: exercise.id,
        title: readLabel(exercise.content?.title, exercise.type),
        format: exercise.type.replaceAll("_", " "),
      })),
    [exercises],
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

  if (isLoading) {
    return <CourseExercisesDataState status="loading" />;
  }

  if (error) {
    return (
      <CourseExercisesDataState
        status="error"
        onRetry={() => {
          activeCourse.retry();
          if (activeCourse.courseId) void exercisesQuery.refetch();
        }}
      />
    );
  }

  if (exercises.length === 0) {
    return <CourseExercisesDataState status="empty" />;
  }

  return (
    <ScrollView
      className="flex-1 bg-[#F5EAD8]"
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="px-[22px] pb-12 pt-[22px]"
      showsVerticalScrollIndicator={false}
    >
      <CourseExercisesHeader />

      <View className="self-start rounded-full bg-[#E1EECC] px-[11px] py-[7px]">
        <Text className="happy-font-body-bold text-[10px] tracking-[0.8px] text-[#56633F]">
          {courseTitle.toUpperCase()} · SERVER
        </Text>
      </View>
      <Text
        className="mt-3.5 text-[30px] leading-[35px] text-[#201E1D]"
        style={{ fontFamily: COURSE_EXERCISE_FONTS.heading }}
      >
        All {exercises.length} exercises
      </Text>
      <Text className="happy-font-body mt-[5px] text-[15px] leading-[22px] text-[#82796A]">
        Test the native Journey flow using the published course data.
      </Text>

      <CourseExercisePrimaryButton
        label={`Run all ${exercises.length}`}
        onPress={() => startRun(exercises)}
      />

      <View className="mt-6 overflow-hidden rounded-[28px] border border-[#DCD3C4] bg-[#F9F4ED]">
        {labels.map((item, index) => {
          const isComplete = completedIds.includes(item.id);
          const exercise = exercises[index];
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

type DataState = "loading" | "error" | "empty";

function CourseExercisesDataState({
  status,
  onRetry,
}: {
  status: DataState;
  onRetry?: () => void;
}): React.JSX.Element {
  return (
    <View className="flex-1 bg-[#F5EAD8] px-[22px] pt-8">
      <CourseExercisesHeader />
      {status === "loading" ? (
        <View className="gap-5 pt-8">
          <Skeleton width="70%" height={34} radius={8} />
          <Skeleton width="90%" height={20} radius={6} />
          <SkeletonCard lines={4} />
        </View>
      ) : (
        <View className="flex-1 items-center justify-center pb-20">
          <Text
            className="text-center text-[28px] leading-[34px] text-[#201E1D]"
            style={{ fontFamily: COURSE_EXERCISE_FONTS.heading }}
          >
            {status === "error"
              ? "Could not load exercises"
              : "No exercises published"}
          </Text>
          {status === "error" && onRetry ? (
            <View className="mt-7 w-full max-w-[300px]">
              <CourseExercisePrimaryButton
                label="Try again"
                onPress={onRetry}
              />
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}

function CourseExercisesHeader(): React.JSX.Element {
  return (
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
  );
}

function readLabel(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

function readQueryError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "object" && "error" in error) {
    return String(error.error);
  }
  return error instanceof Error ? error.message : String(error);
}
