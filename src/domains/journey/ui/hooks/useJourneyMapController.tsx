import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { LegendListRef, ViewToken } from "@legendapp/list";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useSetAtom } from "jotai";
import { router, useFocusEffect } from "expo-router";

import { useToast } from "heroui-native";
import {
  setCourseProgress,
  setPreviewSection,
} from "@/src/domains/journey/state/journeySlice";
import {
  selectCourse,
  selectCurrentSectionIdForCourse,
  selectIsCourseLoaded,
  selectPreviewSectionForCourse,
  selectPreviewSectionIdForCourse,
  selectRenderedJourneyViewForCourse,
  selectRenderedSectionIdForCourse,
  selectSectionOverviewItemsForCourse,
} from "@/src/domains/journey/state/journeySelectors";
import {
  type ActiveNodeInitialScrollIndex,
  type ActiveNodeScrollHint,
  useCurrentNodeScrollHint,
} from "@/hooks/journey/useCurrentNodeScrollHint";
import { useJourneyFlashListData } from "@/hooks/journey/useJourneyFlashListData";
import { useNodeModalAutoScrollGate } from "@/hooks/journey/useNodeModalAutoScrollGate";
import { useVisibleUnit } from "@/src/hooks/useVisibleUnit";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import type { JourneyFlashListItem, PathNodeData } from "@/src/types/journey";
import type { SectionOverviewItem } from "@/src/types/journey/sectionMap";
import { journeyApi } from "@/src/domains/journey/data/journeyApi";
import { LIST_BOTTOM_SPACER_HEIGHT } from "../components/JourneyMapListItems";
import { getJourneyMapHeaderState } from "../../model/journeyMapHeaderState";

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
  isClaimingReward: boolean;
  scrollHint: ActiveNodeScrollHint;
  sectionOverviewItems: SectionOverviewItem[];
  setIsSectionSheetOpen: Dispatch<SetStateAction<boolean>>;
  handleClaimReward: () => Promise<void>;
  handleDismissReward: () => void;
};

export function useJourneyMapController(
  courseId: string,
): JourneyMapController {
  const legendListRef = useRef<LegendListRef | null>(null);
  const [isSectionSheetOpen, setIsSectionSheetOpen] = useState(false);
  const [rewardNode, setRewardNode] = useState<PathNodeData | null>(null);
  const [isClaimingReward, setIsClaimingReward] = useState(false);
  const [completeNode] = journeyApi.useCompleteNodeMutation();
  const isRoutingRef = useRef(false);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

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
    useJourneyFlashListData(courseId, renderedSectionId ?? undefined);
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
  const canAutoScrollToActiveNode = useNodeModalAutoScrollGate(courseId);

  useEffect(() => {
    if (previewSectionId === null || previewSection !== null) {
      return;
    }

    dispatch(setPreviewSection({ courseId, sectionId: null }));
  }, [courseId, dispatch, previewSection, previewSectionId]);

  const handleFocusCurrentProgress = useCallback((): void => {
    dispatch(setPreviewSection({ courseId, sectionId: null }));
  }, [courseId, dispatch]);

  // Reset routing lock when screen regains focus
  useFocusEffect(
    useCallback(() => {
      isRoutingRef.current = false;
    }, []),
  );

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
      if (isRoutingRef.current) return;

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
        setRewardNode(node);
        return;
      }

      // Routing for active/completed nodes is handled declaratively by <Link> in JourneyNodeCell
      return;
    },
    [toast],
  );

  const handleDismissReward = useCallback((): void => {
    if (!isClaimingReward) setRewardNode(null);
  }, [isClaimingReward]);

  const handleClaimReward = useCallback(async (): Promise<void> => {
    if (!rewardNode || isClaimingReward) return;

    setIsClaimingReward(true);
    try {
      await completeNode({ nodeId: rewardNode.id, courseId }).unwrap();
      const progressResult = await dispatch(
        journeyApi.endpoints.getCourseProgress.initiate(courseId, {
          forceRefetch: true,
        }),
      );
      if ("data" in progressResult && progressResult.data) {
        dispatch(setCourseProgress(progressResult.data));
      }
      setRewardNode(null);
    } catch {
      toast.show({
        placement: "top",
        variant: "danger",
        label: "We could not claim that reward. Try again.",
      });
    } finally {
      setIsClaimingReward(false);
    }
  }, [completeNode, courseId, dispatch, isClaimingReward, rewardNode, toast]);

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

  return {
    activeGlobalIndex,
    activeNodeInitialScrollIndex,
    bottomSpacerHeight: LIST_BOTTOM_SPACER_HEIGHT + insets.bottom,
    courseTitle: course?.title ?? "Journey",
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
    rewardNode,
    isClaimingReward,
    scrollHint,
    sectionOverviewItems,
    setIsSectionSheetOpen,
    handleClaimReward,
    handleDismissReward,
  };
}
