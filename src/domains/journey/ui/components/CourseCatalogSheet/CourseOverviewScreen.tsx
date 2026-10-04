import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Pressable, ScrollView, View } from "react-native";
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
  isCompleted?: boolean;
  isStartingCourse: boolean;
  isUnenrolling?: boolean;
  isAtCapacityLimit?: boolean;
  maxCapacityLimit?: number;
  currentInProgressCount?: number;
  enrollmentError: string | null;
  onBack: () => void;
  onClose: () => void;
  onRetry: () => void;
  onPrimaryActionPress: (courseId: string) => void;
  onUnenrollPress?: (courseId: string) => void;
}

export function CourseOverviewScreen({
  insets,
  course,
  overview,
  isLoading,
  hasError,
  isEnrolled,
  isCompleted,
  isStartingCourse,
  isUnenrolling,
  isAtCapacityLimit,
  maxCapacityLimit = 3,
  currentInProgressCount = 0,
  enrollmentError,
  onBack,
  onClose,
  onRetry,
  onPrimaryActionPress,
  onUnenrollPress,
}: CourseOverviewScreenProps): React.JSX.Element {
  const { t } = useTranslation("journeys");
  const isBlockedByCapacity = !isEnrolled && Boolean(isAtCapacityLimit);
  const canStartCourse =
    Boolean(overview && overview.lessonCount > 0) &&
    !hasError &&
    !isBlockedByCapacity;

  const primaryLabel = isCompleted
    ? t("openJourney")
    : isEnrolled
      ? t("continueJourney")
      : isBlockedByCapacity
        ? t("limitReached", { current: currentInProgressCount, max: maxCapacityLimit })
        : t("startJourney");

  // ponytail: native alert confirmation for drop course
  const handleConfirmUnenroll = useCallback(() => {
    Alert.alert(
      t("unenrollTitle", { title: course.title }),
      t("unenrollMessage"),
      [
        { text: t("keepJourney"), style: "cancel" },
        {
          text: t("unenroll"),
          style: "destructive",
          onPress: () => onUnenrollPress?.(course.id),
        },
      ],
    );
  }, [course.id, course.title, onUnenrollPress, t]);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: Math.max(insets.top, 12) }}>
      <CourseSheetHeader onBack={onBack} onClose={onClose} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 160 + insets.bottom }}
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
        ) : isBlockedByCapacity ? (
          <Text
            variant="caption"
            className="mb-3 text-center text-amber-700 font-nunito-semibold"
            accessibilityRole="alert"
          >
            {t("capacityMessage", { max: maxCapacityLimit })}
          </Text>
        ) : null}
        <Button
          label={primaryLabel}
          disabled={!canStartCourse}
          loading={isStartingCourse}
          onPress={() => onPrimaryActionPress(course.id)}
        />
        {isEnrolled && !isCompleted && onUnenrollPress ? (
          <Pressable
            onPress={handleConfirmUnenroll}
            disabled={isUnenrolling}
            className="mt-2 min-h-11 items-center justify-center py-2"
            accessibilityRole="button"
            accessibilityLabel={`${t("unenrollFromJourney")} ${course.title}`}
          >
            <Text variant="label" className="text-rose-600 font-nunito-semibold">
              {isUnenrolling ? t("unenrolling") : t("unenrollFromJourney")}
            </Text>
          </Pressable>
        ) : null}
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
  const { t } = useTranslation("journeys");
  const accentColor = resolveCourseAccentColor(course.colorHex);
  const iconUrl = overview.iconUrl ?? course.iconUrl;
  const imageSource = getCourseImageSource(iconUrl);

  return (
    <View>
      <View className="flex-row items-center gap-3.5">
        <View
          className="h-14 w-14 items-center justify-center rounded-2xl bg-sage-50/70"
          style={imageSource ? undefined : { backgroundColor: `${accentColor}14` }}
        >
          {imageSource ? (
            <Image
              source={imageSource}
              style={{ width: 48, height: 48 }}
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
        <Text variant="body" className="mt-4">
          {overview.description}
        </Text>
      ) : null}

      <Text variant="label" className="mt-4 text-ink-soft">
        {t("countSection", { count: overview.sectionCount })}
        {" · "}
        {t("countUnit", { count: overview.unitCount })}
        {" · "}
        {t("countLesson", { count: overview.lessonCount })}
      </Text>
      <CourseSchedule overview={overview} />

      <Text variant="h2" className="mb-2 mt-8">
        {t("courseOutline")}
      </Text>
      {overview.lessonCount > 0 ? (
        <CourseOutline sections={overview.sections} />
      ) : (
        <Text variant="body" className="py-6">
          {t("noLessons")}
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
  const { t } = useTranslation("journeys");
  const scheduleParts = [
    overview.totalDurationWeeks
      ? t("countWeek", { count: overview.totalDurationWeeks })
      : null,
    overview.sessionsPerWeek
      ? t("scheduleSessions", { count: overview.sessionsPerWeek })
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
  const { t } = useTranslation("journeys");
  return (
    <View className="gap-6" accessibilityLabel={t("loadingDetails")}>
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
  const { t } = useTranslation("journeys");
  return (
    <View className="items-center py-16">
      <Text variant="h2" className="text-center">
        {t("couldNotLoadCourse")}
      </Text>
      <Pressable
        onPress={onRetry}
        className="mt-4 min-h-11 justify-center px-4"
        accessibilityRole="button"
      >
        <Text variant="label-bold" color="sage">
          {t("retry")}
        </Text>
      </Pressable>
    </View>
  );
}
