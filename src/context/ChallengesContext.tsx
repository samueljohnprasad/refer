import React, { createContext, useContext, ReactNode } from "react";
import { useChallenges } from "@/hooks/data/useChallenges";
import { ActiveChallenge } from "@/src/types/challenges";

interface ChallengesContextValue {
  dailyChallenges: ActiveChallenge[];
  weeklyChallenges: ActiveChallenge[];
  isLoading: boolean;
  updateProgress: (conditionType: string, increment?: number) => Promise<void>;
  refetch: () => Promise<void>;
}

const ChallengesContext = createContext<ChallengesContextValue | undefined>(
  undefined,
);

interface ChallengesProviderProps {
  children: ReactNode;
}

/**
 * Provider for app-wide challenge tracking
 */
export const ChallengesProvider: React.FC<ChallengesProviderProps> = ({
  children,
}) => {
  const {
    dailyChallenges,
    weeklyChallenges,
    isLoading,
    updateProgress,
    refetch,
  } = useChallenges();

  const value: ChallengesContextValue = {
    dailyChallenges,
    weeklyChallenges,
    isLoading,
    updateProgress,
    refetch,
  };

  return (
    <ChallengesContext.Provider value={value}>
      {children}
    </ChallengesContext.Provider>
  );
};

export const useChallengesContext = (): ChallengesContextValue => {
  const context = useContext(ChallengesContext);
  if (context === undefined) {
    throw new Error(
      "useChallengesContext must be used within a ChallengesProvider",
    );
  }
  return context;
};

// Optional hook that returns undefined if no provider
export const useChallengesOptional = (): ChallengesContextValue | undefined => {
  return useContext(ChallengesContext);
};
