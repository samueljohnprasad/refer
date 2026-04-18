import React, { useCallback } from "react";
import { router } from "expo-router";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useToast, Toast, ToastTitle } from "@/components/ui/toast";
import type { PathNodeData } from "@/src/types/journey";
import { NodeStatus, NodeType } from "@/src/types/journey";
import type { NodeStub, SectionMapResponse, SectionViewMode, NodeContentResponse } from "@/src/types/journey/sectionMap";
import type { JourneySoundKey } from "@/src/hooks/useSoundEffects";

interface UseNodePressHandlerProps {
  sectionMap: SectionMapResponse | null;
  isGuest: boolean;
  canAccessNode: (totalCompleted: number) => boolean;
  totalCompletedCount: number;
  showSignUpPrompt: () => void;
  playSound: (sound: JourneySoundKey) => void;
  fetchNodeContent: (nodeId: string) => Promise<NodeContentResponse | null>;
  journeyAccessMode: SectionViewMode;
  resolvedJourneySlug: string;
  setChestNode: (node: PathNodeData | null) => void;
  chestModalRef: React.RefObject<BottomSheetModal>;
  guardedPress: (callback: (args: any) => void) => (args: any) => void;
}

export function useNodePressHandler({
  sectionMap,
  isGuest,
  canAccessNode,
  totalCompletedCount,
  showSignUpPrompt,
  playSound,
  fetchNodeContent,
  journeyAccessMode,
  resolvedJourneySlug,
  setChestNode,
  chestModalRef,
  guardedPress,
}: UseNodePressHandlerProps) {
  const toast = useToast();
  const handleNodePressInner = useCallback(
    (node: PathNodeData): void => {
      // ── Phase C: Check canInteract from section map (preview mode gate) ──
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
                params: {
                  id: node.taskId,
                  nodeId: node.id,
                  journeyMode: sectionMap?.viewMode ?? journeyAccessMode,
                  journeySlug: sectionMap?.journey.slug ?? resolvedJourneySlug,
                  returnSectionNumber: String(
                    sectionMap?.section.unitNumber ?? 1,
                  ),
                },
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
                params: {
                  id: node.taskId,
                  nodeId: node.id,
                  ...(sectionMap?.viewMode === "completed"
                    ? {
                        journeyMode: "completed",
                        journeySlug: sectionMap.journey.slug,
                        returnSectionNumber: String(
                          sectionMap.section.unitNumber,
                        ),
                      }
                    : { mode: "review" }),
                },
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
      journeyAccessMode,
      resolvedJourneySlug,
      setChestNode,
      chestModalRef,
    ]
  );

  return guardedPress(handleNodePressInner);
}
