import { useMemo } from "react";
import { usePathname } from "expo-router";

import { useAuth } from "@/src/context/AuthContext";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useCBTHistory } from "@/src/screens/ExercisesScreen/hooks/useCBTHistory";
import { selectTotalCompletedCount } from "@/src/domains/journey/state/journeySelectors";
import { useAppSelector } from "@/src/store/hooks";
import { resolveHappyAssistantActions } from "./assistantResolver";
import { getLatestIncompleteExercise } from "./assistantHistory";
import type { HappyAssistantActionDescriptor } from "./types";

interface HappyAssistantActionsResult {
  title: string;
  subtitle: string;
  actions: HappyAssistantActionDescriptor[];
}

export function useHappyAssistantActions(): HappyAssistantActionsResult {
  const pathname = usePathname();
  const { isAnonymous } = useAuth();
  const { hasPro, shouldPromptAccountClaim } = useRevenueCat();
  const { data: historyData } = useCBTHistory();
  const history = useMemo(() => historyData?.pages.flatMap((p) => p.data) || [], [historyData]);
  const completedJourneyNodeCount = useAppSelector(selectTotalCompletedCount);

  return useMemo(() => {
    const latestIncompleteExercise = getLatestIncompleteExercise(history);
    const hasProgress = history.length > 0 || completedJourneyNodeCount > 0;

    return resolveHappyAssistantActions({
      pathname,
      isAnonymous,
      hasPro,
      shouldPromptAccountClaim,
      hasProgress,
      latestIncompleteExerciseTitle: latestIncompleteExercise?.title,
    });
  }, [
    completedJourneyNodeCount,
    hasPro,
    history,
    isAnonymous,
    pathname,
    shouldPromptAccountClaim,
  ]);
}
