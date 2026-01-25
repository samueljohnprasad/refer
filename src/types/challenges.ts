/**
 * Daily & Weekly Challenges System
 * Types, constants, and challenge definitions
 */

export type ChallengeType = "daily" | "weekly";

export type ChallengeCategory =
  | "journaling"
  | "mood"
  | "habits"
  | "wellness"
  | "tracking";

export interface ChallengeCondition {
  type:
    | "mood_count"
    | "journal_count"
    | "habit_count"
    | "meal_count"
    | "prompt_count"
    | "voice_journal"
    | "image_journal"
    | "streak_days"
    | "perfect_habit_days";
  target: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  category: ChallengeCategory;
  condition: ChallengeCondition;
  reward: {
    xp: number;
    coins: number;
  };
  icon: string;
}

export interface UserChallengeProgress {
  id: string;
  challengeId: string;
  challengeType: ChallengeType;
  progress: number;
  target: number;
  completed: boolean;
  completedAt?: string;
  periodStart: string;
}

export interface ActiveChallenge extends Challenge {
  progress: number;
  completed: boolean;
  completedAt?: string;
}

// ============ DAILY CHALLENGES ============
export const DAILY_CHALLENGES: Challenge[] = [
  {
    id: "daily_mood_3",
    title: "Mood Explorer",
    description: "Log 3 emotions today",
    type: "daily",
    category: "mood",
    condition: { type: "mood_count", target: 3 },
    reward: { xp: 15, coins: 3 },
    icon: "😊",
  },
  {
    id: "daily_journal_1",
    title: "Daily Reflection",
    description: "Write a journal entry",
    type: "daily",
    category: "journaling",
    condition: { type: "journal_count", target: 1 },
    reward: { xp: 20, coins: 5 },
    icon: "📝",
  },
  {
    id: "daily_habits_5",
    title: "Habit Champion",
    description: "Complete 5 habits today",
    type: "daily",
    category: "habits",
    condition: { type: "habit_count", target: 5 },
    reward: { xp: 25, coins: 5 },
    icon: "✅",
  },
  {
    id: "daily_meals_3",
    title: "Nutrition Tracker",
    description: "Track all 3 meals",
    type: "daily",
    category: "tracking",
    condition: { type: "meal_count", target: 3 },
    reward: { xp: 20, coins: 4 },
    icon: "🍎",
  },
  {
    id: "daily_prompt_1",
    title: "Mindful Moment",
    description: "Use a wellness prompt",
    type: "daily",
    category: "wellness",
    condition: { type: "prompt_count", target: 1 },
    reward: { xp: 15, coins: 3 },
    icon: "🧘",
  },
  {
    id: "daily_voice_1",
    title: "Voice Your Thoughts",
    description: "Record a voice journal",
    type: "daily",
    category: "journaling",
    condition: { type: "voice_journal", target: 1 },
    reward: { xp: 25, coins: 6 },
    icon: "🎙️",
  },
  {
    id: "daily_habits_morning",
    title: "Morning Routine",
    description: "Complete 3 habits before noon",
    type: "daily",
    category: "habits",
    condition: { type: "habit_count", target: 3 },
    reward: { xp: 20, coins: 4 },
    icon: "☀️",
  },
  {
    id: "daily_mood_evening",
    title: "Evening Check-in",
    description: "Log your evening mood",
    type: "daily",
    category: "mood",
    condition: { type: "mood_count", target: 1 },
    reward: { xp: 10, coins: 2 },
    icon: "🌙",
  },
];

// ============ WEEKLY CHALLENGES ============
export const WEEKLY_CHALLENGES: Challenge[] = [
  {
    id: "weekly_journal_7",
    title: "Journaling Streak",
    description: "Write a journal entry every day this week",
    type: "weekly",
    category: "journaling",
    condition: { type: "journal_count", target: 7 },
    reward: { xp: 100, coins: 25 },
    icon: "📚",
  },
  {
    id: "weekly_prompts_3",
    title: "Prompt Explorer",
    description: "Try 3 different wellness prompts",
    type: "weekly",
    category: "wellness",
    condition: { type: "prompt_count", target: 3 },
    reward: { xp: 50, coins: 15 },
    icon: "💡",
  },
  {
    id: "weekly_photo_1",
    title: "Picture Perfect",
    description: "Complete a photo journal entry",
    type: "weekly",
    category: "journaling",
    condition: { type: "image_journal", target: 1 },
    reward: { xp: 40, coins: 10 },
    icon: "📷",
  },
  {
    id: "weekly_meals_21",
    title: "Nutrition Master",
    description: "Track 21 meals this week",
    type: "weekly",
    category: "tracking",
    condition: { type: "meal_count", target: 21 },
    reward: { xp: 75, coins: 20 },
    icon: "🥗",
  },
  {
    id: "weekly_streak_7",
    title: "Week Warrior",
    description: "Maintain a 7-day journaling streak",
    type: "weekly",
    category: "journaling",
    condition: { type: "streak_days", target: 7 },
    reward: { xp: 100, coins: 30 },
    icon: "🔥",
  },
  {
    id: "weekly_perfect_5",
    title: "Habit Hero",
    description: "Complete all daily habits for 5 days",
    type: "weekly",
    category: "habits",
    condition: { type: "perfect_habit_days", target: 5 },
    reward: { xp: 80, coins: 20 },
    icon: "🏆",
  },
];

// ============ HELPER FUNCTIONS ============

/**
 * Get deterministic daily challenges for a user on a given date
 * Uses user ID + date as seed to ensure same challenges for same day
 */
export const getDailyChallengesForDate = (
  userId: string,
  date: Date,
  count: number = 3,
): Challenge[] => {
  const dateStr = date.toISOString().split("T")[0];
  const seed = hashCode(`${userId}-${dateStr}-daily`);
  const shuffled = shuffleWithSeed([...DAILY_CHALLENGES], seed);
  return shuffled.slice(0, count);
};

/**
 * Get deterministic weekly challenges for a user in a given week
 * Uses user ID + week number as seed
 */
export const getWeeklyChallengesForWeek = (
  userId: string,
  date: Date,
  count: number = 2,
): Challenge[] => {
  const weekStart = getWeekStart(date);
  const weekStr = weekStart.toISOString().split("T")[0];
  const seed = hashCode(`${userId}-${weekStr}-weekly`);
  const shuffled = shuffleWithSeed([...WEEKLY_CHALLENGES], seed);
  return shuffled.slice(0, count);
};

/**
 * Get the start of the current week (Monday)
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Get the start of the current day (midnight)
 */
export const getDayStart = (date: Date): Date => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * Simple hash function for deterministic randomness
 */
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

/**
 * Shuffle array with a seed for deterministic results
 */
const shuffleWithSeed = <T>(array: T[], seed: number): T[] => {
  const result = [...array];
  let currentSeed = seed;

  const random = (): number => {
    currentSeed = (currentSeed * 9301 + 49297) % 233280;
    return currentSeed / 233280;
  };

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

export const getChallengeById = (id: string): Challenge | undefined => {
  return (
    DAILY_CHALLENGES.find((c) => c.id === id) ||
    WEEKLY_CHALLENGES.find((c) => c.id === id)
  );
};
