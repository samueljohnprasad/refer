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
 *
 * P1.6.1 — Try-Before-Sign-Up:
 * - Guests may complete the first 2 nodes without authentication.
 * - useJourneyAuthGate intercepts node presses beyond the limit.
 * - useGuestProgress stores local completions in AsyncStorage.
 * - GuestSignUpSheet is presented to prompt account creation.
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
import {
  useWindowDimensions,
  View,
  Text as RNText,
  TouchableOpacity,
} from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useAtomValue, useSetAtom } from "jotai";
import {
  router,
  Stack,
  useLocalSearchParams,
  useFocusEffect,
} from "expo-router";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";

import type {
  PathNodeData,
  JourneyState,
  UnitData,
  JourneyConfig,
  UnitConfig,
  SectionConfig,
} from "@/src/types/journey";
import { NodeStatus, NodeType } from "@/src/types/journey";
import { useMultiUnitLayout } from "@/src/hooks/useMultiUnitLayout";
import type { UnitLayoutSegment } from "@/src/hooks/useMultiUnitLayout";
import { computeMascotPositions } from "@/src/hooks/useMascotPositions";
import type { MascotPositionData } from "@/src/hooks/useMascotPositions";
import { useJourneyConfig } from "@/src/context/JourneyConfigContext";
import {
  journeyStateAtom,
  currentUnitAtom,
  journeyStatsAtom,
  enrollmentIdAtom,
  currentUnitIndexAtom,
  unitsAtom,
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
import Animated, {
  useAnimatedRef,
  scrollTo,
  runOnUI,
  useSharedValue,
  withTiming,
  useAnimatedReaction,
} from "react-native-reanimated";
// Guest auth gate (P1.6.1)
import { useJourneyAuthGate } from "@/hooks/data/useJourneyAuthGate";
import { useGuestProgress } from "@/hooks/data/useGuestProgress";
import GuestSignUpSheet from "@/src/components/journey/GuestSignUpSheet";
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
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import JourneyErrorState from "@/src/components/journey/JourneyErrorState";
import MultiUnitPresentation from "./MultiUnitPresentation";
import type { UnitRenderData } from "./MultiUnitPresentation";
import { Text } from "@/components/Themed";
import { debounce, DebouncedFunction } from "@/src/utils/debounce";
// FlashList segment-per-cell architecture
import { useJourneyFlashList } from "@/src/hooks/useJourneyFlashList";
import JourneyMapFlashList from "./JourneyMapFlashList";
import type { JourneyFlashListItem } from "@/src/types/journey";
import { FlashListRef } from "@shopify/flash-list";

/** Feature flag: set to true to use new FlashList rendering path */
const USE_FLASH_LIST: boolean = true;

export default function JourneyMapContainer(): React.JSX.Element {
  // Route params — journey slug comes from navigation
  const { slug, jumpToSection } = useLocalSearchParams<{
    slug?: string;
    jumpToSection?: string;
  }>();
  // Default to first journey slug if not provided (backward compatible)
  const journeySlug: string = slug ?? "default";

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const completionModalRef = useRef<BottomSheetModal>(null);
  const chestModalRef = useRef<BottomSheetModal>(null);
  const unitCompleteModalRef = useRef<BottomSheetModal>(null);
  const [completedNode, setCompletedNode] = useState<PathNodeData | null>(null);
  const [chestNode, setChestNode] = useState<PathNodeData | null>(null);
  const toast = useToast();
  const { play: playSound } = useSoundEffects();
  const { height: viewportHeight } = useWindowDimensions();

  // ── P1.6.1: Guest try-before-sign-up ──
  const { isGuest, canAccessNode, showSignUpPrompt, signUpSheetRef } =
    useJourneyAuthGate();
  const { guestProgress, recordGuestNodeCompletion } = useGuestProgress();

  // Multi-journey data pipeline: fetch → merge → set atoms
  const {
    isLoading,
    error: dataError,
    isOfflineFallback,
    refresh,
  } = useJourneyData(journeySlug);

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
  // Granular selectors — preserve referential equality for unchanged slices
  const currentUnitIndex: number = useAtomValue(currentUnitIndexAtom);
  const allUnitsRaw: UnitData[] = useAtomValue(unitsAtom);

  // Debounced persistence — avoids hammering AsyncStorage on every progress tick.
  // Fires at most once per 1.5s (trailing). Flushed on unmount to avoid data loss.
  const debouncedSave = useMemo<DebouncedFunction<typeof saveJourneyState>>(
    () => debounce(saveJourneyState, 1500),
    [],
  );

  useEffect(() => {
    debouncedSave(journeyState);
    if (!isOnline) {
      enqueue(journeyState);
    }
  }, [journeyState, isOnline, enqueue, debouncedSave]);

  // Flush any pending save on unmount to prevent data loss
  useEffect(() => {
    return () => {
      debouncedSave.flush();
    };
  }, [debouncedSave]);

  // Get config for multi-unit rendering
  const config: JourneyConfig = useJourneyConfig();

  // ── Pre-built lookup Maps — O(1) instead of O(n) .find() per lookup ──
  // Built once when config changes (extremely rare — only on hot-swap).
  const unitConfigMap: Map<string, UnitConfig> = useMemo(
    () => new Map(config.units.map((uc: UnitConfig) => [uc.id, uc])),
    [config.units],
  );
  const sectionConfigMap: Map<string, SectionConfig> = useMemo(
    () => new Map(config.sections.map((sc: SectionConfig) => [sc.id, sc])),
    [config.sections],
  );
  // Reverse lookup: unitId → sectionConfig (avoids nested .find inside .map)
  const unitToSectionMap: Map<string, SectionConfig> = useMemo(() => {
    const map = new Map<string, SectionConfig>();
    for (const [unitId, uc] of unitConfigMap) {
      const sc: SectionConfig | undefined = sectionConfigMap.get(uc.sectionId);
      if (sc) map.set(unitId, sc);
    }
    return map;
  }, [unitConfigMap, sectionConfigMap]);

  const verticalGap: number = config.settings.verticalGap ?? 120;

  // Determine the default section based on user's current unit
  // Uses granular currentUnitIndexAtom — only re-derives when the index changes,
  // not on every progress tick.
  const defaultSectionId: string = useMemo(() => {
    if (!config.units.length) return config.sections[0].id;
    const currentUnitConfig: UnitConfig =
      config.units[currentUnitIndex] || config.units[0];
    return currentUnitConfig.sectionId;
  }, [currentUnitIndex, config]);

  // State to track which section is currently focused (only its units render)
  const [activeSectionId, setActiveSectionId] =
    useState<string>(defaultSectionId);

  // Sync defaultSectionId to active state if the journey is refreshed or initialized
  useEffect(() => {
    if (!jumpToSection) setActiveSectionId(defaultSectionId);
  }, [defaultSectionId]);

  // Handle cross-section jumping via routing params
  useEffect(() => {
    if (jumpToSection && jumpToSection !== activeSectionId) {
      setActiveSectionId(jumpToSection);
      router.setParams({ jumpToSection: undefined });
      // Reset scroll position gracefully to the top when navigating to a new section
      runOnUI(() => {
        "worklet";
        scrollTo(scrollViewRef, 0, 0, false);
      })();
    }
  }, [jumpToSection, activeSectionId, scrollViewRef]);

  // Filter unit configs to ONLY the ones in the active section
  const activeSectionConfig =
    config.sections.find((s) => s.id === activeSectionId) || config.sections[0];

  // All units from journey state, restricted to the active section.
  // Uses granular unitsAtom — reference only changes when the units array mutates,
  // not on stats/currentUnit changes. This breaks the useMemo cascade.
  const allUnits: UnitData[] = useMemo(() => {
    return allUnitsRaw.filter((u: UnitData) =>
      activeSectionConfig.unitIds.includes(u.id),
    );
  }, [allUnitsRaw, activeSectionConfig]);

  // Compute multi-unit layout (all units in one scrollable path)
  // Passes the pre-built Map so layout never calls .find()
  const { screenWidth, unitSegments, totalDimensions } = useMultiUnitLayout(
    allUnits,
    unitConfigMap,
    verticalGap,
  );

  // Build a quick unit-data lookup for the active section (O(n) build, O(1) per get)
  const unitDataMap: Map<string, UnitData> = useMemo(
    () => new Map(allUnits.map((u: UnitData) => [u.id, u])),
    [allUnits],
  );

  // Compute per-unit render data with mascot positions
  // All lookups are O(1) Map.get() instead of O(n) .find()
  const unitRenderData: UnitRenderData[] = useMemo(() => {
    return unitSegments
      .map((segment: UnitLayoutSegment) => {
        const unit: UnitData | undefined = unitDataMap.get(segment.unitId);
        const unitConfig: UnitConfig | undefined = unitConfigMap.get(
          segment.unitId,
        );

        if (!unit || !unitConfig) {
          return null;
        }

        // Use pure function — NOT a hook — so it's safe inside useMemo
        const mascotPositions: MascotPositionData[] = computeMascotPositions(
          unit.mascotPlacements || [],
          segment.nodePositions,
          screenWidth,
        );

        const sectionConfig: SectionConfig | undefined = unitToSectionMap.get(
          segment.unitId,
        );

        return {
          unit,
          unitConfig,
          layout: segment,
          mascotPositions,
          sectionNumber: sectionConfig?.sectionNumber ?? 1,
        };
      })
      .filter((rd): rd is UnitRenderData => rd !== null);
  }, [unitSegments, unitDataMap, unitConfigMap, unitToSectionMap, screenWidth]);

  // ── FlashList segment-per-cell data pipeline ──
  const flashListRef = useAnimatedRef<FlashListRef<JourneyFlashListItem>>();
  const {
    flashListData,
    activeNodeIndex: flashActiveNodeIndex,
    activeGlobalIndex,
    screenWidth: flashScreenWidth,
    activeNodeY: flashActiveNodeY,
    unitHeaders,
  } = useJourneyFlashList(config, unitConfigMap, activeSectionConfig.unitIds);

  // Compute active node Y across all units for scroll-to-active (Old architecture only)
  const explicitActiveNodeY: number | null = useMemo(() => {
    for (const renderData of unitRenderData) {
      const activeIndex: number = renderData.unit.nodes.findIndex(
        (n: PathNodeData) => n.status === NodeStatus.ACTIVE,
      );
      if (activeIndex >= 0 && renderData.layout.nodePositions[activeIndex]) {
        return renderData.layout.nodePositions[activeIndex].y;
      }
    }
    return null;
  }, [unitRenderData]);

  // Use the FlashList-specific activeNodeY if the feature flag is enabled
  const activeNodeY = USE_FLASH_LIST ? flashActiveNodeY : explicitActiveNodeY;

  const {
    isOffScreen: isActiveOffScreen,
    direction: scrollDirection,
    scrollToActive,
    updateVisibility,
  } = useScrollToActive(scrollViewRef, activeNodeY, viewportHeight);

  // Auto-scroll to active node gracefully on screen focus
  // Gives the user a moment to see their completed node before panning to the next one
  useFocusEffect(
    useCallback(() => {
      if (activeNodeY !== null && !jumpToSection) {
        const timer = setTimeout(() => {
          runOnUI(() => {
            "worklet";
            scrollTo(scrollViewRef, 0, Math.max(0, activeNodeY - 200), true);
          })();
        }, 500); // 500ms lets the screen settle so they can observe the completion before the scroll native animation triggers
        return () => clearTimeout(timer);
      }
    }, [activeNodeY, jumpToSection]),
  );

  // ── Compute total completed count across ALL units (for guest gate) ──
  const totalCompletedCount: number = useMemo(() => {
    return allUnitsRaw.reduce(
      (acc: number, unit: UnitData) =>
        acc +
        unit.nodes.filter(
          (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
        ).length,
      0,
    );
  }, [allUnitsRaw]);

  // ── Node press handlers by status (wrapped with interaction lock — Task 5.1.3) ──
  const handleNodePressInner = useCallback(
    (node: PathNodeData): void => {
      // ── P1.6.1: Guest gate ──
      // Guests may access up to GUEST_FREE_NODE_LIMIT nodes.
      // ACTIVE nodes beyond the limit are blocked and prompt sign-up.
      if (
        isGuest &&
        node.status === NodeStatus.ACTIVE &&
        !canAccessNode(totalCompletedCount)
      ) {
        playSound("lockedTap");
        showSignUpPrompt();
        return;
      }

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
            params: { id: node.taskId, nodeId: node.id },
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
    [
      toast,
      playSound,
      isGuest,
      canAccessNode,
      totalCompletedCount,
      showSignUpPrompt,
    ],
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

      // ── P1.6.1: For guests, record completion locally instead of Supabase ──
      if (isGuest) {
        await recordGuestNodeCompletion(nodeId, 10, journeySlug);
        return;
      }

      // Server-side atomic completion (validates, grants rewards, unlocks next)
      if (isOnline && enrollmentId) {
        const result = await completeNodeApi({
          enrollmentId,
          nodeId,
        });
        if (!result.success) {
          console.warn(
            "[JourneyMapContainer] Server completion failed, will sync on next refresh",
          );
          // Optimistic state already saved to AsyncStorage by useJourneyData
        } else {
          // Re-fetch to sync server-granted rewards
          await refresh();
        }
      } else {
        // Offline — optimistic state is saved, will sync when reconnected
        console.warn(
          "[JourneyMapContainer] Offline: node completion queued in local state",
        );
      }
    },
    [
      setJourneyState,
      playSound,
      lockInteraction,
      isOnline,
      enrollmentId,
      enqueue,
      refresh,
      isGuest,
      recordGuestNodeCompletion,
      journeySlug,
    ],
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
          console.warn("[JourneyMapContainer] Progress sync failed:", err),
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

  // Current visible unit index for sticky header (simplified — use first unit for now)
  const currentVisibleUnitIndex: number = useMemo(() => {
    return journeyState?.currentUnit ?? 0;
  }, [journeyState?.currentUnit]);

  // Track real scroll position for custom animation anchor point
  const currentScrollY = useRef(0);
  const scrollY = useSharedValue(0);

  // FlashList scroll-to-active handler
  const handleFlashListScrollToActive = useCallback((duration = 3000) => {
    if (flashActiveNodeY !== null && flashListRef.current) {
      const targetOffset = Math.max(
        0,
        flashActiveNodeY - viewportHeight / 3
      );

      // Start the animation from our actual current scroll position!
      scrollY.value = currentScrollY.current;

      // Now slowly glide to the target over 800ms
      scrollY.value = withTiming(targetOffset, {
        duration,
      });
    }
  }, [flashActiveNodeY, viewportHeight, scrollY]);

  useAnimatedReaction(
    () => scrollY.value,
    (y) => {
      scrollTo(flashListRef, 0, y, false); // ✅ Custom smooth scroll hook
    }
  );

  // FlashList jump-to-unit handler
  const handleFlashListJumpToUnit = useCallback(
    (unitId: string): void => {
      const targetIndex: number = flashListData.findIndex(
        (item: JourneyFlashListItem) =>
          item.itemType === "divider" && item.id === `divider_${unitId}`,
      );
      if (targetIndex >= 0 && flashListRef.current) {
        flashListRef.current.scrollToIndex({
          index: targetIndex,
          animated: true,
          viewPosition: 0,
        });
      }
    },
    [flashListData],
  );

  // Auto-scroll FlashList to active node on mount / focus
  useFocusEffect(
    useCallback(() => {
      if (USE_FLASH_LIST && flashActiveNodeIndex >= 0 && !jumpToSection) {
        const timer = setTimeout(() => {
          handleFlashListScrollToActive(2000);
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [flashActiveNodeIndex, jumpToSection, handleFlashListScrollToActive]),
  );

  // Auto-scroll when the active node index changes (e.g., node completed)
  useEffect(() => {
    if (USE_FLASH_LIST && flashActiveNodeIndex >= 0 && !jumpToSection) {
      const timer = setTimeout(() => {
        handleFlashListScrollToActive(1000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [flashActiveNodeIndex, jumpToSection, handleFlashListScrollToActive]);

  // Guide-book press handler (opens section overview)
  const handleGuidePress = useCallback((): void => {
    router.push("/tabs/screens/section-overview" as never);
  }, []);

  // Jump to unit handler — scroll to the target unit's Y offset
  const handleJumpToUnit = useCallback(
    (unitId: string): void => {
      const target: UnitRenderData | undefined = unitRenderData.find(
        (rd: UnitRenderData) => rd.unit.id === unitId,
      );
      if (target) {
        runOnUI(() => {
          "worklet";
          scrollTo(
            scrollViewRef,
            0,
            Math.max(0, target.layout.yOffset - 120),
            true,
          );
        })();
      }
    },
    [unitRenderData],
  );

  // Only block rendering with skeleton on true first load before any state exists
  if (isLoading && !currentUnit) {
    return <JourneyLoadingSkeleton />;
  }

  // Hard error with nothing to render at all
  if (dataError && !currentUnit) {
    return (
      <JourneyErrorState
        message={dataError}
        onRetry={refresh}
      />
    );
  }

  // Safety guard
  if (!currentUnit) {
    return (
      <View className="flex-1 bg-gray-50">
        <Text>No unit found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {USE_FLASH_LIST ? (
        <JourneyMapFlashList
          data={flashListData}
          stats={stats}
          screenWidth={flashScreenWidth}
          activeGlobalIndex={activeGlobalIndex}
          onNodePress={handleNodePress}
          isOffline={!isOnline}
          isActiveOffScreen={isActiveOffScreen}
          scrollDirection={scrollDirection}
          onScrollToActive={() => handleFlashListScrollToActive()}
          onJumpToUnit={handleFlashListJumpToUnit}
          listRef={flashListRef}
          unitHeaders={unitHeaders}
          onGuidePress={handleGuidePress}
          onScroll={(y) => {
            currentScrollY.current = y;
            updateVisibility(y);
          }}
        />
      ) : (
        <MultiUnitPresentation
          unitRenderData={unitRenderData}
          stats={stats}
          currentVisibleUnitIndex={currentVisibleUnitIndex}
          totalDimensions={totalDimensions}
          screenWidth={screenWidth}
          onNodePress={handleNodePress}
          scrollViewRef={scrollViewRef}
          isOffline={!isOnline}
          isActiveOffScreen={isActiveOffScreen}
          scrollDirection={scrollDirection}
          onScrollToActive={scrollToActive}
          updateScrollVisibility={updateVisibility}
          onGuidePress={handleGuidePress}
          onJumpToUnit={handleJumpToUnit}
        />
      )}
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
      {/* P1.6.1: Guest sign-up prompt */}
      <GuestSignUpSheet
        ref={signUpSheetRef}
        guestProgress={guestProgress}
      />
    </>
  );
}
