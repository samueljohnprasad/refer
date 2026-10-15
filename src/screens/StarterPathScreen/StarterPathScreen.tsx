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
import { hasExerciseConfig } from "@/src/data/exerciseRegistry";
import {
  getStarterPath,
  resolveStarterPathPractice,
  STARTER_PATHS,
  type StarterPathV1,
} from "@/src/domains/journey/model/starterPath";
import {
  completeStarterPathStep,
  loadActiveStarterPathId,
  loadStarterPathProgress,
  setActiveStarterPath,
  switchStarterPath,
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
  const [selectedPath, setSelectedPath] = useState<StarterPathV1>(
    STARTER_PATHS[0],
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasCompletionError, setHasCompletionError] = useState(false);
  const completionInFlightRef = useRef(false);
  const progressRevisionRef = useRef(0);
  const practiceSessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) return;

    void loadActiveStarterPathId(user.id)
      .then((activePathId) => {
        const activePath = getStarterPath(activePathId);
        setSelectedPath(activePath);
        return loadStarterPathProgress(
          user.id,
          activePath.pathId,
          activePath.pathVersion,
        ).then((progress) => ({ activePath, progress }));
      })
      .then(({ progress }) => {
        progressRevisionRef.current = progress?.revision ?? 0;
        if (progress?.lastCompletedStep === "lesson_complete") setStep("practice");
        if (progress?.lastCompletedStep === "goal_selected") setStep("lesson");
      })
      .catch((error) => {
        console.warn("[StarterPath] Failed to resume progress:", error);
      });
  }, [user]);

  useEffect(() => {
    trackStarted();
    posthog?.capture("starter_path_started", {
      path_id: selectedPath.pathId,
      path_version: selectedPath.pathVersion,
    });
    trackStepViewed("quiz_motivation", 1);
  }, [posthog, selectedPath, trackStarted, trackStepViewed]);

  const translate = useCallback(
    (key: string): string => t(key, { defaultValue: key }),
    [t],
  );

  const goBack = useCallback((): void => {
    setStep((currentStep) => PREVIOUS_STEP[currentStep]);
  }, []);

  const openPractice = useCallback((): void => {
    const practice = resolveStarterPathPractice(selectedPath, hasExerciseConfig);
    if (!practice) {
      setHasCompletionError(true);
      return;
    }
    practiceSessionIdRef.current = crypto.randomUUID();

    posthog?.capture("starter_path_practice_opened", {
      path_id: selectedPath.pathId,
      path_version: selectedPath.pathVersion,
      practice_id: practice.id,
    });
    router.push({
      pathname: "/tabs/screens/exercise-flow",
      params: {
        type: practice.id,
        textOnly: "true",
        practiceSessionId: practiceSessionIdRef.current,
        pathId: selectedPath.pathId,
        pathVersion: String(selectedPath.pathVersion),
        practiceSource: practice.source,
      },
    });
  }, [posthog, selectedPath]);

  const selectPath = useCallback((pathId: string): void => {
    const path = getStarterPath(pathId);
    setSelectedPath(path);
    progressRevisionRef.current = 0;
  }, []);

  const advanceStep = useCallback(async (): Promise<void> => {
    if (step === "goal") {
      if (user) {
        const result = await switchStarterPath(
          user.id,
          selectedPath.pathId,
          selectedPath.pathVersion,
          {
            kind: "lesson",
            targetId: selectedPath.lessonNodeId,
            pathId: selectedPath.pathId,
            reasonCode: "lesson_complete",
          },
        );
        progressRevisionRef.current = result.progress.revision;
        if (result.progress.lastCompletedStep === "lesson_complete") {
          setStep("practice");
          return;
        }
      }
      trackGoalsSelected([selectedPath.goalId]);
      trackStepCompleted("quiz_motivation", 1);
      trackStepViewed("lesson_complete", 2);
      setStep("lesson");
      return;
    }

    if (user) {
      const result = await completeStarterPathStep(
        {
          userId: user.id,
          pathId: selectedPath.pathId,
          pathVersion: selectedPath.pathVersion,
          status: "active",
          lastCompletedStep: "goal_selected",
          lastIdempotencyKey: null,
          nextAction: {
            kind: "lesson",
            targetId: selectedPath.lessonNodeId,
            pathId: selectedPath.pathId,
            reasonCode: "lesson_complete",
          },
          revision: progressRevisionRef.current,
          updatedAt: new Date().toISOString(),
        },
        "lesson_complete",
        selectedPath.nextAction,
        `starter-path-lesson-${user.id}-${Date.now()}`,
      );
      if (result.conflict) {
        const currentProgress = await loadStarterPathProgress(
          user.id,
          selectedPath.pathId,
          selectedPath.pathVersion,
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
  }, [selectedPath, step, trackGoalsSelected, trackStepCompleted, trackStepViewed, user]);

  const completePath = useCallback(async (): Promise<void> => {
    try {
      assertUserAvailable(user);
      await markCompleted({
        cfg: buildReminderConfig("evening"),
        reminderEnabled: false,
        motivation: "anxiety",
        reasons: ["anxiety"],
      });
      await setActiveStarterPath(user.id, selectedPath.pathId);
      posthog?.capture("starter_path_completed", {
        path_id: selectedPath.pathId,
        path_version: selectedPath.pathVersion,
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
        path_id: selectedPath.pathId,
        path_version: selectedPath.pathVersion,
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
    selectedPath,
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
        path={selectedPath}
        translate={translate}
        onBack={goBack}
      />
      <StarterPathContent
        step={step}
        path={selectedPath}
        translate={translate}
        hasCompletionError={hasCompletionError}
        isCompleting={isCompleting}
        onOpenPractice={openPractice}
        onContinueHome={continueHome}
        availablePaths={STARTER_PATHS}
        onSelectPath={selectPath}
      />
      <StarterPathFooter
        step={step}
        translate={translate}
        onAdvance={advanceStep}
      />
    </ScreenLayout>
  );
}
