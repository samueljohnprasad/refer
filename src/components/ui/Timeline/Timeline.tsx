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
import {
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { LegendList } from "@legendapp/list";
import { useHeaderHeight } from "expo-router/react-navigation";
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
      <View style={styles.footer}>
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
  contentPaddingTop,
  backgroundColor = "#F7F7F8",
}: TimelineProps<T>): React.ReactElement {
  const headerHeight = useHeaderHeight();
  const topPad: number = contentPaddingTop ?? headerHeight + 24;

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
    ({ item: d }: { item: typeof flattenedData[0] }) => {
      const { item, section, index, isVeryFirst, isLastSection, isVeryLast } = d;
      const isFirstItemInSection: boolean = index === 0;

      return (
        <View style={styles.row}>
          {/* ── Date Column (Left) ────────────────────────────────── */}
          <View style={styles.dateColumn}>
            {isFirstItemInSection && <TimelineSectionHeader date={section.date} />}
          </View>

          {/* ── Stem Column ────────────────────────────────────────── */}
          <View style={styles.stemColumn}>
            {/* The dotted line */}
            {!(isLastSection && index > 0) && (
              <View
                style={{
                  position: "absolute",
                  top: isVeryFirst ? 24 : 0,
                  bottom: isLastSection ? undefined : 0,
                  height: isLastSection ? (isVeryFirst ? 0 : 24) : undefined,
                  left: 0,
                  right: 0,
                  alignItems: "center",
                }}
              >
                {(!isLastSection || !isVeryFirst) && (
                  <TimelineStemLine hidden={false} flex={true} />
                )}
              </View>
            )}

            {/* The Dot */}
            {isFirstItemInSection && (
              <View style={[styles.absoluteDot, { backgroundColor, borderRadius: 10 }]}>
                <TimelineDot status={item.status} />
              </View>
            )}
          </View>

          {/* ── Card Column ────────────────────────────────────────── */}
          <View style={styles.cardColumn}>
            {renderItem(item, index)}
          </View>
        </View>
      );
    },
    [renderItem, backgroundColor],
  );

  // ── Key extractor ─────────────────────────────────────────────────────

  const keyExtractor = useCallback((d: typeof flattenedData[0]) => d.item.id, []);

  return (
    <LegendList
      data={flattenedData}
      keyExtractor={keyExtractor}
      renderItem={renderRow}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.5}
      estimatedItemSize={120} // good guess for average card height
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={ListEmptyComponent}
      ListFooterComponent={<LoadingFooter visible={isLoadingMore} />}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: topPad },
      ]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

const Timeline = React.memo(TimelineInner) as typeof TimelineInner;
export { Timeline };

// ─── Styles ─────────────────────────────────────────────────────────────

const STEM_WIDTH = 44;
const STEM_LINE_COLOR = "rgba(0, 0, 0, 0.12)";

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },

  // ── Row (date + stem + card) ─────────────────────────────────────────
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },

  // ── Date column ──────────────────────────────────────────────────────
  dateColumn: {
    width: 44,
    alignItems: "center",
    paddingTop: 14, // align with card vertically
  },

  // ── Stem column ──────────────────────────────────────────────────────
  stemColumn: {
    width: 24,
    alignItems: "center",
    position: "relative",
  },
  absoluteDot: {
    position: "absolute",
    top: 14, // align with date text
  },

  // ── Card column ──────────────────────────────────────────────────────
  cardColumn: {
    flex: 1,
    paddingLeft: 16,
    paddingBottom: 24, // spacing between items
  },

  // ── Footer ───────────────────────────────────────────────────────────
  footer: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
