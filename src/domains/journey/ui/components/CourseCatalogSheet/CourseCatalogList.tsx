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
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
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
    <View className="mb-5 gap-1.5 px-1">
      <Text variant="display">Explore Journeys</Text>
      <Text variant="body">Choose a journey to explore.</Text>
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
  const desc = course.description;

  return (
    <Pressable
      onPress={() => onPress(course.id)}
      className="flex-row items-center gap-3.5 rounded-2xl px-2 py-3.5 active:bg-black/[0.03]"
      accessibilityRole="button"
      accessibilityLabel={`View ${course.title} course details`}
    >
      {/* Artwork Column - Standardized Footprint */}
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
          <Text variant="h3" style={{ color: accentColor }}>
            {getCourseMonogram(course.title)}
          </Text>
        )}
      </View>

      {/* Content Column */}
      <View className="flex-1 justify-center gap-0.5">
        <View className="flex-row items-center gap-2 flex-wrap">
          <Text variant="body-bold" className="text-[17px] leading-[22px] text-ink">
            {course.title}
          </Text>
          {isEnrolled ? (
            <Text className="happy-font-body-medium text-[13px] leading-[18px] text-sage-600">
              Enrolled
            </Text>
          ) : null}
        </View>
        {desc ? (
          <Text
            className="happy-font-body text-[13.5px] leading-[19px] text-ink-soft"
            numberOfLines={2}
          >
            {desc}
          </Text>
        ) : null}
      </View>

      {/* Disclosure Column */}
      <View className="w-5 items-end justify-center">
        <HugeiconsIcon icon={ArrowRight01Icon} size={18} color={SEMANTIC_COLORS.text.secondary} />
      </View>
    </Pressable>
  );
}

function CourseRowSeparator(): React.JSX.Element {
  return <View className="h-px bg-black/[0.06] mx-2" />;
}

function CourseCatalogSkeleton(): React.JSX.Element {
  return (
    <View className="gap-5 py-4" accessibilityLabel="Loading journeys">
      {Array.from({ length: 2 }).map((_, index) => (
        <View key={index} className="flex-row items-center gap-3.5 px-2 py-3.5">
          <Skeleton width={56} height={56} radius={16} />
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
