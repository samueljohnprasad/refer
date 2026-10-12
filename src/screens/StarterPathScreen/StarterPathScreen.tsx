import React, { useCallback, useEffect, useRef, useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { usePostHog } from "posthog-react-native";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";
import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import { useOnboardingAnalytics } from "@/src/screens/OnboardingScreen/hooks/useOnboardingAnalytics";
import { useXP } from "@/src/context/XPContext";
import { XPActionType } from "@/src/types/xp";
import { updateUserStreak } from "@/src/lib/api/mentalHealthJourneyApi";
import { buildReminderConfig } from "@/src/screens/OnboardingScreen/utils/reminderConfig";
import { useAuth } from "@/src/context/AuthContext";
import { ANXIOUS_THOUGHTS_STARTER_PATH } from "@/src/domains/journey/model/starterPath";
import {
  completeStarterPathStep,
  loadStarterPathProgress,
  setActiveStarterPath,
  saveStarterPathProgress,
} from "@/src/domains/journey/data/starterPathProgress.repo";
import {
  StarterPathContent,
  StarterPathFooter,
  StarterPathHeader,
  type StarterStep,
} from "./StarterPathParts";

const PREVIOUS_STEP: Record<StarterStep, StarterStep> = {
  goal: "goal",
  lesson: "goal",
  practice: "lesson",
};

function assertUserAvailable(user: unknown): asserts user {
  if (!user) throw new Error("Anonymous session is not ready");
}

export default function StarterPathScreen(): React.JSX.Element {
  const { t } = useTranslation("onboarding");
  const { user } = useAuth();
  const { markCompleted } = useCompleteOnboarding();
  const { awardXP } = useXP();
  const posthog = usePostHog();
  const {
    trackStarted,
    trackStepViewed,
    trackStepCompleted,
    trackGoalsSelected,
    trackOnboardingCompleted,
  } = useOnboardingAnalytics();
  const [step, setStep] = useState<StarterStep>("goal");
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasCompletionError, setHasCompletionError] = useState(false);
  const completionInFlightRef = useRef(false);
  const progressRevisionRef = useRef(0);

  useEffect(() => {
    if (!user) return;

    void loadStarterPathProgress(
      user.id,
      ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
      ANXIOUS_THOUGHTS_STARTER_PATH.pathVersion,
    )
      .then((progress) => {
        progressRevisionRef.current = progress?.revision ?? 0;
        if (progress?.lastCompletedStep === "lesson_complete") {
          setStep("practice");
        } else if (progress?.lastCompletedStep === "goal_selected") {
          setStep("lesson");
        }
      })
      .catch((error) => {
        console.warn("[StarterPath] Failed to resume progress:", error);
      });
  }, [user]);

  useEffect(() => {
    trackStarted();
    posthog?.capture("starter_path_started", {
      path_id: ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
      path_version: ANXIOUS_THOUGHTS_STARTER_PATH.pathVersion,
    });
    trackStepViewed("quiz_motivation", 1);
  }, [posthog, trackStarted, trackStepViewed]);

  const translate = useCallback(
    (key: string): string => t(key, { defaultValue: key }),
    [t],
  );

  const goBack = useCallback((): void => {
    setStep((currentStep) => PREVIOUS_STEP[currentStep]);
  }, []);

  const openPractice = useCallback((): void => {
    posthog?.capture("starter_path_practice_opened", {
      path_id: ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
      path_version: ANXIOUS_THOUGHTS_STARTER_PATH.pathVersion,
      practice_id: ANXIOUS_THOUGHTS_STARTER_PATH.nextAction.targetId,
    });
    router.push({
      pathname: "/tabs/screens/exercise-flow",
      params: {
        type: ANXIOUS_THOUGHTS_STARTER_PATH.practiceRef.id,
        textOnly: "true",
      },
    });
  }, [posthog]);

  const advanceStep = useCallback(async (): Promise<void> => {
    if (step === "goal") {
      if (user) {
        const progress = await saveStarterPathProgress({
          userId: user.id,
          pathId: ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
          pathVersion: ANXIOUS_THOUGHTS_STARTER_PATH.pathVersion,
          status: "active",
          lastCompletedStep: "goal_selected",
          lastIdempotencyKey: null,
          nextAction: {
            kind: "lesson",
            targetId: ANXIOUS_THOUGHTS_STARTER_PATH.lessonNodeId,
            pathId: ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
            reasonCode: "lesson_complete",
          },
          revision: 0,
          updatedAt: new Date().toISOString(),
        });
        progressRevisionRef.current = progress.revision;
      }
      trackGoalsSelected([ANXIOUS_THOUGHTS_STARTER_PATH.goalId]);
      trackStepCompleted("quiz_motivation", 1);
      trackStepViewed("lesson_complete", 2);
      setStep("lesson");
      return;
    }

    if (user) {
      const result = await completeStarterPathStep(
        {
          userId: user.id,
          pathId: ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
          pathVersion: ANXIOUS_THOUGHTS_STARTER_PATH.pathVersion,
          status: "active",
          lastCompletedStep: "goal_selected",
          lastIdempotencyKey: null,
          nextAction: {
            kind: "lesson",
            targetId: ANXIOUS_THOUGHTS_STARTER_PATH.lessonNodeId,
            pathId: ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
            reasonCode: "lesson_complete",
          },
          revision: progressRevisionRef.current,
          updatedAt: new Date().toISOString(),
        },
        "lesson_complete",
        ANXIOUS_THOUGHTS_STARTER_PATH.nextAction,
        `starter-path-lesson-${user.id}-${Date.now()}`,
      );
      if (result.conflict) {
        const currentProgress = await loadStarterPathProgress(
          user.id,
          ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
          ANXIOUS_THOUGHTS_STARTER_PATH.pathVersion,
        );
        progressRevisionRef.current = currentProgress?.revision ?? 0;
        setStep(currentProgress?.lastCompletedStep === "lesson_complete" ? "practice" : "lesson");
        return;
      }
      progressRevisionRef.current = result.progress.revision;
    }
    trackStepCompleted("lesson_complete", 2);
    trackStepViewed("journey_step_preview", 3);
    setStep("practice");
  }, [step, trackGoalsSelected, trackStepCompleted, trackStepViewed, user]);

  const completePath = useCallback(async (): Promise<void> => {
    try {
      assertUserAvailable(user);
      await markCompleted({
        cfg: buildReminderConfig("evening"),
        reminderEnabled: false,
        motivation: "anxiety",
        reasons: ["anxiety"],
      });
      await setActiveStarterPath(user.id, ANXIOUS_THOUGHTS_STARTER_PATH.pathId);
      posthog?.capture("starter_path_completed", {
        path_id: ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
        path_version: ANXIOUS_THOUGHTS_STARTER_PATH.pathVersion,
      });
      await Promise.allSettled([
        updateUserStreak(),
        awardXP(XPActionType.EXERCISE_COMPLETE, {
          customAmount: 15,
          customDescription: t("xp_first_step"),
        }),
      ]);
      trackOnboardingCompleted(3);
      posthog?.capture("starter_path_home_returned", {
        path_id: ANXIOUS_THOUGHTS_STARTER_PATH.pathId,
        path_version: ANXIOUS_THOUGHTS_STARTER_PATH.pathVersion,
      });
      router.replace("/tabs/(tabs)/home");
    } catch (error) {
      console.warn("[StarterPath] Failed to complete onboarding:", error);
      setHasCompletionError(true);
    }
  }, [
    awardXP,
    markCompleted,
    posthog,
    t,
    trackOnboardingCompleted,
    user,
  ]);

  const continueHome = useCallback((): void => {
    if (completionInFlightRef.current) return;

    completionInFlightRef.current = true;
    setHasCompletionError(false);
    setIsCompleting(true);
    void completePath().finally(() => {
      completionInFlightRef.current = false;
      setIsCompleting(false);
    });
  }, [completePath]);

  return (
    <ScreenLayout>
      <StarterPathHeader
        step={step}
        translate={translate}
        onBack={goBack}
      />
      <StarterPathContent
        step={step}
        translate={translate}
        hasCompletionError={hasCompletionError}
        isCompleting={isCompleting}
        onOpenPractice={openPractice}
        onContinueHome={continueHome}
      />
      <StarterPathFooter
        step={step}
        translate={translate}
        onAdvance={advanceStep}
      />
    </ScreenLayout>
  );
}
