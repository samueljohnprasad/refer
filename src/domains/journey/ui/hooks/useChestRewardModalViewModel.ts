import { useCallback, useMemo } from "react";
import type { PathNodeData } from "@/src/types/journey/node";
import { NodeStatus } from "@/src/types/journey/enums";

export interface ChestRewardModalProps {
  node: PathNodeData;
  onClaim: (nodeId: string) => void;
}

export function useChestRewardModalViewModel({
  node,
  onClaim,
}: ChestRewardModalProps) {
  const snapPoints = useMemo(() => ["40%"], []);

  const handleClaim = useCallback(() => {
    onClaim(node.id);
  }, [node.id, onClaim]);

  const isLocked = node.status === NodeStatus.LOCKED;

  return {
    snapPoints,
    handleClaim,
    isLocked,
    node,
  };
}
