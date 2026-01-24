/**
 * Level System Types and Helpers
 * Defines user levels based on XP thresholds
 */

export interface LevelTier {
  level: number;
  name: string;
  icon: string;
  minXP: number;
  maxXP: number;
  color: string;
}

export const LEVEL_TIERS: LevelTier[] = [
  {
    level: 1,
    name: "Beginner",
    icon: "🌱",
    minXP: 0,
    maxXP: 100,
    color: "#86EFAC",
  },
  {
    level: 2,
    name: "Mindful",
    icon: "🧘",
    minXP: 101,
    maxXP: 500,
    color: "#93C5FD",
  },
  {
    level: 3,
    name: "Balanced",
    icon: "⚖️",
    minXP: 501,
    maxXP: 1500,
    color: "#C4B5FD",
  },
  {
    level: 4,
    name: "Enlightened",
    icon: "✨",
    minXP: 1501,
    maxXP: 3000,
    color: "#FDE047",
  },
  {
    level: 5,
    name: "Zen Master",
    icon: "🏆",
    minXP: 3001,
    maxXP: Infinity,
    color: "#F472B6",
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
