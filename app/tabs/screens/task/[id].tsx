/**
 * Task Screen — placeholder for lesson/task content.
 * Receives taskId via route params from the journey map.
 * Will be replaced with actual task content in a future phase.
 */

import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams, router } from "expo-router";
import { PressableScale } from "@/src/components/ui/PressableScale";
import { useAtom, useSetAtom } from 'jotai';
import {
  currentSectionMapAtom,
  sectionCacheAtom,
  cacheSectionMap,
  journeyStateAtom,
} from '@/src/store/journeyStore';
import { completeNode } from '@/src/store/journeyActions';
import {
  completeNodeApi,
  fetchSectionMap,
  replayCompletedNodeApi,
} from '@/src/lib/api/journeyApi';
import { useNetworkStatus } from '@/src/hooks/useNetworkStatus';
import { createLogger } from '@/src/lib/logger';
import type {
  SectionMapResponse,
  SectionViewMode,
} from '@/src/types/journey/sectionMap';

const log = createLogger("TaskScreen");

export default function TaskScreen(): React.JSX.Element {
  const {
    id,
    nodeId,
    journeyMode,
    journeySlug,
    returnSectionNumber,
  } = useLocalSearchParams<{
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
    journeyMode ?? sectionMap?.viewMode ?? 'active';
  const resolvedJourneySlug: string | null =
    journeySlug ?? sectionMap?.journey.slug ?? null;
  const resolvedReturnSectionNumber: number | undefined = returnSectionNumber
    ? Number(returnSectionNumber)
    : sectionMap?.section.unitNumber;

  const refreshCurrentSection = React.useCallback(
    async (): Promise<void> => {
      if (!resolvedJourneySlug) {
        log.warn("Skipping section refresh after completion; no section map context");
        return;
      }

      const result = await fetchSectionMap(
        resolvedJourneySlug,
        resolvedJourneyMode === 'completed'
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
    },
    [
      resolvedJourneyMode,
      resolvedJourneySlug,
      resolvedReturnSectionNumber,
      setSectionCache,
      setSectionMap,
    ],
  );

  const handleComplete = async () => {
    log.info("Task completion tapped", {
      taskId: id,
      nodeId: nodeId ?? null,
      enrollmentId: enrollmentId ?? null,
      isOnline,
      journeyMode: resolvedJourneyMode,
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
          const result = resolvedJourneyMode === 'completed'
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
      log.warn("Task completion tapped without nodeId", {
        taskId: id,
      });
    }

    log.info("Navigating back from task screen", {
      taskId: id,
      nodeId: nodeId ?? null,
    });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Task icon */}
        <View className="h-24 w-24 rounded-3xl bg-green-50 items-center justify-center mb-6">
          <Text className="text-5xl">📝</Text>
        </View>

        <Text className="text-2xl font-extrabold text-slate-900 mb-2 text-center">
          Task: {id}
        </Text>
        <Text className="text-base text-slate-500 text-center mb-8">
          This is where the lesson content will appear. Complete the task to
          earn rewards and unlock the next lesson.
        </Text>

        {/* Complete button */}
        <PressableScale
          onPress={handleComplete}
          scale={0.95}
          hapticStyle="medium"
          style={{
            backgroundColor: "#58CC02",
            paddingHorizontal: 32,
            paddingVertical: 14,
            borderRadius: 16,
            borderBottomWidth: 4,
            borderBottomColor: "#45A802",
          }}
        >
          <Text className="text-lg font-extrabold text-white">CONTINUE</Text>
        </PressableScale>
      </View>
    </SafeAreaView>
  );
}
