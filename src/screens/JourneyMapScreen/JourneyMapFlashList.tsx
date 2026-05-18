/**
 * JourneyMapFlashList
 * Rewired to the v5 normalized Redux store.
 *
 * Data source: useJourneyFlashListData(courseId) — builds FlashList items from
 * selectSectionsForCourse → selectUnitsForSection → selectNodesForUnit.
 * Node tap: locked → toast, unlocked → open NodeContentModal directly.
 * Visual rendering: unchanged — JourneyNodeCell, DividerCell, etc.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { setActiveNodeModal } from "@/src/features/journey/journeySlice";
import {
  selectCourse,
  selectSectionsForCourse,
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
  /** Active course id resolved by useDefaultCourse */
  courseId: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

function JourneyMapFlashListInner({
  courseId,
}: JourneyMapFlashListProps): React.JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const legendListRef = useRef<any>(null);
  const [isSectionSheetOpen, setIsSectionSheetOpen] = useState(false);
  const [selectedSectionNumber, setSelectedSectionNumber] = useState<
    number | null
  >(null);

  // ── Data ───────────────────────────────────────────────────────────────────
  const sections = useAppSelector((state) =>
    selectSectionsForCourse(state, courseId),
  );
  const { units: allUnits } = useJourneyFlashListData(courseId);
  const selectedSectionId = useMemo(
    () =>
      selectedSectionNumber === null
        ? undefined
        : sections.find((section) => section.orderIndex === selectedSectionNumber)
            ?.id,
    [sections, selectedSectionNumber],
  );
  const { flashListData, activeGlobalIndex, units } = useJourneyFlashListData(
    courseId,
    selectedSectionId,
  );
  const { visibleUnit, onViewableItemsChanged } = useVisibleUnit({ units });
  const course = useAppSelector((state) => selectCourse(state, courseId));
  const isLoaded = useAppSelector(
    (state) => !!state.journey.loadedCourses[courseId],
  );

  const currentVisibleUnit =
    units.find((unit) => unit.id === visibleUnit.unitId) ?? units[0];
  const currentSectionNumber =
    selectedSectionNumber ?? currentVisibleUnit?.sectionNumber ?? 1;

  const sectionList = useMemo(
    () =>
      sections.map((section) => {
        const sectionUnits = allUnits.filter((unit) => unit.sectionId === section.id);
        const nodeCount = sectionUnits.reduce(
          (total, unit) => total + unit.nodes.length,
          0,
        );

        return {
          unitNumber: section.orderIndex,
          sectionNumber: section.orderIndex,
          title: section.title,
          colorScheme: sectionUnits[0]?.colorScheme ?? "green",
          nodeCount,
          unitCount: sectionUnits.length,
          unitTitles: sectionUnits.map((unit) => unit.title),
          unitIconKeys: sectionUnits.map((unit) => unit.iconKey),
        };
      }),
    [allUnits, sections],
  );

  const unitCompletedCounts = useMemo(
    () =>
      sections.reduce<Record<string, number>>((counts, section) => {
        const sectionUnits = allUnits.filter((unit) => unit.sectionId === section.id);

        counts[`section_${section.orderIndex}`] = sectionUnits.reduce(
          (total, unit) =>
            total + unit.nodes.filter((node) => node.status === "completed").length,
          0,
        );

        return counts;
      }, {}),
    [allUnits, sections],
  );

  // ── Auto-scroll to current node ────────────────────────────────────────────
  const lastScrolledIndexRef = useRef<number>(-1);
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
  const dispatch = useAppDispatch();
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
      dispatch(setActiveNodeModal(node.id));
    },
    [dispatch, toast],
  );

  const handleOpenSections = useCallback((): void => {
    if (sectionList.length === 0) return;
    setIsSectionSheetOpen(true);
  }, [sectionList.length]);

  const handleCloseSections = useCallback((): void => {
    setIsSectionSheetOpen(false);
  }, []);

  const handleJumpToSection = useCallback(
    (sectionNumber: number): void => {
      setSelectedSectionNumber(sectionNumber);
      setIsSectionSheetOpen(false);
    },
    [],
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
        unitLabel={`Section ${currentSectionNumber} • Unit ${visibleUnit.unitNumber}`}
        unitTitle={visibleUnit.unitTitle}
        faceColor={UNIT_GRADIENTS[visibleUnit.colorThemeKey]?.[0] ?? "#4CAF50"}
        rimColor={UNIT_GRADIENTS[visibleUnit.colorThemeKey]?.[1] ?? "#388E3C"}
        unitIconKey={visibleUnit.unitIconKey}
      />

      {!isLoaded ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: "#6B7280" }}>Loading…</Text>
        </View>
      ) : flashListData.length > 0 ? (
        <AnimatedLegendList<JourneyFlashListItem>
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
            unitCompletedCounts={unitCompletedCounts}
            sectionList={sectionList}
            currentSectionUnitNumber={currentSectionNumber}
            onJumpToSection={handleJumpToSection}
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
