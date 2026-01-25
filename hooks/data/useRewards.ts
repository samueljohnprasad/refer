import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import {
  Reward,
  UserWallet,
  UserReward,
  REWARDS,
  COIN_RATES,
  getRewardById,
} from "@/src/types/rewards";

interface UseRewardsReturn {
  wallet: UserWallet;
  unlockedRewards: UserReward[];
  isLoading: boolean;
  earnCoins: (amount: number, reason: string) => Promise<boolean>;
  spendCoins: (amount: number, reason: string) => Promise<boolean>;
  purchaseReward: (
    rewardId: string,
  ) => Promise<{ success: boolean; error?: string }>;
  isRewardUnlocked: (rewardId: string) => boolean;
  getAvailableRewards: () => Reward[];
  refetch: () => Promise<void>;
}

interface WalletRow {
  user_id: string;
  coins: number;
  gems: number;
  total_coins_earned: number;
}

interface RewardRow {
  id: string;
  reward_id: string;
  unlocked_at: string;
  source: string;
}

/**
 * Hook for managing virtual currency and rewards
 */
export const useRewards = (): UseRewardsReturn => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<UserWallet>({ coins: 0, gems: 0 });
  const [unlockedRewards, setUnlockedRewards] = useState<UserReward[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch wallet and unlocked rewards
  const fetchData = useCallback(async (): Promise<void> => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch wallet
      const { data: walletData, error: walletError } = await supabase
        .from("user_wallet" as any)
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (walletError && walletError.code !== "PGRST116") {
        console.error("Error fetching wallet:", walletError);
      }

      if (walletData) {
        const w = walletData as unknown as WalletRow;
        setWallet({ coins: w.coins, gems: w.gems });
      } else {
        // Create wallet if doesn't exist
        await supabase.from("user_wallet" as any).insert({
          user_id: user.id,
          coins: 0,
          gems: 0,
          total_coins_earned: 0,
        });
        setWallet({ coins: 0, gems: 0 });
      }

      // Fetch unlocked rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from("user_rewards" as any)
        .select("*")
        .eq("user_id", user.id);

      if (rewardsError) {
        console.error("Error fetching rewards:", rewardsError);
      }

      if (rewardsData) {
        const mapped: UserReward[] = (
          rewardsData as unknown as RewardRow[]
        ).map((r) => ({
          id: r.id,
          rewardId: r.reward_id,
          unlockedAt: r.unlocked_at,
        }));
        setUnlockedRewards(mapped);
      }
    } catch (error) {
      console.error("Error in fetchData:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Earn coins
  const earnCoins = useCallback(
    async (amount: number, reason: string): Promise<boolean> => {
      if (!user?.id || amount <= 0) return false;

      try {
        const newBalance = wallet.coins + amount;

        // Update wallet
        const { error: walletError } = await supabase
          .from("user_wallet" as any)
          .upsert({
            user_id: user.id,
            coins: newBalance,
            gems: wallet.gems,
            total_coins_earned: newBalance,
          });

        if (walletError) throw walletError;

        // Log transaction
        await supabase.from("coin_transactions" as any).insert({
          user_id: user.id,
          amount: amount,
          reason: reason,
          balance_after: newBalance,
        });

        setWallet((prev) => ({ ...prev, coins: newBalance }));
        return true;
      } catch (error) {
        console.error("Error earning coins:", error);
        return false;
      }
    },
    [user?.id, wallet],
  );

  // Spend coins
  const spendCoins = useCallback(
    async (amount: number, reason: string): Promise<boolean> => {
      if (!user?.id || amount <= 0) return false;
      if (wallet.coins < amount) return false;

      try {
        const newBalance = wallet.coins - amount;

        // Update wallet
        const { error: walletError } = await supabase
          .from("user_wallet" as any)
          .update({ coins: newBalance })
          .eq("user_id", user.id);

        if (walletError) throw walletError;

        // Log transaction
        await supabase.from("coin_transactions" as any).insert({
          user_id: user.id,
          amount: -amount,
          reason: reason,
          balance_after: newBalance,
        });

        setWallet((prev) => ({ ...prev, coins: newBalance }));
        return true;
      } catch (error) {
        console.error("Error spending coins:", error);
        return false;
      }
    },
    [user?.id, wallet],
  );

  // Purchase a reward
  const purchaseReward = useCallback(
    async (rewardId: string): Promise<{ success: boolean; error?: string }> => {
      if (!user?.id) return { success: false, error: "Not logged in" };

      const reward = getRewardById(rewardId);
      if (!reward) return { success: false, error: "Reward not found" };

      // Check if already owned
      if (unlockedRewards.some((r) => r.rewardId === rewardId)) {
        return { success: false, error: "Already owned" };
      }

      // Check if enough coins
      if (wallet.coins < reward.cost) {
        return { success: false, error: "Not enough coins" };
      }

      try {
        // Deduct coins
        const spendSuccess = await spendCoins(
          reward.cost,
          `Purchased: ${reward.name}`,
        );
        if (!spendSuccess) {
          return { success: false, error: "Failed to deduct coins" };
        }

        // Add to user_rewards
        const { error: rewardError } = await supabase
          .from("user_rewards" as any)
          .insert({
            user_id: user.id,
            reward_id: rewardId,
            source: "purchase",
          });

        if (rewardError) {
          // Refund coins if reward insert fails
          await earnCoins(reward.cost, `Refund: ${reward.name}`);
          throw rewardError;
        }

        // Update local state
        const newReward: UserReward = {
          id: crypto.randomUUID(),
          rewardId: rewardId,
          unlockedAt: new Date().toISOString(),
        };
        setUnlockedRewards((prev) => [...prev, newReward]);

        return { success: true };
      } catch (error) {
        console.error("Error purchasing reward:", error);
        return { success: false, error: "Purchase failed" };
      }
    },
    [user?.id, wallet, unlockedRewards, spendCoins, earnCoins],
  );

  // Check if reward is unlocked
  const isRewardUnlocked = useCallback(
    (rewardId: string): boolean => {
      return unlockedRewards.some((r) => r.rewardId === rewardId);
    },
    [unlockedRewards],
  );

  // Get rewards not yet owned
  const getAvailableRewards = useCallback((): Reward[] => {
    const ownedIds = new Set(unlockedRewards.map((r) => r.rewardId));
    return REWARDS.filter((r) => !ownedIds.has(r.id));
  }, [unlockedRewards]);

  return {
    wallet,
    unlockedRewards,
    isLoading,
    earnCoins,
    spendCoins,
    purchaseReward,
    isRewardUnlocked,
    getAvailableRewards,
    refetch: fetchData,
  };
};

export { COIN_RATES };
