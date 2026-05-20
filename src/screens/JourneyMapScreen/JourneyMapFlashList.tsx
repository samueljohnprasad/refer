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
import {
  LegendList,
  type LegendListRef,
  type ViewToken,
} from "@legendapp/list";
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
import ScrollToActiveButton from "@/src/components/journey/ScrollToActiveButton";
import { NodeContentModal } from "./NodeContentModal";
import { useJourneyFlashListData } from "@/hooks/journey/useJourneyFlashListData";

// ── Constants ─────────────────────────────────────────────────────────────────

const AnimatedLegendList = Animated.createAnimatedComponent(
  LegendList,
) as typeof LegendList;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const ESTIMATED_ITEM_SIZE = 120;
const LIST_BOTTOM_PADDING = 180;
const ACTIVE_NODE_VIEW_POSITION = 0.35;
const ACTIVE_NODE_VIEW_OFFSET = 24;
const AUTO_SCROLL_DELAY_MS = 120;
const AUTO_SCROLL_RETRY_DELAY_MS = 80;
const AUTO_SCROLL_MAX_ATTEMPTS = 4;

// ── Props ─────────────────────────────────────────────────────────────────────

export interface JourneyMapFlashListProps {
  /** Active course id resolved by the Redux-backed course selection hook */
  courseId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

function JourneyMapFlashListInner({
  courseId,
}: JourneyMapFlashListProps): React.JSX.Element {
  const legendListRef = useRef<LegendListRef | null>(null);
  const [isSectionSheetOpen, setIsSectionSheetOpen] = useState(false);
  const [loadedListKey, setLoadedListKey] = useState<string | null>(null);
  const [activeScrollHint, setActiveScrollHint] = useState<{
    isVisible: boolean;
    direction: "up" | "down";
  }>({ isVisible: false, direction: "down" });
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
  const listKey = renderedSectionId ?? courseId;
  const { flashListData, activeGlobalIndex, activeListIndex, units } =
    useJourneyFlashListData(
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
    setActiveScrollHint({ isVisible: false, direction: "down" });
  }, [listKey]);

  const scrollToActiveNode = useCallback(
    (animated = true): boolean => {
      if (activeListIndex < 0) {
        return false;
      }

      const list = legendListRef.current;
      if (!list) {
        return false;
      }

      try {
        list.scrollToIndex({
          index: activeListIndex,
          animated,
          viewOffset: ACTIVE_NODE_VIEW_OFFSET,
          viewPosition: ACTIVE_NODE_VIEW_POSITION,
        });
        return true;
      } catch {
        return false;
      }
    },
    [activeListIndex],
  );

  useEffect(() => {
    if (!isLoaded || loadedListKey !== listKey || activeListIndex < 0) return;
    if (activeListIndex === lastScrolledIndexRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let attemptCount = 0;

    const tryScroll = () => {
      attemptCount += 1;
      const didScroll = scrollToActiveNode(true);

      if (didScroll) {
        lastScrolledIndexRef.current = activeListIndex;
        return;
      }

      if (attemptCount < AUTO_SCROLL_MAX_ATTEMPTS) {
        timeoutId = setTimeout(tryScroll, AUTO_SCROLL_RETRY_DELAY_MS);
      }
    };

    timeoutId = setTimeout(tryScroll, AUTO_SCROLL_DELAY_MS);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    activeListIndex,
    isLoaded,
    listKey,
    loadedListKey,
    scrollToActiveNode,
  ]);

  const handleListLoad = useCallback(() => {
    setLoadedListKey(listKey);
  }, [listKey]);

  const updateActiveScrollHint = useCallback(
    (viewableItems: ViewToken<JourneyFlashListItem>[]) => {
      if (activeListIndex < 0) {
        setActiveScrollHint({ isVisible: false, direction: "down" });
        return;
      }

      const viewableIndices = viewableItems
        .map((item) => item.index)
        .filter((index): index is number => typeof index === "number");

      if (viewableIndices.length === 0) {
        return;
      }

      const isActiveVisible = viewableIndices.includes(activeListIndex);
      if (isActiveVisible) {
        setActiveScrollHint((currentHint) =>
          currentHint.isVisible
            ? { ...currentHint, isVisible: false }
            : currentHint,
        );
        return;
      }

      const firstVisibleIndex = Math.min(...viewableIndices);
      const direction = activeListIndex < firstVisibleIndex ? "up" : "down";
      setActiveScrollHint((currentHint) => {
        if (currentHint.isVisible && currentHint.direction === direction) {
          return currentHint;
        }

        return { isVisible: true, direction };
      });
    },
    [activeListIndex],
  );

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken<JourneyFlashListItem>[] }) => {
      onViewableItemsChanged(info);
      updateActiveScrollHint(info.viewableItems);
    },
    [onViewableItemsChanged, updateActiveScrollHint],
  );

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
          key={listKey}
          ref={legendListRef}
          data={flashListData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          estimatedItemSize={ESTIMATED_ITEM_SIZE}
          initialScrollIndex={
            activeListIndex >= 0
              ? {
                  index: activeListIndex,
                  viewOffset: ACTIVE_NODE_VIEW_OFFSET,
                }
              : undefined
          }
          waitForInitialLayout
          onLoad={handleListLoad}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: LIST_BOTTOM_PADDING }}
          onViewableItemsChanged={handleViewableItemsChanged}
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

      <ScrollToActiveButton
        isVisible={activeScrollHint.isVisible}
        direction={activeScrollHint.direction}
        onPress={() => {
          if (scrollToActiveNode(true)) {
            setActiveScrollHint((currentHint) => ({
              ...currentHint,
              isVisible: false,
            }));
          }
        }}
      />

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
