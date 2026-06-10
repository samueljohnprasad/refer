import React, { useCallback, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Stack } from "expo-router";
import { HugeiconsIcon } from "@hugeicons/react-native";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { GlassView } from "expo-glass-effect";

import { useOnboardingFlow } from "./hooks/useOnboardingFlow";
import { useOnboardingAnalytics } from "./hooks/useOnboardingAnalytics";
import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { ONBOARDING_STEPS } from "./constants";

import { LessonHeader } from "@/src/components/ui/LessonHeader";
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
import JourneyStepPreviewStep from "./steps/JourneyStepPreviewStep";
import MoodCheckLessonStep from "./steps/MoodCheckLessonStep";
import AIInsightStep from "./steps/AIInsightStep";
import LessonCompleteStep from "./steps/LessonCompleteStep";
import CbtStepPreviewStep from "./steps/CbtStepPreviewStep";
import NotificationPermissionStep from "./steps/NotificationPermissionStep";
import JourneyMapStep from "./steps/JourneyMapStep";
import LetterFromFutureStep from "./steps/LetterFromFutureStep";
import SoftPaywallStep from "./steps/SoftPaywallStep";
import WelcomeToHappyStep from "./steps/WelcomeToHappyStep";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SafeHeaderWrapper } from "@/src/components/ui/SafeHeaderWrapper";

interface OnboardingScreenProps {
  onComplete: () => Promise<void>;
}

interface HeaderConfig {
  visible: boolean;
  showBackButton?: boolean;
  backButtonVariant?: "arrow" | "close";
  progress?: number;
  progressFillColor?: string;
  progressTrackColor?: string;
  trailingLabel?: string;
  trailingLabelColor?: string;
  trailingLabelTracking?: number;
  trailingLabelAlignment?: "center" | "end";
}

const WELCOME_CTA_REVEAL_DELAY_MS = 520;
const WELCOME_CTA_HANDOFF_DELAY_MS = 110;
const STEP_CTA_REVEAL_DURATION_MS = 180;
const STEP_CTA_REVEAL_OFFSET = 6;
const STEP_ENTER_DURATION_MS = 200;
const STEP_ENTER_TRAVEL_PX = 18;
const LESSON_PROGRESS_FILL = "#5f7f58";
const HEADER_ICON_COLOR = "#4F604F";

const getHeaderConfig = (stepName: string): HeaderConfig => {
  switch (stepName) {
    case "welcome":
    case "building_journey":
    case "lesson_complete":
    case "journey_step_preview":
    case "cbt_step_preview":
    case "journey_map":
    case "soft_paywall":
    case "welcome_to_happy":
      return { visible: false };
    case "mascot_greeting":
      return { visible: true, showBackButton: true, progress: 0.08 };
    case "quiz_motivation":
      return { visible: true, showBackButton: true, progress: 0.16 };
    case "quiz_stress_level":
      return { visible: true, showBackButton: true, progress: 0.24 };
    case "quiz_experience":
      return { visible: true, showBackButton: true, progress: 0.32 };
    case "quiz_timing":
      return { visible: true, showBackButton: true, progress: 0.42 };
    case "daily_goal":
      return { visible: true, showBackButton: true, progress: 0.54 };
    case "pact_signing":
      return { visible: true, showBackButton: true, progress: 0.63 };
    case "plan_reveal":
      return {
        visible: true,
        trailingLabel: "YOUR PLAN",
        trailingLabelColor: "#7D8D7B",
        trailingLabelTracking: 0.6,
        trailingLabelAlignment: "end",
      };
    case "mood_check_lesson":
      return {
        visible: true,
        showBackButton: true,
        backButtonVariant: "close",
        progress: 0.25,
        progressFillColor: LESSON_PROGRESS_FILL,
        trailingLabel: "+10 XP",
        trailingLabelColor: LESSON_PROGRESS_FILL,
      };
    case "ai_insight":
      return {
        visible: true,
        progress: 0.5,
        progressFillColor: LESSON_PROGRESS_FILL,
        trailingLabel: "+10 XP",
        trailingLabelColor: LESSON_PROGRESS_FILL,
      };
    case "notification_permission":
      return { visible: true, progress: 1 };
    case "letter_from_future":
      return {
        visible: true,
        showBackButton: true,
        trailingLabel: "A QUIET MOMENT",
        trailingLabelColor: "#7D8D7B",
        trailingLabelTracking: 0.6,
        trailingLabelAlignment: "center",
      };
    default:
      return { visible: false };
  }
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { width: screenWidth } = useWindowDimensions();
  const analytics = useOnboardingAnalytics();
  const { markCompleted } = useCompleteOnboarding();
  const { presentPaywall } = useRevenueCat();
  const [loading, setLoading] = React.useState(false);
  const [isStepActionReady, setIsStepActionReady] = React.useState(false);

  const {
    currentStepIndex,
    currentStep,
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
  const headerConfig = getHeaderConfig(currentStep);
  const initialBackgroundColor = ONBOARDING_STEPS[0].backgroundColor;
  const canContinue = currentStepConfig.isContinueEnabled?.(formData) ?? true;
  const showContinueButton = currentStepConfig.showContinueButton;
  const slideX = useSharedValue(0);
  const slideOpacity = useSharedValue(1);
  const backgroundOverlayOpacity = useSharedValue(0);
  const footerOpacity = useSharedValue(
    currentStep === "welcome" ? 0 : showContinueButton ? 1 : 0,
  );

  const footerTranslateY = useSharedValue(currentStep === "welcome" ? 12 : 0);
  const hasAnimatedStepRef = useRef(false);
  const currentBackgroundColorRef = useRef(initialBackgroundColor);
  const prevStepRef = useRef(currentStepIndex);
  const direction = useRef<"forward" | "backward">("forward");
  const [containerBackgroundColor, setContainerBackgroundColor] =
    React.useState(initialBackgroundColor);
  const [transitionOverlayColor, setTransitionOverlayColor] = React.useState(
    initialBackgroundColor,
  );

  const backgroundOverlayStyle = useAnimatedStyle(() => ({
    opacity: backgroundOverlayOpacity.value,
  }));

  const stepContainerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
    opacity: slideOpacity.value,
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
    transform: [{ translateY: footerTranslateY.value }],
  }));

  useEffect(() => {
    const nextBackgroundColor = currentStepConfig.backgroundColor;

    if (!hasAnimatedStepRef.current) {
      hasAnimatedStepRef.current = true;
      prevStepRef.current = currentStepIndex;
      currentBackgroundColorRef.current = nextBackgroundColor;
      setContainerBackgroundColor(nextBackgroundColor);
      setTransitionOverlayColor(nextBackgroundColor);
      backgroundOverlayOpacity.value = 0;
      slideX.value = 0;
      slideOpacity.value = 1;
      analytics.trackStepViewed(currentStep, currentStepIndex);
      return;
    }

    const isForward = currentStepIndex > prevStepRef.current;
    direction.current = isForward ? "forward" : "backward";
    prevStepRef.current = currentStepIndex;

    const previousBackgroundColor = currentBackgroundColorRef.current;
    if (nextBackgroundColor !== previousBackgroundColor) {
      currentBackgroundColorRef.current = nextBackgroundColor;
      setTransitionOverlayColor(previousBackgroundColor);
      setContainerBackgroundColor(nextBackgroundColor);
      backgroundOverlayOpacity.value = 1;
      backgroundOverlayOpacity.value = withTiming(0, {
        duration: 220,
        easing: Easing.out(Easing.cubic),
      });
    }

    // Slide transition: enter from right (forward) or left (backward)
    const travelDistance = Math.min(screenWidth * 0.12, STEP_ENTER_TRAVEL_PX);
    const enterFrom = isForward ? travelDistance : -travelDistance;
    slideX.value = enterFrom;
    slideOpacity.value = 0;
    slideX.value = withTiming(0, {
      duration: STEP_ENTER_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });
    slideOpacity.value = withTiming(1, {
      duration: STEP_ENTER_DURATION_MS,
      easing: Easing.out(Easing.cubic),
    });

    analytics.trackStepViewed(currentStep, currentStepIndex);
  }, [currentStepIndex]);

  useEffect(() => {
    if (!showContinueButton) {
      setIsStepActionReady(false);
      footerOpacity.value = 0;
      footerTranslateY.value = STEP_CTA_REVEAL_OFFSET;
      return;
    }

    setIsStepActionReady(false);
    footerOpacity.value = 0;
    footerTranslateY.value = STEP_CTA_REVEAL_OFFSET;

    const revealFooter = () => {
      setIsStepActionReady(true);
      footerOpacity.value = withTiming(1, {
        duration: STEP_CTA_REVEAL_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
      footerTranslateY.value = withTiming(0, {
        duration: STEP_CTA_REVEAL_DURATION_MS,
        easing: Easing.out(Easing.cubic),
      });
    };

    if (currentStep !== "welcome") {
      revealFooter();
      return;
    }

    const timer = setTimeout(revealFooter, WELCOME_CTA_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [currentStep, showContinueButton]);

  const handleContinue = useCallback(async () => {
    if (!isStepActionReady || loading) return;

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

    if (currentStep === "welcome") {
      await new Promise<void>((resolve) => {
        setTimeout(resolve, WELCOME_CTA_HANDOFF_DELAY_MS);
      });
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
    isStepActionReady,
    loading,
  ]);

  const handleBack = useCallback(() => {
    Haptics.selectionAsync();
    goBack();
  }, [goBack]);

  const handlePactCommit = useCallback(() => {
    updatePactSigned();
    setTimeout(goNext, 1200);
  }, [updatePactSigned, goNext]);

  const handlePaywallTrial = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const purchased = await presentPaywall();
      if (!purchased) return;

      updateTrialStarted(true);
      goNext();
    } finally {
      setLoading(false);
    }
  }, [goNext, loading, presentPaywall, updateTrialStarted]);

  const handlePaywallFree = useCallback(() => {
    updateTrialStarted(false);
    goNext();
  }, [updateTrialStarted, goNext]);

  const isContinueDisabled =
    !canContinue ||
    loading ||
    (currentStep === "welcome" && !isStepActionReady);

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
        return (
          <PlanRevealStep
            planName={derivedPlanName}
            motivation={formData.motivation}
          />
        );
      case "journey_step_preview":
        return <JourneyStepPreviewStep />;
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
      case "cbt_step_preview":
        return <CbtStepPreviewStep />;
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
    <View style={{ flex: 1, backgroundColor: containerBackgroundColor }}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: transitionOverlayColor },
          backgroundOverlayStyle,
        ]}
      />
      <Stack.Screen
        options={{
          headerShown: headerConfig.visible,
          headerShadowVisible: false,
          headerTransparent: true,
          header: () => (
            <SafeAreaView
              edges={["top"]}
              className="justify-end pb-4"
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "rgba(255, 255, 255, 0.1)",
                elevation: 0,
                shadowOpacity: 0,
                shadowRadius: 0,
                overflow: "hidden",
              }}
            >
              <GlassView
                glassEffectStyle="clear"
                style={StyleSheet.absoluteFill}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: containerBackgroundColor, opacity: 0.85 },
                ]}
              />
              <LessonHeader
                onClose={headerConfig.showBackButton ? handleBack : undefined}
                backButtonVariant={
                  headerConfig.backButtonVariant === "close"
                    ? "close-icon"
                    : "arrow"
                }
                progress={headerConfig.progress}
                trailingLabel={headerConfig.trailingLabel}
                iconColor={HEADER_ICON_COLOR}
                trailingLabelColor={
                  headerConfig.trailingLabelColor ?? "#7D8D7B"
                }
                progressFillColor={headerConfig.progressFillColor}
                progressTrackColor={headerConfig.progressTrackColor}
              />
            </SafeAreaView>
          ),
        }}
      />

      <Animated.View style={[{ flex: 1 }, stepContainerStyle]}>
        {renderStep()}
      </Animated.View>

      {showContinueButton && (
        <Animated.View
          style={[
            footerAnimatedStyle,
            currentStep === "welcome" ? styles.welcomeFooter : null,
          ]}
          className="px-6 pb-8 pt-4"
        >
          <TactileButton
            label={
              loading ? "Setting up..." : currentStepConfig.continueButtonLabel
            }
            onPress={handleContinue}
            disabled={isContinueDisabled}
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
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default React.memo(OnboardingScreen);
