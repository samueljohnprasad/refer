/**
 * Level System Types and Helpers
 * Defines user levels based on XP thresholds
 */

export interface LevelTier {
  level: number;
  name: string;
  minXP: number;
  maxXP: number;
  color: string;
}

export const LEVEL_TIERS: LevelTier[] = [
  {
    level: 1,
    name: "Beginner",
    minXP: 0,
    maxXP: 100,
    color: "#16A34A",
  },
  {
    level: 2,
    name: "Mindful",
    minXP: 101,
    maxXP: 500,
    color: "#2563EB",
  },
  {
    level: 3,
    name: "Balanced",
    minXP: 501,
    maxXP: 1500,
    color: "#7C3AED",
  },
  {
    level: 4,
    name: "Enlightened",
    minXP: 1501,
    maxXP: 3000,
    color: "#CA8A04",
  },
  {
    level: 5,
    name: "Zen Master",
    minXP: 3001,
    maxXP: 5000,
    color: "#DB2777",
  },
  {
    level: 6,
    name: "Wisdom Seeker",
    minXP: 5001,
    maxXP: 8000,
    color: "#0891B2", // Cyan
  },
  {
    level: 7,
    name: "Inner Guide",
    minXP: 8001,
    maxXP: 12000,
    color: "#14B8A6", // Teal
  },
  {
    level: 8,
    name: "Peaceful Spirit",
    minXP: 12001,
    maxXP: 17000,
    color: "#059669", // Emerald
  },
  {
    level: 9,
    name: "Radiant Mind",
    minXP: 17001,
    maxXP: 25000,
    color: "#F59E0B", // Amber
  },
  {
    level: 10,
    name: "Eternal Calm",
    minXP: 25001,
    maxXP: Infinity,
    color: "#4F46E5", // Indigo
  },
];

/**
 * Get the current level tier based on total XP
 */
export const getLevelFromXP = (totalXP: number): LevelTier => {
  for (let i = LEVEL_TIERS.length - 1; i >= 0; i--) {
    if (totalXP >= LEVEL_TIERS[i].minXP) {
      return LEVEL_TIERS[i];
    }
  }
  return LEVEL_TIERS[0];
};

/**
 * Get the next level tier (or null if at max level)
 */
export const getNextLevel = (currentLevel: LevelTier): LevelTier | null => {
  const nextIndex =
    LEVEL_TIERS.findIndex((t) => t.level === currentLevel.level) + 1;
  return nextIndex < LEVEL_TIERS.length ? LEVEL_TIERS[nextIndex] : null;
};

/**
 * Calculate progress percentage toward next level
 */
export const getProgressToNextLevel = (
  totalXP: number,
): { progress: number; currentXP: number; requiredXP: number } => {
  const currentLevel = getLevelFromXP(totalXP);
  const nextLevel = getNextLevel(currentLevel);

  if (!nextLevel) {
    // Max level reached
    return { progress: 100, currentXP: totalXP, requiredXP: totalXP };
  }

  const xpInCurrentLevel = totalXP - currentLevel.minXP;
  const xpRequiredForNextLevel = nextLevel.minXP - currentLevel.minXP;
  const progress = Math.min(
    Math.round((xpInCurrentLevel / xpRequiredForNextLevel) * 100),
    100,
  );

  return {
    progress,
    currentXP: xpInCurrentLevel,
    requiredXP: xpRequiredForNextLevel,
  };
};
