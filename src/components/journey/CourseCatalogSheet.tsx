import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  Text as RNText,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { FullWindowOverlay } from "react-native-screens";
import { Card } from "@/src/components/ui/Card";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  interpolate,
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
import { SAGE, BRAND_SURFACE } from "@/lib/tokens";

type CourseCatalogSheetProps = {
  isPresented: boolean;
  activeCourseId?: string | null;
  enrolledCourses?: EnrolledCourseListItem[];
  onClose: () => void;
  onCourseSelect?: (courseId: string) => void;
};

type CourseAccordionCardProps = {
  course: CourseCatalogListItem;
  isExpanded: boolean;
  isEnrolled: boolean;
  onToggle: (courseId: string) => void;
  preview: ReturnType<typeof buildCourseJourneyPreview> | null;
  isPreviewLoading: boolean;
  isStartingCourse: boolean;
  onEnroll: (courseId: string) => void;
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

const CourseAccordionCard = React.memo(function CourseAccordionCard({
  course,
  isExpanded,
  isEnrolled,
  onToggle,
  preview,
  isPreviewLoading,
  isStartingCourse,
  onEnroll,
}: CourseAccordionCardProps): React.JSX.Element {
  const courseAccentColor = resolveCourseAccentColor(course.colorHex);
  
  // Reanimated shared values
  const expansionProgress = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    expansionProgress.value = withSpring(isExpanded ? 1 : 0, {
      damping: 20,
      stiffness: 150,
      mass: 0.8,
    });
  }, [isExpanded, expansionProgress]);

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(expansionProgress.value, [0, 1], [0, 180])}deg` }
      ],
    };
  });

  return (
    <View className="mb-4 bg-white rounded-[24px] border border-slate-100 shadow-sm shadow-slate-200/40 overflow-hidden">
      <Pressable 
        onPress={() => onToggle(course.id)}
        className="flex-row items-center justify-between p-5"
        style={isExpanded ? { backgroundColor: `${courseAccentColor}08` } : {}}
      >
        <View className="flex-row items-center gap-4 flex-1">
          <View className="h-12 w-12 items-center justify-center rounded-[14px]" style={{ backgroundColor: `${courseAccentColor}1A` }}>
            {course.iconUrl ? (
              <Image source={course.iconUrl} className="h-8 w-8 rounded-lg" cachePolicy="memory-disk" contentFit="contain" />
            ) : (
              <RNText className="happy-font-heading text-[20px]" style={{ color: courseAccentColor }}>
                {getCourseMonogram(course.title)}
              </RNText>
            )}
          </View>
          <View className="flex-1">
            <Text variant="body-bold" className="text-[17px] text-ink">{course.title}</Text>
            {isEnrolled && (
              <Text variant="chip" color="sage" className="uppercase tracking-[0.4px] text-[10px] mt-1">Enrolled</Text>
            )}
          </View>
        </View>
        <Animated.View style={animatedChevronStyle} className="px-2">
          <Text className="text-slate-400 font-bold text-lg">v</Text> 
        </Animated.View>
      </Pressable>

      {isExpanded && (
        <View className="p-5 pt-0 border-t border-slate-100/50" style={{ backgroundColor: `${courseAccentColor}04` }}>
          <Text variant="body" className="text-[15px] leading-[22px] text-ink-soft mt-4 mb-3">
            {course.description || "A guided journey you can start today."}
          </Text>
          
          <Text variant="caption-muted" className="text-[13px] font-medium mb-6">
            {preview?.unitCount ?? "—"} Units • {preview?.nodeCount ?? "—"} Lessons • {preview ? formatEstimatedDuration(preview.estimatedMinutes) : "—"}
          </Text>

          {isPreviewLoading ? (
            <View className="py-4 items-center justify-center">
              <ActivityIndicator color={courseAccentColor} />
            </View>
          ) : preview ? (
            <View className="gap-3 mb-6">
              {preview.sections.map((section) => (
                <CoursePreviewSectionRow
                  key={section.id}
                  accentColor={resolveSectionPreviewAccentColor(section.orderIndex)}
                  section={section}
                />
              ))}
            </View>
          ) : null}

          <Button
            label={isEnrolled ? "Open Journey" : isStartingCourse ? "Enrolling..." : "Enroll in Course"}
            loading={isStartingCourse && !isEnrolled}
            onPress={() => onEnroll(course.id)}
            className="mt-2"
          />
        </View>
      )}
    </View>
  );
});

const CourseMetricCard = React.memo(function CourseMetricCard({
  value,
  label,
}: CourseMetricCardProps): React.JSX.Element {
  return (
    <Card
      variant="tile"
      radius="md"
      showDepth={false}
      className="min-h-[70px] flex-1"
      contentClassName="items-center justify-center gap-1 p-2"
    >
      <Text
        variant="body-bold"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.82}
        className="w-full text-center text-[19px]"
      >
        {value}
      </Text>
      <Text
        variant="body"
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.62}
        className="w-full text-center text-[11px]"
      >
        {label}
      </Text>
    </Card>
  );
});

const CoursePreviewSectionRow = React.memo(function CoursePreviewSectionRow({
  accentColor,
  section,
}: CoursePreviewSectionRowProps): React.JSX.Element {
  const visibleUnitSegments = Math.max(1, Math.min(section.unitCount, 5));
  const hiddenUnitCount = Math.max(section.unitCount - visibleUnitSegments, 0);

  return (
    <Card
      variant="tile"
      radius="xl"
      showDepth={false}
      contentClassName="p-0 overflow-hidden"
    >
      {/* Accent border strip on the left edge */}
      <View
        className="absolute bottom-0 left-0 top-0 w-2 z-10"
        style={{ backgroundColor: accentColor }}
      />

      <View className="p-4 pl-6 gap-3">
        <View className="flex-row items-start gap-3">
          <View
            className="h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${accentColor}1A` }}
          >
            <RNText
              className="happy-font-body-bold text-[18px]"
              style={{ color: accentColor }}
            >
              {section.orderIndex}
            </RNText>
          </View>

          <View className="flex-1 gap-1">
            <Text
              variant="body-bold"
              className="text-[18px] leading-[23px] text-ink"
              numberOfLines={2}
            >
              {section.title}
            </Text>
            <Text variant="caption-muted" className="uppercase tracking-[0.8px]">
              Section {section.orderIndex}
            </Text>
          </View>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <View className="happy-brand-status-chip px-3 py-1.5">
            <Text variant="chip" color="soft">
              {formatPreviewCount(section.unitCount, "unit")}
            </Text>
          </View>
          <View className="happy-brand-status-chip px-3 py-1.5">
            <Text variant="chip" color="soft">
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
            <View className="happy-brand-status-chip px-2.5 py-1">
              <Text variant="chip" color="muted" className="text-[11px]">
                +{hiddenUnitCount}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Card>
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
  const interactionColor = SAGE[500];

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
      {/* Centered grab handle affordance */}
      <View className="w-12 h-1 bg-sage-200/80 rounded-full self-center mt-3 mb-1" />

      <View
        className="flex-row items-center justify-between happy-brand-screen px-5 pt-2 pb-1"
      >
        <View className="h-11 w-11" />
        <Pressable
          onPress={onClose}
          className="h-11 w-11 items-center justify-center rounded-[22px] border-2 border-b-4 border-sage-100 border-b-sage-200 bg-warm-white"
          accessibilityRole="button"
          accessibilityLabel="Close journey explorer"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={SAGE[600]} />
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
              <CourseAccordionCard
                course={item}
                isExpanded={item.id === selectedCourseId}
                isEnrolled={enrolledCourseIds.has(item.id)}
                onToggle={handleCoursePress}
                preview={item.id === selectedCourseId ? preview : null}
                isPreviewLoading={item.id === selectedCourseId ? isPreviewLoading : false}
                isStartingCourse={item.id === selectedCourseId ? isStartingCourse : false}
                onEnroll={handlePrimaryActionPress}
              />
            )}
            ListEmptyComponent={
              isCatalogLoading ? (
                <View className="min-h-[92px] min-w-[240px] items-center justify-center px-5">
                  <ActivityIndicator color={interactionColor} />
                </View>
              ) : (
                <View className="min-h-[92px] min-w-[240px] items-center justify-center px-5">
                  <Text variant="body" className="text-center text-[15px]">
                    No published courses are available yet.
                  </Text>
                </View>
              )
            }
          />

          {selectedCourse ? (
            <View className="mx-5 gap-5">
              <Card
                variant="tile"
                radius="xl"
                showDepth={false}
                contentClassName="p-5 gap-5"
              >
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
                        <RNText
                          className="happy-font-heading text-[32px]"
                          style={{ color: courseAccentColor }}
                        >
                          {getCourseMonogram(selectedCourse.title)}
                        </RNText>
                      )}
                    </View>
                  </View>

                  <View className="flex-1 gap-2">
                    <View className="happy-brand-soft-chip self-start px-3 py-1">
                      <Text variant="chip" color="sage" className="uppercase tracking-[0.8px] text-[11px]">
                        {isSelectedCourseEnrolled ? "Enrolled" : "New journey"}
                      </Text>
                    </View>
                    <Text variant="h1">
                      {selectedCourse.title}
                    </Text>
                    <Text variant="body" className="text-[15px] leading-[22px]">
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
              </Card>

              <View className="gap-3">
                <View className="flex-row items-center justify-between gap-3 px-1">
                  <View>
                    <Text variant="h2">
                      Journey Preview
                    </Text>
                    <Text variant="body" color="soft" className="text-sm">
                      The path you will move through
                    </Text>
                  </View>
                  <View className="happy-brand-status-chip px-3 py-1.5">
                    <Text variant="chip" color="sage" className="uppercase tracking-[0.7px]">
                      {isSelectedCourseEnrolled ? "In progress" : "Ready"}
                    </Text>
                  </View>
                </View>

                {isPreviewLoading ? (
                  <View className="min-h-[132px] items-center justify-center gap-2.5 rounded-[24px] bg-warm-white">
                    <ActivityIndicator color={interactionColor} />
                    <Text variant="body" color="soft" className="text-sm">
                      Loading journey preview...
                    </Text>
                  </View>
                ) : isPreviewError ? (
                  <View className="min-h-[132px] items-center justify-center gap-2.5 rounded-[24px] bg-warm-white px-6">
                    <Text variant="body" className="text-center text-[15px]">
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

        <Button
          label={primaryButtonLabel}
          disabled={!selectedCourse}
          loading={isStartingCourse}
          onPress={handlePrimaryActionPress}
          className="mx-5 mt-4"
        />
      </View>
    </View>
  );
}

export default function CourseCatalogSheet(
  props: CourseCatalogSheetProps,
): React.JSX.Element | null {
  if (!props.isPresented) {
    return null;
  }

  return (
    <FullWindowOverlay>
      <View className="absolute inset-0">
        {/* Instant static dark backdrop with press to close */}
        <Pressable
          className="absolute inset-0 bg-black/40"
          onPress={props.onClose}
        />
        {/* Rounded top sheet drawer overlay positioned at top: 60 */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            top: 60,
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            backgroundColor: "#F8FAF7", // Sage canvas
            shadowColor: "#2B3A22",
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.12,
            shadowRadius: 16,
            elevation: 24,
            overflow: "hidden",
          }}
        >
          <CourseCatalogSheetContent {...props} onClose={props.onClose} />
        </View>
      </View>
    </FullWindowOverlay>
  );
}
