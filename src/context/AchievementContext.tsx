import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useAchievements, UserStats } from "@/hooks/data/useAchievements";
import { Achievement } from "@/src/types/achievements";
import { AchievementUnlockModal } from "@/src/components/Achievements";
import { streakModalVisibilityListeners } from "./StreakModalContext";

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
  const [currentCelebration, setCurrentCelebration] = useState<Achievement | null>(null);
  const [isStreakActive, setIsStreakActive] = useState(false);

  useEffect(() => {
    const handleStreakVisibility = (visible: boolean) => {
      setIsStreakActive(visible);
    };
    streakModalVisibilityListeners.add(handleStreakVisibility);
    return () => {
      streakModalVisibilityListeners.delete(handleStreakVisibility);
    };
  }, []);

  // Process the queue automatically when no celebration is active and streak modal is hidden
  useEffect(() => {
    if (!currentCelebration && !isStreakActive && celebrationQueue.length > 0) {
      const timer = setTimeout(() => {
        setCurrentCelebration(celebrationQueue[0]);
      }, 500); // Wait 500ms for UIWindow to settle if another modal just closed
      return () => clearTimeout(timer);
    }
  }, [currentCelebration, isStreakActive, celebrationQueue]);

  const checkAchievements = useCallback(
    async (stats: UserStats): Promise<void> => {
      const newlyUnlocked = await checkAndUnlockAchievements(stats);

      if (newlyUnlocked.length > 0) {
        setCelebrationQueue((prev) => [...prev, ...newlyUnlocked]);
      }
    },
    [checkAndUnlockAchievements],
  );

  const handleDismissCelebration = useCallback(() => {
    setCurrentCelebration(null);
    setCelebrationQueue((prev) => prev.slice(1));
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
