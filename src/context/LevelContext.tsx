import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useXP } from "./XPContext";
import { LevelTier, getLevelFromXP } from "@/src/types/levels";
import { LevelUpCelebration } from "@/src/components/Level";

const LAST_CELEBRATED_LEVEL_KEY = "last_celebrated_level";

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
 * Only shows celebration once per level using AsyncStorage
 */
export const LevelProvider: React.FC<LevelProviderProps> = ({ children }) => {
  const { totalXP } = useXP();
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationLevel, setCelebrationLevel] = useState<LevelTier | null>(
    null,
  );
  const previousLevelRef = useRef<LevelTier | null>(null);
  const initializedRef = useRef<boolean>(false);
  const [lastCelebratedLevel, setLastCelebratedLevel] = useState<number | null>(
    null,
  );

  const currentLevel = getLevelFromXP(totalXP);

  // Load last celebrated level from storage on mount
  useEffect(() => {
    const loadLastCelebratedLevel = async (): Promise<void> => {
      try {
        const saved = await AsyncStorage.getItem(LAST_CELEBRATED_LEVEL_KEY);
        if (saved) {
          setLastCelebratedLevel(parseInt(saved, 10));
        }
      } catch (error) {
        console.error("Failed to load last celebrated level:", error);
      }
    };
    loadLastCelebratedLevel();
  }, []);

  // Detect level-up
  useEffect(() => {
    if (!initializedRef.current) {
      // First render - just store the current level
      previousLevelRef.current = currentLevel;
      initializedRef.current = true;
      return;
    }

    const prevLevel = previousLevelRef.current;

    if (
      prevLevel &&
      currentLevel.level > prevLevel.level &&
      lastCelebratedLevel !== null &&
      currentLevel.level > lastCelebratedLevel
    ) {
      // Level up detected and not yet celebrated!
      setCelebrationLevel(currentLevel);
      setShowCelebration(true);

      // Save the new level as celebrated
      AsyncStorage.setItem(
        LAST_CELEBRATED_LEVEL_KEY,
        currentLevel.level.toString(),
      ).catch((error) => {
        console.error("Failed to save last celebrated level:", error);
      });

      setLastCelebratedLevel(currentLevel.level);
    }

    previousLevelRef.current = currentLevel;
  }, [currentLevel.level, lastCelebratedLevel]);

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
