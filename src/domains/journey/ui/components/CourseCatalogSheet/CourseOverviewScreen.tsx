import React from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { Button } from "@/src/components/ui/Button";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { Text } from "@/src/components/ui/Text";
import type { CourseCatalogListItem } from "@/src/types/journeyV5";
import type { CourseOverview } from "@/src/domains/journey/model/courseOverview";
import {
  getCourseImageSource,
  getCourseMonogram,
  resolveCourseAccentColor,
} from "@/src/domains/journey/model/courseVisuals";
import { CourseOutline } from "./CourseOutline";
import { CourseSheetHeader } from "./CourseSheetHeader";

interface CourseOverviewScreenProps {
  insets: { top: number; bottom: number };
  course: CourseCatalogListItem;
  overview: CourseOverview | null;
  isLoading: boolean;
  hasError: boolean;
  isEnrolled: boolean;
  isStartingCourse: boolean;
  enrollmentError: string | null;
  onBack: () => void;
  onClose: () => void;
  onRetry: () => void;
  onPrimaryActionPress: (courseId: string) => void;
}

export function CourseOverviewScreen({
  insets,
  course,
  overview,
  isLoading,
  hasError,
  isEnrolled,
  isStartingCourse,
  enrollmentError,
  onBack,
  onClose,
  onRetry,
  onPrimaryActionPress,
}: CourseOverviewScreenProps): React.JSX.Element {
  const canStartCourse = Boolean(overview && overview.lessonCount > 0) && !hasError;
  const primaryLabel = isEnrolled ? "Continue journey" : "Start journey";

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: Math.max(insets.top, 12) }}>
      <CourseSheetHeader onBack={onBack} onClose={onClose} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 116 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? <CourseOverviewSkeleton /> : null}
        {!isLoading && hasError ? <CourseOverviewError onRetry={onRetry} /> : null}
        {!isLoading && !hasError && overview ? (
          <CourseOverviewContent course={course} overview={overview} />
        ) : null}
      </ScrollView>

      <View
        className="absolute inset-x-0 bottom-0 border-t border-slate-100 bg-white px-5 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        {enrollmentError ? (
          <Text
            variant="caption"
            color="danger"
            className="mb-3 text-center"
            accessibilityRole="alert"
          >
            {enrollmentError}
          </Text>
        ) : null}
        <Button
          label={primaryLabel}
          disabled={!canStartCourse}
          loading={isStartingCourse}
          onPress={() => onPrimaryActionPress(course.id)}
        />
      </View>
    </View>
  );
}

function CourseOverviewContent({
  course,
  overview,
}: {
  course: CourseCatalogListItem;
  overview: CourseOverview;
}): React.JSX.Element {
  const accentColor = resolveCourseAccentColor(course.colorHex);
  const iconUrl = overview.iconUrl ?? course.iconUrl;
  const imageSource = getCourseImageSource(iconUrl);

  return (
    <View>
      <View className="flex-row items-center gap-4">
        <View
          className="h-14 w-14 items-center justify-center rounded-xl"
          style={imageSource ? undefined : { backgroundColor: `${accentColor}14` }}
        >
          {imageSource ? (
            <Image
              source={imageSource}
              style={{ width: 54, height: 54 }}
              cachePolicy="memory-disk"
              contentFit="contain"
            />
          ) : (
            <Text variant="h2" style={{ color: accentColor }}>
              {getCourseMonogram(overview.title)}
            </Text>
          )}
        </View>
        <Text variant="display" className="flex-1">
          {overview.title}
        </Text>
      </View>

      {overview.description ? (
        <Text variant="body" className="mt-5">
          {overview.description}
        </Text>
      ) : null}

      <Text variant="label" className="mt-5">
        {formatCount(overview.sectionCount, "section")}
        {" · "}
        {formatCount(overview.unitCount, "unit")}
        {" · "}
        {formatCount(overview.lessonCount, "lesson")}
      </Text>
      <CourseSchedule overview={overview} />

      <Text variant="h2" className="mb-2 mt-10">
        Course outline
      </Text>
      {overview.lessonCount > 0 ? (
        <CourseOutline sections={overview.sections} />
      ) : (
        <Text variant="body" className="py-6">
          No published lessons are available.
        </Text>
      )}
    </View>
  );
}

function CourseSchedule({
  overview,
}: {
  overview: CourseOverview;
}): React.JSX.Element | null {
  const scheduleParts = [
    overview.totalDurationWeeks
      ? formatCount(overview.totalDurationWeeks, "week")
      : null,
    overview.sessionsPerWeek
      ? `${overview.sessionsPerWeek} sessions per week`
      : null,
  ].filter(Boolean);

  if (scheduleParts.length === 0) return null;
  return (
    <Text variant="caption" className="mt-2">
      {scheduleParts.join(" · ")}
    </Text>
  );
}

function CourseOverviewSkeleton(): React.JSX.Element {
  return (
    <View className="gap-6" accessibilityLabel="Loading course details">
      <View className="flex-row items-center gap-4">
        <Skeleton width={56} height={56} radius={12} />
        <Skeleton width="58%" height={28} radius={8} />
      </View>
      <View className="gap-3">
        <Skeleton width="100%" height={15} radius={6} />
        <Skeleton width="84%" height={15} radius={6} />
        <Skeleton width="62%" height={13} radius={5} />
      </View>
      <Skeleton width="42%" height={24} radius={7} />
      {Array.from({ length: 4 }).map((_, index) => (
        <View key={index} className="border-b border-slate-100 py-4">
          <Skeleton width={`${74 - index * 5}%`} height={17} radius={6} />
        </View>
      ))}
    </View>
  );
}

function CourseOverviewError({ onRetry }: { onRetry: () => void }): React.JSX.Element {
  return (
    <View className="items-center py-16">
      <Text variant="h2" className="text-center">
        Couldn’t load this course
      </Text>
      <Pressable
        onPress={onRetry}
        className="mt-4 min-h-11 justify-center px-4"
        accessibilityRole="button"
      >
        <Text variant="label-bold" color="sage">
          Try again
        </Text>
      </Pressable>
    </View>
  );
}

function formatCount(value: number, singular: string): string {
  return `${value} ${value === 1 ? singular : `${singular}s`}`;
}
