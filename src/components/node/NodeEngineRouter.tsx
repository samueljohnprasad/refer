import React, { useCallback } from "react";
import { courseExerciseCategoryEngineRegistry } from "@/src/components/exercise/courseExerciseCategoryEngineRegistry";
import type { Exercise } from "@/src/types/journeyV5";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { clearV1SessionDraft } from "@/src/domains/journey/learning/sessionDraftStore";
import type { V1InteractionOptions } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import {
  checkV1LearningAnswer,
  clearV1LearningSession,
  completeV1LearningItem,
  recordV1LearningInteraction,
  resetV1LearningAnswer,
  skipV1LearningItem,
} from "@/src/domains/journey/learning/v1LearningSessionSlice";
import { V1CheckStatusEnum } from "@/src/types/journeyLearning";
import {
  buildResolvedResponse,
  buildRetryResponse,
  buildSkippedResponse,
  completesOnPrimaryInteraction,
  getCanContinueAfterExplanation,
  getDisplayPrimaryLabel,
  getFeedbackText,
  getPrimaryLabel,
  readWorkedExplanation,
} from "@/src/components/node/NodeEngineRouter.helpers";
import {
  LoadingPracticeScreen,
  PracticeDataErrorScreen,
} from "@/src/components/node/NodeEngineRouterPanels";
import { NodeExerciseScreen } from "@/src/components/node/NodeExerciseScreen";
import { useV1NodeSessionDraft } from "@/src/components/node/useV1NodeSessionDraft";
import { resolveCourseExerciseCategory } from "@/src/domains/journey/learning/courseExerciseCategoryResolver";
import { getCoursePrimaryTransition } from "@/src/domains/journey/learning/courseExercisePrimaryTransition";
import { isCourseExerciseCategory } from "@/src/types/courseExercises";

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
  const attemptCount = session?.attemptCount ?? 0;
  const currentExercise = exercises[currentIndex];
  const category = currentExercise
    ? resolveCourseExerciseCategory(currentExercise)
    : null;
  const categoryConfig = category
    ? courseExerciseCategoryEngineRegistry[category]
    : null;
  const Engine = categoryConfig?.engine;
  const lastExercise = currentIndex === exercises.length - 1;
  const canContinueAfterExplanation = getCanContinueAfterExplanation({
    attemptCount,
    checkStatus,
  });
  const feedbackText = getFeedbackText(
    currentExercise,
    checkStatus,
    currentResponse,
  );
  const explanationText = canContinueAfterExplanation
    ? readWorkedExplanation(currentExercise)
    : null;
  const showingFeedback = checkStatus !== V1CheckStatusEnum.Idle;
  const showingSkipAction = !showingFeedback && !ready;

  useV1NodeSessionDraft({
    dispatch,
    exerciseCount: exercises.length,
    exerciseIds: exercises.map((exercise) => exercise.id),
    initialSavedResponses,
    nodeId,
    session,
  });

  const handleInteraction = useCallback(
    (
      response: Record<string, unknown>,
      isReady = true,
      options?: V1InteractionOptions,
    ) => {
      dispatch(
        recordV1LearningInteraction({
          nodeId,
          response,
          ready: isReady,
        }),
      );
      if (options?.revealImmediately) {
        dispatch(checkV1LearningAnswer({ nodeId }));
      }
    },
    [dispatch, nodeId],
  );

  const handlePrimaryPress = async () => {
    if (!currentExercise || !currentResponse) {
      return;
    }

    if (checkStatus === V1CheckStatusEnum.Idle) {
      const courseTransition = getCoursePrimaryTransition(
        currentExercise,
        currentResponse,
      );
      if (courseTransition?.kind === "response") {
        dispatch(
          recordV1LearningInteraction({
            nodeId,
            response: courseTransition.response,
            ready: courseTransition.ready,
          }),
        );
        return;
      }
      if (courseTransition?.kind === "check") {
        dispatch(checkV1LearningAnswer({ nodeId }));
        return;
      }

      if (completesOnPrimaryInteraction(currentExercise)) {
        await completeCurrentExercise(
          buildResolvedResponse(currentExercise, currentResponse, attemptCount),
        );
        return;
      }

      dispatch(checkV1LearningAnswer({ nodeId }));
      return;
    }

    if (checkStatus === V1CheckStatusEnum.Error) {
      if (canContinueAfterExplanation) {
        await completeCurrentExercise(
          buildResolvedResponse(currentExercise, currentResponse, attemptCount),
        );
        return;
      }

      const retryResponse = buildRetryResponse(
        currentExercise,
        currentResponse,
      );
      dispatch(resetV1LearningAnswer({ nodeId }));
      if (retryResponse) {
        dispatch(
          recordV1LearningInteraction({
            nodeId,
            response: retryResponse,
            ready: false,
          }),
        );
      }
      return;
    }

    await completeCurrentExercise(
      buildResolvedResponse(currentExercise, currentResponse, attemptCount),
    );
  };

  const completeCurrentExercise = async (
    resolvedResponse: Record<string, unknown>,
  ) => {
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

  const skipForNow = async () => {
    if (!currentExercise) {
      return;
    }

    const nextResponses = {
      ...responses,
      [currentExercise.id]: buildSkippedResponse(currentExercise),
    };

    if (lastExercise) {
      await clearV1SessionDraft(nodeId);
      dispatch(clearV1LearningSession({ nodeId }));
      onNodeComplete(nextResponses);
      return;
    }

    dispatch(
      skipV1LearningItem({
        nodeId,
        exerciseId: currentExercise.id,
        response: nextResponses[currentExercise.id] as Record<string, unknown>,
      }),
    );
  };

  if (!session?.hydrated) {
    return <LoadingPracticeScreen onClose={onClose} />;
  }

  if (!currentExercise || !Engine || !categoryConfig) {
    return (
      <PracticeDataErrorScreen
        message="This lesson uses an unsupported exercise category."
        onClose={onClose}
      />
    );
  }

  return (
    <NodeExerciseScreen
      Engine={Engine}
      exercise={currentExercise}
      savedResponse={currentResponse ?? responses[currentExercise.id]}
      isCourseExercise={category !== null && isCourseExerciseCategory(category)}
      progress={(currentIndex + 1) / exercises.length}
      trailingLabel={`${currentIndex + 1} of ${exercises.length}`}
      onClose={onClose}
      primaryLabel={getDisplayPrimaryLabel(
        currentExercise,
        checkStatus === V1CheckStatusEnum.Idle ? currentResponse : null,
        ready,
        getPrimaryLabel({
          canContinueAfterExplanation,
          checkStatus,
          exercise: currentExercise,
          lastExercise,
        }),
      )}
      onPrimaryPress={handlePrimaryPress}
      ready={ready}
      locked={showingFeedback}
      hideFooter={
        currentExercise.content?.hideFooterUntilReady === true && !ready
      }
      showingFeedback={showingFeedback}
      showingSkipAction={showingSkipAction}
      canContinueAfterExplanation={canContinueAfterExplanation}
      checkStatus={checkStatus}
      explanationText={explanationText}
      feedbackText={feedbackText}
      onInteraction={handleInteraction}
      onSkip={skipForNow}
    />
  );
}
