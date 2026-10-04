import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useOnboardingFlow } from "./hooks/useOnboardingFlow";
import { useOnboardingAnalytics } from "./hooks/useOnboardingAnalytics";
import { useOnboardingTransitions } from "./hooks/useOnboardingTransitions";
import { useCompleteOnboarding } from "@/hooks/data/useCompleteOnboarding";
import { useRevenueCat } from "@/src/context/RevenueCatProvider";
import { ONBOARDING_STEPS } from "./constants";
import { ScreenLayout } from "@/src/components/ui/ScreenLayout";
import { updateUserStreak } from "@/src/lib/api/mentalHealthJourneyApi";
import { XPActionType } from "@/src/types/xp";
import { useXP } from "@/src/context/XPContext";
import { SymbolImage } from "@/src/components/symbol-image";
import TactileButton from "./components/TactileButton";
import { OnboardingHeader } from "./components/OnboardingHeader";
import { OnboardingStepRenderer } from "./components/OnboardingStepRenderer";
import { buildReminderConfig } from "./utils/reminderConfig";
import { useGetCourseCatalogQuery } from "@/src/domains/journey/data/journeyApi";
import { resolveCourseForMotivation } from "./utils/courseResolver";
import { setActiveCourse } from "@/src/domains/journey/state/journeySlice";
import { useAppDispatch } from "@/src/store/hooks";
import { useAtomValue } from "jotai";
import { cfgAtom } from "@/src/components/notifications/store";
import { handleNotificationPermissionOnContinue } from "./utils/onboardingNotifications";
import { useAuth } from "@/src/context/AuthContext";
import { useTranslation } from "react-i18next";

interface OnboardingScreenProps {
  onComplete: (skipped?: boolean) => Promise<void>;
}

const WELCOME_CTA_REVEAL_DELAY_MS = 520;
const WELCOME_CTA_HANDOFF_DELAY_MS = 110;
const STEP_CTA_REVEAL_DURATION_MS = 180;
const STEP_CTA_REVEAL_OFFSET = 6;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { width: screenWidth } = useWindowDimensions();
  const analytics = useOnboardingAnalytics();
  const { markCompleted } = useCompleteOnboarding();
  const { presentPaywall } = useRevenueCat();
  const { user } = useAuth();
  const { t } = useTranslation("onboarding");
  const remindersCfg = useAtomValue(cfgAtom);
  const [loading, setLoading] = React.useState(false);
  const [isStepActionReady, setIsStepActionReady] = React.useState(false);
  const xp = useXP();
  const dispatch = useAppDispatch();

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
    updateDailyGoal,
    updatePactSigned,
    updateFeeling,
    updateNotificationTime,
    updatePricingTier,
    updateTrialStarted,
  } = useOnboardingFlow();

  // ponytail: query catalog and resolve course matching user motivation
  const { data: catalogCourses = [] } = useGetCourseCatalogQuery();
  const onboardingCourseId = useMemo(
    () => resolveCourseForMotivation(formData.motivation, catalogCourses),
    [formData.motivation, catalogCourses],
  );

  // Sync active course to Redux when course is resolved
  useEffect(() => {
    if (onboardingCourseId) {
      dispatch(setActiveCourse(onboardingCourseId));
    }
  }, [dispatch, onboardingCourseId]);

  const currentStepConfig = ONBOARDING_STEPS[currentStepIndex];
  const initialBackgroundColor = ONBOARDING_STEPS[0].backgroundColor;
  const canContinue = currentStepConfig.isContinueEnabled?.(formData) ?? true;
  const showContinueButton = currentStepConfig.showContinueButton;

  const {
    containerBackgroundColor,
    transitionOverlayColor,
    backgroundOverlayStyle,
    stepContainerStyle,
  } = useOnboardingTransitions(
    currentStep,
    currentStepIndex,
    currentStepConfig,
    screenWidth,
    analytics,
    initialBackgroundColor,
  );

  const footerOpacity = useSharedValue(
    currentStep === "welcome" ? 0 : showContinueButton ? 1 : 0,
  );
  const footerTranslateY = useSharedValue(currentStep === "welcome" ? 12 : 0);

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
    transform: [{ translateY: footerTranslateY.value }],
  }));

  useEffect(() => {
    setIsStepActionReady(false);
    footerOpacity.value = 0;
    footerTranslateY.value = STEP_CTA_REVEAL_OFFSET;
    if (!showContinueButton) return;

    const revealFooter = () => {
      setIsStepActionReady(true);
      footerOpacity.value = withTiming(1, { duration: STEP_CTA_REVEAL_DURATION_MS, easing: Easing.out(Easing.cubic) });
      footerTranslateY.value = withTiming(0, { duration: STEP_CTA_REVEAL_DURATION_MS, easing: Easing.out(Easing.cubic) });
    };

    if (currentStep !== "welcome") {
      revealFooter();
      return;
    }

    const timer = setTimeout(revealFooter, WELCOME_CTA_REVEAL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [currentStep, footerOpacity, footerTranslateY, showContinueButton]);

  const handleContinue = useCallback(
    async (skipped: boolean = false) => {
      if (!isStepActionReady || loading) return;

      analytics.trackStepCompleted(currentStep, currentStepIndex);

      if (currentStep === "notification_permission" && !skipped) {
        await handleNotificationPermissionOnContinue(user?.id, remindersCfg);
      }

      if (isLastStep) {
        try {
          setLoading(true);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          // ponytail: save real configured reminders from onboarding, fallback to motivation time
          const finalCfg =
            Object.keys(remindersCfg).length > 0
              ? remindersCfg
              : buildReminderConfig(formData.notificationTime);
          const hasAnyEnabled = Object.values(finalCfg).some((c) => c.enabled);

          await markCompleted({
            name: "",
            reasons: formData.motivation ? [formData.motivation] : [],
            cfg: finalCfg,
            reminderEnabled: hasAnyEnabled,
            motivation: formData.motivation,
          });

          await updateUserStreak();
          await xp?.awardXP(XPActionType.EXERCISE_COMPLETE, {
            customAmount: 15,
            customDescription: t("xp_first_step"),
          });

          await onComplete(skipped);
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
    },
    [
      isStepActionReady,
      loading,
      analytics,
      currentStep,
      currentStepIndex,
      isLastStep,
      markCompleted,
      formData.motivation,
      formData.notificationTime,
      xp,
      onComplete,
      goNext,
      user?.id,
      remindersCfg,
      t,
    ],
  );

  const handleBack = useCallback(() => {
    Haptics.selectionAsync();
    goBack();
  }, [goBack]);

  const handlePactCommit = useCallback(() => {
    updatePactSigned();
    goNext();
  }, [updatePactSigned, goNext]);

  const isContinueDisabled =
    !canContinue ||
    loading ||
    (currentStep === "welcome" && !isStepActionReady);

  return (
    <ScreenLayout style={{ backgroundColor: containerBackgroundColor }}>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: transitionOverlayColor },
          backgroundOverlayStyle,
        ]}
      />
      <OnboardingHeader
        stepName={currentStep}
        backgroundColor={containerBackgroundColor}
        onBack={handleBack}
      />

      <Animated.View style={[{ flex: 1 }, stepContainerStyle]}>
        <OnboardingStepRenderer
          currentStep={currentStep}
          formData={formData}
          derivedPlanName={derivedPlanName}
          onboardingCourseId={onboardingCourseId}
          goNext={goNext}
          updateMotivation={updateMotivation}
          updateStressLevel={updateStressLevel}
          updateDailyGoal={updateDailyGoal}
          handlePactCommit={handlePactCommit}
          updateNotificationTime={updateNotificationTime}
          updateTrialStarted={updateTrialStarted}
          handleContinue={handleContinue}
        />
      </Animated.View>

      {showContinueButton && (
        <ScreenLayout.Footer
          pointerEvents="box-none"
          variant={currentStepConfig.transparentFooter ? "transparent" : "solid"}
          style={!currentStepConfig.transparentFooter ? { backgroundColor: containerBackgroundColor } : undefined}
        >
          <Animated.View
            style={footerAnimatedStyle}
            className="w-full gap-3"
          >
            <TactileButton
              label={loading ? t("buttons.setting_up") : t(currentStep === "welcome" ? "buttons.lets_begin" : currentStep === "plan_reveal" ? "buttons.start_my_journey" : currentStep === "notification_permission" ? "buttons.set_reminders" : currentStep === "welcome_to_happy" ? "buttons.save_my_progress" : "buttons.continue")}
              onPress={() => handleContinue(false)}
              disabled={isContinueDisabled}
              rightIcon={currentStepConfig.name === "welcome" ? <SymbolImage name="arrow.up" size={18} tintColor="#FFFFFF" /> : undefined}
            />
            {currentStepConfig.canSkip && (
              <TactileButton
                label={t(currentStep === "welcome_to_happy" ? "buttons.maybe_later" : "buttons.skip_for_now")}
                onPress={() => {
                  analytics.trackStepSkipped(currentStep);
                  if (isLastStep) handleContinue(true);
                  else goNext();
                }}
                variant="secondary"
              />
            )}
          </Animated.View>
        </ScreenLayout.Footer>
      )}
    </ScreenLayout>
  );
};

export default React.memo(OnboardingScreen);
