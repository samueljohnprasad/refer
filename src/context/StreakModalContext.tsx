import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { StreakDisplay } from "@/src/components/Streak";

const STREAK_MODAL_STORAGE_KEY = "@happy/last_streak_modal_date";
type Listener = () => void;
const modalListeners = new Set<Listener>();

export type VisibilityListener = (visible: boolean) => void;
export const streakModalVisibilityListeners = new Set<VisibilityListener>();

/**
 * Global trigger called on daily log actions (e.g. awardXP).
 * Opens StreakDisplay modal ONLY if it has not been shown yet today.
 */
export const notifyFirstLogOfDay = async (): Promise<void> => {
  try {
    const today = dayjs().format("YYYY-MM-DD");
    const lastShownDate = await AsyncStorage.getItem(STREAK_MODAL_STORAGE_KEY);

    if (lastShownDate !== today) {
      await AsyncStorage.setItem(STREAK_MODAL_STORAGE_KEY, today);
      modalListeners.forEach((listener) => listener());
    }
  } catch (error) {
    console.error("[StreakModalContext] notifyFirstLogOfDay error:", error);
  }
};

interface StreakModalContextValue {
  isStreakModalVisible: boolean;
  showStreakModal: () => void;
  hideStreakModal: () => void;
  triggerFirstLogModalIfEligible: () => Promise<boolean>;
}

const StreakModalContext = createContext<StreakModalContextValue | undefined>(undefined);

export const StreakModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleTrigger = () => setIsVisible(true);
    modalListeners.add(handleTrigger);
    return () => {
      modalListeners.delete(handleTrigger);
    };
  }, []);

  useEffect(() => {
    streakModalVisibilityListeners.forEach((l) => l(isVisible));
  }, [isVisible]);

  const showStreakModal = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideStreakModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  /**
   * Triggers the streak modal ONLY on the first log of the day.
   * Remembers the last triggered date in AsyncStorage so it only pops up once per calendar day.
   */
  const triggerFirstLogModalIfEligible = useCallback(async (): Promise<boolean> => {
    try {
      const today = dayjs().format("YYYY-MM-DD");
      const lastShownDate = await AsyncStorage.getItem(STREAK_MODAL_STORAGE_KEY);

      if (lastShownDate !== today) {
        await AsyncStorage.setItem(STREAK_MODAL_STORAGE_KEY, today);
        setIsVisible(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("[StreakModalContext] triggerFirstLogModal error:", error);
      return false;
    }
  }, []);

  return (
    <StreakModalContext.Provider
      value={{
        isStreakModalVisible: isVisible,
        showStreakModal,
        hideStreakModal,
        triggerFirstLogModalIfEligible,
      }}
    >
      {children}
    </StreakModalContext.Provider>
  );
};

export const useStreakModal = (): StreakModalContextValue => {
  const context = useContext(StreakModalContext);
  if (!context) {
    throw new Error("useStreakModal must be used within a StreakModalProvider");
  }
  return context;
};
