import { useState, useCallback, useRef, useEffect } from "react";
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
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const openSheet = useCallback((node: PathNodeData) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const isCompleted = node.status === NodeStatus.COMPLETED || node.status === NodeStatus.CLAIMED;
    
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
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSheetData(null);
      timerRef.current = null;
    }, 300);
  }, []);

  return {
    isOpen,
    sheetData,
    openSheet,
    closeSheet,
    setIsOpen,
  };
}

export default useCheckpointSheet;

