import dayjs from "dayjs";

export interface StreakResult {
  newStreak: number;
  shouldUpdate: boolean;
  longestStreak: number;
}

/**
 * Get today's date in YYYY-MM-DD format using device timezone
 */
export const getTodayDate = (): string => {
  return dayjs().format("YYYY-MM-DD");
};

/**
 * Calculate the number of days between two dates
 */
const getDaysDifference = (date1: string, date2: string): number => {
  const d1 = dayjs(date1);
  const d2 = dayjs(date2);
  return Math.abs(d2.diff(d1, 'day'));
};

/**
 * Core streak calculation logic
 *
 * @param lastJournalDate - Last date user journaled (YYYY-MM-DD)
 * @param currentStreak - Current streak count
 * @param longestStreak - Longest streak ever achieved
 * @param todayDate - Today's date (YYYY-MM-DD)
 * @returns StreakResult with new streak values and update flag
 */
export const calculateStreak = (
  lastJournalDate: string | null,
  currentStreak: number,
  longestStreak: number,
  todayDate: string = getTodayDate()
): StreakResult => {
  // Case 1: First time journaling ever
  if (!lastJournalDate) {
    return {
      newStreak: 1,
      shouldUpdate: true,
      longestStreak: Math.max(1, longestStreak),
    };
  }

  // Case 2: Already journaled today - no update needed
  if (lastJournalDate === todayDate) {
    return {
      newStreak: currentStreak,
      shouldUpdate: false,
      longestStreak,
    };
  }

  // Case 3: Calculate days since last journal
  const daysDiff = getDaysDifference(lastJournalDate, todayDate);

  if (daysDiff === 1) {
    // Consecutive day - increment streak
    const newStreak = currentStreak + 1;
    return {
      newStreak,
      shouldUpdate: true,
      longestStreak: Math.max(newStreak, longestStreak),
    };
  } else if (daysDiff > 1) {
    // Missed days - reset streak to 1
    return {
      newStreak: 1,
      shouldUpdate: true,
      longestStreak, // Keep longest streak unchanged
    };
  }

  // Edge case: future date (shouldn't happen)
  return {
    newStreak: currentStreak,
    shouldUpdate: false,
    longestStreak,
  };
};

/**
 * Check if streak is broken (for app launch checks)
 * Returns true if user missed journaling yesterday
 */
export const isStreakBroken = (
  lastJournalDate: string | null,
  currentStreak: number
): boolean => {
  if (!lastJournalDate || currentStreak === 0) {
    return false; // No active streak to break
  }

  const todayDate = getTodayDate();
  const daysDiff = getDaysDifference(lastJournalDate, todayDate);

  // Streak is broken if more than 1 day has passed
  return daysDiff > 1;
};

/**
 * Check if user should be reminded about their streak
 * Returns true if user hasn't journaled today and has an active streak
 */
export const shouldRemindAboutStreak = (
  lastJournalDate: string | null,
  currentStreak: number
): boolean => {
  if (!lastJournalDate || currentStreak === 0) {
    return false; // No streak to remind about
  }

  const todayDate = getTodayDate();

  // Remind if user hasn't journaled today and has an active streak
  return lastJournalDate !== todayDate && currentStreak > 0;
};

/**
 * Calculate next milestone for streak progress
 */
export const getNextMilestone = (currentStreak: number): number => {
  const milestones = [3, 7, 14, 30, 45, 60, 75, 90, 180, 365];

  for (const milestone of milestones) {
    if (currentStreak < milestone) {
      return milestone;
    }
  }

  // If past all milestones, next is +100
  return Math.ceil((currentStreak + 1) / 100) * 100;
};
