import { useMemo } from "react";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useMentalHealthData } from "./data/useMentalHealthData";

const FREE_JOURNAL_LIMIT = 3;

interface UseJournalLimitReturn {
  journalsToday: number;
  canCreateJournal: boolean;
  shouldShowPaywall: boolean;
  isLoading: boolean;
}

export const useJournalLimit = (selectedDate: Date): UseJournalLimitReturn => {
  const { hasPro, isLoadingRevenueCat } = useRevenueCat();
  const { data: journalsData, isLoading: isLoadingJournals } =
    useMentalHealthData(selectedDate);

  const journalsToday = useMemo(() => {
    return journalsData?.length ?? 0;
  }, [journalsData]);

  const canCreateJournal = useMemo(() => {
    if (hasPro) return true;

    return journalsToday < FREE_JOURNAL_LIMIT;
  }, [hasPro, journalsToday]);

  const shouldShowPaywall = useMemo(() => {
    if (hasPro) return false;

    return journalsToday >= FREE_JOURNAL_LIMIT;
  }, [hasPro, journalsToday]);

  return {
    journalsToday,
    canCreateJournal,
    shouldShowPaywall,
    isLoading: isLoadingRevenueCat || isLoadingJournals,
  };
};
