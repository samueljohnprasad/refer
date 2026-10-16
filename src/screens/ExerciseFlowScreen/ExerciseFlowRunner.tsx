import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { Text } from "@/src/components/ui/Text";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useExerciseCopy } from "@/src/hooks/useExerciseCopy";
import { useExerciseFlow } from "@/src/hooks/useExerciseFlow";
import { useExerciseMutation } from "@/src/hooks/useExerciseMutation";
import { useExerciseAI } from "@/src/hooks/useExerciseAI";
import type {
  ExerciseConfig,
  ExerciseEntry,
  StepProps,
} from "@/src/types/exerciseFlow";
import { usePostHog } from "posthog-react-native";
import { requestReviewForMilestone } from "@/src/hooks/useReviewPrompt";
import { AnimatedStepContainer } from "./AnimatedStepContainer";
import { useExerciseFlowActions } from "./useExerciseFlowActions";
import { useExerciseNavigationGuard } from "./hooks/useExerciseNavigationGuard";
import { LessonScreen } from "@/src/components/ui/LessonScreen";
import { SEMANTIC_COLORS } from "@/src/theme/colors";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons";
import { useXPOptional } from "@/src/context/XPContext";
import { ExerciseCompletionContainer } from "./components/ExerciseCompletionContainer";

interface ResolvedExerciseFlowScreenProps {
  config: ExerciseConfig<any>;
  existingEntry?: ExerciseEntry | null;
  readOnly: boolean;
  textOnly: boolean;
  practiceSessionId?: string;
  pathId?: string;
  pathVersion?: number;
  practiceSource?: string;
  practiceId?: string;
}

export const ExerciseFlowRunner: React.FC<ResolvedExerciseFlowScreenProps> = ({
  config,
  existingEntry,
  readOnly,
  textOnly,
  practiceSessionId,
  pathId,
  pathVersion,
  practiceSource,
  practiceId,
}) => {
  const router = useRouter();
  const { t } = useTranslation("exercises");
  const translateCopy = useExerciseCopy();
  const exerciseType = config.type;
  const isConfirmedExitRef = useRef(false);
  const [isConfirmedExit, setIsConfirmedExit] = React.useState(false);
  // ─── Flow state ───────────────────────────────────────────────────
  const flow = useExerciseFlow(config as ExerciseConfig<any>, existingEntry, readOnly);

  const [primaryOverrideState, setPrimaryOverrideState] = React.useState<{
    stepIndex: number;
    override: { label: string; action: () => void; disabled: boolean } | null;
  } | null>(null);

  // ─── Lesson-complete celebration ──────────────────────────────────
  const [celebration, setCelebration] = React.useState<{
    xp: number;
    durationMs: number;
  } | null>(null);
  const exerciseStartedAtRef = useRef(Date.now());

  // ponytail: trigger Day-1 App Store review prompt 2.0s after celebration modal renders
  useEffect(() => {
    if (!celebration) return;
    const timer = setTimeout(() => {
      void requestReviewForMilestone("first_exercise_completed");
    }, 2000);
    return () => clearTimeout(timer);
  }, [celebration]);

  const setPrimaryOverride = React.useCallback(
    (override: { label: string; action: () => void; disabled: boolean } | null) => {
      setPrimaryOverrideState({ stepIndex: flow.currentStepIndex, override });
    },
    [flow.currentStepIndex]
  );

  const primaryOverride =
    primaryOverrideState?.stepIndex === flow.currentStepIndex
      ? primaryOverrideState.override
      : null;

  // ─── Mutation ─────────────────────────────────────────────────────
  const { save, isSaving } = useExerciseMutation();
  const xp = useXPOptional();
  const posthog = usePostHog();

  // ─── AI ───────────────────────────────────────────────────────────
  const currentStep = config?.steps[flow.currentStepIndex];
  const ai = useExerciseAI({
    steps: config.steps,
    currentStepIndex: flow.currentStepIndex,
    response: flow.response,
    readOnly,
    disabled: textOnly,
  });
  const isFinalStep = flow.currentStepIndex === flow.totalSteps - 1;

  const exitScreen = useCallback(() => {
    isConfirmedExitRef.current = true;
    setIsConfirmedExit(true);
    router.back();
  }, [router]);

  const { handleClose, handleSave, handleNavigateDeeper, exerciseTitle } =
    useExerciseFlowActions({
      config,
      existingEntry,
      exerciseType,
      readOnly,
      textOnly,
      flow,
      save,
      router,
      xp,
      posthog,
      isConfirmedExitRef,
      exerciseStartedAtRef,
      setCelebration,
      exitScreen,
      practiceSessionId,
      pathId,
      pathVersion,
      practiceSource,
      practiceId,
    });

  useExerciseNavigationGuard({
    readOnly,
    currentStepIndex: flow.currentStepIndex,
    isConfirmedExit,
    isConfirmedExitRef,
    onClose: handleClose,
  });

  // ─── Step rendering ───────────────────────────────────────────────
  const StepComponent = currentStep?.component;
  const countableStepMeta = useMemo(() => {
    const countableSteps = config.steps.filter((step) => !step.excludeFromProgress);
    const countableStepIndex = countableSteps.findIndex(
      (step) => step.id === currentStep?.id,
    );

    if (countableStepIndex < 0 || countableSteps.length === 0) {
      return null;
    }

    return {
      stepIndex: countableStepIndex,
      totalSteps: countableSteps.length,
    };
  }, [config.steps, currentStep?.id]);

  const stepProps: StepProps<any> = useMemo(
    () => ({
      response: flow.response,
      onUpdate: flow.updateResponse,
      onNext: readOnly ? handleClose : isFinalStep ? handleSave : flow.goNext,
      onBack: flow.goBack,
      onClose: handleClose,
      onNavigateDeeper: handleNavigateDeeper,
      canGoBack: flow.canGoBack,
      isValid: flow.isCurrentStepValid,
      progress: flow.progress,
      stepIndex: countableStepMeta?.stepIndex ?? flow.currentStepIndex,
      totalSteps: countableStepMeta?.totalSteps ?? flow.totalSteps,
      aiSuggestions: ai.suggestions,
      isAiLoading: ai.isLoading,
      aiLoadingMessage: ai.loadingMessage,
      aiError: ai.error,
      isSaving,
      readOnly,
      textOnly,
      autoFocus: currentStep?.autoFocus ?? !readOnly,
      setPrimaryOverride,
    }),
    [
      flow,
      ai.suggestions,
      ai.isLoading,
      ai.loadingMessage,
      ai.error,
      isSaving,
      readOnly,
      textOnly,
      handleClose,
      handleSave,
      handleNavigateDeeper,
      isFinalStep,
      countableStepMeta,
      currentStep?.autoFocus,
    ],
  );

  // ─── Guards ───────────────────────────────────────────────────────
  // (Loading is now handled by the parent component)

  const primaryLabel = currentStep?.nextLabel
    ? translateCopy(currentStep.nextLabel)
    : isFinalStep
      ? t("flow.ui.finish")
      : t("flow.ui.continue");

  // In readOnly mode, the primary button is always "Done" and just closes the screen
  const defaultPrimaryPress = readOnly ? handleClose : isFinalStep ? handleSave : flow.goNext;
  
  const finalPrimaryLabel = primaryOverride
    ? translateCopy(primaryOverride.label)
    : readOnly
      ? t("flow.ui.done")
      : primaryLabel;
  const finalPrimaryPress = primaryOverride ? primaryOverride.action : defaultPrimaryPress;
  const finalPrimaryDisabled = primaryOverride ? primaryOverride.disabled : (!flow.isCurrentStepValid || isSaving);

  return (
    <>
      <LessonScreen
        className="flex-1"
        style={{ backgroundColor: config.backgroundColor ?? "#FFFFFF" }}
        hideHeader={currentStep?.hideHeader || readOnly}
        hideFooter={currentStep?.hideFooter}
        progress={flow.progress}
        onClose={handleClose}
        backButtonVariant="close-icon"
        primaryLabel={finalPrimaryLabel}
        onPrimaryPress={finalPrimaryPress}
        primaryDisabled={finalPrimaryDisabled}
        primaryLoading={isSaving}
        primaryRightIcon={
          isFinalStep && !isSaving ? (
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={20} color={SEMANTIC_COLORS.surface.primary} strokeWidth={2} />
          ) : undefined
        }
        secondaryLabel={
          readOnly
            ? undefined
            : isFinalStep
              ? currentStep?.secondaryLabel
                ? translateCopy(currentStep.secondaryLabel)
                : t("flow.ui.editAnswers")
              : flow.canGoBack
                ? t("flow.ui.back")
                : undefined
        }
        onSecondaryPress={flow.canGoBack ? flow.goBack : undefined}
      >
        <AnimatedStepContainer
          stepIndex={flow.currentStepIndex}
          className="pb-4"
        >
          {StepComponent ? (
            <StepComponent {...stepProps} />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text className="text-slate-400">{t("flow.ui.unknownStep")}</Text>
            </View>
          )}
        </AnimatedStepContainer>
      </LessonScreen>

      <ExerciseCompletionContainer
        celebration={celebration}
        exerciseTitle={exerciseTitle}
        pathId={pathId}
        pathVersion={pathVersion}
        practiceSessionId={practiceSessionId}
        practiceSource={practiceSource}
        practiceId={practiceId}
        onExit={exitScreen}
        continueLabel={t("flow.ui.continue")}
        celebrationTitle={t("flow.ui.celebrationTitle")}
        celebrationMessage={t("flow.ui.celebrationMessage")}
      />
    </>
  );
};

ExerciseFlowRunner.displayName = "ExerciseFlowRunner";
