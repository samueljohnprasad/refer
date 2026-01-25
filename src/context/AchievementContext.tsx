import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { useAchievements, UserStats } from "@/hooks/data/useAchievements";
import { Achievement } from "@/src/types/achievements";
import { AchievementUnlockModal } from "@/src/components/Achievements";

interface AchievementContextValue {
  checkAchievements: (stats: UserStats) => Promise<void>;
  isLoading: boolean;
}

const AchievementContext = createContext<AchievementContextValue | undefined>(
  undefined,
);

interface AchievementProviderProps {
  children: ReactNode;
}

/**
 * Provider that manages achievement unlock celebrations
 * Call checkAchievements after relevant user actions
 */
export const AchievementProvider: React.FC<AchievementProviderProps> = ({
  children,
}) => {
  const { checkAndUnlockAchievements, isLoading } = useAchievements();
  const [celebrationQueue, setCelebrationQueue] = useState<Achievement[]>([]);
  const [currentCelebration, setCurrentCelebration] =
    useState<Achievement | null>(null);

  const checkAchievements = useCallback(
    async (stats: UserStats): Promise<void> => {
      const newlyUnlocked = await checkAndUnlockAchievements(stats);

      if (newlyUnlocked.length > 0) {
        setCelebrationQueue((prev) => [...prev, ...newlyUnlocked]);

        // Show first celebration if not already showing
        if (!currentCelebration) {
          setCurrentCelebration(newlyUnlocked[0]);
        }
      }
    },
    [checkAndUnlockAchievements, currentCelebration],
  );

  const handleDismissCelebration = useCallback(() => {
    setCurrentCelebration(null);

    // Show next in queue
    setCelebrationQueue((prev) => {
      const next = prev.slice(1);
      if (next.length > 0) {
        setTimeout(() => {
          setCurrentCelebration(next[0]);
        }, 300);
      }
      return next;
    });
  }, []);

  const value: AchievementContextValue = {
    checkAchievements,
    isLoading,
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
      <AchievementUnlockModal
        visible={!!currentCelebration}
        achievement={currentCelebration}
        onDismiss={handleDismissCelebration}
      />
    </AchievementContext.Provider>
  );
};

export const useAchievementContext = (): AchievementContextValue => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error(
      "useAchievementContext must be used within an AchievementProvider",
    );
  }
  return context;
};
