import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
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
import { Cancel01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
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
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  LinearTransition,
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
import { getCourseMonogram, resolveCourseAccentColor } from "./courseVisuals";
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
  isStartingCourse: boolean;
  enrollmentError?: string | null;
  onEnroll: (courseId: string) => void;
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

function formatPreviewCount(value: number, singularLabel: string): string {
  return `${value} ${value === 1 ? singularLabel : `${singularLabel}s`}`;
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
  isStartingCourse,
  enrollmentError,
  onEnroll,
}: CourseAccordionCardProps): React.JSX.Element {
  const courseAccentColor = resolveCourseAccentColor(course.colorHex);

  const { data: selectedCourseTree, isFetching: isPreviewLoading } =
    useGetCourseTreeQuery(course.id, {
      skip: !isExpanded,
    });

  const preview = useMemo(
    () =>
      selectedCourseTree ? buildCourseJourneyPreview(selectedCourseTree) : null,
    [selectedCourseTree],
  );

  // Reanimated shared values
  const expansionProgress = useSharedValue(isExpanded ? 1 : 0);

  useEffect(() => {
    expansionProgress.value = withTiming(isExpanded ? 1 : 0, {
      duration: 350,
      easing: Easing.out(Easing.exp),
    });
  }, [isExpanded, expansionProgress]);

  const animatedChevronStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(expansionProgress.value, [0, 1], [0, 180])}deg`,
        },
      ],
    };
  });

  return (
    <Animated.View
      layout={LinearTransition.duration(350).easing(Easing.out(Easing.exp))}
      className="mb-4 bg-white rounded-2xl shadow-sm shadow-slate-200/20 overflow-hidden"
    >
      <Pressable
        onPress={() => onToggle(course.id)}
        className="flex-row items-center justify-between p-5"
        style={isExpanded ? { backgroundColor: `${courseAccentColor}08` } : {}}
      >
        <View className="flex-row items-center gap-4 flex-1">
          <View
            className="h-10 w-10 items-center justify-center rounded-[12px]"
            style={{ backgroundColor: `${courseAccentColor}1A` }}
          >
            {course.iconUrl ? (
              <Image
                source={course.iconUrl}
                className="h-5 w-5 rounded-md"
                cachePolicy="memory-disk"
                contentFit="contain"
              />
            ) : (
              <RNText
                className="happy-font-heading text-lg"
                style={{ color: courseAccentColor }}
              >
                {getCourseMonogram(course.title)}
              </RNText>
            )}
          </View>
          <View className="flex-1">
            <Text variant="body-bold" className="text-base text-ink">
              {course.title}
            </Text>
            {isEnrolled && (
              <Text
                variant="chip"
                color="sage"
                className="uppercase tracking-wider text-xs mt-1"
              >
                Enrolled
              </Text>
            )}
          </View>
        </View>
        <Animated.View style={animatedChevronStyle} className="px-2">
          <HugeiconsIcon
            icon={ArrowDown01Icon}
            size={20}
            color="#94A3B8"
            strokeWidth={2.5}
          />
        </Animated.View>
      </Pressable>

      {isExpanded && (
        <View
          className="p-5 pt-0 border-t border-slate-100/50"
          style={{ backgroundColor: `${courseAccentColor}04` }}
        >
          <Text
            variant="body"
            className="text-base leading-relaxed text-ink-soft mt-4 mb-3"
          >
            {course.description || "A guided journey you can start today."}
          </Text>

          <Text variant="caption-muted" className="text-sm font-medium mb-6">
            {preview?.unitCount ?? "—"} Units • {preview?.nodeCount ?? "—"}{" "}
            Lessons •{" "}
            {preview ? formatEstimatedDuration(preview.estimatedMinutes) : "—"}
          </Text>

          {isPreviewLoading ? (
            <View className="mb-6 gap-3 animate-pulse px-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <View
                  key={i}
                  className="flex-row items-center gap-4 py-3 border-b border-slate-200/40 last:border-b-0"
                >
                  <View className="h-10 w-10 rounded-[12px] bg-slate-200/50" />
                  <View className="flex-1 gap-2">
                    <View className="h-4 w-2/3 rounded bg-slate-200/60" />
                    <View className="h-3 w-1/3 rounded bg-slate-100" />
                  </View>
                </View>
              ))}
            </View>
          ) : preview ? (
            <View className="mb-6 gap-1 px-1">
              {preview.sections.map((section) => (
                <CoursePreviewSectionRow
                  key={section.id}
                  accentColor={courseAccentColor}
                  section={section}
                />
              ))}
            </View>
          ) : null}

          {enrollmentError && (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="bg-red-50/50 p-3 rounded-xl border border-red-100/50 mb-3 items-center"
            >
              <Text variant="caption" className="text-red-700 font-medium">
                {enrollmentError}
              </Text>
            </Animated.View>
          )}

          <Button
            label={
              isEnrolled
                ? "Open Journey"
                : isStartingCourse
                  ? "Enrolling..."
                  : "Enroll in Course"
            }
            loading={isStartingCourse && !isEnrolled}
            onPress={() => onEnroll(course.id)}
            className="mt-2"
          />
        </View>
      )}
    </Animated.View>
  );
});

const CoursePreviewSectionRow = React.memo(function CoursePreviewSectionRow({
  accentColor,
  section,
}: CoursePreviewSectionRowProps): React.JSX.Element {
  const visibleUnitSegments = Math.max(1, Math.min(section.unitCount, 5));
  const hiddenUnitCount = Math.max(section.unitCount - visibleUnitSegments, 0);

  return (
    <View className="flex-row items-center gap-4 py-3 border-b border-slate-200/40 last:border-b-0">
      <View
        className="h-10 w-10 items-center justify-center rounded-[12px]"
        style={{ backgroundColor: `${accentColor}1A` }}
      >
        <RNText
          className="happy-font-heading text-base"
          style={{ color: accentColor }}
        >
          {section.orderIndex}
        </RNText>
      </View>

      <View className="flex-1 gap-1">
        <Text
          variant="body-bold"
          className="text-base leading-snug text-ink"
          numberOfLines={1}
        >
          {section.title}
        </Text>
        <Text variant="caption-muted" className="text-sm">
          {formatPreviewCount(section.unitCount, "unit")} •{" "}
          {formatPreviewCount(section.nodeCount, "lesson")}
        </Text>

        {/* Visual density map for unit segments */}
        <View className="flex-row items-center gap-1 mt-1">
          {Array.from({ length: visibleUnitSegments }).map((_, i) => (
            <View
              key={i}
              className="h-1.5 flex-1 max-w-[24px] rounded-full opacity-50"
              style={{ backgroundColor: accentColor }}
            />
          ))}
          {hiddenUnitCount > 0 && (
            <Text className="text-[10px] font-bold tracking-widest text-ink-muted ml-1">
              +{hiddenUnitCount}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
});

export function CourseCatalogSheetContent({
  activeCourseId,
  enrolledCourses,
  isPresented,
  onClose,
  onCourseSelect,
}: CourseCatalogSheetProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList>(null);
  const [expandedCourseIds, setExpandedCourseIds] = useState<Set<string>>(
    new Set(),
  );
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);

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

    const hasValidExpanded = Array.from(expandedCourseIds).some((id) =>
      catalogCourses.some((c) => c.id === id),
    );
    if (hasValidExpanded) {
      return;
    }

    const initialId = resolveInitialCourseId(
      catalogCourses,
      enrolledCourseIds,
      activeCourseId,
    );
    if (initialId) {
      setExpandedCourseIds(new Set([initialId]));
    }
  }, [
    activeCourseId,
    catalogCourses,
    enrolledCourseIds,
    isPresented,
    expandedCourseIds,
  ]);

  const [startCourse, { isLoading: isStartingCourse }] =
    useStartCourseMutation();

  const interactionColor = SAGE[500];

  const handleToggle = useCallback(
    (id: string) => {
      setExpandedCourseIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);

          const idx = catalogCourses.findIndex((c) => c.id === id);
          if (idx !== -1 && listRef.current) {
            setTimeout(() => {
              listRef.current?.scrollToIndex({
                index: idx,
                animated: true,
                viewPosition: 0,
              });
            }, 150);
          }
        }
        return next;
      });
      setEnrollmentError(null);
    },
    [catalogCourses],
  );

  const handlePrimaryActionPress = useCallback(
    async (courseId: string) => {
      setEnrollmentError(null);
      const course = catalogCourses.find((c) => c.id === courseId);
      if (!course) {
        return;
      }
      const isEnrolled = enrolledCourseIds.has(courseId);

      try {
        if (!isEnrolled) {
          await startCourse(courseId).unwrap();
        }

        onCourseSelect?.(courseId);
        onClose();
      } catch (error) {
        setEnrollmentError(getErrorMessage(error));
      }
    },
    [catalogCourses, enrolledCourseIds, startCourse, onCourseSelect, onClose],
  );

  const renderCourseItem = useCallback(
    ({ item }: { item: CourseCatalogListItem }) => (
      <CourseAccordionCard
        course={item}
        isExpanded={expandedCourseIds.has(item.id)}
        isEnrolled={enrolledCourseIds.has(item.id)}
        onToggle={handleToggle}
        isStartingCourse={isStartingCourse && expandedCourseIds.has(item.id)}
        enrollmentError={
          expandedCourseIds.has(item.id) ? enrollmentError : null
        }
        onEnroll={handlePrimaryActionPress}
      />
    ),
    [
      expandedCourseIds,
      enrolledCourseIds,
      handleToggle,
      isStartingCourse,
      enrollmentError,
      handlePrimaryActionPress,
    ],
  );

  return (
    <View
      className="flex-1 happy-brand-screen"
      style={{ paddingTop: Math.max(insets.top, 12) }}
    >
      <View className="flex-row items-center justify-between px-5 pt-2 pb-1">
        <View className="h-11 w-11" />
        <Pressable
          onPress={onClose}
          className="h-11 w-11 items-center justify-center rounded-full bg-slate-100/80"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={SAGE[600]} />
        </Pressable>
      </View>

      <View className="flex-1">
        <FlatList
          ref={listRef}
          data={catalogCourses}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 pb-28 pt-2"
          showsVerticalScrollIndicator={false}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              listRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0,
              });
            });
          }}
          ListHeaderComponent={
            <View className="gap-2 px-1 mb-12">
              <Text className="happy-font-heading text-4xl leading-10 text-ink">
                Explore Journeys
              </Text>
              <Text className="happy-font-body text-base leading-relaxed text-ink-soft">
                Browse every published course, preview the path, and enroll when
                you are ready.
              </Text>
            </View>
          }
          renderItem={renderCourseItem}
          ListEmptyComponent={
            isCatalogLoading ? (
              <View className="py-12 items-center justify-center">
                <ActivityIndicator color={interactionColor} />
              </View>
            ) : (
              <View className="py-12 items-center justify-center">
                <Text
                  variant="body"
                  className="text-center text-base text-ink-muted"
                >
                  No published courses are available yet.
                </Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
}

export default function CourseCatalogSheet(
  props: CourseCatalogSheetProps,
): React.JSX.Element | null {
  const [shouldRender, setShouldRender] = useState(props.isPresented);

  useEffect(() => {
    if (props.isPresented) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [props.isPresented]);

  if (!shouldRender) {
    return null;
  }

  return (
    <FullWindowOverlay>
      <View
        style={{ flex: 1 }}
        pointerEvents={props.isPresented ? "auto" : "none"}
      >
        {props.isPresented && (
          <>
            <Animated.View
              entering={FadeIn.duration(300).easing(Easing.out(Easing.cubic))}
              exiting={FadeOut.duration(200)}
              className="absolute inset-0"
            >
              <Pressable
                className="absolute inset-0 bg-black/40"
                onPress={props.onClose}
              />
            </Animated.View>

            <Animated.View
              entering={SlideInDown.duration(400).easing(
                Easing.out(Easing.exp),
              )}
              exiting={SlideOutDown.duration(250).easing(
                Easing.in(Easing.cubic),
              )}
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                top: 0,
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
            </Animated.View>
          </>
        )}
      </View>
    </FullWindowOverlay>
  );
}
