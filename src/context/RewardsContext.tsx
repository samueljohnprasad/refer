import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { useRewards, COIN_RATES } from "@/hooks/data/useRewards";
import { UserWallet, Reward, REWARDS } from "@/src/types/rewards";

interface RewardsContextValue {
  wallet: UserWallet;
  isLoading: boolean;
  earnCoins: (amount: number, reason: string) => Promise<boolean>;
  earnCoinsForAction: (action: keyof typeof COIN_RATES) => Promise<boolean>;
  isRewardUnlocked: (rewardId: string) => boolean;
  getOwnedRewards: () => Reward[];
  refetch: () => Promise<void>;
}

const RewardsContext = createContext<RewardsContextValue | undefined>(
  undefined,
);

interface RewardsProviderProps {
  children: ReactNode;
}

/**
 * Provider for app-wide rewards/coin management
 */
export const RewardsProvider: React.FC<RewardsProviderProps> = ({
  children,
}) => {
  const {
    wallet,
    isLoading,
    earnCoins,
    isRewardUnlocked,
    unlockedRewards,
    refetch,
  } = useRewards();

  // Earn coins for a specific action type
  const earnCoinsForAction = useCallback(
    async (action: keyof typeof COIN_RATES): Promise<boolean> => {
      const amount = COIN_RATES[action];
      const reasonMap: Record<keyof typeof COIN_RATES, string> = {
        JOURNAL_ENTRY: "Journal Entry",
        VOICE_JOURNAL: "Voice Journal",
        IMAGE_JOURNAL: "Image Journal",
        MOOD_LOG: "Mood Logged",
        HABIT_COMPLETE: "Habit Completed",
        STREAK_DAILY: "Daily Streak Bonus",
        ACHIEVEMENT_TIER_1: "Achievement Unlocked",
        ACHIEVEMENT_TIER_2: "Achievement Unlocked",
        ACHIEVEMENT_TIER_3: "Achievement Unlocked",
        ACHIEVEMENT_TIER_4: "Achievement Unlocked",
      };

      return earnCoins(amount, reasonMap[action]);
    },
    [earnCoins],
  );

  // Get all owned rewards as Reward objects
  const getOwnedRewards = useCallback((): Reward[] => {
    const ownedIds = new Set(unlockedRewards.map((r) => r.rewardId));
    return REWARDS.filter((r) => ownedIds.has(r.id));
  }, [unlockedRewards]);

  const value: RewardsContextValue = {
    wallet,
    isLoading,
    earnCoins,
    earnCoinsForAction,
    isRewardUnlocked,
    getOwnedRewards,
    refetch,
  };

  return (
    <RewardsContext.Provider value={value}>{children}</RewardsContext.Provider>
  );
};

export const useRewardsContext = (): RewardsContextValue => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error("useRewardsContext must be used within a RewardsProvider");
  }
  return context;
};
