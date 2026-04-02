/**
 * JourneyMapContainer
 * Container component — handles state management, business logic,
 * and data preparation. Passes everything to JourneyMapPresentation.
 * No markup beyond composing the presentation child.
 *
 * State: Jotai atoms (journeyStore)
 * Actions: pure reducer functions (journeyActions)
 * Persistence: AsyncStorage via loadJourneyState/saveJourneyState
 */

import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { router } from "expo-router";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import type { PathNodeData, JourneyState } from "@/src/types/journey";
import { NodeStatus, NodeType } from "@/src/types/journey";
import { useJourneyLayout } from "@/src/hooks/useJourneyLayout";
import { useMascotPositions } from "@/src/hooks/useMascotPositions";
import type { MascotPositionData } from "@/src/hooks/useMascotPositions";
import {
  journeyStateAtom,
  currentUnitAtom,
  journeyStatsAtom,
  loadJourneyState,
  saveJourneyState,
} from "@/src/store/journeyStore";
import {
  completeNode,
  updateNodeProgress,
  unlockUnit,
} from "@/src/store/journeyActions";
import { useUnitCompletion } from "@/src/hooks/useUnitCompletion";
import { useSoundEffects } from "@/src/hooks/useSoundEffects";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useOfflineQueue } from "@/src/hooks/useOfflineQueue";
import { useInteractionLock } from "@/src/hooks/useInteractionLock";
import { useScrollToActive } from "@/src/hooks/useScrollToActive";
// Lazy-loaded modals — only parsed when first rendered (Task 4.6.2)
const NodeCompletionModal = lazy(
  () => import("@/src/components/journey/NodeCompletionModal"),
);
const ChestRewardModal = lazy(
  () => import("@/src/components/journey/ChestRewardModal"),
);
const UnitCompleteModal = lazy(
  () => import("@/src/components/journey/UnitCompleteModal"),
);
import JourneyMapPresentation from "./JourneyMapPresentation";

export default function JourneyMapContainer(): React.JSX.Element {
  const scrollViewRef = useRef<ScrollView | null>(null);
  const completionModalRef = useRef<BottomSheetModal>(null);
  const chestModalRef = useRef<BottomSheetModal>(null);
  const unitCompleteModalRef = useRef<BottomSheetModal>(null);
  const [completedNode, setCompletedNode] = useState<PathNodeData | null>(null);
  const [chestNode, setChestNode] = useState<PathNodeData | null>(null);
  const toast = useToast();
  const { play: playSound } = useSoundEffects();
  const { height: viewportHeight } = useWindowDimensions();

  // Task 5.1.1: Network status + offline queue
  const { isOnline } = useNetworkStatus();
  const { enqueue } = useOfflineQueue(isOnline);

  // Task 5.1.3: Rapid interaction prevention
  const { guardedPress, lock: lockInteraction } = useInteractionLock();

  // Jotai state
  const journeyState = useAtomValue(journeyStateAtom);
  const setJourneyState = useSetAtom(journeyStateAtom);

  const currentUnit = useAtomValue(currentUnitAtom);
  const stats = useAtomValue(journeyStatsAtom);

  // We cannot return early here because we must call all hooks below.

  // Task 5.1.2: Load persisted state with corruption recovery
  useEffect(() => {
    const hydrate = async (): Promise<void> => {
      try {
        const persisted: JourneyState | null = await loadJourneyState();
        if (persisted) {
          setJourneyState(persisted);
        }
      } catch (error) {
        console.error(
          "[JourneyMapContainer] Hydration failed, using defaults:",
          error,
        );
        toast.show({
          id: "hydration-error",
          placement: "bottom",
          render: () => (
            <Toast action="error">
              <ToastTitle>Failed to load progress — starting fresh</ToastTitle>
            </Toast>
          ),
        });
      }
    };
    hydrate();
  }, [setJourneyState, toast]);

  // Persist state on every change; queue for sync if offline
  useEffect(() => {
    saveJourneyState(journeyState);
    if (!isOnline) {
      enqueue(journeyState);
    }
  }, [journeyState, isOnline, enqueue]);

  // Compute memoized positions & dimensions
  const { screenWidth, nodePositions, pathDimensions } = useJourneyLayout(
    currentUnit?.nodes?.length || 0,
  );

  // Compute mascot positions from placements + node positions
  const mascotPositions: MascotPositionData[] = useMascotPositions(
    currentUnit?.mascotPlacements || [],
    nodePositions,
    screenWidth,
  );

  // Task 5.1.4: Compute active node Y for scroll-to-active
  const activeNodeY: number | null = useMemo(() => {
    if (!currentUnit?.nodes) return null;
    const activeIndex: number = currentUnit.nodes.findIndex(
      (n: PathNodeData) => n.status === NodeStatus.ACTIVE,
    );
    return activeIndex >= 0 && nodePositions[activeIndex]
      ? nodePositions[activeIndex].y
      : null;
  }, [currentUnit?.nodes, nodePositions]);

  const {
    isOffScreen: isActiveOffScreen,
    direction: scrollDirection,
    scrollToActive,
    onScroll,
  } = useScrollToActive(scrollViewRef, activeNodeY, viewportHeight);

  // Auto-scroll to active node on mount
  useEffect(() => {
    if (activeNodeY !== null) {
      const timer = setTimeout(() => {
        scrollViewRef.current?.scrollTo({
          y: Math.max(0, activeNodeY - 200),
          animated: true,
        });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeNodeY]);

  // ── Node press handlers by status (wrapped with interaction lock — Task 5.1.3) ──
  const handleNodePressInner = useCallback(
    (node: PathNodeData): void => {
      // Chest nodes get their own modal regardless of status
      if (node.type === NodeType.CHEST && node.status !== NodeStatus.LOCKED) {
        playSound("chestOpen");
        setChestNode(node);
        chestModalRef.current?.present();
        return;
      }

      switch (node.status) {
        case NodeStatus.ACTIVE:
          playSound("nodeTap");
          router.push(`/tabs/screens/task/${node.taskId}` as never);
          break;

        case NodeStatus.COMPLETED:
          playSound("nodeTap");
          setCompletedNode(node);
          completionModalRef.current?.present();
          break;

        case NodeStatus.LOCKED:
          playSound("lockedTap");
          toast.show({
            id: `locked-${node.id}`,
            placement: "bottom",
            render: () => (
              <Toast action="warning">
                <ToastTitle>🔒 Complete previous lessons first</ToastTitle>
              </Toast>
            ),
          });
          break;
      }
    },
    [toast, playSound],
  );

  const handleNodePress = useMemo(
    () => guardedPress(handleNodePressInner),
    [guardedPress, handleNodePressInner],
  );

  // ── Action dispatchers (used by child flows returning from task screen) ──
  const handleCompleteNode = useCallback(
    (nodeId: string): void => {
      playSound("nodeComplete");
      // Lock interactions during the completion animation (Task 5.1.3)
      lockInteraction(800);
      setJourneyState((prev: JourneyState) => completeNode(prev, nodeId));
    },
    [setJourneyState, playSound, lockInteraction],
  );

  const handleUpdateProgress = useCallback(
    (nodeId: string, progress: number): void => {
      setJourneyState((prev: JourneyState) =>
        updateNodeProgress(prev, nodeId, progress),
      );
    },
    [setJourneyState],
  );

  const handleModalContinue = useCallback((): void => {
    setCompletedNode(null);
  }, []);

  const handleChestClaim = useCallback(
    (nodeId: string): void => {
      playSound("chestClaim");
      // Mark chest as completed and grant rewards
      setJourneyState((prev: JourneyState) => completeNode(prev, nodeId));
      setChestNode(null);
    },
    [setJourneyState, playSound],
  );

  // ── Unit completion detection ──
  const handleUnitComplete = useCallback((): void => {
    playSound("unitComplete");
    // Small delay so the last node animation finishes before modal appears
    setTimeout(() => {
      unitCompleteModalRef.current?.present();
    }, 600);
  }, [playSound]);

  const { xpEarned } = useUnitCompletion(currentUnit, handleUnitComplete);

  const handleUnitContinue = useCallback((): void => {
    setJourneyState((prev: JourneyState) => unlockUnit(prev));
  }, [setJourneyState]);

  // Early return if unit not loaded yet
  if (!currentUnit) {
    return <View className="flex-1 bg-gray-50" />;
  }

  return (
    <>
      <JourneyMapPresentation
        unit={currentUnit}
        stats={stats}
        nodePositions={nodePositions}
        pathDimensions={pathDimensions}
        screenWidth={screenWidth}
        mascotPositions={mascotPositions}
        onNodePress={handleNodePress}
        scrollViewRef={scrollViewRef}
        isOffline={!isOnline}
        isActiveOffScreen={isActiveOffScreen}
        scrollDirection={scrollDirection}
        onScrollToActive={scrollToActive}
        onScroll={onScroll}
      />
      <Suspense fallback={null}>
        <NodeCompletionModal
          ref={completionModalRef}
          node={completedNode}
          onContinue={handleModalContinue}
        />
        {chestNode && (
          <ChestRewardModal
            ref={chestModalRef}
            node={chestNode}
            onClaim={handleChestClaim}
          />
        )}
        <UnitCompleteModal
          ref={unitCompleteModalRef}
          unit={currentUnit}
          xpEarned={xpEarned}
          onContinue={handleUnitContinue}
        />
      </Suspense>
    </>
  );
}
