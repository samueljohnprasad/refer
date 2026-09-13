import { useCallback, useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from "react";
import type { LegendListRef, ViewToken } from "@legendapp/list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useToast } from "heroui-native";
import { setPreviewSection } from "@/src/domains/journey/state/journeySlice";
import {
  selectCourse, selectCurrentSectionIdForCourse, selectIsCourseLoaded,
  selectPreviewSectionForCourse, selectPreviewSectionIdForCourse,
  selectRenderedJourneyViewForCourse, selectRenderedSectionIdForCourse,
  selectSectionOverviewItemsForCourse, selectNextCourseRecommendation,
} from "@/src/domains/journey/state/journeySelectors";
import {
  type ActiveNodeInitialScrollIndex, type ActiveNodeScrollHint, useCurrentNodeScrollHint,
} from "@/hooks/journey/useCurrentNodeScrollHint";
import { useJourneyFlashListData } from "@/hooks/journey/useJourneyFlashListData";
import { useNodeModalAutoScrollGate } from "@/hooks/journey/useNodeModalAutoScrollGate";
import { useVisibleUnit } from "@/src/hooks/useVisibleUnit";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { type JourneyFlashListItem, type PathNodeData, NodeType } from "@/src/types/journey";
import type { SectionOverviewItem } from "@/src/types/journey/sectionMap";
import { LIST_BOTTOM_SPACER_HEIGHT } from "../components/JourneyMapListItems";
import { getJourneyMapHeaderState } from "../../model/journeyMapHeaderState";
import type { InsightRewardContent, RewardCelebration } from "@/src/types/journeyV5";
import { useJourneyRewardsController } from "../../rewards/useJourneyRewardsController";
import { useCheckpointSheet } from "./useCheckpointSheet";
import type { CheckpointActionSheetData } from "./useCheckpointSheet";
import { useStartCourseMutation } from "@/src/domains/journey/data/journeyApi";
import type { NextCourseRecommendation } from "@/specs/019-next-journey-bridge/contracts/NextJourneyBridgeContract";



type JourneyMapController = {
  activeGlobalIndex: number;
  activeNodeInitialScrollIndex: ActiveNodeInitialScrollIndex;
  bottomSpacerHeight: number;
  courseTitle: string;
  flashListData: JourneyFlashListItem[];
  handleListLoad: () => void;
  handleNodePress: (node: PathNodeData) => void;
  handleOpenSections: () => void;
  handleScrollHintPress: () => void;
  handleSelectSection: (sectionId: string) => void;
  handleViewableItemsChanged: (info: {
    viewableItems: ViewToken<JourneyFlashListItem>[];
  }) => void;
  headerState: ReturnType<typeof getJourneyMapHeaderState>;
  isLoaded: boolean;
  isSectionSheetOpen: boolean;
  legendListRef: RefObject<LegendListRef | null>;
  listKey: string;
  rewardNode: PathNodeData | null;
  insightCard: InsightRewardContent | null;
  isClaimingReward: boolean;
  scrollHint: ActiveNodeScrollHint;
  sectionOverviewItems: SectionOverviewItem[];
  setIsSectionSheetOpen: Dispatch<SetStateAction<boolean>>;
  handleClaimReward: () => Promise<void>;
  handleDismissReward: () => void;
  pendingCelebration: RewardCelebration | null;
  dismissCelebration: () => void;
  isCheckpointSheetOpen: boolean;
  setIsCheckpointSheetOpen: Dispatch<SetStateAction<boolean>>;
  checkpointSheetData: CheckpointActionSheetData | null;
  closeCheckpointSheet: () => void;
  isOverlayOpen: boolean;
  recommendation: NextCourseRecommendation;
  isStartingNextCourse: boolean;
  handleStartNextCourse: (nextCourseId: string) => Promise<void>;
};

export function useJourneyMapController(
  courseId: string,
  completedNodeId?: string,
): JourneyMapController {
  const legendListRef = useRef<LegendListRef | null>(null);
  const [isSectionSheetOpen, setIsSectionSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Checkpoint Sheet (T018)
  const {
    isOpen: isCheckpointSheetOpen,
    setIsOpen: setIsCheckpointSheetOpen,
    sheetData: checkpointSheetData,
    openSheet: openCheckpointSheet,
    closeSheet: closeCheckpointSheet,
  } = useCheckpointSheet();

  const rewards = useJourneyRewardsController(courseId);

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
  const { flashListData, activeGlobalIndex, activeListIndex: defaultActiveListIndex, units } =
    useJourneyFlashListData(courseId, renderedSectionId ?? undefined);

  let activeListIndex = defaultActiveListIndex;
  if (completedNodeId) {
    const completedIndex = flashListData.findIndex(
      (item) => item.id === completedNodeId,
    );
    if (completedIndex !== -1) {
      activeListIndex = completedIndex;
    }
  }
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
  const isViewingPreviewSection = previewSection !== null;
  const isOverlayOpen =
    isSectionSheetOpen ||
    isCheckpointSheetOpen ||
    rewards.rewardNode !== null ||
    rewards.pendingCelebration !== null;
  const canAutoScrollToActiveNode = useNodeModalAutoScrollGate(
    courseId,
    isOverlayOpen,
  );

  useEffect(() => {
    if (previewSectionId === null || previewSection !== null) {
      return;
    }

    dispatch(setPreviewSection({ courseId, sectionId: null }));
  }, [courseId, dispatch, previewSection, previewSectionId]);

  const handleFocusCurrentProgress = useCallback((): void => {
    dispatch(setPreviewSection({ courseId, sectionId: null }));
  }, [courseId, dispatch]);

  const {
    activeNodeInitialScrollIndex,
    scrollHint,
    handleListLoad,
    handleScrollHintPress,
    updateScrollHintFromViewableItems,
  } = useCurrentNodeScrollHint({
    activeListIndex,
    canAutoScrollToActiveNode,
    isCourseLoaded: isLoaded,
    isViewingPreviewSection,
    listKey,
    listRef: legendListRef,
    onFocusCurrentProgress: handleFocusCurrentProgress,
  });

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: ViewToken<JourneyFlashListItem>[] }): void => {
      onViewableItemsChanged(info);
      updateScrollHintFromViewableItems(info.viewableItems);
    },
    [onViewableItemsChanged, updateScrollHintFromViewableItems],
  );

  const handleNodePress = useCallback(
    (node: PathNodeData, e?: any, color?: string): void => {
      if (node.status === "locked") {
        void Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Warning,
        );
        toast.show({
          placement: "top",
          variant: "warning",
          label: "Keep going! This will unlock soon.",
        });
        return;
      }

      if (node.type === "chest") {
        rewards.openRewardNode(node);
        return;
      }

      if (
        (node.type === NodeType.TROPHY || node.type === NodeType.MILESTONE) &&
        (node.status === "claimed" || node.status === "completed")
      ) {
        rewards.openRewardNode(node);
        return;
      }

      if (node.type === "checkpoint") {
        openCheckpointSheet(node);
        return;
      }

      // Routing for active/completed nodes is handled declaratively by <Link> in JourneyNodeCell
      return;
    },
    [openCheckpointSheet, rewards, toast],
  );

  const handleOpenSections = useCallback((): void => {
    if (!canOpenSections) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsSectionSheetOpen(true);
  }, [canOpenSections]);

  const handleSelectSection = useCallback(
    (sectionId: string): void => {
      if (!sectionId || sectionId === currentSectionId) {
        dispatch(setPreviewSection({ courseId, sectionId: null }));
        return;
      }

      dispatch(setPreviewSection({ courseId, sectionId }));
      setIsSectionSheetOpen(false);
    },
    [courseId, currentSectionId, dispatch],
  );

  const recommendation = useAppSelector((state) =>
    selectNextCourseRecommendation(state, courseId),
  );
  const [startCourse, { isLoading: isStartingNextCourse }] =
    useStartCourseMutation();

  // ponytail: handle next course start with safe error handling
  const handleStartNextCourse = useCallback(
    async (nextCourseId: string): Promise<void> => {
      try {
        await startCourse(nextCourseId).unwrap();
      } catch (err) {
        console.warn("Failed to start next course", err);
      }
    },
    [startCourse],
  );

  return {
    activeGlobalIndex,
    activeNodeInitialScrollIndex,
    bottomSpacerHeight:
      LIST_BOTTOM_SPACER_HEIGHT + insets.bottom + (recommendation.showDock ? 200 : 0),
    courseTitle: course?.title ?? "Journey",
    courseCompletionMessage: course?.rewardContent?.acknowledgement,
    flashListData,
    handleListLoad,
    handleNodePress,
    handleOpenSections,
    handleScrollHintPress,
    handleSelectSection,
    handleViewableItemsChanged,
    headerState: getJourneyMapHeaderState(renderedSection, renderedUnit),
    isLoaded,
    isSectionSheetOpen,
    legendListRef,
    listKey,
    rewardNode: rewards.rewardNode,
    insightCard: rewards.insightCard,
    isClaimingReward: rewards.isClaimingReward,
    scrollHint,
    sectionOverviewItems,
    setIsSectionSheetOpen,
    handleClaimReward: rewards.handleClaimReward,
    handleDismissReward: rewards.dismissReward,
    pendingCelebration: rewards.pendingCelebration,
    dismissCelebration: rewards.dismissCelebration,
    // Checkpoint sheet
    isCheckpointSheetOpen,
    setIsCheckpointSheetOpen,
    checkpointSheetData,
    closeCheckpointSheet,
    isOverlayOpen,
    recommendation,
    isStartingNextCourse,
    handleStartNextCourse,
  };
}
