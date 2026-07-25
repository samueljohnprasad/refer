import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { supabase } from "@/src/network/auth/supabase";
import { useAuth } from "@/src/context/AuthContext";
import {
  XPActionType,
  XP_REWARDS,
  XPData,
  XPHistoryEntry,
  XP_STORAGE_KEY,
  XP_ACTION_LABELS,
} from "@/src/types/xp";

import { notifyFirstLogOfDay } from "@/src/context/StreakModalContext";

interface XPGain {
  id: string;
  amount: number;
  label: string;
  timestamp: number;
}

interface UseXPSystemReturn {
  totalXP: number;
  todayXP: number;
  recentGains: XPGain[];
  history: XPHistoryEntry[];
  isLoading: boolean;
  awardXP: (
    action: XPActionType,
    options?: { customAmount?: number; customDescription?: string },
  ) => Promise<number>;
  removeXP: (
    action: XPActionType,
    options?: { customAmount?: number; customDescription?: string },
  ) => Promise<number>;
  getXPHistory: (limit?: number) => Promise<XPHistoryEntry[]>;
  clearRecentGain: (id: string) => void;
  refetch: () => Promise<void>;
}

// Supabase table interfaces (until types are regenerated)
interface UserXPRow {
  id: string;
  user_id: string;
  total_xp: number;
  today_xp: number;
  last_reset_date: string;
  created_at: string;
  updated_at: string;
}

interface XPHistoryRow {
  id: string;
  user_id: string;
  action: string;
  amount: number;
  description: string | null;
  created_at: string;
}

const MAX_HISTORY_ENTRIES = 100;
const RECENT_GAIN_DISPLAY_DURATION = 3000; // 3 seconds

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const getDefaultXPData = (): XPData => ({
  totalXP: 0,
  todayXP: 0,
  lastResetDate: dayjs().format("YYYY-MM-DD"),
  history: [],
});

export const useXPSystem = (): UseXPSystemReturn => {
  const { user } = useAuth();
  const [xpData, setXpData] = useState<XPData>(getDefaultXPData());
  const [history, setHistory] = useState<XPHistoryEntry[]>([]);
  const [recentGains, setRecentGains] = useState<XPGain[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // Load XP data from Supabase, fallback to AsyncStorage
  const loadXPData = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const today = dayjs().format("YYYY-MM-DD");

      if (user?.id) {
        // Try to load from Supabase (using type casting for new table)
        const { data: supabaseXP, error } = await supabase
          .from("user_xp" as any)
          .select("*")
          .eq("user_id", user.id)
          .single();

        const xpRow = supabaseXP as UserXPRow | null;

        if (xpRow && !error) {
          // Check if we need to reset today's XP
          const lastResetDate = xpRow.last_reset_date;
          let todayXP = xpRow.today_xp;

          if (lastResetDate !== today) {
            // Reset today's XP in Supabase
            await supabase
              .from("user_xp" as any)
              .update({ today_xp: 0, last_reset_date: today })
              .eq("user_id", user.id);
            todayXP = 0;
          }

          const data: XPData = {
            totalXP: xpRow.total_xp,
            todayXP,
            lastResetDate: today,
            history: [],
          };

          setXpData(data);

          // Cache locally
          await AsyncStorage.setItem(XP_STORAGE_KEY, JSON.stringify(data));

          // Load history
          await fetchXPHistory();
          return;
        }

        // If no Supabase record, create one
        if (error?.code === "PGRST116") {
          await supabase.from("user_xp" as any).insert({
            user_id: user.id,
            total_xp: 0,
            today_xp: 0,
            last_reset_date: today,
          });
        }
      }

      // Fallback to AsyncStorage for offline
      const storedData = await AsyncStorage.getItem(XP_STORAGE_KEY);
      if (storedData) {
        const parsedData: XPData = JSON.parse(storedData);

        // Reset today's XP if it's a new day
        if (parsedData.lastResetDate !== today) {
          const updatedData: XPData = {
            ...parsedData,
            todayXP: 0,
            lastResetDate: today,
          };
          await AsyncStorage.setItem(
            XP_STORAGE_KEY,
            JSON.stringify(updatedData),
          );
          setXpData(updatedData);
        } else {
          setXpData(parsedData);
        }
      }
    } catch (error) {
      console.error("Error loading XP data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Fetch XP history from Supabase
  const fetchXPHistory = useCallback(
    async (limit: number = 50): Promise<XPHistoryEntry[]> => {
      if (!user?.id) return [];

      try {
        const { data, error } = await supabase
          .from("xp_history" as any)
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (error) {
          console.error("Error fetching XP history:", error);
          return [];
        }

        const rows = (data || []) as XPHistoryRow[];
        const historyEntries: XPHistoryEntry[] = rows.map((entry) => ({
          id: entry.id,
          action: entry.action as XPActionType,
          amount: entry.amount,
          timestamp: entry.created_at,
          description: entry.description || undefined,
        }));

        setHistory(historyEntries);
        return historyEntries;
      } catch (error) {
        console.error("Error fetching XP history:", error);
        return [];
      }
    },
    [user?.id],
  );

  // Award XP for an action
  const awardXP = useCallback(
    async (
      action: XPActionType,
      options?: { customAmount?: number; customDescription?: string },
    ): Promise<number> => {
      const amount = options?.customAmount ?? XP_REWARDS[action];
      const description =
        options?.customDescription ?? XP_ACTION_LABELS[action];
      const gainId = generateId();

      // Update local state immediately for responsive UI
      const updatedData: XPData = {
        totalXP: xpData.totalXP + amount,
        todayXP: xpData.todayXP + amount,
        lastResetDate: xpData.lastResetDate,
        history: xpData.history,
      };

      setXpData(updatedData);

      // Add to recent gains for animation
      const newGain: XPGain = {
        id: gainId,
        amount,
        label: description,
        timestamp: Date.now(),
      };

      setRecentGains((prev) => [...prev, newGain]);

      // Auto-remove after display duration
      const timeoutId = setTimeout(() => {
        clearRecentGain(gainId);
      }, RECENT_GAIN_DISPLAY_DURATION);

      timeoutRefs.current.set(gainId, timeoutId);

      // Trigger first log of the day streak modal popup
      void notifyFirstLogOfDay();

      // Sync to Supabase in background
      if (user?.id) {
        try {
          // Update user_xp totals (using type casting)
          const { error: xpError } = await supabase
            .from("user_xp" as any)
            .upsert(
              {
                user_id: user.id,
                total_xp: updatedData.totalXP,
                today_xp: updatedData.todayXP,
                last_reset_date: updatedData.lastResetDate,
              },
              { onConflict: "user_id" },
            );

          if (xpError) {
            console.error("Error updating XP in Supabase:", xpError);
          }

          // Insert into xp_history
          const { error: historyError } = await supabase
            .from("xp_history" as any)
            .insert({
              user_id: user.id,
              action,
              amount,
              description,
            });

          if (historyError) {
            console.error("Error inserting XP history:", historyError);
          }

          // Update local history
          const newHistoryEntry: XPHistoryEntry = {
            id: gainId,
            action,
            amount,
            timestamp: new Date().toISOString(),
            description,
          };
          setHistory((prev) =>
            [newHistoryEntry, ...prev].slice(0, MAX_HISTORY_ENTRIES),
          );
        } catch (error) {
          console.error("Error syncing XP to Supabase:", error);
        }
      }

      // Cache locally as backup
      await AsyncStorage.setItem(XP_STORAGE_KEY, JSON.stringify(updatedData));

      return amount;
    },
    [xpData, user?.id],
  );

  // Clear a recent gain from the animation list
  const clearRecentGain = useCallback((id: string): void => {
    setRecentGains((prev) => prev.filter((gain) => gain.id !== id));

    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
  }, []);

  // Remove XP for an action (e.g., habit unticked)
  const removeXP = useCallback(
    async (
      action: XPActionType,
      options?: { customAmount?: number; customDescription?: string },
    ): Promise<number> => {
      const amount = options?.customAmount ?? XP_REWARDS[action];

      // Update local state immediately - ensure we don't go negative
      const newTotalXP = Math.max(0, xpData.totalXP - amount);
      const newTodayXP = Math.max(0, xpData.todayXP - amount);

      const updatedData: XPData = {
        totalXP: newTotalXP,
        todayXP: newTodayXP,
        lastResetDate: xpData.lastResetDate,
        history: xpData.history,
      };

      setXpData(updatedData);

      // Sync to Supabase in background
      if (user?.id) {
        try {
          const { error: xpError } = await supabase
            .from("user_xp" as any)
            .upsert(
              {
                user_id: user.id,
                total_xp: newTotalXP,
                today_xp: newTodayXP,
                last_reset_date: updatedData.lastResetDate,
              },
              { onConflict: "user_id" },
            );

          if (xpError) {
            console.error("Error updating XP in Supabase:", xpError);
          }
        } catch (error) {
          console.error("Error syncing XP removal to Supabase:", error);
        }
      }

      // Cache locally as backup
      await AsyncStorage.setItem(XP_STORAGE_KEY, JSON.stringify(updatedData));

      return amount;
    },
    [xpData, user?.id],
  );

  // Get XP history
  const getXPHistory = useCallback(
    async (limit?: number): Promise<XPHistoryEntry[]> => {
      return fetchXPHistory(limit);
    },
    [fetchXPHistory],
  );

  // Load data on mount and when user changes
  useEffect(() => {
    loadXPData();

    // Cleanup timeouts on unmount
    return () => {
      timeoutRefs.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutRefs.current.clear();
    };
  }, [loadXPData]);

  return {
    totalXP: xpData.totalXP,
    todayXP: xpData.todayXP,
    recentGains,
    history,
    isLoading,
    awardXP,
    removeXP,
    getXPHistory,
    clearRecentGain,
    refetch: loadXPData,
  };
};
