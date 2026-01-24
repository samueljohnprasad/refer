import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useXP } from "./XPContext";
import { LevelTier, getLevelFromXP } from "@/src/types/levels";
import { LevelUpCelebration } from "@/src/components/Level";

interface LevelContextValue {
  currentLevel: LevelTier;
  previousLevel: LevelTier | null;
  showCelebration: boolean;
  dismissCelebration: () => void;
}

const LevelContext = createContext<LevelContextValue | undefined>(undefined);

interface LevelProviderProps {
  children: ReactNode;
}

/**
 * Provider that tracks level changes and triggers celebration modal
 * Wraps children with LevelUpCelebration modal
 */
export const LevelProvider: React.FC<LevelProviderProps> = ({ children }) => {
  const { totalXP } = useXP();
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationLevel, setCelebrationLevel] = useState<LevelTier | null>(
    null,
  );
  const previousLevelRef = useRef<LevelTier | null>(null);
  const initializedRef = useRef<boolean>(false);

  const currentLevel = getLevelFromXP(totalXP);

  // Detect level-up
  useEffect(() => {
    if (!initializedRef.current) {
      // First render - just store the current level
      previousLevelRef.current = currentLevel;
      initializedRef.current = true;
      return;
    }

    const prevLevel = previousLevelRef.current;

    if (prevLevel && currentLevel.level > prevLevel.level) {
      // Level up detected!
      setCelebrationLevel(currentLevel);
      setShowCelebration(true);
    }

    previousLevelRef.current = currentLevel;
  }, [currentLevel.level]);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
    setCelebrationLevel(null);
  }, []);

  const value: LevelContextValue = {
    currentLevel,
    previousLevel: previousLevelRef.current,
    showCelebration,
    dismissCelebration,
  };

  return (
    <LevelContext.Provider value={value}>
      {children}
      {celebrationLevel && (
        <LevelUpCelebration
          visible={showCelebration}
          newLevel={celebrationLevel}
          onDismiss={dismissCelebration}
        />
      )}
    </LevelContext.Provider>
  );
};

export const useLevel = (): LevelContextValue => {
  const context = useContext(LevelContext);
  if (context === undefined) {
    throw new Error("useLevel must be used within a LevelProvider");
  }
  return context;
};
