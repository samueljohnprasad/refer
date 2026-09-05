import { useState, useCallback } from "react";
import { NodeStatus, type PathNodeData } from "@/src/types/journey";

export type CheckpointActionSheetData = {
  node: PathNodeData;
  isCompleted: boolean;
  questionCount: number;
  durationMin: number;
};

export function useCheckpointSheet() {
  const [isOpen, setIsOpen] = useState(false);
  const [sheetData, setSheetData] = useState<CheckpointActionSheetData | null>(null);

  const openSheet = useCallback((node: PathNodeData) => {
    // ponytail: simple extraction
    const isCompleted = node.status === NodeStatus.COMPLETED || node.status === NodeStatus.COMPLETED;
    
    // In a real app we'd parse node.task, but fallback to sensible defaults
    const questionCount = 5; 
    const durationMin = 3;

    setSheetData({
      node,
      isCompleted,
      questionCount,
      durationMin,
    });
    setIsOpen(true);
  }, []);

  const closeSheet = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => setSheetData(null), 300); // clear after animation
  }, []);

  return {
    isOpen,
    sheetData,
    openSheet,
    closeSheet,
    setIsOpen,
  };
}
