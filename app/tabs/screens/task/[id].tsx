/**
 * Task Screen — renders full node content via NodeRenderer.
 * Receives nodeId via route params from the journey map.
 *
 * Content flow:
 *   1. JourneyMapContainer fetches NodeContentResponse and caches it
 *      via useNodeContent before navigating here.
 *   2. This screen calls useNodeContent.fetchContent(nodeId) which
 *      hits the in-memory cache instantly (no network round-trip).
 *   3. NodeRenderer dispatches to the correct renderer (learn, exercise,
 *      quiz, journal, mood_check, checkpoint, chest).
 *   4. On completion, optimistic local update + server sync + section refresh.
 */

import React, { useEffect, useMemo } from "react";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, router } from "expo-router";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { useAtom, useSetAtom } from "jotai";
import {
  currentSectionMapAtom,
  sectionCacheAtom,
  cacheSectionMap,
  journeyStateAtom,
} from "@/src/store/journeyStore";
import { completeNode } from "@/src/store/journeyActions";
import {
  completeNodeApi,
  fetchSectionMap,
  replayCompletedNodeApi,
} from "@/src/lib/api/journeyApi";
import { useNetworkStatus } from "@/src/hooks/useNetworkStatus";
import { createLogger } from "@/src/lib/logger";
import type {
  SectionMapResponse,
  SectionViewMode,
  NodeStub,
} from "@/src/types/journey/sectionMap";
import type {
  NodeContent,
  NodeResponseData,
} from "@/src/types/journey/mentalHealth";
import { useNodeContent } from "@/src/hooks/useNodeContent";
import NodeRenderer from "@/src/components/journey/renderers/NodeRenderer";

const log = createLogger("TaskScreen");

export default function TaskScreen(): React.JSX.Element {
  const { id, nodeId, journeyMode, journeySlug, returnSectionNumber } =
    useLocalSearchParams<{
      id: string;
      nodeId?: string;
      journeyMode?: SectionViewMode;
      journeySlug?: string;
      returnSectionNumber?: string;
    }>();

  const [sectionMap, setSectionMap] = useAtom(currentSectionMapAtom);
  const setSectionCache = useSetAtom(sectionCacheAtom);
  const setJourneyState = useSetAtom(journeyStateAtom);
  const { isOnline } = useNetworkStatus();
  const enrollmentId = sectionMap?.enrollment?.id ?? null;
  const resolvedJourneyMode: SectionViewMode =
    journeyMode ?? sectionMap?.viewMode ?? "active";
  const resolvedJourneySlug: string | null =
    journeySlug ?? sectionMap?.journey.slug ?? null;
  const resolvedReturnSectionNumber: number | undefined = returnSectionNumber
    ? Number(returnSectionNumber)
    : sectionMap?.section.unitNumber;

  // ── Node content (lazy-fetched, cached by container before navigation) ──
  const {
    content: nodeContent,
    isLoading: isContentLoading,
    error: contentError,
    fetchContent,
  } = useNodeContent();

  // Fetch content on mount — instant cache hit expected
  useEffect(() => {
    if (nodeId) {
      fetchContent(nodeId);
    }
  }, [nodeId, fetchContent]);

  // ── Resolve NodeStub metadata (xpReward, estimatedMinutes) from section map ──
  const nodeStub: NodeStub | undefined = useMemo(() => {
    if (!sectionMap || !nodeId) return undefined;
    return sectionMap.section.nodes.find((n: NodeStub) => n.id === nodeId);
  }, [sectionMap, nodeId]);

  const refreshCurrentSection = React.useCallback(async (): Promise<void> => {
    if (!resolvedJourneySlug) {
      log.warn(
        "Skipping section refresh after completion; no section map context",
      );
      return;
    }

    const result = await fetchSectionMap(
      resolvedJourneySlug,
      resolvedJourneyMode === "completed"
        ? resolvedReturnSectionNumber
        : undefined,
      undefined,
      resolvedJourneyMode,
    );

    if (!result.success || !result.data) {
      log.warn("Post-completion section refresh failed", {
        slug: resolvedJourneySlug,
        unitNumber: resolvedReturnSectionNumber ?? null,
        journeyMode: resolvedJourneyMode,
        error: result.error ?? null,
      });
      return;
    }

    const refreshed: SectionMapResponse = result.data;
    setSectionMap(refreshed);
    setSectionCache((prev: Map<string, SectionMapResponse>) => {
      const next = new Map(prev);
      next.set(
        `${refreshed.viewMode}:${refreshed.section.unitNumber}`,
        refreshed,
      );
      return next;
    });
    await cacheSectionMap(
      refreshed.journey.slug,
      refreshed.section.unitNumber,
      refreshed,
    );

    log.info("Post-completion section refresh applied", {
      slug: refreshed.journey.slug,
      unitNumber: refreshed.section.unitNumber,
      journeyMode: refreshed.viewMode,
      progressRows: refreshed.progress.map((row) => ({
        nodeId: row.nodeId,
        status: row.status,
        progress: row.progress,
      })),
    });
  }, [
    resolvedJourneyMode,
    resolvedJourneySlug,
    resolvedReturnSectionNumber,
    setSectionCache,
    setSectionMap,
  ]);

  // ── Node completion handler — shared by NodeRenderer.onComplete ──
  const handleComplete = React.useCallback(
    async (responseData?: NodeResponseData): Promise<void> => {
      log.info("Task completion triggered", {
        taskId: id,
        nodeId: nodeId ?? null,
        enrollmentId: enrollmentId ?? null,
        isOnline,
        journeyMode: resolvedJourneyMode,
        hasResponseData: responseData !== undefined,
      });

      if (nodeId) {
        // Optimistic local update so the map instantly shows it as completed
        setJourneyState((prev) => completeNode(prev, nodeId));
        log.info("Applied optimistic local node completion", {
          nodeId,
        });

        // Non-blocking server sync
        if (isOnline && enrollmentId) {
          try {
            const result =
              resolvedJourneyMode === "completed"
                ? await replayCompletedNodeApi({ enrollmentId, nodeId })
                : await completeNodeApi({ enrollmentId, nodeId });
            log.info("completeNodeApi finished", {
              nodeId,
              enrollmentId,
              success: result.success,
              apiSuccess: result.data?.success ?? null,
              apiError: result.data?.error ?? result.error ?? null,
              journeyMode: resolvedJourneyMode,
            });

            if (result.success && result.data?.success !== false) {
              await refreshCurrentSection();
            }
          } catch (err) {
            log.error("Failed to complete node on server", err, {
              nodeId,
              enrollmentId,
            });
          }
        } else {
          log.warn("Offline or not enrolled, progress queued locally", {
            nodeId,
            enrollmentId: enrollmentId ?? null,
            isOnline,
          });
        }
      } else {
        log.warn("Task completion triggered without nodeId", {
          taskId: id,
        });
      }

      log.info("Navigating back from task screen", {
        taskId: id,
        nodeId: nodeId ?? null,
      });
      router.back();
    },
    [
      id,
      nodeId,
      enrollmentId,
      isOnline,
      resolvedJourneyMode,
      setJourneyState,
      refreshCurrentSection,
    ],
  );

  // ── Close handler (back without completing) ──
  const handleClose = React.useCallback((): void => {
    log.info("Task screen closed without completing", {
      taskId: id,
      nodeId: nodeId ?? null,
    });
    router.back();
  }, [id, nodeId]);

  // ── Loading state ──
  if (isContentLoading) {
    return (
      <SafeAreaView
        className="flex-1 bg-white items-center justify-center"
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#58CC02" />
        <Text className="text-sm text-slate-400 mt-4">Loading content…</Text>
      </SafeAreaView>
    );
  }

  // ── Error state ──
  if (contentError || (!nodeContent && !isContentLoading)) {
    return (
      <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <View className="h-24 w-24 rounded-3xl bg-red-50 items-center justify-center mb-6">
            <Text className="text-5xl">⚠️</Text>
          </View>
          <Text className="text-xl font-bold text-slate-900 mb-2 text-center">
            Failed to load content
          </Text>
          <Text className="text-base text-slate-500 text-center mb-8">
            {contentError ??
              "Content not available. Please go back and try again."}
          </Text>
          <PressableScale
            onPress={() => {
              if (nodeId) {
                fetchContent(nodeId);
              }
            }}
            scale={0.95}
            hapticStyle="light"
            style={{
              backgroundColor: "#F1F5F9",
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 14,
              marginBottom: 12,
            }}
          >
            <Text className="text-sm font-semibold text-slate-600">Retry</Text>
          </PressableScale>
          <PressableScale
            onPress={handleClose}
            scale={0.95}
            hapticStyle="light"
            style={{
              paddingHorizontal: 24,
              paddingVertical: 12,
            }}
          >
            <Text className="text-sm font-semibold text-slate-400">
              Go Back
            </Text>
          </PressableScale>
        </View>
      </SafeAreaView>
    );
  }

  // ── Render NodeRenderer with full content ──
  if (nodeContent) {
    return (
      <NodeRenderer
        nodeType={nodeContent.nodeType}
        content={nodeContent.content as unknown as NodeContent}
        title={nodeContent.title ?? ""}
        estimatedMinutes={nodeStub?.estimatedMinutes ?? 5}
        xpReward={nodeStub?.xpReward ?? 10}
        onComplete={(responseData: NodeResponseData) =>
          handleComplete(responseData)
        }
        onClose={handleClose}
      />
    );
  }

  // ── Fallback (should not reach here) ──
  return (
    <SafeAreaView
      className="flex-1 bg-white items-center justify-center"
      edges={["top"]}
    >
      <ActivityIndicator size="large" color="#58CC02" />
    </SafeAreaView>
  );
}
