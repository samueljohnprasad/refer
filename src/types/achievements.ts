/**
 * Achievement System Types and Constants
 * Defines all achievement badges and their unlock conditions
 */

export type AchievementCategory =
  | "journaling"
  | "streaks"
  | "habits"
  | "wellness"
  | "tracking";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageAsset?: {
    unlocked: any;
  };
  category: AchievementCategory;
  xpBonus: number;
  condition: AchievementCondition;
  color: string; // Badge color
  tier: number; // 1-4 for badge styling
}

export interface AchievementCondition {
  type: AchievementConditionType;
  target: number;
}

export type AchievementConditionType =
  | "journal_count"
  | "streak_days"
  | "mood_variety"
  | "prompt_count"
  | "calorie_streak"
  | "habit_perfect_days"
  | "voice_journal_count";

export interface UserAchievement {
  id: string;
  achievementId: string;
  unlockedAt: string;
  xpAwarded: number;
}

// Badge colors by tier
export const BADGE_COLORS = {
  bronze: "#E8B87A",
  silver: "#C0C0C0",
  gold: "#FBBF24",
  platinum: "#E5E4E2",
  journaling: "#93C5FD", // Pastel blue
  streaks: "#FDA4AF", // Pastel rose
  habits: "#C4B5FD", // Pastel violet
  wellness: "#6EE7B7", // Pastel emerald
  tracking: "#FCD34D", // Pastel amber
};

export const ACHIEVEMENTS: Achievement[] = [
  // === JOURNALING (Blue) ===
  {
    id: "first_steps",
    name: "First Steps",
    description: "Complete your first journal entry",
    icon: "1",
    imageAsset: {
      unlocked: require("@/assets/achievements/first-reflection.png"),
    },
    category: "journaling",
    xpBonus: 50,
    condition: { type: "journal_count", target: 1 },
    color: BADGE_COLORS.journaling,
    tier: 1,
  },
  {
    id: "journal_5",
    name: "Getting Started",
    description: "Write 5 journal entries",
    icon: "5",
    category: "journaling",
    xpBonus: 75,
    condition: { type: "journal_count", target: 5 },
    color: BADGE_COLORS.journaling,
    tier: 1,
    imageAsset: {
      unlocked: require("@/assets/achievements/getting-started.png"),
    },
  },
  {
    id: "journal_10",
    name: "Journal Enthusiast",
    description: "Write 10 journal entries",
    icon: "10",
    category: "journaling",
    xpBonus: 100,
    condition: { type: "journal_count", target: 10 },
    color: "#60A5FA", // Lighter blue
    tier: 2,
  },
  {
    id: "journal_25",
    name: "Consistent Writer",
    description: "Write 25 journal entries",
    icon: "25",
    category: "journaling",
    xpBonus: 150,
    condition: { type: "journal_count", target: 25 },
    color: "#2563EB", // Darker blue
    tier: 3,
    imageAsset: {
      unlocked: require("@/assets/achievements/consistent-writer.png"),
    },
  },
  {
    id: "storyteller",
    name: "Storyteller",
    description: "Write 50 journal entries",
    icon: "50",
    category: "journaling",
    xpBonus: 250,
    condition: { type: "journal_count", target: 50 },
    color: "#1D4ED8", // Deep blue
    tier: 4,
    imageAsset: {
      unlocked: require("@/assets/achievements/story-teller.png"),
    },
  },
  {
    id: "voice_master",
    name: "Voice Master",
    description: "Record 20 voice journals",
    icon: "🎤",
    category: "journaling",
    xpBonus: 150,
    condition: { type: "voice_journal_count", target: 20 },
    color: "#6366F1", // Indigo
    tier: 3,
    imageAsset: {
      unlocked: require("@/assets/achievements/voice-master.png"),
    },
  },

  // === STREAKS (Red/Orange) ===
  {
    id: "streak_3",
    name: "Spark Started",
    description: "Maintain a 3-day streak",
    icon: "3",
    imageAsset: {
      unlocked: require("@/assets/achievements/three-streak.png"),
    },
    category: "streaks",
    xpBonus: 50,
    condition: { type: "streak_days", target: 3 },
    color: "#F97316", // Orange
    tier: 1,
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Maintain a 7-day streak",
    icon: "7",
    imageAsset: {
      unlocked: require("@/assets/achievements/seven-streak.png"),
    },
    category: "streaks",
    xpBonus: 100,
    condition: { type: "streak_days", target: 7 },
    color: BADGE_COLORS.streaks,
    tier: 2,
  },
  {
    id: "streak_14",
    name: "Two Week Champion",
    description: "Maintain a 14-day streak",
    icon: "14",
    category: "streaks",
    xpBonus: 150,
    condition: { type: "streak_days", target: 14 },
    color: "#DC2626", // Darker red
    tier: 3,
    imageAsset: {
      unlocked: require("@/assets/achievements/two-week-campion.png"),
    },
  },
  {
    id: "monthly_master",
    name: "Monthly Master",
    description: "Maintain a 30-day streak",
    icon: "30",
    category: "streaks",
    xpBonus: 300,
    condition: { type: "streak_days", target: 30 },
    color: "#B91C1C", // Deep red
    tier: 4,
    imageAsset: {
      unlocked: require("@/assets/achievements/month-master-streak.png"),
    },
  },

  // === HABITS (Purple) ===
  {
    id: "habit_starter",
    name: "Habit Starter",
    description: "Complete all habits for 1 day",
    icon: "1",
    category: "habits",
    xpBonus: 50,
    condition: { type: "habit_perfect_days", target: 1 },
    color: BADGE_COLORS.habits,
    tier: 1,
    imageAsset: {
      unlocked: require("@/assets/achievements/one-habit.png"),
    },
  },
  {
    id: "habit_hero",
    name: "Habit Hero",
    description: "Complete all habits for 5 days",
    icon: "5",
    category: "habits",
    xpBonus: 150,
    condition: { type: "habit_perfect_days", target: 5 },
    color: "#7C3AED", // Violet
    tier: 2,
    imageAsset: {
      unlocked: require("@/assets/achievements/five-habit.png"),
    },
  },
  {
    id: "habit_master",
    name: "Habit Master",
    description: "Complete all habits for 14 days",
    icon: "14",
    category: "habits",
    xpBonus: 250,
    condition: { type: "habit_perfect_days", target: 14 },
    color: "#6D28D9", // Dark purple
    tier: 3,
    imageAsset: {
      unlocked: require("@/assets/achievements/two-streak-habit.png"),
    },
  },

  // === WELLNESS (Green) ===
  {
    id: "mood_tracker",
    name: "Mood Tracker",
    description: "Log 5 different moods",
    icon: "5",
    category: "wellness",
    xpBonus: 50,
    condition: { type: "mood_variety", target: 5 },
    color: BADGE_COLORS.wellness,
    tier: 1,
    imageAsset: {
      unlocked: require("@/assets/achievements/mood-tracker.png"),
    },
  },
  {
    id: "emotion_explorer",
    name: "Emotion Explorer",
    description: "Log 10 different moods",
    icon: "10",
    category: "wellness",
    xpBonus: 75,
    condition: { type: "mood_variety", target: 10 },
    color: "#059669", // Darker green
    tier: 2,
    imageAsset: {
      unlocked: require("@/assets/achievements/emotion-explorer.png"),
    },
  },
  {
    id: "mindful_minutes",
    name: "Mindful Minutes",
    description: "Complete 10 wellness prompts",
    icon: "10",
    category: "wellness",
    xpBonus: 100,
    condition: { type: "prompt_count", target: 10 },
    color: "#047857", // Deep green
    tier: 3,
    imageAsset: {
      unlocked: require("@/assets/achievements/mindful-minutes.png"),
    },
  },

  // === TRACKING (Orange/Yellow) ===
  {
    id: "calorie_starter",
    name: "Nutrition Novice",
    description: "Track meals for 3 days",
    icon: "3",
    imageAsset: {
      unlocked: require("@/assets/achievements/calorie.png"),
    },
    category: "tracking",
    xpBonus: 50,
    condition: { type: "calorie_streak", target: 3 },
    color: BADGE_COLORS.tracking,
    tier: 1,
  },
  {
    id: "calorie_champion",
    name: "Calorie Champion",
    description: "Track meals for 7 days",
    icon: "7",
    imageAsset: {
      unlocked: require("@/assets/achievements/calorie-seven.png"),
    },
    category: "tracking",
    xpBonus: 100,
    condition: { type: "calorie_streak", target: 7 },
    color: "#D97706", // Amber
    tier: 2,
  },
];

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find((a) => a.id === id);
};

export const getAchievementsByCategory = (
  category: AchievementCategory,
): Achievement[] => {
  return ACHIEVEMENTS.filter((a) => a.category === category);
};

// Helper to get coin reward amount for achievement tier
export const getCoinRewardForAchievementTier = (tier: number): number => {
  const tierRewards = {
    1: 10, // Bronze tier
    2: 20, // Silver tier
    3: 35, // Gold tier
    4: 50, // Platinum tier
  };
  return tierRewards[tier as keyof typeof tierRewards] || 10;
};
