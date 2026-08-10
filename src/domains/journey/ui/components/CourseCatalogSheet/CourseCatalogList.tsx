import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { Text } from "@/src/components/ui/Text";
import type { CourseCatalogListItem } from "@/src/types/journeyV5";
import {
  getCourseImageSource,
  getCourseMonogram,
  resolveCourseAccentColor,
} from "@/src/domains/journey/model/courseVisuals";
import { INK_MUTED } from "@/lib/tokens";
import { CourseSheetHeader } from "./CourseSheetHeader";

interface CourseCatalogListProps {
  insets: { top: number; bottom: number };
  listRef: React.RefObject<FlatList<CourseCatalogListItem> | null>;
  courses: CourseCatalogListItem[];
  enrolledCourseIds: Set<string>;
  isLoading: boolean;
  onCoursePress: (courseId: string) => void;
  onClose: () => void;
}

export function CourseCatalogList({
  insets,
  listRef,
  courses,
  enrolledCourseIds,
  isLoading,
  onCoursePress,
  onClose,
}: CourseCatalogListProps): React.JSX.Element {
  return (
    <View className="flex-1 happy-brand-screen" style={{ paddingTop: Math.max(insets.top, 12) }}>
      <CourseSheetHeader onClose={onClose} />
      <FlatList
        ref={listRef}
        data={courses}
        keyExtractor={(course) => course.id}
        contentContainerClassName="px-5 pt-3"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<CourseCatalogHeading />}
        ItemSeparatorComponent={CourseRowSeparator}
        renderItem={({ item }) => (
          <CourseCatalogRow
            course={item}
            isEnrolled={enrolledCourseIds.has(item.id)}
            onPress={onCoursePress}
          />
        )}
        ListEmptyComponent={
          isLoading ? <CourseCatalogSkeleton /> : <CourseCatalogEmptyState />
        }
      />
    </View>
  );
}

function CourseCatalogHeading(): React.JSX.Element {
  return (
    <View className="mb-8 gap-2 px-1">
      <Text variant="display">Explore Journeys</Text>
      <Text variant="body">Choose a journey to see its complete course.</Text>
    </View>
  );
}

function CourseCatalogRow({
  course,
  isEnrolled,
  onPress,
}: {
  course: CourseCatalogListItem;
  isEnrolled: boolean;
  onPress: (courseId: string) => void;
}): React.JSX.Element {
  const accentColor = resolveCourseAccentColor(course.colorHex);
  const imageSource = getCourseImageSource(course.iconUrl);

  return (
    <Pressable
      onPress={() => onPress(course.id)}
      className="min-h-20 flex-row items-center gap-3 py-4 active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={`View ${course.title} course details`}
    >
      <View
        className="h-16 w-16 items-center justify-center rounded-xl"
        style={imageSource ? undefined : { backgroundColor: `${accentColor}14` }}
      >
        {imageSource ? (
          <Image
            source={imageSource}
            style={{ width: 62, height: 62 }}
            cachePolicy="memory-disk"
            contentFit="contain"
          />
        ) : (
          <Text variant="h3" style={{ color: accentColor }}>
            {getCourseMonogram(course.title)}
          </Text>
        )}
      </View>

      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text variant="body-bold" className="flex-shrink text-base">
            {course.title}
          </Text>
          {isEnrolled ? (
            <Text variant="chip" color="sage">
              Enrolled
            </Text>
          ) : null}
        </View>
        {course.description ? (
          <Text variant="caption" numberOfLines={1}>
            {course.description}
          </Text>
        ) : null}
      </View>

      <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={INK_MUTED} />
    </Pressable>
  );
}

function CourseRowSeparator(): React.JSX.Element {
  return <View className="h-px bg-slate-100" />;
}

function CourseCatalogSkeleton(): React.JSX.Element {
  return (
    <View className="gap-5 py-4" accessibilityLabel="Loading journeys">
      {Array.from({ length: 2 }).map((_, index) => (
        <View key={index} className="flex-row items-center gap-3">
          <Skeleton width={64} height={64} radius={12} />
          <View className="flex-1 gap-2">
            <Skeleton width="58%" height={16} radius={6} />
            <Skeleton width="78%" height={12} radius={5} />
          </View>
        </View>
      ))}
    </View>
  );
}

function CourseCatalogEmptyState(): React.JSX.Element {
  return (
    <View className="items-center justify-center py-12">
      <Text variant="body" className="text-center">
        No published courses are available.
      </Text>
    </View>
  );
}
