import React from "react";
import { FlatList, Pressable, View } from "react-native";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Skeleton } from "@/src/components/ui/Skeleton";
import { Text } from "@/src/components/ui/Text";
import { SAGE } from "@/lib/tokens";
import type { CourseCatalogListItem } from "@/src/types/journeyV5";
import { CourseAccordionCard } from "./CourseAccordionCard";

interface CourseCatalogModel {
  insets: { top: number; bottom: number };
  listRef: React.RefObject<FlatList<CourseCatalogListItem> | null>;
  expandedCourseId: string | null;
  enrollmentError: string | null;
  catalogCourses: CourseCatalogListItem[];
  isCatalogLoading: boolean;
  enrolledCourseIds: Set<string>;
  isStartingCourse: boolean;
}

interface CourseCatalogActions {
  handleToggle: (courseId: string) => void;
  handlePrimaryActionPress: (courseId: string) => void;
  onClose: () => void;
}

function CourseCatalogLoadingState(): React.JSX.Element {
  return (
    <View className="gap-3 py-4" accessibilityLabel="Loading journeys">
      {Array.from({ length: 2 }).map((_, index) => (
        <View key={index} className="rounded-xl border border-slate-100 bg-white p-4">
          <View className="flex-row items-center gap-3">
            <Skeleton width={44} height={44} radius={12} />
            <View className="flex-1 gap-2">
              <Skeleton width="58%" height={15} radius={7} />
              <Skeleton width="32%" height={11} radius={5} />
            </View>
            <Skeleton width={20} height={20} radius={10} />
          </View>
        </View>
      ))}
    </View>
  );
}

export function CourseCatalogSheetContent({
  model,
  actions,
}: {
  model: CourseCatalogModel;
  actions: CourseCatalogActions;
}): React.JSX.Element {
  const {
    insets,
    listRef,
    expandedCourseId,
    enrollmentError,
    catalogCourses,
    isCatalogLoading,
    enrolledCourseIds,
    isStartingCourse,
  } = model;

  React.useEffect(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [listRef]);

  return (
    <View className="flex-1 happy-brand-screen" style={{ paddingTop: Math.max(insets.top, 12) }}>
      <View className="flex-row items-center justify-between px-5 pt-2 pb-1">
        <View className="h-11 w-11" />
        <Pressable
          onPress={actions.onClose}
          className="h-11 w-11 items-center justify-center rounded-full bg-slate-100/80"
          accessibilityRole="button"
          accessibilityLabel="Close course catalog"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={20} color={SAGE[600]} />
        </Pressable>
      </View>

      <FlatList
        ref={listRef}
        data={catalogCourses}
        keyExtractor={(item) => item.id}
        contentContainerClassName="px-5 pt-3"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-2 px-1 mb-8">
            <Text className="happy-font-heading text-4xl leading-10 text-ink">
              Explore Journeys
            </Text>
            <Text className="happy-font-body text-base leading-relaxed text-ink-soft">
              Preview a journey, then start when you are ready.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <CourseAccordionCard
            course={item}
            isExpanded={expandedCourseId === item.id}
            isEnrolled={enrolledCourseIds.has(item.id)}
            onToggle={actions.handleToggle}
            isStartingCourse={isStartingCourse && expandedCourseId === item.id}
            enrollmentError={expandedCourseId === item.id ? enrollmentError : null}
            onEnroll={actions.handlePrimaryActionPress}
          />
        )}
        ListEmptyComponent={
          isCatalogLoading ? (
            <CourseCatalogLoadingState />
          ) : (
            <View className="items-center justify-center py-12">
              <Text variant="body" className="text-center text-base text-ink-muted">
                No published courses are available yet.
              </Text>
            </View>
          )
        }
      />
    </View>
  );
}
