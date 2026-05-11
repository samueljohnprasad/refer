import React, { useCallback, useEffect, useRef } from "react";
import { View, TouchableOpacity, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";

import { useOnboardingFlow } from "./hooks/useOnboardingFlow";
import { useOnboardingAnalytics } from "./hooks/useOnboardingAnalytics";
import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import { ONBOARDING_STEPS } from "./constants";

import StageProgressBar from "./components/StageProgressBar";
import TactileButton from "./components/TactileButton";

import WelcomeStep from "./steps/WelcomeStep";
import MascotGreetingStep from "./steps/MascotGreetingStep";
import QuizMotivationStep from "./steps/QuizMotivationStep";
import QuizStressLevelStep from "./steps/QuizStressLevelStep";
import QuizExperienceStep from "./steps/QuizExperienceStep";
import QuizTimingStep from "./steps/QuizTimingStep";
import DailyGoalStep from "./steps/DailyGoalStep";
import PactSigningStep from "./steps/PactSigningStep";
import BuildingJourneyStep from "./steps/BuildingJourneyStep";
import PlanRevealStep from "./steps/PlanRevealStep";
import MoodCheckLessonStep from "./steps/MoodCheckLessonStep";
import AIInsightStep from "./steps/AIInsightStep";
import LessonCompleteStep from "./steps/LessonCompleteStep";
import NotificationPermissionStep from "./steps/NotificationPermissionStep";
import JourneyMapStep from "./steps/JourneyMapStep";
import LetterFromFutureStep from "./steps/LetterFromFutureStep";
import SoftPaywallStep from "./steps/SoftPaywallStep";
import WelcomeToHappyStep from "./steps/WelcomeToHappyStep";

interface OnboardingScreenProps {
  onComplete: () => Promise<void>;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { width: screenWidth } = useWindowDimensions();
  const analytics = useOnboardingAnalytics();
  const { markCompleted } = useCompleteOnboarding();
  const [loading, setLoading] = React.useState(false);

  const {
    currentStepIndex,
    currentStep,
    currentStage,
    totalSteps,
    isLastStep,
    formData,
    derivedPlanName,
    goNext,
    goBack,
    updateMotivation,
    updateStressLevel,
    updateExperience,
    updateTiming,
    updateDailyGoal,
    updatePactSigned,
    updateFeeling,
    updateNotificationTime,
    updatePricingTier,
    updateTrialStarted,
  } = useOnboardingFlow();

  const currentStepConfig = ONBOARDING_STEPS[currentStepIndex];
  const bgColor = useSharedValue(ONBOARDING_STEPS[0].backgroundColor);
  const slideX = useSharedValue(0);
  const slideOpacity = useSharedValue(1);
  const prevStepRef = useRef(currentStepIndex);
  const direction = useRef<"forward" | "backward">("forward");

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: bgColor.value,
  }));

  const stepContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
    opacity: slideOpacity.value,
  }));

  useEffect(() => {
    const isForward = currentStepIndex > prevStepRef.current;
    direction.current = isForward ? "forward" : "backward";
    prevStepRef.current = currentStepIndex;

    bgColor.value = withTiming(currentStepConfig.backgroundColor, {
      duration: 400,
      easing: Easing.out(Easing.cubic),
    });

    // Slide transition: enter from right (forward) or left (backward)
    const enterFrom = isForward ? screenWidth * 0.3 : -screenWidth * 0.3;
    slideX.value = enterFrom;
    slideOpacity.value = 0;
    slideX.value = withSpring(0, { damping: 20, stiffness: 200 });
    slideOpacity.value = withTiming(1, {
      duration: 250,
      easing: Easing.out(Easing.cubic),
    });

    analytics.trackStepViewed(currentStep, currentStepIndex);
  }, [currentStepIndex]);

  const handleContinue = useCallback(async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    analytics.trackStepCompleted(currentStep, currentStepIndex);

    if (isLastStep) {
      try {
        setLoading(true);
        await markCompleted({
          name: "",
          reasons: formData.motivation ? [formData.motivation] : [],
          cfg: {} as never,
        });
        await onComplete();
      } catch (error) {
        console.error("[Onboarding] Failed to complete:", error);
      } finally {
        setLoading(false);
      }
      return;
    }

    goNext();
  }, [
    isLastStep,
    currentStep,
    currentStepIndex,
    formData,
    markCompleted,
    onComplete,
    goNext,
    analytics,
  ]);

  const handleBack = useCallback(() => {
    Haptics.selectionAsync();
    goBack();
  }, [goBack]);

  const handlePactCommit = useCallback(() => {
    updatePactSigned();
    setTimeout(goNext, 1200);
  }, [updatePactSigned, goNext]);

  const handlePaywallTrial = useCallback(() => {
    updateTrialStarted(true);
    goNext();
  }, [updateTrialStarted, goNext]);

  const handlePaywallFree = useCallback(() => {
    updateTrialStarted(false);
    goNext();
  }, [updateTrialStarted, goNext]);

  const canContinue = currentStepConfig.isContinueEnabled?.(formData) ?? true;
  const showBackButton = currentStepConfig.showBackButton;
  const showContinueButton = currentStepConfig.showContinueButton;

  const renderStep = (): React.ReactNode => {
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
            onSelect={updateStressLevel}
            onAdvance={goNext}
          />
        );
      case "quiz_experience":
        return (
          <QuizExperienceStep
            selected={formData.journalExperience}
            onSelect={updateExperience}
            onAdvance={goNext}
          />
        );
      case "quiz_timing":
        return (
          <QuizTimingStep
            selected={formData.stressTiming}
            onSelect={updateTiming}
            onAdvance={goNext}
          />
        );
      case "daily_goal":
        return (
          <DailyGoalStep
            selected={formData.dailyGoal}
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
        return <BuildingJourneyStep onComplete={goNext} />;
      case "plan_reveal":
        return <PlanRevealStep planName={derivedPlanName} />;
      case "mood_check_lesson":
        return (
          <MoodCheckLessonStep
            selected={formData.selectedFeeling}
            onSelect={updateFeeling}
          />
        );
      case "ai_insight":
        return (
          <AIInsightStep
            feeling={formData.selectedFeeling}
            timing={formData.stressTiming}
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
        return <JourneyMapStep planName={derivedPlanName} />;
      case "letter_from_future":
        return (
          <LetterFromFutureStep
            dailyGoal={formData.dailyGoal}
            timing={formData.stressTiming}
          />
        );
      case "soft_paywall":
        return (
          <SoftPaywallStep
            selectedTier={formData.selectedPricingTier}
            onSelectTier={updatePricingTier}
            onStartTrial={handlePaywallTrial}
            onContinueFree={handlePaywallFree}
          />
        );
      case "welcome_to_happy":
        return (
          <WelcomeToHappyStep
            planName={derivedPlanName}
            dailyGoal={formData.dailyGoal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Animated.View style={[{ flex: 1 }, backgroundAnimatedStyle]}>
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <Animated.View
              style={backgroundAnimatedStyle}
              className="h-28 justify-end pb-3"
            >
              <View className="flex-row items-center px-5">
                {showBackButton ? (
                  <TouchableOpacity
                    onPress={handleBack}
                    activeOpacity={0.8}
                    className="h-10 w-10 items-center justify-center rounded-full bg-sage-50"
                    accessibilityLabel="Go back"
                    accessibilityRole="button"
                  >
                    <HugeiconsIcon
                      icon={ArrowLeft02Icon}
                      size={20}
                      color="#4A5A4A"
                    />
                  </TouchableOpacity>
                ) : (
                  <View className="h-10 w-10" />
                )}
                <View className="flex-1 px-3">
                  <StageProgressBar currentStage={currentStage} />
                </View>
                <View className="h-10 w-10" />
              </View>
            </Animated.View>
          ),
        }}
      />

      <Animated.View style={[{ flex: 1 }, stepContainerStyle]}>
        {renderStep()}
      </Animated.View>

      {showContinueButton && (
        <Animated.View
          style={backgroundAnimatedStyle}
          className="px-6 pb-8 pt-4"
        >
          <TactileButton
            label={
              loading ? "Setting up..." : currentStepConfig.continueButtonLabel
            }
            onPress={handleContinue}
            disabled={!canContinue || loading}
          />
          {currentStepConfig.canSkip && (
            <TactileButton
              label="Skip for now"
              onPress={() => {
                analytics.trackStepSkipped(currentStep);
                goNext();
              }}
              variant="secondary"
            />
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default React.memo(OnboardingScreen);
