// src/components/ContinueJourneyCard/types.ts
// ponytail: minimal types for Continue Your Journey card states and props

export type JourneyCardStateType =
  | "active_next_activity" // State A
  | "no_active_course"     // State B
  | "course_completed"     // State C
  | "loading"              // State D
  | "error_fallback";      // State E

export interface ActiveNextActivityCardState {
  type: "active_next_activity";
  courseId: string;
  courseTitle: string;
  courseArtworkKey: string | null;
  courseColorHex: string;
  activityId: string;
  activityTitle: string;
  activityType: string;
  estimatedMins: number | null;
  isInProgress: boolean;
}

export interface NoActiveCourseCardState {
  type: "no_active_course";
}

export interface CourseCompletedCardState {
  type: "course_completed";
  courseId: string;
  courseTitle: string;
}

export interface LoadingCardState {
  type: "loading";
}

export interface ErrorFallbackCardState {
  type: "error_fallback";
}

export type ContinueJourneyCardState =
  | ActiveNextActivityCardState
  | NoActiveCourseCardState
  | CourseCompletedCardState
  | LoadingCardState
  | ErrorFallbackCardState;

export interface ContinueJourneyCardActions {
  handleCardPress: () => void;
  handleRetry: () => void;
}

export interface UseContinueJourneyViewModelResult {
  state: ContinueJourneyCardState;
  actions: ContinueJourneyCardActions;
}

export interface ContinueJourneyCardProps {
  className?: string;
  testID?: string;
}
