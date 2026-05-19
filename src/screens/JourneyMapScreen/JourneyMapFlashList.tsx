/**
 * JourneyMapFlashList
 * Rewired to the v5 normalized Redux store.
 *
 * Default data source: the progress-derived current section for the course.
 * Preview mode: tapping the header opens the section sheet, which can
 * preview a different section while keeping that choice scoped to the course.
 *
 * List data source: useJourneyFlashListData(courseId, renderedSectionId) —
 * builds FlashList items from selectSectionsForCourse → selectUnitsForSection
 * → selectNodesForUnit.
 * Node tap: locked → toast, unlocked → open NodeContentModal directly.
 * Visual rendering: unchanged — JourneyNodeCell, DividerCell, etc.
 */

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Dimensions, View, Text } from "react-native";
import Animated from "react-native-reanimated";
import { LegendList } from "@legendapp/list";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import type {
  JourneyFlashListItem,
  JourneyNode,
  JourneyDividerItem,
  PathNodeData,
} from "@/src/types/journey";

import { useVisibleUnit } from "@/src/hooks/useVisibleUnit";
import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import {
  setActiveNodeModal,
  setPreviewSection,
} from "@/src/features/journey/journeySlice";
import {
  selectCourse,
  selectCurrentSectionIdForCourse,
  selectIsCourseLoaded,
  selectPreviewSectionForCourse,
  selectPreviewSectionIdForCourse,
  selectRenderedJourneyViewForCourse,
  selectRenderedSectionIdForCourse,
  selectSectionOverviewItemsForCourse,
} from "@/src/features/journey/journeySelectors";

import { JourneyNodeCell } from "@/src/components/journey/JourneyNodeCell";
import { DividerCell } from "@/src/components/journey/DividerCell";
import { UNIT_GRADIENTS } from "@/src/data/journey/constants";
import BottomSheetWithRNContent from "@/src/components/BottomSheetWithRNContent";
import { HomeMainButton } from "@/src/components/journey/home-main-button";
import { SectionOverviewSheet } from "@/src/components/journey/SectionOverviewSheet";
import { NodeContentModal } from "./NodeContentModal";
import { useJourneyFlashListData } from "@/hooks/journey/useJourneyFlashListData";

// ── Constants ─────────────────────────────────────────────────────────────────

const AnimatedLegendList = Animated.createAnimatedComponent(
  LegendList,
) as typeof LegendList;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ESTIMATED_ITEM_SIZE = 120;
const LIST_BOTTOM_PADDING = 180;

// ── Props ─────────────────────────────────────────────────────────────────────

export interface JourneyMapFlashListProps {
  /** Active course id resolved by the Redux-backed course selection hook */
  courseId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

function JourneyMapFlashListInner({
  courseId,
}: JourneyMapFlashListProps): React.JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legendListRef = useRef<any>(null);
  const [isSectionSheetOpen, setIsSectionSheetOpen] = useState(false);
  const dispatch = useAppDispatch();

  // ── Data ───────────────────────────────────────────────────────────────────
  const currentSectionId = useAppSelector((state) =>
    selectCurrentSectionIdForCourse(state, courseId),
  );
  const previewSectionId = useAppSelector((state) =>
    selectPreviewSectionIdForCourse(state, courseId),
  );
  const previewSection = useAppSelector((state) =>
    selectPreviewSectionForCourse(state, courseId),
  );
  const renderedSectionId = useAppSelector((state) =>
    selectRenderedSectionIdForCourse(state, courseId),
  );
  const { flashListData, activeGlobalIndex, units } = useJourneyFlashListData(
    courseId,
    renderedSectionId ?? undefined,
  );
  const { visibleUnitId, onViewableItemsChanged } = useVisibleUnit({ units });
  const { renderedSection, renderedUnit } = useAppSelector((state) =>
    selectRenderedJourneyViewForCourse(state, courseId, visibleUnitId),
  );
  const course = useAppSelector((state) => selectCourse(state, courseId));
  const isLoaded = useAppSelector((state) =>
    selectIsCourseLoaded(state, courseId),
  );
  const sectionOverviewItems = useAppSelector((state) =>
    selectSectionOverviewItemsForCourse(state, courseId),
  );

  const canOpenSections = sectionOverviewItems.length > 0;

  useEffect(() => {
    if (previewSectionId === null || previewSection !== null) {
      return;
    }

    dispatch(setPreviewSection({ courseId, sectionId: null }));
  }, [courseId, dispatch, previewSection, previewSectionId]);

  // ── Auto-scroll to current node ────────────────────────────────────────────
  const lastScrolledIndexRef = useRef<number>(-1);
  useEffect(() => {
    lastScrolledIndexRef.current = -1;
  }, [renderedSectionId]);

  useEffect(() => {
    if (!isLoaded || activeGlobalIndex < 0) return;
    if (activeGlobalIndex === lastScrolledIndexRef.current) return;
    lastScrolledIndexRef.current = activeGlobalIndex;
    const timer = setTimeout(() => {
      legendListRef.current?.scrollToIndex({
        index: activeGlobalIndex,
        animated: true,
      });
    }, 150);
    return () => clearTimeout(timer);
  }, [isLoaded, activeGlobalIndex]);

  // ── Node tap — locked → toast, unlocked → open modal directly ─────────────
  const toast = useToast();

  const handleNodePress = useCallback(
    (node: PathNodeData): void => {
      if (node.status === "locked") {
        toast.show({
          placement: "top",
          render: ({ id }) => (
            <Toast nativeID={id} action="warning">
              <ToastTitle>Complete earlier activities first.</ToastTitle>
            </Toast>
          ),
        });
        return;
      }
      dispatch(setActiveNodeModal({ courseId, nodeId: node.id }));
    },
    [courseId, dispatch, toast],
  );

  const handleOpenSections = useCallback((): void => {
    if (!canOpenSections) return;
    setIsSectionSheetOpen(true);
  }, [canOpenSections]);

  const handleCloseSections = useCallback((): void => {
    setIsSectionSheetOpen(false);
  }, []);

  const handleSelectSection = useCallback(
    (sectionId: string): void => {
      if (!sectionId || sectionId === currentSectionId) {
        dispatch(setPreviewSection({ courseId, sectionId: null }));
        return;
      }

      dispatch(setPreviewSection({ courseId, sectionId }));
    },
    [courseId, currentSectionId, dispatch],
  );

  // ── renderItem ────────────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }: { item: JourneyFlashListItem }): React.JSX.Element => {
      switch (item.itemType) {
        case "node":
          return (
            <JourneyNodeCell
              item={item as JourneyNode}
              screenWidth={SCREEN_WIDTH}
              activeGlobalIndex={activeGlobalIndex}
              onNodePress={handleNodePress}
            />
          );
        case "divider":
          return (
            <DividerCell
              item={item as JourneyDividerItem}
              screenWidth={SCREEN_WIDTH}
              activeGlobalIndex={activeGlobalIndex}
            />
          );
        default:
          return <View />;
      }
    },
    [activeGlobalIndex, handleNodePress],
  );

  const keyExtractor = useCallback(
    (item: JourneyFlashListItem): string => item.id,
    [],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <HomeMainButton
        onPress={handleOpenSections}
        unitLabel={
          renderedSection
            ? `Section ${renderedSection.orderIndex}${
                renderedUnit ? ` • Unit ${renderedUnit.unitNumber}` : ""
              }`
            : "Journey"
        }
        unitTitle={renderedUnit?.title ?? "Select a section"}
        faceColor={
          UNIT_GRADIENTS[
            renderedUnit?.colorThemeKey ?? "green"
          ]?.[0] ?? "#4CAF50"
        }
        rimColor={
          UNIT_GRADIENTS[
            renderedUnit?.colorThemeKey ?? "green"
          ]?.[1] ?? "#388E3C"
        }
        unitIconKey={renderedUnit?.iconKey ?? null}
      />

      {!isLoaded ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "#6B7280" }}>Loading…</Text>
        </View>
      ) : flashListData.length > 0 ? (
        <AnimatedLegendList<JourneyFlashListItem>
          key={renderedSectionId ?? courseId}
          ref={legendListRef}
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: LIST_BOTTOM_PADDING }}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 10,
            minimumViewTime: 100,
          }}
        />
      ) : (
        <View>
          {" "}
          <Text>This course is being prepared. Check back shortly.</Text>
        </View>
      )}

      {isSectionSheetOpen ? (
        <BottomSheetWithRNContent
          isPresented={isSectionSheetOpen}
          setIsPresented={setIsSectionSheetOpen}
        >
          <SectionOverviewSheet
            onClose={handleCloseSections}
            sections={sectionOverviewItems}
            onPreviewSection={handleSelectSection}
            journeyTitle={course?.title ?? "Journey"}
          />
        </BottomSheetWithRNContent>
      ) : null}

      {/* Full-screen content modal — opens on node tap, Done marks complete */}
      <NodeContentModal courseId={courseId} />
    </>
  );
}

export const JourneyMapFlashList = React.memo(JourneyMapFlashListInner);
export default JourneyMapFlashList;
