import React, { type ComponentType } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CourseExerciseFeedbackPanel } from "@/src/components/exercise/CourseExerciseFeedbackPanel";
import { CourseExerciseFooter } from "@/src/components/exercise/CourseExerciseFooter";
import { CourseExerciseHeader } from "@/src/components/exercise/CourseExerciseHeader";
import { readString } from "@/src/components/exercise/courseExerciseContent";
import { COURSE_EXERCISE_COLORS } from "@/src/components/exercise/courseExerciseTheme";
import { ExerciseSkipAction } from "@/src/components/exercise/ExerciseSkipAction";
import { FeedbackPanel } from "@/src/components/node/NodeEngineRouterPanels";
import { LessonScreen } from "@/src/components/ui/LessonScreen";
import type { V1CategoryEngineProps } from "@/src/domains/journey/learning/v1LearningEngineTypes";
import type { Exercise } from "@/src/types/journeyV5";
import type { V1CheckStatus } from "@/src/types/journeyLearning";

interface NodeExerciseScreenProps {
  Engine: ComponentType<V1CategoryEngineProps>;
  exercise: Exercise;
  savedResponse: unknown;
  isCourseExercise: boolean;
  progress: number;
  trailingLabel: string;
  primaryLabel: string;
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
  onSkip: () => void;
}

export function NodeExerciseScreen(props: NodeExerciseScreenProps) {
  const insets = useSafeAreaInsets();
  const courseContentOffset = {
    marginTop: -Math.max(insets.top - COURSE_CONTENT_TOP_PADDING, 0),
  };
  const exerciseContent = (
    <props.Engine
      exercise={props.exercise}
      savedResponse={props.savedResponse}
      locked={props.locked}
      onInteraction={props.onInteraction}
    />
  );

  if (props.isCourseExercise) {
    return (
      <View style={courseScreenStyle}>
        <CourseExerciseHeader
          progress={props.progress}
          trailingLabel={props.trailingLabel}
          onClose={props.onClose}
        />
        <LessonScreen
          style={courseScreenStyle}
          hideHeader
          hideFooter
        >
          <View style={courseContentOffset}>
            {exerciseContent}
            {props.showingFeedback ? (
              <CourseExerciseFeedbackPanel
                canContinueAfterExplanation={props.canContinueAfterExplanation}
                checkStatus={props.checkStatus}
                explanationText={props.explanationText}
                feedbackText={props.feedbackText}
                successTitle={readString(props.exercise.content?.feedbackTitle)}
                successTakeaway={readString(
                  props.exercise.content?.feedbackTakeaway,
                )}
              />
            ) : null}
            <View style={props.hideFooter ? shortFooterSpacer : footerSpacer} />
          </View>
        </LessonScreen>
        <CourseExerciseFooter
          hidePrimary={props.hideFooter}
          primaryLabel={props.primaryLabel}
          primaryDisabled={!props.ready}
          onPrimaryPress={props.onPrimaryPress}
          onSkip={props.onSkip}
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
      {props.showingSkipAction ? (
        <ExerciseSkipAction onSkip={props.onSkip} />
      ) : null}
    </LessonScreen>
  );
}

const courseScreenStyle = {
  flex: 1,
  backgroundColor: COURSE_EXERCISE_COLORS.background,
} as const;

const footerSpacer = { height: 132 } as const;
const shortFooterSpacer = { height: 64 } as const;
const COURSE_CONTENT_TOP_PADDING = 12;
