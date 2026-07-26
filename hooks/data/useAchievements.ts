import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { useXP } from "@/src/context/XPContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Achievement,
  UserAchievement,
  ACHIEVEMENTS,
  AchievementConditionType,
  getCoinRewardForAchievementTier,
} from "@/src/types/achievements";
import { XPActionType } from "@/src/types/xp";
import { useRewardsContext } from "@/src/context/RewardsContext";
import { useUserStats } from "./useUserStats";

interface AchievementProgress {
  achievement: Achievement;
  isUnlocked: boolean;
  unlockedAt?: string;
  currentProgress: number;
  progressPercent: number;
}

interface UseAchievementsReturn {
  achievements: AchievementProgress[];
  unlockedAchievements: UserAchievement[];
  isLoading: boolean;
  checkAndUnlockAchievements: (stats: UserStats) => Promise<Achievement[]>;
  getAchievementProgress: (
    achievementId: string,
  ) => AchievementProgress | undefined;
  refetch: () => Promise<void>;
}

export interface UserStats {
  journalCount: number;
  streakDays: number;
  moodVariety: number;
  promptCount: number;
  calorieStreakDays: number;
  habitPerfectDays: number;
  voiceJournalCount: number;
}

/**
 * Hook for managing achievement badges
 * Tracks unlocked achievements and checks unlock conditions
 */
export const useAchievements = (): UseAchievementsReturn => {
  const { user } = useAuth();
  const { awardXP } = useXP();
  const { stats: userStats, isLoading: statsLoading } = useUserStats();
  const queryClient = useQueryClient();
  
  const [currentStats, setCurrentStats] = useState<UserStats>({
    journalCount: 0,
    streakDays: 0,
    moodVariety: 0,
    promptCount: 0,
    calorieStreakDays: 0,
    habitPerfectDays: 0,
    voiceJournalCount: 0,
  });
  const { earnCoins } = useRewardsContext();

  const {
    data: unlockedAchievements = [],
    isLoading: isUnlockedLoading,
    refetch: refetchUnlockedAchievements,
  } = useQuery({
    queryKey: ["unlocked_achievements", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("user_achievements" as any)
        .select("*")
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: false });

      if (error) throw error;

      interface AchievementRow {
        id: string;
        achievement_id: string;
        unlocked_at: string;
        xp_awarded: number;
      }

      return ((data || []) as unknown as AchievementRow[]).map((row) => ({
        id: row.id,
        achievementId: row.achievement_id,
        unlockedAt: row.unlocked_at,
        xpAwarded: row.xp_awarded,
      }));
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Auto-sync stats from useUserStats and check for new achievements
  useEffect(() => {
    if (!statsLoading && userStats) {
      setCurrentStats(userStats);
      // Only check achievements if we have fetched unlocked achievements
      if (!isUnlockedLoading) {
        checkAndUnlockAchievements(userStats);
      }
    }
  }, [userStats, statsLoading, isUnlockedLoading]);

  // Get progress value for a condition type
  const getProgressForCondition = useCallback(
    (type: AchievementConditionType, stats: UserStats): number => {
      switch (type) {
        case "journal_count":
          return stats.journalCount;
        case "streak_days":
          return stats.streakDays;
        case "mood_variety":
          return stats.moodVariety;
        case "prompt_count":
          return stats.promptCount;
        case "calorie_streak":
          return stats.calorieStreakDays;
        case "habit_perfect_days":
          return stats.habitPerfectDays;
        case "voice_journal_count":
          return stats.voiceJournalCount;
        default:
          return 0;
      }
    },
    [],
  );

  // Unlock an achievement
  const unlockAchievement = useCallback(
    async (achievement: Achievement): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        // Cast to any until migration is run and types are regenerated
        const { error } = await supabase
          .from("user_achievements" as any)
          .insert({
            user_id: user.id,
            achievement_id: achievement.id,
            xp_awarded: achievement.xpBonus,
          });

        if (error) {
          // May already be unlocked (unique constraint)
          if (error.code === "23505") return false;
          throw error;
        }

        // Award bonus XP
        await awardXP(XPActionType.WELLNESS_PROMPT, {
          customAmount: achievement.xpBonus,
          customDescription: `Achievement: ${achievement.name}`,
        });

        // Award bonus coins based on achievement tier
        const coinReward = getCoinRewardForAchievementTier(achievement.tier);
        await earnCoins(coinReward, `Achievement: ${achievement.name}`);

        // Update local state in React Query cache
        const newUnlock: UserAchievement = {
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          achievementId: achievement.id,
          unlockedAt: new Date().toISOString(),
          xpAwarded: achievement.xpBonus,
        };

        queryClient.setQueryData<UserAchievement[]>(
          ["unlocked_achievements", user.id],
          (old = []) => [newUnlock, ...old]
        );

        return true;
      } catch (error) {
        console.error("Error unlocking achievement:", error);
        return false;
      }
    },
    [user?.id, awardXP, queryClient, earnCoins],
  );

  // Check and unlock achievements based on current stats
  const checkAndUnlockAchievements = useCallback(
    async (stats: UserStats): Promise<Achievement[]> => {
      setCurrentStats(stats);
      const newlyUnlocked: Achievement[] = [];
      const unlockedIds = new Set(
        unlockedAchievements.map((a) => a.achievementId),
      );

      for (const achievement of ACHIEVEMENTS) {
        if (unlockedIds.has(achievement.id)) continue;

        const progress = getProgressForCondition(
          achievement.condition.type,
          stats,
        );
        if (progress >= achievement.condition.target) {
          const success = await unlockAchievement(achievement);
          if (success) {
            newlyUnlocked.push(achievement);
          }
        }
      }

      return newlyUnlocked;
    },
    [unlockedAchievements, getProgressForCondition, unlockAchievement],
  );

  // Compute achievement progress list
  const achievements = useMemo((): AchievementProgress[] => {
    const unlockedMap = new Map(
      unlockedAchievements.map((u) => [u.achievementId, u]),
    );

    return ACHIEVEMENTS.map((achievement) => {
      const unlocked = unlockedMap.get(achievement.id);
      const progress = getProgressForCondition(
        achievement.condition.type,
        currentStats,
      );
      const progressPercent = Math.min(
        Math.round((progress / achievement.condition.target) * 100),
        100,
      );

      return {
        achievement,
        isUnlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
        currentProgress: progress,
        progressPercent,
      };
    });
  }, [unlockedAchievements, currentStats, getProgressForCondition]);

  const getAchievementProgress = useCallback(
    (achievementId: string): AchievementProgress | undefined => {
      return achievements.find((a) => a.achievement.id === achievementId);
    },
    [achievements],
  );

  return {
    achievements,
    unlockedAchievements,
    isLoading: isUnlockedLoading || statsLoading,
    checkAndUnlockAchievements,
    getAchievementProgress,
    refetch: async () => {
      await refetchUnlockedAchievements();
    },
  };
};
