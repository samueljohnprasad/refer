export interface StreakResult {
  newStreak: number;
  shouldUpdate: boolean;
  longestStreak: number;
}

export const getNextMilestone = (currentStreak: number): number => {
  const milestones = [3, 7, 14, 30, 45, 60, 75, 90, 180, 365];

  for (const milestone of milestones) {
    if (currentStreak < milestone) {
      return milestone;
    }
  }

  return Math.ceil((currentStreak + 1) / 100) * 100;
};
