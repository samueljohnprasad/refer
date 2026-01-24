import { useMemo } from "react";
import { useXP } from "@/src/context/XPContext";
import {
  LevelTier,
  getLevelFromXP,
  getNextLevel,
  getProgressToNextLevel,
} from "@/src/types/levels";

interface UseUserLevelReturn {
  currentLevel: LevelTier;
  nextLevel: LevelTier | null;
  progress: number;
  currentXP: number;
  requiredXP: number;
  totalXP: number;
  isMaxLevel: boolean;
}

/**
 * Hook that computes user level from total XP
 * Provides current level, progress toward next level, and level-up detection
 */
export const useUserLevel = (): UseUserLevelReturn => {
  const { totalXP } = useXP();

  const levelData = useMemo(() => {
    const currentLevel = getLevelFromXP(totalXP);
    const nextLevel = getNextLevel(currentLevel);
    const progressData = getProgressToNextLevel(totalXP);

    return {
      currentLevel,
      nextLevel,
      progress: progressData.progress,
      currentXP: progressData.currentXP,
      requiredXP: progressData.requiredXP,
      totalXP,
      isMaxLevel: nextLevel === null,
    };
  }, [totalXP]);

  return levelData;
};
