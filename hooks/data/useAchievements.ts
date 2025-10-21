import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: "streak" | "entries" | "consistency" | "special";
  requirement_type: string;
  requirement_value: number;
  badge_color: string;
  created_at: string;
}

export interface UserAchievement {
  id: number;
  user_id: string;
  achievement_id: number;
  unlocked_at: string;
  progress: number;
  is_claimed: boolean;
  achievement: Achievement;
}

/**
 * Hook to fetch user's achievements
 */
export const useUserAchievements = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userAchievements", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("user_achievements")
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: false });

      if (error) throw error;
      return data as UserAchievement[];
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Hook to fetch all available achievements
 */
export const useAllAchievements = () => {
  return useQuery({
    queryKey: ["allAchievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("requirement_value", { ascending: true });

      if (error) throw error;
      return data as Achievement[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour (achievements rarely change)
  });
};

/**
 * Hook to get achievements with unlock status
 */
export const useAchievementsWithProgress = () => {
  const { user } = useAuth();
  const { data: allAchievements } = useAllAchievements();
  const { data: userAchievements } = useUserAchievements();

  return useQuery({
    queryKey: ["achievementsWithProgress", user?.id],
    queryFn: async () => {
      if (!allAchievements || !user?.id) return [];

      // Get user stats for progress calculation
      const { data: profile } = await supabase
        .from("profiles")
        .select("current_streak, longest_streak")
        .eq("id", user.id)
        .single();

      const { data: entriesCount } = await supabase
        .from("journal_entries")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);

      const totalEntries = entriesCount || 0;
      const currentStreak = profile?.current_streak ?? 0;

      return allAchievements.map((achievement) => {
        const userAchievement = userAchievements?.find(
          (ua) => ua.achievement_id === achievement.id
        );

        let progress = 0;
        if (achievement.requirement_type === "streak_days") {
          progress = currentStreak;
        } else if (achievement.requirement_type === "total_entries") {
          progress = totalEntries;
        }

        return {
          ...achievement,
          unlocked: !!userAchievement,
          unlocked_at: userAchievement?.unlocked_at,
          is_claimed: userAchievement?.is_claimed ?? false,
          progress,
          progress_percentage: Math.min(
            (progress / achievement.requirement_value) * 100,
            100
          ),
        };
      });
    },
    enabled: !!allAchievements && !!user?.id,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Hook to check and award achievements
 */
export const useCheckAchievements = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");

      const { data, error } = await supabase.rpc("check_and_award_achievements", {
        p_user_id: user.id,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (newAchievements) => {
      // Invalidate queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ["userAchievements"] });
      queryClient.invalidateQueries({ queryKey: ["achievementsWithProgress"] });
      
      return newAchievements;
    },
  });
};

/**
 * Hook to claim an achievement (mark as seen)
 */
export const useClaimAchievement = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievementId: number) => {
      if (!user?.id) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("user_achievements")
        .update({ is_claimed: true })
        .eq("user_id", user.id)
        .eq("achievement_id", achievementId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userAchievements"] });
      queryClient.invalidateQueries({ queryKey: ["achievementsWithProgress"] });
    },
  });
};

/**
 * Hook to get unclaimed achievements count
 */
export const useUnclaimedAchievementsCount = () => {
  const { data: userAchievements } = useUserAchievements();

  return (
    userAchievements?.filter((achievement) => !achievement.is_claimed).length ?? 0
  );
};

/**
 * Hook to get achievement statistics
 */
export const useAchievementStats = () => {
  const { data: allAchievements } = useAllAchievements();
  const { data: userAchievements } = useUserAchievements();

  return {
    total: allAchievements?.length ?? 0,
    unlocked: userAchievements?.length ?? 0,
    percentage:
      allAchievements && userAchievements
        ? Math.round((userAchievements.length / allAchievements.length) * 100)
        : 0,
  };
};
