import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  View,
  Text as RNText,
} from "react-native";
import { Image } from "expo-image";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { FullWindowOverlay } from "react-native-screens";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  LinearTransition,
} from "react-native-reanimated";

import type { CourseCatalogListItem, CourseJourneyPreviewSection } from "@/src/types/journeyV5";
import { getCourseMonogram } from "@/src/domains/journey/model/courseVisuals";
import { SAGE } from "@/lib/tokens";
import { useCourseAccordionViewModel } from "../../hooks/useCourseCatalogViewModel";

function formatEstimatedDuration(estimatedMinutes: number): string {
  if (estimatedMinutes < 60) return `${estimatedMinutes} min`;
  const totalHours = Math.round((estimatedMinutes / 60) * 10) / 10;
  return `${totalHours} hrs`;
}

function formatPreviewCount(value: number, singularLabel: string): string {
  return `${value} ${value === 1 ? singularLabel : `${singularLabel}s`}`;
}

const CoursePreviewSectionRow = React.memo(function CoursePreviewSectionRow({
  accentColor,
  section,
}: {
  accentColor: string;
  section: CourseJourneyPreviewSection;
}): React.JSX.Element {
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

export interface CourseAccordionCardProps {
  course: CourseCatalogListItem;
  isExpanded: boolean;
  isEnrolled: boolean;
  onToggle: (courseId: string) => void;
  isStartingCourse: boolean;
  enrollmentError?: string | null;
  onEnroll: (courseId: string) => void;
}

/**
 * Containerized accordion card separating tree query fetching via useCourseAccordionViewModel
 */
export const CourseAccordionCard = React.memo(function CourseAccordionCard({
  course,
  isExpanded,
  isEnrolled,
  onToggle,
  isStartingCourse,
  enrollmentError,
  onEnroll,
}: CourseAccordionCardProps): React.JSX.Element {
  const { courseAccentColor, isPreviewLoading, preview, animatedChevronStyle } = useCourseAccordionViewModel(
    course,
    isExpanded,
  );

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

export function CourseCatalogSheetContent({
  model,
  actions,
}: {
  model: any;
  actions: any;
}): React.JSX.Element {
  const {
    insets,
    listRef,
    expandedCourseIds,
    enrollmentError,
    catalogCourses,
    isCatalogLoading,
    enrolledCourseIds,
    isStartingCourse,
  } = model;

  const { handleToggle, handlePrimaryActionPress, onClose } = actions;
  const interactionColor = SAGE[500];

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
          renderItem={({ item }) => (
            <CourseAccordionCard
              course={item}
              isExpanded={expandedCourseIds.has(item.id)}
              isEnrolled={enrolledCourseIds.has(item.id)}
              onToggle={handleToggle}
              isStartingCourse={isStartingCourse && expandedCourseIds.has(item.id)}
              enrollmentError={expandedCourseIds.has(item.id) ? enrollmentError : null}
              onEnroll={handlePrimaryActionPress}
            />
          )}
          ListEmptyComponent={
            isCatalogLoading ? (
              <View className="py-12 items-center justify-center">
                <ActivityIndicator color={interactionColor} />
              </View>
            ) : (
              <View className="py-12 items-center justify-center">
                <Text variant="body" className="text-center text-base text-ink-muted">
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

/**
 * Presentational view component for CourseCatalogSheet.
 */
export const CourseCatalogView = React.memo(function CourseCatalogView({
  model,
  actions,
}: {
  model: any;
  actions: any;
}): React.JSX.Element | null {
  if (!model.shouldRender) {
    return null;
  }

  return (
    <FullWindowOverlay>
      <View
        style={{ flex: 1 }}
        pointerEvents={model.isPresented ? "auto" : "none"}
      >
        {model.isPresented && (
          <>
            <Animated.View
              entering={FadeIn.duration(300).easing(Easing.out(Easing.cubic))}
              exiting={FadeOut.duration(200)}
              className="absolute inset-0"
            >
              <Pressable
                className="absolute inset-0 bg-black/40"
                onPress={actions.onClose}
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
                backgroundColor: "#F8FAF7",
                shadowColor: "#2B3A22",
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.12,
                shadowRadius: 16,
                elevation: 24,
                overflow: "hidden",
              }}
            >
              <CourseCatalogSheetContent model={model} actions={actions} />
            </Animated.View>
          </>
        )}
      </View>
    </FullWindowOverlay>
  );
});
