/**
 * Timeline — Generic Reusable Primitive
 *
 * A SectionList-based timeline with:
 *  - Dashed vertical stem on the left
 *  - Day headers with date badges
 *  - Dot indicators per item (filled = completed, ring = in_progress)
 *  - Consumer-provided card via `renderItem` render prop
 *
 * Usage:
 * ```tsx
 * <Timeline
 *   sections={sections}
 *   renderItem={(item) => <MyCard item={item} />}
 * />
 * ```
 */

import React, { useCallback, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { LegendList } from "@legendapp/list";
import { useHeaderHeight } from "expo-router/react-navigation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { RADIUS } from "@/src/theme/radius";
import { TimelineSectionHeader } from "./TimelineSectionHeader";
import { TimelineDot } from "./TimelineDot";
import { TimelineStemLine } from "./TimelineStemLine";
import type { TimelineItemData, TimelineProps, TimelineSection } from "./types";

// ─── Sub-components ─────────────────────────────────────────────────────

const LoadingFooter: React.FC<{ visible: boolean }> = React.memo(
  ({ visible }) => {
    if (!visible) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color={SEMANTIC_COLORS.brand.primary} />
      </View>
    );
  },
);
LoadingFooter.displayName = "LoadingFooter";

// ─── Timeline ───────────────────────────────────────────────────────────

function TimelineInner<T extends TimelineItemData>({
  sections,
  renderItem,
  onEndReached,
  isLoadingMore = false,
  ListHeaderComponent,
  ListEmptyComponent,
  mode = "days",
}: TimelineProps<T>): React.ReactElement {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  // Flatten sections for LegendList which expects a 1D array
  const flattenedData = useMemo(() => {
    const flat = [];
    const numSections = sections.length;
    for (let sIdx = 0; sIdx < numSections; sIdx++) {
      const section = sections[sIdx];
      const numItems = section.data.length;
      for (let iIdx = 0; iIdx < numItems; iIdx++) {
        flat.push({
          item: section.data[iIdx],
          section,
          index: iIdx,
          isVeryFirst: sIdx === 0 && iIdx === 0,
          isLastSection: sIdx === numSections - 1,
          isVeryLast: sIdx === numSections - 1 && iIdx === numItems - 1,
        });
      }
    }
    return flat;
  }, [sections]);

  // ── Render a single item row ──────────────────────────────────────────

  const renderRow = useCallback(
    ({ item: d }: { item: (typeof flattenedData)[0] }) => {
      const { item, section, index, isVeryFirst, isLastSection, isVeryLast } =
        d;
      const isFirstItemInSection: boolean = index === 0;
      const isLastItemInSection: boolean = index === section.data.length - 1;

      return (
        <View className="flex-row items-stretch px-4">
          {/* 1. Date Column (fixed width) */}
          <View className="w-[52px] items-end pt-[11px] pr-2">
            {isFirstItemInSection && (
              <TimelineSectionHeader date={section.date} title={section.title} mode={mode} />
            )}
          </View>

          {/* 2. Stem Column (fixed width, centered) */}
          <View className="w-[28px] items-center relative">
            {/* The dotted line connects ALL dots now (Point 6) */}
            {!(isVeryFirst && isVeryLast) && (
              <TimelineStemLine
                flex={false}
                style={{
                  position: 'absolute',
                  left: 13,
                  top: isVeryFirst ? 14 : 0,
                  bottom: isVeryLast ? undefined : 0,
                  height: isVeryLast ? 14 : undefined,
                }}
              />
            )}

            {/* The Dot (aligned with top of content, Point 5) */}
            <View className="absolute top-[14px] left-[4px] items-center">
              <TimelineDot status={item.status || "in_progress"} />
            </View>
          </View>

          {/* 3. Content Column (aligned x-position, Point 4) */}
          <View className="flex-1 pl-2 pb-3 pt-[10px]">
            {renderItem(item, index)}
          </View>
        </View>
      );
    },
    [renderItem],
  );

  // ── Key extractor ─────────────────────────────────────────────────────

  const keyExtractor = useCallback(
    (d: (typeof flattenedData)[0]) => d.item.id,
    [],
  );

  return (
    <LegendList
      data={flattenedData}
      keyExtractor={keyExtractor}
      renderItem={renderRow}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      estimatedItemSize={120} // good guess for average card height
      ListHeaderComponent={
        <>
          <View style={{ height: Math.max(0, headerHeight - insets.top) }} />
          {ListHeaderComponent}
        </>
      }
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={<LoadingFooter visible={isLoadingMore} />}
      contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      scrollEventThrottle={16}
    />
  );
}

const Timeline = React.memo(TimelineInner) as typeof TimelineInner;
export { Timeline };

const STEM_WIDTH = 44;
const STEM_LINE_COLOR = "rgba(0, 0, 0, 0.12)";
