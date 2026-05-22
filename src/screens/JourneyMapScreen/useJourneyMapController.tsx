import { useCallback, useEffect, useRef, useState } from "react";
import type { Dispatch, RefObject, SetStateAction } from "react";
import type { LegendListRef, ViewToken } from "@legendapp/list";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Toast, ToastTitle, useToast } from "@/components/ui/toast";
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
import { LIST_BOTTOM_SPACER_HEIGHT } from "./JourneyMapListItems";
import { getJourneyMapHeaderState } from "./journeyMapHeaderState";

type JourneyMapController = {
  activeGlobalIndex: number;
  activeNodeInitialScrollIndex: ActiveNodeInitialScrollIndex;
  bottomSpacerHeight: number;
  courseTitle: string;
  flashListData: JourneyFlashListItem[];
  handleCloseSections: () => void;
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
  scrollHint: ActiveNodeScrollHint;
  sectionOverviewItems: SectionOverviewItem[];
  setIsSectionSheetOpen: Dispatch<SetStateAction<boolean>>;
};

export function useJourneyMapController(
  courseId: string,
): JourneyMapController {
  const legendListRef = useRef<LegendListRef | null>(null);
  const [isSectionSheetOpen, setIsSectionSheetOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const toast = useToast();

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

  return {
    activeGlobalIndex,
    activeNodeInitialScrollIndex,
    bottomSpacerHeight: LIST_BOTTOM_SPACER_HEIGHT + insets.bottom,
    courseTitle: course?.title ?? "Journey",
    flashListData,
    handleCloseSections,
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
    scrollHint,
    sectionOverviewItems,
    setIsSectionSheetOpen,
  };
}
