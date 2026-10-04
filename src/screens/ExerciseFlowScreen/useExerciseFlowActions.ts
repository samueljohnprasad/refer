import { useCallback } from "react";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { usePostHog } from "posthog-react-native";
import { useXPOptional } from "@/src/context/XPContext";
import { useExerciseFlow } from "@/src/hooks/useExerciseFlow";
import { XPActionType, XP_REWARDS } from "@/src/types/xp";
import { createLogger } from "@/src/lib/logger";
import type {
  ExerciseConfig,
  ExerciseEntry,
  ExerciseSavePayload,
  ExerciseType,
} from "@/src/types/exerciseFlow";
import type { UseExerciseMutationReturn } from "@/src/hooks/useExerciseMutation";

const logger = createLogger("exercise-flow-screen");

interface CelebrationState {
  xp: number;
  durationMs: number;
}

interface ExerciseFlowActionsProps {
  config: ExerciseConfig<any>;
  existingEntry?: ExerciseEntry | null;
  exerciseType: ExerciseType;
  readOnly: boolean;
  flow: ReturnType<typeof useExerciseFlow<any>>;
  save: UseExerciseMutationReturn["save"];
  router: ReturnType<typeof useRouter>;
  xp: ReturnType<typeof useXPOptional>;
  posthog: ReturnType<typeof usePostHog>;
  isConfirmedExitRef: MutableRefObject<boolean>;
  exerciseStartedAtRef: MutableRefObject<number>;
  setCelebration: Dispatch<SetStateAction<CelebrationState | null>>;
  exitScreen: () => void;
}

export function useExerciseFlowActions({
  config,
  existingEntry,
  exerciseType,
  readOnly,
  flow,
  save,
  router,
  xp,
  posthog,
  isConfirmedExitRef,
  exerciseStartedAtRef,
  setCelebration,
  exitScreen,
}: ExerciseFlowActionsProps) {
  const { t } = useTranslation("exercises");
  const exerciseTitle = t(
    `copingCards.exerciseTypes.${exerciseType}` as const,
    { defaultValue: config.title },
  );

  const handleClose = useCallback(() => {
    if (readOnly || flow.currentStepIndex === 0) {
      exitScreen();
      return;
    }

    Alert.alert(t("flow.ui.exitTitle"), t("flow.ui.draftMessage"), [
      { text: t("flow.ui.cancel"), style: "cancel" },
      {
        text: t("flow.ui.saveAndExit"),
        onPress: async () => {
          try {
            const payload = flow.getSavePayload("in_progress");
            await save(payload, existingEntry?.id);
            exitScreen();
          } catch {
            Alert.alert(t("flow.ui.saveFailed"), t("flow.ui.tryAgain"));
          }
        },
      },
      {
        text: t("flow.ui.discard"),
        style: "destructive",
        onPress: () => setTimeout(exitScreen, 100),
      },
    ]);
  }, [readOnly, flow, existingEntry, save, exitScreen, t]);

  const handleSave = useCallback(async () => {
    try {
      const payload = flow.getSavePayload("completed");
      await save(payload, existingEntry?.id);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      const isFreshCompletion = !existingEntry || existingEntry.status !== "completed";
      if (!isFreshCompletion) {
        exitScreen();
        return;
      }

      posthog?.capture("exercise_completed", {
        exercise_type: exerciseType,
        step_count: flow.totalSteps,
      });
      xp?.awardXP(XPActionType.EXERCISE_COMPLETE, {
        customDescription: exerciseTitle || t("flow.ui.exerciseCompleted"),
      });
      const durationMs = Date.now() - exerciseStartedAtRef.current;
      logger.info("Fresh completion! Setting celebration state:", {
        xp: XP_REWARDS[XPActionType.EXERCISE_COMPLETE],
        durationMs,
        title: exerciseTitle,
      });
      setCelebration({
        xp: XP_REWARDS[XPActionType.EXERCISE_COMPLETE],
        durationMs,
      });
    } catch {
      Alert.alert(t("flow.ui.saveFailed"), t("flow.ui.tryAgain"));
    }
  }, [
    flow,
    existingEntry,
    save,
    exerciseType,
    exerciseTitle,
    exitScreen,
    posthog,
    xp,
    t,
    exerciseStartedAtRef,
    setCelebration,
  ]);

  const handleNavigateDeeper = useCallback(
    async (type: ExerciseType) => {
      try {
        const payload: ExerciseSavePayload = flow.getSavePayload("completed");
        await save(payload, existingEntry?.id);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        if (!existingEntry || existingEntry.status !== "completed") {
          posthog?.capture("exercise_completed", {
            exercise_type: exerciseType,
            step_count: flow.totalSteps,
          });
          xp?.awardXP(XPActionType.EXERCISE_COMPLETE, {
            customDescription: exerciseTitle || t("flow.ui.exerciseCompleted"),
          });
        }

        isConfirmedExitRef.current = true;
        router.replace({ pathname: "/tabs/screens/exercise-flow", params: { type } });
      } catch {
        Alert.alert(t("flow.ui.saveFailed"), t("flow.ui.tryAgain"));
      }
    },
    [
      flow,
      existingEntry,
      save,
      posthog,
      xp,
      exerciseType,
      exerciseTitle,
      t,
      isConfirmedExitRef,
      router,
    ],
  );

  return { handleClose, handleSave, handleNavigateDeeper, exerciseTitle };
}
