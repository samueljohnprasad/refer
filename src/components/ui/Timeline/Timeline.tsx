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
import { SAGE } from "@/lib/tokens";
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
        <ActivityIndicator size="small" color={SAGE[500]} />
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

      return (
        <View className="flex-row items-stretch">
          {/* ── Stem Column ────────────────────────────────────────── */}
          <View className="w-[68px] items-center relative">
            {/* The dotted line */}
            {!(isVeryFirst && isVeryLast) && (
              <TimelineStemLine
                flex={true}
                style={{
                  marginTop: isVeryFirst ? 0 : 0,
                  marginBottom: isVeryLast ? 24 : 0,
                }}
              />
            )}

            {/* The Date Badge */}
            {isFirstItemInSection && (
              <View className="absolute top-0 rounded-2xl py-0.5 bg-[#F9FAFB] dark:bg-black w-full items-center">
                <TimelineSectionHeader date={section.date} title={section.title} mode={mode} />
              </View>
            )}
          </View>

          {/* ── Card Column ────────────────────────────────────────── */}
          <View className="flex-1 pl-4 pb-6">{renderItem(item, index)}</View>
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
          <View style={{ height: Math.max(0, headerHeight - insets.top + 16) }} />
          {ListHeaderComponent}
        </>
      }
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={<LoadingFooter visible={isLoadingMore} />}
      contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: 16 }}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

const Timeline = React.memo(TimelineInner) as typeof TimelineInner;
export { Timeline };

const STEM_WIDTH = 44;
const STEM_LINE_COLOR = "rgba(0, 0, 0, 0.12)";
