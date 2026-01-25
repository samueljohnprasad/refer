/**
 * Virtual Rewards System Types and Constants
 * Defines coins, rewards, and milestone unlocks
 */

export type RewardType = "theme" | "avatar" | "prompt_pack" | "animation";

export type RewardCategory = "themes" | "avatars" | "prompts" | "animations";

export interface Reward {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  category: RewardCategory;
  cost: number;
  icon: string;
  color: string;
  preview?: string; // Preview image/color
}

export interface UserWallet {
  coins: number;
  gems: number;
}

export interface UserReward {
  id: string;
  rewardId: string;
  unlockedAt: string;
}

export interface MilestoneReward {
  id: string;
  name: string;
  description: string;
  rewardId: string;
  condition: MilestoneCondition;
  icon: string;
}

export interface MilestoneCondition {
  type: "streak_days" | "journal_count" | "habit_days" | "achievement_count";
  target: number;
}

// Coin earning rates
export const COIN_RATES = {
  JOURNAL_ENTRY: 5,
  VOICE_JOURNAL: 7,
  IMAGE_JOURNAL: 6,
  MOOD_LOG: 1,
  HABIT_COMPLETE: 1,
  STREAK_DAILY: 2,
  ACHIEVEMENT_TIER_1: 10,
  ACHIEVEMENT_TIER_2: 20,
  ACHIEVEMENT_TIER_3: 35,
  ACHIEVEMENT_TIER_4: 50,
};

// All purchasable rewards
export const REWARDS: Reward[] = [
  // === THEMES ===
  {
    id: "theme_dark",
    name: "Dark Mode",
    description: "Elegant dark theme for night journaling",
    type: "theme",
    category: "themes",
    cost: 100,
    icon: "🌙",
    color: "#1F2937",
    preview: "#1F2937",
  },
  {
    id: "theme_nature",
    name: "Nature Theme",
    description: "Calming greens inspired by forests",
    type: "theme",
    category: "themes",
    cost: 150,
    icon: "🌿",
    color: "#059669",
    preview: "#D1FAE5",
  },
  {
    id: "theme_ocean",
    name: "Ocean Theme",
    description: "Peaceful blues like the sea",
    type: "theme",
    category: "themes",
    cost: 200,
    icon: "🌊",
    color: "#0284C7",
    preview: "#E0F2FE",
  },
  {
    id: "theme_sunset",
    name: "Sunset Theme",
    description: "Warm gradients for cozy vibes",
    type: "theme",
    category: "themes",
    cost: 250,
    icon: "🌅",
    color: "#EA580C",
    preview: "#FED7AA",
  },
  {
    id: "theme_lavender",
    name: "Lavender Dreams",
    description: "Soft purple for relaxation",
    type: "theme",
    category: "themes",
    cost: 200,
    icon: "💜",
    color: "#7C3AED",
    preview: "#EDE9FE",
  },

  // === AVATARS ===
  {
    id: "avatar_calm",
    name: "Calm Companion",
    description: "A peaceful meditation avatar",
    type: "avatar",
    category: "avatars",
    cost: 75,
    icon: "🧘",
    color: "#10B981",
  },
  {
    id: "avatar_mindful",
    name: "Mindful Owl",
    description: "Wise and thoughtful companion",
    type: "avatar",
    category: "avatars",
    cost: 100,
    icon: "🦉",
    color: "#8B5CF6",
  },
  {
    id: "avatar_sunny",
    name: "Sunny Spirit",
    description: "Bright and cheerful energy",
    type: "avatar",
    category: "avatars",
    cost: 100,
    icon: "☀️",
    color: "#F59E0B",
  },
  {
    id: "avatar_zen",
    name: "Zen Master",
    description: "Achieved inner peace",
    type: "avatar",
    category: "avatars",
    cost: 150,
    icon: "🏔️",
    color: "#6366F1",
  },
  {
    id: "avatar_golden",
    name: "Golden Writer",
    description: "For dedicated journalers",
    type: "avatar",
    category: "avatars",
    cost: 300,
    icon: "✨",
    color: "#EAB308",
  },

  // === PROMPT PACKS ===
  {
    id: "prompts_motivation",
    name: "Motivation Pack",
    description: "20 inspiring prompts for tough days",
    type: "prompt_pack",
    category: "prompts",
    cost: 200,
    icon: "💪",
    color: "#EF4444",
  },
  {
    id: "prompts_gratitude",
    name: "Gratitude Pack",
    description: "25 prompts for thankfulness",
    type: "prompt_pack",
    category: "prompts",
    cost: 175,
    icon: "🙏",
    color: "#10B981",
  },
  {
    id: "prompts_creativity",
    name: "Creative Spark",
    description: "30 unique creative writing prompts",
    type: "prompt_pack",
    category: "prompts",
    cost: 250,
    icon: "🎨",
    color: "#8B5CF6",
  },
  {
    id: "prompts_reflection",
    name: "Deep Reflection",
    description: "15 profound self-discovery prompts",
    type: "prompt_pack",
    category: "prompts",
    cost: 300,
    icon: "🔮",
    color: "#0EA5E9",
  },

  // === ANIMATIONS ===
  {
    id: "anim_confetti",
    name: "Confetti Burst",
    description: "Celebrate with colorful confetti",
    type: "animation",
    category: "animations",
    cost: 150,
    icon: "🎊",
    color: "#F59E0B",
  },
  {
    id: "anim_stars",
    name: "Starfall",
    description: "Beautiful falling stars effect",
    type: "animation",
    category: "animations",
    cost: 175,
    icon: "⭐",
    color: "#EAB308",
  },
  {
    id: "anim_hearts",
    name: "Floating Hearts",
    description: "Lovely hearts animation",
    type: "animation",
    category: "animations",
    cost: 125,
    icon: "💕",
    color: "#EC4899",
  },
  {
    id: "anim_fireworks",
    name: "Fireworks",
    description: "Spectacular celebration effect",
    type: "animation",
    category: "animations",
    cost: 250,
    icon: "🎆",
    color: "#6366F1",
  },
];

// Milestone auto-unlock rewards
export const MILESTONES: MilestoneReward[] = [
  {
    id: "milestone_7_streak",
    name: "Week Warrior Reward",
    description: "7-day streak unlocks Calm Theme",
    rewardId: "theme_nature",
    condition: { type: "streak_days", target: 7 },
    icon: "🔥",
  },
  {
    id: "milestone_14_streak",
    name: "Two Week Champion",
    description: "14-day streak unlocks Ocean Avatar",
    rewardId: "avatar_zen",
    condition: { type: "streak_days", target: 14 },
    icon: "🏆",
  },
  {
    id: "milestone_30_streak",
    name: "Monthly Master",
    description: "30-day streak unlocks Sunset Theme",
    rewardId: "theme_sunset",
    condition: { type: "streak_days", target: 30 },
    icon: "👑",
  },
  {
    id: "milestone_50_journals",
    name: "Golden Writer",
    description: "50 journals unlock Golden Writer Avatar",
    rewardId: "avatar_golden",
    condition: { type: "journal_count", target: 50 },
    icon: "✨",
  },
];

// Helper functions
export const getRewardById = (id: string): Reward | undefined => {
  return REWARDS.find((r) => r.id === id);
};

export const getRewardsByCategory = (category: RewardCategory): Reward[] => {
  return REWARDS.filter((r) => r.category === category);
};

export const getCoinRewardForAchievementTier = (tier: number): number => {
  switch (tier) {
    case 1:
      return COIN_RATES.ACHIEVEMENT_TIER_1;
    case 2:
      return COIN_RATES.ACHIEVEMENT_TIER_2;
    case 3:
      return COIN_RATES.ACHIEVEMENT_TIER_3;
    case 4:
      return COIN_RATES.ACHIEVEMENT_TIER_4;
    default:
      return COIN_RATES.ACHIEVEMENT_TIER_1;
  }
};
