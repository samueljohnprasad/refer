/**
 * JourneyMapContainer
 * Container component — handles state management, business logic,
 * and data preparation. Passes everything to JourneyMapPresentation.
 * No markup beyond composing the presentation child.
 *
 * Data flow (multi-journey):
 * 1. useJourneyData(slug) fetches template + progress from Supabase
 * 2. mergeJourneyState() produces JourneyState (same shape as before)
 * 3. All derived atoms / UI components consume the merged state
 * 4. Node completion uses server-side RPC for atomic reward granting
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
import { useAtomValue, useSetAtom } from "jotai";
import { router, useLocalSearchParams } from "expo-router";
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
  enrollmentIdAtom,
  saveJourneyState,
} from "@/src/store/journeyStore";
import {
  completeNode,
  updateNodeProgress,
  unlockUnit,
} from "@/src/store/journeyActions";
import {
  completeNodeApi,
  updateNodeProgress as updateNodeProgressApi,
} from "@/src/lib/api/journeyApi";
import { useJourneyData } from "@/src/hooks/useJourneyData";
import { useUnitCompletion } from "@/src/hooks/useUnitCompletion";
import { useSoundEffects } from "@/src/hooks/useSoundEffects";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { useOfflineQueue } from "@/src/hooks/useOfflineQueue";
import { useInteractionLock } from "@/src/hooks/useInteractionLock";
import { useScrollToActive } from "@/src/hooks/useScrollToActive";
// Lazy-loaded modals — only parsed when first rendered
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
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import JourneyErrorState from "@/src/components/journey/JourneyErrorState";

export default function JourneyMapContainer(): React.JSX.Element {
  // Route params — journey slug comes from navigation
  const { slug } = useLocalSearchParams<{ slug?: string }>();
  // Default to first journey slug if not provided (backward compatible)
  const journeySlug: string = slug ?? 'default';

  const scrollViewRef = useRef<ScrollView | null>(null);
  const completionModalRef = useRef<BottomSheetModal>(null);
  const chestModalRef = useRef<BottomSheetModal>(null);
  const unitCompleteModalRef = useRef<BottomSheetModal>(null);
  const [completedNode, setCompletedNode] = useState<PathNodeData | null>(null);
  const [chestNode, setChestNode] = useState<PathNodeData | null>(null);
  const toast = useToast();
  const { play: playSound } = useSoundEffects();
  const { height: viewportHeight } = useWindowDimensions();

  // Multi-journey data pipeline: fetch → merge → set atoms
  const { isLoading, error: dataError, isOfflineFallback, refresh } =
    useJourneyData(journeySlug);

  // Network status + offline queue
  const { isOnline } = useNetworkStatus();
  const { enqueue } = useOfflineQueue(isOnline);

  // Rapid interaction prevention
  const { guardedPress, lock: lockInteraction } = useInteractionLock();

  // Jotai state (set by useJourneyData, consumed here)
  const journeyState = useAtomValue(journeyStateAtom);
  const setJourneyState = useSetAtom(journeyStateAtom);
  const currentUnit = useAtomValue(currentUnitAtom);
  const stats = useAtomValue(journeyStatsAtom);
  const enrollmentId = useAtomValue(enrollmentIdAtom);

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
          router.push({
            pathname: `/tabs/screens/task/[id]`,
            params: { id: node.taskId, nodeId: node.id }
          } as never);
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
    async (nodeId: string): Promise<void> => {
      playSound("nodeComplete");
      lockInteraction(800);

      // Optimistic local update for instant UI feedback
      setJourneyState((prev: JourneyState) => completeNode(prev, nodeId));

      // Server-side atomic completion (validates, grants rewards, unlocks next)
      if (isOnline && enrollmentId) {
        const result = await completeNodeApi({
          enrollmentId,
          nodeId,
        });
        if (!result.success) {
          console.warn('[JourneyMapContainer] Server completion failed, will sync on next refresh');
          // Optimistic state already saved to AsyncStorage by useJourneyData
        } else {
          // Re-fetch to sync server-granted rewards
          await refresh();
        }
      } else {
        // Offline — optimistic state is saved, will sync when reconnected
        console.warn('[JourneyMapContainer] Offline: node completion queued in local state');
      }
    },
    [setJourneyState, playSound, lockInteraction, isOnline, enrollmentId, enqueue, refresh],
  );

  const handleUpdateProgress = useCallback(
    (nodeId: string, progress: number): void => {
      // Optimistic local update
      setJourneyState((prev: JourneyState) =>
        updateNodeProgress(prev, nodeId, progress),
      );

      // Fire-and-forget server update (non-blocking)
      if (isOnline && enrollmentId) {
        updateNodeProgressApi({
          enrollmentId,
          nodeId,
          progress,
        }).catch((err: unknown) =>
          console.warn('[JourneyMapContainer] Progress sync failed:', err),
        );
      }
    },
    [setJourneyState, isOnline, enrollmentId],
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

  // Only block rendering with skeleton on true first load before any state exists
  if (isLoading && !currentUnit) {
    return <JourneyLoadingSkeleton />;
  }

  // Hard error with nothing to render at all
  if (dataError && !currentUnit) {
    return <JourneyErrorState message={dataError} onRetry={refresh} />;
  }

  // Safety guard
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
