import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import { useXP } from "@/src/context/XPContext";
import { useRewardsContext } from "@/src/context/RewardsContext";
import {
  Challenge,
  ChallengeType,
  UserChallengeProgress,
  ActiveChallenge,
  getDailyChallengesForDate,
  getWeeklyChallengesForWeek,
  getDayStart,
  getWeekStart,
  getChallengeById,
} from "@/src/types/challenges";
import { XPActionType } from "@/src/types/xp";

interface UseChallengesReturn {
  dailyChallenges: ActiveChallenge[];
  weeklyChallenges: ActiveChallenge[];
  isLoading: boolean;
  updateProgress: (conditionType: string, increment?: number) => Promise<void>;
  refetch: () => Promise<void>;
}

interface ProgressRow {
  id: string;
  challenge_id: string;
  challenge_type: string;
  progress: number;
  target: number;
  completed: boolean;
  completed_at: string | null;
  period_start: string;
}

/**
 * Hook for managing daily and weekly challenges
 */
export const useChallenges = (): UseChallengesReturn => {
  const { user } = useAuth();
  const { awardXP } = useXP();
  const { earnCoins } = useRewardsContext();

  const [progressMap, setProgressMap] = useState<
    Map<string, UserChallengeProgress>
  >(new Map());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const today = useMemo(() => getDayStart(new Date()), []);
  const weekStart = useMemo(() => getWeekStart(new Date()), []);

  // Get today's daily challenges
  const todaysDailyChallenges = useMemo((): Challenge[] => {
    if (!user?.id) return [];
    return getDailyChallengesForDate(user.id, today, 3);
  }, [user?.id, today]);

  // Get this week's weekly challenges
  const thisWeeksWeeklyChallenges = useMemo((): Challenge[] => {
    if (!user?.id) return [];
    return getWeeklyChallengesForWeek(user.id, today, 2);
  }, [user?.id, today]);

  // Fetch progress from Supabase
  const fetchProgress = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      const todayStr = today.toISOString().split("T")[0];
      const weekStr = weekStart.toISOString().split("T")[0];

      // Fetch daily progress for today
      const { data: dailyData, error: dailyError } = await supabase
        .from("user_challenge_progress" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("challenge_type", "daily")
        .eq("period_start", todayStr);

      if (dailyError)
        console.error("Error fetching daily progress:", dailyError);

      // Fetch weekly progress for this week
      const { data: weeklyData, error: weeklyError } = await supabase
        .from("user_challenge_progress" as any)
        .select("*")
        .eq("user_id", user.id)
        .eq("challenge_type", "weekly")
        .eq("period_start", weekStr);

      if (weeklyError)
        console.error("Error fetching weekly progress:", weeklyError);

      const newMap = new Map<string, UserChallengeProgress>();

      const processRows = (rows: ProgressRow[] | null): void => {
        if (!rows) return;
        rows.forEach((row) => {
          newMap.set(row.challenge_id, {
            id: row.id,
            challengeId: row.challenge_id,
            challengeType: row.challenge_type as ChallengeType,
            progress: row.progress,
            target: row.target,
            completed: row.completed,
            completedAt: row.completed_at || undefined,
            periodStart: row.period_start,
          });
        });
      };

      processRows(dailyData as unknown as ProgressRow[]);
      processRows(weeklyData as unknown as ProgressRow[]);

      setProgressMap(newMap);

      // Initialize any missing challenges
      const dailyChallenges = getDailyChallengesForDate(user.id, today, 3);
      const weeklyChallenges = getWeeklyChallengesForWeek(user.id, today, 2);

      for (const challenge of dailyChallenges) {
        if (!newMap.has(challenge.id)) {
          await supabase.from("user_challenge_progress" as any).upsert(
            {
              user_id: user.id,
              challenge_id: challenge.id,
              challenge_type: "daily",
              progress: 0,
              target: challenge.condition.target,
              completed: false,
              period_start: todayStr,
            },
            { onConflict: "user_id,challenge_id,period_start" },
          );
        }
      }

      for (const challenge of weeklyChallenges) {
        if (!newMap.has(challenge.id)) {
          await supabase.from("user_challenge_progress" as any).upsert(
            {
              user_id: user.id,
              challenge_id: challenge.id,
              challenge_type: "weekly",
              progress: 0,
              target: challenge.condition.target,
              completed: false,
              period_start: weekStr,
            },
            { onConflict: "user_id,challenge_id,period_start" },
          );
        }
      }
    } catch (error) {
      console.error("Error in fetchProgress:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, today, weekStart]);

  // Update progress for challenges matching a condition type
  const updateProgress = useCallback(
    async (conditionType: string, increment: number = 1): Promise<void> => {
      if (!user?.id) return;

      // Find all active challenges that match this condition type
      const allChallenges = [
        ...todaysDailyChallenges,
        ...thisWeeksWeeklyChallenges,
      ];
      const matchingChallenges = allChallenges.filter(
        (c) => c.condition.type === conditionType,
      );

      for (const challenge of matchingChallenges) {
        const existing = progressMap.get(challenge.id);
        if (!existing || existing.completed) continue;

        const newProgress = Math.min(
          existing.progress + increment,
          challenge.condition.target,
        );
        const isNowComplete = newProgress >= challenge.condition.target;

        // Update in database
        const periodStart =
          challenge.type === "daily"
            ? today.toISOString().split("T")[0]
            : weekStart.toISOString().split("T")[0];

        const { error } = await supabase
          .from("user_challenge_progress" as any)
          .update({
            progress: newProgress,
            completed: isNowComplete,
            completed_at: isNowComplete ? new Date().toISOString() : null,
          })
          .eq("user_id", user.id)
          .eq("challenge_id", challenge.id)
          .eq("period_start", periodStart);

        if (error) {
          console.error("Error updating challenge progress:", error);
          continue;
        }

        // Update local state
        setProgressMap((prev) => {
          const updated = new Map(prev);
          updated.set(challenge.id, {
            ...existing,
            progress: newProgress,
            completed: isNowComplete,
            completedAt: isNowComplete ? new Date().toISOString() : undefined,
          });
          return updated;
        });

        // Award rewards if completed
        if (isNowComplete) {
          await awardXP(XPActionType.WELLNESS_PROMPT, {
            customAmount: challenge.reward.xp,
            customDescription: `Challenge: ${challenge.title}`,
          });
          await earnCoins(
            challenge.reward.coins,
            `Challenge: ${challenge.title}`,
          );
        }
      }
    },
    [
      user?.id,
      todaysDailyChallenges,
      thisWeeksWeeklyChallenges,
      progressMap,
      today,
      weekStart,
      awardXP,
      earnCoins,
    ],
  );

  // Combine challenges with progress
  const dailyChallenges: ActiveChallenge[] = useMemo(() => {
    return todaysDailyChallenges.map((challenge) => {
      const progress = progressMap.get(challenge.id);
      return {
        ...challenge,
        progress: progress?.progress ?? 0,
        completed: progress?.completed ?? false,
        completedAt: progress?.completedAt,
      };
    });
  }, [todaysDailyChallenges, progressMap]);

  const weeklyChallenges: ActiveChallenge[] = useMemo(() => {
    return thisWeeksWeeklyChallenges.map((challenge) => {
      const progress = progressMap.get(challenge.id);
      return {
        ...challenge,
        progress: progress?.progress ?? 0,
        completed: progress?.completed ?? false,
        completedAt: progress?.completedAt,
      };
    });
  }, [thisWeeksWeeklyChallenges, progressMap]);

  // Initial fetch only
  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return {
    dailyChallenges,
    weeklyChallenges,
    isLoading,
    updateProgress,
    refetch: fetchProgress,
  };
};
