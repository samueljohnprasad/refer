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
  cream: "#FAF6ED",
  warmWhite: "#FFFCF5",
  sage50: "#F4F1EA",
  sage100: "#E8E2D2",
  sage200: "#D4CCB5",
  sage300: "#A8B89A",
  sage500: "#5A7A56",
  sage600: "#3F5A3D",
  sage700: "#2A3F2A",
  ink: "#1A2A1A",
  inkSoft: "#4A5A4A",
  inkMuted: "#7A8A7A",
} as const;

const FONTS = {
  body: "GeistRegular",
  bodyMedium: "GeistMedium",
  bodyBold: "GeistBold",
  heading: "FrauncesSemiBold",
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
            ? "h-[78px] w-[92px] items-center justify-center rounded-2xl border-2 border-b-4 border-sage-500 border-b-sage-600 bg-[#EEF2E8]"
            : "h-[78px] w-[92px] items-center justify-center rounded-2xl border-2 border-b-4 border-sage-100 border-b-sage-100 bg-warm-white"
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
            className="text-[30px]"
            style={{ color: courseAccentColor, fontFamily: FONTS.heading }}
          >
            {getCourseMonogram(course.title)}
          </Text>
        )}
      </View>

      <Text
        numberOfLines={1}
        className={`w-full text-center text-[15px] ${
          isSelected ? "text-sage-700" : "text-ink-muted"
        }`}
        style={{ fontFamily: FONTS.bodyMedium }}
      >
        {course.title}
      </Text>

      {isEnrolled ? (
        <View className="rounded-full bg-sage-100 px-3 py-[5px]">
          <Text
            className="text-xs uppercase tracking-[0.4px] text-sage-600"
            style={{ fontFamily: FONTS.bodyBold }}
          >
            Enrolled
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
});

const CoursePreviewSectionRow = React.memo(function CoursePreviewSectionRow({
  accentColor,
  section,
}: CoursePreviewSectionRowProps): React.JSX.Element {
  return (
    <View className="flex-row items-start gap-[14px] rounded-2xl border-2 border-b-4 border-sage-100 border-b-sage-100 bg-warm-white p-[14px]">
      <View
        className="mt-0.5 h-[34px] w-[34px] items-center justify-center rounded-full"
        style={{ backgroundColor: `${accentColor}1A` }}
      >
        <Text
          className="text-[15px]"
          style={{ color: accentColor, fontFamily: FONTS.bodyBold }}
        >
          {section.orderIndex}
        </Text>
      </View>

      <View className="flex-1 gap-2">
        <Text
          className="text-base text-ink"
          style={{ fontFamily: FONTS.bodyBold }}
        >
          {section.title}
        </Text>
        <Text
          className="text-sm text-ink-soft"
          style={{ fontFamily: FONTS.body }}
        >
          {section.unitCount} units • {section.nodeCount} lessons
        </Text>
        <View className="flex-row gap-1.5">
          {Array.from({ length: Math.min(section.unitCount, 8) }).map((_, index) => (
            <View
              key={`${section.id}-${index}`}
              className="h-2 flex-1 rounded-full opacity-[0.22]"
              style={{ backgroundColor: accentColor }}
            />
          ))}
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
    <View className="flex-1 bg-cream">
      <View
        className="flex-row items-center justify-between bg-cream px-5"
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
        className="flex-1 bg-cream"
        style={{ paddingBottom: Math.max(insets.bottom, 20) }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="gap-[22px] pb-3 pt-5"
        >
          <View className="gap-2.5 px-5">
            <Text
              className="text-xs uppercase tracking-[1.6px] text-sage-500"
              style={{ fontFamily: FONTS.bodyBold }}
            >
              Find Your Next Path
            </Text>
            <Text
              className="text-[34px] leading-[38px] text-ink"
              style={{ fontFamily: FONTS.heading }}
            >
              Explore Journeys
            </Text>
            <Text
              className="text-base leading-[23px] text-ink-soft"
              style={{ fontFamily: FONTS.body }}
            >
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
                  <Text
                    className="text-center text-[15px] text-ink-muted"
                    style={{ fontFamily: FONTS.body }}
                  >
                    No published courses are available yet.
                  </Text>
                </View>
              )
            }
          />

          {selectedCourse ? (
            <View className="mx-5 gap-5 rounded-[20px] border-2 border-b-4 border-sage-100 border-b-sage-100 bg-warm-white p-5">
              <View className="flex-row items-center gap-4">
                <View className="h-[84px] w-[84px] items-center justify-center rounded-[18px] border-2 border-b-4 border-sage-500 bg-[#EEF2E8]">
                  {selectedCourse.iconUrl ? (
                    <Image
                      source={selectedCourse.iconUrl}
                      className="h-12 w-12 rounded-2xl"
                      cachePolicy="memory-disk"
                      contentFit="contain"
                      transition={150}
                    />
                  ) : (
                    <Text
                      className="text-[34px]"
                      style={{ color: courseAccentColor, fontFamily: FONTS.heading }}
                    >
                      {getCourseMonogram(selectedCourse.title)}
                    </Text>
                  )}
                </View>

                <View className="flex-1 gap-1.5">
                  <Text
                    className="text-[30px] leading-[34px] text-ink"
                    style={{ fontFamily: FONTS.heading }}
                  >
                    {selectedCourse.title}
                  </Text>
                  <Text
                    className="text-[15px] leading-[22px] text-ink-soft"
                    style={{ fontFamily: FONTS.body }}
                  >
                    {selectedCourse.description ||
                      "A guided journey you can start today."}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2.5">
                <View className="min-h-[82px] flex-1 items-center justify-center gap-1 rounded-2xl border-2 border-b-4 border-sage-100 border-b-sage-100 bg-warm-white px-2.5">
                  <Text
                    className="text-center text-lg text-ink"
                    style={{ fontFamily: FONTS.bodyBold }}
                  >
                    {preview?.sectionCount ?? "—"}
                  </Text>
                  <Text
                    className="text-[13px] text-ink-muted"
                    style={{ fontFamily: FONTS.body }}
                  >
                    Sections
                  </Text>
                </View>
                <View className="min-h-[82px] flex-1 items-center justify-center gap-1 rounded-2xl border-2 border-b-4 border-sage-100 border-b-sage-100 bg-warm-white px-2.5">
                  <Text
                    className="text-center text-lg text-ink"
                    style={{ fontFamily: FONTS.bodyBold }}
                  >
                    {preview?.unitCount ?? "—"}
                  </Text>
                  <Text
                    className="text-[13px] text-ink-muted"
                    style={{ fontFamily: FONTS.body }}
                  >
                    Units
                  </Text>
                </View>
                <View className="min-h-[82px] flex-1 items-center justify-center gap-1 rounded-2xl border-2 border-b-4 border-sage-100 border-b-sage-100 bg-warm-white px-2.5">
                  <Text
                    className="text-center text-lg text-ink"
                    style={{ fontFamily: FONTS.bodyBold }}
                  >
                    {preview?.nodeCount ?? "—"}
                  </Text>
                  <Text
                    className="text-[13px] text-ink-muted"
                    style={{ fontFamily: FONTS.body }}
                  >
                    Lessons
                  </Text>
                </View>
                <View className="min-h-[82px] flex-1 items-center justify-center gap-1 rounded-2xl border-2 border-b-4 border-sage-100 border-b-sage-100 bg-warm-white px-2.5">
                  <Text
                    className="text-center text-lg text-ink"
                    style={{ fontFamily: FONTS.bodyBold }}
                  >
                    {preview
                      ? formatEstimatedDuration(preview.estimatedMinutes)
                      : "—"}
                  </Text>
                  <Text
                    className="text-[13px] text-ink-muted"
                    style={{ fontFamily: FONTS.body }}
                  >
                    Time
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between gap-3">
                <Text
                  className="text-xl text-ink"
                  style={{ fontFamily: FONTS.heading }}
                >
                  Journey Preview
                </Text>
                <Text
                  className="text-sm text-sage-500"
                  style={{ fontFamily: FONTS.bodyBold }}
                >
                  {isSelectedCourseEnrolled ? "Already enrolled" : "Ready to enroll"}
                </Text>
              </View>

              {isPreviewLoading ? (
                <View className="min-h-[120px] items-center justify-center gap-2.5">
                  <ActivityIndicator color={interactionColor} />
                  <Text
                    className="text-sm text-ink-muted"
                    style={{ fontFamily: FONTS.body }}
                  >
                    Loading journey preview...
                  </Text>
                </View>
              ) : isPreviewError ? (
                <View className="min-h-[120px] items-center justify-center gap-2.5">
                  <Text
                    className="text-center text-[15px] text-ink-muted"
                    style={{ fontFamily: FONTS.body }}
                  >
                    Unable to load this course preview right now.
                  </Text>
                </View>
              ) : (
                <View className="gap-3">
                  {preview?.sections.map((section) => (
                    <CoursePreviewSectionRow
                      key={section.id}
                      accentColor={interactionColor}
                      section={section}
                    />
                  ))}
                </View>
              )}
            </View>
          ) : null}
        </ScrollView>

        <Pressable
          disabled={!selectedCourse || isStartingCourse}
          onPress={handlePrimaryActionPress}
          className={`mx-5 mt-4 min-h-14 items-center justify-center rounded-2xl border-b-4 ${
            selectedCourse
              ? "border-b-sage-700 bg-sage-500 opacity-100"
              : "border-b-sage-300 bg-sage-200 opacity-70"
          }`}
        >
          <Text
            className="text-base uppercase tracking-[0.4px] text-warm-white"
            style={{ fontFamily: FONTS.bodyBold }}
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
