import React, { useCallback } from "react";
import {
  resolveV1ExerciseCategory,
  v1ExerciseCategoryEngineRegistry,
} from "@/src/components/exercise/v1ExerciseCategoryEngineRegistry";
import { ExerciseSupportRow } from "@/src/components/exercise/ExerciseSupportRow";
import { LessonScreen } from "@/src/components/ui/LessonScreen";
import type { Exercise } from "@/src/types/journeyV5";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearV1SessionDraft } from "@/src/domains/journey/learning/sessionDraftStore";
import {
  checkV1LearningAnswer,
  clearV1LearningSession,
  completeV1LearningItem,
  recordV1LearningInteraction,
  resetV1LearningAnswer,
  showV1LearningSupport,
  skipV1LearningItem,
} from "@/src/domains/journey/learning/v1LearningSessionSlice";
import {
  V1ActivityResolutionEnum,
  V1CheckStatusEnum,
  V1SupportLevelEnum,
} from "@/src/types/journeyLearning";
import {
  buildResolvedResponse,
  buildSkippedResponse,
  getCanContinueAfterSupport,
  getCompletionResolution,
  getFeedbackText,
  getPrimaryLabel,
  readMaxAttempts,
  readSupportText,
} from "@/src/components/node/NodeEngineRouter.helpers";
import {
  FeedbackPanel,
  LoadingPracticeScreen,
  PracticeDataErrorScreen,
  SupportPanel,
} from "@/src/components/node/NodeEngineRouterPanels";
import { useV1NodeSessionDraft } from "@/src/components/node/useV1NodeSessionDraft";

interface NodeEngineRouterProps {
  nodeId: string;
  exercises: Exercise[];
  initialSavedResponses?: Record<string, unknown>;
  onNodeComplete: (responses: Record<string, unknown>) => void;
  onClose?: () => void;
}

const EMPTY_RESPONSES: Record<string, unknown> = {};

export function NodeEngineRouter({
  nodeId,
  exercises,
  initialSavedResponses = EMPTY_RESPONSES,
  onNodeComplete,
  onClose,
}: NodeEngineRouterProps) {
  const dispatch = useAppDispatch();
  const session = useAppSelector(
    (state) => state.v1LearningSessions.byNodeId[nodeId],
  );

  const currentIndex = session?.currentIndex ?? 0;
  const responses = session?.responses ?? initialSavedResponses;
  const currentResponse = session?.currentResponse ?? null;
  const ready = session?.ready === true;
  const checkStatus = session?.checkStatus ?? V1CheckStatusEnum.Idle;
  const supportLevel = session?.supportLevel ?? V1SupportLevelEnum.None;
  const supportKey = session?.supportKey ?? null;
  const attemptCount = session?.attemptCount ?? 0;
  const currentStartedAtMs = session?.currentStartedAtMs ?? Date.now();
  const firstAnsweredAtMs = session?.firstAnsweredAtMs ?? null;
  const currentExercise = exercises[currentIndex];
  const category = currentExercise
    ? resolveV1ExerciseCategory(currentExercise)
    : null;
  const categoryConfig = category
    ? v1ExerciseCategoryEngineRegistry[category]
    : null;
  const Engine = categoryConfig?.engine;
  const lastExercise = currentIndex === exercises.length - 1;
  const maxAttempts = readMaxAttempts(currentExercise);
  const canContinueAfterSupport = getCanContinueAfterSupport({
    attemptCount,
    checkStatus,
    maxAttempts,
    supportLevel,
  });
  const feedbackText = getFeedbackText(currentExercise, checkStatus);
  const supportText = supportKey
    ? readSupportText(currentExercise, supportKey, categoryConfig?.supportFallback)
    : null;
  const showingFeedback = checkStatus !== V1CheckStatusEnum.Idle;
  const showingSupportRow = !showingFeedback && !ready;

  useV1NodeSessionDraft({
    dispatch,
    exerciseCount: exercises.length,
    exerciseIds: exercises.map((exercise) => exercise.id),
    initialSavedResponses,
    nodeId,
    session,
  });

  const handleInteraction = useCallback(
    (response: Record<string, unknown>, isReady = true) => {
      dispatch(
        recordV1LearningInteraction({
          nodeId,
          response,
          ready: isReady,
        }),
      );
    },
    [dispatch, nodeId],
  );

  const handlePrimaryPress = async () => {
    if (!currentExercise || !currentResponse) {
      return;
    }

    if (checkStatus === V1CheckStatusEnum.Idle) {
      dispatch(checkV1LearningAnswer({ nodeId, maxAttempts }));
      return;
    }

    if (checkStatus === V1CheckStatusEnum.Error) {
      if (canContinueAfterSupport) {
        await completeCurrentExercise(
          buildResolvedResponse(
            currentExercise,
            currentResponse,
            V1ActivityResolutionEnum.SupportedComplete,
            attemptCount,
            supportLevel,
            currentStartedAtMs,
            firstAnsweredAtMs,
          ),
        );
        return;
      }

      dispatch(resetV1LearningAnswer({ nodeId }));
      return;
    }

    await completeCurrentExercise(
      buildResolvedResponse(
        currentExercise,
        currentResponse,
        getCompletionResolution(attemptCount, supportLevel),
        attemptCount,
        supportLevel,
        currentStartedAtMs,
        firstAnsweredAtMs,
      ),
    );
  };

  const completeCurrentExercise = async (resolvedResponse: Record<string, unknown>) => {
    if (!currentExercise) {
      return;
    }

    const nextResponses = {
      ...responses,
      [currentExercise.id]: resolvedResponse,
    };

    if (lastExercise) {
      await clearV1SessionDraft(nodeId);
      dispatch(clearV1LearningSession({ nodeId }));
      onNodeComplete(nextResponses);
      return;
    }

    dispatch(
      completeV1LearningItem({
        nodeId,
        exerciseId: currentExercise.id,
        response: resolvedResponse,
      }),
    );
  };

  const showClue = () => {
    dispatch(
      showV1LearningSupport({
        nodeId,
        supportLevel:
          supportLevel === V1SupportLevelEnum.None
            ? V1SupportLevelEnum.Clue
            : supportLevel,
      }),
    );
  };

  const makeEasier = () => {
    dispatch(
      showV1LearningSupport({
        nodeId,
        supportLevel: V1SupportLevelEnum.Easier,
      }),
    );
  };

  const skipForNow = async () => {
    if (!currentExercise) {
      return;
    }

    const nextResponses = {
      ...responses,
      [currentExercise.id]: buildSkippedResponse(
        currentExercise,
        supportLevel,
        currentStartedAtMs,
      ),
    };

    if (lastExercise) {
      await clearV1SessionDraft(nodeId);
      dispatch(clearV1LearningSession({ nodeId }));
      onNodeComplete(nextResponses);
      return;
    }

    dispatch(skipV1LearningItem({
      nodeId,
      exerciseId: currentExercise.id,
      response: nextResponses[currentExercise.id] as Record<string, unknown>,
    }));
  };

  if (!session?.hydrated) {
    return <LoadingPracticeScreen onClose={onClose} />;
  }

  if (!currentExercise || !Engine || !categoryConfig) {
    return (
      <PracticeDataErrorScreen
        message="This node must use a configured v1 exercise category."
        onClose={onClose}
      />
    );
  }

  return (
    <LessonScreen
      progress={(currentIndex + 1) / exercises.length}
      trailingLabel={`${currentIndex + 1} of ${exercises.length}`}
      onClose={onClose}
      primaryLabel={getPrimaryLabel({
        canContinueAfterSupport,
        checkStatus,
        lastExercise,
      })}
      primaryDisabled={!ready}
      onPrimaryPress={handlePrimaryPress}
      status="default"
    >
      {showingFeedback ? (
        <FeedbackPanel
          canContinueAfterSupport={canContinueAfterSupport}
          checkStatus={checkStatus}
          feedbackText={feedbackText}
          supportText={supportText}
        />
      ) : (
        <>
          <SupportPanel supportText={supportText} />
          <Engine
            exercise={currentExercise}
            savedResponse={currentResponse ?? responses[currentExercise.id]}
            supportLevel={supportLevel}
            locked={false}
            onInteraction={handleInteraction}
          />
          {showingSupportRow ? (
            <ExerciseSupportRow
              onShowClue={showClue}
              onMakeEasier={makeEasier}
              onSkip={skipForNow}
              clueDisabled={supportLevel !== V1SupportLevelEnum.None}
              easierDisabled={
                supportLevel === V1SupportLevelEnum.Easier ||
                supportLevel === V1SupportLevelEnum.Worked
              }
            />
          ) : null}
        </>
      )}
    </LessonScreen>
  );
}
