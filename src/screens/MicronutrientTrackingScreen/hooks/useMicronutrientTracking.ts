import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MICRONUTRIENTS_CONFIG,
  type MicronutrientConfig,
} from "@/src/config/micronutrients";

const STORAGE_KEY: string = "tracked_micronutrients";

export interface UseMicronutrientTrackingResult {
  trackedNutrients: Set<string>;
  toggleNutrient: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isLoading: boolean;
}

export function useMicronutrientTracking(): UseMicronutrientTrackingResult {
  const [trackedNutrients, setTrackedNutrients] = useState<Set<string>>(
    new Set<string>(MICRONUTRIENTS_CONFIG.map((n: MicronutrientConfig) => n.id))
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load saved preferences
  useEffect(() => {
    let active: boolean = true;
    const loadTrackedNutrients = async (): Promise<void> => {
      try {
        const saved: string | null = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved && active) {
          setTrackedNutrients(new Set<string>(JSON.parse(saved)));
        }
      } catch (error) {
        console.error("Failed to load tracked nutrients:", error);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    loadTrackedNutrients();
    return () => {
      active = false;
    };
  }, []);

  const saveTrackedNutrients = async (
    nutrients: Set<string>
  ): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(nutrients))
      );
    } catch (error) {
      console.error("Failed to save tracked nutrients:", error);
    }
  };

  const toggleNutrient = useCallback((id: string): void => {
    setTrackedNutrients((prev: Set<string>) => {
      const newTracked: Set<string> = new Set<string>(prev);
      if (newTracked.has(id)) {
        newTracked.delete(id);
      } else {
        newTracked.add(id);
      }
      saveTrackedNutrients(newTracked);
      return newTracked;
    });
  }, []);

  const selectAll = useCallback(() => {
    const all: Set<string> = new Set<string>(MICRONUTRIENTS_CONFIG.map((n: MicronutrientConfig) => n.id));
    setTrackedNutrients(all);
    saveTrackedNutrients(all);
  }, []);

  const deselectAll = useCallback(() => {
    const empty: Set<string> = new Set<string>();
    setTrackedNutrients(empty);
    saveTrackedNutrients(empty);
  }, []);

  return {
    trackedNutrients,
    toggleNutrient,
    selectAll,
    deselectAll,
    isLoading,
  };
}
