import React, { useCallback, useRef, useState } from "react";
import { router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import type { JourneyState, PathNodeData, UnitData } from "@/src/types/journey";
import type { SectionMapResponse, NodeStub, SectionViewMode } from "@/src/types/journey/sectionMap";
import { completeNode, updateNodeProgress, unlockUnit } from "@/src/store/journeyActions";
import { completeNodeApi, replayCompletedNodeApi, updateNodeProgress as updateNodeProgressApi } from "@/src/lib/api/journeyApi";
import { useUnitCompletion } from "@/src/hooks/useUnitCompletion";
import { createLogger } from "@/src/lib/logger";
import type { JourneySoundKey } from "@/src/hooks/useSoundEffects";

const log = createLogger("useNodeActions");

interface UseNodeActionsProps {
  setJourneyState: React.Dispatch<React.SetStateAction<JourneyState>>;
  playSound: (sound: JourneySoundKey) => void;
  lockInteraction: (duration: number) => void;
  isOnline: boolean;
  enrollmentId: string | null;
  resolvedJourneySlug: string;
  journeyTitle: string;
  sectionMap: SectionMapResponse | null;
  loadSection: (section: number) => void;
  journeySlug: string | null;
  loadCurrentPosition: () => Promise<void>;
  journeyAccessMode: SectionViewMode;
  currentUnit: UnitData | undefined;
  allUnitsRaw: UnitData[];
}

export function useNodeActions({
  setJourneyState,
  playSound,
  lockInteraction,
  isOnline,
  enrollmentId,
  resolvedJourneySlug,
  journeyTitle,
  sectionMap,
  loadSection,
  journeySlug,
  loadCurrentPosition,
  journeyAccessMode,
  currentUnit,
  allUnitsRaw,
}: UseNodeActionsProps) {
  const toast = useToast();
  const chestModalRef = useRef<BottomSheetModal>(null);
  const unitCompleteModalRef = useRef<BottomSheetModal>(null);
  const [chestNode, setChestNode] = useState<PathNodeData | null>(null);

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
          log.warn("Server completion failed, will sync on next refresh");
        } else {
          // Re-fetch section to sync server-granted rewards & updated progress

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
        log.warn("Offline: node completion queued in local state");
      }
    },
    [
      setJourneyState,
      playSound,
      lockInteraction,
      isOnline,
      enrollmentId,
      resolvedJourneySlug,
      journeyTitle,
      sectionMap,
      loadSection,
      toast,
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
        }).catch((err: unknown) => log.warn("Progress sync failed", err));
      }
    },
    [setJourneyState, isOnline, enrollmentId],
  );

  const handleChestClaim = useCallback(
    async (nodeId: string): Promise<void> => {
      playSound("chestClaim");
      // Mark chest as completed and grant rewards
      setJourneyState((prev: JourneyState) => completeNode(prev, nodeId));
      setChestNode(null);


      if (isOnline && enrollmentId) {
        const result =
          sectionMap?.viewMode === "completed"
            ? await replayCompletedNodeApi({
              enrollmentId,
              nodeId,
            })
            : await completeNodeApi({
              enrollmentId,
              nodeId,
            });

        if (!result.success) {
          log.warn(
            "Chest completion failed on server, will sync on next refresh",
            {
              nodeId,
              enrollmentId,
              viewMode: sectionMap?.viewMode ?? journeyAccessMode,
            },
          );
          return;
        }

        if (sectionMap?.viewMode === "completed") {
        } else {
          await loadCurrentPosition();
        }
      } else {
        log.warn("Offline: chest completion queued in local state", {
          nodeId,
          enrollmentId,
          isOnline,
        });
      }
    },
    [
      enrollmentId,
      isOnline,
      loadCurrentPosition,
      setJourneyState,
      playSound,
      resolvedJourneySlug,
      sectionMap?.viewMode,
      journeyAccessMode,
    ],
  );

  const handleUnitComplete = useCallback((): void => {
    if (sectionMap?.viewMode === "completed") {
      return;
    }

    const isLastUnitInSection =
      currentUnit !== undefined && currentUnit.unitNumber >= allUnitsRaw.length;

    playSound("unitComplete");

    if (isLastUnitInSection) {
      log.info(
        "Last unit in section completed; waiting for section auto-advance",
        {
          journeySlug,
          sectionNumber: currentUnit?.sectionNumber ?? null,
          unitNumber: currentUnit?.unitNumber ?? null,
          sectionUnitCount: allUnitsRaw.length,
        },
      );
      return;
    }

    // Small delay so the last node animation finishes before modal appears
    setTimeout(() => {
      unitCompleteModalRef.current?.present();
    }, 600);
  }, [
    allUnitsRaw.length,
    currentUnit,
    journeySlug,
    playSound,
    sectionMap?.viewMode,
  ]);

  const { xpEarned } = useUnitCompletion(currentUnit, handleUnitComplete);

  const handleUnitContinue = useCallback((): void => {
    setJourneyState((prev: JourneyState) => unlockUnit(prev));
  }, [setJourneyState]);

  return {
    handleCompleteNode,
    handleUpdateProgress,
    handleChestClaim,
    handleUnitComplete,
    handleUnitContinue,
    xpEarned,
    chestNode,
    setChestNode,
    chestModalRef,
    unitCompleteModalRef,
  };
}
