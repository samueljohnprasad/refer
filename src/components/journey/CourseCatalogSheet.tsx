import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { FullWindowOverlay } from "react-native-screens";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  useGetCourseCatalogQuery,
  useGetCourseTreeQuery,
  useStartCourseMutation,
} from "@/src/features/journey/journeyApi";
import { buildCourseJourneyPreview } from "@/src/features/journey/courseCatalogPreview";
import type {
  CourseCatalogListItem,
  CourseJourneyPreviewSection,
  EnrolledCourseListItem,
} from "@/src/types/journeyV5";
import {
  getCourseMonogram,
  resolveCourseAccentColor,
} from "./courseVisuals";

const PALETTE = {
  sage500: "#5F7F58",
  sage600: "#44633F",
} as const;

type CourseCatalogSheetProps = {
  isPresented: boolean;
  activeCourseId?: string | null;
  enrolledCourses?: EnrolledCourseListItem[];
  onClose: () => void;
  onCourseSelect?: (courseId: string) => void;
};

type CourseCardProps = {
  course: CourseCatalogListItem;
  isSelected: boolean;
  isEnrolled: boolean;
  onPress: (courseId: string) => void;
};

type CoursePreviewSectionRowProps = {
  accentColor: string;
  section: CourseJourneyPreviewSection;
};

type CourseMetricCardProps = {
  value: string | number;
  label: string;
};

const SECTION_PREVIEW_ACCENTS = [
  "#5F7F58",
  "#1F7A70",
  "#C56A3A",
  "#7A6754",
] as const;

function resolveInitialCourseId(
  courses: CourseCatalogListItem[],
  enrolledCourseIds: Set<string>,
  activeCourseId?: string | null,
): string | null {
  if (courses.length === 0) {
    return null;
  }

  const firstNotEnrolledCourse = courses.find(
    (course) => !enrolledCourseIds.has(course.id),
  );
  if (firstNotEnrolledCourse) {
    return firstNotEnrolledCourse.id;
  }

  const activeCourse = courses.find((course) => course.id === activeCourseId);
  if (activeCourse) {
    return activeCourse.id;
  }

  return courses[0]?.id ?? null;
}

function formatEstimatedDuration(estimatedMinutes: number): string {
  if (estimatedMinutes < 60) {
    return `${estimatedMinutes} min`;
  }

  const totalHours = Math.round((estimatedMinutes / 60) * 10) / 10;
  return `${totalHours} hrs`;
}

function formatPreviewCount(value: number, singularLabel: string): string {
  return `${value} ${value === 1 ? singularLabel : `${singularLabel}s`}`;
}

function resolveSectionPreviewAccentColor(sectionOrderIndex: number): string {
  return SECTION_PREVIEW_ACCENTS[
    (Math.max(sectionOrderIndex, 1) - 1) % SECTION_PREVIEW_ACCENTS.length
  ];
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "error" in error) {
    const value = (error as { error?: unknown }).error;
    if (typeof value === "string") {
      return value;
    }
  }

  return "Something went wrong while opening this course.";
}

const CourseCard = React.memo(function CourseCard({
  course,
  isSelected,
  isEnrolled,
  onPress,
}: CourseCardProps): React.JSX.Element {
  const courseAccentColor = resolveCourseAccentColor(course.colorHex);

  return (
    <Pressable
      className="w-[116px] items-center gap-2"
      onPress={() => onPress(course.id)}
      accessibilityRole="button"
      accessibilityLabel={`Preview ${course.title}`}
    >
      <View
        className={
          isSelected
            ? "happy-brand-pressed-card-selected h-[78px] w-[92px] items-center justify-center rounded-2xl"
            : "happy-brand-pressed-card h-[78px] w-[92px] items-center justify-center rounded-2xl"
        }
      >
        {course.iconUrl ? (
          <Image
            source={course.iconUrl}
            className="h-[46px] w-[46px] rounded-[14px]"
            cachePolicy="memory-disk"
            contentFit="contain"
            transition={150}
          />
        ) : (
          <Text
            className="happy-font-heading text-[30px]"
            style={{ color: courseAccentColor }}
          >
            {getCourseMonogram(course.title)}
          </Text>
        )}
      </View>

      <Text
        numberOfLines={1}
        className={`happy-font-body-medium w-full text-center text-[15px] ${
          isSelected ? "text-sage-700" : "text-ink-muted"
        }`}
      >
        {course.title}
      </Text>

      {isEnrolled ? (
        <View className="rounded-full bg-sage-100 px-3 py-[5px]">
          <Text
            className="happy-font-body-bold text-xs uppercase tracking-[0.4px] text-sage-600"
          >
            Enrolled
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
});

const CourseMetricCard = React.memo(function CourseMetricCard({
  value,
  label,
}: CourseMetricCardProps): React.JSX.Element {
  return (
    <View className="happy-brand-metric-card min-h-[70px] flex-1 items-center justify-center gap-1 rounded-[18px] px-1">
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.82}
        className="happy-font-body-bold w-full text-center text-[19px] text-ink"
      >
        {value}
      </Text>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.62}
        className="happy-font-body w-full text-center text-[11px] text-ink-muted"
      >
        {label}
      </Text>
    </View>
  );
});

const CoursePreviewSectionRow = React.memo(function CoursePreviewSectionRow({
  accentColor,
  section,
}: CoursePreviewSectionRowProps): React.JSX.Element {
  const visibleUnitSegments = Math.max(1, Math.min(section.unitCount, 5));
  const hiddenUnitCount = Math.max(section.unitCount - visibleUnitSegments, 0);

  return (
    <View className="happy-brand-preview-tile overflow-hidden rounded-[24px] p-4">
      <View
        className="absolute bottom-0 left-0 top-0 w-1.5"
        style={{ backgroundColor: accentColor }}
      />

      <View className="gap-3 pl-2">
        <View className="flex-row items-start gap-3">
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${accentColor}1A` }}
          >
            <Text
              className="happy-font-body-bold text-[18px]"
              style={{ color: accentColor }}
            >
              {section.orderIndex}
            </Text>
          </View>

          <View className="flex-1 gap-1">
            <Text
              className="happy-font-body-bold text-[18px] leading-[23px] text-ink"
              numberOfLines={2}
            >
              {section.title}
            </Text>
            <Text className="happy-font-body text-[13px] uppercase tracking-[0.8px] text-ink-muted">
              Section {section.orderIndex}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <View className="happy-brand-soft-chip px-3 py-1.5">
            <Text className="happy-font-body-bold text-[13px] text-ink-soft">
              {formatPreviewCount(section.unitCount, "unit")}
            </Text>
          </View>
          <View className="happy-brand-soft-chip px-3 py-1.5">
            <Text className="happy-font-body-bold text-[13px] text-ink-soft">
              {formatPreviewCount(section.nodeCount, "lesson")}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5">
          {Array.from({ length: visibleUnitSegments }).map((_, index) => (
            <View
              key={`${section.id}-${index}`}
              className="h-2.5 flex-1 rounded-full"
              style={{
                backgroundColor:
                  index === 0 ? accentColor : `${accentColor}33`,
              }}
            />
          ))}
          {hiddenUnitCount > 0 ? (
            <View className="happy-brand-soft-chip px-2.5 py-1">
              <Text className="happy-font-body-bold text-[11px] text-ink-muted">
                +{hiddenUnitCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
});

function CourseCatalogSheetContent({
  activeCourseId,
  enrolledCourses,
  isPresented,
  onClose,
  onCourseSelect,
}: CourseCatalogSheetProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  const { data: catalogCourses = [], isFetching: isCatalogLoading } =
    useGetCourseCatalogQuery(undefined, {
      skip: !isPresented,
      refetchOnMountOrArgChange: true,
    });

  const enrolledCourseIds = useMemo(
    () => new Set((enrolledCourses ?? []).map((course) => course.id)),
    [enrolledCourses],
  );

  useEffect(() => {
    if (!isPresented || catalogCourses.length === 0) {
      return;
    }

    const selectedCourseStillExists = catalogCourses.some(
      (course) => course.id === selectedCourseId,
    );
    if (selectedCourseStillExists) {
      return;
    }

    setSelectedCourseId(
      resolveInitialCourseId(catalogCourses, enrolledCourseIds, activeCourseId),
    );
  }, [
    activeCourseId,
    catalogCourses,
    enrolledCourseIds,
    isPresented,
    selectedCourseId,
  ]);

  const selectedCourse =
    catalogCourses.find((course) => course.id === selectedCourseId) ?? null;

  const {
    data: selectedCourseTree,
    isFetching: isPreviewLoading,
    isError: isPreviewError,
  } = useGetCourseTreeQuery(selectedCourseId ?? "", {
    skip: !isPresented || !selectedCourseId,
  });

  const [startCourse, { isLoading: isStartingCourse }] = useStartCourseMutation();

  const preview =
    selectedCourseTree ? buildCourseJourneyPreview(selectedCourseTree) : null;

  const isSelectedCourseEnrolled = selectedCourse
    ? enrolledCourseIds.has(selectedCourse.id)
    : false;
  const courseAccentColor = resolveCourseAccentColor(selectedCourse?.colorHex);
  const interactionColor = PALETTE.sage500;

  const handleCoursePress = useCallback((courseId: string) => {
    setSelectedCourseId(courseId);
  }, []);

  const handlePrimaryActionPress = async () => {
    if (!selectedCourse) {
      return;
    }

    try {
      if (!isSelectedCourseEnrolled) {
        await startCourse(selectedCourse.id).unwrap();
      }

      onCourseSelect?.(selectedCourse.id);
      onClose();
    } catch (error) {
      Alert.alert("Unable to open course", getErrorMessage(error));
    }
  };

  const primaryButtonLabel = isSelectedCourseEnrolled
    ? "Open Journey"
    : isStartingCourse
      ? "Enrolling..."
      : "Enroll in Course";

  return (
    <View className="flex-1 happy-brand-screen">
      <View
        className="flex-row items-center justify-between happy-brand-screen px-5"
        style={{ paddingTop: Math.max(insets.top, 16) }}
      >
        <View className="h-11 w-11" />
        <Pressable
          onPress={onClose}
          className="h-11 w-11 items-center justify-center rounded-[22px] border-2 border-b-4 border-sage-100 border-b-sage-200 bg-warm-white"
          accessibilityRole="button"
          accessibilityLabel="Close journey explorer"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={PALETTE.sage600} />
        </Pressable>
      </View>

      <View
        className="flex-1 happy-brand-screen"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-[22px] pb-28 pt-5"
        >
          <View className="gap-2.5 px-5">
            <Text className="happy-brand-eyebrow">
              Find Your Next Path
            </Text>
            <Text className="happy-font-heading text-[34px] leading-[38px] text-ink">
              Explore Journeys
            </Text>
            <Text className="happy-font-body text-base leading-[23px] text-ink-soft">
              Browse every published course, preview the path, and enroll when
              you are ready.
            </Text>
          </View>

          <FlatList
            horizontal
            data={catalogCourses}
            keyExtractor={(item) => item.id}
            contentContainerClassName="gap-4 px-5"
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <CourseCard
                course={item}
                isSelected={item.id === selectedCourseId}
                isEnrolled={enrolledCourseIds.has(item.id)}
                onPress={handleCoursePress}
              />
            )}
            ListEmptyComponent={
              isCatalogLoading ? (
                <View className="min-h-[92px] min-w-[240px] items-center justify-center px-5">
                  <ActivityIndicator color={interactionColor} />
                </View>
              ) : (
                <View className="min-h-[92px] min-w-[240px] items-center justify-center px-5">
                  <Text className="happy-font-body text-center text-[15px] text-ink-muted">
                    No published courses are available yet.
                  </Text>
                </View>
              )
            }
          />

          {selectedCourse ? (
            <View className="mx-5 gap-5">
              <View className="happy-brand-raised-panel gap-5 rounded-[28px] p-5">
                <View className="flex-row items-center gap-4">
                  <View
                    className="h-[86px] w-[86px] items-center justify-center rounded-[24px]"
                    style={{ backgroundColor: `${courseAccentColor}18` }}
                  >
                    <View className="happy-brand-pressed-card-selected h-[68px] w-[68px] items-center justify-center rounded-[20px]">
                      {selectedCourse.iconUrl ? (
                        <Image
                          source={selectedCourse.iconUrl}
                          className="h-11 w-11 rounded-2xl"
                          cachePolicy="memory-disk"
                          contentFit="contain"
                          transition={150}
                        />
                      ) : (
                        <Text
                          className="happy-font-heading text-[32px]"
                          style={{ color: courseAccentColor }}
                        >
                          {getCourseMonogram(selectedCourse.title)}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View className="flex-1 gap-2">
                    <View className="happy-brand-soft-chip self-start px-3 py-1">
                      <Text className="happy-font-body-bold text-[11px] uppercase tracking-[0.8px] text-sage-600">
                        {isSelectedCourseEnrolled ? "Enrolled" : "New journey"}
                      </Text>
                    </View>
                    <Text className="happy-font-heading text-[28px] leading-[32px] text-ink">
                      {selectedCourse.title}
                    </Text>
                    <Text className="happy-font-body text-[15px] leading-[22px] text-ink-soft">
                      {selectedCourse.description ||
                        "A guided journey you can start today."}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2.5">
                  <CourseMetricCard
                    value={preview?.sectionCount ?? "—"}
                    label="Sections"
                  />
                  <CourseMetricCard
                    value={preview?.unitCount ?? "—"}
                    label="Units"
                  />
                  <CourseMetricCard
                    value={preview?.nodeCount ?? "—"}
                    label="Lessons"
                  />
                  <CourseMetricCard
                    value={
                      preview
                        ? formatEstimatedDuration(preview.estimatedMinutes)
                        : "—"
                    }
                    label="Time"
                  />
                </View>
              </View>

              <View className="gap-3">
                <View className="flex-row items-center justify-between gap-3 px-1">
                  <View>
                    <Text className="happy-font-heading text-[24px] leading-[28px] text-ink">
                      Journey Preview
                    </Text>
                    <Text className="happy-font-body text-sm text-ink-muted">
                      The path you will move through
                    </Text>
                  </View>
                  <View className="happy-brand-status-chip px-3 py-1.5">
                    <Text className="happy-font-body-bold text-xs uppercase tracking-[0.7px] text-sage-600">
                      {isSelectedCourseEnrolled ? "In progress" : "Ready"}
                    </Text>
                  </View>
                </View>

                {isPreviewLoading ? (
                  <View className="min-h-[132px] items-center justify-center gap-2.5 rounded-[24px] bg-warm-white">
                    <ActivityIndicator color={interactionColor} />
                    <Text className="happy-font-body text-sm text-ink-muted">
                      Loading journey preview...
                    </Text>
                  </View>
                ) : isPreviewError ? (
                  <View className="min-h-[132px] items-center justify-center gap-2.5 rounded-[24px] bg-warm-white px-6">
                    <Text className="happy-font-body text-center text-[15px] text-ink-muted">
                      Unable to load this course preview right now.
                    </Text>
                  </View>
                ) : (
                  <View className="gap-3">
                    {preview?.sections.map((section) => (
                      <CoursePreviewSectionRow
                        key={section.id}
                        accentColor={resolveSectionPreviewAccentColor(
                          section.orderIndex,
                        )}
                        section={section}
                      />
                    ))}
                  </View>
                )}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <Pressable
          disabled={!selectedCourse || isStartingCourse}
          onPress={handlePrimaryActionPress}
          className={`mx-5 mt-4 min-h-14 items-center justify-center rounded-2xl ${
            selectedCourse
              ? "happy-brand-primary-cta opacity-100"
              : "happy-brand-primary-cta-disabled opacity-70"
          }`}
        >
          <Text
            className="happy-font-body-bold text-base uppercase tracking-[0.4px] text-warm-white"
          >
            {primaryButtonLabel}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function CourseCatalogSheet(
  props: CourseCatalogSheetProps,
): React.JSX.Element | null {
  const { height: windowHeight } = useWindowDimensions();
  const [isMounted, setIsMounted] = useState(props.isPresented);
  const translateY = useSharedValue(windowHeight);

  useEffect(() => {
    if (props.isPresented) {
      setIsMounted(true);
      translateY.value = windowHeight;
      translateY.value = withTiming(0, {
        duration: 320,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    translateY.value = withTiming(
      windowHeight,
      {
        duration: 260,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setIsMounted)(false);
        }
      },
    );
  }, [props.isPresented, translateY, windowHeight]);

  const handleClose = useCallback(() => {
    translateY.value = withTiming(
      windowHeight,
      {
        duration: 260,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(props.onClose)();
        }
      },
    );
  }, [props.onClose, translateY, windowHeight]);

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!isMounted) {
    return null;
  }

  return (
    <FullWindowOverlay>
      <View className="absolute inset-0">
        <Animated.View className="absolute inset-0" style={animatedSheetStyle}>
          <CourseCatalogSheetContent {...props} onClose={handleClose} />
        </Animated.View>
      </View>
    </FullWindowOverlay>
  );
}
