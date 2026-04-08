/**
 * JourneyMapContainer
 * Container component — handles state management, business logic,
 * and data preparation. Passes everything to JourneyMapPresentation.
 * No markup beyond composing the presentation child.
 *
 * Data flow (lazy section loading — Phase C):
 * 1. useSectionData(slug) fetches one section at a time via get_section_map RPC
 * 2. sectionMapBridge converts SectionMapResponse → JourneyState for existing UI
 * 3. All derived atoms / FlashList pipeline consume the bridged state
 * 4. useNodeContent lazily fetches full JSONB content on node tap
 * 5. Node completion uses server-side RPC for atomic reward granting
 * 6. Trophy completion auto-loads the next section
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
  ActivityIndicator,
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
  journeyTemplateAtom,
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
import { useSectionData } from "@/src/hooks/useSectionData";
import { useNodeContent } from "@/src/hooks/useNodeContent";
import type {
  NodeStub,
  NodeContentResponse,
  SectionListItem,
} from "@/src/types/journey/sectionMap";
import { sectionMapToJourneyState } from "@/src/utils/journey/sectionMapBridge";
import { useSectionPrefetch } from "@/src/hooks/useSectionPrefetch";
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
const ChestRewardModal = lazy(
  () => import("@/src/components/journey/ChestRewardModal"),
);
const UnitCompleteModal = lazy(
  () => import("@/src/components/journey/UnitCompleteModal"),
);
import JourneyLoadingSkeleton from "@/src/components/journey/JourneyLoadingSkeleton";
import JourneyErrorState from "@/src/components/journey/JourneyErrorState";
import { JourneySwitcherSheet } from "@/src/components/journey/JourneySwitcherSheet";
import { useMultiJourney } from "@/src/hooks/useMultiJourney";
import { useEnrollmentProgressSync } from "@/src/hooks/useEnrollmentProgressSync";
import MultiUnitPresentation from "./MultiUnitPresentation";
import type { UnitRenderData } from "./MultiUnitPresentation";
import { Text } from "@/components/Themed";
import { debounce, DebouncedFunction } from "@/src/utils/debounce";
import SectionOverviewSheet from "@/src/components/journey/SectionOverviewSheet";
// FlashList segment-per-cell architecture
import { useJourneyFlashList } from "@/src/hooks/useJourneyFlashList";
import JourneyMapFlashList from "./JourneyMapFlashList";
import type { JourneyFlashListItem } from "@/src/types/journey";
import { FlashList, FlashListRef } from "@shopify/flash-list";

/** Feature flag: set to true to use new FlashList rendering path */
const USE_FLASH_LIST: boolean = true;

export default function JourneyMapContainer(): React.JSX.Element {
  // Route params — journey slug comes from navigation
  const { slug, jumpToSection } = useLocalSearchParams<{
    slug?: string;
    jumpToSection?: string;
  }>();
  // Default to anxiety-toolkit if no slug provided
  const journeySlug: string = slug ?? "anxiety-toolkit";

  // Track slug changes to show brief transition skeleton
  const prevSlugRef = useRef<string>(journeySlug);
  const [isSwitchingJourney, setIsSwitchingJourney] = useState<boolean>(false);

  useEffect(() => {
    if (prevSlugRef.current !== journeySlug) {
      prevSlugRef.current = journeySlug;
      setIsSwitchingJourney(true);
      // Safety timeout in case loading never clears
      const timer = setTimeout(() => setIsSwitchingJourney(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [journeySlug]);

  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const chestModalRef = useRef<BottomSheetModal>(null);
  const unitCompleteModalRef = useRef<BottomSheetModal>(null);
  const [chestNode, setChestNode] = useState<PathNodeData | null>(null);
  const toast = useToast();
  const { play: playSound } = useSoundEffects();
  const { height: viewportHeight } = useWindowDimensions();

  // ── P1.6.1: Guest try-before-sign-up ──
  const { isGuest, canAccessNode, showSignUpPrompt, signUpSheetRef } =
    useJourneyAuthGate();
  const { guestProgress, recordGuestNodeCompletion } = useGuestProgress();

  // ── Section-based lazy loading (Phase C) ──
  const {
    isLoading,
    error: dataError,
    isOfflineFallback: _isOfflineFallback,
    isSwitchingSection,
    sectionMap,
    sectionList,
    activeNodeId: _sectionActiveNodeId,
    loadSection,
    refresh,
    wasVersionInvalidated,
    resetVersionInvalidated,
  } = useSectionData(journeySlug);

  // D4: Show toast when journey template was updated (cache invalidated)
  useEffect(() => {
    if (wasVersionInvalidated) {
      toast.show({
        id: "journey-version-updated",
        placement: "top",
        render: () => (
          <Toast action="info">
            <ToastTitle>Journey updated — loading latest content</ToastTitle>
          </Toast>
        ),
      });
      resetVersionInvalidated();
    }
  }, [wasVersionInvalidated, toast, resetVersionInvalidated]);

  // Lazy node content fetcher (on-demand when user taps a node)
  const {
    content: _nodeContent,
    isLoading: isNodeContentLoading,
    error: _nodeContentError,
    fetchContent: fetchNodeContent,
    clearContent: _clearNodeContent,
  } = useNodeContent();

  // D5: Proactive prefetching — next section at 80%, next 1-2 node contents
  useSectionPrefetch({
    slug: journeySlug,
    sectionMap,
    enabled: !isLoading && !isSwitchingSection,
  });

  // Clear switching state once loading finishes for the new slug
  useEffect(() => {
    if (!isLoading && isSwitchingJourney) {
      setIsSwitchingJourney(false);
    }
  }, [isLoading, isSwitchingJourney]);

  // Network status + offline queue
  const { isOnline } = useNetworkStatus();
  const { enqueue } = useOfflineQueue(isOnline);

  // Rapid interaction prevention
  const { guardedPress, lock: lockInteraction } = useInteractionLock();

  // Jotai state (set by useJourneyData, consumed here)
  const journeyState = useAtomValue(journeyStateAtom);
  const setJourneyState = useSetAtom(journeyStateAtom);

  // Sync node completion progress → multi-journey enrollment store
  useEnrollmentProgressSync();
  const currentUnit = useAtomValue(currentUnitAtom);
  const stats = useAtomValue(journeyStatsAtom);

  // Bridge: sync section map → journeyStateAtom so existing FlashList + UI works
  useEffect(() => {
    if (sectionMap) {
      const bridgedState: JourneyState = sectionMapToJourneyState(
        sectionMap,
        stats,
      );
      setJourneyState(bridgedState);
    }
  }, [sectionMap, stats, setJourneyState]);

  const enrollmentIdFromAtom: string | null = useAtomValue(enrollmentIdAtom);
  const enrollmentId: string | null =
    sectionMap?.enrollment?.id ?? enrollmentIdFromAtom;
  // Granular selectors — preserve referential equality for unchanged slices
  const currentUnitIndex: number = useAtomValue(currentUnitIndexAtom);
  const allUnitsRaw: UnitData[] = useAtomValue(unitsAtom);
  const journeyTemplate = useAtomValue(journeyTemplateAtom);
  const journeyTitle: string =
    sectionMap?.journey.title ?? journeyTemplate?.title ?? "Journey Overview";

  const unitCompletedCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!journeyState?.units) return counts;

    journeyState.units.forEach((unit: UnitData) => {
      if (!unit || !unit.nodes) return;
      const completed: number = unit.nodes.filter(
        (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
      ).length;
      // Key by unit.id (UUID) for FlashList pipeline
      counts[unit.id] = completed;
      // Key by section_${unitNumber} for SectionOverviewSheet
      counts[`section_${unit.unitNumber}`] = completed;
    });
    return counts;
  }, [journeyState?.units]);

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
  } = useJourneyFlashList(config, unitConfigMap, activeSectionConfig?.unitIds ?? []);

  // Compute active node Y across all units for scroll-to-active (Old architecture only)
  const explicitActiveNodeY: number | null = useMemo(() => {
    for (const renderData of unitRenderData) {
      if (!renderData?.unit?.nodes) continue;
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
      (acc: number, unit: UnitData) => {
        if (!unit || !unit.nodes) return acc;
        return acc +
          unit.nodes.filter(
            (n: PathNodeData) => n.status === NodeStatus.COMPLETED,
          ).length;
      },
      0,
    );
  }, [allUnitsRaw]);

  // ── Node press handlers by status (wrapped with interaction lock — Task 5.1.3) ──
  const handleNodePressInner = useCallback(
    (node: PathNodeData): void => {
      // ── Phase C: Check canInteract from section map (preview mode gate) ──
      // If the section is non-interactive, show a toast instead of allowing tap
      const nodeStub: NodeStub | undefined = sectionMap?.section.nodes.find(
        (n: NodeStub) => n.id === node.id,
      );
      if (nodeStub && !nodeStub.canInteract) {
        playSound("lockedTap");
        const currentSection: number =
          sectionMap?.enrollment?.currentUnitNumber ?? 1;
        toast.show({
          id: `preview-${node.id}`,
          placement: "bottom",
          render: () => (
            <Toast action="warning">
              <ToastTitle>
                Complete Section {currentSection} trophy to unlock
              </ToastTitle>
            </Toast>
          ),
        });
        return;
      }

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
          // Lazy-fetch node content before navigating
          fetchNodeContent(node.id)
            .then((result: NodeContentResponse | null) => {
              if (!result) {
                toast.show({
                  id: `fetch-error-${node.id}`,
                  placement: "bottom",
                  render: () => (
                    <Toast action="error">
                      <ToastTitle>
                        Failed to load content. Please try again.
                      </ToastTitle>
                    </Toast>
                  ),
                });
                return;
              }
              router.push({
                pathname: `/tabs/screens/task/[id]`,
                params: { id: node.taskId, nodeId: node.id },
              } as never);
            })
            .catch(() => {
              toast.show({
                id: `fetch-error-${node.id}`,
                placement: "bottom",
                render: () => (
                  <Toast action="error">
                    <ToastTitle>
                      Something went wrong. Please try again.
                    </ToastTitle>
                  </Toast>
                ),
              });
            });
          break;

        case NodeStatus.COMPLETED:
          playSound("nodeTap");
          // Lazy-fetch content and open in review mode (read-only)
          fetchNodeContent(node.id)
            .then((result: NodeContentResponse | null) => {
              if (!result) {
                toast.show({
                  id: `fetch-error-${node.id}`,
                  placement: "bottom",
                  render: () => (
                    <Toast action="error">
                      <ToastTitle>
                        Failed to load content. Please try again.
                      </ToastTitle>
                    </Toast>
                  ),
                });
                return;
              }
              router.push({
                pathname: `/tabs/screens/task/[id]`,
                params: { id: node.taskId, nodeId: node.id, mode: "review" },
              } as never);
            })
            .catch(() => {
              toast.show({
                id: `fetch-error-${node.id}`,
                placement: "bottom",
                render: () => (
                  <Toast action="error">
                    <ToastTitle>
                      Something went wrong. Please try again.
                    </ToastTitle>
                  </Toast>
                ),
              });
            });
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
      sectionMap,
      fetchNodeContent,
    ],
  );

  const handleNodePress = useMemo(
    () => guardedPress(handleNodePressInner),
    [guardedPress, handleNodePressInner],
  );

  // ── Action dispatchers (used by child flows returning from task screen) ──
  // TODO: Wire handleCompleteNode and handleUpdateProgress to the task renderer
  // via a context provider or navigation params so the task screen can call them
  // on node completion / progress updates. Currently defined but not passed down.
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
        } else {
          // Re-fetch section to sync server-granted rewards & updated progress
          await refresh();

          // Phase C: Check if this was a trophy node → auto-load next section
          const completedStub: NodeStub | undefined =
            sectionMap?.section.nodes.find((n: NodeStub) => n.id === nodeId);
          if (completedStub?.isTrophy && sectionMap) {
            const nextUnitNumber: number = sectionMap.section.unitNumber + 1;
            if (nextUnitNumber <= sectionMap.journey.totalSections) {
              // Small delay for celebration animation to play
              setTimeout(() => {
                loadSection(nextUnitNumber);
              }, 1200);
            } else {
              // Last trophy completed — journey is finished!
              setTimeout(() => {
                toast.show({
                  id: "journey-complete",
                  placement: "top",
                  duration: 5000,
                  render: () => (
                    <Toast action="success">
                      <ToastTitle>
                        🎉 Journey complete! Congratulations!
                      </ToastTitle>
                    </Toast>
                  ),
                });
                // Navigate to journey completion screen
                router.push({
                  pathname: "/tabs/screens/journey-complete",
                  params: {
                    slug: journeySlug ?? "",
                    title: journeyTitle,
                  },
                } as never);
              }, 1200);
            }
          }
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
      refresh,
      isGuest,
      recordGuestNodeCompletion,
      journeySlug,
      journeyTitle,
      sectionMap,
      loadSection,
      toast,
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

  const handleChestClaim = useCallback(
    (nodeId: string): void => {
      playSound("chestClaim");
      // Mark chest as completed and grant rewards
      setJourneyState((prev: JourneyState) => completeNode(prev, nodeId));
      setChestNode(null);

      // Record guest progress locally (mirrors handleCompleteNode guest path)
      if (isGuest) {
        recordGuestNodeCompletion(nodeId, 10, journeySlug);
      }
    },
    [
      setJourneyState,
      playSound,
      isGuest,
      recordGuestNodeCompletion,
      journeySlug,
    ],
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
  const handleFlashListScrollToActive = useCallback(
    (duration = 3000) => {
      if (flashActiveNodeY !== null && flashListRef.current) {
        const targetOffset = Math.max(0, flashActiveNodeY - viewportHeight / 3);

        // Start the animation from our actual current scroll position!
        scrollY.value = currentScrollY.current;

        // Now slowly glide to the target over 800ms
        scrollY.value = withTiming(targetOffset, {
          duration,
        });
      }
    },
    [flashActiveNodeY, viewportHeight, scrollY],
  );

  useAnimatedReaction(
    () => scrollY.value,
    (y) => {
      scrollTo(flashListRef, 0, y, false); // ✅ Custom smooth scroll hook
    },
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

  const [isSectionOverviewOpen, setIsSectionOverviewOpen] =
    useState<boolean>(false);

  // Guide-book press handler (opens section overview sheet)
  const handleGuidePress = useCallback((): void => {
    setIsSectionOverviewOpen(true);
  }, []);

  const handleSectionOverviewClose = useCallback((): void => {
    setIsSectionOverviewOpen(false);
  }, []);

  const handleJumpToSection = useCallback(
    (unitNumber: number): void => {
      loadSection(unitNumber);
      // Derive section ID from sectionList for local state
      const target = sectionList.find(
        (s: SectionListItem) => s.unitNumber === unitNumber,
      );
      if (target) {
        setActiveSectionId(`section_${unitNumber}`);
      }
    },
    [loadSection, sectionList],
  );

  // ── Journey Switcher ──
  const { switcherItems, switchJourney, archiveJourney } = useMultiJourney();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState<boolean>(false);

  const handleFlagPress = useCallback((): void => {
    setIsSwitcherOpen(true);
  }, []);

  const handleSwitcherClose = useCallback((): void => {
    setIsSwitcherOpen(false);
  }, []);

  const handleSwitchJourney = useCallback(
    (targetSlug: string): void => {
      switchJourney(targetSlug);
      // Small delay so bottom sheet dismiss animation finishes before skeleton
      setTimeout(() => {
        router.setParams({ slug: targetSlug });
      }, 250);
    },
    [switchJourney],
  );

  const handleDiscoverPress = useCallback((): void => {
    setIsSwitcherOpen(false);
    // Navigate to the catalog by removing slug param (triggers empty state → catalog)
    router.push("/tabs/(tabs)/journeys" as never);
  }, []);

  const handleArchiveJourney = useCallback(
    (slug: string): void => {
      archiveJourney(slug);
    },
    [archiveJourney],
  );

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

  // Show skeleton on first load, switching journeys, or switching sections
  if ((isLoading && !sectionMap) || isSwitchingJourney || isSwitchingSection) {
    return <JourneyLoadingSkeleton />;
  }

  // Hard error with nothing to render at all
  if (dataError && !sectionMap) {
    return (
      <JourneyErrorState
        message={dataError}
        onRetry={refresh}
      />
    );
  }

  // Fallback: sectionMap loaded but no unit data — show retry
  if (!sectionMap || !currentUnit) {
    return (
      <JourneyErrorState
        message={dataError ?? "Could not load journey data. Please try again."}
        onRetry={refresh}
      />
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
          listRef={
            flashListRef as unknown as React.RefObject<
              FlashListRef<JourneyFlashListItem>
            >
          }
          unitHeaders={unitHeaders}
          onGuidePress={handleGuidePress}
          onFlagPress={handleFlagPress}
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
          onFlagPress={handleFlagPress}
          onJumpToUnit={handleJumpToUnit}
        />
      )}
      <Suspense fallback={null}>
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
      <SectionOverviewSheet
        isOpen={isSectionOverviewOpen}
        onClose={handleSectionOverviewClose}
        currentUnitIndex={currentUnitIndex}
        unitCompletedCounts={unitCompletedCounts}
        sectionList={sectionList}
        currentSectionUnitNumber={sectionMap?.section.unitNumber ?? 1}
        onJumpToSection={handleJumpToSection}
        journeyTitle={journeyTitle}
      />
      {/* Journey Switcher Bottom Sheet */}
      <JourneySwitcherSheet
        isOpen={isSwitcherOpen}
        onClose={handleSwitcherClose}
        items={switcherItems}
        onSwitchJourney={handleSwitchJourney}
        onDiscoverPress={handleDiscoverPress}
        onArchive={handleArchiveJourney}
      />
      {/* Loading overlay while fetching node content on tap */}
      {isNodeContentLoading && (
        <View className="absolute inset-0 items-center justify-center bg-black/20 z-50">
          <View className="rounded-2xl bg-white px-6 py-4 items-center shadow-lg">
            <ActivityIndicator
              size="large"
              color="#58CC02"
            />
            <RNText className="mt-2 text-sm font-medium text-gray-600">
              Loading content…
            </RNText>
          </View>
        </View>
      )}
    </>
  );
}
