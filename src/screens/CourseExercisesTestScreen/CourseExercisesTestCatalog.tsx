import React from "react";
import { Pressable, Text, View } from "react-native";
import { CourseExercisePrimaryButton } from "@/src/components/exercise/CourseExerciseShell";
import { SEMANTIC_COLORS, COURSE_EXERCISE_FONTS } from "@/src/components/exercise/courseExerciseTheme";
import { Skeleton, SkeletonCard } from "@/src/components/ui/Skeleton";
import type { Exercise } from "@/src/types/journeyV5";
import {
  allMicrolearningFixtures,
  microlearningFixtureGroups,
} from "./fixtures/aggregate";

type ServerStatus = "ready" | "loading" | "error" | "empty";

interface CourseExercisesTestCatalogProps {
  completedIds: readonly string[];
  courseTitle: string;
  exercises: readonly Exercise[];
  serverStatus: ServerStatus;
  onRetry: () => void;
  onStartRun: (exercises: Exercise[]) => void;
}

export function CourseExercisesTestCatalog({
  completedIds,
  courseTitle,
  exercises,
  serverStatus,
  onRetry,
  onStartRun,
}: CourseExercisesTestCatalogProps) {
  return (
    <>
      <SourceLabel label="LOCAL FIXTURES" />
      <Text style={styles.title}>Microlearning exercises</Text>
      <Text style={styles.description}>
        Run local fixtures without waiting for published course data.
      </Text>
      {allMicrolearningFixtures.length > 0 ? (
        <>
          <CourseExercisePrimaryButton
            label={`Run all ${allMicrolearningFixtures.length} fixtures`}
            onPress={() => onStartRun([...allMicrolearningFixtures])}
          />
          {microlearningFixtureGroups.map((group) =>
            group.exercises.length > 0 ? (
              <ExerciseShelf
                key={group.id}
                title={group.label}
                exercises={group.exercises}
                completedIds={completedIds}
                onStartRun={onStartRun}
              />
            ) : null,
          )}
        </>
      ) : (
        <View style={styles.emptyFixtures}>
          <Text style={styles.emptyText}>
            Category fixtures will appear here as each redesign lands.
          </Text>
        </View>
      )}

      <View style={styles.serverSection}>
        <SourceLabel label={`${courseTitle.toUpperCase()} · SERVER`} />
        <Text style={styles.title}>Published exercises</Text>
        <ServerContent
          completedIds={completedIds}
          exercises={exercises}
          onRetry={onRetry}
          onStartRun={onStartRun}
          status={serverStatus}
        />
      </View>
    </>
  );
}

function ServerContent({
  completedIds,
  exercises,
  onRetry,
  onStartRun,
  status,
}: {
  completedIds: readonly string[];
  exercises: readonly Exercise[];
  onRetry: () => void;
  onStartRun: (exercises: Exercise[]) => void;
  status: ServerStatus;
}) {
  if (status === "loading") {
    return (
      <View style={styles.loading}>
        <Skeleton width="70%" height={34} radius={8} />
        <Skeleton width="90%" height={20} radius={6} />
        <SkeletonCard lines={4} />
      </View>
    );
  }
  if (status === "error" || status === "empty") {
    return (
      <View style={styles.dataState}>
        <Text style={styles.dataStateTitle}>
          {status === "error" ? "Could not load exercises" : "No exercises published"}
        </Text>
        {status === "error" ? (
          <CourseExercisePrimaryButton label="Try again" onPress={onRetry} />
        ) : null}
      </View>
    );
  }
  return (
    <>
      <CourseExercisePrimaryButton
        label={`Run all ${exercises.length}`}
        onPress={() => onStartRun([...exercises])}
      />
      <ExerciseShelf
        exercises={exercises}
        completedIds={completedIds}
        onStartRun={onStartRun}
      />
    </>
  );
}

function ExerciseShelf({
  completedIds,
  exercises,
  onStartRun,
  title,
}: {
  completedIds: readonly string[];
  exercises: readonly Exercise[];
  onStartRun: (exercises: Exercise[]) => void;
  title?: string;
}) {
  return (
    <View style={styles.shelfWrap}>
      {title ? <Text style={styles.shelfTitle}>{title}</Text> : null}
      <View style={styles.shelf}>
        {exercises.map((exercise, index) => {
          const complete = completedIds.includes(exercise.id);
          return (
            <Pressable
              key={exercise.id}
              accessibilityRole="button"
              onPress={() => onStartRun([exercise])}
              style={({ pressed }) => [
                styles.row,
                index < exercises.length - 1 && styles.rowBorder,
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.index, complete && styles.completeIndex]}>
                <Text style={[styles.indexText, complete && styles.completeIndexText]}>
                  {complete ? "✓" : index + 1}
                </Text>
              </View>
              <View style={styles.rowCopy}>
                <Text style={styles.rowTitle}>
                  {readLabel(exercise.content?.title, exercise.type)}
                </Text>
                <Text style={styles.format}>{exercise.type.replaceAll("_", " ")}</Text>
              </View>
              <Text style={styles.testLabel}>Test</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function SourceLabel({ label }: { label: string }) {
  return (
    <View style={styles.sourceLabel}>
      <Text style={styles.sourceLabelText}>{label}</Text>
    </View>
  );
}

function readLabel(value: unknown, fallback: string): string {
  return typeof value === "string" && value.length > 0 ? value : fallback;
}

const styles = {
  sourceLabel: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  sourceLabelText: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  title: {
    marginTop: 14,
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 30,
    lineHeight: 35,
  },
  description: {
    marginTop: 5,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 15,
    lineHeight: 22,
  },
  emptyFixtures: {
    marginTop: 18,
    borderRadius: 16,
    padding: 16,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  emptyText: {
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 14,
    lineHeight: 20,
  },
  serverSection: { marginTop: 36 },
  loading: { gap: 20, paddingTop: 24 },
  dataState: { gap: 20, paddingVertical: 28 },
  dataStateTitle: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.heading,
    fontSize: 24,
    lineHeight: 30,
  },
  shelfWrap: { marginTop: 24 },
  shelfTitle: {
    marginBottom: 8,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
  },
  shelf: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: SEMANTIC_COLORS.border.default,
    borderRadius: 20,
    backgroundColor: SEMANTIC_COLORS.surface.primary,
  },
  row: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    paddingHorizontal: 15,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: SEMANTIC_COLORS.border.default,
  },
  pressed: { opacity: 0.7 },
  index: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 999,
    backgroundColor: SEMANTIC_COLORS.brand.soft,
  },
  completeIndex: { backgroundColor: SEMANTIC_COLORS.brand.primary },
  indexText: {
    color: SEMANTIC_COLORS.brand.pressed,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
  },
  completeIndexText: { color: SEMANTIC_COLORS.surface.primary },
  rowCopy: { flex: 1 },
  rowTitle: {
    color: SEMANTIC_COLORS.text.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 14,
    lineHeight: 19,
  },
  format: {
    marginTop: 2,
    color: SEMANTIC_COLORS.text.secondary,
    fontFamily: COURSE_EXERCISE_FONTS.body,
    fontSize: 12,
    textTransform: "capitalize",
  },
  testLabel: {
    color: SEMANTIC_COLORS.error.primary,
    fontFamily: COURSE_EXERCISE_FONTS.bodyBold,
    fontSize: 13,
  },
} as const;
