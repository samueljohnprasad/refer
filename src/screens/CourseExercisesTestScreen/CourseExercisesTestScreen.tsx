import React, { useState } from "react";
import { ScrollView } from "react-native";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { SEMANTIC_COLORS, COURSE_EXERCISE_FONTS } from "@/src/components/exercise/courseExerciseTheme";
import { NodeEngineRouter } from "@/src/components/node/NodeEngineRouter";
import {
  useGetCourseCatalogQuery,
  useGetCourseExercisesQuery,
} from "@/src/domains/journey/data/journeyApi";
import { useActiveCourse } from "@/hooks/journey/useActiveCourse";
import type { Exercise } from "@/src/types/journeyV5";
import { CourseExercisesTestCatalog } from "./CourseExercisesTestCatalog";

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
      style={{ backgroundColor: SEMANTIC_COLORS.surface.primary }}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerClassName="px-[22px] pb-12 pt-[22px]"
      showsVerticalScrollIndicator={false}
    >
      <CourseExercisesHeader />
      <CourseExercisesTestCatalog
        completedIds={completedIds}
        courseTitle={courseTitle}
        exercises={exercises}
        serverStatus={
          isLoading
            ? "loading"
            : error
              ? "error"
              : exercises.length === 0
                ? "empty"
                : "ready"
        }
        onRetry={() => {
          activeCourse.retry();
          if (activeCourse.courseId) void exercisesQuery.refetch();
        }}
        onStartRun={startRun}
      />
    </ScrollView>
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
        headerStyle: { backgroundColor: SEMANTIC_COLORS.surface.primary },
        headerShadowVisible: false,
        headerTintColor: SEMANTIC_COLORS.text.primary,
        headerTitleStyle: { fontFamily: COURSE_EXERCISE_FONTS.bodyBold },
      }}
    />
  );
}

function readQueryError(error: unknown): string | undefined {
  if (!error) return undefined;
  if (typeof error === "object" && "error" in error) {
    return String(error.error);
  }
  return error instanceof Error ? error.message : String(error);
}
