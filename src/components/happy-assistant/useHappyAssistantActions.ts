import { useMemo } from "react";
import { usePathname } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAuth } from "@/src/context/AuthContext";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { useCBTHistory } from "@/src/screens/ExercisesScreen/hooks/useCBTHistory";
import { selectTotalCompletedCount } from "@/src/domains/journey/state/journeySelectors";
import { useAppSelector } from "@/src/store/hooks";
import {
  resolveAssistantContext,
  resolveHappyAssistantActions,
} from "./assistantResolver";
import { getLatestIncompleteExercise } from "./assistantHistory";
import type { HappyAssistantActionDescriptor } from "./types";
import { HappyAssistantActionIdEnum } from "./types";

interface HappyAssistantActionsResult {
  title: string;
  subtitle: string;
  actions: HappyAssistantActionDescriptor[];
}

export function useHappyAssistantActions(): HappyAssistantActionsResult {
  const pathname = usePathname();
  const { t } = useTranslation("settings");
  const { isAnonymous } = useAuth();
  const { hasPro, shouldPromptAccountClaim } = useRevenueCat();
  const { data: historyData } = useCBTHistory();
  const history = useMemo(() => historyData?.pages.flatMap((p) => p.data) || [], [historyData]);
  const completedJourneyNodeCount = useAppSelector(selectTotalCompletedCount);

  return useMemo(() => {
    const latestIncompleteExercise = getLatestIncompleteExercise(history);
    const hasProgress = history.length > 0 || completedJourneyNodeCount > 0;

    const resolved = resolveHappyAssistantActions({
      pathname,
      isAnonymous,
      hasPro,
      shouldPromptAccountClaim,
      hasProgress,
      latestIncompleteExerciseTitle: latestIncompleteExercise?.title,
    });
    const context = resolveAssistantContext(pathname);

    return {
      title: t(`assistantUi.contexts.${context}.title`),
      subtitle: t(`assistantUi.contexts.${context}.subtitle`),
      actions: resolved.actions.map((action) => {
        const hasDynamicResumeDescription =
          action.id === HappyAssistantActionIdEnum.ResumeExercise &&
          latestIncompleteExercise?.title;

        return {
          ...action,
          label: t(`assistantUi.actions.${action.id}.label`),
          description: hasDynamicResumeDescription
            ? action.description
            : t(`assistantUi.actions.${action.id}.description`),
        };
      }),
    };
  }, [
    completedJourneyNodeCount,
    hasPro,
    history,
    isAnonymous,
    pathname,
    t,
    shouldPromptAccountClaim,
  ]);
}
