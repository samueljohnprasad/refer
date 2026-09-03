import React, { type ComponentType } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CourseExerciseFeedbackPanel } from "@/src/components/exercise/CourseExerciseFeedbackPanel";
import { CourseExerciseFooter } from "@/src/components/exercise/CourseExerciseFooter";
import { CourseExerciseHeader } from "@/src/components/exercise/CourseExerciseHeader";
import { readString } from "@/src/components/exercise/courseExerciseContent";
import { ExerciseSkipAction } from "@/src/components/exercise/ExerciseSkipAction";
import { FeedbackPanel } from "@/src/components/node/NodeEngineRouterPanels";
import { LessonScreen } from "@/src/components/ui/LessonScreen";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import type { Exercise } from "@/src/types/journeyV5";
import type { V1CheckStatus } from "@/src/types/journeyLearning";
import type { CourseExerciseCategoryConfig } from "@/src/components/exercise/courseExerciseCategoryConfig";

interface NodeExerciseScreenProps {
  Engine: ComponentType<V1CategoryEngineProps>;
  config?: CourseExerciseCategoryConfig | null;
  exercise: Exercise;
  savedResponse: unknown;
  isCourseExercise: boolean;
  progress: number;
  trailingLabel: string;
  primaryLabel: string;
  primaryLoading: boolean;
  ready: boolean;
  locked: boolean;
  hideFooter: boolean;
  showingFeedback: boolean;
  showingSkipAction: boolean;
  canContinueAfterExplanation: boolean;
  checkStatus: V1CheckStatus;
  explanationText: string | null;
  feedbackText: string | null;
  onClose?: () => void;
  onInteraction: V1CategoryEngineProps["onInteraction"];
  onPrimaryPress: () => void;
  onSkip?: () => void;
}

export function NodeExerciseScreen(props: NodeExerciseScreenProps) {
  const insets = useSafeAreaInsets();
  const usesInlineFeedback =
    props.config?.presentation?.showsFeedbackInline?.(
      props.exercise,
      props.savedResponse as Record<string, unknown> | null,
    ) ?? false;

  const configHideSkip =
    props.config?.presentation?.hideSkip?.(
      props.exercise,
      props.savedResponse as any,
    ) ?? false;
  const allowsSkip =
    props.exercise.content?.hideSkipAction !== true && !configHideSkip;

  const courseContentOffset = {
    marginTop: -Math.max(insets.top - COURSE_CONTENT_TOP_PADDING, 0),
  };
  const exerciseContent = (
    <props.Engine
      exercise={props.exercise}
      savedResponse={props.savedResponse}
      locked={props.locked}
      config={props.config ?? undefined}
      onInteraction={props.onInteraction}
    />
  );

  if (props.isCourseExercise) {
    return (
      <View className="flex-1 bg-brand-surface">
        <CourseExerciseHeader
          progress={props.progress}
          trailingLabel={props.trailingLabel}
          onClose={props.onClose}
        />
        <LessonScreen className="flex-1 bg-brand-surface" hideHeader hideFooter>
          <View style={courseContentOffset}>
            {exerciseContent}
            {props.showingFeedback ? (
              <CourseExerciseFeedbackPanel
                canContinueAfterExplanation={props.canContinueAfterExplanation}
                checkStatus={props.checkStatus}
                explanationText={props.explanationText}
                feedbackText={usesInlineFeedback ? null : props.feedbackText}
                successTitle={
                  usesInlineFeedback
                    ? null
                    : readString(props.exercise.content?.feedbackTitle)
                }
                successTakeaway={
                  usesInlineFeedback
                    ? null
                    : readString(props.exercise.content?.feedbackTakeaway)
                }
              />
            ) : null}
            <View className={props.hideFooter ? "h-16" : "h-[132px]"} />
          </View>
        </LessonScreen>
        <CourseExerciseFooter
          hidePrimary={props.hideFooter}
          primaryLabel={props.primaryLabel}
          primaryDisabled={!props.ready}
          primaryLoading={props.primaryLoading}
          onPrimaryPress={props.onPrimaryPress}
          skipLabel={readString(props.exercise.content?.skipLabel) ?? undefined}
          onSkip={allowsSkip ? props.onSkip : undefined}
        />
      </View>
    );
  }

  return (
    <LessonScreen
      progress={props.progress}
      trailingLabel={props.trailingLabel}
      onClose={props.onClose}
      primaryLabel={props.primaryLabel}
      primaryDisabled={!props.ready}
      primaryLoading={props.primaryLoading}
      onPrimaryPress={props.onPrimaryPress}
      status="default"
      hideFooter={props.hideFooter}
    >
      {exerciseContent}
      {props.showingFeedback ? (
        <FeedbackPanel
          canContinueAfterExplanation={props.canContinueAfterExplanation}
          checkStatus={props.checkStatus}
          explanationText={props.explanationText}
          feedbackText={props.feedbackText}
        />
      ) : null}
      {props.showingSkipAction && props.onSkip ? (
        <ExerciseSkipAction onSkip={props.onSkip} />
      ) : null}
    </LessonScreen>
  );
}

const COURSE_CONTENT_TOP_PADDING = 12;
