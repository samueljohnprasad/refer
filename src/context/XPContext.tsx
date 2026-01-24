import React, { createContext, useContext, ReactNode } from "react";
import { useXPSystem } from "@/hooks/data/useXPSystem";
import { XPActionType, XPHistoryEntry } from "@/src/types/xp";

interface XPGain {
  id: string;
  amount: number;
  label: string;
  timestamp: number;
}

interface XPContextValue {
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

const XPContext = createContext<XPContextValue | undefined>(undefined);

interface XPProviderProps {
  children: ReactNode;
}

export const XPProvider: React.FC<XPProviderProps> = ({ children }) => {
  const xpSystem = useXPSystem();

  return <XPContext.Provider value={xpSystem}>{children}</XPContext.Provider>;
};

export const useXP = (): XPContextValue => {
  const context = useContext(XPContext);
  if (context === undefined) {
    throw new Error("useXP must be used within an XPProvider");
  }
  return context;
};

// Optional: Hook that returns undefined if not in provider (for optional usage)
export const useXPOptional = (): XPContextValue | undefined => {
  return useContext(XPContext);
};
