import React from "react";
import { Pressable, View } from "react-native";
import { Image } from "expo-image";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { Button } from "@/src/components/ui/Button";
import { Text } from "@/src/components/ui/Text";
import type {
  CourseCatalogListItem,
  CourseJourneyPreviewSection,
} from "@/src/types/journeyV5";
import { getCourseImageSource, getCourseMonogram } from "@/src/domains/journey/model/courseVisuals";
import { SAGE } from "@/lib/tokens";
import { useCourseAccordionViewModel } from "../../hooks/useCourseCatalogViewModel";

function formatEstimatedDuration(estimatedMinutes: number): string {
  if (estimatedMinutes < 60) return `${estimatedMinutes} min`;
  return `${Math.round((estimatedMinutes / 60) * 10) / 10} hrs`;
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
    <View className="flex-row items-center gap-4 border-b border-slate-200/40 py-3 last:border-b-0">
      <View
        className="h-10 w-10 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accentColor}1A` }}
      >
        <Text variant="label-bold" style={{ color: accentColor }}>
          {section.orderIndex}
        </Text>
      </View>

      <View className="flex-1 gap-1">
        <Text variant="body-bold" className="text-base leading-snug text-ink" numberOfLines={1}>
          {section.title}
        </Text>
        <Text variant="caption-muted" className="text-sm">
          {formatPreviewCount(section.unitCount, "unit")} · {formatPreviewCount(section.nodeCount, "lesson")}
        </Text>
        <View className="mt-1 flex-row items-center gap-1" accessibilityLabel={`${section.unitCount} units`}>
          {Array.from({ length: visibleUnitSegments }).map((_, index) => (
            <View
              key={index}
              className="h-1.5 max-w-[24px] flex-1 rounded-full opacity-50"
              style={{ backgroundColor: accentColor }}
            />
          ))}
          {hiddenUnitCount > 0 ? (
            <Text className="ml-1 text-[10px] font-bold tracking-widest text-ink-muted">
              +{hiddenUnitCount}
            </Text>
          ) : null}
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

export const CourseAccordionCard = React.memo(function CourseAccordionCard({
  course,
  isExpanded,
  isEnrolled,
  onToggle,
  isStartingCourse,
  enrollmentError,
  onEnroll,
}: CourseAccordionCardProps): React.JSX.Element {
  const {
    courseAccentColor,
    preview,
    animatedChevronStyle,
  } = useCourseAccordionViewModel(course, isExpanded);
  const courseImageSource = getCourseImageSource(course.id, course.iconUrl);
  const canStartCourse = isEnrolled || Boolean(preview);
  const primaryLabel = isEnrolled
    ? "Continue journey"
    : isStartingCourse
      ? "Enrolling…"
      : enrollmentError
        ? "Try again"
        : preview
          ? "Enroll in course"
          : "Coming soon";

  return (
    <Animated.View
      layout={LinearTransition.duration(280).easing(Easing.out(Easing.exp))}
      className="mb-3 overflow-hidden rounded-xl border border-slate-100 bg-white"
    >
      <View
        className="flex-row items-center p-4"
        style={isExpanded ? { backgroundColor: `${courseAccentColor}08` } : undefined}
      >
        <Pressable
          onPress={() => onToggle(course.id)}
          className="flex-1 flex-row items-center gap-3"
          accessibilityRole="button"
          accessibilityLabel={`${course.title}, ${isExpanded ? "collapse" : "expand"} course details`}
        >
          <View
            className="h-11 w-11 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${courseAccentColor}1A` }}
          >
            {courseImageSource ? (
              <Image
                source={courseImageSource}
                style={{ width: 30, height: 30, borderRadius: 8 }}
                cachePolicy="memory-disk"
                contentFit="contain"
              />
            ) : (
              <Text variant="body-bold" style={{ color: courseAccentColor }}>
                {getCourseMonogram(course.title)}
              </Text>
            )}
          </View>
          <View className="flex-1">
            <Text variant="body-bold" className="text-base text-ink">
              {course.title}
            </Text>
            {isEnrolled ? (
              <Text variant="chip" color="sage" className="mt-1 uppercase tracking-wider">
                Enrolled
              </Text>
            ) : null}
          </View>
        </Pressable>

        <View className="ml-2 flex-row items-center gap-1">
          <Pressable
            onPress={() => onToggle(course.id)}
            className="h-10 w-10 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={`${isExpanded ? "Collapse" : "Expand"} ${course.title}`}
          >
            <Animated.View style={animatedChevronStyle}>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={20}
                color={SAGE[400]}
                strokeWidth={2.5}
              />
            </Animated.View>
          </Pressable>
        </View>
      </View>

      {isExpanded ? (
        <View className="px-4 pb-4" style={{ backgroundColor: `${courseAccentColor}04` }}>
          <Text variant="body" className="mb-3 mt-2 text-base leading-relaxed text-ink-soft">
            {course.description || "A guided journey you can start today."}
          </Text>

          <Text variant="caption-muted" className="mb-5 text-sm font-medium">
            {preview
              ? `${preview.unitCount} Units · ${preview.nodeCount} Lessons · ${formatEstimatedDuration(preview.estimatedMinutes)}`
              : "Course details coming soon"}
          </Text>

          {preview ? (
            <View className="mb-5 px-1">
              {preview.sections.map((section) => (
                <CoursePreviewSectionRow
                  key={section.id}
                  accentColor={courseAccentColor}
                  section={section}
                />
              ))}
            </View>
          ) : (
            <Text variant="caption" color="soft" className="mb-5 px-1">
              Course details will be available soon.
            </Text>
          )}

          {enrollmentError ? (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="mb-3 rounded-lg bg-red-50 p-3"
              accessibilityRole="alert"
            >
              <Text variant="caption" className="text-center font-medium text-red-700">
                {enrollmentError}
              </Text>
            </Animated.View>
          ) : null}

          <Button
            label={primaryLabel}
            disabled={!canStartCourse}
            loading={isStartingCourse && !isEnrolled}
            onPress={() => onEnroll(course.id)}
            className="mt-1"
          />
        </View>
      ) : null}
    </Animated.View>
  );
});
