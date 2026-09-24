import React from "react";
import RevenueCatUI from "react-native-purchases-ui";
import WelcomeStep from "../steps/WelcomeStep";
import MascotGreetingStep from "../steps/MascotGreetingStep";
import QuizMotivationStep from "../steps/QuizMotivationStep";
import QuizStressLevelStep from "../steps/QuizStressLevelStep";
import DailyGoalStep from "../steps/DailyGoalStep";
import PactSigningStep from "../steps/PactSigningStep";
import BuildingJourneyStep from "../steps/BuildingJourneyStep";
import PlanRevealStep from "../steps/PlanRevealStep";
import LessonCompleteStep from "../steps/LessonCompleteStep";
import NotificationPermissionStep from "../steps/NotificationPermissionStep";
import JourneyMapContainer from "@/src/domains/journey/ui/JourneyMapContainer";
import LetterFromFutureStep from "../steps/LetterFromFutureStep";
import WelcomeToHappyStep from "../steps/WelcomeToHappyStep";
import type {
  OnboardingStepName,
  OnboardingFormData,
  MotivationAnswer,
  StressLevel,
  DailyGoalMinutes,
  NotificationTime,
} from "../types";

export interface OnboardingStepRendererProps {
  currentStep: OnboardingStepName;
  formData: OnboardingFormData;
  derivedPlanName: string;
  onboardingCourseId?: string | null;
  goNext: () => void;
  updateMotivation: (m: MotivationAnswer) => void;
  updateStressLevel: (s: StressLevel) => void;
  updateDailyGoal: (d: DailyGoalMinutes) => void;
  handlePactCommit: () => void;
  updateNotificationTime: (t: NotificationTime) => void;
  updateTrialStarted: (started: boolean) => void;
  handleContinue: (skipped?: boolean) => void;
}

export const OnboardingStepRenderer: React.FC<OnboardingStepRendererProps> = ({
  currentStep,
  formData,
  derivedPlanName,
  onboardingCourseId,
  goNext,
  updateMotivation,
  updateStressLevel,
  updateDailyGoal,
  handlePactCommit,
  updateNotificationTime,
  updateTrialStarted,
  handleContinue,
}) => {
  switch (currentStep) {
    case "welcome":
      return <WelcomeStep />;
    case "mascot_greeting":
      return <MascotGreetingStep />;
    case "quiz_motivation":
      return (
        <QuizMotivationStep
          selected={formData.motivation}
          onSelect={updateMotivation}
          onAdvance={goNext}
        />
      );
    case "quiz_stress_level":
      return (
        <QuizStressLevelStep
          selected={formData.stressLevel}
          motivation={formData.motivation}
          onSelect={updateStressLevel}
          onAdvance={goNext}
        />
      );
    case "daily_goal":
      return (
        <DailyGoalStep
          selected={formData.dailyGoal}
          motivation={formData.motivation}
          onSelect={updateDailyGoal}
        />
      );
    case "pact_signing":
      return (
        <PactSigningStep
          dailyGoal={formData.dailyGoal}
          onCommit={handlePactCommit}
        />
      );
    case "building_journey":
      return (
        <BuildingJourneyStep
          onComplete={goNext}
          motivation={formData.motivation}
          stressLevel={formData.stressLevel}
        />
      );
    case "plan_reveal":
      return (
        <PlanRevealStep
          planName={derivedPlanName}
          motivation={formData.motivation}
          stressLevel={formData.stressLevel}
        />
      );
    case "lesson_complete":
      return <LessonCompleteStep />;
    case "notification_permission":
      return (
        <NotificationPermissionStep
          selectedTime={formData.notificationTime}
          onSelectTime={updateNotificationTime}
          stressTiming={formData.stressTiming}
        />
      );
    case "journey_map":
      // ponytail: pass real resolved course ID from user motivation so journey map renders exact course
      return (
        <JourneyMapContainer
          isOnboarding={true}
          onComplete={goNext}
          courseId={onboardingCourseId ?? undefined}
        />
      );
    case "letter_from_future":
      return (
        <LetterFromFutureStep
          dailyGoal={formData.dailyGoal}
          timing={formData.stressTiming}
        />
      );
    case "soft_paywall":
      return (
        <RevenueCatUI.Paywall
          options={{ displayCloseButton: true }}
          onPurchaseCompleted={() => {
            updateTrialStarted(true);
            goNext();
          }}
          onRestoreCompleted={() => {
            updateTrialStarted(true);
            goNext();
          }}
          onDismiss={() => {
            updateTrialStarted(false);
            goNext();
          }}
        />
      );
    case "welcome_to_happy":
      return (
        <WelcomeToHappyStep
          planName={derivedPlanName}
          dailyGoal={formData.dailyGoal}
          onLoginPress={() => handleContinue(false)}
        />
      );
    default:
      return null;
  }
};
